import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Incident } from '../types';
import { useDataStore } from '../data/dataStore';

interface IncidentState {
  incidents: Incident[];
  
  getAll: () => Incident[];
  getById: (id: string) => Incident | undefined;
  getByCentre: (centreId: string) => Incident[];
  getByAgent: (agentId: string) => Incident[];
  getByCategorie: (categorie: string) => Incident[];
  getByStatut: (statut: string) => Incident[];
  getByGravite: (gravite: string) => Incident[];
  
  create: (data: Omit<Incident, 'id' | 'dateDetection' | 'historique'>) => Incident;
  update: (id: string, data: Partial<Incident>) => void;
  remove: (id: string) => void;
  
  getStats: () => { total: number; parCategorie: Record<string, number>; parGravite: Record<string, number>; parStatut: Record<string, number> };
  getIncidentsRecents: (limit?: number) => Incident[];
}

export const useIncidentStore = create<IncidentState>()(
  persist(
    (set, get) => ({
      incidents: [],

      getAll: () => {
        const inc = get().incidents;
        if (inc.length === 0) {
          const data = useDataStore.getState().getCollection('incidents');
          set({ incidents: data });
          return data;
        }
        return inc;
      },

      getById: (id) => get().incidents.find(i => i.id === id),
      getByCentre: (centreId) => get().incidents.filter(i => i.centreId === centreId),
      getByAgent: (agentId) => get().incidents.filter(i => i.agentId === agentId),
      getByCategorie: (categorie) => get().incidents.filter(i => i.categorie === categorie),
      getByStatut: (statut) => get().incidents.filter(i => i.statut === statut),
      getByGravite: (gravite) => get().incidents.filter(i => i.gravite === gravite),

      create: (data) => {
        const newInc: Incident = {
          id: `inc-${Date.now()}`,
          ...data,
          dateDetection: new Date().toISOString(),
          historique: [{ date: new Date().toISOString(), action: 'DÉTECTION', user: 'Agent' }],
        };
        set(state => ({ incidents: [...state.incidents, newInc] }));
        return newInc;
      },

      update: (id, data) => {
        set(state => ({
          incidents: state.incidents.map(i => i.id === id ? { ...i, ...data } : i),
        }));
      },

      remove: (id) => {
        set(state => ({ incidents: state.incidents.filter(i => i.id !== id) }));
      },

      getStats: () => {
        const all = get().incidents;
        const parCategorie: Record<string, number> = {};
        const parGravite: Record<string, number> = {};
        const parStatut: Record<string, number> = {};
        all.forEach(i => {
          parCategorie[i.categorie] = (parCategorie[i.categorie] || 0) + 1;
          parGravite[i.gravite] = (parGravite[i.gravite] || 0) + 1;
          parStatut[i.statut] = (parStatut[i.statut] || 0) + 1;
        });
        return { total: all.length, parCategorie, parGravite, parStatut };
      },

      getIncidentsRecents: (limit = 10) => {
        return [...get().incidents]
          .sort((a, b) => new Date(b.dateDetection).getTime() - new Date(a.dateDetection).getTime())
          .slice(0, limit);
      },
    }),
    { name: 'aqip-incidents', partialize: (state) => ({ incidents: state.incidents }) }
  )
);