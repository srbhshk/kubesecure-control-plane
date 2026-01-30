import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
  role: string | null;
  orgId: string | null;
  setAuth: (role: string, orgId: string) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      role: null,
      orgId: null,
      setAuth: (role, orgId) => set({ role, orgId }),
      clearAuth: () => set({ role: null, orgId: null }),
    }),
    {
      name: "kubesecure-auth",
    }
  )
);
