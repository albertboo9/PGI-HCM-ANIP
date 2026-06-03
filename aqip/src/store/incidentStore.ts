import { create } from 'zustand';

export interface Incident {
  id: string;
  agentId: string;
  centreId: string;
  dossierRef: string;
  citoyen: string;
  categorie: string;
  codeErreur: string;
  erreurLibelle: string;
  valeurSaisie?: string;
  valeurAttendue?: string;
  gravite: 'Faible' | 'Moyenne' | 'Haute' | 'Critique';
  statut: 'nouveau' | 'analyse' | 'resolu';
  dateDetection: string;
  causeProbable?: string;
  coutEstime: number;
  impact: string;
}

interface IncidentState {
  incidents: Incident[];
  loading: boolean;
  fetchIncidents: () => Promise<void>;
  getTotalNonQualityCost: () => number;
}

export const useIncidentStore = create<IncidentState>((set, get) => ({
  incidents: [],
  loading: false,
  fetchIncidents: async () => {
    set({ loading: true });
    try {
      const response = await fetch('/db.json');
      const data = await response.json();
      set({ incidents: data.incidents, loading: false });
    } catch (error) {
      console.error('Erreur lors du chargement des incidents', error);
      set({ loading: false });
    }
  },
  getTotalNonQualityCost: () => {
    return get().incidents.reduce((total, inc) => total + (inc.coutEstime || 0), 0);
  }
}));
