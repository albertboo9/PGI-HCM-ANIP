import { useState, useEffect, useMemo } from 'react';
import AQIPCard from '../../components/ui/AQIPCard';
import { Users, Send, Sparkles, BookOpen, ChevronRight } from 'lucide-react';
import clsx from 'clsx';
import { useAgentStore } from '../../store/agentStore';
import { useIncidentStore } from '../../store/incidentStore';
import { getPriorityAgents } from '../../services/skillEngine';

const QUESTIONS = [
  { id: 'q1', text: "Quels agents doivent être accompagnés en priorité ?" },
  { id: 'q2', text: "Quelles compétences manquent au centre de Cotonou ?" },
  { id: 'q3', text: "Pourquoi l'agent Koffi commet-il autant d'erreurs ?" },
  { id: 'q4', text: "Quelle formation générera le meilleur ROI ?" },
  { id: 'q5', text: "Quels centres nécessitent une intervention immédiate ?" },
];

export default function IAPage() {
  const [activeQuestion, setActiveQuestion] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  
  const { agents, fetchAgents } = useAgentStore();
  const { incidents, fetchIncidents } = useIncidentStore();

  useEffect(() => {
    if (agents.length === 0) fetchAgents();
    if (incidents.length === 0) fetchIncidents();
  }, [agents.length, incidents.length, fetchAgents, fetchIncidents]);

  const priorityAgents = useMemo(() => getPriorityAgents(agents, incidents, 3), [agents, incidents]);

  const getResponse = (qId: string) => {
    switch(qId) {
      case 'q1':
        return (
          <div className="space-y-4">
            <p className="text-sm text-white">
              L'analyse des incidents récents révèle que {priorityAgents.length} agents nécessitent un accompagnement urgent.
            </p>
            <div className="space-y-2">
              {priorityAgents.map(({ agent, topGap, incidentCount }) => (
                <div key={agent.id} className="bg-aqip-bg-elevated/50 p-3 rounded border border-aqip-border flex justify-between items-center">
                  <div>
                    <div className="text-sm font-bold text-white">{agent.prenom} {agent.nom}</div>
                    <div className="text-xs text-aqip-text-muted">{incidentCount} incidents récents</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-aqip-danger font-bold">Gap: {topGap?.competenceLabel}</div>
                    <div className="text-[10px] text-aqip-text-muted bg-aqip-bg-surface px-1.5 py-0.5 rounded mt-1 inline-block">
                      -{topGap?.gap} pts
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-aqip-primary/10 p-4 rounded border border-aqip-primary/30 flex gap-3 mt-4">
              <BookOpen className="h-5 w-5 text-aqip-primary shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-white">Recommandation</h4>
                <p className="text-sm text-aqip-text-muted mt-1">Prescrire le "Plan d'Amélioration Intensif" pour ces agents.</p>
              </div>
            </div>
          </div>
        );
      case 'q2':
        return (
          <div className="space-y-4">
            <p className="text-sm text-white">
              Le centre de Cotonou (42 agents) présente 2 déficits majeurs de compétences :
            </p>
            <div className="bg-aqip-bg-elevated/50 p-4 rounded border border-aqip-border">
              <div className="flex justify-between items-center mb-2">
                 <span className="text-sm font-bold text-aqip-warning">Contrôle qualité état civil</span>
                 <span className="text-xs font-mono bg-aqip-bg-surface px-2 py-1 rounded text-aqip-text-muted">12 agents en gap</span>
              </div>
              <div className="flex justify-between items-center">
                 <span className="text-sm font-bold text-aqip-danger">Capture biométrique (Photo)</span>
                 <span className="text-xs font-mono bg-aqip-bg-surface px-2 py-1 rounded text-aqip-text-muted">8 agents en gap</span>
              </div>
            </div>
          </div>
        );
      case 'q3':
        return (
          <div className="space-y-4">
            <p className="text-sm text-white">
              L'agent Koffi (Cotonou) présente une récurrence d'erreurs (FR-01) due à un déficit de compétence identifié :
            </p>
            <div className="bg-aqip-bg-elevated/50 p-4 rounded border border-aqip-border text-center">
              <h4 className="text-xs uppercase text-aqip-text-muted mb-2 font-semibold tracking-wider">Gap Principal</h4>
              <p className="text-lg font-bold text-aqip-danger">Contrôle qualité état civil</p>
              <p className="text-xs text-aqip-text-muted mt-1">Niveau actuel: 1/5 — Requis: 4/5</p>
            </div>
            <div className="bg-aqip-accent/10 p-4 rounded border border-aqip-accent/30 flex gap-3">
              <Sparkles className="h-5 w-5 text-aqip-accent shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-white">Action PDI requise</h4>
                <p className="text-sm text-aqip-text-muted mt-1">L'inscrire à la formation "Maîtrise transcription des noms" (2h, e-learning).</p>
              </div>
            </div>
          </div>
        );
      case 'q4':
        return (
          <div className="space-y-4">
            <p className="text-sm text-white">
              En croisant la fréquence des erreurs, leur coût estimé et le coût des formations, voici la formation la plus rentable :
            </p>
            <div className="bg-aqip-bg-elevated/50 p-4 rounded border border-aqip-border">
               <h4 className="text-sm font-bold text-aqip-primary">Maîtrise de la transcription des noms</h4>
               <p className="text-xs text-aqip-text-muted mt-1">E-learning — 2h</p>
               
               <div className="mt-4 grid grid-cols-2 gap-4">
                  <div>
                     <div className="text-[10px] text-aqip-text-muted uppercase">Coût de déploiement</div>
                     <div className="text-sm font-bold text-white">150,000 FCFA</div>
                  </div>
                  <div>
                     <div className="text-[10px] text-aqip-text-muted uppercase">Économie annuelle (Non-qualité)</div>
                     <div className="text-sm font-bold text-aqip-accent">1,200,000 FCFA</div>
                  </div>
               </div>
            </div>
            <p className="text-sm font-medium text-aqip-text-muted">
              Le ROI attendu est de <span className="text-white">800%</span> avec une réduction estimée de <span className="text-aqip-accent">-65%</span> des erreurs de frappe (FR-01).
            </p>
          </div>
        );
      case 'q5':
        return (
          <div className="space-y-4">
            <p className="text-sm text-white">
              Basé sur le volume d'erreurs non résolues et la profondeur des gaps de compétences :
            </p>
            <div className="space-y-2">
              <div className="flex justify-between items-center bg-aqip-danger/10 p-3 rounded border border-aqip-danger/30">
                <span className="text-sm font-medium text-white">Natitingou Centre</span>
                <span className="text-xs font-bold text-aqip-danger">35% d'agents en gap critique</span>
              </div>
              <div className="flex justify-between items-center bg-aqip-warning/10 p-3 rounded border border-aqip-warning/30">
                <span className="text-sm font-medium text-white">Parakou Centre</span>
                <span className="text-xs font-bold text-aqip-warning">15% d'agents en gap critique</span>
              </div>
            </div>
          </div>
        );
      default: return null;
    }
  };

  return (
    <div className="space-y-6 h-full flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Conseiller RH Intelligent</h1>
        <p className="text-sm text-aqip-text-muted mt-1">Analysez les causes des erreurs et optimisez le plan de développement des compétences.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-1 min-h-[600px]">
        {/* Liste des questions */}
        <div className="lg:col-span-1 space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-aqip-text-muted mb-4">Questions d'Analyse</h2>
          {QUESTIONS.map((q) => (
            <button
              key={q.id}
              onClick={() => setActiveQuestion(q.id)}
              className={clsx(
                "w-full text-left p-3 rounded-lg border transition-all duration-200 flex items-start gap-3",
                activeQuestion === q.id 
                  ? `bg-aqip-bg-elevated border-aqip-primary/50 shadow-md` 
                  : `bg-aqip-bg-surface/50 border-aqip-border hover:bg-aqip-bg-surface`
              )}
            >
              <ChevronRight className={clsx("h-4 w-4 shrink-0 mt-0.5 transition-colors", activeQuestion === q.id ? "text-aqip-primary" : "text-aqip-text-muted")} />
              <span className={clsx("text-sm", activeQuestion === q.id ? "text-white font-medium" : "text-aqip-text-muted")}>
                 {q.text}
              </span>
            </button>
          ))}
        </div>

        {/* Zone de réponse */}
        <AQIPCard className="lg:col-span-3 flex flex-col p-0 overflow-hidden" noPadding>
          <div className="flex-1 p-6 overflow-y-auto space-y-6 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-aqip-bg-elevated/20 via-aqip-bg-surface to-aqip-bg-base">
            
            {/* Message de bienvenue */}
            <div className="flex gap-4 max-w-2xl">
              <div className="h-10 w-10 rounded-full flex items-center justify-center shrink-0 bg-aqip-primary/20 text-aqip-primary">
                <Users className="h-5 w-5" />
              </div>
              <div className="bg-aqip-bg-elevated p-4 rounded-2xl rounded-tl-sm border border-aqip-border text-sm text-white">
                <p>Bonjour, je suis votre conseiller RH. Sélectionnez une question sur la gauche pour analyser les compétences et les erreurs de nos équipes de terrain.</p>
              </div>
            </div>

            {/* Réponse sélectionnée */}
            {activeQuestion && (
               <>
                 <div className="flex gap-4 max-w-2xl ml-auto flex-row-reverse animate-in fade-in slide-in-from-right-4 duration-300">
                   <div className="h-10 w-10 rounded-full bg-aqip-bg-elevated border border-aqip-border flex items-center justify-center shrink-0 text-white font-bold text-xs shadow-md">
                     VOUS
                   </div>
                   <div className="bg-aqip-bg-elevated border border-aqip-border p-4 rounded-2xl rounded-tr-sm text-sm text-white shadow-md">
                     <p>{QUESTIONS.find(q => q.id === activeQuestion)?.text}</p>
                   </div>
                 </div>

                 <div className="flex gap-4 max-w-3xl animate-in fade-in slide-in-from-left-4 duration-300">
                   <div className="h-10 w-10 rounded-full flex items-center justify-center shrink-0 shadow-lg bg-aqip-primary/20 text-aqip-primary border border-aqip-primary/30">
                     <Sparkles className="h-5 w-5" />
                   </div>
                   <div className="bg-aqip-bg-surface p-5 rounded-2xl rounded-tl-sm border shadow-lg border-aqip-primary/20">
                     {getResponse(activeQuestion)}
                   </div>
                 </div>
               </>
            )}

          </div>

          <div className="p-4 border-t border-aqip-border bg-aqip-bg-surface shrink-0">
            <div className="relative flex items-center opacity-50 cursor-not-allowed">
              <input
                type="text"
                disabled
                placeholder="Sélectionnez une question prédéfinie à gauche pour voir l'analyse..."
                className="w-full bg-aqip-bg-elevated border-aqip-border border text-white text-sm rounded-full pl-5 pr-12 py-3 cursor-not-allowed"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <button disabled className="absolute right-2 p-2 bg-aqip-bg-elevated border border-aqip-border rounded-full text-aqip-text-muted cursor-not-allowed">
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </AQIPCard>
      </div>
    </div>
  );
}
