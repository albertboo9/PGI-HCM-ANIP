import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Formation, FormationSuivie } from '../types';
import { useDataStore } from '../data/dataStore';

interface FormationState {
  formations: Formation[];
  formationsSuivies: FormationSuivie[];

  // CRUD formations
  getAll: () => Formation[];
  getById: (id: string) => Formation | undefined;
  
  // CRUD formations suivies
  getFormationsSuivies: () => FormationSuivie[];
  getFormationsByAgent: (agentId: string) => (FormationSuivie & { formation: Formation })[];
  getFormationsByStatut: (statut: string) => FormationSuivie[];
  
  // Actions métier
  startFormation: (agentId: string, formationId: string) => FormationSuivie;
  updateProgression: (id: string, progression: number) => void;
  updateQuizScore: (id: string, score: number) => void;
  completeFormation: (id: string, quizScore: number) => void;
  requestFormation: (agentId: string, formationId: string, motif: string) => void;
  validateRequest: (demandeId: string) => void;
  refuseRequest: (demandeId: string) => void;
  
  // Filtres
  getFormationsGratuites: () => Formation[];
  getFormationsPayantes: () => Formation[];
  getFormationsCertifiantes: () => Formation[];
  getFormationsByCompetence: (competenceId: string) => Formation[];
  
  // Utilitaires
  getProgressionColor: (progression: number) => string;
  getStatutLabel: (statut: string) => string;
}

export const useFormationStore = create<FormationState>()(
  persist(
    (set, get) => ({
      formations: [],
      formationsSuivies: [],

      getAll: () => {
        const f = get().formations;
        if (f.length === 0) {
          const data = useDataStore.getState().getCollection('formations');
          set({ formations: data });
          return data;
        }
        return f;
      },

      getById: (id) => get().formations.find(f => f.id === id),

      getFormationsSuivies: () => {
        const fs = get().formationsSuivies;
        if (fs.length === 0) {
          const data = useDataStore.getState().getCollection('formationsSuivies');
          set({ formationsSuivies: data });
          return data;
        }
        return fs;
      },

      getFormationsByAgent: (agentId) => {
        const allF = get().getAll();
        const allFS = get().getFormationsSuivies();
        return allFS
          .filter(fs => fs.agentId === agentId)
          .map(fs => ({
            ...fs,
            formation: allF.find(f => f.id === fs.formationId) || { id: '', titre: 'Formation inconnue', cout: 0 },
          }));
      },

      getFormationsByStatut: (statut) => {
        return get().getFormationsSuivies().filter(fs => fs.statut === statut);
      },

      startFormation: (agentId, formationId) => {
        const newFs: FormationSuivie = {
          id: `fs-${Date.now()}`,
          agentId,
          formationId,
          statut: 'en_cours',
          dateDebut: new Date().toISOString().split('T')[0],
          progression: 0,
        };
        set(state => ({ formationsSuivies: [...state.formationsSuivies, newFs] }));
        return newFs;
      },

      updateProgression: (id, progression) => {
        set(state => ({
          formationsSuivies: state.formationsSuivies.map(fs =>
            fs.id === id ? { ...fs, progression: Math.min(progression, 100) } : fs
          ),
        }));
      },

      updateQuizScore: (id, score) => {
        set(state => ({
          formationsSuivies: state.formationsSuivies.map(fs =>
            fs.id === id ? { ...fs, quizScore: score } : fs
          ),
        }));
      },

      completeFormation: (id, quizScore) => {
        set(state => ({
          formationsSuivies: state.formationsSuivies.map(fs =>
            fs.id === id
              ? { ...fs, statut: 'terminee', progression: 100, quizScore, dateCertification: new Date().toISOString().split('T')[0] }
              : fs
          ),
        }));
      },

      requestFormation: (agentId, formationId, motif) => {
        const demandes = useDataStore.getState().getCollection('demandesFormation');
        useDataStore.getState().updateCollection('demandesFormation', [
          ...demandes,
          { id: `dem-${Date.now()}`, agentId, formationId, dateDemande: new Date().toISOString().split('T')[0], statut: 'en_attente', motif },
        ]);
      },

      validateRequest: (demandeId) => {
        const demandes = useDataStore.getState().getCollection('demandesFormation');
        useDataStore.getState().updateCollection('demandesFormation',
          demandes.map(d => d.id === demandeId ? { ...d, statut: 'validée' as const, dateDecision: new Date().toISOString() } : d)
        );
      },

      refuseRequest: (demandeId) => {
        const demandes = useDataStore.getState().getCollection('demandesFormation');
        useDataStore.getState().updateCollection('demandesFormation',
          demandes.map(d => d.id === demandeId ? { ...d, statut: 'refusée' as const, dateDecision: new Date().toISOString() } : d)
        );
      },

      getFormationsGratuites: () => get().getAll().filter(f => f.cout === 0),
      getFormationsPayantes: () => get().getAll().filter(f => (f.cout || 0) > 0),
      getFormationsCertifiantes: () => get().getAll().filter(f => f.certifiante),
      getFormationsByCompetence: (competenceId) =>
        get().getAll().filter(f => f.competencesCiblees?.includes(competenceId)),

      getProgressionColor: (p) => {
        if (p >= 100) return 'text-green-400';
        if (p >= 50) return 'text-blue-400';
        if (p >= 20) return 'text-yellow-400';
        return 'text-gray-400';
      },

      getStatutLabel: (statut) => {
        const labels: Record<string, string> = {
          planifiee: 'Planifiée',
          en_cours: 'En cours',
          terminee: 'Terminée',
          annulee: 'Annulée',
        };
        return labels[statut] || statut;
      },
    }),
    {
      name: 'aqip-formations',
      partialize: (state) => ({ formations: state.formations, formationsSuivies: state.formationsSuivies }),
    }
  )
);