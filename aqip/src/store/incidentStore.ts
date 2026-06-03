import { create } from 'zustand';
import type { Incident } from '../types';

interface IncidentState {
  incidents: Incident[];
  isLoading: boolean;
  error: string | null;
  fetchIncidents: () => Promise<void>;
  getIncidentById: (id: string) => Incident | undefined;
  getIncidentsByAgent: (agentId: string) => Incident[];
  addIncident: (incident: Incident) => void;
  updateIncident: (id: string, updates: Partial<Incident>) => void;
  getTotalNonQualityCost: () => number;
}

export const useIncidentStore = create<IncidentState>((set, get) => ({
  incidents: [],
  isLoading: false,
  error: null,

  fetchIncidents: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch('/db.json');
      const data = await response.json();
      set({ incidents: data.incidents, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to fetch incidents', isLoading: false });
    }
  },

  getIncidentById: (id) => {
    return get().incidents.find(i => i.id === id);
  },

  getIncidentsByAgent: (agentId) => {
    return get().incidents.filter(i => i.agentId === agentId);
  },

  addIncident: (incident) => set((state) => ({
    incidents: [incident, ...state.incidents]
  })),

  updateIncident: (id, updates) => set((state) => ({
    incidents: state.incidents.map(inc => 
      inc.id === id ? { ...inc, ...updates } : inc
    )
  })),
  
  getTotalNonQualityCost: () => {
    return get().incidents.reduce((total, inc) => total + (inc.coutEstime || 0), 0);
  }
}));
