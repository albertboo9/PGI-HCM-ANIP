import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Incident } from '../types';
import dbData from '../../server/db.json';

interface IncidentState {
  incidents: Incident[];
  isLoading: boolean;
  error: string | null;
  fetchIncidents: () => Promise<void>;
  getIncidentById: (id: string) => Incident | undefined;
  getIncidentsByAgent: (agentId: string) => Incident[];
  addIncident: (incident: Incident) => Promise<void>;
  updateIncident: (id: string, updates: Partial<Incident>) => Promise<void>;
  getTotalNonQualityCost: () => number;
}

export const useIncidentStore = create<IncidentState>()(
  persist(
    (set, get) => ({
      incidents: dbData.incidents as Incident[],
      isLoading: false,
      error: null,

      fetchIncidents: async () => {
        // Avec persist, les données sont déjà là, on s'assure juste qu'on a un minimum
        if (get().incidents.length === 0) {
          set({ incidents: dbData.incidents as Incident[] });
        }
      },

      getIncidentById: (id) => {
        return get().incidents.find(i => i.id === id);
      },

      getIncidentsByAgent: (agentId) => {
        return get().incidents.filter(i => i.agentId === agentId);
      },

      addIncident: async (incident) => {
        set((state) => ({
          incidents: [incident, ...state.incidents]
        }));
      },

      updateIncident: async (id, updates) => {
        set((state) => ({
          incidents: state.incidents.map(inc => 
            inc.id === id ? { ...inc, ...updates } as Incident : inc
          )
        }));
      },
      
      getTotalNonQualityCost: () => {
        return get().incidents.reduce((total, inc) => total + (inc.coutEstime || 0), 0);
      }
    }),
    {
      name: 'aqip-incidents-storage',
    }
  )
);
