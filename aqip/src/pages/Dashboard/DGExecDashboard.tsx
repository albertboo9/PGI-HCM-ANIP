import { useState } from 'react';
import AQIPCard from '../../components/ui/AQIPCard';
import BeninMap from '../../components/maps/BeninMap';
import { Map, Users, Target, BookOpen, AlertTriangle, ArrowRight, TrendingUp } from 'lucide-react';

export default function DGExecDashboard() {
  const [activeLayer, setActiveLayer] = useState<'gaps' | 'erreurs'>('gaps');

  const mapData = [
    { id: 'ctr-001', nom: 'Cotonou Centre', latitude: 6.3667, longitude: 2.4333, statut: 'warning', maturite: 'Gaps critiques: 12%', agentsCount: 42 },
    { id: 'ctr-002', nom: 'Natitingou Centre', latitude: 10.3, longitude: 1.3833, statut: 'danger', maturite: 'Gaps critiques: 35%', agentsCount: 18 },
    { id: 'ctr-003', nom: 'Porto-Novo Centre', latitude: 6.4973, longitude: 2.6051, statut: 'success', maturite: 'Gaps critiques: 5%', agentsCount: 25 },
    { id: 'ctr-004', nom: 'Parakou Centre', latitude: 9.3372, longitude: 2.6303, statut: 'warning', maturite: 'Gaps critiques: 15%', agentsCount: 30 },
  ] as any;

  return (
    <div className="space-y-6 h-full flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-2xl font-bold text-aqip-text-primary tracking-tight">Executive Cockpit — HCM Intelligence</h1>
        <p className="text-sm text-aqip-text-muted mt-1">Pilotage national du développement des compétences et de l'amélioration continue.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 shrink-0">
        <AQIPCard className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-lg bg-aqip-danger/20 flex items-center justify-center">
            <AlertTriangle className="h-6 w-6 text-aqip-danger" />
          </div>
          <div>
            <div className="text-sm font-medium text-aqip-text-muted">Erreurs (30j)</div>
            <div className="text-2xl font-bold text-aqip-text-primary">427</div>
          </div>
        </AQIPCard>
        
        <AQIPCard className="flex items-center gap-4 border-aqip-warning/30 bg-gradient-to-br from-aqip-bg-surface to-aqip-warning/5">
          <div className="h-12 w-12 rounded-lg bg-aqip-warning/20 flex items-center justify-center">
            <Users className="h-6 w-6 text-aqip-warning" />
          </div>
          <div>
            <div className="text-sm font-medium text-aqip-text-muted">Agents en PDI</div>
            <div className="text-2xl font-bold text-aqip-text-primary">89 <span className="text-sm text-aqip-text-muted">/ 427</span></div>
          </div>
        </AQIPCard>

        <AQIPCard className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-lg bg-aqip-primary/20 flex items-center justify-center">
            <BookOpen className="h-6 w-6 text-aqip-primary" />
          </div>
          <div>
            <div className="text-sm font-medium text-aqip-text-muted">Formations Actives</div>
            <div className="text-2xl font-bold text-aqip-text-primary">34</div>
          </div>
        </AQIPCard>

        <AQIPCard className="flex items-center gap-4 border-aqip-accent/30 bg-gradient-to-br from-aqip-bg-surface to-aqip-accent/5">
          <div className="h-12 w-12 rounded-lg bg-aqip-accent/20 flex items-center justify-center">
            <TrendingUp className="h-6 w-6 text-aqip-accent" />
          </div>
          <div>
            <div className="text-sm font-medium text-aqip-text-muted">Amélioration Moy.</div>
            <div className="text-2xl font-bold text-aqip-accent">+26 pts</div>
          </div>
        </AQIPCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-[500px]">
        {/* Colonne 1 : La chaîne de valeur (Le pourquoi) */}
        <AQIPCard className="flex flex-col">
          <h2 className="text-lg font-semibold text-aqip-text-primary flex items-center gap-2 mb-6">
            <Target className="h-5 w-5 text-aqip-primary" />
            Chaîne de Valeur (YTD)
          </h2>
          
          <div className="flex-1 flex flex-col justify-center gap-6 px-4">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-full bg-aqip-danger/20 flex items-center justify-center shrink-0">
                <AlertTriangle className="h-7 w-7 text-aqip-danger" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">427</div>
                <div className="text-sm text-aqip-text-muted">Erreurs Identifiées</div>
              </div>
            </div>

            <div className="flex justify-center -my-2"><ArrowRight className="h-6 w-6 text-aqip-border rotate-90" /></div>

            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-full bg-aqip-warning/20 flex items-center justify-center shrink-0">
                <Target className="h-7 w-7 text-aqip-warning" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">412</div>
                <div className="text-sm text-aqip-text-muted">Causes Compétences Mappées</div>
              </div>
            </div>

            <div className="flex justify-center -my-2"><ArrowRight className="h-6 w-6 text-aqip-border rotate-90" /></div>

            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-full bg-aqip-primary/20 flex items-center justify-center shrink-0">
                <BookOpen className="h-7 w-7 text-aqip-primary" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">89</div>
                <div className="text-sm text-aqip-text-muted">Formations Prescrites</div>
              </div>
            </div>

            <div className="flex justify-center -my-2"><ArrowRight className="h-6 w-6 text-aqip-border rotate-90" /></div>

            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-full bg-aqip-accent/20 flex items-center justify-center shrink-0">
                <TrendingUp className="h-7 w-7 text-aqip-accent" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">67</div>
                <div className="text-sm text-aqip-text-muted">Compétences Améliorées</div>
              </div>
            </div>
          </div>
        </AQIPCard>

        {/* Colonne 2 et 3 : La carte (Le où) */}
        <AQIPCard className="lg:col-span-2 flex flex-col p-0 overflow-hidden" noPadding>
          <div className="p-4 border-b border-aqip-border flex justify-between items-center bg-aqip-bg-surface shrink-0 z-10">
            <h2 className="text-lg font-semibold text-aqip-text-primary flex items-center gap-2">
              <Map className="h-5 w-5 text-aqip-primary" />
              Localisation des Gaps (Où intervenir ?)
            </h2>
            <div className="flex bg-aqip-bg-elevated rounded-md p-1">
              <button 
                onClick={() => setActiveLayer('gaps')}
                className={`px-3 py-1.5 text-xs font-medium rounded-sm transition-colors ${activeLayer === 'gaps' ? 'bg-aqip-primary text-white shadow' : 'text-aqip-text-muted hover:text-aqip-text-primary'}`}
              >
                Déficits de Compétences
              </button>
              <button 
                onClick={() => setActiveLayer('erreurs')}
                className={`px-3 py-1.5 text-xs font-medium rounded-sm transition-colors ${activeLayer === 'erreurs' ? 'bg-aqip-primary text-white shadow' : 'text-aqip-text-muted hover:text-aqip-text-primary'}`}
              >
                Volume d'Erreurs
              </button>
            </div>
          </div>
          <div className="flex-1 relative bg-black">
             <BeninMap data={mapData} layer={activeLayer as any} />
          </div>
        </AQIPCard>
      </div>
    </div>
  );
}
