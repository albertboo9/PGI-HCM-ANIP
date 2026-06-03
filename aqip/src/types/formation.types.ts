export interface Formation {
  id: string;
  titre: string;
  categorie?: 'technique' | 'management' | 'integration' | 'qualite';
  duree?: string;
  heures?: number;
  cout: number;
  certifiante?: boolean;
  objectifs?: string[];
  programme?: string;
  competenceCiblee?: string; // Gardé pour compatibilité db.json existant
  competencesCiblees?: string[];
  niveauCible?: number;
}

export interface FormationSuivie {
  id: string;
  agentId: string;
  formationId: string;
  statut: 'planifiee' | 'en_cours' | 'terminee' | 'annulee';
  dateDebut?: string;
  progression?: number;
  quizScore?: number;
  dateCertification?: string | null;
}
