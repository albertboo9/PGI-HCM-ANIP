import { useState, useMemo } from 'react';
import { useIncidentStore } from '../../store/incidentStore';
import { useAgentStore } from '../../store/agentStore';
import { ShieldAlert, BookOpen, AlertTriangle, Monitor, FileText, ChevronRight, MessageSquare, Briefcase } from 'lucide-react';
import clsx from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';
import type { Incident } from '../../types/incident.types';

const COLUMNS = [
  { id: 'constat', label: 'Constat', color: 'text-aqip-text-muted', bg: 'bg-aqip-bg-surface', border: 'border-aqip-border' },
  { id: 'cause_identifiee', label: 'Cause Identifiée', color: 'text-aqip-warning', bg: 'bg-aqip-warning/10', border: 'border-aqip-warning/30' },
  { id: 'action_decidee', label: 'Action Décidée', color: 'text-aqip-primary', bg: 'bg-aqip-primary/10', border: 'border-aqip-primary/30' },
  { id: 'accompagnement', label: 'Accompagnement', color: 'text-aqip-accent', bg: 'bg-aqip-accent/10', border: 'border-aqip-accent/30' },
  { id: 'amelioration_observee', label: 'Amélioration', color: 'text-aqip-success', bg: 'bg-aqip-success/10', border: 'border-aqip-success/30' },
];

const CAUSES = [
  { id: 'competence', label: 'Compétence', icon: BookOpen, color: 'text-aqip-warning' },
  { id: 'materiel', label: 'Matériel', icon: Monitor, color: 'text-gray-500' },
  { id: 'procedure', label: 'Procédure', icon: FileText, color: 'text-aqip-primary' },
  { id: 'surcharge', label: 'Surcharge', icon: AlertTriangle, color: 'text-aqip-danger' },
];

const CANAUX = [
  { id: 'controleur', label: 'Contrôleur', icon: ShieldAlert, color: 'text-aqip-primary' },
  { id: 'chef_centre', label: 'Chef Centre', icon: Briefcase, color: 'text-aqip-warning' },
  { id: 'systeme', label: 'Système', icon: Monitor, color: 'text-aqip-text-muted' },
  { id: 'citoyen', label: 'Citoyen', icon: MessageSquare, color: 'text-aqip-danger' },
];

