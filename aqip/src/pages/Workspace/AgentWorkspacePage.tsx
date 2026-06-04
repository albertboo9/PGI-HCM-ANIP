import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AQIPCard from '../../components/ui/AQIPCard';
import AQIPButton from '../../components/ui/AQIPButton';
import { Camera, User, ShieldCheck, CheckCircle2, Bell } from 'lucide-react';
import { useIncidentStore } from '../../store/incidentStore';
import { useAuthStore } from '../../store/authStore';

export default function AgentWorkspacePage() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [formState, setFormState] = useState({ nom: 'Houngbédji', prenom: 'Jeane-Baptiste', commune: 'Cotonou' });
  const { addIncident } = useIncidentStore();
  const { currentUser } = useAuthStore();

  const errorCode = 'FR-01'; // Faute de frappe

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // 1. Sauvegarde "réussie" (Temps réel)
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      
      // Reset form visually
      setFormState({ nom: '', prenom: '', commune: '' });

      // 2. Simulation Asynchrone : Détection a posteriori (Contrôle Qualité)
      setTimeout(() => {
        setIsSuccess(false);
        setShowNotification(true);
        
        // This is now a real API POST call to JSON-server
        addIncident({
          id: `INC-SIM-${Date.now()}`,
          categorie: 'Saisie & Langue Française',
          codeErreur: errorCode,
          erreurLibelle: `Prénom erroné — "Jeane-Baptiste" (Faute orthographe)`,
          description: "Erreur de transcription détectée lors du contrôle qualité différé.",
          gravite: 'Haute',
          statut: 'nouveau',
          dateDetection: new Date().toISOString(),
          centreId: 'ctr-001',
          agentId: currentUser?.id || 'agt-001',
          coutEstime: 4000,
          canalDetection: 'controleur',
        } as any);

        // Hide notification after 8s
        setTimeout(() => setShowNotification(false), 8000);
      }, 4000); // 4 secondes après la saisie
    }, 800);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl mx-auto relative">
      <div>
        <h1 className="text-2xl font-bold text-aqip-text-primary tracking-tight">Outil d'Enrôlement RAVIP</h1>
        <p className="text-sm text-aqip-text-muted mt-1">Saisie des données citoyens. (Simulation HCM Asynchrone vers Base de Données)</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <AQIPCard className="md:col-span-2 shadow-[var(--aqip-shadow-md)]">
          {isSuccess ? (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
              <div className="h-16 w-16 bg-aqip-accent/10 rounded-full flex items-center justify-center">
                <CheckCircle2 className="h-8 w-8 text-aqip-accent" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-aqip-text-primary">Dossier Enregistré</h3>
                <p className="text-sm text-aqip-text-muted mt-1">Le dossier a été transmis avec succès pour production.</p>
              </div>
              <AQIPButton onClick={() => setIsSuccess(false)} variant="outline" className="mt-4">
                Saisir un nouveau dossier
              </AQIPButton>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <h2 className="text-lg font-semibold text-aqip-text-primary flex items-center gap-2 border-b border-aqip-border pb-3">
                <User className="h-5 w-5 text-aqip-primary" /> Informations Civiles
              </h2>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-aqip-text-muted">Nom de famille</label>
                  <input type="text" value={formState.nom} onChange={e => setFormState({ ...formState, nom: e.target.value })} className="w-full px-3 py-2.5 bg-aqip-bg-surface border border-aqip-border rounded-lg text-sm focus:border-aqip-primary focus:ring-1 focus:ring-aqip-primary outline-none text-aqip-text-primary shadow-sm transition-all" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-aqip-text-muted">Prénoms</label>
                  <input type="text" value={formState.prenom} onChange={e => setFormState({ ...formState, prenom: e.target.value })} className="w-full px-3 py-2.5 bg-aqip-bg-surface border border-aqip-border rounded-lg text-sm focus:border-aqip-primary focus:ring-1 focus:ring-aqip-primary outline-none text-aqip-text-primary shadow-sm transition-all" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-aqip-text-muted">Commune de naissance</label>
                <input type="text" value={formState.commune} onChange={e => setFormState({ ...formState, commune: e.target.value })} className="w-full px-3 py-2.5 bg-aqip-bg-surface border border-aqip-border rounded-lg text-sm focus:border-aqip-primary focus:ring-1 focus:ring-aqip-primary outline-none text-aqip-text-primary shadow-sm transition-all" />
              </div>

              <h2 className="text-lg font-semibold text-aqip-text-primary flex items-center gap-2 border-b border-aqip-border pb-3 pt-2">
                <Camera className="h-5 w-5 text-aqip-primary" /> Capture Biométrique
              </h2>
              <div className="flex gap-4">
                <div className="h-28 w-28 border-2 border-dashed border-aqip-border rounded-xl flex flex-col items-center justify-center text-aqip-text-muted bg-aqip-bg-elevated cursor-pointer hover:border-aqip-primary hover:text-aqip-primary transition-colors">
                  <Camera className="h-7 w-7 mb-1" /><span className="text-xs font-medium">Photo</span>
                </div>
                <div className="flex-1 border-2 border-dashed border-aqip-border rounded-xl flex flex-col items-center justify-center text-aqip-text-muted bg-aqip-bg-elevated cursor-pointer hover:border-aqip-primary hover:text-aqip-primary transition-colors">
                  <ShieldCheck className="h-7 w-7 mb-1" /><span className="text-xs font-medium">Empreintes (Simulées OK)</span>
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <AQIPButton type="submit" isLoading={isSubmitting}>Valider & Enregistrer</AQIPButton>
              </div>
            </form>
          )}
        </AQIPCard>

        <AQIPCard className="bg-aqip-bg-surface border-aqip-border h-fit shadow-[var(--aqip-shadow-sm)]">
          <h3 className="font-semibold text-aqip-text-primary flex items-center gap-2 mb-3">
            <ShieldCheck className="h-5 w-5 text-aqip-primary" /> Workflow Asynchrone PGI
          </h3>
          <p className="text-xs text-aqip-text-muted mb-4 leading-relaxed">
            Dans un véritable PGI HCM, le système ne bloque pas l'agent. <br/><br/>
            L'agent valide son travail. S'il commet une erreur, elle est détectée <strong>en aval</strong> (par l'IA, le contrôle qualité ou le citoyen).
          </p>
          <div className="p-3 bg-aqip-bg-elevated rounded-lg text-xs text-aqip-text-secondary border border-aqip-border font-medium">
            1. Laissez l'erreur ("Jeane-Baptiste")<br/>
            2. Cliquez sur Valider<br/>
            3. Attendez 4 secondes... l'incident sera enregistré dans la DB!
          </div>
        </AQIPCard>
      </div>

      {/* Notification Différée (Push) */}
      {showNotification && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-right-8 fade-in duration-500">
          <div className="bg-aqip-bg-surface border-l-4 border-aqip-warning shadow-xl p-4 rounded-r-xl max-w-sm flex items-start gap-3 ring-1 ring-black/5">
            <div className="bg-aqip-warning/10 p-2 rounded-full shrink-0">
              <Bell className="h-5 w-5 text-aqip-warning" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-aqip-text-primary">Retour Qualité (A posteriori)</h4>
              <p className="text-xs text-aqip-text-muted mt-1">
                Une non-conformité a été relevée sur l'un de vos dossiers récents (Code: FR-01). L'incident a été remonté à votre superviseur via l'API.
              </p>
              <button onClick={() => navigate('/dashboard')} className="text-xs text-aqip-primary font-bold mt-2 hover:underline">
                Voir mon espace de développement
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
