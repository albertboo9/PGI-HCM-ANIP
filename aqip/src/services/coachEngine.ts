import type { Incident } from '../types/incident.types';
import type { Agent } from '../types/agent.types';
import { getAgentSkillGaps } from './skillEngine';
import type { Role } from '../store/authStore';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
export interface CoachMessage {
  id: string;
  sender: 'coach' | 'agent';
  content: string;
  type: 'text' | 'recommendation' | 'radar' | 'career' | 'strategic' | 'action';
  data?: any;
}

export interface PredefinedQuestion {
  id: string;
  text: string;
  keywords: string[];
  roles: Role[];
}

// ---------------------------------------------------------------------------
// Questions prédéfinies par rôle
// ---------------------------------------------------------------------------
export const PREDEFINED_QUESTIONS_BY_ROLE: Record<Role, PredefinedQuestion[]> = {
  agent: [
    { id: 'agent_recommandation', text: "Pourquoi ai-je reçu cette recommandation de formation ?", keywords: ['recommandation', 'formation', 'pourquoi'], roles: ['agent'] },
    { id: 'agent_faiblesses', text: "Quelles sont mes faiblesses actuelles ?", keywords: ['faiblesses', 'points faibles', 'lacunes'], roles: ['agent'] },
    { id: 'agent_carriere', text: "Quel poste puis-je viser avec mes scores ?", keywords: ['carrière', 'poste', 'évolution', 'promotion'], roles: ['agent'] },
    { id: 'agent_forces', text: "Quels sont mes points forts ?", keywords: ['forces', 'points forts'], roles: ['agent'] },
  ],
  chef_centre: [
    { id: 'chef_equipe_difficulte', text: "Quels agents de mon équipe sont en difficulté ?", keywords: ['équipe', 'difficulté', 'agents', 'problème'], roles: ['chef_centre'] },
    { id: 'chef_formation_prescrire', text: "Quelles formations dois-je prescrire en priorité ?", keywords: ['formation', 'prescrire', 'priorité'], roles: ['chef_centre'] },
    { id: 'chef_performance', text: "Quelle est la tendance de performance de mon centre ?", keywords: ['performance', 'tendance', 'centre'], roles: ['chef_centre'] },
  ],
  drh: [
    { id: 'drh_talents', text: "Quels sont les talents à fort potentiel ?", keywords: ['talents', 'potentiel', 'haut potentiel', 'leaders'], roles: ['drh'] },
    { id: 'drh_budget', text: "Quel budget formation dois-je allouer ce trimestre ?", keywords: ['budget', 'formation', 'coût', 'allouer'], roles: ['drh'] },
    { id: 'drh_impact', text: "Quel a été l'impact des formations sur les 6 derniers mois ?", keywords: ['impact', 'formation', 'résultats', 'ROI'], roles: ['drh'] },
  ],
  dg: [
    { id: 'dg_centres_risque', text: "Quels centres présentent le plus de risques ?", keywords: ['centres', 'risque', 'problèmes', 'difficulté'], roles: ['dg'] },
    { id: 'dg_investissement', text: "Où dois-je investir les efforts de formation ?", keywords: ['investir', 'formation', 'effort', 'priorité'], roles: ['dg'] },
    { id: 'dg_national', text: "Quelle est la situation nationale des compétences ?", keywords: ['national', 'compétences', 'pays', 'situation'], roles: ['dg'] },
  ],
  responsable_qualite: [
    { id: 'qualite_tendances', text: "Quelles sont les tendances d'erreurs cette semaine ?", keywords: ['tendances', 'erreurs', 'semaine'], roles: ['responsable_qualite'] },
    { id: 'qualite_causes', text: "Quelles sont les causes racines les plus fréquentes ?", keywords: ['causes', 'racines', 'fréquentes'], roles: ['responsable_qualite'] },
  ],
  auditeur: [
    { id: 'audit_conformite', text: "Quels centres ont le plus d'incidents non résolus ?", keywords: ['centres', 'incidents', 'non résolus', 'ouverts'], roles: ['auditeur'] },
  ],
  directeur_dept: [
    { id: 'dept_performance', text: "Quelle est la performance de mon département ?", keywords: ['département', 'performance', 'région'], roles: ['directeur_dept'] },
    { id: 'dept_comparaison', text: "Comment se compare mon département aux autres ?", keywords: ['comparaison', 'département', 'autres'], roles: ['directeur_dept'] },
  ],
};

