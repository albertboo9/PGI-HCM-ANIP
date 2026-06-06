import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Agent } from '../types';
import { useDataStore } from '../data/dataStore';

interface AgentState {
  agents: Agent[];
  
  // CRUD
  getAll: () => Agent[];
  getById: (id: string) => Agent | undefined;
  create: (data: Omit<Agent, 'id'>) => Agent;
  update: (id: string, data: Partial<Agent>) => void;
  remove: (id: string) => void;
  
  // Filtres métier
  getByCentre: (centreId: string) => Agent[];
  getByDepartement: (departementId: string) => Agent[];
  getByManager: (managerId: string) => Agent[];
  getByCompetence: (competenceId: string) => Agent[];
  search: (query: string) => Agent[];
  getTopPerformers: (limit?: number) => Agent[];
  getBottomPerformers: (limit?: number) => Agent[];
  
  // Utilitaires
  calculateScore: (agent: Agent) => number;
  getScoreColor: (score: number) => string;
  getScoreLabel: (score: number) => string;
}

export const useAgentStore = create<AgentState>()(
  persist(
    (set, get) => ({
      agents: [],

      getAll: () => {
        const agents = get().agents;
        if (agents.length === 0) {
          const data = useDataStore.getState().getCollection('agents');
          set({ agents: data });
          return data;
        }
        return agents;
      },

      getById: (id) => {
        return get().agents.find(a => a.id === id);
      },

      create: (data) => {
        const newAgent: Agent = {
          id: `agt-${String(Date.now()).slice(-6)}`,
          ...data,
        };
        set(state => ({ agents: [...state.agents, newAgent] }));
        return newAgent;
      },

      update: (id, data) => {
        set(state => ({
          agents: state.agents.map(a => 
            a.id === id ? { ...a, ...data } : a
          )
        }));
      },

      remove: (id) => {
        set(state => ({
          agents: state.agents.filter(a => a.id !== id)
        }));
      },

      getByCentre: (centreId) => {
        return get().agents.filter(a => a.centreId === centreId);
      },

      getByDepartement: (departementId) => {
        return get().agents.filter(a => a.departementId === departementId);
      },

      getByManager: (managerId) => {
        return get().agents.filter(a => a.managerId === managerId);
      },

      getByCompetence: (competenceId) => {
        return get().agents.filter(a => 
          a.competences?.some(c => c.competenceId === competenceId)
        );
      },

      search: (query) => {
        const q = query.toLowerCase();
        return get().agents.filter(a =>
          a.nom.toLowerCase().includes(q) ||
          a.prenom.toLowerCase().includes(q) ||
          a.matricule.toLowerCase().includes(q) ||
          a.poste.toLowerCase().includes(q)
        );
      },

      getTopPerformers: (limit = 10) => {
        return [...get().agents]
          .sort((a, b) => (b.scores?.composite ?? 0) - (a.scores?.composite ?? 0))
          .slice(0, limit);
      },

      getBottomPerformers: (limit = 10) => {
        return [...get().agents]
          .sort((a, b) => (a.scores?.composite ?? 0) - (b.scores?.composite ?? 0))
          .slice(0, limit);
      },

      calculateScore: (agent) => {
        const s = agent.scores;
        if (!s) return 0;
        return Math.round(
          (s.performance || 0) * 0.35 +
          (s.qualite || 0) * 0.25 +
          (s.linguistique || 0) * 0.20 +
          (s.satisfaction || 0) * 10 * 0.10 +
          (s.potentiel || 0) * 0.10
        );
      },

      getScoreColor: (score) => {
        if (score >= 85) return 'text-green-400';
        if (score >= 70) return 'text-blue-400';
        if (score >= 55) return 'text-yellow-400';
        return 'text-red-400';
      },

      getScoreLabel: (score) => {
        if (score >= 85) return 'Excellent';
        if (score >= 70) return 'Très bien';
        if (score >= 55) return 'Moyen';
        return 'Critique';
      },
    }),
    {
      name: 'aqip-agents',
      partialize: (state) => ({ agents: state.agents }),
    }
  )
);