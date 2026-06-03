export interface TaxonomyError {
  id: string;
  famille: string;
  sousFamille: string;
  erreur: string;
  causeRacine: string[];
  graviteParDefaut: 'Faible' | 'Moyenne' | 'Haute' | 'Critique';
  coutEstimeFcfa: number;
}

export const errorTaxonomy: TaxonomyError[] = [
  // Famille : Biométrie
  {
    id: "BIO-01",
    famille: "Biométrie",
    sousFamille: "Photo",
    erreur: "Photo floue / Visage mal éclairé",
    causeRacine: ["Maîtrise équipement", "Conditions environnementales"],
    graviteParDefaut: "Haute",
    coutEstimeFcfa: 8000
  },
  {
    id: "BIO-03",
    famille: "Biométrie",
    sousFamille: "Empreintes",
    erreur: "Empreintes incomplètes / illisibles",
    causeRacine: ["Procédure non respectée", "Nettoyage capteur"],
    graviteParDefaut: "Critique",
    coutEstimeFcfa: 12000
  },
  
  // Famille : Saisie & Langue Française (UC39)
  {
    id: "FR-01",
    famille: "Saisie & Langue Française",
    sousFamille: "Orthographe Noms",
    erreur: "Faute d'orthographe sur le nom/prénom",
    causeRacine: ["Inattention", "Fatigue", "Manque de vérification"],
    graviteParDefaut: "Haute",
    coutEstimeFcfa: 4000
  },
  {
    id: "FR-04",
    famille: "Saisie & Langue Française",
    sousFamille: "Lieux géographiques",
    erreur: "Nom de commune erroné",
    causeRacine: ["Méconnaissance de la toponymie", "Faute de frappe"],
    graviteParDefaut: "Moyenne",
    coutEstimeFcfa: 2500
  },

  // Famille : Accueil & Citoyen
  {
    id: "ACC-02",
    famille: "Accueil & Citoyen",
    sousFamille: "Temps d'attente",
    erreur: "Dépassement du délai standard d'enrôlement (>15min)",
    causeRacine: ["Désorganisation locale", "Problème technique bloquant"],
    graviteParDefaut: "Moyenne",
    coutEstimeFcfa: 1500
  }
];

export function getErrorDetails(code: string): TaxonomyError | undefined {
  return errorTaxonomy.find(e => e.id === code);
}
