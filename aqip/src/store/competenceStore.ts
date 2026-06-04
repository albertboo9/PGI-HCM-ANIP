import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Competence } from '../types';
import { useDataStore } from '../data/dataStore';

interface CompetenceState {
  competences: Competence[];
  
  getAll: () => Competence[];
  getById: (id: string) => Competence | undefined;
  getByCategorie: (categorie: string) => Competence[];
  getByPiller: (piller: string) => Competence[];
  
  getNiveaux: (competenceId: string) => { niveau: number; label: string; description: string }[];
  getNiveauLabel: (competenceId: string, niveau: number) => string;
}

export const useCompetenceStore = create<CompetenceState>()(
  persist(
    (set, get) => ({
      competences: [],

      getAll: () => {
        const c = get().competences;
        if (c.length === 0) {
          const data = useDataStore.getState().getCollection('competences');
          set({ competences: data });
          return data;
        }
        return c;
      },

      getById: (id) => get().competences.find(c => c.id === id),
      getByCategorie: (cat) => get().competences.filter(c => c.categorie === cat),
      getByPiller: (piller) => get().competences.filter(c => c.piller === piller),

      getNiveaux: (competenceId) => {
        const comp = get().getById(competenceId);
        return comp?.niveaux || [];
      },

      getNiveauLabel: (competenceId, niveau) => {
        const comp = get().getById(competenceId);
        return comp?.niveaux?.find(n => n.niveau === niveau)?.label || `Niveau ${niveau}`;
      },
    }),
    { name: 'aqip-competences', partialize: (state) => ({ competences: state.competences }) }
  )
);