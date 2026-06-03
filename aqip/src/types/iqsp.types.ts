export interface IQSPData {
  national: number;
  departements: Record<string, number>;
  centres: Record<string, number>;
  tendance: 'hausse' | 'baisse' | 'stable';
  historiqueMensuel: { mois: string; valeur: number }[];
}

export interface AuditLog {
  id: string;
  agentId: string;
  action: string;
  cible: string;
  ancienneValeur?: string;
  nouvelleValeur?: string;
  motif?: string;
  date: string;
  ip: string;
}
