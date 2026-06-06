import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import AQIPCard from '../../components/ui/AQIPCard';
import { useToaster } from '../../components/ui/AQIPToaster';
import { Clock, Video, CheckCircle2, PlayCircle, BookOpen, Award, ArrowLeft, FileText, Trophy } from 'lucide-react';
import { motion } from 'framer-motion';

interface Chapitre {
  id: string;
  titre: string;
  duree: string;
  type: 'video' | 'lecture' | 'quiz';
  termine: boolean;
}

const MOCK_FORMATIONS: Record<string, { titre: string; categorie: string; duree: string; modules: number; chapitres: Chapitre[]; image: string }> = {
  'f1': {
    titre: 'Langue Française: Éviter les fautes de frappe',
    categorie: 'Qualité',
    duree: '30 min',
    modules: 4,
    image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=600&auto=format&fit=crop',
    chapitres: [
      { id: 'c1', titre: 'Introduction aux erreurs fréquentes', duree: '5 min', type: 'video', termine: false },
      { id: 'c2', titre: 'Règles de transcription des noms', duree: '10 min', type: 'lecture', termine: false },
      { id: 'c3', titre: 'Exercices pratiques de saisie', duree: '10 min', type: 'quiz', termine: false },
      { id: 'c4', titre: 'Validation finale et certificat', duree: '5 min', type: 'quiz', termine: false },
    ]
  },
  'f2': {
    titre: 'Capture Biométrique Avancée',
    categorie: 'Technique',
    duree: '2 heures',
    modules: 8,
    image: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?q=80&w=600&auto=format&fit=crop',
    chapitres: [
      { id: 'c1', titre: 'Principes de la capture biométrique', duree: '15 min', type: 'video', termine: false },
      { id: 'c2', titre: 'Positionnement des doigts', duree: '20 min', type: 'video', termine: false },
      { id: 'c3', titre: 'Détection des erreurs courantes', duree: '25 min', type: 'lecture', termine: false },
      { id: 'c4', titre: 'Quiz intermédiaire', duree: '15 min', type: 'quiz', termine: false },
      { id: 'c5', titre: 'Cas pratiques', duree: '30 min', type: 'quiz', termine: false },
      { id: 'c6', titre: 'Certification finale', duree: '15 min', type: 'quiz', termine: false },
    ]
  }
};

