import AQIPCard from '../../components/ui/AQIPCard';

export default function MatricePage() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-2xl font-bold text-aqip-text-primary tracking-tight">Matrice des Compétences</h1>
        <p className="text-sm text-aqip-text-muted mt-1">Heatmap Métiers / Compétences requises.</p>
      </div>

      <AQIPCard className="min-h-[500px] flex items-center justify-center border-dashed">
        <div className="text-center">
          <h2 className="text-lg font-semibold text-aqip-text-primary mb-2">Heatmap en cours d'intégration</h2>
          <p className="text-aqip-text-muted max-w-md mx-auto">
            La cartographie croisée des niveaux de maîtrise par rapport aux attendus sera affichée ici via Recharts.
          </p>
        </div>
      </AQIPCard>
    </div>
  );
}
