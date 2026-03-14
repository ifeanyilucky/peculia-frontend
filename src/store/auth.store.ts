import { create } from "zustand";
import {
  persist,
  createJSONStorage,
  subscribeWithSelector,
} from "zustand/middleware";

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: "client" | "provider" | "admin";
  avatar?: string;
  phone?: string;
  isDiscoverable?: boolean;
  slug?: string;
  onboardingStep?: number;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  _hasHydrated: boolean;
  setAuth: (user: User) => void;
  updateUser: (user: Partial<User>) => void;
  clearAuth: () => void;
  setHasHydrated: (state: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  subscribeWithSelector(
    persist(
      (set) => ({
        user: null,
        isAuthenticated: false,
        _hasHydrated: false,
        setAuth: (user) =>
          set({
            user,
            isAuthenticated: true,
          }),
        updateUser: (userData) =>
          set((state) => ({
            user: state.user ? { ...state.user, ...userData } : null,
          })),
        clearAuth: () =>
          set({
            user: null,
            isAuthenticated: false,
          }),
        setHasHydrated: (state: boolean) => set({ _hasHydrated: state }),
      }),
      {
        name: "glamyad-auth-storage",
        storage: createJSONStorage(() => localStorage),
        partialize: (state) => ({
          user: state.user,
          isAuthenticated: state.isAuthenticated,
        }),
        onRehydrateStorage: () => (state) => {
          state?.setHasHydrated(true);
        },
      },
    ),
  ),
);
