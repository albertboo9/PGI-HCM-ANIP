import { useEffect } from 'react';
import AQIPStatCard from '../../components/ui/AQIPStatCard';
import AQIPCard from '../../components/ui/AQIPCard';
import AQIPScoreRing from '../../components/ui/AQIPScoreRing';
import AQIPProgress from '../../components/ui/AQIPProgress';
import { Briefcase, AlertTriangle, MessageSquare, Target, Clock, Users } from 'lucide-react';
import { useIncidentStore } from '../../store/incidentStore';

const AGENTS_CLASSEMENT = [
  { nom: 'Kossou Léa', poste: "Agent d'enrôlement", score: 92, trend: 5 },
  { nom: 'Adjo Pascal', poste: "Agent d'enrôlement", score: 88, trend: 2 },
  { nom: 'Bello Rachid', poste: 'Opérateur saisie', score: 75, trend: -3 },
  { nom: 'Dossou Claire', poste: 'Opérateur saisie', score: 61, trend: -8 },
  { nom: 'Zinsu Paul', poste: "Agent d'enrôlement", score: 55, trend: -12 },
];

const RECENT_INCIDENTS = [
  { ref: 'INC-2026-0042', erreur: 'Photo floue', gravite: 'Haute', agent: 'Zinsu P.', heure: '14:22' },
  { ref: 'INC-2026-0041', erreur: "Nom erroné (FR-01)", gravite: 'Critique', agent: 'Dossou C.', heure: '11:45' },
  { ref: 'INC-2026-0040', erreur: 'Empreinte illisible', gravite: 'Moyenne', agent: 'Bello R.', heure: '09:10' },
];

export default function CentreChefDashboard() {
  const { incidents, fetchIncidents } = useIncidentStore();

  useEffect(() => {
    if (incidents.length === 0) fetchIncidents();
  }, [incidents.length, fetchIncidents]);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-2xl font-bold text-aqip-text-primary tracking-tight">Cotonou Centre — Mon Centre</h1>
        <p className="text-sm text-aqip-text-muted mt-1">Supervision de mon équipe et des opérations de mon antenne.</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <AQIPStatCard title="Agents Actifs" value="42" icon={Briefcase} trend={0} trendLabel="stable" />
        <AQIPStatCard title="Incidents Jour" value="3" icon={AlertTriangle} color="danger" trend={-25} trendLabel="vs hier" />
        <AQIPStatCard title="NPS Centre" value="4.2 / 5" icon={MessageSquare} color="accent" trend={3} trendLabel="vs semaine" />
        <AQIPStatCard title="IQSP Local" value="82" icon={Target} color="warning" trend={1.5} trendLabel="vs mois" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Score du centre */}
        <AQIPCard className="flex flex-col items-center justify-center bg-gradient-to-br from-aqip-bg-surface to-aqip-accent/5 p-6">
          <AQIPScoreRing score={82} label="IQSP" size={140} strokeWidth={10} />
          <div className="mt-4 w-full space-y-2">
            <AQIPProgress label="Qualité Technique" value={88} color="accent" size="sm" />
            <AQIPProgress label="Qualité Linguistique" value={72} color="warning" size="sm" />
            <AQIPProgress label="Satisfaction Usager" value={84} color="primary" size="sm" />
          </div>
        </AQIPCard>

        {/* Incidents récents */}
        <AQIPCard className="lg:col-span-2" noPadding>
          <div className="p-4 border-b border-aqip-border flex items-center justify-between">
            <h2 className="text-lg font-semibold text-aqip-text-primary flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-aqip-danger" />
              Incidents Récents (Mon Centre)
            </h2>
            <span className="text-xs text-aqip-text-muted flex items-center gap-1">
              <Clock className="h-3 w-3" /> Mis à jour à l'instant
            </span>
          </div>
          <div className="divide-y divide-aqip-border">
            {RECENT_INCIDENTS.map((inc) => (
              <div key={inc.ref} className="flex items-center justify-between px-4 py-3 hover:bg-aqip-bg-elevated/50 transition-colors cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className={`h-2 w-2 rounded-full ${inc.gravite === 'Critique' ? 'bg-aqip-danger' : inc.gravite === 'Haute' ? 'bg-aqip-warning' : 'bg-aqip-primary'}`} />
                  <div>
                    <p className="text-sm font-medium text-aqip-text-primary">{inc.erreur}</p>
                    <p className="text-xs text-aqip-text-muted">{inc.ref} — {inc.agent}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${
                    inc.gravite === 'Critique' ? 'bg-aqip-danger/10 text-aqip-danger ring-aqip-danger/20' : 
                    inc.gravite === 'Haute' ? 'bg-aqip-warning/10 text-aqip-warning ring-aqip-warning/20' : 
                    'bg-aqip-primary/10 text-aqip-primary ring-aqip-primary/20'
                  }`}>
                    {inc.gravite}
                  </span>
                  <p className="text-xs text-aqip-text-muted mt-1">{inc.heure}</p>
                </div>
              </div>
            ))}
          </div>
        </AQIPCard>
      </div>

      {/* Classement agents */}
      <AQIPCard>
        <h2 className="text-lg font-semibold text-aqip-text-primary flex items-center gap-2 mb-4">
          <Users className="h-5 w-5 text-aqip-primary" />
          Performance Agents — Mon Équipe
        </h2>
        <div className="space-y-2">
          {AGENTS_CLASSEMENT.map((agent, i) => (
            <div key={agent.nom} className="flex items-center gap-4 p-3 bg-aqip-bg-elevated rounded-lg">
              <div className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold ${
                i === 0 ? 'bg-aqip-accent/20 text-aqip-accent' : 
                i === AGENTS_CLASSEMENT.length - 1 ? 'bg-aqip-danger/20 text-aqip-danger' : 
                'bg-aqip-bg-surface text-aqip-text-muted'
              }`}>
                {i + 1}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-aqip-text-primary truncate">{agent.nom}</p>
                <p className="text-xs text-aqip-text-muted">{agent.poste}</p>
              </div>
              <div className="w-24">
                <AQIPProgress 
                  value={agent.score} 
                  showValue={false} 
                  size="sm" 
                  color={agent.score >= 80 ? 'accent' : agent.score >= 60 ? 'warning' : 'danger'} 
                />
              </div>
              <div className="w-16 text-right">
                <span className="text-sm font-bold text-aqip-text-primary">{agent.score}</span>
                <span className={`block text-xs font-medium ${agent.trend > 0 ? 'text-aqip-accent' : 'text-aqip-danger'}`}>
                  {agent.trend > 0 ? '+' : ''}{agent.trend}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </AQIPCard>
    </div>
  );
}
