import { useAuthStore } from "@/stores/auth";

export function roleGuard(allowedRoles) {
  return async (to, from, next) => {
    const authStore = useAuthStore();

    // 1. Kalau ada token tapi user belum ada → load
    if (authStore.token && !authStore.user) {
      try {
        await authStore.loadUserFromToken();
      } catch (e) {
        authStore.logout();
        return next("/login");
      }
    }

    // 2. Kalau masih belum authenticated
    if (!authStore.user) {
      return next("/login");
    }

    // 3. Role check
    if (!allowedRoles.includes(authStore.user.role)) {
      return next("/403");
    }

    next();
  };
}
