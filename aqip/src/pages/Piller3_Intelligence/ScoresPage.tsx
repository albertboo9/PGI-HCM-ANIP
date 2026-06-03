import AQIPCard from '../../components/ui/AQIPCard';
import AQIPStatCard from '../../components/ui/AQIPStatCard';
import { Target, TrendingUp, AlertTriangle, Activity } from 'lucide-react';

const SCORE_EVOLUTION = [
  { label: 'Cotonou', technique: 88, linguistique: 72, usager: 84 },
  { label: 'Parakou', technique: 65, linguistique: 68, usager: 70 },
  { label: 'Natitingou', technique: 45, linguistique: 50, usager: 40 },
  { label: 'Porto-Novo', technique: 92, linguistique: 85, usager: 90 },
];

export default function ScoresPage() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-aqip-text-primary tracking-tight">Scores & Intelligence</h1>
          <p className="text-sm text-aqip-text-muted mt-1">Décomposition détaillée de l'IQSP (Indice de Qualité du Service Public).</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <AQIPStatCard title="Qualité Technique" value="82.5" icon={Target} color="primary" trend={1.2} />
        <AQIPStatCard title="Qualité Linguistique" value="68.0" icon={AlertTriangle} color="warning" trend={-2.4} />
        <AQIPStatCard title="Satisfaction Usager" value="84.2" icon={TrendingUp} color="success" trend={4.1} />
        <AQIPStatCard title="Fiabilité Biométrique" value="94.8" icon={Activity} color="accent" trend={0.5} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AQIPCard>
          <h2 className="text-lg font-semibold text-aqip-text-primary mb-6">Comparatif par Centre Majeur</h2>
          <div className="space-y-6">
            {SCORE_EVOLUTION.map((c) => (
              <div key={c.label}>
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-medium text-white">{c.label}</span>
                  <span className="font-bold text-aqip-text-muted">
                    {Math.round((c.technique + c.linguistique + c.usager) / 3)} global
                  </span>
                </div>
                <div className="flex h-3 rounded-full overflow-hidden">
                  <div style={{ width: `${c.technique}%` }} className="bg-aqip-primary opacity-90" title={`Technique: ${c.technique}`} />
                  <div style={{ width: `${c.linguistique}%` }} className="bg-aqip-warning opacity-90" title={`Linguistique: ${c.linguistique}`} />
                  <div style={{ width: `${c.usager}%` }} className="bg-aqip-success opacity-90" title={`Usager: ${c.usager}`} />
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-4 mt-6 text-xs text-aqip-text-muted justify-center">
            <div className="flex items-center gap-1"><div className="w-3 h-3 bg-aqip-primary rounded-sm"/> Technique</div>
            <div className="flex items-center gap-1"><div className="w-3 h-3 bg-aqip-warning rounded-sm"/> Linguistique</div>
            <div className="flex items-center gap-1"><div className="w-3 h-3 bg-aqip-success rounded-sm"/> Usager</div>
          </div>
        </AQIPCard>

        <AQIPCard className="flex flex-col justify-center items-center p-8 bg-gradient-to-br from-aqip-bg-surface to-aqip-primary/5">
          <div className="text-center space-y-4">
            <div className="h-16 w-16 bg-aqip-primary/20 rounded-full flex items-center justify-center mx-auto">
              <Activity className="h-8 w-8 text-aqip-primary" />
            </div>
            <h2 className="text-xl font-bold text-white">Digital Twin (Jumeau Numérique)</h2>
            <p className="text-sm text-aqip-text-muted max-w-sm">
              L'algorithme IA génère des prédictions sur les scores du mois prochain en fonction des tendances actuelles et des formations assignées.
            </p>
            <button className="px-6 py-2 bg-aqip-primary text-white rounded-md font-medium shadow-lg hover:bg-aqip-primary/90 transition-all mt-4">
              Lancer la Simulation IA
            </button>
          </div>
        </AQIPCard>
      </div>
    </div>
  );
}
