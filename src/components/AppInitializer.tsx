import { useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import env from "../env";
import authService from "../services/auth.service";

/**
 * App Initializer
 * Khôi phục auth state từ localStorage khi app load
 */
export function AppInitializer() {
  const { recover, setAuth, token } = useAuth();

  useEffect(() => {
    recover();

    const storedToken = localStorage.getItem(env.accessToken);
    const currentToken = storedToken ?? token;

    if (!currentToken) {
      return;
    }

    authService
      .getProfile()
      .then((user) => {
        setAuth(user, currentToken);
      })
      .catch(() => {
        // 401 is handled by the axios interceptor; other errors are ignored here.
      });
  }, [recover, setAuth, token]);

  return null;
}
