import { Link } from 'react-router-dom';
import AQIPCard from '../../components/ui/AQIPCard';
import { useAuthStore } from '../../store/authStore';
import { useAgentStore } from '../../store/agentStore';
import { Sparkles, TrendingUp, Award, Clock, BookOpen, Target, Trophy, ArrowRight, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

const TIMELINE_STEPS = [
  { mois: 'Mars 2026', titre: 'Constat initial', description: '15 erreurs FR-01 détectées sur vos dossiers de saisie.', type: 'probleme' as const, metric: '15 erreurs', icon: Target },
  { mois: 'Avril 2026', titre: 'Formation prescrite', description: 'Module « Maîtrise de la transcription des actes » (2h) assigné par votre Coach.', type: 'formation' as const, metric: '2h de formation', icon: BookOpen },
  { mois: 'Mai 2026', titre: 'Premiers progrès', description: 'Les erreurs FR-01 tombent à 8. Le Coach note une amélioration significative.', type: 'progres' as const, metric: '8 erreurs', icon: TrendingUp },
  { mois: 'Juin 2026', titre: 'Certification obtenue', description: 'Certification « Contrôle Qualité État Civil » validée avec un score de 88%.', type: 'certification' as const, metric: 'Score 88%', icon: Award },
  { mois: 'Juillet 2026', titre: 'Maîtrise confirmée', description: 'Seulement 3 erreurs FR-01. Vous atteignez le niveau Expert en transcription.', type: 'excellence' as const, metric: '3 erreurs', icon: Trophy },
  { mois: 'Août 2026', titre: 'Recommandation de promotion', description: 'Votre Coach vous recommande pour le poste de Superviseur Qualité.', type: 'promotion' as const, metric: 'Promotion', icon: Sparkles },
];

const typeConfig: Record<string, { bg: string; border: string; text: string; dot: string }> = {
  probleme: { bg: 'bg-[var(--aqip-danger)]/5', border: 'border-[var(--aqip-danger)]/30', text: 'text-[var(--aqip-danger)]', dot: 'bg-[var(--aqip-danger)]' },
  formation: { bg: 'bg-[var(--aqip-primary)]/5', border: 'border-[var(--aqip-primary)]/30', text: 'text-[var(--aqip-primary)]', dot: 'bg-[var(--aqip-primary)]' },
  progres: { bg: 'bg-[var(--aqip-warning)]/5', border: 'border-[var(--aqip-warning)]/30', text: 'text-[var(--aqip-warning)]', dot: 'bg-[var(--aqip-warning)]' },
  certification: { bg: 'bg-[var(--aqip-accent)]/5', border: 'border-[var(--aqip-accent)]/30', text: 'text-[var(--aqip-accent)]', dot: 'bg-[var(--aqip-accent)]' },
  excellence: { bg: 'bg-[var(--aqip-accent)]/10', border: 'border-[var(--aqip-accent)]/40', text: 'text-[var(--aqip-accent)]', dot: 'bg-[var(--aqip-accent)]' },
  promotion: { bg: 'bg-gradient-to-r from-[var(--aqip-primary)]/10 to-[var(--aqip-accent)]/10', border: 'border-[var(--aqip-primary)]/40', text: 'text-[var(--aqip-primary)]', dot: 'bg-[var(--aqip-primary)]' },
};

export default function MonEvolutionPage() {
  const { currentUser } = useAuthStore();
  const agents = useAgentStore(s => s.agents);

  const userIdToAgentId: Record<string, string> = { 'usr-005': 'agt-001', 'usr-007': 'agt-006' };
  const agentId = userIdToAgentId[currentUser?.id || ''] || 'agt-001';
  const agent = agents.find(a => a.id === agentId);

  const scoreAvant = 62, scoreApres = 88, erreursAvant = 18, erreursApres = 5;
  if (!agent) return null;

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <AQIPCard className="bg-gradient-to-r from-[#2B5E8D] to-[#1E3A8A] text-white border-none overflow-hidden p-0">
          <div className="z-10 p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h1 className="text-2xl font-bold">Mon Évolution Professionnelle</h1>
              <p className="text-white/80 mt-1 text-sm">{agent.prenom} {agent.nom} — Agent d'enrôlement, Cotonou</p>
              <div className="flex gap-3 mt-4"><div className="bg-white/10 px-3 py-1.5 rounded-lg border border-white/20 text-sm flex items-center gap-2"><Clock className="h-4 w-4" /> Mars — Août 2026</div></div>
            </div>
            <div className="flex items-center gap-6 bg-white/10 rounded-2xl p-4 border border-white/20">
              <div className="text-center"><div className="text-2xl font-black">{scoreAvant}%</div><div className="text-[10px] text-white/60">Mars</div></div>
              <ArrowRight className="h-5 w-5 text-white/60" />
              <div className="text-center"><div className="text-2xl font-black text-[var(--aqip-accent)]">{scoreApres}%</div><div className="text-[10px] text-white/60">Août</div></div>
            </div>
          </div>
        </AQIPCard>
      </motion.div>

      <div className="grid grid-cols-3 gap-4">
        <AQIPCard className="text-center"><div className="text-3xl font-black text-[var(--aqip-accent)]">-72%</div><div className="text-xs text-[var(--aqip-text-muted)] mt-1">Erreurs FR-01</div><div className="flex justify-center gap-2 mt-2 text-xs"><span className="text-[var(--aqip-danger)] font-bold">{erreursAvant}</span><span>→</span><span className="text-[var(--aqip-accent)] font-bold">{erreursApres}</span></div></AQIPCard>
        <AQIPCard className="text-center"><div className="text-3xl font-black text-[var(--aqip-accent)]">+26 pts</div><div className="text-xs text-[var(--aqip-text-muted)] mt-1">Score qualité</div><div className="flex justify-center gap-2 mt-2 text-xs"><span className="text-[var(--aqip-danger)] font-bold">{scoreAvant}%</span><span>→</span><span className="text-[var(--aqip-accent)] font-bold">{scoreApres}%</span></div></AQIPCard>
        <AQIPCard className="text-center"><div className="text-3xl font-black text-[var(--aqip-primary)]">3</div><div className="text-xs text-[var(--aqip-text-muted)] mt-1">Certifications</div><div className="flex justify-center gap-1 mt-2"><span className="text-[10px] bg-[var(--aqip-accent)]/10 text-[var(--aqip-accent)] px-2 py-0.5 rounded-full">Transcription</span><span className="text-[10px] bg-[var(--aqip-accent)]/10 text-[var(--aqip-accent)] px-2 py-0.5 rounded-full">Qualité</span><span className="text-[10px] bg-[var(--aqip-accent)]/10 text-[var(--aqip-accent)] px-2 py-0.5 rounded-full">Biométrie</span></div></AQIPCard>
      </div>

      <AQIPCard className="bg-gradient-to-r from-[var(--aqip-primary)]/10 to-[var(--aqip-accent)]/5 border-[var(--aqip-primary)]/20">
        <div className="flex items-start gap-4">
          <div className="h-10 w-10 rounded-full bg-[var(--aqip-primary)]/20 flex items-center justify-center shrink-0"><Sparkles className="h-5 w-5 text-[var(--aqip-primary)]" /></div>
          <div>
            <h3 className="text-sm font-bold text-[var(--aqip-text-primary)]">Votre Coach IA <span className="text-[10px] text-[var(--aqip-accent)] bg-[var(--aqip-accent)]/10 px-2 py-0.5 rounded-full">Bilan</span></h3>
            <p className="text-xs text-[var(--aqip-text-secondary)] mt-2 italic">« Félicitations {agent.prenom} ! En 6 mois, -72% d'erreurs et 3 certifications. Vous avez le profil pour devenir Superviseur Qualité. »</p>
            <Link to="/coach" className="inline-flex items-center gap-1 mt-3 text-xs font-bold text-[var(--aqip-primary)] hover:underline">Opportunités de carrière →</Link>
          </div>
        </div>
      </AQIPCard>

      <div><h2 className="text-lg font-bold text-[var(--aqip-text-primary)] mb-6 flex items-center gap-2"><Clock className="h-5 w-5 text-[var(--aqip-primary)]" /> Chronologie</h2>
        <div className="relative">
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-[var(--aqip-border)] hidden md:block" />
          <div className="space-y-4">
            {TIMELINE_STEPS.map((step, idx) => {
              const config = typeConfig[step.type];
              return (
                <motion.div key={step.mois} initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, delay: idx * 0.15 }} className="relative pl-16 md:pl-16 pb-4">
                  <div className={`absolute left-4 top-1 h-5 w-5 rounded-full border-2 border-[var(--aqip-bg-surface)] ${config.dot} hidden md:flex items-center justify-center`}>
                    {idx === TIMELINE_STEPS.length - 1 && <CheckCircle2 className="h-3 w-3 text-white" />}
                  </div>
                  <AQIPCard className={`${config.bg} ${config.border}`}>
                    <div className="flex items-start justify-between flex-wrap gap-3">
                      <div className="flex items-center gap-3">
                        <div className={`h-10 w-10 rounded-xl ${config.bg} border ${config.border} flex items-center justify-center`}><step.icon className={`h-5 w-5 ${config.text}`} /></div>
                        <div>
                          <div className="flex items-center gap-2 mb-0.5"><span className="text-[10px] font-bold text-[var(--aqip-text-muted)] uppercase">{step.mois}</span><span className={`text-[10px] font-bold ${config.text} bg-white/5 px-2 py-0.5 rounded-full`}>{step.type}</span></div>
                          <h3 className="text-sm font-bold text-[var(--aqip-text-primary)]">{step.titre}</h3>
                          <p className="text-xs text-[var(--aqip-text-secondary)] mt-1">{step.description}</p>
                        </div>
                      </div>
                      <div className={`text-sm font-black ${config.text} bg-white/5 px-3 py-1.5 rounded-lg border ${config.border}`}>{step.metric}</div>
                    </div>
                  </AQIPCard>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="flex gap-3 justify-center">
        <Link to={`/agent/${agent.id}/dossier`} className="px-5 py-2.5 bg-[var(--aqip-primary)] text-white text-sm font-bold rounded-xl hover:bg-[var(--aqip-primary)]/90 transition-all flex items-center gap-2"><Target className="h-4 w-4" /> Mon Dossier d'Amélioration</Link>
        <Link to="/formations/catalogue" className="px-5 py-2.5 bg-[var(--aqip-bg-elevated)] text-[var(--aqip-text-primary)] text-sm font-bold rounded-xl border border-[var(--aqip-border)] hover:border-[var(--aqip-primary)]/50 transition-all flex items-center gap-2"><BookOpen className="h-4 w-4" /> Catalogue</Link>
      </div>
    </div>
  );
}