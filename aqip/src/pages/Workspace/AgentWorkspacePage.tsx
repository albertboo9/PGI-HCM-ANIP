import { useState } from 'react';
import AQIPCard from '../../components/ui/AQIPCard';
import AQIPButton from '../../components/ui/AQIPButton';
import { Camera, User, FileText, AlertTriangle, ShieldCheck, CheckCircle2, BookOpen } from 'lucide-react';
import { useIncidentStore } from '../../store/incidentStore';
import { useAuthStore } from '../../store/authStore';

export default function AgentWorkspacePage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAIModal, setShowAIModal] = useState(false);
  const [formState, setFormState] = useState({ nom: 'Houngbédji', prenom: 'Jeane-Baptiste', npi: '1234567890' });
  const { addIncident } = useIncidentStore();
  const { currentUser } = useAuthStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simuler un appel réseau
    setTimeout(() => {
      setIsSubmitting(false);
      // Déclencher l'alerte IA
      setShowAIModal(true);
      
      // Ajouter l'incident dans le store global
      addIncident({
        id: `INC-SIM-${Date.now()}`,
        categorie: 'Linguistique',
        codeErreur: 'FR-01',
        erreurLibelle: "Erreur détectée sur Prénom (Orthographe)",
        description: "L'IA a détecté une anomalie orthographique (Jeane au lieu de Jean) lors de la saisie RAVIP.",
        gravite: 'Moyenne',
        statut: 'nouveau',
        dateDetection: new Date().toISOString(),
        centreId: 'ctr-001',
        agentId: currentUser?.id || 'usr-001',
        coutEstime: 15000
      });
      
    }, 1500);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-aqip-text-primary tracking-tight">Outil d'Enrôlement RAVIP</h1>
        <p className="text-sm text-aqip-text-muted mt-1">Saisie des données citoyens. Surveillance Qualité Active.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Formulaire Principal */}
        <AQIPCard className="md:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-6">
            <h2 className="text-lg font-semibold text-aqip-text-primary flex items-center gap-2 border-b border-aqip-border pb-3">
              <User className="h-5 w-5 text-aqip-primary" /> Informations Civiles
            </h2>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-medium text-aqip-text-muted">Nom de famille</label>
                <input 
                  type="text" 
                  value={formState.nom}
                  onChange={e => setFormState({...formState, nom: e.target.value})}
                  className="w-full px-3 py-2 bg-aqip-bg-surface border border-aqip-border rounded-md text-sm focus:border-aqip-primary focus:ring-1 focus:ring-aqip-primary outline-none text-white" 
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-aqip-text-muted">Prénoms</label>
                <div className="relative">
                  <input 
                    type="text" 
                    value={formState.prenom}
                    onChange={e => setFormState({...formState, prenom: e.target.value})}
                    className="w-full px-3 py-2 bg-aqip-bg-surface border-2 border-aqip-danger/50 rounded-md text-sm focus:border-aqip-primary outline-none text-white" 
                  />
                  {/* Petit indice visuel que le jumeau numérique surveille */}
                  <div className="absolute right-2 top-1/2 -translate-y-1/2">
                    <span className="flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-aqip-primary opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-aqip-primary"></span>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-aqip-text-muted">NPI (Optionnel)</label>
              <input 
                type="text" 
                value={formState.npi}
                onChange={e => setFormState({...formState, npi: e.target.value})}
                className="w-full px-3 py-2 bg-aqip-bg-surface border border-aqip-border rounded-md text-sm focus:border-aqip-primary outline-none text-white font-mono" 
              />
            </div>

            <h2 className="text-lg font-semibold text-aqip-text-primary flex items-center gap-2 border-b border-aqip-border pb-3 pt-4">
              <Camera className="h-5 w-5 text-aqip-primary" /> Capture Biométrique
            </h2>
            
            <div className="flex gap-4">
              <div className="h-32 w-32 border-2 border-dashed border-aqip-border rounded-lg flex flex-col items-center justify-center text-aqip-text-muted bg-aqip-bg-surface hover:border-aqip-primary transition-colors cursor-pointer">
                <Camera className="h-8 w-8 mb-2" />
                <span className="text-xs font-medium">Photo Face</span>
              </div>
              <div className="flex-1 border-2 border-dashed border-aqip-border rounded-lg flex flex-col items-center justify-center text-aqip-text-muted bg-aqip-bg-surface hover:border-aqip-primary transition-colors cursor-pointer">
                <ShieldCheck className="h-8 w-8 mb-2" />
                <span className="text-xs font-medium">Empreintes Digitales</span>
                <span className="text-[10px] text-aqip-success mt-1">Qualité: 92%</span>
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <AQIPButton type="submit" isLoading={isSubmitting}>
                Valider & Enregistrer
              </AQIPButton>
            </div>
          </form>
        </AQIPCard>

        {/* Panneau d'assistance IA */}
        <div className="space-y-6">
          <AQIPCard className="bg-gradient-to-br from-aqip-bg-surface to-aqip-primary/5 border-aqip-primary/30">
            <h3 className="font-semibold text-aqip-text-primary flex items-center gap-2 mb-2">
              <ShieldCheck className="h-5 w-5 text-aqip-primary" /> Jumeau Numérique
            </h3>
            <p className="text-xs text-aqip-text-muted mb-4">
              L'IA analyse vos saisies en temps réel pour prévenir les erreurs avant validation (Poka-Yoke).
            </p>
            <div className="bg-aqip-bg-elevated p-3 rounded-md text-xs font-medium text-aqip-success flex items-center gap-2 border border-aqip-success/20">
              <CheckCircle2 className="h-4 w-4" /> Analyse continue activée
            </div>
          </AQIPCard>

          <AQIPCard>
            <h3 className="font-semibold text-aqip-text-primary flex items-center gap-2 mb-4">
              <FileText className="h-5 w-5 text-aqip-text-muted" /> Raccourcis
            </h3>
            <ul className="space-y-2 text-sm text-aqip-text-muted">
              <li className="hover:text-white cursor-pointer transition-colors">Guide de l'orthographe</li>
              <li className="hover:text-white cursor-pointer transition-colors">Normes photos ANIP</li>
              <li className="hover:text-white cursor-pointer transition-colors">Signaler un problème IT</li>
            </ul>
          </AQIPCard>
        </div>
      </div>

      {/* Modal IA d'erreur */}
      {showAIModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-aqip-bg-surface border border-aqip-border p-6 rounded-xl max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="flex items-center gap-4 mb-4">
              <div className="h-12 w-12 rounded-full bg-aqip-danger/20 flex items-center justify-center shrink-0">
                <AlertTriangle className="h-6 w-6 text-aqip-danger" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">Anomalie Détectée (FR-01)</h2>
                <p className="text-sm text-aqip-danger font-medium">Validation interrompue par l'IA</p>
              </div>
            </div>
            
            <p className="text-sm text-aqip-text-secondary mb-4">
              Le système a détecté une faute d'orthographe probable sur le prénom saisi : <span className="font-bold text-white bg-aqip-danger/20 px-1 rounded">"Jeane"</span> au lieu de <span className="font-bold text-white bg-aqip-success/20 px-1 rounded">"Jean"</span>.
            </p>

            <div className="bg-aqip-bg-elevated p-4 rounded-lg mb-6 border border-aqip-border">
              <h4 className="text-xs font-bold uppercase tracking-wider text-aqip-text-muted mb-2">Action Corrective Automatique</h4>
              <p className="text-sm text-white flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-aqip-warning" /> Incident généré dans le journal
              </p>
              <p className="text-sm text-white flex items-center gap-2 mt-2">
                <BookOpen className="h-4 w-4 text-aqip-primary" /> Module prescrit : "Orthographe"
              </p>
            </div>

            <div className="flex gap-3 justify-end">
              <button 
                onClick={() => setShowAIModal(false)}
                className="px-4 py-2 bg-aqip-bg-elevated text-white text-sm font-medium rounded-md hover:bg-aqip-border transition-colors"
              >
                Corriger la saisie
              </button>
              <button 
                onClick={() => setShowAIModal(false)}
                className="px-4 py-2 bg-aqip-danger text-white text-sm font-medium rounded-md hover:bg-aqip-danger/90 transition-colors"
              >
                Forcer (Non Recommandé)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
