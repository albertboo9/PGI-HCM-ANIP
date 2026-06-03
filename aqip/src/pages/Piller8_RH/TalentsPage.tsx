import AQIPCard from '../../components/ui/AQIPCard';
import AQIPStatCard from '../../components/ui/AQIPStatCard';
import AQIPBadge from '../../components/ui/AQIPBadge';
import { Briefcase, TrendingUp, Users, Target } from 'lucide-react';

const TALENTS = [
  { nom: 'Adjo Pascal', role: 'Superviseur', performance: 'Élevée', potentiel: 'Élevé', box: '9 - Future Leader' },
  { nom: 'Kossou Léa', role: "Agent d'enrôlement", performance: 'Élevée', potentiel: 'Modéré', box: '8 - Top Performer' },
  { nom: 'Mensah Kofi', role: 'Opérateur saisie', performance: 'Faible', potentiel: 'Modéré', box: '2 - En Développement' },
  { nom: 'Zinsu Paul', role: "Agent d'enrôlement", performance: 'Moyenne', potentiel: 'Faible', box: '4 - Performer Solide' },
];

const MATRIX_GRID = [
  { id: 7, title: 'Enigme', desc: 'Potentiel Élevé, Perf Faible', count: 1 },
  { id: 8, title: 'Haut Potentiel', desc: 'Potentiel Élevé, Perf Moyenne', count: 3 },
  { id: 9, title: 'Future Leader', desc: 'Potentiel Élevé, Perf Élevée', count: 5, highlight: true },
  
  { id: 4, title: 'En Développement', desc: 'Potentiel Modéré, Perf Faible', count: 4 },
  { id: 5, title: 'Performer Clé', desc: 'Potentiel Modéré, Perf Moyenne', count: 12 },
  { id: 6, title: 'Top Performer', desc: 'Potentiel Modéré, Perf Élevée', count: 8 },
  
  { id: 1, title: 'Risque de Sous-Perf.', desc: 'Potentiel Faible, Perf Faible', count: 2 },
  { id: 2, title: 'Performer Solide', desc: 'Potentiel Faible, Perf Moyenne', count: 15 },
  { id: 3, title: 'Expert Confirmé', desc: 'Potentiel Faible, Perf Élevée', count: 6 },
];

export default function TalentsPage() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-aqip-text-primary tracking-tight">Matrice 9-Box</h1>
          <p className="text-sm text-aqip-text-muted mt-1">Évaluation croisée des performances et du potentiel des agents.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <AQIPStatCard title="Agents Évalués" value="56 / 82" icon={Users} color="primary" />
        <AQIPStatCard title="Future Leaders" value="5" icon={TrendingUp} color="accent" />
        <AQIPStatCard title="Plans d'Action Requis" value="7" icon={Target} color="danger" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <AQIPCard className="lg:col-span-2">
          <h2 className="text-lg font-semibold text-aqip-text-primary mb-6">Matrice de Placement</h2>
          <div className="relative">
            {/* Axes Labels */}
            <div className="absolute -left-6 top-1/2 -translate-y-1/2 -rotate-90 text-xs font-bold text-aqip-text-muted tracking-widest uppercase">
              Potentiel
            </div>
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs font-bold text-aqip-text-muted tracking-widest uppercase">
              Performance
            </div>
            
            <div className="grid grid-cols-3 gap-2">
              {MATRIX_GRID.map((box) => (
                <div 
                  key={box.id} 
                  className={`p-4 rounded-lg border ${
                    box.highlight ? 'bg-aqip-accent/10 border-aqip-accent/30' : 'bg-aqip-bg-elevated border-aqip-border'
                  } hover:border-aqip-primary/50 transition-colors cursor-pointer min-h-[120px] flex flex-col`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-bold text-aqip-text-muted">Box {box.id}</span>
                    <span className={`text-lg font-bold ${box.highlight ? 'text-aqip-accent' : 'text-aqip-text-primary'}`}>
                      {box.count}
                    </span>
                  </div>
                  <h3 className="text-sm font-semibold text-white leading-tight">{box.title}</h3>
                  <p className="text-[10px] text-aqip-text-muted mt-auto pt-2">{box.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </AQIPCard>

        <AQIPCard>
          <h2 className="text-lg font-semibold text-aqip-text-primary flex items-center gap-2 mb-4">
            <Briefcase className="h-5 w-5 text-aqip-primary" />
            Top Talents
          </h2>
          <div className="space-y-3">
            {TALENTS.map((talent) => (
              <div key={talent.nom} className="p-3 bg-aqip-bg-elevated rounded-lg border border-aqip-border">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-white">{talent.nom}</p>
                    <p className="text-xs text-aqip-text-muted">{talent.role}</p>
                  </div>
                  <AQIPBadge variant={talent.box.includes('9') ? 'success' : talent.box.includes('2') ? 'warning' : 'default'}>
                    {talent.box.split('-')[0].trim()}
                  </AQIPBadge>
                </div>
                <div className="mt-2 text-xs flex gap-4 text-aqip-text-muted">
                  <span>Perf: <strong className="text-white">{talent.performance}</strong></span>
                  <span>Pot: <strong className="text-white">{talent.potentiel}</strong></span>
                </div>
              </div>
            ))}
          </div>
        </AQIPCard>
      </div>
    </div>
  );
}
