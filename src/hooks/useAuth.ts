import { useAuthStore } from "../stores/useAuthStore";

/**
 * Hook tiện lợi để sử dụng Auth Store
 * Cung cấp quyền truy cập vào user, token, isAuthenticated và các actions
 */
export function useAuth() {
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const setAuth = useAuthStore((state) => state.setAuth);
  const logout = useAuthStore((state) => state.logout);
  const recover = useAuthStore((state) => state.recover);

  return {
    user,
    token,
    isAuthenticated,
    setAuth,
    logout,
    recover,
  };
}
