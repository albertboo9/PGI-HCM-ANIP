import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AQIPCard from '../../components/ui/AQIPCard';
import AQIPButton from '../../components/ui/AQIPButton';
import { Camera, User, ShieldCheck, AlertTriangle, BookOpen, ArrowRight, ChevronDown } from 'lucide-react';
import { useIncidentStore } from '../../store/incidentStore';
import { useAuthStore } from '../../store/authStore';
import { getSkillMapping } from '../../data/skillMap';
import type { CanalDetection } from '../../services/skillEngine';

const CANAUX: { value: CanalDetection; label: string }[] = [
  { value: 'controleur', label: 'Contrôleur Qualité' },
  { value: 'chef_centre', label: 'Chef de Centre' },
  { value: 'systeme', label: 'Système Automatique' },
  { value: 'citoyen', label: 'Réclamation Citoyen' },
];

export default function AgentWorkspacePage() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [canal, setCanal] = useState<CanalDetection>('controleur');
  const [formState, setFormState] = useState({ nom: 'Houngbédji', prenom: 'Jeane-Baptiste', commune: 'Cotonou' });
  const { addIncident } = useIncidentStore();
  const { currentUser } = useAuthStore();

  const errorCode = 'FR-01';
  const mapping = getSkillMapping(errorCode);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setShowResult(true);

      addIncident({
        id: `INC-SIM-${Date.now()}`,
        categorie: 'Saisie & Langue Française',
        codeErreur: errorCode,
        erreurLibelle: `Prénom erroné — "${formState.prenom}" (probable: "Jean-Baptiste")`,
        description: "Erreur de transcription détectée lors de la saisie RAVIP.",
        gravite: 'Haute',
        statut: 'nouveau',
        dateDetection: new Date().toISOString(),
        centreId: 'ctr-001',
        agentId: currentUser?.id || 'agt-001',
        coutEstime: 4000,
        canalDetection: canal,
      } as any);
    }, 1200);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-aqip-text-primary tracking-tight">Outil d'Enrôlement RAVIP</h1>
        <p className="text-sm text-aqip-text-muted mt-1">Saisie des données citoyens. Surveillance qualité active.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <AQIPCard className="md:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-6">
            <h2 className="text-lg font-semibold text-aqip-text-primary flex items-center gap-2 border-b border-aqip-border pb-3">
              <User className="h-5 w-5 text-aqip-primary" /> Informations Civiles
            </h2>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-medium text-aqip-text-muted">Nom de famille</label>
                <input type="text" value={formState.nom} onChange={e => setFormState({ ...formState, nom: e.target.value })} className="w-full px-3 py-2 bg-aqip-bg-surface border border-aqip-border rounded-md text-sm focus:border-aqip-primary outline-none text-white" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-aqip-text-muted">Prénoms</label>
                <div className="relative">
                  <input type="text" value={formState.prenom} onChange={e => setFormState({ ...formState, prenom: e.target.value })} className="w-full px-3 py-2 bg-aqip-bg-surface border-2 border-aqip-danger/50 rounded-md text-sm outline-none text-white" />
                  <div className="absolute right-2 top-1/2 -translate-y-1/2">
                    <span className="flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-aqip-primary opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-aqip-primary"></span></span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-aqip-text-muted">Commune de naissance</label>
              <input type="text" value={formState.commune} onChange={e => setFormState({ ...formState, commune: e.target.value })} className="w-full px-3 py-2 bg-aqip-bg-surface border border-aqip-border rounded-md text-sm focus:border-aqip-primary outline-none text-white" />
            </div>

            <h2 className="text-lg font-semibold text-aqip-text-primary flex items-center gap-2 border-b border-aqip-border pb-3 pt-2">
              <Camera className="h-5 w-5 text-aqip-primary" /> Capture Biométrique
            </h2>
            <div className="flex gap-4">
              <div className="h-28 w-28 border-2 border-dashed border-aqip-border rounded-lg flex flex-col items-center justify-center text-aqip-text-muted bg-aqip-bg-surface cursor-pointer hover:border-aqip-primary transition-colors">
                <Camera className="h-7 w-7 mb-1" /><span className="text-xs">Photo</span>
              </div>
              <div className="flex-1 border-2 border-dashed border-aqip-border rounded-lg flex flex-col items-center justify-center text-aqip-text-muted bg-aqip-bg-surface cursor-pointer hover:border-aqip-primary transition-colors">
                <ShieldCheck className="h-7 w-7 mb-1" /><span className="text-xs">Empreintes (Qualité: 92%)</span>
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <AQIPButton type="submit" isLoading={isSubmitting}>Valider & Enregistrer</AQIPButton>
            </div>
          </form>
        </AQIPCard>

        <AQIPCard className="bg-gradient-to-br from-aqip-bg-surface to-aqip-primary/5 border-aqip-primary/30 h-fit">
          <h3 className="font-semibold text-aqip-text-primary flex items-center gap-2 mb-3">
            <ShieldCheck className="h-5 w-5 text-aqip-primary" /> Contrôle Qualité
          </h3>
          <p className="text-xs text-aqip-text-muted mb-4">Le système vérifie automatiquement la conformité des saisies avant validation.</p>
          <div className="space-y-2">
            <label className="text-xs font-medium text-aqip-text-muted">Canal de détection (démo)</label>
            <div className="relative">
              <select value={canal} onChange={e => setCanal(e.target.value as CanalDetection)} className="w-full px-3 py-2 bg-aqip-bg-elevated border border-aqip-border rounded-md text-sm text-white appearance-none outline-none focus:border-aqip-primary">
                {CANAUX.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-aqip-text-muted pointer-events-none" />
            </div>
          </div>
        </AQIPCard>
      </div>

      {/* Résultat : la chaîne simple */}
      {showResult && mapping && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-aqip-bg-surface border border-aqip-border p-8 rounded-xl max-w-lg w-full shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="flex items-center gap-4 mb-6">
              <div className="h-12 w-12 rounded-full bg-aqip-danger/20 flex items-center justify-center shrink-0">
                <AlertTriangle className="h-6 w-6 text-aqip-danger" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">Erreur Détectée ({errorCode})</h2>
                <p className="text-sm text-aqip-text-muted">Canal : {CANAUX.find(c => c.value === canal)?.label}</p>
              </div>
            </div>

            {/* La chaîne causale — Simple, lisible, crédible */}
            <div className="space-y-4 mb-6">
              {[
                { step: 'Erreur', icon: AlertTriangle, color: 'text-aqip-danger bg-aqip-danger/10', text: mapping.errorLabel, sub: `"${formState.prenom}" → probable "Jean-Baptiste"` },
                { step: 'Compétence', icon: ShieldCheck, color: 'text-aqip-warning bg-aqip-warning/10', text: mapping.competenceLabel, sub: `Gap : ${mapping.niveauRequis - 2} points (niveau 2 → requis ${mapping.niveauRequis})` },
                { step: 'Formation', icon: BookOpen, color: 'text-aqip-primary bg-aqip-primary/10', text: mapping.formationLabel, sub: `${mapping.formationDuree} — ${mapping.formationType}` },
                { step: 'Objectif', icon: ArrowRight, color: 'text-aqip-accent bg-aqip-accent/10', text: mapping.impactAttendu, sub: `-${mapping.impactPourcentage}% d'erreurs similaires` },
              ].map((item, i) => (
                <div key={item.step} className="flex items-start gap-3">
                  <div className={`h-9 w-9 rounded-lg ${item.color} flex items-center justify-center shrink-0 mt-0.5`}>
                    <item.icon className="h-4.5 w-4.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-aqip-text-muted">{item.step}</div>
                    <div className="text-sm font-medium text-white">{item.text}</div>
                    <div className="text-xs text-aqip-text-muted">{item.sub}</div>
                  </div>
                  {i < 3 && <div className="absolute left-[34px] mt-10 h-4 w-px bg-aqip-border hidden" />}
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              <button onClick={() => setShowResult(false)} className="flex-1 px-4 py-2.5 bg-aqip-bg-elevated text-white text-sm font-medium rounded-md hover:bg-aqip-border transition-colors">
                Corriger la saisie
              </button>
              <button onClick={() => { setShowResult(false); navigate('/agent/agt-001/dossier'); }} className="flex-1 px-4 py-2.5 bg-aqip-primary text-white text-sm font-medium rounded-md hover:bg-aqip-primary/90 transition-colors flex items-center justify-center gap-2">
                Voir le Dossier <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
