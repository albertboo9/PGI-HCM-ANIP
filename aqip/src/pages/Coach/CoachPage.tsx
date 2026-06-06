import { useState, useRef, useEffect } from 'react';
import { useAuthStore } from '../../store/authStore';
import { useIncidentStore } from '../../store/incidentStore';
import { useAgentStore } from '../../store/agentStore';
import { useCentreStore } from '../../store/centreStore';
import { getProactiveMessage, getStrategicProactiveMessage, generateCoachResponse, PREDEFINED_QUESTIONS_BY_ROLE } from '../../services/coachEngine';
import type { CoachMessage } from '../../services/coachEngine';
import AQIPCard from '../../components/ui/AQIPCard';
import AQIPScoreRing from '../../components/ui/AQIPScoreRing';
import { Send, Sparkles, BookOpen, ChevronRight, ShieldCheck, TrendingUp, Users, Map, Target, Briefcase, Search } from 'lucide-react';
import clsx from 'clsx';
import { motion } from 'framer-motion';

const ROLE_ICONS: Record<string, typeof Sparkles> = {
  agent: Target,
  chef_centre: Users,
  drh: TrendingUp,
  dg: Map,
  responsable_qualite: ShieldCheck,
  auditeur: Search,
  directeur_dept: Briefcase,
};

const ROLE_LABELS: Record<string, string> = {
  agent: 'Agent Coach',
  chef_centre: 'Coach d\'Équipe',
  drh: 'Conseiller RH',
  dg: 'Assistant Stratégique',
  responsable_qualite: 'Expert Qualité',
  auditeur: 'Analyste Conformité',
  directeur_dept: 'Coach Départemental',
};