// ---------------------------------------------------------------------------
// ALL QUESTIONS (flat array for the sidebar)
// ---------------------------------------------------------------------------
export const PREDEFINED_QUESTIONS = PREDEFINED_QUESTIONS_BY_ROLE.agent;  // backwards compat default

// ---------------------------------------------------------------------------
// Proactive message (Agent only — other roles use strategic messages)
// ---------------------------------------------------------------------------
export function getProactiveMessage(agent: Agent, incidents: Incident[]): string {
  const agentIncidents = incidents.filter(i => i.agentId === agent.id);
  const recentIncidents = agentIncidents.filter(i => {
    const diff = new Date().getTime() - new Date(i.dateDetection).getTime();
    return diff < 7 * 24 * 60 * 60 * 1000;
  });

  if (recentIncidents.length > 0) {
    const gaps = getAgentSkillGaps(agent, recentIncidents);
    if (gaps.length > 0) {
      const mainGap = gaps[0];
      return `Bonjour ${agent.prenom}. J'ai noté ${recentIncidents.length} incidents récents sur vos dossiers. La cause principale semble être un besoin d'accompagnement sur "${mainGap.competenceLabel}". Souhaitez-vous que nous en discutions ?`;
    }
    return `Bonjour ${agent.prenom}. Vous avez eu ${recentIncidents.length} dossiers rejetés récemment. Comment puis-je vous aider à améliorer cela ?`;
  }

  const highScores = agent.scores.composite > 85;
  if (highScores) {
    return `Félicitations ${agent.prenom} ! Vos récents scores de qualité (${agent.scores.composite}%) sont excellents. Vous avez le profil pour évoluer. Souhaitez-vous voir les parcours professionnels accessibles ?`;
  }

  return `Bonjour ${agent.prenom}. Je suis votre Coach AQIP. Je suis là pour vous accompagner dans votre développement professionnel. Que souhaitez-vous voir aujourd'hui ?`;
}

// ---------------------------------------------------------------------------
// Strategic proactive messages (Chef, DRH, DG, etc.)
// ---------------------------------------------------------------------------
export function getStrategicProactiveMessage(
  role: Role,
  agents: Agent[],
  incidents: Incident[],
  centreAgents?: Agent[]
): string {
  switch (role) {
    case 'chef_centre': {
      const agentsAvecGaps = (centreAgents || agents)
        .map(a => ({ agent: a, gaps: getAgentSkillGaps(a, incidents) }))
        .filter(a => a.gaps.length > 0);
      if (agentsAvecGaps.length > 0) {
        return `Bonjour ! ${agentsAvecGaps.length} agent(s) de votre centre présentent des besoins de développement. ${agentsAvecGaps[0].agent.prenom} ${agentsAvecGaps[0].agent.nom} est prioritaire avec un gap en "${agentsAvecGaps[0].gaps[0].competenceLabel}".`;
      }
      return `Bonjour ! Votre centre maintient un bon niveau de compétences. Souhaitez-vous explorer les opportunités de perfectionnement pour vos agents ?`;
    }
    case 'drh': {
      const totalIncidents = incidents.length;
      const agentsAvecGaps = agents.map(a => ({ agent: a, gaps: getAgentSkillGaps(a, incidents) })).filter(a => a.gaps.length > 0);
      return `Bonjour ! ${totalIncidents} incidents sont actuellement ouverts sur la plateforme. ${agentsAvecGaps.length} agents nécessitent un plan de développement. Souhaitez-vous analyser les talents à fort potentiel ?`;
    }
    case 'dg': {
      const centresAvecIncidents = [...new Set(incidents.map(i => i.centreId))].length;
      const totalIncidents = incidents.length;
      return `Bonjour Directeur Général. ${totalIncidents} incidents qualité sont enregistrés sur ${centresAvecIncidents} centres. La cartographie nationale des compétences est à jour. Souhaitez-vous visualiser les centres à risque ?`;
    }
    case 'responsable_qualite': {
      const recentIncidents = incidents.filter(i => {
        const diff = new Date().getTime() - new Date(i.dateDetection).getTime();
        return diff < 7 * 24 * 60 * 60 * 1000;
      });
      return `Bonjour ! ${recentIncidents.length} nouveaux incidents cette semaine. Les causes principales sont : Compétence (40%), Matériel (30%), Procédure (20%), Surcharge (10%).`;
    }
    case 'auditeur': {
      const nonResolus = incidents.filter(i => i.statut === 'nouveau' || i.statut === 'en_cours');
      return `Bonjour ! ${nonResolus.length} incidents sont encore non résolus. Souhaitez-vous générer un rapport de conformité ?`;
    }
    default:
      return `Bonjour ! Je suis votre Assistant IA AQIP. Comment puis-je vous assister aujourd'hui ?`;
  }
}

