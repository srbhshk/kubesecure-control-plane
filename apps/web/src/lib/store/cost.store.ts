import { create } from 'zustand';

interface CostData {
  id: string;
  environmentId: string;
  amount: number;
  currency: string;
  timestamp: string;
}

interface CostState {
  costs: CostData[];
  totalCost: number;
  setCosts: (costs: CostData[]) => void;
}

export const useCostStore = create<CostState>((set) => ({
  costs: [],
  totalCost: 0,
  setCosts: (costs) =>
    set({
      costs,
      totalCost: costs.reduce((acc, curr) => acc + curr.amount, 0),
    }),
}));
