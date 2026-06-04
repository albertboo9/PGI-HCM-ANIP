import { useEffect, useState } from 'react';

import { useParams, useNavigate } from 'react-router-dom';
import { useIncidentStore } from '../../store/incidentStore';
import type { Incident } from '../../types';
import AQIPCard from '../../components/ui/AQIPCard';
import AQIPBadge from '../../components/ui/AQIPBadge';
import { ArrowLeft, BrainCircuit, CheckCircle, Clock, Search, ShieldAlert, Sparkles, User, GraduationCap } from 'lucide-react';

export default function IncidentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const incidents = useIncidentStore(s => s.getAll());
  const [incident, setIncident] = useState<Incident | null>(null);

  

  useEffect(() => {
    if (id && incidents.length > 0) {
      const found = incidents.find(i => i.id === id);
      if (found) setIncident(found);
    }
  }, [id, incidents]);

  if (!incident) return <div className="p-8 text-center text-aqip-text-muted">Chargement de l'incident...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate('/incidents')}
          className="p-2 hover:bg-aqip-bg-elevated rounded-full transition-colors text-aqip-text-muted hover:text-white"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-white tracking-tight">Incident {incident.id}</h1>
            <AQIPBadge variant={incident.gravite === 'Critique' ? 'danger' : incident.gravite === 'Haute' ? 'warning' : 'info'}>
              {incident.gravite}
            </AQIPBadge>
            <AQIPBadge variant={incident.statut === 'resolu' ? 'success' : incident.statut === 'analyse' ? 'warning' : 'default'}>
              {incident.statut.toUpperCase()}
            </AQIPBadge>
          </div>
          <p className="text-sm text-aqip-text-muted mt-1">
            Lié au dossier <strong>{incident.dossierRef || 'N/A'}</strong> ({incident.citoyen || 'N/A'})
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Colonne gauche : Informations de base */}
        <div className="space-y-6 lg:col-span-1">
          <AQIPCard>
            <h2 className="text-lg font-semibold text-white flex items-center gap-2 mb-4">
              <Search className="h-5 w-5 text-aqip-primary" />
              Détails de l'Erreur
            </h2>
            <div className="space-y-4">
              <div>
                <div className="text-xs text-aqip-text-muted mb-1 uppercase tracking-wider">Catégorie</div>
                <div className="text-sm font-medium text-white">{incident.categorie}</div>
              </div>
              <div>
                <div className="text-xs text-aqip-text-muted mb-1 uppercase tracking-wider">Code & Libellé</div>
                <div className="text-sm font-medium text-white">{incident.codeErreur} — {incident.erreurLibelle}</div>
              </div>
              {incident.valeurSaisie && (
                <div className="bg-aqip-bg-elevated/50 p-3 rounded-md border border-aqip-border">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-xs text-aqip-danger mb-1">Saisi</div>
                      <div className="text-sm font-mono text-white line-through">{incident.valeurSaisie}</div>
                    </div>
                    <div>
                      <div className="text-xs text-aqip-accent mb-1">Attendu</div>
                      <div className="text-sm font-mono text-white">{incident.valeurAttendue}</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </AQIPCard>

          <AQIPCard>
            <h2 className="text-lg font-semibold text-white flex items-center gap-2 mb-4">
              <User className="h-5 w-5 text-aqip-primary" />
              Agent & Centre
            </h2>
            <div className="space-y-4">
              <div>
                <div className="text-xs text-aqip-text-muted mb-1 uppercase tracking-wider">Agent</div>
                <div className="text-sm font-medium text-white">{incident.agentId}</div>
              </div>
              <div>
                <div className="text-xs text-aqip-text-muted mb-1 uppercase tracking-wider">Centre</div>
                <div className="text-sm font-medium text-white">{incident.centreId}</div>
              </div>
              <div className="pt-2 border-t border-aqip-border">
                <div className="text-xs text-aqip-text-muted mb-1 uppercase tracking-wider">Impact Financier Estimé</div>
                <div className="text-lg font-bold text-aqip-danger">-{incident.coutEstime?.toLocaleString() || 0} FCFA</div>
                <div className="text-xs text-aqip-text-muted mt-1">Basé sur le temps de correction et la gêne occasionnée.</div>
              </div>
            </div>
          </AQIPCard>
        </div>

        {/* Colonne droite : IA et Plan d'action */}
        <div className="lg:col-span-2 space-y-6">
          <AQIPCard className="border-aqip-primary/30 relative overflow-hidden">
            {/* Effet lumineux de fond pour l'IA */}
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-aqip-primary/10 rounded-full blur-3xl" />
            
            <h2 className="text-lg font-semibold text-white flex items-center gap-2 mb-4 relative">
              <BrainCircuit className="h-5 w-5 text-aqip-primary" />
              Diagnostic IA Expert (ANIP)
            </h2>
            
            <div className="bg-aqip-bg-elevated/40 p-4 rounded-lg border border-aqip-primary/20 relative space-y-4">
              <div className="flex items-start gap-4">
                <div className="mt-1">
                  <ShieldAlert className="h-5 w-5 text-aqip-warning" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-white">Cause Racine Probable (Confiance: 94%)</h3>
                  <p className="text-sm text-aqip-text-muted mt-1">{incident.causeProbable}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="mt-1">
                  <Clock className="h-5 w-5 text-aqip-danger" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-white">Impact Métier</h3>
                  <p className="text-sm text-aqip-text-muted mt-1">{incident.impact}</p>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-sm font-medium text-white flex items-center gap-2 mb-3">
                <Sparkles className="h-4 w-4 text-aqip-gold" />
                Recommandation Automatique
              </h3>
              <div className="bg-aqip-accent/5 p-4 rounded-lg border border-aqip-accent/20 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 bg-aqip-accent/20 rounded-full flex items-center justify-center">
                    <GraduationCap className="h-5 w-5 text-aqip-accent" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white">Prescription PDI : Module "{incident.categorie}"</div>
                    <div className="text-xs text-aqip-accent mt-0.5">ROI estimé de la formation : 145%</div>
                  </div>
                </div>
                <button className="px-4 py-2 bg-aqip-accent text-white text-sm font-medium rounded-md hover:bg-aqip-accent/90 transition-colors shadow-lg shadow-aqip-accent/20">
                  Valider la prescription
                </button>
              </div>
            </div>
          </AQIPCard>

          <AQIPCard>
            <h2 className="text-lg font-semibold text-white flex items-center gap-2 mb-4">
              <CheckCircle className="h-5 w-5 text-aqip-primary" />
              Timeline de l'Incident
            </h2>
            <div className="relative border-l border-aqip-border ml-3 mt-4 space-y-6">
              <div className="relative pl-6">
                <div className="absolute left-[-5px] top-1 h-2.5 w-2.5 rounded-full bg-aqip-danger ring-4 ring-aqip-bg-surface" />
                <div className="text-xs text-aqip-text-muted mb-1">Aujourd'hui à 09:15</div>
                <div className="text-sm font-medium text-white">Détection de l'erreur</div>
                <div className="text-sm text-aqip-text-muted">Système de contrôle qualité biométrique</div>
              </div>
              <div className="relative pl-6">
                <div className="absolute left-[-5px] top-1 h-2.5 w-2.5 rounded-full bg-aqip-primary ring-4 ring-aqip-bg-surface" />
                <div className="text-xs text-aqip-text-muted mb-1">Aujourd'hui à 09:16</div>
                <div className="text-sm font-medium text-white">Analyse IA complétée</div>
                <div className="text-sm text-aqip-text-muted">Identification de la cause racine et calcul du ROI</div>
              </div>
              <div className="relative pl-6 opacity-50">
                <div className="absolute left-[-5px] top-1 h-2.5 w-2.5 rounded-full bg-aqip-border ring-4 ring-aqip-bg-surface" />
                <div className="text-xs text-aqip-text-muted mb-1">En attente</div>
                <div className="text-sm font-medium text-white">Validation du plan d'action</div>
              </div>
            </div>
          </AQIPCard>
        </div>
      </div>
    </div>
  );
}
