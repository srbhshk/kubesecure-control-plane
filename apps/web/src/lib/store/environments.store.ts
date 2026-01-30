import { create } from "zustand";

interface Environment {
  id: string;
  name: string;
  criticality: "low" | "medium" | "high";
  clusterCount: number;
}

interface EnvironmentsState {
  environments: Environment[];
  isLoading: boolean;
  setEnvironments: (environments: Environment[]) => void;
  addEnvironment: (environment: Environment) => void;
}

export const useEnvironmentsStore = create<EnvironmentsState>((set) => ({
  environments: [],
  isLoading: false,
  setEnvironments: (environments) => set({ environments }),
  addEnvironment: (environment) =>
    set((state) => ({ environments: [...state.environments, environment] })),
}));