// ---------------------------------------------------------------------------
// Career path (Agent only)
// ---------------------------------------------------------------------------
export function getCareerPath(agent: Agent) {
  if (agent.poste === "Agent d'enrôlement") {
    return [
      { poste: "Superviseur Qualité", match: 85, competencesManquantes: ["Management d'équipe", "Analyse de données"], formations: ["Leadership de proximité", "Introduction au contrôle qualité"] },
      { poste: "Expert Biométrie", match: 70, competencesManquantes: ["Capture empreintes avancée"], formations: ["Protocole empreintes ANIP"] },
    ];
  }
  return [];
}

// ---------------------------------------------------------------------------
// Agent Summary
// ---------------------------------------------------------------------------
export function getAgentSummary(agent: Agent, incidents: Incident[]) {
  const gaps = getAgentSkillGaps(agent, incidents);
  const strengths = agent.competences.filter(c => c.niveauActuel >= c.niveauAttendu);
  const weaknesses = gaps.map(g => g.competenceLabel);

  return {
    score: agent.scores.composite,
    strengths: strengths.map(s => s.competenceId),
    weaknesses: weaknesses.slice(0, 3),
  };
}

// ---------------------------------------------------------------------------
// INTENT MATCHER — analyse par mots-clés
// ---------------------------------------------------------------------------
function matchIntent(input: string): string {
  const lower = input.toLowerCase();

  // Détection multi-mots-clés
  if ((lower.includes('formation') || lower.includes('catalogue') || lower.includes('cours')) && (lower.includes('quoi') || lower.includes('disponible') || lower.includes('existe'))) return 'catalogue_formations';
  if (lower.includes('roi') && (lower.includes('formation') || lower.includes('investissement'))) return 'roi_formation';
  if ((lower.includes('agent') || lower.includes('agents')) && (lower.includes('erreur') || lower.includes('difficulté') || lower.includes('problème') || lower.includes('plus'))) return 'agents_critiques';
  if ((lower.includes('centre') || lower.includes('centres')) && (lower.includes('risque') || lower.includes('baisse') || lower.includes('problème') || lower.includes('mauvais'))) return 'centres_risque';
  if ((lower.includes('compétence') || lower.includes('compétences')) && (lower.includes('manque') || lower.includes('déficit') || lower.includes('gap'))) return 'gaps_nationaux';
  if (lower.includes('talent') || lower.includes('potentiel') || lower.includes('leader')) return 'talents';
  if (lower.includes('budget') || lower.includes('coût') || lower.includes('allouer')) return 'budget';
  if (lower.includes('impact') && (lower.includes('formation') || lower.includes('6 mois') || lower.includes('semestre'))) return 'impact_formations';
  if (lower.includes('tendance') || lower.includes('semaine') || lower.includes('mois')) return 'tendances';
  if (lower.includes('non résolu') || lower.includes('ouvert')) return 'non_resolus';
  if (lower.includes('performance') && (lower.includes('département') || lower.includes('région'))) return 'performance_dept';
  if (lower.includes('comparaison') || lower.includes('comparer')) return 'comparaison_dept';
  if (lower.includes('national') || lower.includes('pays') || lower.includes('situation')) return 'national';
  if (lower.includes('cause') || lower.includes('racine') || lower.includes('pourquoi')) return 'causes_frequentes';
  if (lower.includes('certificat') || lower.includes('certification')) return 'certifications';

  return 'default';
}

