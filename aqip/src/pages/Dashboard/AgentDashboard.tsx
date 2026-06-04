import { useMemo } from 'react';

import { Link } from 'react-router-dom';
import AQIPCard from '../../components/ui/AQIPCard';
import AQIPScoreRing from '../../components/ui/AQIPScoreRing';
import AQIPButton from '../../components/ui/AQIPButton';
import { BookOpen, Target, CheckCircle2, TrendingUp, PlayCircle, ShieldCheck, RefreshCw } from 'lucide-react';
import { useIncidentStore } from '../../store/incidentStore';
import { useAuthStore } from '../../store/authStore';
import { useAgentStore } from '../../store/agentStore';
import { getAgentSkillGaps, getRecommendedFormations } from '../../services/skillEngine';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';

export default function AgentDashboard() {
  const { currentUser } = useAuthStore();
  const agents = useAgentStore(s => {
    if (s.agents.length === 0) s.getAll();
    return s.agents;
  });
  const incidents = useIncidentStore(s => {
    if (s.incidents.length === 0) s.getAll();
    return s.incidents;
  });

  // Mapping: les utilisateurs (usr-xxx) sont liés aux agents (agt-xxx)
  const userIdToAgentId: Record<string, string> = {
    'usr-005': 'agt-001',
    'usr-007': 'agt-006',
    'usr-008': 'agt-002',
    'usr-009': 'agt-007',
    'usr-010': 'agt-004',
    'usr-011': 'agt-005',
    'usr-012': 'agt-003',
  };
  const agentId = userIdToAgentId[currentUser?.id || ''] || 'agt-001';

  const agent = agents.find(a => a.id === agentId);
  const agentIncidents = useMemo(() =>
    incidents.filter(i => i.agentId === agentId)
             .sort((a, b) => new Date(b.dateDetection).getTime() - new Date(a.dateDetection).getTime()),
  [incidents, agentId]);

  const gaps = useMemo(() => agent ? getAgentSkillGaps(agent, incidents) : [], [agent, incidents]);
  const formations = useMemo(() => getRecommendedFormations(gaps), [gaps]);

  const qualityData = [
    { name: 'Sem 1', score: 85 },
    { name: 'Sem 2', score: 88 },
    { name: 'Sem 3', score: 92 },
    { name: "Aujourd'hui", score: 95 },
  ];

  const compositeScore = agent?.scores?.composite ?? 95;

  if (!agent) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <RefreshCw className="h-8 w-8 text-aqip-primary animate-spin" />
        <p className="text-aqip-text-muted font-medium">Chargement de votre espace...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">

      {/* Hero Section Agent */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <AQIPCard className="bg-gradient-to-r from-[#2B5E8D] to-[#1E3A8A] text-white border-none shadow-[var(--aqip-shadow-glow)] relative overflow-hidden p-0">
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 p-6 md:p-8">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Bonjour, {agent?.prenom ?? 'Agent'} 👋</h1>
              <p className="text-white/80 mt-1 text-sm">Agent d'enrôlement • Centre de Cotonou</p>
              <div className="flex flex-wrap gap-3 mt-4">
                <div className="bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-white/20 flex items-center gap-2 text-sm">
                  <Target className="h-4 w-4" /> Objectif: 98%
                </div>
                <div className="bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-white/20 flex items-center gap-2 text-sm">
                  <TrendingUp className="h-4 w-4" /> Qualité: {compositeScore}%
                </div>
              </div>
              <div className="flex gap-3 mt-5">
                <Link to="/workspace" className="px-4 py-2 bg-white text-[#2B5E8D] text-sm font-bold rounded-lg hover:bg-white/90 transition-all shadow-md flex items-center gap-2">
                  Saisir un dossier
                </Link>
                {agent && (
                  <Link to={`/agent/${agent.id}/dossier`} className="px-4 py-2 bg-white/10 text-white text-sm font-bold rounded-lg hover:bg-white/20 transition-all border border-white/20 flex items-center gap-2">
                    <BookOpen className="h-4 w-4" /> Mon Dossier 360°
                  </Link>
                )}
              </div>
            </div>
            <div className="flex-shrink-0 bg-white/10 p-4 rounded-2xl backdrop-blur-md border border-white/20">
              <AQIPScoreRing score={compositeScore} size={110} strokeWidth={10} color="text-white" />
            </div>
          </div>
          {/* Decorative Glow */}
          <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-white opacity-10 blur-3xl rounded-full"></div>
        </AQIPCard>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Timeline & Feedback IA */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="lg:col-span-2">
          <AQIPCard className="h-full shadow-[var(--aqip-shadow-md)]">
            <div className="flex justify-between items-center border-b border-aqip-border pb-3 mb-4">
              <h2 className="text-sm font-bold text-aqip-text-muted uppercase tracking-wide flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-aqip-primary" /> Journal de Rétroaction Qualité
              </h2>
              <span className="text-xs font-bold bg-aqip-bg-elevated text-aqip-text-muted px-2 py-1 rounded-full">{agentIncidents.length} retour(s)</span>
            </div>

            <div className="space-y-4 max-h-[400px] overflow-y-auto custom-scrollbar">
              {agentIncidents.length > 0 ? (
                agentIncidents.slice(0, 5).map((incident) => (
                  <div key={incident.id} className="relative pl-6 pb-4 border-l-2 border-aqip-border last:border-0 last:pb-0">
                    <div className="absolute -left-[9px] top-0 h-4 w-4 rounded-full bg-aqip-danger border-2 border-[var(--aqip-bg-surface)]"></div>
                    <div className="bg-aqip-bg-elevated p-4 rounded-xl border border-aqip-border shadow-sm">
                      <div className="flex justify-between items-start mb-2 flex-wrap gap-2">
                        <div>
                          <span className="text-xs font-bold text-aqip-danger bg-aqip-danger/10 px-2 py-0.5 rounded">Code: {incident.codeErreur}</span>
                          <h3 className="text-sm font-bold text-aqip-text-primary mt-1">{incident.erreurLibelle}</h3>
                        </div>
                        <span className="text-[10px] text-aqip-text-muted shrink-0">{new Date(incident.dateDetection).toLocaleDateString('fr-FR')}</span>
                      </div>
                      <p className="text-xs text-aqip-text-secondary mt-2">{incident.description}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-12 flex flex-col items-center justify-center text-center">
                  <CheckCircle2 className="h-12 w-12 text-aqip-accent mb-3 opacity-50" />
                  <p className="text-sm font-bold text-aqip-text-primary">Travail Impeccable</p>
                  <p className="text-xs text-aqip-text-muted mt-1">L'IA n'a détecté aucune anomalie sur vos récentes saisies.</p>
                </div>
              )}
            </div>
          </AQIPCard>
        </motion.div>

        {/* Recommandations & Graphique */}
        <div className="space-y-6">
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.3 }}>
            <AQIPCard className="shadow-[var(--aqip-shadow-md)]">
              <h2 className="text-sm font-bold text-aqip-text-muted uppercase tracking-wide border-b border-aqip-border pb-2 mb-4">Évolution Personnelle</h2>
              <div className="h-40 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={qualityData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--aqip-border)" />
                    <XAxis dataKey="name" tick={{ fontSize: 10, fill: 'var(--aqip-text-muted)' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: 'var(--aqip-text-muted)' }} axisLine={false} tickLine={false} domain={[60, 100]} />
                    <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: 'var(--aqip-shadow-md)', backgroundColor: 'var(--aqip-bg-surface)', color: 'var(--aqip-text-primary)' }} />
                    <Line type="monotone" dataKey="score" stroke="var(--aqip-primary)" strokeWidth={3} dot={{ r: 4, fill: 'var(--aqip-primary)', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </AQIPCard>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.4 }}>
            <AQIPCard className="shadow-[var(--aqip-shadow-md)] bg-[var(--aqip-primary)]/5 border-[var(--aqip-primary)]/20">
              <h2 className="text-sm font-bold text-aqip-primary uppercase tracking-wide border-b border-aqip-primary/20 pb-2 mb-4 flex items-center gap-2">
                <BookOpen className="h-4 w-4" /> Recommandation IA
              </h2>
              {formations.length > 0 ? (
                <div className="space-y-3">
                  {formations.slice(0, 2).map(f => (
                    <div key={f.formationId} className="bg-[var(--aqip-bg-surface)] p-3 rounded-xl border border-aqip-border shadow-sm">
                      <h3 className="text-sm font-bold text-aqip-text-primary">{f.formationLabel}</h3>
                      <p className="text-xs text-aqip-text-muted mt-1">{f.duree} — {f.type}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-[var(--aqip-bg-surface)] p-3 rounded-xl border border-aqip-border shadow-sm mb-4">
                  <h3 className="text-sm font-bold text-aqip-text-primary">Module: Langue Française</h3>
                  <p className="text-xs text-aqip-text-muted mt-1">Suite aux erreurs récentes (FR-01), ce module de 30min vous est suggéré.</p>
                </div>
              )}
              <Link to="/formations/catalogue" className="block mt-4">
                <AQIPButton variant="primary" className="w-full justify-center gap-2">
                  <PlayCircle className="h-4 w-4" /> Voir le catalogue
                </AQIPButton>
              </Link>
            </AQIPCard>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
