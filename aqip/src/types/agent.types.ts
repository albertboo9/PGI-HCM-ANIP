export interface AgentCompetence {
  competenceId: string;
  niveauActuel: number;
  niveauAttendu: number;
}

export interface AgentScores {
  performance: number;
  qualite: number;
  linguistique: number;
  satisfaction: number;
  potentiel?: number;
  composite: number;
}

export interface AgentMutation {
  date: string;
  de: string;
  vers: string;
  motif: string;
}

export interface Agent {
  id: string;
  nom: string;
  prenom: string;
  matricule: string;
  email: string;
  telephone: string;
  poste: string;
  grade: string;
  centreId: string;
  departementId: string;
  managerId?: string;
  dateEmbauche: string;
  statut: 'actif' | 'conge' | 'suspendu' | 'mutation';
  competences: AgentCompetence[];
  scores: AgentScores;
  historiqueMutations?: AgentMutation[];
}