// ---------------------------------------------------------------------------
// GENERATE COACH RESPONSE — contextuel par rôle
// ---------------------------------------------------------------------------
export function generateCoachResponse(
  role: Role,
  queryTypeOrInput: string,
  agent: Agent | null,
  agents: Agent[],
  incidents: Incident[],
  centres?: any[],
  additionalContext?: any
): CoachMessage {
  const msgId = Math.random().toString(36).substring(7);

  // Si c'est une question prédéfinie (queryType)
  if (['agent_recommandation', 'agent_faiblesses', 'agent_carriere', 'agent_forces',
       'chef_equipe_difficulte', 'chef_formation_prescrire', 'chef_performance',
       'drh_talents', 'drh_budget', 'drh_impact',
       'dg_centres_risque', 'dg_investissement', 'dg_national',
       'qualite_tendances', 'qualite_causes',
       'audit_conformite',
       'dept_performance', 'dept_comparaison'].includes(queryTypeOrInput)) {
    return generatePredefinedAnswer(role, queryTypeOrInput, agent, agents, incidents, centres, msgId);
  }

  // Sinon, matcher d'intention sur le texte
  const intent = matchIntent(queryTypeOrInput);
  return generateIntentAnswer(role, intent, agent, agents, incidents, centres, msgId, additionalContext);
}

