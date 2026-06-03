export interface Departement {
  id: string;
  nom: string;
  chefLieu?: string;
  directeurDepartementalId?: string;
  centresIds?: string[];
  superficie?: number;
  population?: number;
  iqsp?: number;
}

export interface Centre {
  id: string;
  nom: string;
  departementId: string;
  chefCentreId?: string;
  adresse?: string;
  telephone?: string;
  latitude: number;
  longitude: number;
  dateOuverture?: string;
  statut: 'actif' | 'alerte' | 'ferme';
  maturite: 'Réactif' | 'Contrôlé' | 'Standardisé' | 'Piloté' | 'Excellence';
  equipements?: string[];
  capaciteMax?: number;
  agentsCount: number;
}
