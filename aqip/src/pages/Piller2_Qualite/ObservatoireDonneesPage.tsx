import AQIPCard from '../../components/ui/AQIPCard';

export default function ObservatoireDonneesPage() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-2xl font-bold text-aqip-text-primary tracking-tight">Observatoire de la Donnée</h1>
        <p className="text-sm text-aqip-text-muted mt-1">Focus sur la Qualité Linguistique (IQL) et la saisie État Civil.</p>
      </div>

      <AQIPCard className="min-h-[500px] flex items-center justify-center border-dashed">
        <div className="text-center">
          <h2 className="text-lg font-semibold text-aqip-text-primary mb-2">Dashboard Qualité Linguistique en construction</h2>
          <p className="text-aqip-text-muted max-w-md mx-auto">
            Les graphiques Recharts détaillant les fautes d'orthographe et de grammaire (Série FR-XX) seront intégrés ici.
          </p>
        </div>
      </AQIPCard>
    </div>
  );
}
