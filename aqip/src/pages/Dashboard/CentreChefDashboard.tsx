import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import AQIPCard from '../../components/ui/AQIPCard';
import AQIPScoreRing from '../../components/ui/AQIPScoreRing';
import AQIPButton from '../../components/ui/AQIPButton';
import { AlertTriangle, BookOpen, ShieldCheck, CheckCircle2, TrendingUp, Award, FileText } from 'lucide-react';
import { useIncidentStore } from '../../store/incidentStore';
import { useAgentStore } from '../../store/agentStore';
import { getPriorityAgents } from '../../services/skillEngine';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { motion } from 'framer-motion';

export default function CentreChefDashboard() {
  const { incidents, fetchIncidents } = useIncidentStore();
  const { agents, fetchAgents } = useAgentStore();
  
  const [pdiProposed, setPdiProposed] = useState<string[]>([]);
  const centreId = 'ctr-001';

  useEffect(() => {
    fetchIncidents();
    fetchAgents();
  }, [fetchIncidents, fetchAgents]);

  const centreAgents = useMemo(() => agents.filter(a => a.centreId === centreId), [agents, centreId]);
  const centreIncidents = useMemo(() => incidents.filter(i => i.centreId === centreId).sort((a, b) => new Date(b.dateDetection).getTime() - new Date(a.dateDetection).getTime()), [incidents, centreId]);
  
  const teamGaps = useMemo(() => getPriorityAgents(centreAgents, centreIncidents, 10), [centreAgents, centreIncidents]);

  const handleProposePDI = (agentId: string) => {
    setPdiProposed(prev => [...prev, agentId]);
  };

  // Données mockées pour les graphiques
  const qualityData = [
    { name: 'Lun', score: 40 },
    { name: 'Mar', score: 60 },
    { name: 'Mer', score: 45 },
    { name: 'Jeu', score: 70 },
    { name: 'Ven', score: 85 },
    { name: 'Sam', score: 75 },
    { name: 'Dim', score: 98 },
  ];

  const okrData = [
    { name: 'Orthographe', atteint: 80 },
    { name: 'Biométrie', atteint: 95 },
    { name: 'Accueil', atteint: 60 },
  ];

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto text-aqip-text-primary">
      
      {/* Top Row: Score, Objectifs, OKR */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Score de Performance */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <AQIPCard className="h-full flex flex-col justify-between bg-white dark:bg-[var(--aqip-glass-bg)] backdrop-blur-xl border border-white/20 shadow-[var(--aqip-shadow-md)]">
            <div>
              <h2 className="text-sm font-bold text-aqip-text-muted uppercase tracking-wide border-b border-aqip-border pb-2 mb-4">Score de Performance</h2>
            </div>
            <div className="flex flex-col items-center flex-1 justify-center relative">
              <div className="absolute inset-0 flex items-center justify-center opacity-20 blur-xl rounded-full bg-aqip-accent"></div>
              <AQIPScoreRing score={82} label="" size={160} strokeWidth={14} color="text-aqip-accent" />
              <div className="flex items-center gap-2 mt-4 bg-aqip-accent/10 px-4 py-1.5 rounded-full border border-aqip-accent/20">
                <div className="h-2 w-4 bg-aqip-accent rounded-sm shadow-[0_0_8px_rgba(16,185,129,0.8)]"></div>
                <span className="text-sm font-bold text-aqip-accent">Très Bon</span>
              </div>
            </div>
          </AQIPCard>
        </motion.div>

        {/* Objectifs du Mois */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="col-span-1 lg:col-span-2">
          <AQIPCard className="h-full flex flex-col justify-between relative overflow-hidden bg-gradient-to-br from-[#2B5E8D] to-[#1E3A8A] text-white shadow-[var(--aqip-shadow-glow)] border-none">
            <div className="relative z-10">
              <h2 className="text-sm font-bold text-white/80 uppercase tracking-wide border-b border-white/10 pb-2 mb-4">Objectifs Qualité (Q2)</h2>
              <div className="flex items-end gap-2 mb-6">
                <span className="text-6xl font-black leading-none tracking-tighter">75<span className="text-3xl text-white/60">%</span></span>
                <span className="text-sm text-white/80 mb-1 font-medium bg-white/10 px-2 py-0.5 rounded-md backdrop-blur-sm">Atteints globalement</span>
              </div>
              
              <div className="w-full bg-black/20 rounded-full h-3 mb-2 shadow-inner">
                <motion.div initial={{ width: 0 }} animate={{ width: '75%' }} transition={{ duration: 1, delay: 0.5 }} className="bg-gradient-to-r from-aqip-accent to-emerald-300 h-3 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]"></motion.div>
              </div>
              
              <div className="flex justify-between items-center mt-4">
                <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-lg border border-white/5">
                  <span className="text-sm font-bold">4 / 5</span> <span className="text-xs text-white/70">Objectifs franchis</span>
                </div>
                <Award className="h-10 w-10 text-aqip-gold opacity-80" />
              </div>
            </div>
            {/* Background Glow */}
            <div className="absolute top-0 right-0 -mt-10 -mr-10 w-48 h-48 bg-aqip-primary opacity-50 blur-3xl rounded-full"></div>
          </AQIPCard>
        </motion.div>

        {/* OKR en Cours */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <AQIPCard className="h-full bg-white dark:bg-[var(--aqip-glass-bg)] backdrop-blur-xl border border-white/20 shadow-[var(--aqip-shadow-md)]">
            <h2 className="text-sm font-bold text-aqip-text-muted uppercase tracking-wide border-b border-aqip-border pb-2 mb-4">Progression OKR</h2>
            <div className="h-[140px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={okrData} layout="vertical" margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'var(--aqip-text-muted)' }} />
                  <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: 'var(--aqip-shadow-md)' }} />
                  <Bar dataKey="atteint" fill="var(--aqip-primary)" radius={[0, 4, 4, 0]} barSize={12} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </AQIPCard>
        </motion.div>
      </div>

      {/* Middle Row: Activité & Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Actions Managériales */}
        <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 0.2 }} className="col-span-1 lg:col-span-2">
          <AQIPCard className="h-full shadow-[var(--aqip-shadow-md)] border-t-4 border-t-aqip-primary">
            <div className="flex justify-between items-center border-b border-aqip-border pb-3 mb-4">
              <h2 className="text-sm font-bold text-aqip-text-primary uppercase tracking-wide flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-aqip-primary" /> Intelligence Managériale
              </h2>
              <span className="text-xs font-bold bg-aqip-danger/10 text-aqip-danger px-2 py-1 rounded-full">{teamGaps.length} Alertes</span>
            </div>
            
            <div className="space-y-3">
              {teamGaps.slice(0, 3).map(({ agent, incidentCount }) => {
                const isProposed = pdiProposed.includes(agent.id);
                return (
                  <div key={agent.id} className="flex items-center justify-between p-4 bg-aqip-bg-elevated/50 hover:bg-aqip-bg-elevated transition-colors rounded-xl border border-aqip-border group">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-aqip-danger/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                        <AlertTriangle className="h-5 w-5 text-aqip-danger" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-aqip-text-primary">{agent.prenom} {agent.nom}</p>
                        <p className="text-xs text-aqip-text-muted">{incidentCount} incidents liés détectés par l'IA</p>
                      </div>
                    </div>
                    {isProposed ? (
                      <div className="flex items-center gap-1 text-xs font-bold text-aqip-accent bg-aqip-accent/10 px-3 py-1.5 rounded-lg border border-aqip-accent/20">
                        <CheckCircle2 className="h-4 w-4" /> Formation Prescrite
                      </div>
                    ) : (
                      <AQIPButton size="sm" onClick={() => handleProposePDI(agent.id)} className="shadow-sm">
                        Prescrire PDI
                      </AQIPButton>
                    )}
                  </div>
                );
              })}
              {teamGaps.length === 0 && (
                  <div className="py-8 text-center text-sm text-aqip-text-muted italic flex flex-col items-center gap-2">
                    <CheckCircle2 className="h-8 w-8 text-aqip-accent opacity-50" />
                    Aucune dérive critique détectée par l'algorithme.
                  </div>
              )}
            </div>
          </AQIPCard>
        </motion.div>

        {/* Live Feed / Scoring */}
        <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 0.3 }} className="col-span-1 lg:col-span-1">
          <AQIPCard className="h-full bg-aqip-bg-surface shadow-[var(--aqip-shadow-md)]">
            <h2 className="text-sm font-bold text-aqip-text-muted uppercase tracking-wide border-b border-aqip-border pb-2 mb-4">Flux en temps réel</h2>
            
            <div className="space-y-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-aqip-border before:to-transparent">
              {centreIncidents.slice(0, 3).map((incident) => (
                <div key={incident.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-aqip-bg-surface text-aqip-primary shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                    <AlertTriangle className="h-4 w-4" />
                  </div>
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-3 rounded-lg border border-aqip-border bg-aqip-bg-elevated shadow-sm">
                    <div className="flex items-center justify-between mb-1">
                      <div className="font-bold text-xs text-aqip-text-primary">{incident.codeErreur}</div>
                      <time className="text-[10px] font-medium text-aqip-text-muted">À l'instant</time>
                    </div>
                    <div className="text-[10px] text-aqip-text-muted">{incident.erreurLibelle}</div>
                  </div>
                </div>
              ))}
              {centreIncidents.length === 0 && <p className="text-xs text-center text-aqip-text-muted">Aucun incident récent.</p>}
            </div>
          </AQIPCard>
        </motion.div>
      </div>

      {/* Bottom Row: Graphiques Dynamiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }}>
          <AQIPCard className="h-96 flex flex-col shadow-[var(--aqip-shadow-md)]">
            <h2 className="text-sm font-bold text-aqip-text-muted uppercase tracking-wide border-b border-aqip-border pb-2 mb-4 flex items-center justify-between">
              Évolution Qualité
              <span className="text-xs font-bold text-aqip-accent bg-aqip-accent/10 px-2 py-1 rounded-full flex items-center gap-1"><TrendingUp className="h-3 w-3" /> +12%</span>
            </h2>
            <div className="flex-1 w-full min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={qualityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--aqip-primary)" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="var(--aqip-primary)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--aqip-border)" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--aqip-text-muted)' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--aqip-text-muted)' }} />
                  <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: 'var(--aqip-shadow-md)', backgroundColor: 'var(--aqip-bg-surface)', color: 'var(--aqip-text-primary)' }} />
                  <Area type="monotone" dataKey="score" stroke="var(--aqip-primary)" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </AQIPCard>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.5 }}>
          <AQIPCard className="h-96 shadow-[var(--aqip-shadow-md)] flex flex-col">
            <h2 className="text-sm font-bold text-aqip-text-muted uppercase tracking-wide border-b border-aqip-border pb-2 mb-4">Catalogue & Montée en compétences</h2>
            <div className="flex-1 overflow-y-auto space-y-4 custom-scrollbar">
               <div className="flex flex-col gap-3 p-4 bg-gradient-to-r from-aqip-bg-elevated to-transparent border border-aqip-border rounded-xl">
                  <div className="flex items-center justify-between">
                     <div className="flex items-center gap-3">
                       <div className="h-10 w-10 rounded-lg bg-[#2B5E8D] text-white flex items-center justify-center shrink-0 shadow-inner">
                         <BookOpen className="h-5 w-5" />
                       </div>
                       <div>
                         <h3 className="text-sm font-bold text-aqip-text-primary">Capture Biométrique Avancée</h3>
                         <p className="text-xs text-aqip-text-muted">4 modules • Recommandé par l'IA</p>
                       </div>
                     </div>
                     <span className="text-[10px] font-bold text-white bg-aqip-primary px-2 py-1 rounded-full shadow-sm">Nouveau PDI</span>
                  </div>
               </div>

               <div className="flex flex-col gap-3 p-4 bg-aqip-bg-surface border border-aqip-border rounded-xl hover:border-aqip-primary transition-colors">
                  <div className="flex items-center justify-between">
                     <div className="flex items-center gap-3">
                       <div className="h-10 w-10 rounded-lg bg-aqip-bg-elevated text-aqip-text-muted flex items-center justify-center shrink-0">
                         <FileText className="h-5 w-5" />
                       </div>
                       <div>
                         <h3 className="text-sm font-bold text-aqip-text-primary">Français Administratif</h3>
                         <p className="text-xs text-aqip-text-muted">12 agents inscrits de votre centre</p>
                       </div>
                     </div>
                     <AQIPButton variant="outline" size="sm">Gérer</AQIPButton>
                  </div>
               </div>
            </div>
            <div className="pt-4 border-t border-aqip-border mt-auto">
              <Link to="/formations/catalogue">
                <AQIPButton variant="primary" className="w-full justify-center">Accéder au Catalogue complet</AQIPButton>
              </Link>
            </div>
          </AQIPCard>
        </motion.div>
      </div>

    </div>
  );
}
