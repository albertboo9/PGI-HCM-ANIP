import { useEffect, useState } from 'react';

import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, Activity, ShieldAlert, GraduationCap, CheckCircle, TrendingUp, AlertTriangle } from 'lucide-react';

export default function MissionControlPage() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      id: 0,
      time: "Mois M-1",
      title: "Statut Initial",
      desc: "IQSP National à 62/100. Frustrations citoyennes en hausse.",
      icon: Activity,
      color: "text-aqip-warning",
      bg: "bg-aqip-warning/20",
      stats: { iqsp: 62, incidents: 450, cout: "12M FCFA" }
    },
    {
      id: 1,
      time: "Jour J",
      title: "Incident Biométrique",
      desc: "L'agent Jean Ahouangon (Cotonou) génère 15 empreintes illisibles.",
      icon: AlertTriangle,
      color: "text-aqip-danger",
      bg: "bg-aqip-danger/20",
      stats: { iqsp: 61, incidents: 465, cout: "12.5M FCFA" }
    },
    {
      id: 2,
      time: "Jour J+1",
      title: "Analyse IA Experte",
      desc: "AQIP détecte la faille BIO-03. Cause racine identifiée à 94%.",
      icon: ShieldAlert,
      color: "text-aqip-primary",
      bg: "bg-aqip-primary/20",
      stats: { iqsp: 61, incidents: 465, cout: "12.5M FCFA" }
    },
    {
      id: 3,
      time: "Jour J+2",
      title: "Action RH Automatique",
      desc: "Prescription ciblée : Formation 'Capture Avancée'.",
      icon: GraduationCap,
      color: "text-aqip-accent",
      bg: "bg-aqip-accent/20",
      stats: { iqsp: 61, incidents: 465, cout: "12.8M FCFA (Formation incluse)" }
    },
    {
      id: 4,
      time: "Mois M+1",
      title: "Retour sur Investissement",
      desc: "Erreurs réduites de 80%. Mme Dossou est servie en 12min.",
      icon: CheckCircle,
      color: "text-aqip-gold",
      bg: "bg-aqip-gold/20",
      stats: { iqsp: 76, incidents: 90, cout: "2M FCFA" }
    }
  ];

  useEffect(() => {
    let interval: ReturnType<typeof setTimeout>;
    if (isPlaying && currentStep < steps.length - 1) {
      interval = setTimeout(() => {
        setCurrentStep(prev => prev + 1);
      }, 3500); // 3.5s per step
    } else if (currentStep >= steps.length - 1) {
      setIsPlaying(false);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentStep, steps.length]);

  const reset = () => {
    setIsPlaying(false);
    setCurrentStep(0);
  };

  const togglePlay = () => {
    if (currentStep >= steps.length - 1) {
      reset();
      setIsPlaying(true);
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="space-y-8 h-full flex flex-col">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
            Mission Control Replay
            <span className="bg-aqip-danger px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider rounded text-white animate-pulse">Live Demo</span>
          </h1>
          <p className="text-sm text-aqip-text-muted mt-1">Démonstration de la boucle de valeur : Erreur → Analyse → Action → Amélioration.</p>
        </div>
        <div className="flex items-center gap-3 bg-aqip-bg-elevated p-2 rounded-lg border border-aqip-border shadow-lg">
          <button 
            onClick={reset}
            className="p-2 hover:bg-aqip-bg-surface rounded transition-colors text-aqip-text-muted hover:text-white"
            title="Réinitialiser"
          >
            <RotateCcw className="h-5 w-5" />
          </button>
          <button 
            onClick={togglePlay}
            className={`flex items-center gap-2 px-4 py-2 rounded font-bold transition-all ${
              isPlaying 
                ? 'bg-aqip-bg-surface text-aqip-warning border border-aqip-warning/30' 
                : 'bg-aqip-primary text-white shadow-[0_0_15px_rgba(59,130,246,0.5)]'
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="h-4 w-4" /> Pause
              </>
            ) : (
              <>
                <Play className="h-4 w-4 fill-current" /> {currentStep >= steps.length - 1 ? 'Rejouer' : 'Démarrer la simulation'}
              </>
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-1">
        
        {/* Colonne Gauche : KPIs Dynamiques */}
        <div className="lg:col-span-1 flex flex-col justify-center space-y-6">
          <motion.div 
            key={`kpi-${currentStep}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-gradient-to-br from-aqip-bg-surface to-aqip-bg-elevated p-6 rounded-2xl border border-aqip-border shadow-xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-32 h-32 bg-aqip-primary/10 rounded-full blur-2xl" />
            
            <h3 className="text-sm font-bold text-aqip-text-muted uppercase tracking-wider mb-6 flex items-center justify-between">
              Impact Global
              <TrendingUp className="h-4 w-4 text-aqip-primary" />
            </h3>
            
            <div className="space-y-8">
              <div>
                <div className="text-xs text-aqip-text-muted mb-1">Indice de Qualité (IQSP)</div>
                <div className="flex items-end gap-3">
                  <span className={`text-5xl font-black ${steps[currentStep].stats.iqsp >= 75 ? 'text-aqip-accent' : steps[currentStep].stats.iqsp < 65 ? 'text-aqip-danger' : 'text-aqip-warning'}`}>
                    {steps[currentStep].stats.iqsp}
                  </span>
                  <span className="text-lg text-aqip-text-muted mb-1">/ 100</span>
                </div>
              </div>
              
              <div>
                <div className="text-xs text-aqip-text-muted mb-1">Incidents Actifs</div>
                <div className="text-3xl font-bold text-white">
                  {steps[currentStep].stats.incidents}
                </div>
              </div>

              <div>
                <div className="text-xs text-aqip-text-muted mb-1">Coût de la Non-Qualité</div>
                <div className="text-2xl font-bold text-aqip-danger">
                  {steps[currentStep].stats.cout}
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Colonne Droite : Timeline Verticale Interactive */}
        <div className="lg:col-span-2 relative pl-10 border-l-2 border-aqip-border py-4">
          <AnimatePresence>
            {steps.map((step, index) => (
              index <= currentStep && (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, y: 50, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: index === currentStep ? 1.02 : 1 }}
                  transition={{ type: "spring", bounce: 0.4, duration: 0.8 }}
                  className={`relative mb-12 last:mb-0 ${index < currentStep ? 'opacity-60' : ''}`}
                >
                  {/* Point sur la timeline */}
                  <div className={`absolute -left-[58px] top-4 h-8 w-8 rounded-full border-4 border-aqip-bg-base flex items-center justify-center ${step.bg} ${step.color} shadow-[0_0_15px_currentColor]`}>
                    <step.icon className="h-4 w-4" />
                  </div>
                  
                  {/* Ligne active qui connecte les points */}
                  {index < currentStep && (
                    <motion.div 
                      initial={{ height: 0 }}
                      animate={{ height: 'calc(100% + 48px)' }}
                      transition={{ duration: 0.5 }}
                      className="absolute -left-[43px] top-12 w-[2px] bg-aqip-primary shadow-[0_0_10px_rgba(59,130,246,0.5)] z-10"
                    />
                  )}

                  <div className={`p-6 rounded-xl border transition-all ${index === currentStep ? 'bg-aqip-bg-surface border-aqip-primary shadow-[0_0_30px_rgba(59,130,246,0.1)]' : 'bg-aqip-bg-elevated/50 border-aqip-border'}`}>
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`text-xs font-bold px-2 py-1 rounded bg-aqip-bg-base ${step.color}`}>
                        {step.time}
                      </span>
                      <h2 className="text-xl font-bold text-white">{step.title}</h2>
                    </div>
                    <p className="text-aqip-text-muted text-sm leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                </motion.div>
              )
            ))}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}
