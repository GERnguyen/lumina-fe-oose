import { create } from "zustand";
import type { User } from "../types";
import env from "../env";

const USER_STORAGE_KEY = `${env.accessToken}:user`;
const storedToken =
  typeof window !== "undefined" ? localStorage.getItem(env.accessToken) : null;
const storedUser = (() => {
  if (typeof window === "undefined") {
    return null;
  }

  const value = localStorage.getItem(USER_STORAGE_KEY);
  if (!value) {
    return null;
  }

  try {
    return JSON.parse(value) as User;
  } catch {
    return null;
  }
})();

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
  recover: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: storedUser,
  token: storedToken,
  isAuthenticated: Boolean(storedToken),

  setAuth: (user: User, token: string) => {
    localStorage.setItem(env.accessToken, token);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    set({
      user,
      token,
      isAuthenticated: true,
    });
  },

  logout: () => {
    localStorage.removeItem(env.accessToken);
    localStorage.removeItem(USER_STORAGE_KEY);
    set({
      user: null,
      token: null,
      isAuthenticated: false,
    });
  },

  recover: () => {
    const token = localStorage.getItem(env.accessToken);
    const user = (() => {
      const value = localStorage.getItem(USER_STORAGE_KEY);
      if (!value) {
        return null;
      }

      try {
        return JSON.parse(value) as User;
      } catch {
        return null;
      }
    })();

    if (token) {
      set({
        user,
        token,
        isAuthenticated: true,
      });
      return;
    }

    set({
      token: null,
      isAuthenticated: false,
    });
  },
}));
