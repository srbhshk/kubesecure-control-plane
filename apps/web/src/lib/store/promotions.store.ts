import { create } from "zustand";

interface Promotion {
  id: string;
  fromEnv: string;
  toEnv: string;
  status: "pending" | "approved" | "rejected" | "completed";
  createdAt: string;
}

interface PromotionsState {
  promotions: Promotion[];
  isLoading: boolean;
  setPromotions: (promotions: Promotion[]) => void;
  addPromotion: (promotion: Promotion) => void;
  updatePromotion: (id: string, updates: Partial<Promotion>) => void;
}

export const usePromotionsStore = create<PromotionsState>((set) => ({
  promotions: [],
  isLoading: false,
  setPromotions: (promotions) => set({ promotions }),
  addPromotion: (promotion) =>
    set((state) => ({ promotions: [promotion, ...state.promotions] })),
  updatePromotion: (id, updates) =>
    set((state) => ({
      promotions: state.promotions.map((p) =>
        p.id === id ? { ...p, ...updates } : p
      ),
    })),
}));