export default function FormationDetailPage() {
  const { formationId } = useParams<{ formationId: string }>();
  const formation = MOCK_FORMATIONS[formationId || 'f1'] || MOCK_FORMATIONS.f1;
  const [chapitres, setChapitres] = useState<Chapitre[]>(formation.chapitres.map(c => ({ ...c })));
  const [activeChapitre, setActiveChapitre] = useState<string | null>(null);
  const [quizScore, setQuizScore] = useState<number | null>(null);
  const [certificatObtenu, setCertificatObtenu] = useState(false);
  const { push } = useToaster();

  const completed = chapitres.filter(c => c.termine).length;
  const progress = Math.round((completed / chapitres.length) * 100);

  const toggleChapitre = (id: string) => {
    setChapitres(prev => prev.map(c => c.id === id ? { ...c, termine: !c.termine } : c));
    if (!chapitres.find(c => c.id === id)?.termine) {
      push('success', `Chapitre "${chapitres.find(c => c.id === id)?.titre}" terminé !`);
    }
    // Vérifier si tout est terminé
    const newCompleted = chapitres.filter(c => c.id !== id ? c.termine : !chapitres.find(c => c.id === id)?.termine).length + 1;
    if (newCompleted === chapitres.length && !certificatObtenu) {
      setTimeout(() => {
        setCertificatObtenu(true);
        push('coach', 'Félicitations ! Vous avez terminé la formation. Votre certificat est prêt.', { label: 'Voir mon certificat', to: '/certificats' });
      }, 1000);
    }
  };

  const passerQuiz = (chapitreId: string) => {
    const score = Math.floor(Math.random() * 30) + 70; // 70-100
    setQuizScore(score);
    setActiveChapitre(chapitreId);
    if (score >= 80) {
      setChapitres(prev => prev.map(c => c.id === chapitreId ? { ...c, termine: true } : c));
      push('success', `Quiz réussi avec ${score}% ! Chapitre validé.`);
    } else {
      push('warning', `Quiz: ${score}%. Révisez et réessayez (80% requis).`);
    }
    setTimeout(() => { setActiveChapitre(null); setQuizScore(null); }, 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Hero */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <AQIPCard className="bg-gradient-to-r from-[#2B5E8D] to-[#1E3A8A] text-white border-none overflow-hidden p-0">
          <div className="z-10 p-6 md:p-8">
            <Link to="/formations/catalogue" className="text-white/60 hover:text-white text-xs flex items-center gap-1 mb-3"><ArrowLeft className="h-3.5 w-3.5" /> Retour au catalogue</Link>
            <h1 className="text-2xl font-bold">{formation.titre}</h1>
            <div className="flex flex-wrap gap-3 mt-3">
              <span className="bg-white/10 px-3 py-1 rounded-lg text-xs flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {formation.duree}</span>
              <span className="bg-white/10 px-3 py-1 rounded-lg text-xs flex items-center gap-1"><Video className="h-3.5 w-3.5" /> {formation.modules} chapitres</span>
              <span className="bg-[var(--aqip-accent)]/80 px-3 py-1 rounded-lg text-xs font-bold">{progress}% complété</span>
            </div>
          </div>
        </AQIPCard>
      </motion.div>

      {certificatObtenu && (
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200 }}>
          <AQIPCard className="bg-gradient-to-r from-[var(--aqip-accent)]/20 to-[var(--aqip-primary)]/10 border-[var(--aqip-accent)]/40 text-center py-8">
            <Trophy className="h-16 w-16 text-[var(--aqip-accent)] mx-auto mb-4" />
            <h2 className="text-xl font-black text-[var(--aqip-text-primary)]">Certification Obtenue !</h2>
            <p className="text-sm text-[var(--aqip-text-muted)] mt-2">Félicitations, vous maîtrisez désormais "{formation.titre}".</p>
            <Link to="/certificats" className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-[var(--aqip-accent)] text-white text-xs font-bold rounded-lg hover:opacity-90"><Award className="h-4 w-4" /> Voir mon certificat</Link>
          </AQIPCard>
        </motion.div>
      )}

      {/* Barre de progression */}
      <AQIPCard>
        <div className="flex justify-between text-xs text-[var(--aqip-text-muted)] mb-2">
          <span>Progression</span><span>{completed}/{chapitres.length} chapitres</span>
        </div>
        <div className="h-3 bg-[var(--aqip-bg-elevated)] rounded-full overflow-hidden">
          <motion.div className="h-full bg-gradient-to-r from-[var(--aqip-primary)] to-[var(--aqip-accent)] rounded-full" initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ duration: 0.8 }} />
        </div>
      </AQIPCard>

      {/* Chapitres */}
      <div className="space-y-3">
        {chapitres.map((ch, idx) => (
          <motion.div key={ch.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.1 }}>
            <AQIPCard className={`${ch.termine ? 'border-[var(--aqip-accent)]/40 bg-[var(--aqip-accent)]/5' : ''}`}>
              <div className="flex items-center gap-4">
                <div className={`h-10 w-10 rounded-full flex items-center justify-center shrink-0 ${ch.termine ? 'bg-[var(--aqip-accent)]/20 text-[var(--aqip-accent)]' : 'bg-[var(--aqip-bg-elevated)] text-[var(--aqip-text-muted)]'}`}>
                  {ch.termine ? <CheckCircle2 className="h-5 w-5" /> : (ch.type === 'video' ? <PlayCircle className="h-5 w-5" /> : ch.type === 'lecture' ? <BookOpen className="h-5 w-5" /> : <FileText className="h-5 w-5" />)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[var(--aqip-text-primary)]">{ch.titre}</span>
                    <span className="text-[10px] bg-[var(--aqip-bg-elevated)] px-1.5 py-0.5 rounded text-[var(--aqip-text-muted)]">{ch.duree}</span>
                  </div>
                  <span className="text-[10px] text-[var(--aqip-text-muted)]">{ch.type === 'video' ? 'Vidéo' : ch.type === 'lecture' ? 'Lecture' : 'Quiz'}</span>
                </div>
                {ch.type === 'quiz' && !ch.termine ? (
                  <button onClick={() => passerQuiz(ch.id)} disabled={activeChapitre === ch.id}
                    className="px-3 py-1.5 bg-[var(--aqip-warning)] text-white text-[10px] font-bold rounded-lg hover:opacity-90 transition-opacity">
                    {activeChapitre === ch.id ? `Score: ${quizScore}%` : 'Passer le quiz'}
                  </button>
                ) : (
                  <button onClick={() => toggleChapitre(ch.id)}
                    className={`px-3 py-1.5 text-[10px] font-bold rounded-lg transition-all ${ch.termine ? 'bg-[var(--aqip-accent)]/10 text-[var(--aqip-accent)] border border-[var(--aqip-accent)]/30' : 'bg-[var(--aqip-primary)] text-white hover:bg-[var(--aqip-primary)]/90'}`}>
                    {ch.termine ? '✓ Validé' : 'Marquer terminé'}
                  </button>
                )}
              </div>
            </AQIPCard>
          </motion.div>
        ))}
      </div>
    </div>
  );
}