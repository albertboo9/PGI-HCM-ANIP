import { motion } from 'framer-motion';
import AQIPCard from '../../components/ui/AQIPCard';
import { Award, TrendingUp, BookOpen, Target, ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const STORIES = [
  {
    id: 'jean',
    agent: 'Jean Ahouangon',
    poste: "Agent d'enrôlement — Centre de Cotonou",
    histoire: 'Jean accumulait 18 erreurs de transcription (FR-01) par mois. Grâce au diagnostic du Coach IA, une formation ciblée lui a été prescrite.',
    formation: 'Maîtrise de la transcription des actes d\'état civil',
    scoreAvant: 62,
    scoreApres: 88,
    erreursAvant: 18,
    erreursApres: 5,
    reduction: '-72%',
    couleur: 'from-[var(--aqip-accent)]/10 to-[var(--aqip-primary)]/5',
    border: 'border-[var(--aqip-accent)]/30',
  },
  {
    id: 'marie',
    agent: 'Marie Dossou',
    poste: 'Agent biométrique — Centre de Parakou',
    histoire: 'Marie subissait 12 rejets biométriques mensuels. Le système a détecté un déficit en capture d\'empreintes. Un coaching personnalisé lui a été assigné.',
    formation: 'Capture biométrique avancée + Coaching',
    scoreAvant: 54,
    scoreApres: 85,
    erreursAvant: 12,
    erreursApres: 2,
    reduction: '-83%',
    couleur: 'from-[var(--aqip-warning)]/10 to-[var(--aqip-primary)]/5',
    border: 'border-[var(--aqip-warning)]/30',
  },
  {
    id: 'pierre',
    agent: 'Pierre Kpadonou',
    poste: "Agent d'accueil — Centre de Natitingou",
    histoire: "Avec 9 plaintes citoyennes en 2 mois pour accueil inadéquat, Pierre a bénéficié du module « Accueil & Service Citoyen ». Sa satisfaction usager a bondi.",
    formation: 'Accueil & Service Citoyen',
    scoreAvant: 48,
    scoreApres: 91,
    erreursAvant: 9,
    erreursApres: 1,
    reduction: '-89%',
    couleur: 'from-[var(--aqip-primary)]/10 to-[var(--aqip-accent)]/5',
    border: 'border-[var(--aqip-primary)]/30',
  },
];

export default function SuccessStoriesPage() {
  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      {/* Hero */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <AQIPCard className="bg-gradient-to-r from-[#2B5E8D] to-[#1E3A8A] text-white border-none shadow-[var(--aqip-shadow-glow)] relative overflow-hidden p-0">
          <div className="relative z-10 p-6 md:p-8">
            <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
              <Award className="h-6 w-6" /> AQIP Success Stories
            </h1>
            <p className="text-white/80 mt-1 text-sm max-w-lg">
              Derrière chaque indicateur se cache une transformation humaine. Découvrez comment nos agents ont transformé leurs erreurs en compétences.
            </p>
          </div>
          <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-white opacity-10 blur-3xl rounded-full"></div>
        </AQIPCard>
      </motion.div>

      {/* KPI Global */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <AQIPCard className="text-center">
          <div className="text-3xl font-black text-[var(--aqip-accent)]">-81%</div>
          <div className="text-xs text-[var(--aqip-text-muted)] mt-1">Réduction moyenne des erreurs</div>
        </AQIPCard>
        <AQIPCard className="text-center">
          <div className="text-3xl font-black text-[var(--aqip-accent)]">+29 pts</div>
          <div className="text-xs text-[var(--aqip-text-muted)] mt-1">Gain moyen du score qualité</div>
        </AQIPCard>
        <AQIPCard className="text-center">
          <div className="text-3xl font-black text-[var(--aqip-primary)]">3</div>
          <div className="text-xs text-[var(--aqip-text-muted)] mt-1">Agents promus</div>
        </AQIPCard>
      </div>

      {/* Stories */}
      <div className="space-y-6">
        {STORIES.map((story, idx) => (
          <motion.div
            key={story.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: idx * 0.2 }}
          >
            <AQIPCard className={`bg-gradient-to-r ${story.couleur} border ${story.border}`}>
              <div className="flex flex-col lg:flex-row gap-8">
                {/* Profil */}
                <div className="lg:w-64 shrink-0 flex flex-col items-center text-center">
                  <div className="h-20 w-20 rounded-2xl bg-[var(--aqip-bg-surface)] flex items-center justify-center text-2xl font-black text-[var(--aqip-primary)] border border-[var(--aqip-border)] shadow-sm mb-4">
                    {story.agent.split(' ')[0][0]}{story.agent.split(' ')[1][0]}
                  </div>
                  <h2 className="text-lg font-bold text-[var(--aqip-text-primary)]">{story.agent}</h2>
                  <p className="text-xs text-[var(--aqip-text-muted)] mt-1">{story.poste}</p>
                  <div className="mt-4 flex items-center gap-4">
                    <div className="text-center">
                      <div className="text-sm font-bold text-[var(--aqip-danger)]">{story.scoreAvant}%</div>
                      <div className="text-[9px] text-[var(--aqip-text-muted)]">Avant</div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-[var(--aqip-text-muted)]" />
                    <div className="text-center">
                      <div className="text-sm font-bold text-[var(--aqip-accent)]">{story.scoreApres}%</div>
                      <div className="text-[9px] text-[var(--aqip-text-muted)]">Après</div>
                    </div>
                  </div>
                </div>

                {/* Récit */}
                <div className="flex-1 space-y-5">
                  <div className="flex items-start gap-3">
                    <Sparkles className="h-5 w-5 text-[var(--aqip-primary)] shrink-0 mt-0.5" />
                    <p className="text-sm text-[var(--aqip-text-secondary)] leading-relaxed italic">
                      « {story.histoire} »
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-4">
                    <div className="flex items-center gap-2 bg-[var(--aqip-bg-surface)] border border-[var(--aqip-border)] px-3 py-2 rounded-xl">
                      <BookOpen className="h-4 w-4 text-[var(--aqip-primary)]" />
                      <span className="text-xs font-bold text-[var(--aqip-text-primary)]">{story.formation}</span>
                    </div>
                    <div className="flex items-center gap-2 bg-[var(--aqip-bg-surface)] border border-[var(--aqip-border)] px-3 py-2 rounded-xl">
                      <Target className="h-4 w-4 text-[var(--aqip-warning)]" />
                      <span className="text-xs font-bold text-[var(--aqip-warning)]">{story.erreursAvant} → {story.erreursApres} erreurs</span>
                    </div>
                    <div className="flex items-center gap-2 bg-[var(--aqip-accent)]/10 border border-[var(--aqip-accent)]/30 px-3 py-2 rounded-xl">
                      <TrendingUp className="h-4 w-4 text-[var(--aqip-accent)]" />
                      <span className="text-xs font-bold text-[var(--aqip-accent)]">{story.reduction} erreurs</span>
                    </div>
                  </div>

                  <Link to="/coach" className="inline-flex items-center gap-1 text-xs font-bold text-[var(--aqip-primary)] hover:underline">
                    Voir comment le Coach IA a aidé {story.agent.split(' ')[0]} →
                  </Link>
                </div>
              </div>
            </AQIPCard>
          </motion.div>
        ))}
      </div>

      {/* CTA */}
      <div className="text-center">
        <p className="text-sm text-[var(--aqip-text-muted)] max-w-md mx-auto leading-relaxed">
          Ces transformations sont rendues possibles par le moteur de développement des compétences AQIP. 
          Chaque erreur devient une opportunité d'apprentissage.
        </p>
        <Link to="/formations/catalogue" className="inline-flex items-center gap-2 mt-4 px-5 py-2.5 bg-[var(--aqip-primary)] text-white text-sm font-bold rounded-xl hover:bg-[var(--aqip-primary)]/90 transition-all shadow-md">
          <BookOpen className="h-4 w-4" /> Explorer le catalogue de formations
        </Link>
      </div>
    </div>
  );
}