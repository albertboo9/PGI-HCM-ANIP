import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Satisfaction } from '../types';
import { useDataStore } from '../data/dataStore';

interface SatisfactionState {
  satisfactions: Satisfaction[];

  getAll: () => Satisfaction[];
  getByCentre: (centreId: string) => Satisfaction[];
  getByAgent: (agentId: string) => Satisfaction[];
  create: (data: Omit<Satisfaction, 'id' | 'date'>) => Satisfaction;

  getMoyenne: (centreId?: string) => number;
  getNPS: (centreId?: string) => number;
  getRepartitionNotes: (centreId?: string) => { 1: number; 2: number; 3: number; 4: number; 5: number };
  getStats: () => { moyenne: number; nps: number; total: number };
}

export const useSatisfactionStore = create<SatisfactionState>()(
  persist(
    (set, get) => ({
      satisfactions: [],

      getAll: () => {
        const s = get().satisfactions;
        if (s.length === 0) { const d = useDataStore.getState().getCollection('satisfactions'); set({ satisfactions: d }); return d; }
        return s;
      },

      getByCentre: (centreId) => get().getAll().filter(s => s.centreId === centreId),
      getByAgent: (agentId) => get().getAll().filter(s => s.agentId === agentId),

      create: (data) => {
        const s: Satisfaction = { id: `sat-${Date.now()}`, ...data, date: new Date().toISOString().split('T')[0] };
        set(state => ({ satisfactions: [...state.satisfactions, s] }));
        return s;
      },

      getMoyenne: (centreId) => {
        const list = centreId ? get().getByCentre(centreId) : get().getAll();
        return list.length ? Math.round(list.reduce((s, e) => s + e.note, 0) / list.length * 10) / 10 : 0;
      },

      getNPS: (centreId) => {
        const list = centreId ? get().getByCentre(centreId) : get().getAll();
        if (list.length === 0) return 0;
        const promoteurs = list.filter(s => s.note >= 4).length;
        const detracteurs = list.filter(s => s.note <= 2).length;
        return Math.round(((promoteurs - detracteurs) / list.length) * 100);
      },

      getRepartitionNotes: (centreId) => {
        const list = centreId ? get().getByCentre(centreId) : get().getAll();
        const rep = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
        list.forEach(s => { if (s.note >= 1 && s.note <= 5) rep[s.note as 1|2|3|4|5]++; });
        return rep;
      },

      getStats: () => {
        const all = get().getAll();
        return { moyenne: get().getMoyenne(), nps: get().getNPS(), total: all.length };
      },
    }),
    { name: 'aqip-satisfactions', partialize: (state) => ({ satisfactions: state.satisfactions }) }
  )
);