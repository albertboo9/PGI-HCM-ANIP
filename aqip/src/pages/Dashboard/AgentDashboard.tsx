import AQIPStatCard from '../../components/ui/AQIPStatCard';
import AQIPCard from '../../components/ui/AQIPCard';
import AQIPScoreRing from '../../components/ui/AQIPScoreRing';
import AQIPProgress from '../../components/ui/AQIPProgress';
import { BookOpen, Target, Award, AlertTriangle, TrendingUp, Clock } from 'lucide-react';

const MY_COMPETENCES = [
  { nom: 'Capture biométrique', niveau: 90, requis: 85 },
  { nom: 'Orthographe (FR)', niveau: 62, requis: 80 },
  { nom: 'Accueil citoyen', niveau: 78, requis: 75 },
  { nom: 'Procédures ANIP', niveau: 85, requis: 80 },
];

const MY_FORMATIONS = [
  { nom: 'Module Orthographe Avancée', type: 'E-learning', progress: 35, deadline: '15 Juil 2026' },
  { nom: 'Protocole VIP', type: 'Présentiel', progress: 0, deadline: '22 Août 2026' },
];

export default function AgentDashboard() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-2xl font-bold text-aqip-text-primary tracking-tight">Mon Espace Agent</h1>
        <p className="text-sm text-aqip-text-muted mt-1">Performances, compétences et parcours de développement.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <AQIPStatCard title="Mon Score" value="74" icon={Target} trend={3} trendLabel="vs mois" />
        <AQIPStatCard title="Formations" value="2" icon={BookOpen} color="primary" />
        <AQIPStatCard title="Erreurs (30j)" value="4" icon={AlertTriangle} color="warning" trend={-50} />
        <AQIPStatCard title="Certifications" value="3/5" icon={Award} color="accent" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <AQIPCard className="flex flex-col items-center justify-center bg-gradient-to-br from-aqip-bg-surface to-aqip-primary/5 p-6">
          <AQIPScoreRing score={74} label="Score" size={140} strokeWidth={10} />
          <div className="mt-3 flex items-center gap-1 text-aqip-accent text-sm font-medium">
            <TrendingUp className="h-4 w-4" /> +3 pts ce mois
          </div>
        </AQIPCard>

        <AQIPCard className="lg:col-span-2">
          <h2 className="text-lg font-semibold text-aqip-text-primary flex items-center gap-2 mb-4">
            <Target className="h-5 w-5 text-aqip-primary" /> Mes Compétences
          </h2>
          <div className="space-y-3">
            {MY_COMPETENCES.map((c) => (
              <div key={c.nom} className="flex items-center gap-4">
                <div className="w-40 text-sm text-aqip-text-primary truncate flex items-center gap-2">
                  {c.niveau < c.requis && <AlertTriangle className="h-3 w-3 text-aqip-danger shrink-0" />}
                  {c.nom}
                </div>
                <div className="flex-1">
                  <AQIPProgress value={c.niveau} showValue={false} size="sm" color={c.niveau < c.requis ? 'danger' : 'accent'} />
                </div>
                <span className={`text-sm font-bold ${c.niveau < c.requis ? 'text-aqip-danger' : 'text-aqip-accent'}`}>{c.niveau}%</span>
              </div>
            ))}
          </div>
        </AQIPCard>
      </div>

      <AQIPCard>
        <h2 className="text-lg font-semibold text-aqip-text-primary flex items-center gap-2 mb-4">
          <BookOpen className="h-5 w-5 text-aqip-primary" /> Formations Assignées
        </h2>
        <div className="space-y-4">
          {MY_FORMATIONS.map((f) => (
            <div key={f.nom} className="p-4 bg-aqip-bg-elevated rounded-lg border border-aqip-border">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-sm font-medium text-aqip-text-primary">{f.nom}</p>
                  <p className="text-xs text-aqip-text-muted flex items-center gap-1 mt-1">
                    <Clock className="h-3 w-3" /> {f.deadline} — {f.type}
                  </p>
                </div>
                <button className="px-3 py-1.5 text-xs font-medium bg-aqip-primary text-white rounded-md hover:bg-aqip-primary/90 transition-colors">
                  {f.progress > 0 ? 'Continuer' : 'Commencer'}
                </button>
              </div>
              <AQIPProgress value={f.progress} size="sm" />
            </div>
          ))}
        </div>
      </AQIPCard>
    </div>
  );
}
