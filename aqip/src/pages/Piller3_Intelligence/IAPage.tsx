import { useState } from 'react';
import AQIPCard from '../../components/ui/AQIPCard';
import { BrainCircuit, Fingerprint, Users, ShieldCheck, Send, Sparkles } from 'lucide-react';
import clsx from 'clsx';

type ExpertType = 'biometrie' | 'rh' | 'qualite';

export default function IAPage() {
  const [activeExpert, setActiveExpert] = useState<ExpertType>('biometrie');
  const [query, setQuery] = useState('');

  const experts = [
    { id: 'biometrie', nom: 'Expert Biométrie', icon: Fingerprint, color: 'text-aqip-accent', bg: 'bg-aqip-accent/20', border: 'border-aqip-accent/30' },
    { id: 'rh', nom: 'Expert RH', icon: Users, color: 'text-aqip-primary', bg: 'bg-aqip-primary/20', border: 'border-aqip-primary/30' },
    { id: 'qualite', nom: 'Expert Qualité', icon: ShieldCheck, color: 'text-aqip-warning', bg: 'bg-aqip-warning/20', border: 'border-aqip-warning/30' },
  ];

  const suggestedQueries = {
    biometrie: [
      "Pourquoi avons-nous autant de rejets cette semaine ?",
      "Quel centre a le plus de problèmes de capture d'empreintes ?",
    ],
    rh: [
      "Qui doit-on former en priorité pour améliorer l'IQSP ?",
      "Quel est le ROI attendu de la formation 'Capture Avancée' ?",
    ],
    qualite: [
      "Quels centres risquent de passer dans le rouge ?",
      "Quelles sont les causes récurrentes de retards de livraison ?",
    ],
  };

  const getExpertResponse = (type: ExpertType) => {
    switch(type) {
      case 'biometrie':
        return (
          <div className="space-y-4">
            <p className="text-sm text-white">
              73% des rejets récents proviennent de 3 centres (Natitingou, Djougou, Kandi).
            </p>
            <div className="bg-aqip-bg-elevated/50 p-4 rounded border border-aqip-border">
              <h4 className="text-xs uppercase text-aqip-text-muted mb-2 font-semibold tracking-wider">Cause Dominante</h4>
              <p className="text-sm font-medium text-aqip-danger">Empreintes incomplètes (Code BIO-03)</p>
            </div>
            <div className="bg-aqip-accent/10 p-4 rounded border border-aqip-accent/30 flex gap-3">
              <Sparkles className="h-5 w-5 text-aqip-accent shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-white">Recommandation</h4>
                <p className="text-sm text-aqip-text-muted mt-1">Prescrire la formation "Capture biométrique avancée" aux 18 agents concernés. La compétence manquante est identifiée à 94%.</p>
              </div>
            </div>
          </div>
        );
      case 'rh':
        return (
          <div className="space-y-4">
            <p className="text-sm text-white">
              L'analyse des gaps de compétences révèle 12 agents en situation critique (Niveau actuel 2/5).
            </p>
            <div className="bg-aqip-bg-elevated/50 p-4 rounded border border-aqip-border grid grid-cols-2 gap-4">
              <div>
                <div className="text-xs text-aqip-text-muted mb-1">Coût de Formation</div>
                <div className="text-lg font-bold text-white">3,000,000 FCFA</div>
              </div>
              <div>
                <div className="text-xs text-aqip-accent mb-1">Économie Projetée (Non-qualité)</div>
                <div className="text-lg font-bold text-aqip-accent">14,400,000 FCFA</div>
              </div>
            </div>
            <p className="text-sm font-medium text-aqip-text-muted">
              Le ROI attendu est de <span className="text-white">480%</span>. L'IQSP national prendra <span className="text-aqip-accent">+14 points</span>.
            </p>
          </div>
        );
      case 'qualite':
        return (
          <div className="space-y-4">
            <p className="text-sm text-white">
              Modèle prédictif actif. 2 centres sont sur une trajectoire de dégradation critique.
            </p>
            <div className="space-y-2">
              <div className="flex justify-between items-center bg-aqip-danger/10 p-3 rounded border border-aqip-danger/30">
                <span className="text-sm font-medium text-white">Natitingou Centre</span>
                <span className="text-xs font-bold text-aqip-danger">Risque 89% (Semaine Prochaine)</span>
              </div>
              <div className="flex justify-between items-center bg-aqip-warning/10 p-3 rounded border border-aqip-warning/30">
                <span className="text-sm font-medium text-white">Parakou Centre</span>
                <span className="text-xs font-bold text-aqip-warning">Risque 62% (Mois Prochain)</span>
              </div>
            </div>
            <p className="text-xs text-aqip-text-muted italic">Prédictions basées sur la fatigue détectée (taux d'erreur FR-01 en hausse) et les pannes matérielles.</p>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Intelligence Artificielle ANIP</h1>
        <p className="text-sm text-aqip-text-muted mt-1">Interrogez les modèles prédictifs experts pour des décisions data-driven.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-1 min-h-[600px]">
        {/* Sélecteur d'expert */}
        <div className="lg:col-span-1 space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-aqip-text-muted mb-4">Sélectionner un Expert</h2>
          {experts.map((expert) => (
            <button
              key={expert.id}
              onClick={() => setActiveExpert(expert.id as ExpertType)}
              className={clsx(
                "w-full text-left p-4 rounded-xl border transition-all duration-200 flex items-center gap-4",
                activeExpert === expert.id 
                  ? `bg-aqip-bg-elevated border-aqip-border shadow-lg` 
                  : `bg-transparent border-transparent hover:bg-aqip-bg-surface`
              )}
            >
              <div className={clsx("h-10 w-10 rounded-lg flex items-center justify-center", expert.bg, expert.color)}>
                <expert.icon className="h-5 w-5" />
              </div>
              <div>
                <div className="text-sm font-bold text-white">{expert.nom}</div>
                <div className="text-xs text-aqip-text-muted">
                  {expert.id === 'biometrie' ? 'Analyse technique' : expert.id === 'rh' ? 'Formation & ROI' : 'Prédiction & Risques'}
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Zone de chat */}
        <AQIPCard className="lg:col-span-3 flex flex-col p-0 overflow-hidden" noPadding>
          <div className="flex-1 p-6 overflow-y-auto space-y-6 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-aqip-bg-elevated/20 via-aqip-bg-surface to-aqip-bg-base">
            
            {/* Message de bienvenue */}
            <div className="flex gap-4 max-w-2xl">
              <div className={clsx("h-10 w-10 rounded-full flex items-center justify-center shrink-0", experts.find(e => e.id === activeExpert)?.bg, experts.find(e => e.id === activeExpert)?.color)}>
                <BrainCircuit className="h-5 w-5" />
              </div>
              <div className="bg-aqip-bg-elevated p-4 rounded-2xl rounded-tl-sm border border-aqip-border text-sm text-white">
                <p>Bonjour, je suis l'{experts.find(e => e.id === activeExpert)?.nom}. Comment puis-je vous aider à optimiser la qualité de l'ANIP aujourd'hui ?</p>
                <div className="mt-4 space-y-2">
                  <div className="text-xs text-aqip-text-muted uppercase tracking-wider font-semibold">Suggestions :</div>
                  {suggestedQueries[activeExpert].map((q, i) => (
                    <button key={i} className="block w-full text-left text-xs bg-aqip-bg-surface hover:bg-aqip-border transition-colors p-2 rounded text-aqip-primary border border-aqip-primary/20">
                      "{q}"
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Simulation de la question posée (pour la démo) */}
            <div className="flex gap-4 max-w-2xl ml-auto flex-row-reverse">
              <div className="h-10 w-10 rounded-full bg-aqip-primary/80 flex items-center justify-center shrink-0 text-white font-bold text-xs shadow-lg">
                DG
              </div>
              <div className="bg-aqip-primary p-4 rounded-2xl rounded-tr-sm text-sm text-white shadow-lg">
                <p>{suggestedQueries[activeExpert][0]}</p>
              </div>
            </div>

            {/* Réponse de l'IA */}
            <div className="flex gap-4 max-w-3xl">
              <div className={clsx("h-10 w-10 rounded-full flex items-center justify-center shrink-0 shadow-lg", experts.find(e => e.id === activeExpert)?.bg, experts.find(e => e.id === activeExpert)?.color)}>
                <BrainCircuit className="h-5 w-5" />
              </div>
              <div className={clsx("bg-aqip-bg-surface p-5 rounded-2xl rounded-tl-sm border shadow-lg", experts.find(e => e.id === activeExpert)?.border)}>
                {getExpertResponse(activeExpert)}
              </div>
            </div>

          </div>

          <div className="p-4 border-t border-aqip-border bg-aqip-bg-surface shrink-0">
            <div className="relative flex items-center">
              <input
                type="text"
                placeholder={`Poser une question à l'${experts.find(e => e.id === activeExpert)?.nom}...`}
                className="w-full bg-aqip-bg-elevated border-aqip-border border text-white text-sm rounded-full pl-5 pr-12 py-3 focus:ring-1 focus:ring-aqip-primary focus:border-aqip-primary transition-all"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <button className="absolute right-2 p-2 bg-aqip-primary hover:bg-aqip-primary-dark transition-colors rounded-full text-white">
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </AQIPCard>
      </div>
    </div>
  );
}
