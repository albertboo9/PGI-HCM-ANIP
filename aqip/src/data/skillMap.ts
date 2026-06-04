/**
 * Skill Map — Table de correspondance Erreur → Compétence → Formation
 * 
 * Chaque erreur opérationnelle pointe vers UNE compétence et UNE formation.
 * Pas de corrélation complexe. La réalité métier de l'ANIP.
 */

export interface SkillMapping {
  errorCode: string;
  errorLabel: string;
  famille: string;
  competenceId: string;
  competenceLabel: string;
  niveauRequis: number;
  formationId: string;
  formationLabel: string;
  formationDuree: string;
  formationType: 'e-learning' | 'presentiel' | 'coaching' | 'tutorat';
  impactAttendu: string;
  impactPourcentage: number;
}

export const SKILL_MAP: SkillMapping[] = [
  {
    errorCode: 'FR-01',
    errorLabel: "Nom mal orthographié",
    famille: 'Saisie & Langue Française',
    competenceId: 'comp-etat-civil',
    competenceLabel: "Contrôle qualité état civil",
    niveauRequis: 4,
    formationId: 'fmt-transcription',
    formationLabel: "Maîtrise de la transcription des noms",
    formationDuree: '2h',
    formationType: 'e-learning',
    impactAttendu: "Réduire les erreurs de transcription",
    impactPourcentage: 65
  },
  {
    errorCode: 'FR-02',
    errorLabel: "Prénom mal orthographié",
    famille: 'Saisie & Langue Française',
    competenceId: 'comp-etat-civil',
    competenceLabel: "Contrôle qualité état civil",
    niveauRequis: 4,
    formationId: 'fmt-transcription',
    formationLabel: "Maîtrise de la transcription des noms",
    formationDuree: '2h',
    formationType: 'e-learning',
    impactAttendu: "Réduire les erreurs de transcription",
    impactPourcentage: 65
  },
  {
    errorCode: 'FR-03',
    errorLabel: "Nom de commune erroné",
    famille: 'Saisie & Langue Française',
    competenceId: 'comp-toponymie',
    competenceLabel: "Maîtrise de la toponymie béninoise",
    niveauRequis: 3,
    formationId: 'fmt-toponymie',
    formationLabel: "Référentiel géographique du Bénin",
    formationDuree: '1h 30m',
    formationType: 'e-learning',
    impactAttendu: "Réduire les erreurs de localisation",
    impactPourcentage: 55
  },
  {
    errorCode: 'FR-04',
    errorLabel: "Nom du père/mère erroné",
    famille: 'Saisie & Langue Française',
    competenceId: 'comp-etat-civil',
    competenceLabel: "Contrôle qualité état civil",
    niveauRequis: 4,
    formationId: 'fmt-transcription',
    formationLabel: "Maîtrise de la transcription des noms",
    formationDuree: '2h',
    formationType: 'e-learning',
    impactAttendu: "Réduire les erreurs de transcription",
    impactPourcentage: 65
  },
  {
    errorCode: 'BIO-01',
    errorLabel: "Photo floue / mal éclairée",
    famille: 'Biométrie',
    competenceId: 'comp-photo',
    competenceLabel: "Capture photo biométrique",
    niveauRequis: 4,
    formationId: 'fmt-photo',
    formationLabel: "Capture biométrique avancée",
    formationDuree: '3 jours',
    formationType: 'presentiel',
    impactAttendu: "Réduire les photos non conformes",
    impactPourcentage: 80
  },
  {
    errorCode: 'BIO-03',
    errorLabel: "Empreintes incomplètes / illisibles",
    famille: 'Biométrie',
    competenceId: 'comp-empreintes',
    competenceLabel: "Capture empreintes digitales",
    niveauRequis: 5,
    formationId: 'fmt-empreintes',
    formationLabel: "Protocole empreintes ANIP",
    formationDuree: '1 jour',
    formationType: 'presentiel',
    impactAttendu: "Réduire les rejets biométriques",
    impactPourcentage: 70
  },
  {
    errorCode: 'ACC-02',
    errorLabel: "Dépassement du délai standard d'enrôlement",
    famille: 'Accueil & Citoyen',
    competenceId: 'comp-accueil',
    competenceLabel: "Gestion des flux citoyens",
    niveauRequis: 3,
    formationId: 'fmt-accueil',
    formationLabel: "Accueil & gestion des files d'attente",
    formationDuree: '4h',
    formationType: 'coaching',
    impactAttendu: "Réduire les dépassements de délai",
    impactPourcentage: 40
  },
];

/** Retrouve le mapping pour un code erreur */
export function getSkillMapping(errorCode: string): SkillMapping | undefined {
  return SKILL_MAP.find(m => m.errorCode === errorCode);
}

/** Retrouve tous les mappings pour une compétence */
export function getMappingsByCompetence(competenceId: string): SkillMapping[] {
  return SKILL_MAP.filter(m => m.competenceId === competenceId);
}

/** Retrouve tous les mappings pour une formation */
export function getMappingsByFormation(formationId: string): SkillMapping[] {
  return SKILL_MAP.filter(m => m.formationId === formationId);
}
