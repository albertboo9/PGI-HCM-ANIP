export interface BudgetRepartition {
  categorie: string;
  montant: number;
  consomme: number;
}

export interface ROIData {
  formationId: string;
  cout: number;
  erreursEvitees: number;
  economieEstimee: number;
  roi: number; // en pourcentage
}

export interface Budget {
  annee: number;
  totalAlloue: number;
  dejaEngage: number;
  restant: number;
  repartition: BudgetRepartition[];
  roiParFormation: ROIData[];
}