export default function QualityWorkflowPage() {
  const { incidents, update } = useIncidentStore();
  const { agents } = useAgentStore();
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);

  // Fix qualification status if missing (for legacy mock data)
  const normalizedIncidents = useMemo(() => {
    return incidents.map(inc => ({
      ...inc,
      qualificationStatus: inc.qualificationStatus || 'constat',
      causeRacine: inc.causeRacine || (inc.statut === 'resolu' ? 'competence' : null)
    }));
  }, [incidents]);

  const advanceWorkflow = (incident: any) => {
    const currentIndex = COLUMNS.findIndex(c => c.id === incident.qualificationStatus);
    if (currentIndex < COLUMNS.length - 1) {
      const nextStatus = COLUMNS[currentIndex + 1].id;
      update(incident.id, { 
        qualificationStatus: nextStatus as any,
        causeRacine: nextStatus === 'cause_identifiee' && !incident.causeRacine ? 'competence' : incident.causeRacine
      });
      setSelectedIncident(null);
    }
  };

  const getAgent = (id: string) => agents.find(a => a.id === id);

  return (
    <div className="space-y-6 h-[calc(100vh-8rem)] flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-[1600px] mx-auto">
      <div className="shrink-0">
        <h1 className="text-2xl font-bold text-aqip-text-primary tracking-tight">Analyse & Qualification Qualité</h1>
        <p className="text-sm text-aqip-text-muted mt-1">Transformez les constats d'erreurs opérationnelles en actions ciblées (HCM).</p>
      </div>

      <div className="flex-1 overflow-x-auto custom-scrollbar pb-4 flex gap-6">
        {COLUMNS.map((col, _idx) => {
          const colIncidents = normalizedIncidents.filter(i => i.qualificationStatus === col.id);
          

          return (
            <div key={col.id} className="flex-1 min-w-[300px] flex flex-col bg-aqip-bg-elevated rounded-2xl border border-aqip-border overflow-hidden shadow-sm">
              <div className={clsx("p-4 border-b shrink-0 flex justify-between items-center", col.border, col.bg)}>
                <h3 className={clsx("font-bold text-sm", col.color)}>{col.label}</h3>
                <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs font-bold">{colIncidents.length}</span>
              </div>
              
              <div className="flex-1 p-3 overflow-y-auto custom-scrollbar space-y-3">
                <AnimatePresence>
                  {colIncidents.map(inc => {
                    const agent = getAgent(inc.agentId);
                    const cause = CAUSES.find(c => c.id === inc.causeRacine);
                    const canal = CANAUX.find(c => c.id === inc.canalDetection) || CANAUX[2];
                    const CanalIcon = canal.icon;

                    return (
                      <motion.div 
                        layoutId={inc.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        key={inc.id}
                        onClick={() => setSelectedIncident(inc as any)}
                        className="bg-aqip-bg-surface p-3 rounded-xl border border-aqip-border shadow-sm hover:shadow-md hover:border-aqip-primary/50 transition-all cursor-pointer group"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-[10px] font-mono font-bold bg-aqip-bg-elevated px-1.5 py-0.5 rounded text-aqip-text-muted">
                            {inc.codeErreur}
                          </span>
                          <span className="text-[10px] flex items-center gap-1 text-aqip-text-muted" title={canal.label}>
                            <CanalIcon className={clsx("h-3 w-3", canal.color)} />
                          </span>
                        </div>
                        
                        <p className="text-xs font-semibold text-white line-clamp-2 mb-3 leading-relaxed">
                          {inc.erreurLibelle}
                        </p>
                        
                        <div className="flex justify-between items-end mt-auto pt-2 border-t border-aqip-border/50">
                          <div className="flex items-center gap-2">
                            <div className="h-6 w-6 rounded-full bg-aqip-primary/20 text-aqip-primary flex items-center justify-center text-[10px] font-bold">
                              {agent?.prenom[0]}{agent?.nom[0]}
                            </div>
                            <span className="text-[10px] text-aqip-text-muted truncate max-w-[80px]">{agent?.prenom}</span>
                          </div>
                          
                          {cause && (
                            <div className={clsx("flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded", cause.color, "bg-white/5 border border-white/10")}>
                              <cause.icon className="h-3 w-3" />
                              {cause.label}
                            </div>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
                {colIncidents.length === 0 && (
                  <div className="text-center py-8">
                    <div className="text-xs font-medium text-aqip-text-muted border-2 border-dashed border-aqip-border rounded-xl p-4">
                      Aucun dossier
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal d'Action Rapide */}
      <AnimatePresence>
        {selectedIncident && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-aqip-bg-surface w-full max-w-lg rounded-2xl shadow-2xl border border-aqip-border overflow-hidden"
            >
              <div className="p-5 border-b border-aqip-border bg-aqip-bg-elevated flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-white text-lg">Qualification du Constat</h3>
                  <p className="text-xs text-aqip-text-muted font-mono mt-1">{selectedIncident.codeErreur} — {selectedIncident.id}</p>
                </div>
                <button onClick={() => setSelectedIncident(null)} className="p-2 bg-aqip-bg-surface rounded-full text-aqip-text-muted hover:text-white">
                  ✕
                </button>
              </div>

              <div className="p-6 space-y-6">
                <div>
                  <label className="text-xs font-bold text-aqip-text-muted uppercase tracking-wider mb-2 block">Détail du constat</label>
                  <p className="text-sm text-white bg-aqip-bg-elevated p-3 rounded-lg border border-aqip-border leading-relaxed">
                    {selectedIncident.erreurLibelle}
                    {selectedIncident.description && <span className="block mt-2 text-xs text-aqip-text-muted">{selectedIncident.description}</span>}
                  </p>
                </div>

                {selectedIncident.qualificationStatus === 'constat' && (
                  <div>
                    <label className="text-xs font-bold text-aqip-text-muted uppercase tracking-wider mb-3 block">Identifier la Cause Racine</label>
                    <div className="grid grid-cols-2 gap-3">
                      {CAUSES.map(c => (
                        <button 
                          key={c.id}
                          onClick={() => update(selectedIncident.id, { causeRacine: c.id as any })}
                          className={clsx(
                            "flex items-center gap-3 p-3 rounded-xl border text-sm font-medium transition-all text-left",
                            selectedIncident.causeRacine === c.id 
                              ? `bg-aqip-bg-elevated border-aqip-primary text-white shadow-md`
                              : `bg-aqip-bg-surface border-aqip-border text-aqip-text-muted hover:border-white/20`
                          )}
                        >
                          <c.icon className={clsx("h-5 w-5", c.color)} />
                          {c.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {(selectedIncident.qualificationStatus === 'cause_identifiee' || selectedIncident.qualificationStatus === 'action_decidee') && selectedIncident.causeRacine === 'competence' && (
                  <div className="bg-aqip-primary/10 border border-aqip-primary/20 p-4 rounded-xl">
                    <h4 className="text-sm font-bold text-white flex items-center gap-2 mb-2">
                      <BookOpen className="h-4 w-4 text-aqip-primary" /> Action Recommandée (Coach IA)
                    </h4>
                    <p className="text-xs text-aqip-text-muted">Prescrire le module "Maîtrise de la transcription des noms" (2h e-learning) dans le PDI de l'agent.</p>
                  </div>
                )}
                
                {(selectedIncident.qualificationStatus === 'cause_identifiee' || selectedIncident.qualificationStatus === 'action_decidee') && selectedIncident.causeRacine === 'materiel' && (
                  <div className="bg-gray-500/10 border border-gray-500/20 p-4 rounded-xl">
                    <h4 className="text-sm font-bold text-white flex items-center gap-2 mb-2">
                      <Monitor className="h-4 w-4 text-gray-400" /> Action Recommandée (Logistique)
                    </h4>
                    <p className="text-xs text-aqip-text-muted">Générer un ticket de maintenance pour remplacer le capteur biométrique du poste.</p>
                  </div>
                )}

              </div>

              <div className="p-5 border-t border-aqip-border bg-aqip-bg-elevated flex justify-end gap-3">
                <button onClick={() => setSelectedIncident(null)} className="px-4 py-2 text-sm font-bold text-aqip-text-muted hover:text-white transition-colors">
                  Fermer
                </button>
                {selectedIncident.qualificationStatus !== 'amelioration_observee' && (
                  <button 
                    onClick={() => advanceWorkflow(selectedIncident)}
                    disabled={selectedIncident.qualificationStatus === 'constat' && !selectedIncident.causeRacine}
                    className="flex items-center gap-2 px-5 py-2 text-sm font-bold bg-aqip-primary text-white rounded-lg hover:bg-aqip-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                  >
                    Valider & Passer à l'étape suivante <ChevronRight className="h-4 w-4" />
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
