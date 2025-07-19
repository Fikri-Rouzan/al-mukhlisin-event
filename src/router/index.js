import { createRouter, createWebHistory } from "vue-router";
import { supabase } from "../lib/supabase";

import publicRoutes from "./publicRoutes";
import adminRoutes from "./adminRoutes";

const router = createRouter({
  history: createWebHistory(),
  routes: [publicRoutes, adminRoutes],

  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0, behavior: "smooth" };
    }
  },
});

router.beforeEach(async (to, from, next) => {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const user = session?.user;
  let userRole = null;

  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();
    userRole = profile?.role;
  }

  const isUserAdmin = userRole === "admin";
  const isGoingToAdminArea = to.path.startsWith("/admin");

  if (isUserAdmin && !isGoingToAdminArea) {
    return next({ name: "AdminResidents" });
  }

  if (to.meta.requiresGuest && user) {
    return next({ name: isUserAdmin ? "AdminResidents" : "Home" });
  }

  if (to.meta.requiresAuth) {
    if (!user) {
      return next({ path: "/login", query: { redirected_from: to.fullPath } });
    }
    if (to.meta.role && to.meta.role !== userRole) {
      return next({ name: isUserAdmin ? "AdminResidents" : "Home" });
    }
  }

  next();
});

export default router;
