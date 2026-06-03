import { useEffect } from 'react';
import AQIPStatCard from '../../components/ui/AQIPStatCard';
import AQIPCard from '../../components/ui/AQIPCard';
import AQIPScoreRing from '../../components/ui/AQIPScoreRing';
import AQIPProgress from '../../components/ui/AQIPProgress';
import { AlertTriangle, TrendingDown, DollarSign, Target, FileText, ShieldCheck } from 'lucide-react';
import { useIncidentStore } from '../../store/incidentStore';

const ERROR_FAMILIES = [
  { famille: 'Biométrie', count: 142, pct: 33 },
  { famille: 'Saisie & Langue FR', count: 198, pct: 46 },
  { famille: 'Accueil & Citoyen', count: 87, pct: 21 },
];

const TOP_ERRORS = [
  { code: 'FR-01', label: "Faute d'orthographe nom/prénom", count: 84, trend: -5 },
  { code: 'BIO-01', label: 'Photo floue / mal éclairée', count: 62, trend: 12 },
  { code: 'FR-04', label: 'Nom de commune erroné', count: 52, trend: -2 },
  { code: 'BIO-03', label: 'Empreintes illisibles', count: 38, trend: 8 },
];

export default function QualiteDashboard() {
  const { incidents, fetchIncidents, getTotalNonQualityCost } = useIncidentStore();

  useEffect(() => {
    if (incidents.length === 0) fetchIncidents();
  }, [incidents.length, fetchIncidents]);

  const activeIncidents = incidents.filter(i => i.statut !== 'resolu').length;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-2xl font-bold text-aqip-text-primary tracking-tight">Dashboard Qualité Opérationnelle</h1>
        <p className="text-sm text-aqip-text-muted mt-1">Suivi des erreurs, taxonomie et observatoire linguistique.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <AQIPStatCard title="Incidents Actifs" value={activeIncidents} icon={AlertTriangle} color="danger" />
        <AQIPStatCard title="CNQ (30j)" value={`${(getTotalNonQualityCost() / 1000).toFixed(0)}K`} icon={DollarSign} color="warning" />
        <AQIPStatCard title="Taux Résolution" value="78%" icon={TrendingDown} color="accent" trend={14} />
        <AQIPStatCard title="Audits Conformes" value="12/14" icon={ShieldCheck} color="primary" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <AQIPCard className="flex flex-col items-center justify-center bg-gradient-to-br from-aqip-bg-surface to-aqip-warning/5 p-6">
          <AQIPScoreRing score={76} label="IQL National" size={140} strokeWidth={10} />
          <p className="text-xs text-aqip-text-muted mt-4 text-center">Indice Qualité Linguistique</p>
        </AQIPCard>

        <AQIPCard className="lg:col-span-2">
          <h2 className="text-lg font-semibold text-aqip-text-primary flex items-center gap-2 mb-4">
            <FileText className="h-5 w-5 text-aqip-danger" /> Répartition par Famille d'Erreurs
          </h2>
          <div className="space-y-4">
            {ERROR_FAMILIES.map((f) => (
              <AQIPProgress 
                key={f.famille} 
                label={`${f.famille} (${f.count})`} 
                value={f.pct} 
                color={f.pct > 40 ? 'danger' : f.pct > 25 ? 'warning' : 'primary'} 
              />
            ))}
          </div>
        </AQIPCard>
      </div>

      <AQIPCard>
        <h2 className="text-lg font-semibold text-aqip-text-primary flex items-center gap-2 mb-4">
          <Target className="h-5 w-5 text-aqip-warning" /> Top Erreurs les Plus Fréquentes
        </h2>
        <div className="space-y-2">
          {TOP_ERRORS.map((err) => (
            <div key={err.code} className="flex items-center justify-between p-3 bg-aqip-bg-elevated rounded-lg">
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs font-semibold text-aqip-text-muted bg-aqip-bg-surface px-2 py-1 rounded">{err.code}</span>
                <p className="text-sm text-aqip-text-primary">{err.label}</p>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm font-bold text-aqip-text-primary">{err.count} cas</span>
                <span className={`text-xs font-medium ${err.trend > 0 ? 'text-aqip-danger' : 'text-aqip-accent'}`}>
                  {err.trend > 0 ? '+' : ''}{err.trend}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </AQIPCard>
    </div>
  );
}
