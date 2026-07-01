import { create } from "zustand";
import { authApi } from "../lib/supabase/authApi";

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  initialize: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  user: null,
  isLoading: true,

  initialize: async () => {
    try {
      const session = await authApi.getSession();
      if (session) {
        const user = await authApi.getCurrentUser();
        if (user) {
          set({ isAuthenticated: true, user, isLoading: false });
          return;
        }
      }
    } catch {
      // Not authenticated
    }
    set({ isLoading: false });
  },

  login: async (email, password) => {
    const user = await authApi.login(email, password);
    set({ isAuthenticated: true, user });
  },

  register: async (name, email, password) => {
    const result = await authApi.register(name, email, password);
    if (!result.requiresEmailConfirmation) {
      set({ isAuthenticated: true, user: { id: result.id, name, email } });
    }
  },

  logout: async () => {
    await authApi.logout();
    set({ isAuthenticated: false, user: null });
  },
}));
