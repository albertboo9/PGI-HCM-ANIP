import { useState } from 'react';
import AQIPCard from '../../components/ui/AQIPCard';
import BeninMap from '../../components/maps/BeninMap';
import { Activity, Map, Users, Target, Zap } from 'lucide-react';

export default function DGExecDashboard() {
  const [activeLayer, setActiveLayer] = useState<'qualite' | 'satisfaction' | 'productivite'>('qualite');

  const mapData = [
    { id: 'ctr-001', nom: 'Cotonou Centre', latitude: 6.3667, longitude: 2.4333, statut: 'success', maturite: 'Contrôlé', agentsCount: 42 },
    { id: 'ctr-002', nom: 'Natitingou Centre', latitude: 10.3, longitude: 1.3833, statut: 'danger', maturite: 'Réactif', agentsCount: 18 },
    { id: 'ctr-003', nom: 'Porto-Novo Centre', latitude: 6.4973, longitude: 2.6051, statut: 'success', maturite: 'Standardisé', agentsCount: 25 },
    { id: 'ctr-004', nom: 'Parakou Centre', latitude: 9.3372, longitude: 2.6303, statut: 'warning', maturite: 'Contrôlé', agentsCount: 30 },
  ] as any;

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div>
        <h1 className="text-2xl font-bold text-aqip-text-primary tracking-tight">Executive Cockpit — Vision Nationale</h1>
        <p className="text-sm text-aqip-text-muted mt-1">Pilotage stratégique de la performance et de la qualité du service public.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 shrink-0">
        <AQIPCard className="flex items-center gap-4 border-aqip-accent/30 bg-gradient-to-br from-aqip-bg-surface to-aqip-accent/5">
          <div className="h-12 w-12 rounded-lg bg-aqip-accent/20 flex items-center justify-center">
            <Target className="h-6 w-6 text-aqip-accent" />
          </div>
          <div>
            <div className="text-sm font-medium text-aqip-text-muted">IQSP National</div>
            <div className="text-2xl font-bold text-aqip-text-primary">76 <span className="text-sm text-aqip-text-muted">/ 100</span></div>
          </div>
        </AQIPCard>
        
        <AQIPCard className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-lg bg-aqip-primary/20 flex items-center justify-center">
            <Activity className="h-6 w-6 text-aqip-primary" />
          </div>
          <div>
            <div className="text-sm font-medium text-aqip-text-muted">Production (30j)</div>
            <div className="text-2xl font-bold text-aqip-text-primary">18,524</div>
          </div>
        </AQIPCard>

        <AQIPCard className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-lg bg-aqip-warning/20 flex items-center justify-center">
            <Zap className="h-6 w-6 text-aqip-warning" />
          </div>
          <div>
            <div className="text-sm font-medium text-aqip-text-muted">Erreurs Détectées</div>
            <div className="text-2xl font-bold text-aqip-text-primary">427</div>
          </div>
        </AQIPCard>

        <AQIPCard className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-lg bg-aqip-danger/20 flex items-center justify-center">
            <Map className="h-6 w-6 text-aqip-danger" />
          </div>
          <div>
            <div className="text-sm font-medium text-aqip-text-muted">Centres en Alerte</div>
            <div className="text-2xl font-bold text-aqip-text-primary">3</div>
          </div>
        </AQIPCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-[500px]">
        <AQIPCard className="lg:col-span-2 flex flex-col p-0 overflow-hidden" noPadding>
          <div className="p-4 border-b border-aqip-border flex justify-between items-center bg-aqip-bg-surface shrink-0 z-10">
            <h2 className="text-lg font-semibold text-aqip-text-primary flex items-center gap-2">
              <Map className="h-5 w-5 text-aqip-primary" />
              Cartographie Intelligente
            </h2>
            <div className="flex bg-aqip-bg-elevated rounded-md p-1">
              <button 
                onClick={() => setActiveLayer('qualite')}
                className={`px-3 py-1.5 text-xs font-medium rounded-sm transition-colors ${activeLayer === 'qualite' ? 'bg-aqip-primary text-white shadow' : 'text-aqip-text-muted hover:text-aqip-text-primary'}`}
              >
                Qualité (IQSP)
              </button>
              <button 
                onClick={() => setActiveLayer('satisfaction')}
                className={`px-3 py-1.5 text-xs font-medium rounded-sm transition-colors ${activeLayer === 'satisfaction' ? 'bg-aqip-primary text-white shadow' : 'text-aqip-text-muted hover:text-aqip-text-primary'}`}
              >
                Satisfaction Citoyenne
              </button>
            </div>
          </div>
          <div className="flex-1 relative bg-black">
             <BeninMap data={mapData} layer={activeLayer} />
          </div>
        </AQIPCard>

        <AQIPCard className="flex flex-col">
          <h2 className="text-lg font-semibold text-aqip-text-primary flex items-center gap-2 mb-6">
            <Users className="h-5 w-5 text-aqip-primary" />
            Centres Prioritaires
          </h2>
          
          <div className="space-y-4 flex-1">
            <div className="bg-aqip-danger/10 border border-aqip-danger/20 p-4 rounded-lg">
              <div className="flex justify-between items-start mb-2">
                <div className="font-semibold text-aqip-text-primary">Natitingou Centre</div>
                <div className="text-xs font-bold text-aqip-danger">45 / 100</div>
              </div>
              <div className="text-xs text-aqip-text-muted mb-3">Tendance: <span className="text-aqip-danger">-8%</span> depuis 30j</div>
              <button className="w-full py-2 bg-aqip-bg-surface border border-aqip-danger/30 text-xs text-aqip-text-primary font-medium rounded hover:bg-aqip-danger/20 transition-colors">
                Analyser les causes (IA)
              </button>
            </div>

            <div className="bg-aqip-warning/10 border border-aqip-warning/20 p-4 rounded-lg">
              <div className="flex justify-between items-start mb-2">
                <div className="font-semibold text-aqip-text-primary">Parakou Centre</div>
                <div className="text-xs font-bold text-aqip-warning">68 / 100</div>
              </div>
              <div className="text-xs text-aqip-text-muted mb-3">Tendance: <span className="text-aqip-warning">-2%</span> depuis 30j</div>
              <button className="w-full py-2 bg-aqip-bg-surface border border-aqip-warning/30 text-xs text-aqip-text-primary font-medium rounded hover:bg-aqip-warning/20 transition-colors">
                Prescrire Formations
              </button>
            </div>
          </div>
        </AQIPCard>
      </div>
    </div>
  );
}
