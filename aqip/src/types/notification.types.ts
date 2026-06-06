export interface Notification {
  id: string;
  titre: string;
  message: string;
  type: 'incident' | 'formation' | 'evaluation' | 'feedback' | 'alerte' | 'systeme';
  lu: boolean;
  date: string;
  agentId: string;
  lien: string;
  priorite: 'basse' | 'normale' | 'haute' | 'urgente';
}

export interface DemandeFormation {
  id: string;
  agentId: string;
  formationId: string;
  dateDemande: string;
  statut: 'en_attente' | 'validée' | 'refusée';
  motif: string;
  decisionCommentaire?: string;
  dateDecision?: string;
}