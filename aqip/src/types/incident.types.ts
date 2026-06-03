export type Gravite = 'Faible' | 'Moyenne' | 'Haute' | 'Critique';
export type StatutIncident = 'nouveau' | 'analyse' | 'en_cours' | 'resolu' | 'rejete';

export interface IncidentHistorique {
  date: string;
  action: string;
  user: string;
  detail?: string;
}

export interface Incident {
  id: string;
  agentId: string;
  centreId: string;
  dossierRef?: string;
  citoyen?: string;
  categorie: string;
  codeErreur: string;
  erreurLibelle: string;
  valeurSaisie?: string;
  valeurAttendue?: string;
  description?: string;
  gravite: Gravite;
  statut: StatutIncident;
  dateDetection: string;
  dateResolution?: string | null;
  causeProbable?: string;
  competenceImpactee?: string;
  gapCompetence?: number;
  risque?: string;
  impact?: string;
  coutEstime?: number;
  formationPrescrite?: string;
  scoreConfianceIA?: number;
  historique?: IncidentHistorique[];
}