function generatePredefinedAnswer(
  _role: Role, queryId: string, agent: Agent | null, agents: Agent[], incidents: Incident[], centres: any[] | undefined, msgId: string
): CoachMessage {
  switch (queryId) {
    // ----- AGENT -----
    case 'agent_recommandation': {
      if (!agent) return { id: msgId, sender: 'coach', type: 'text', content: "Je n'ai pas trouvé votre profil." };
      const gaps = getAgentSkillGaps(agent, incidents);
      if (gaps.length > 0) {
        return { id: msgId, sender: 'coach', type: 'recommendation', content: `Vos récentes erreurs sont liées à la compétence "${gaps[0].competenceLabel}". Pour vous aider, voici la formation recommandée :`, data: { gap: gaps[0] } };
      }
      return { id: msgId, sender: 'coach', type: 'text', content: "Vous n'avez pas de recommandation urgente pour le moment. Continuez votre bon travail !" };
    }
    case 'agent_faiblesses':
      return { id: msgId, sender: 'coach', type: 'radar', content: "Voici l'analyse de vos compétences par rapport aux attentes de votre poste actuel :", data: { agent } };
    case 'agent_carriere':
      return { id: msgId, sender: 'coach', type: 'career', content: agent ? `Basé sur votre profil (${agent.scores.composite}%), voici les prochaines étapes possibles pour votre carrière :` : "Voici les parcours possibles :", data: { paths: agent ? getCareerPath(agent) : [] } };
    case 'agent_forces':
      return { id: msgId, sender: 'coach', type: 'text', content: agent ? `Vos points forts identifiés : Accueil Citoyen, Rapidité de saisie. Score composite : ${agent.scores.composite}%. Vous êtes un atout pour votre centre.` : "Impossible d'analyser vos forces pour le moment." };

    // ----- CHEF DE CENTRE -----
    case 'chef_equipe_difficulte': {
      const agentsEnDifficulte = agents.map(a => ({ agent: a, gaps: getAgentSkillGaps(a, incidents) })).filter(a => a.gaps.length > 0).sort((a, b) => b.gaps.length - a.gaps.length);
      if (agentsEnDifficulte.length === 0) return { id: msgId, sender: 'coach', type: 'text', content: "Félicitations ! Aucun agent de votre équipe n'a de gap critique actuellement." };
      return { id: msgId, sender: 'coach', type: 'action', content: `${agentsEnDifficulte.length} agent(s) nécessitent votre attention. Voici les plus critiques :`, data: { agents: agentsEnDifficulte.slice(0, 3) } };
    }
    case 'chef_formation_prescrire': {
      const agentsAvecGaps = agents.map(a => ({ agent: a, gaps: getAgentSkillGaps(a, incidents) })).filter(a => a.gaps.length > 0);
      if (agentsAvecGaps.length === 0) return { id: msgId, sender: 'coach', type: 'text', content: "Aucune prescription urgente. Votre équipe est au niveau." };
      const topFormations = agentsAvecGaps.flatMap(a => a.gaps.map(g => g.competenceLabel)).slice(0, 3);
      return { id: msgId, sender: 'coach', type: 'recommendation', content: `Je recommande de prescrire des formations sur : ${topFormations.join(', ')}. Impact estimé : -60% d'erreurs sur ces compétences.`, data: { agents: agentsAvecGaps.slice(0, 2) } };
    }
    case 'chef_performance':
      return { id: msgId, sender: 'coach', type: 'strategic', content: "La tendance de votre centre est positive : +8 pts sur la compétence État Civil depuis le début du trimestre. Continuez à encourager les formations prescrites." };

    // ----- DRH -----
    case 'drh_talents': {
      const topPerformers = agents.filter(a => a.scores.composite > 85).slice(0, 4);
      return { id: msgId, sender: 'coach', type: 'career', content: `${topPerformers.length} agents ont un score > 85%. Voici les talents à fort potentiel :`, data: { agents: topPerformers } };
    }
    case 'drh_budget':
      return { id: msgId, sender: 'coach', type: 'strategic', content: "Budget formation estimé pour ce trimestre : 4.2M FCFA. Allocation recommandée : 60% formations prescrites, 30% catalogue libre, 10% formations externes. ROI attendu : 180%." };
    case 'drh_impact':
      return { id: msgId, sender: 'coach', type: 'strategic', content: "Sur les 6 derniers mois, 89 formations ont été suivies. Réduction moyenne des erreurs : -45%. Score qualité national : +12 pts. Félicitations pour ces résultats !" };

    // ----- DG -----
    case 'dg_centres_risque':
      return { id: msgId, sender: 'coach', type: 'strategic', content: "Les centres de Natitingou et Parakou présentent les déficits de compétences les plus importants (Biométrie : 52%, État Civil : 58%). Je recommande une campagne de formation ciblée." };
    case 'dg_investissement':
      return { id: msgId, sender: 'coach', type: 'strategic', content: "Priorité d'investissement : 1) Biométrie (120 agents, ROI 340%), 2) État Civil (95 agents, ROI 210%), 3) Accueil (60 agents, ROI 150%). Budget total estimé : 12M FCFA." };
    case 'dg_national':
      return { id: msgId, sender: 'coach', type: 'strategic', content: "Situation nationale : 12 départements, 427 agents, 134 incidents ouverts. Score IQSP national : 81%. Tendance : +5 pts vs trimestre précédent. Les formations prescrites portent leurs fruits." };

    // ----- QUALITÉ -----
    case 'qualite_tendances':
      return { id: msgId, sender: 'coach', type: 'strategic', content: "Tendances de la semaine : FR-01 en hausse (+12%), BIO-03 stable, ACC-02 en baisse (-18%). Le centre de Cotonou concentre 45% des nouveaux incidents." };
    case 'qualite_causes':
      return { id: msgId, sender: 'coach', type: 'strategic', content: "Causes racines les plus fréquentes : Compétence (42% — transcription & biométrie), Matériel (28% — scanners défectueux), Procédure (20%), Surcharge (10%)." };

    // ----- AUDITEUR -----
    case 'audit_conformite':
      return { id: msgId, sender: 'coach', type: 'action', content: `${incidents.filter(i => i.statut === 'nouveau').length} incidents non résolus sur ${centres?.length || 12} centres. Les centres de Cotonou et Parakou nécessitent un audit prioritaire.` };

    // ----- DIRECTEUR DÉPARTEMENTAL -----
    case 'dept_performance':
      return { id: msgId, sender: 'coach', type: 'strategic', content: "Performance du département Littoral : Score qualité 78%, 3 centres, 89 agents. Tendance : +6 pts depuis janvier. Félicitations !" };
    case 'dept_comparaison':
      return { id: msgId, sender: 'coach', type: 'strategic', content: "Comparaison nationale : Littoral (78%), Atlantique (74%), Ouémé (69%). Votre département est en tête, continuez à investir dans les formations prescrites." };

    default:
      return { id: msgId, sender: 'coach', type: 'text', content: "Je suis là pour vous accompagner. Vous pouvez me poser des questions sur vos compétences, vos formations recommandées, ou votre évolution de carrière." };
  }
}

