import { create } from 'zustand';
import type { Incident } from '../types';
import { useAgentStore } from './agentStore';
import { useFormationStore } from './formationStore';
import { useIncidentStore } from './incidentStore';

export interface IAAnalysis {
  causeProbable: string;
  competenceImpactee: string;
  gap: number;
  risque: string;
  impact: string;
  formationPrescrite: string | null;
  scoreConfiance: number;
}

export interface IARecommendation {
  type: 'formation' | 'coaching' | 'mobilite' | 'promotion' | 'supervision';
  titre: string;
  description: string;
  priorite: 'haute' | 'moyenne' | 'basse';
  scoreConfiance: number;
}

export interface IAMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface IAState {
  messages: IAMessage[];
  
  // Analyse
  analyzeIncident: (incident: Incident) => IAAnalysis;
  recommendFormations: (agentId: string) => IARecommendation[];
  detectEarlyWarning: (agentId: string) => IARecommendation | null;
  
  // Coach IA
  sendMessage: (agentId: string, message: string) => Promise<IAMessage>;
  getCoachResponse: (agentId: string, message: string) => string;
  clearMessages: () => void;
  
  // Décisions RH
  generateRHProposals: () => IARecommendation[];
  findSuccessors: (poste: string) => IARecommendation[];
  
  // Scoring
  calculateIQSP: (centreId: string) => number;
}

