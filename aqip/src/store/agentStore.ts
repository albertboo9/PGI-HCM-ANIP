import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Agent } from '../types';
import dbData from '../../server/db.json';

interface AgentState {
  agents: Agent[];
  isLoading: boolean;
  error: string | null;
  fetchAgents: () => Promise<void>;
  getAgentById: (id: string) => Agent | undefined;
  getAgentsByCentre: (centreId: string) => Agent[];
}

export const useAgentStore = create<AgentState>()(
  persist(
    (set, get) => ({
      agents: dbData.agents as Agent[],
      isLoading: false,
      error: null,
      
      fetchAgents: async () => {
        if (get().agents.length === 0) {
          set({ agents: dbData.agents as Agent[] });
        }
      },
      
      getAgentById: (id) => {
        return get().agents.find(a => a.id === id);
      },
      
      getAgentsByCentre: (centreId) => {
        return get().agents.filter(a => a.centreId === centreId);
      }
    }),
    {
      name: 'aqip-agents-storage',
    }
  )
);
