import { useEffect } from 'react';
import AQIPStatCard from '../../components/ui/AQIPStatCard';
import AQIPCard from '../../components/ui/AQIPCard';
import AQIPProgress from '../../components/ui/AQIPProgress';
import AQIPScoreRing from '../../components/ui/AQIPScoreRing';
import { Users, GraduationCap, TrendingUp, AlertTriangle, DollarSign, Target } from 'lucide-react';
import { useAgentStore } from '../../store/agentStore';

const TALENT_ALERTS = [
  { name: 'Koffi Abena', role: "Agent d'enrôlement", region: 'Atacora', delta: -15, metric: 'Erreurs biométriques en hausse' },
  { name: 'Mensah Kofi', role: 'Opérateur saisie', region: 'Littoral', delta: -22, metric: 'Fautes FR-01 récurrentes' },
  { name: 'Adjovi Grâce', role: 'Superviseur', region: 'Ouémé', delta: -8, metric: 'NPS centre en baisse' },
];

const BUDGET_LINES = [
  { label: 'Formations Techniques', used: 12_000_000, total: 18_000_000 },
  { label: 'Séminaires Qualité', used: 5_500_000, total: 8_000_000 },
  { label: 'E-learning & LMS', used: 3_200_000, total: 10_000_000 },
  { label: 'Coaching Individuel', used: 8_000_000, total: 14_000_000 },
];

export default function DRHDashboard() {
  const { agents, fetchAgents } = useAgentStore();

  useEffect(() => {
    if (agents.length === 0) fetchAgents();
  }, [agents.length, fetchAgents]);

  const totalBudgetUsed = BUDGET_LINES.reduce((s, b) => s + b.used, 0);
  const totalBudget = BUDGET_LINES.reduce((s, b) => s + b.total, 0);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-2xl font-bold text-aqip-text-primary tracking-tight">Dashboard RH Stratégique</h1>
        <p className="text-sm text-aqip-text-muted mt-1">Pilotage des talents, compétences et budget de formation.</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <AQIPStatCard title="Effectif Total" value={agents.length > 0 ? agents.length.toLocaleString() : '1,452'} icon={Users} trend={2.5} trendLabel="vs mois dernier" />
        <AQIPStatCard title="Budget Consommé" value={`${Math.round(totalBudgetUsed / 1_000_000)}M`} icon={DollarSign} color="warning" />
        <AQIPStatCard title="ROI Formation" value="342%" icon={TrendingUp} color="accent" trend={18} trendLabel="vs Q1" />
        <AQIPStatCard title="Gaps Critiques" value="48" icon={AlertTriangle} color="danger" trend={-12} trendLabel="vs mois dernier" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Score IQSP RH */}
        <AQIPCard className="flex flex-col items-center justify-center bg-gradient-to-br from-aqip-bg-surface to-aqip-primary/5 p-6">
          <AQIPScoreRing score={72} label="Score RH" size={140} strokeWidth={10} />
          <div className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2 text-center">
            <div>
              <div className="text-xl font-bold text-aqip-text-primary">89%</div>
              <div className="text-xs text-aqip-text-muted">Rétention</div>
            </div>
            <div>
              <div className="text-xl font-bold text-aqip-text-primary">76%</div>
              <div className="text-xs text-aqip-text-muted">Compétences</div>
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
          Alertes Compétences — Actions Requises
        </h2>
        <div className="space-y-3">
          {TALENT_ALERTS.map((alert) => (
            <div key={alert.name} className="flex items-center justify-between p-4 bg-aqip-bg-elevated rounded-lg border border-aqip-border hover:border-aqip-danger/30 transition-colors">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-aqip-danger/10 flex items-center justify-center text-aqip-danger font-bold text-sm">
                  {alert.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <p className="text-sm font-medium text-aqip-text-primary">{alert.name} — <span className="text-aqip-text-muted">{alert.role}</span></p>
                  <p className="text-xs text-aqip-text-muted">{alert.region} — {alert.metric}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm font-bold text-aqip-danger">{alert.delta}%</span>
                <button className="px-3 py-1.5 text-xs font-medium text-aqip-primary bg-aqip-primary/10 rounded-md hover:bg-aqip-primary/20 transition-colors">
                  Prescrire PDI
                </button>
              </div>
            </div>
          ))}
        </div>
      </AQIPCard>
    </div>
  );
}
