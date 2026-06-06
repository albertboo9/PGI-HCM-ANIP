import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Centre, Departement } from '../types';
import { useDataStore } from '../data/dataStore';

interface CentreState {
  centres: Centre[];
  departements: Departement[];

  getAll: () => Centre[];
  getById: (id: string) => Centre | undefined;
  getByDepartement: (deptId: string) => Centre[];
  update: (id: string, data: Partial<Centre>) => void;

  getDepartements: () => Departement[];
  getDepartementById: (id: string) => Departement | undefined;

  getStats: () => { total: number; actifs: number; alerte: number; scoreMoyen: number };
  getClassement: () => (Centre & { score: number })[];
  getCentresAlertes: () => Centre[];
}

export const useCentreStore = create<CentreState>()(
  persist(
    (set, get) => ({
      centres: [],
      departements: [],

      getAll: () => {
        const c = get().centres;
        if (c.length === 0) {
          const data = useDataStore.getState().getCollection('centres');
          set({ centres: data });
          return data;
        }
        return c;
      },

      getById: (id) => get().centres.find(c => c.id === id),

      getByDepartement: (deptId) => get().centres.filter(c => c.departementId === deptId),

      update: (id, data) => {
        set(state => ({
          centres: state.centres.map(c => c.id === id ? { ...c, ...data } : c),
        }));
      },

      getDepartements: () => {
        const d = get().departements;
        if (d.length === 0) {
          const data = useDataStore.getState().getCollection('departements');
          set({ departements: data });
          return data;
        }
        return d;
      },

      getDepartementById: (id) => get().getDepartements().find(d => d.id === id),

      getStats: () => {
        const all = get().getAll();
        return {
          total: all.length,
          actifs: all.filter(c => c.statut === 'actif').length,
          alerte: all.filter(c => c.statut === 'alerte').length,
          scoreMoyen: Math.round(all.reduce((s, c) => s + (c.agentsCount || 0), 0) / all.length),
        };
      },

      getClassement: () => {
        const centres = get().getAll();
        return centres
          .map(c => ({
            ...c,
            score: (c.agentsCount || 0) * 10 + (c.capaciteMax || 2000) / 100,
          }))
          .sort((a, b) => b.score - a.score);
      },

      getCentresAlertes: () => get().getAll().filter(c => c.statut === 'alerte'),
    }),
    { name: 'aqip-centres', partialize: (state) => ({ centres: state.centres, departements: state.departements }) }
  )
);