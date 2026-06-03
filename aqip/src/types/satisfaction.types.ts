export interface Satisfaction {
  id: string;
  citoyen: string;
  dossierRef?: string;
  centreId: string;
  agentId?: string;
  service?: string;
  typeService?: string;
  note: number;
  tempsAttenteMin?: number;
  commentaire?: string;
  date: string;
  canal?: 'sms' | 'email' | 'borne' | 'web';
}

export interface Feedback {
  id: string;
  agentId: string;
  emetteurId: string;
  relation: 'manager' | 'pair' | 'subordonne' | 'citoyen';
  type: 'positif' | 'constructif' | 'alerte';
  message: string;
  note: number;
  date: string;
  anonyme: boolean;
  vu: boolean;
}
