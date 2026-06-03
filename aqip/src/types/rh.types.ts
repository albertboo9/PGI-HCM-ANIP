export interface Utilisateur {
  id: string;
  nom: string;
  prenom: string;
  role: 'dg' | 'drh' | 'directeur_dept' | 'chef_centre' | 'responsable_qualite' | 'auditeur' | 'agent';
  email: string;
  telephone: string;
  centreId?: string | null;
  departementId?: string | null;
  photo?: string;
  signature?: string;
}

export interface EvaluationScore {
  critereId: string;
  label: string;
  poids: number;
  note: number;
}

export interface Evaluation {
  id: string;
  agentId: string;
  evaluateurId: string;
  campagne: string;
  date: string;
  statut: 'brouillon' | 'en_attente' | 'validee' | 'verrouillee';
  scores: {
    comportemental: EvaluationScore[];
    technique: EvaluationScore[];
    management: EvaluationScore[];
    objectifs: EvaluationScore[];
    autoEvaluation: EvaluationScore[];
  };
  scoreFinal: number;
  verrouilleeLe?: string;
}

export interface ObjectifPDI {
  competenceId: string;
  niveauCible: number;
  echeance: string;
  statut: 'planifie' | 'en_cours' | 'atteint' | 'non_atteint';
}

export interface PDI {
  id: string;
  agentId: string;
  annee: number;
  statut: 'actif' | 'cloture';
  objectifs: ObjectifPDI[];
  formationsPrescrites: string[];
  progressionGlobale: number;
}
