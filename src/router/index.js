import { createRouter, createWebHistory } from "vue-router";
import LoginView from "@/views/LoginView.vue";
import DashboardView from "@/views/dashboard/Index.vue";
import DashboardSettingsView from "@/views/dashboard/Settings.vue";
import DashboardUsersView from "@/views/dashboard/Users.vue";
import DashboardStaggingView from "@/views/dashboard/Stagging.vue";
import NotFoundView from "@/views/errors/NotFoundView.vue";
import ForbiddenView from "@/views/errors/ForbiddenView.vue";
import ScanView from "@/views/ScanView.vue";
import AwbView from "@/views/AwbView.vue";
import { roleGuard } from "@/middleware/role";
import UserSettings from "@/views/UserSettings.vue";

const routes = [
  {
    path: "/",
    name: "login",
    component: LoginView,
  },
  {
    path: "/dashboard",
    name: "dashboard",
    component: DashboardView,
    meta: { requiresAuth: true },
  },
  {
    path: "/settings",
    name: "settings",
    component: UserSettings,
    meta: { requiresAuth: true },
  },
  {
    path: "/dashboard/settings",
    name: "dashboard-settings",
    component: DashboardSettingsView,
    meta: { requiresAuth: true },
  },
  {
    path: "/dashboard/users",
    name: "dashboard-users",
    component: DashboardUsersView,
    meta: { requiresAuth: true },
    beforeEnter: roleGuard(["owner", "developer"]),
  },
  {
    path: "/dashboard/stagging",
    name: "dashboard-stagging",
    component: DashboardStaggingView,
    meta: { requiresAuth: true },
    beforeEnter: roleGuard(["owner", "developer"]),
  },
  {
    path: "/s/:slug",
    name: "scan",
    component: ScanView,
    props: true,
  },
  {
    path: "/d/:slug",
    name: "data-awb",
    component: AwbView,
    props: true,
  },

  {
    path: "/403",
    name: "Forbidden",
    component: ForbiddenView,
  },
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: NotFoundView,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// auth guard
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  // Jika route membutuhkan auth
  if (to.meta.requiresAuth && !token) {
    return next("/"); // redirect ke login
  } else if (to.path === "/" && token) {
    return next("/dashboard"); // redirect ke dashboard
  }

  next();
});

export default router;
