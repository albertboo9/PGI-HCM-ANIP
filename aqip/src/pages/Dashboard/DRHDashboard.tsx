import { useMemo } from 'react';

import { Link } from 'react-router-dom';
import AQIPStatCard from '../../components/ui/AQIPStatCard';
import AQIPCard from '../../components/ui/AQIPCard';
import AQIPProgress from '../../components/ui/AQIPProgress';
import AQIPScoreRing from '../../components/ui/AQIPScoreRing';
import { Users, GraduationCap, AlertTriangle, DollarSign, Target, BookOpen, ArrowRight } from 'lucide-react';
import { useAgentStore } from '../../store/agentStore';
import { useIncidentStore } from '../../store/incidentStore';
import { getPriorityAgents } from '../../services/skillEngine';

const BUDGET_LINES = [
  { label: 'Formations Techniques', used: 12_000_000, total: 18_000_000 },
  { label: 'Séminaires Qualité', used: 5_500_000, total: 8_000_000 },
  { label: 'E-learning & LMS', used: 3_200_000, total: 10_000_000 },
  { label: 'Coaching Individuel', used: 8_000_000, total: 14_000_000 },
];

export default function DRHDashboard() {
  const agents = useAgentStore(s => s.getAll());
  const incidents = useIncidentStore(s => s.getAll());

  

  const priorityAgents = useMemo(() => getPriorityAgents(agents, incidents, 5), [agents, incidents]);

  const totalBudgetUsed = BUDGET_LINES.reduce((s, b) => s + b.used, 0);
  const totalBudget = BUDGET_LINES.reduce((s, b) => s + b.total, 0);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-2xl font-bold text-aqip-text-primary tracking-tight">Dashboard RH — Développement des Compétences</h1>
        <p className="text-sm text-aqip-text-muted mt-1">Pilotage des talents, résorption des gaps et retour sur investissement des formations.</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <AQIPStatCard title="Agents à Accompagner" value={priorityAgents.length.toString()} icon={Users} trend={-12} trendLabel="vs mois dernier" />
        <AQIPStatCard title="Gaps Identifiés" value="48" icon={AlertTriangle} color="danger" trend={-5} trendLabel="vs mois dernier" />
        <AQIPStatCard title="Formations Prescrites" value="89" icon={BookOpen} color="primary" />
        <AQIPStatCard title="Budget Consommé" value={`${Math.round(totalBudgetUsed / 1_000_000)}M`} icon={DollarSign} color="warning" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Score IQSP RH */}
        <AQIPCard className="flex flex-col items-center justify-center bg-gradient-to-br from-aqip-bg-surface to-aqip-primary/5 p-6">
          <AQIPScoreRing score={76} label="Couverture Gaps" size={140} strokeWidth={10} color="text-aqip-primary" />
          <div className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2 text-center">
            <div>
              <div className="text-xl font-bold text-aqip-text-primary">+26 pts</div>
              <div className="text-xs text-aqip-text-muted">Amélioration Moy.</div>
            </div>
            <div>
              <div className="text-xl font-bold text-aqip-text-primary">-65%</div>
              <div className="text-xs text-aqip-text-muted">Erreurs post-PDI</div>
            </div>
          </div>
        </AQIPCard>

        {/* Budget Formation */}
        <AQIPCard className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-aqip-text-primary flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-aqip-primary" />
              Budget Formation
            </h2>
            <div className="text-sm text-aqip-text-muted">
              <span className="font-bold text-aqip-text-primary">{(totalBudgetUsed / 1_000_000).toFixed(1)}M</span> / {(totalBudget / 1_000_000).toFixed(0)}M FCFA
            </div>
          </div>
          <div className="space-y-4">
            {BUDGET_LINES.map((line) => (
              <AQIPProgress 
                key={line.label}
                label={line.label}
                value={line.used}
                max={line.total}
                color={line.used / line.total > 0.85 ? 'danger' : line.used / line.total > 0.6 ? 'warning' : 'primary'}
              />
            ))}
          </div>
        </AQIPCard>
      </div>

      {/* Alertes Compétences */}
      <AQIPCard>
        <h2 className="text-lg font-semibold text-aqip-text-primary flex items-center gap-2 mb-4">
          <Target className="h-5 w-5 text-aqip-danger" />
          Agents Prioritaires — Plan de Développement Requis
        </h2>
        <div className="space-y-3">
          {priorityAgents.map(({ agent, totalGap, topGap, incidentCount }) => (
            <div key={agent.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-aqip-bg-elevated rounded-lg border border-aqip-border hover:border-aqip-primary/30 transition-colors gap-4">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-aqip-danger/10 flex items-center justify-center text-aqip-danger font-bold text-sm shrink-0">
                  {agent.prenom[0]}{agent.nom[0]}
                </div>
                <div>
                  <p className="text-sm font-medium text-aqip-text-primary">{agent.prenom} {agent.nom} — <span className="text-aqip-text-muted">{agent.poste}</span></p>
                  <p className="text-xs text-aqip-text-muted mt-0.5">
                    {incidentCount} incidents récents • Gap prioritaire : <span className="text-aqip-danger font-semibold">{topGap?.competenceLabel} (-{topGap?.gap} pts)</span>
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 sm:ml-auto">
                <div className="text-right hidden sm:block">
                  <div className="text-sm font-bold text-aqip-danger">Total Gap: {totalGap} pts</div>
                </div>
                <Link to={`/agent/${agent.id}/dossier`} className="px-4 py-2 text-xs font-medium text-white bg-aqip-primary rounded-md hover:bg-aqip-primary/90 transition-colors flex items-center gap-2">
                  Ouvrir le Dossier <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          ))}
          {priorityAgents.length === 0 && (
            <div className="p-8 text-center text-aqip-text-muted text-sm border border-dashed border-aqip-border rounded-lg">
              Aucun gap de compétence critique détecté actuellement.
            </div>
          )}
        </div>
      </AQIPCard>
    </div>
  );
}
