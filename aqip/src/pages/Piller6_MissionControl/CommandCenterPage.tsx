import AQIPCard from '../../components/ui/AQIPCard';
import BeninMap from '../../components/maps/BeninMap';
import { ShieldAlert, Activity } from 'lucide-react';
import { useCentreStore } from '../../store/centreStore';
import { useEffect } from 'react';

export default function CommandCenterPage() {
  const { centres, fetchCentres } = useCentreStore();

  useEffect(() => {
    if (centres.length === 0) fetchCentres();
  }, [centres.length, fetchCentres]);

  const mapData = centres.map(c => ({
    id: c.id,
    nom: c.nom,
    latitude: c.latitude,
    longitude: c.longitude,
    statut: c.statut === 'alerte' ? 'danger' : c.statut === 'ferme' ? 'warning' : 'success',
    maturite: c.maturite,
    agentsCount: c.agentsCount
  })) as any;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 h-full flex flex-col">
      <div className="shrink-0 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-aqip-danger tracking-tight flex items-center gap-2">
            <ShieldAlert className="h-6 w-6" />
            Command Center
          </h1>
          <p className="text-sm text-aqip-text-muted mt-1">Supervision temps réel et gestion des crises.</p>
        </div>
        <div className="flex items-center gap-2 text-aqip-accent animate-pulse">
          <Activity className="h-4 w-4" />
          <span className="text-sm font-bold">Système Nominal</span>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-[500px]">
        <AQIPCard className="lg:col-span-2 flex flex-col p-0 overflow-hidden border-aqip-danger/30" noPadding>
          <div className="p-4 border-b border-aqip-border bg-aqip-bg-surface flex justify-between">
            <h2 className="font-semibold text-aqip-text-primary">Carte de Déploiement</h2>
          </div>
          <div className="flex-1 relative bg-black">
            <BeninMap data={mapData} layer="qualite" />
          </div>
        </AQIPCard>

        <AQIPCard className="border-aqip-warning/30 flex flex-col">
          <h2 className="font-semibold text-aqip-text-primary mb-4">Flux en Temps Réel</h2>
          <div className="flex-1 border-2 border-dashed border-aqip-border rounded-lg flex items-center justify-center text-aqip-text-muted text-center p-4">
            Flux de données opérationnelles et alertes de sécurité en cours d'intégration.
          </div>
        </AQIPCard>
      </div>
    </div>
  );
}
