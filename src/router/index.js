import { createRouter, createWebHistory } from "vue-router";
import { supabase } from "../lib/supabase";

import PublicLayout from "../layouts/PublicLayout.vue";
import AdminLayout from "../layouts/AdminLayout.vue";

import HomeView from "../views/HomeView.vue";
import LoginView from "../views/auth/LoginView.vue";
import RegisterView from "../views/auth/RegisterView.vue";
import ProfileView from "../views/ProfileView.vue";
import ResidentDataView from "../views/admin/ResidentDataView.vue";
import CommitteeDataView from "../views/admin/CommitteeDataView.vue";
import CommitteeDetailView from "../views/admin/CommitteeDetailView.vue";
import SpeakersDataView from "../views/admin/SpeakersDataView.vue";
import SpeakersDetailView from "../views/admin/SpeakersDetailView.vue";
import EventsDataView from "../views/admin/EventsDataView.vue";
import EventDetailView from "../views/admin/EventDetailView.vue";
import EventsListView from "../views/EventsListView.vue";
import EventDetailPublicView from "../views/EventDetailPublicView.vue";

const routes = [
  {
    path: "/",
    component: PublicLayout,
    children: [
      { path: "", name: "Home", component: HomeView },
      {
        path: "login",
        name: "Login",
        component: LoginView,
        meta: { requiresGuest: true },
      },
      {
        path: "register",
        name: "Register",
        component: RegisterView,
        meta: { requiresGuest: true },
      },
      {
        path: "profile",
        name: "Profile",
        component: ProfileView,
        meta: { requiresAuth: true, role: "resident" },
      },
      {
        path: "events",
        name: "EventsList",
        component: EventsListView,
      },
      {
        path: "events/:id",
        name: "EventDetailPublic",
        component: EventDetailPublicView,
      },
    ],
  },
  {
    path: "/admin",
    component: AdminLayout,
    meta: { requiresAuth: true, role: "admin" },
    children: [
      {
        path: "residents",
        name: "AdminResidents",
        component: ResidentDataView,
      },
      {
        path: "committee",
        name: "AdminCommittee",
        component: CommitteeDataView,
      },
      {
        path: "committee/:id",
        name: "AdminCommitteeDetail",
        component: CommitteeDetailView,
      },
      {
        path: "speakers",
        name: "AdminSpeakers",
        component: SpeakersDataView,
      },
      {
        path: "speakers/:id",
        name: "AdminSpeakerDetail",
        component: SpeakersDetailView,
      },
      {
        path: "events",
        name: "AdminEvents",
        component: EventsDataView,
      },
      {
        path: "events/:id",
        name: "AdminEventDetail",
        component: EventDetailView,
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to, from, next) => {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const user = session?.user;

  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profile?.role === "admin" && !to.path.startsWith("/admin")) {
      return next("/admin/residents");
    }
  }

  if (to.meta.requiresGuest && user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();
    if (profile?.role === "admin") {
      return next("/admin/residents");
    }
    return next("/");
  }

  if (to.meta.requiresAuth) {
    if (!user) {
      return next("/login");
    }

    if (to.meta.role) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();
      if (profile?.role !== to.meta.role) {
        if (profile?.role === "admin") return next("/admin/residents");
        return next("/");
      }
    }
  }

  next();
});

export default router;
