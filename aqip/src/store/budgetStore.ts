import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Budget, BudgetRepartition, ROIData } from '../types';
import { useDataStore } from '../data/dataStore';

interface BudgetState {
  budget: Budget | null;
  getBudget: () => Budget;
  updateBudget: (data: Partial<Budget>) => void;
  getConsommation: () => number;
  getRestantPourcentage: () => number;
  getTopROI: (limit?: number) => ROIData[];
  getDepensesParCategorie: () => BudgetRepartition[];
}

export const useBudgetStore = create<BudgetState>()(
  persist(
    (set, get) => ({
      budget: null,

      getBudget: () => {
        const b = get().budget;
        if (!b) {
          const data = useDataStore.getState().getCollection('budget');
          set({ budget: data as Budget });
          return data as Budget;
        }
        return b;
      },

      updateBudget: (data) => {
        set(state => ({ budget: state.budget ? { ...state.budget, ...data } : null }));
      },

      getConsommation: () => {
        const b = get().getBudget();
        return b.totalAlloue > 0 ? Math.round((b.dejaEngage / b.totalAlloue) * 100) : 0;
      },

      getRestantPourcentage: () => {
        const b = get().getBudget();
        return b.totalAlloue > 0 ? Math.round((b.restant / b.totalAlloue) * 100) : 0;
      },

      getTopROI: (limit = 5) => {
        const b = get().getBudget();
        return [...(b.roiParFormation || [])].sort((a, b) => b.roi - a.roi).slice(0, limit);
      },

      getDepensesParCategorie: () => get().getBudget().repartition || [],
    }),
    { name: 'aqip-budget', partialize: (state) => ({ budget: state.budget }) }
  )
);