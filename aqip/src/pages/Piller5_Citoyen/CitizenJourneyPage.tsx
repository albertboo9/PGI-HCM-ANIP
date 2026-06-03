import { useNavigate } from 'react-router-dom';
import AQIPCard from '../../components/ui/AQIPCard';
import AQIPBadge from '../../components/ui/AQIPBadge';
import { ArrowLeft, MapPin, Calendar, Clock, AlertTriangle, CheckCircle, Smartphone } from 'lucide-react';

export default function CitizenJourneyPage() {
  const navigate = useNavigate();

  const journeySteps = [
    {
      id: 1,
      titre: "Demande de NPI en ligne",
      statut: "termine",
      date: "05/04/2026 - 10:15",
      icon: Smartphone,
      details: "Portail e-service ANIP. Soumission des pièces justificatives.",
      kpi: "Temps: 12 min",
      sentiment: "positif"
    },
    {
      id: 2,
      titre: "Enrôlement Biométrique",
      statut: "incident",
      date: "10/04/2026 - 09:30",
      icon: MapPin,
      details: "Centre de Cotonou. Agent: Jean Ahouangon.",
      kpi: "Attente: 45 min",
      incidentRef: "FR-01",
      sentiment: "negatif"
    },
    {
      id: 3,
      titre: "Correction d'anomalie",
      statut: "alerte",
      date: "12/04/2026 - 14:20",
      icon: AlertTriangle,
      details: "Détection d'une faute sur le nom (ADJOVY). Correction automatique après signalement.",
      kpi: "Retard: +2 jours",
      sentiment: "neutre"
    },
    {
      id: 4,
      titre: "Validation & Production",
      statut: "termine",
      date: "14/04/2026 - 11:00",
      icon: CheckCircle,
      details: "Dossier validé par le centre de production national.",
      kpi: "SLA respecté",
      sentiment: "positif"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate('/citoyen')}
          className="p-2 hover:bg-aqip-bg-elevated rounded-full transition-colors text-aqip-text-muted hover:text-white"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Cycle de Vie Citoyen : Dossier #ENR-004582</h1>
          <p className="text-sm text-aqip-text-muted mt-1">
            Analyse détaillée du parcours de <strong>Mme DOSSOU</strong>.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <AQIPCard className="lg:col-span-1 space-y-6">
          <div className="text-center pb-6 border-b border-aqip-border">
            <div className="h-20 w-20 bg-aqip-bg-elevated rounded-full mx-auto flex items-center justify-center border-2 border-aqip-primary/50 text-2xl font-bold text-aqip-primary mb-3">
              MD
            </div>
            <h2 className="text-lg font-bold text-white">Mme DOSSOU</h2>
            <div className="text-sm text-aqip-text-muted">Citoyenne</div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-aqip-text-muted">Satisfaction globale</span>
              <AQIPBadge variant="success">4 / 5</AQIPBadge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-aqip-text-muted">Temps de traitement</span>
              <span className="text-sm font-medium text-white">9 Jours</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-aqip-text-muted">Incidents rencontrés</span>
              <span className="text-sm font-medium text-aqip-danger">1 Anomalie</span>
            </div>
          </div>

          <div className="pt-6 border-t border-aqip-border">
            <h3 className="text-sm font-medium text-white mb-2">Feedback laissé</h3>
            <p className="text-sm text-aqip-text-muted italic bg-aqip-bg-elevated p-3 rounded-md">
              "Processus fluide mais attente un peu longue au guichet biométrique. Heureusement, mon document a été délivré à temps."
            </p>
          </div>
        </AQIPCard>

        <AQIPCard className="lg:col-span-2">
          <h2 className="text-lg font-semibold text-white mb-6">Chronologie du Parcours</h2>
          <div className="relative border-l border-aqip-border ml-4 space-y-8">
            {journeySteps.map((step) => (
              <div key={step.id} className="relative pl-8">
                <div className={`absolute left-[-16px] top-0 h-8 w-8 rounded-full flex items-center justify-center ring-4 ring-aqip-bg-surface
                  ${step.statut === 'termine' ? 'bg-aqip-accent/20 text-aqip-accent' : 
                    step.statut === 'incident' ? 'bg-aqip-danger/20 text-aqip-danger' : 
                    'bg-aqip-warning/20 text-aqip-warning'}`}
                >
                  <step.icon className="h-4 w-4" />
                </div>
                
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-1">
                  <h3 className="text-base font-bold text-white">{step.titre}</h3>
                  <div className="flex items-center gap-2 text-xs text-aqip-text-muted mt-1 sm:mt-0">
                    <Calendar className="h-3 w-3" />
                    {step.date}
                  </div>
                </div>
                
                <p className="text-sm text-aqip-text-muted mb-3">{step.details}</p>
                
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center gap-1 text-xs font-medium bg-aqip-bg-elevated px-2 py-1 rounded-md text-aqip-text-primary">
                    <Clock className="h-3 w-3" />
                    {step.kpi}
                  </span>
                  
                  {step.incidentRef && (
                    <span 
                      onClick={() => navigate('/incidents')}
                      className="cursor-pointer inline-flex items-center gap-1 text-xs font-medium bg-aqip-danger/10 px-2 py-1 rounded-md text-aqip-danger border border-aqip-danger/20 hover:bg-aqip-danger/20 transition-colors"
                    >
                      <AlertTriangle className="h-3 w-3" />
                      Voir l'incident {step.incidentRef}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </AQIPCard>
      </div>
    </div>
  );
}