export default function CoachPage() {
  const { currentRole, currentUser } = useAuthStore();
  const { incidents } = useIncidentStore();
  const { agents } = useAgentStore();
  const centres = useCentreStore(s => s.centres);

  const agent = agents.find(a => a.id === currentUser?.id) || agents[0];
  const questions = PREDEFINED_QUESTIONS_BY_ROLE[currentRole] || PREDEFINED_QUESTIONS_BY_ROLE.agent;

  const [messages, setMessages] = useState<CoachMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Proactive initial message — contextuel par rôle
  useEffect(() => {
    if (messages.length === 0) {
      let initialContent: string;
      if (currentRole === 'agent' && agent) {
        initialContent = getProactiveMessage(agent, incidents);
      } else {
        initialContent = getStrategicProactiveMessage(currentRole, agents, incidents);
      }
      setMessages([{ id: 'init', sender: 'coach', type: 'text', content: initialContent }]);
    }
  }, [currentRole, agent, incidents, agents, messages.length]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleAsk = (qId: string, text: string) => {
    const userMsg: CoachMessage = { id: Date.now().toString(), sender: 'agent', type: 'text', content: text };
    setMessages(prev => [...prev, userMsg]);

    setTimeout(() => {
      const response = generateCoachResponse(
        currentRole, qId, agent, agents, incidents, centres
      );
      setMessages(prev => [...prev, response]);
    }, 700);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    handleAsk(inputValue.trim(), inputValue.trim());
    setInputValue('');
  };

  const RoleIcon = ROLE_ICONS[currentRole] || Sparkles;

  const renderMessageContent = (msg: CoachMessage) => {
    if (msg.type === 'text') return <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>;

    if (msg.type === 'recommendation' && msg.data?.gap) {
      return (
        <div className="space-y-3">
          <p className="text-sm">{msg.content}</p>
          <div className="bg-aqip-primary/10 border border-aqip-primary/20 p-3 rounded-xl flex gap-3">
            <BookOpen className="h-5 w-5 text-aqip-primary shrink-0" />
            <div>
              <div className="text-sm font-bold text-white">Maîtrise de : {msg.data.gap.competenceLabel}</div>
              <div className="text-xs text-aqip-text-muted mt-1">Impact estimé : -65% d'erreurs (ROI élevé)</div>
              <a href="/formations/catalogue" className="mt-2 inline-block text-xs font-bold text-aqip-primary hover:underline">S'inscrire →</a>
            </div>
          </div>
        </div>
      );
    }

    if (msg.type === 'strategic') {
      return (
        <div className="space-y-2">
          <p className="text-sm leading-relaxed">{msg.content}</p>
          {msg.data?.agents && (
            <div className="flex flex-wrap gap-2 mt-2">
              {msg.data.agents.map((a: any) => (
                <span key={a.agent?.id || a.id} className="text-[10px] bg-white/10 border border-white/10 px-2 py-1 rounded-full text-white">
                  {a.agent?.prenom || a.prenom} {a.agent?.nom || a.nom} — Gap: {a.gaps?.[0]?.competenceLabel || 'N/A'}
                </span>
              ))}
            </div>
          )}
        </div>
      );
    }

    if (msg.type === 'action') {
      return (
        <div className="space-y-2">
          <p className="text-sm">{msg.content}</p>
          {msg.data?.agents && msg.data.agents.map((a: any) => (
            <div key={a.agent?.id || a.id} className="bg-white/5 border border-white/10 p-2 rounded-xl flex items-center gap-3">
              <span className="text-xs font-bold text-white">{a.agent?.prenom || a.prenom} {a.agent?.nom || a.nom}</span>
              <span className="text-[10px] text-aqip-text-muted">— {a.gaps?.map((g: any) => g.competenceLabel).join(', ') || 'Prioritaire'}</span>
            </div>
          ))}
        </div>
      );
    }

    if (msg.type === 'career' && msg.data?.paths) {
      return (
        <div className="space-y-3">
          <p className="text-sm">{msg.content}</p>
          {msg.data.paths.map((path: any, idx: number) => (
            <div key={idx} className="bg-white/5 border border-white/10 p-3 rounded-xl">
              <div className="flex justify-between items-center">
                <div className="text-sm font-bold text-white">{path.poste}</div>
                <div className="text-xs font-bold text-aqip-accent">{path.match}% match</div>
              </div>
              <div className="text-xs text-aqip-text-muted mt-1">Compétence à valider : {path.competencesManquantes[0]}</div>
            </div>
          ))}
        </div>
      );
    }

    if (msg.type === 'radar') {
      return (
        <div className="space-y-3">
          <p className="text-sm">{msg.content}</p>
          <div className="bg-white/5 border border-white/10 p-4 rounded-xl flex items-center justify-center">
            <div className="text-center">
              <ShieldCheck className="h-10 w-10 text-aqip-warning mx-auto mb-2" />
              <div className="text-sm font-bold text-aqip-warning">État Civil (Niveau 2/4)</div>
              <div className="text-xs text-white mt-1">C'est votre axe de progression prioritaire.</div>
            </div>
          </div>
        </div>
      );
    }

    return <p className="text-sm">{msg.content}</p>;
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col md:flex-row gap-6 animate-in fade-in duration-500">

      {/* Profil & Questions (1/3) */}
      <div className="w-full md:w-1/3 flex flex-col gap-4">
        {/* Identity card */}
        {currentRole === 'agent' && agent && (
          <AQIPCard className="bg-gradient-to-br from-aqip-bg-surface to-aqip-bg-elevated text-white shrink-0">
            <div className="flex items-center gap-4 mb-6">
              <div className="h-14 w-14 rounded-full bg-aqip-primary/20 text-aqip-primary flex items-center justify-center text-xl font-black border border-aqip-primary/30 shadow-inner">
                {agent.prenom[0]}{agent.nom[0]}
              </div>
              <div><h2 className="text-xl font-bold">{agent.prenom} {agent.nom}</h2><p className="text-sm text-aqip-text-muted">{agent.poste}</p></div>
            </div>
            <div className="flex justify-center my-4">
              <AQIPScoreRing score={agent.scores.composite} size={100} strokeWidth={8} color="text-aqip-accent" />
            </div>
            <div className="space-y-3">
              <div><div className="text-xs text-aqip-text-muted uppercase font-bold tracking-wider mb-1">Forces</div>
                <div className="flex flex-wrap gap-1"><span className="bg-aqip-success/10 text-aqip-success border border-aqip-success/20 px-2 py-1 rounded text-xs">Accueil Citoyen</span><span className="bg-aqip-success/10 text-aqip-success border border-aqip-success/20 px-2 py-1 rounded text-xs">Rapidité saisie</span></div></div>
              <div><div className="text-xs text-aqip-text-muted uppercase font-bold tracking-wider mb-1">Axes</div>
                <div className="flex flex-wrap gap-1"><span className="bg-aqip-warning/10 text-aqip-warning border border-aqip-warning/20 px-2 py-1 rounded text-xs">Contrôle État Civil</span></div></div>
            </div>
          </AQIPCard>
        )}

        {currentRole !== 'agent' && (
          <AQIPCard className="bg-gradient-to-br from-aqip-bg-surface to-aqip-bg-elevated text-white shrink-0">
            <div className="flex items-center gap-4 mb-4">
              <div className="h-14 w-14 rounded-full bg-aqip-primary/20 text-aqip-primary flex items-center justify-center text-xl font-black border border-aqip-primary/30 shadow-inner">
                <RoleIcon className="h-7 w-7" />
              </div>
              <div>
                <h2 className="text-xl font-bold">{ROLE_LABELS[currentRole] || 'Coach AQIP'}</h2>
                <p className="text-sm text-aqip-text-muted">{currentUser?.prenom} {currentUser?.nom}</p>
              </div>
            </div>
            <p className="text-xs text-aqip-text-secondary leading-relaxed">
              {currentRole === 'dg' && "Posez vos questions stratégiques sur les centres, les compétences nationales et les investissements formation."}
              {currentRole === 'drh' && "Gérez les talents, le budget formation et mesurez l'impact des actions de développement."}
              {currentRole === 'chef_centre' && "Suivez votre équipe, prescrivez des formations et pilotez la performance du centre."}
              {currentRole === 'responsable_qualite' && "Analysez les tendances d'erreurs et identifiez les causes racines."}
            </p>
          </AQIPCard>
        )}

        {/* Questions prédéfinies par rôle */}
        <div className="space-y-2 flex-1 overflow-y-auto custom-scrollbar pr-2">
          <div className="text-xs text-aqip-text-muted uppercase font-bold tracking-wider mb-3">Questions suggérées</div>
          {questions.map(q => (
            <button key={q.id} onClick={() => handleAsk(q.id, q.text)}
              className="w-full text-left p-3 rounded-xl bg-aqip-bg-surface border border-aqip-border hover:border-aqip-primary/50 transition-all group flex items-center justify-between">
              <span className="text-sm text-aqip-text-secondary group-hover:text-white transition-colors">{q.text}</span>
              <ChevronRight className="h-4 w-4 text-aqip-text-muted group-hover:text-aqip-primary transition-colors" />
            </button>
          ))}
        </div>
      </div>

      {/* Chat (2/3) */}
      <AQIPCard className="w-full md:w-2/3 flex flex-col p-0 overflow-hidden shadow-[var(--aqip-shadow-md)]">
        <div className="bg-aqip-bg-surface border-b border-aqip-border p-4 flex items-center gap-3 z-10 shrink-0">
          <div className="h-10 w-10 rounded-full bg-[var(--aqip-primary)]/20 flex items-center justify-center border border-[var(--aqip-primary)]/30">
            <RoleIcon className="h-5 w-5 text-aqip-primary" />
          </div>
          <div>
            <h3 className="font-bold text-white">{ROLE_LABELS[currentRole] || 'Coach AQIP'}</h3>
            <p className="text-xs text-aqip-text-muted flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-aqip-success" /> Contextuel — {currentRole.replace('_', ' ')}
            </p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gradient-to-b from-aqip-bg-elevated/10 to-aqip-bg-base">
          {messages.map((msg) => (
            <motion.div key={msg.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className={clsx("flex gap-3 max-w-[85%]", msg.sender === 'agent' ? "ml-auto flex-row-reverse" : "")}>
              <div className={clsx("h-8 w-8 rounded-full shrink-0 flex items-center justify-center font-bold text-xs shadow-sm mt-1",
                msg.sender === 'coach' ? "bg-aqip-primary text-white" : "bg-white/10 text-white")}>
                {msg.sender === 'coach' ? <RoleIcon className="h-4 w-4" /> : (agent?.prenom?.[0] || '?')}
              </div>
              <div className={clsx("p-4 rounded-2xl shadow-sm text-white",
                msg.sender === 'coach' ? "bg-aqip-bg-surface border border-aqip-border rounded-tl-sm" : "bg-aqip-primary/40 border border-aqip-primary/50 rounded-tr-sm")}>
                {renderMessageContent(msg)}
              </div>
            </motion.div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 bg-aqip-bg-surface border-t border-aqip-border shrink-0 z-10">
          <form onSubmit={handleSubmit} className="relative flex items-center">
            <input type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)}
              placeholder="Posez une question — compétences, formations, stratégie..."
              className="w-full bg-aqip-bg-elevated text-white rounded-full pl-5 pr-12 py-3.5 border border-aqip-border focus:outline-none focus:ring-2 focus:ring-aqip-primary focus:border-transparent transition-all text-sm shadow-inner" />
            <button type="submit" disabled={!inputValue.trim()}
              className="absolute right-2 p-2 bg-aqip-primary text-white rounded-full hover:bg-aqip-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      </AQIPCard>
    </div>
  );
}