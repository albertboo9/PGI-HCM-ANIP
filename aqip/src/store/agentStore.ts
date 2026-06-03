import { create } from 'zustand';
import { Agent } from '../types';

interface AgentState {
  agents: Agent[];
  isLoading: boolean;
  error: string | null;
  fetchAgents: () => Promise<void>;
  getAgentById: (id: string) => Agent | undefined;
  getAgentsByCentre: (centreId: string) => Agent[];
}

export const useAgentStore = create<AgentState>((set, get) => ({
  agents: [],
  isLoading: false,
  error: null,
  
  fetchAgents: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch('/db.json');
      const data = await response.json();
      set({ agents: data.agents, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to fetch agents', isLoading: false });
    }
  },
  
  getAgentById: (id) => {
    return get().agents.find(a => a.id === id);
  },
  
  getAgentsByCentre: (centreId) => {
    return get().agents.filter(a => a.centreId === centreId);
  }
}));
