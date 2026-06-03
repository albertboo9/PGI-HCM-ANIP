export interface NiveauCompetence {
  niveau: number;
  label: string;
  description: string;
}

export interface Competence {
  id: string;
  nom: string;
  categorie: 'technique' | 'comportementale' | 'manageriale';
  piller: string;
  description: string;
  niveaux: NiveauCompetence[];
}
