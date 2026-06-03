import AQIPCard from '../../components/ui/AQIPCard';
import AQIPButton from '../../components/ui/AQIPButton';
import { MessageSquare, Star, User } from 'lucide-react';

const REVIEWS = [
  { agent: 'Adjo Pascal', type: 'Pair à Pair', rating: 4, comment: 'Très collaboratif lors des pics d\'affluence.', date: 'Il y a 2 jours' },
  { agent: 'Mensah Kofi', type: 'Manager', rating: 2, comment: 'Doit améliorer son orthographe sur les formulaires.', date: 'Semaine dernière' },
  { agent: 'Kossou Léa', type: 'Pair à Pair', rating: 5, comment: 'Excellente maîtrise du système biométrique !', date: 'Il y a 10 jours' },
];

export default function Feedback360Page() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-aqip-text-primary tracking-tight">Évaluations 360°</h1>
          <p className="text-sm text-aqip-text-muted mt-1">Campagnes d'évaluation par les pairs, managers et auto-évaluation.</p>
        </div>
        <AQIPButton>Lancer une Campagne</AQIPButton>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <AQIPCard className="lg:col-span-2">
          <h2 className="text-lg font-semibold text-aqip-text-primary flex items-center gap-2 mb-4">
            <MessageSquare className="h-5 w-5 text-aqip-primary" /> Derniers Feedbacks Reçus
          </h2>
          <div className="space-y-4">
            {REVIEWS.map((r, i) => (
              <div key={i} className="p-4 bg-aqip-bg-elevated rounded-lg border border-aqip-border flex gap-4 items-start">
                <div className="h-10 w-10 bg-aqip-bg-surface rounded-full flex items-center justify-center shrink-0">
                  <User className="h-5 w-5 text-aqip-text-muted" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold text-white">{r.agent}</p>
                      <p className="text-xs text-aqip-primary">{r.type}</p>
                    </div>
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map(star => (
                        <Star key={star} className={`h-4 w-4 ${star <= r.rating ? 'text-aqip-accent fill-aqip-accent' : 'text-aqip-border'}`} />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-aqip-text-muted mt-2 italic">"{r.comment}"</p>
                  <p className="text-xs text-aqip-text-muted mt-2 text-right">{r.date}</p>
                </div>
              </div>
            ))}
          </div>
        </AQIPCard>

        <div className="space-y-6">
          <AQIPCard className="bg-aqip-accent/10 border-aqip-accent/30 text-center py-8">
            <h3 className="text-lg font-bold text-aqip-text-primary mb-2">Campagne Q2 2026</h3>
            <p className="text-sm text-aqip-text-muted mb-4">La campagne d'évaluation trimestrielle est ouverte.</p>
            <div className="text-3xl font-bold text-aqip-accent mb-4">68%</div>
            <p className="text-xs text-aqip-text-muted">Taux de participation global</p>
          </AQIPCard>
        </div>
      </div>
    </div>
  );
}