function generateIntentAnswer(
  _role: Role, intent: string, _agent: Agent | null, agents: Agent[], incidents: Incident[], _centres: any[] | undefined, msgId: string, _ctx?: any
): CoachMessage {
  switch (intent) {
    case 'catalogue_formations':
      return { id: msgId, sender: 'coach', type: 'text', content: "Notre catalogue contient 8 formations réparties en 3 catégories : Libre (accès immédiat), Prescrit (sur recommandation), Externe (validation hiérarchique). Rendez-vous dans l'onglet Catalogue pour les explorer !" };
    case 'roi_formation':
      return { id: msgId, sender: 'coach', type: 'strategic', content: "Le ROI moyen des formations prescrites est de 215%. Exemple : la formation « Transcription des actes » (coût 250K FCFA) a généré une économie de 539K FCFA en réduisant les erreurs FR-01." };
    case 'agents_critiques':
      return { id: msgId, sender: 'coach', type: 'action', content: `${agents.filter(a => getAgentSkillGaps(a, incidents).length > 0).length} agent(s) présentent des gaps de compétences. Jean Ahouangon (18 erreurs FR-01) est prioritaire.` };
    case 'centres_risque':
      return { id: msgId, sender: 'coach', type: 'strategic', content: "Natitingou et Parakou sont les centres avec les plus grands déficits de compétences. Je recommande une intervention ciblée en Biométrie et État Civil." };
    case 'gaps_nationaux':
      return { id: msgId, sender: 'coach', type: 'strategic', content: "Compétences les plus déficitaires au niveau national : Biométrie (52% des agents sous le seuil), État Civil (38%), Contrôle Qualité (27%)." };
    case 'talents':
      return { id: msgId, sender: 'coach', type: 'career', content: `${agents.filter(a => a.scores.composite > 85).length} agents ont un score > 85%. Marie Dossou (score 88%, -83% erreurs) est un talent émergent à suivre.` };
    case 'budget':
      return { id: msgId, sender: 'coach', type: 'strategic', content: "Budget formation trimestriel recommandé : 4.2M FCFA. Allocation : 2.5M formations prescrites, 1.2M catalogue libre, 0.5M formations externes." };
    case 'impact_formations':
      return { id: msgId, sender: 'coach', type: 'strategic', content: "Impact des formations sur 6 mois : -45% erreurs FR-01, +12 pts score qualité national, 89 formations suivies, 67 compétences améliorées." };
    case 'tendances':
      return { id: msgId, sender: 'coach', type: 'strategic', content: "Tendances récentes : FR-01 en hausse (+12%), BIO-03 stable, satisfaction citoyenne en hausse (+0.4 pts). Les formations prescrites commencent à produire leurs effets." };
    case 'non_resolus':
      return { id: msgId, sender: 'coach', type: 'action', content: `${incidents.filter(i => i.statut === 'nouveau').length} incidents sont encore non résolus. Consultez le Workflow Qualité pour suivre leur progression.` };
    case 'performance_dept':
    case 'comparaison_dept':
      return { id: msgId, sender: 'coach', type: 'strategic', content: "Le département Littoral est en tête avec un score de 78%, suivi de l'Atlantique (74%) et de l'Ouémé (69%). Continuez à investir dans la formation !" };
    case 'national':
      return { id: msgId, sender: 'coach', type: 'strategic', content: "Situation nationale : 12 départements, 427 agents, IQSP 81%. Tendance positive : +5 pts ce trimestre. Priorité : Biométrie (52% des agents sous le seuil)." };
    case 'causes_frequentes':
      return { id: msgId, sender: 'coach', type: 'strategic', content: "Causes les plus fréquentes : Compétence (42%), Matériel (28%), Procédure (20%), Surcharge (10%). Voir le Workflow Qualité pour le détail." };
    case 'certifications':
      return { id: msgId, sender: 'coach', type: 'text', content: "3 certifications sont disponibles : Contrôle Qualité État Civil, Capture Biométrique Avancée, Accueil & Service Citoyen. Vous pouvez uploader vos certificats externes dans votre espace personnel." };
    default:
      return { id: msgId, sender: 'coach', type: 'text', content: "Je suis votre Assistant IA AQIP. Selon votre rôle, je peux vous aider sur : les compétences, les formations, les incidents qualité, le budget formation, ou la stratégie nationale. Que souhaitez-vous explorer ?" };
  }
}