export const useIAStore = create<IAState>()(
  (set, get) => ({
    messages: [],

    analyzeIncident: (incident) => {
      const competences = [
        'comp-photo', 'comp-etat-civil', 'comp-empreintes', 'comp-accueil',
        'comp-toponymie', 'comp-informatique', 'comp-linguistique'
      ];
      const competence = incident.competenceImpactee || competences[Math.floor(Math.random() * competences.length)];
      const gap = incident.gapCompetence || Math.floor(Math.random() * 3) + 1;
      const formations = useFormationStore.getState().getFormationsByCompetence(competence);
      const confiance = 75 + Math.floor(Math.random() * 20);

      return {
        causeProbable: gap >= 3 
          ? 'Maîtrise insuffisante de la compétence (gap important)'
          : 'Manque de pratique et d\'automatismes',
        competenceImpactee: competence,
        gap,
        risque: gap >= 3 ? 'élevé' : gap >= 2 ? 'moyen' : 'faible',
        impact: `Retards de traitement estimés selon la gravité`,
        formationPrescrite: formations.length > 0 ? formations[0].id : null,
        scoreConfiance: confiance,
      };
    },

    recommendFormations: (agentId) => {
      const agent = useAgentStore.getState().getById(agentId);
      if (!agent) return [];

      const recommendations: IARecommendation[] = [];
      
      // Recommandation basée sur les gaps de compétences
      if (agent.competences) {
        agent.competences.forEach(c => {
          if (c.niveauActuel < c.niveauAttendu) {
            const gap = c.niveauAttendu - c.niveauActuel;
            const formations = useFormationStore.getState().getFormationsByCompetence(c.competenceId);
            if (formations.length > 0) {
              recommendations.push({
                type: 'formation',
                titre: formations[0].titre,
                description: `Gap de ${gap} niveaux sur cette compétence. Formation recommandée avec priorité ${gap >= 2 ? 'haute' : 'moyenne'}.`,
                priorite: gap >= 2 ? 'haute' : 'moyenne',
                scoreConfiance: 80 + Math.floor(Math.random() * 15),
              });
            }
          }
        });
      }

      // Recommandation coaching si score bas
      if (agent.scores && agent.scores.composite < 60) {
        recommendations.push({
          type: 'coaching',
          titre: 'Accompagnement personnalisé',
          description: 'Score composite inférieur à 60. Un coaching renforcé est recommandé.',
          priorite: 'haute',
          scoreConfiance: 90,
        });
      }

      return recommendations;
    },

    detectEarlyWarning: (agentId) => {
      const agent = useAgentStore.getState().getById(agentId);
      if (!agent || !agent.scores) return null;

      const incidents = useIncidentStore.getState().getByAgent(agentId);
      const incidentsRecents = incidents.filter(i => 
        i.statut !== 'resolu' && 
        (i.gravite === 'Haute' || i.gravite === 'Critique')
      );

      if (incidentsRecents.length >= 3 || (agent.scores.composite || 0) < 50) {
        return {
          type: 'supervision',
          titre: 'Alerte performance détectée',
          description: `${agent.nom} ${agent.prenom} : ${incidentsRecents.length} incidents non résolus, score composite ${agent.scores.composite}/100. Supervision renforcée recommandée.`,
          priorite: 'haute',
          scoreConfiance: 85,
        };
      }
      return null;
    },

    sendMessage: async (agentId, message) => {
      const response = get().getCoachResponse(agentId, message);
      const assistantMsg: IAMessage = {
        id: `ia-${Date.now()}`,
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      };
      set(state => ({ messages: [...state.messages, assistantMsg] }));
      return assistantMsg;
    },

    getCoachResponse: (agentId, message) => {
      const msg = message.toLowerCase();
      const agent = useAgentStore.getState().getById(agentId);

      if (msg.includes('bonjour') || msg.includes('salut') || msg.includes('hello')) {
        return `Bonjour ${agent?.prenom || 'cher agent'} ! Je suis votre Coach IA ANIP. Je suis là pour vous aider à améliorer vos performances, vous recommander des formations, et répondre à vos questions sur les procédures. Comment puis-je vous aider aujourd'hui ?`;
      }
      if (msg.includes('performance') || msg.includes('score')) {
        if (agent?.scores) {
          return `Vos scores actuels sont les suivants :
- Performance globale : ${agent.scores.composite}/100 (${agent.scores.composite >= 70 ? '👍 Bon niveau' : '📈 Peut être amélioré'})
- Qualité : ${agent.scores.qualite}/100
- Linguistique : ${agent.scores.linguistique}/100
- Satisfaction citoyens : ${agent.scores.satisfaction}/5

Je vous recommande de consulter vos formations recommandées pour améliorer vos points faibles.`;
        }
        return 'Je n\'ai pas trouvé vos données de performance. Veuillez vérifier votre profil.';
      }
      if (msg.includes('formation') || msg.includes('recommand')) {
        const recos = get().recommendFormations(agentId);
        if (recos.length === 0) return 'Vous n\'avez pas de formation recommandée pour le moment. Continuez votre bon travail !';
        return `Voici les formations que je vous recommande :
${recos.map((r, i) => `${i + 1}. **${r.titre}** (priorité ${r.priorite}) - ${r.description}`).join('\n')}

Souhaitez-vous que j'inscrive à l'une d'elles ?`;
      }
      if (msg.includes('procédure') || msg.includes('comment') || msg.includes('aide')) {
        return `Voici la procédure standard pour le traitement des dossiers :

1. **Vérification d'identité** - Confirmer l'identité du citoyen avec sa pièce
2. **Saisie des informations** - Remplir le formulaire avec exactitude
3. **Contrôle qualité** - Vérifier les informations avant validation
4. **Capture biométrique** - Photo + empreintes selon les normes ANIP
5. **Finalisation** - Générer le récépissé et remettre au citoyen

Pour plus de détails, vous pouvez consulter le module "Procédure d'enrôlement complet" dans votre espace formations.`;
      }
      if (msg.includes('incident') || msg.includes('erreur')) {
        const incidents = useIncidentStore.getState().getByAgent(agentId).filter(i => i.statut !== 'resolu');
        if (incidents.length === 0) return 'Aucun incident non résolu. Bon travail !';
        return `Vous avez ${incidents.length} incident(s) en cours. Le plus récent concerne "${incidents[0].erreurLibelle}". Je vous suggère de :
1. Revoir la procédure concernée
2. Suivre la formation "${incidents[0].formationPrescrite || 'associée'}" recommandée
3. Demander l'assistance de votre chef de centre si nécessaire`;
      }
      if (msg.includes('carrière') || msg.includes('promotion') || msg.includes('évolution')) {
        if (agent) {
          return `Analyse de votre profil ${agent.prenom} :
- Poste actuel : ${agent.poste}
- Grade : ${agent.grade}
- Ancienneté : ${Math.floor((Date.now() - new Date(agent.dateEmbauche).getTime()) / 31536000000)} ans
- Score composite : ${agent.scores?.composite || 'N/A'}/100

Pour une évolution de carrière, je vous recommande de :
1. Maintenir un score composite > 75
2. Obtenir des certifications
3. Développer les compétences manquantes identifiées

Souhaitez-vous que je prépare un plan de développement personnalisé ?`;
        }
      }

      // Réponse par défaut
      return `Je comprends votre question. En tant que Coach IA ANIP, je peux vous aider sur :
- 📊 **Performance** : Analysez vos scores et KPIs
- 🎓 **Formations** : Recommandations personnalisées
- 📋 **Procédures** : Guides pas à pas
- ⚠️ **Incidents** : Analyse et résolution
- 🚀 **Carrière** : Évolution et développement

Que souhaitez-vous explorer ?`;
    },

    clearMessages: () => set({ messages: [] }),

    generateRHProposals: () => {
      const agents = useAgentStore.getState().getAll();
      const proposals: IARecommendation[] = [];

      // Top performers → promotion
      const top = [...agents].sort((a, b) => (b.scores?.composite || 0) - (a.scores?.composite || 0)).slice(0, 3);
      top.forEach(agent => {
        if ((agent.scores?.composite || 0) > 85) {
          proposals.push({
            type: 'promotion',
            titre: `Promotion recommandée : ${agent.nom} ${agent.prenom}`,
            description: `Score composite ${agent.scores?.composite || 0}/100. Excellent potentiel pour un poste de supervision.`,
            priorite: 'haute',
            scoreConfiance: 85,
          });
        }
      });

      // Mobilité pour les agents avec mutations
      const mutables = agents.filter(a => a.statut === 'mutation');
      mutables.forEach(agent => {
        proposals.push({
          type: 'mobilite',
          titre: `Mobilité : ${agent.nom} ${agent.prenom}`,
          description: 'Agent en statut mutation. Recherche de nouvelle affectation recommandée.',
          priorite: 'moyenne',
          scoreConfiance: 70,
        });
      });

      return proposals.slice(0, 5);
    },

    findSuccessors: (poste) => {
      const agents = useAgentStore.getState().getAll();
      return agents
        .filter(a => (a.scores?.composite || 0) > 75)
        .slice(0, 3)
        .map(agent => ({
          type: 'mobilite' as const,
          titre: `Successeur potentiel : ${agent.nom} ${agent.prenom}`,
          description: `Profil adapté pour ${poste}. Score composite ${agent.scores?.composite || 0}/100.`,
          priorite: 'haute',
          scoreConfiance: 75,
        }));
    },

    calculateIQSP: (centreId) => {
      const agents = useAgentStore.getState().getByCentre(centreId);
      if (agents.length === 0) return 0;
      const scores = agents.map(a => a.scores?.composite || 0);
      return Math.round(scores.reduce((s, v) => s + v, 0) / scores.length);
    },
  })
);