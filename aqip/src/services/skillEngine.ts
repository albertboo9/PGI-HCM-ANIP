/**
 * Skill Development Engine
 * 
 * Fonctions pures qui analysent les données des stores
 * pour produire des rapports de développement des compétences.
 * 
 * Pas de magie. Des règles métier.
 */

import type { Incident } from '../types/incident.types';
import type { Agent } from '../types/agent.types';
import { getSkillMapping, SKILL_MAP } from '../data/skillMap';


// --- Types de sortie ---

export interface SkillGap {
  competenceId: string;
  competenceLabel: string;
  niveauActuel: number;
  niveauRequis: number;
  gap: number;
  erreursCausantes: string[];
}

export interface FormationRecommandation {
  formationId: string;
  formationLabel: string;
  duree: string;
  type: string;
  impactAttendu: string;
  impactPourcentage: number;
  erreursConcernees: string[];
  priorite: 'haute' | 'moyenne' | 'basse';
}

export interface ImprovementReport {
  agentId: string;
  erreursTotalesAvant: number;
  erreursTotalesApres: number;
  scoreAvant: number;
  scoreApres: number;
  ameliorationPts: number;
  formationsTerminees: number;
  formationsEnCours: number;
}

export type CanalDetection = 'controleur' | 'chef_centre' | 'systeme' | 'citoyen';

export interface IncidentAnalysis {
  errorCode: string;
  errorLabel: string;
  canalDetection: CanalDetection;
  canalLabel: string;
  competenceId: string;
  competenceLabel: string;
  niveauRequis: number;
  gap: number;
  formationId: string;
  formationLabel: string;
  formationDuree: string;
  impactAttendu: string;
  impactPourcentage: number;
}

// --- Fonctions ---

const CANAL_LABELS: Record<CanalDetection, string> = {
  controleur: 'Contrôleur Qualité',
  chef_centre: 'Chef de Centre',
  systeme: 'Système Automatique',
  citoyen: 'Réclamation Citoyen',
};

/**
 * Analyse un incident et retourne la chaîne complète :
 * Erreur → Compétence → Formation → Impact
 */
export function analyzeIncident(
  incident: Incident,
  agent: Agent | undefined,
  canal: CanalDetection = 'systeme'
): IncidentAnalysis | null {
  const mapping = getSkillMapping(incident.codeErreur);
  if (!mapping) return null;

  const agentComp = agent?.competences.find(
    c => c.competenceId === mapping.competenceId
  );
  const niveauActuel = agentComp?.niveauActuel ?? 1;

  return {
    errorCode: mapping.errorCode,
    errorLabel: mapping.errorLabel,
    canalDetection: canal,
    canalLabel: CANAL_LABELS[canal],
    competenceId: mapping.competenceId,
    competenceLabel: mapping.competenceLabel,
    niveauRequis: mapping.niveauRequis,
    gap: Math.max(0, mapping.niveauRequis - niveauActuel),
    formationId: mapping.formationId,
    formationLabel: mapping.formationLabel,
    formationDuree: mapping.formationDuree,
    impactAttendu: mapping.impactAttendu,
    impactPourcentage: mapping.impactPourcentage,
  };
}

/**
 * Calcule les gaps de compétences d'un agent
 * basé sur ses incidents récents.
 */
export function getAgentSkillGaps(
  agent: Agent,
  incidents: Incident[]
): SkillGap[] {
  const agentIncidents = incidents.filter(i => i.agentId === agent.id);
  const gapsMap = new Map<string, SkillGap>();

  for (const inc of agentIncidents) {
    const mapping = getSkillMapping(inc.codeErreur);
    if (!mapping) continue;

    const existing = gapsMap.get(mapping.competenceId);
    const agentComp = agent.competences.find(
      c => c.competenceId === mapping.competenceId
    );
    const niveauActuel = agentComp?.niveauActuel ?? 1;
    const gap = Math.max(0, mapping.niveauRequis - niveauActuel);

    if (existing) {
      if (!existing.erreursCausantes.includes(inc.codeErreur)) {
        existing.erreursCausantes.push(inc.codeErreur);
      }
    } else {
      gapsMap.set(mapping.competenceId, {
        competenceId: mapping.competenceId,
        competenceLabel: mapping.competenceLabel,
        niveauActuel,
        niveauRequis: mapping.niveauRequis,
        gap,
        erreursCausantes: [inc.codeErreur],
      });
    }
  }

  return Array.from(gapsMap.values()).sort((a, b) => b.gap - a.gap);
}

/**
 * Recommande des formations pour un agent
 * basé sur ses gaps de compétences.
 */
export function getRecommendedFormations(
  gaps: SkillGap[]
): FormationRecommandation[] {
  const formationsMap = new Map<string, FormationRecommandation>();

  for (const gap of gaps) {
    const mappings = SKILL_MAP.filter(m => m.competenceId === gap.competenceId);
    for (const mapping of mappings) {
      if (!formationsMap.has(mapping.formationId)) {
        formationsMap.set(mapping.formationId, {
          formationId: mapping.formationId,
          formationLabel: mapping.formationLabel,
          duree: mapping.formationDuree,
          type: mapping.formationType,
          impactAttendu: mapping.impactAttendu,
          impactPourcentage: mapping.impactPourcentage,
          erreursConcernees: [mapping.errorCode],
          priorite: gap.gap >= 3 ? 'haute' : gap.gap >= 2 ? 'moyenne' : 'basse',
        });
      } else {
        const existing = formationsMap.get(mapping.formationId)!;
        if (!existing.erreursConcernees.includes(mapping.errorCode)) {
          existing.erreursConcernees.push(mapping.errorCode);
        }
      }
    }
  }

  return Array.from(formationsMap.values()).sort((a, b) => {
    const order = { haute: 0, moyenne: 1, basse: 2 };
    return order[a.priorite] - order[b.priorite];
  });
}

/**
 * Retourne les agents prioritaires d'un centre
 * (ceux avec le plus grand gap total).
 */
export function getPriorityAgents(
  agents: Agent[],
  incidents: Incident[],
  limit = 5
): Array<{ agent: Agent; totalGap: number; incidentCount: number; topGap: SkillGap | undefined }> {
  return agents
    .map(agent => {
      const gaps = getAgentSkillGaps(agent, incidents);
      const totalGap = gaps.reduce((sum, g) => sum + g.gap, 0);
      const incidentCount = incidents.filter(i => i.agentId === agent.id).length;
      return { agent, totalGap, incidentCount, topGap: gaps[0] };
    })
    .filter(a => a.totalGap > 0)
    .sort((a, b) => b.totalGap - a.totalGap)
    .slice(0, limit);
}
