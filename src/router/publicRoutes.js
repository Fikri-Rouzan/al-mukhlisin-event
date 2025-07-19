const publicRoutes = {
  path: "/",
  component: () => import("../layouts/PublicLayout.vue"),
  children: [
    {
      path: "",
      name: "Home",
      component: () => import("../views/HomeView.vue"),
    },
    {
      path: "login",
      name: "Login",
      component: () => import("../views/auth/LoginView.vue"),
      meta: { requiresGuest: true },
    },
    {
      path: "register",
      name: "Register",
      component: () => import("../views/auth/RegisterView.vue"),
      meta: { requiresGuest: true },
    },
    {
      path: "profile",
      name: "Profile",
      component: () => import("../views/resident/ProfileView.vue"),
      meta: { requiresAuth: true, role: "resident" },
    },
    {
      path: "profile/edit",
      name: "ProfileEdit",
      component: () => import("../views/resident/ProfileEditView.vue"),
      meta: { requiresAuth: true, role: "resident" },
    },
    {
      path: "events",
      name: "EventsList",
      component: () => import("../views/resident/EventsListView.vue"),
      meta: { requiresAuth: true },
    },
    {
      path: "events/:id",
      name: "EventDetailPublic",
      component: () => import("../views/resident/EventDetailPublicView.vue"),
      meta: { requiresAuth: true },
    },
  ],
};

export default publicRoutes;
