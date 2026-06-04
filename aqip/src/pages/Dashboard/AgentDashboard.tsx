import { useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import AQIPStatCard from '../../components/ui/AQIPStatCard';
import AQIPCard from '../../components/ui/AQIPCard';
import AQIPScoreRing from '../../components/ui/AQIPScoreRing';
import AQIPProgress from '../../components/ui/AQIPProgress';
import { BookOpen, Target, AlertTriangle, TrendingUp, Clock, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useAgentStore } from '../../store/agentStore';
import { useIncidentStore } from '../../store/incidentStore';
import { getAgentSkillGaps, getRecommendedFormations } from '../../services/skillEngine';

export default function AgentDashboard() {
  const { currentUser } = useAuthStore();
  const { agents, fetchAgents } = useAgentStore();
  const { incidents, fetchIncidents } = useIncidentStore();

  const agentId = currentUser?.id || 'agt-001'; // Fallback to Jean Ahouangon

  useEffect(() => {
    if (agents.length === 0) fetchAgents();
    if (incidents.length === 0) fetchIncidents();
  }, [agents.length, incidents.length, fetchAgents, fetchIncidents]);

  const agent = agents.find(a => a.id === agentId);
  const agentIncidents = useMemo(() => incidents.filter(i => i.agentId === agentId), [incidents, agentId]);
  
  const gaps = useMemo(() => agent ? getAgentSkillGaps(agent, incidents) : [], [agent, incidents]);
  const formations = useMemo(() => getRecommendedFormations(gaps), [gaps]);

  if (!agent) return null;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-aqip-text-primary tracking-tight">Mon Espace Développement</h1>
          <p className="text-sm text-aqip-text-muted mt-1">Performances, compétences et parcours de formation.</p>
        </div>
        <Link 
          to={`/agent/${agent.id}/dossier`} 
          className="px-5 py-2.5 bg-aqip-primary text-white text-sm font-medium rounded-lg hover:bg-aqip-primary/90 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-aqip-primary/20"
        >
          <BookOpen className="h-4 w-4" /> Mon Dossier Complet <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <AQIPStatCard title="Score Actuel" value={`${agent.scores.composite}%`} icon={Target} trend={3} trendLabel="vs mois" />
        <AQIPStatCard title="Erreurs (30j)" value={agentIncidents.length.toString()} icon={AlertTriangle} color={agentIncidents.length > 0 ? "danger" : "success"} />
        <AQIPStatCard title="Gaps Identifiés" value={gaps.length.toString()} icon={ShieldCheck} color="warning" />
        <AQIPStatCard title="Formations PDI" value={formations.length.toString()} icon={BookOpen} color="primary" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <AQIPCard className="flex flex-col items-center justify-center bg-gradient-to-br from-aqip-bg-surface to-aqip-primary/5 p-6">
          <AQIPScoreRing score={agent.scores.composite} label="Score" size={140} strokeWidth={10} />
          <div className="mt-3 flex items-center gap-1 text-aqip-accent text-sm font-medium">
            <TrendingUp className="h-4 w-4" /> En amélioration
          </div>
        </AQIPCard>

        <AQIPCard className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-aqip-text-primary flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-aqip-warning" /> Gaps de Compétences
            </h2>
          </div>
          <div className="space-y-4">
            {gaps.length > 0 ? gaps.map((g) => (
              <div key={g.competenceId} className="flex flex-col sm:flex-row sm:items-center gap-4 border-b border-aqip-border pb-4 last:border-0 last:pb-0">
                <div className="w-full sm:w-48 text-sm text-aqip-text-primary flex items-center gap-2 font-medium">
                  <AlertTriangle className="h-4 w-4 text-aqip-danger shrink-0" />
                  {g.competenceLabel}
                </div>
                <div className="flex-1">
                  <AQIPProgress value={g.niveauActuel} max={5} showValue={false} size="md" color="danger" />
                </div>
                <div className="flex items-center justify-between sm:justify-end gap-4 sm:w-32">
                  <span className="text-sm font-bold text-aqip-danger">{g.niveauActuel} / {g.niveauRequis}</span>
                  <span className="text-xs text-aqip-text-muted bg-aqip-bg-elevated px-2 py-1 rounded">-{g.gap} pts</span>
                </div>
              </div>
            )) : (
              <div className="text-center text-aqip-text-muted text-sm py-4">Aucun gap critique détecté. Vous êtes à jour !</div>
            )}
          </div>
        </AQIPCard>
      </div>

      <AQIPCard>
        <h2 className="text-lg font-semibold text-aqip-text-primary flex items-center gap-2 mb-4">
          <BookOpen className="h-5 w-5 text-aqip-primary" /> Mon Plan de Développement Individuel (PDI)
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {formations.length > 0 ? formations.map((f) => (
            <div key={f.formationId} className="p-4 bg-aqip-bg-elevated rounded-lg border border-aqip-border flex flex-col h-full">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-sm font-semibold text-white leading-tight">{f.formationLabel}</p>
                  <p className="text-xs text-aqip-text-muted flex items-center gap-1 mt-1.5">
                    <Clock className="h-3 w-3" /> {f.duree} — {f.type}
                  </p>
                </div>
                <span className="px-2 py-1 bg-aqip-primary/10 text-aqip-primary text-[10px] font-bold uppercase rounded">
                  Recommandé
                </span>
              </div>
              <p className="text-xs text-aqip-text-secondary mt-auto mb-4 bg-aqip-bg-surface p-2 rounded">
                Objectif : {f.impactAttendu}
              </p>
              <div className="flex items-center gap-3">
                <AQIPProgress value={0} size="sm" className="flex-1" />
                <button className="px-3 py-1.5 text-xs font-medium bg-aqip-primary text-white rounded-md hover:bg-aqip-primary/90 transition-colors shrink-0">
                  Démarrer
                </button>
              </div>
            </div>
          )) : (
             <div className="col-span-full text-center text-aqip-text-muted text-sm py-6 border border-dashed border-aqip-border rounded-lg">
                Aucune formation n'est actuellement requise.
             </div>
          )}
        </div>
      </AQIPCard>
    </div>
  );
}
