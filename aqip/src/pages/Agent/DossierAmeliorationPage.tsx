import { useMemo } from 'react';

import { useParams, Link } from 'react-router-dom';
import AQIPCard from '../../components/ui/AQIPCard';
import AQIPProgress from '../../components/ui/AQIPProgress';
import AQIPBadge from '../../components/ui/AQIPBadge';
import { useAgentStore } from '../../store/agentStore';
import { useIncidentStore } from '../../store/incidentStore';
import { getAgentSkillGaps, getRecommendedFormations } from '../../services/skillEngine';

import { User, AlertTriangle, Target, BookOpen, TrendingUp, ArrowLeft, FileText, Shield, Eye, MessageSquare } from 'lucide-react';

const CANAL_CONFIG: Record<string, { label: string; icon: typeof Eye; color: string }> = {
  controleur: { label: 'Contrôleur Qualité', icon: Shield, color: 'text-aqip-primary' },
  chef_centre: { label: 'Chef de Centre', icon: Eye, color: 'text-aqip-warning' },
  systeme: { label: 'Système Automatique', icon: FileText, color: 'text-aqip-accent' },
  citoyen: { label: 'Réclamation Citoyen', icon: MessageSquare, color: 'text-aqip-danger' },
};

export default function DossierAmeliorationPage() {
  const { agentId } = useParams<{ agentId: string }>();
  const agents = useAgentStore(s => s.getAll());
  const incidents = useIncidentStore(s => s.getAll());

  

  const agent = agents.find(a => a.id === agentId);
  const agentIncidents = useMemo(
    () => incidents.filter(i => i.agentId === agentId).sort((a, b) => new Date(b.dateDetection).getTime() - new Date(a.dateDetection).getTime()),
    [incidents, agentId]
  );

  const gaps = useMemo(
    () => agent ? getAgentSkillGaps(agent, incidents) : [],
    [agent, incidents]
  );

  const formations = useMemo(
    () => getRecommendedFormations(gaps),
    [gaps]
  );

  // Données avant/après (simulation pour Jean Ahouangon)
  const hasImprovement = agent && (agent as any).scoresApres;
  const scoreAvant = agent?.scores.composite ?? 0;
  const scoreApres = hasImprovement ? (agent as any).scoresApres.composite : scoreAvant;

  if (!agent) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center text-aqip-text-muted">
          <p className="text-lg">Chargement du dossier...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link to="/dashboard" className="p-2 bg-aqip-bg-elevated rounded-lg hover:bg-aqip-border transition-colors">
          <ArrowLeft className="h-5 w-5 text-aqip-text-muted" />
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-aqip-text-primary tracking-tight">Dossier d'Amélioration Continue</h1>
          <p className="text-sm text-aqip-text-muted mt-0.5">Historique, compétences, plan de développement et résultats mesurables.</p>
        </div>
      </div>

      {/* Section 1 — Identité Agent */}
      <AQIPCard className="bg-gradient-to-r from-aqip-bg-surface to-aqip-primary/5 border-aqip-primary/20">
        <div className="flex items-center gap-6">
          <div className="h-16 w-16 bg-aqip-primary/20 rounded-full flex items-center justify-center text-aqip-primary shrink-0">
            <User className="h-8 w-8" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-white">{agent.prenom} {agent.nom}</h2>
            <p className="text-sm text-aqip-text-muted">{agent.poste} — {agent.grade}</p>
            <p className="text-xs text-aqip-text-muted mt-1">Matricule : {agent.matricule} — Embauche : {new Date(agent.dateEmbauche).toLocaleDateString('fr-FR')}</p>
          </div>
          <div className="text-center px-6 border-l border-aqip-border">
            <div className="text-3xl font-bold text-white">{agentIncidents.length}</div>
            <div className="text-xs text-aqip-text-muted">Incidents</div>
          </div>
          <div className="text-center px-6 border-l border-aqip-border">
            <div className="text-3xl font-bold text-white">{gaps.length}</div>
            <div className="text-xs text-aqip-text-muted">Gaps</div>
          </div>
        </div>
      </AQIPCard>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Section 2 — Historique des Incidents */}
        <AQIPCard noPadding>
          <div className="p-4 border-b border-aqip-border">
            <h2 className="text-lg font-semibold text-aqip-text-primary flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-aqip-danger" />
              Historique des Incidents
            </h2>
          </div>
          <div className="divide-y divide-aqip-border max-h-[400px] overflow-y-auto custom-scrollbar">
            {agentIncidents.map(inc => {
              const canal = CANAL_CONFIG[(inc as any).canalDetection || 'systeme'];
              const CanalIcon = canal?.icon || FileText;
              return (
                <div key={inc.id} className="p-4 hover:bg-aqip-bg-elevated/50 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-aqip-text-muted bg-aqip-bg-surface px-2 py-0.5 rounded">{inc.codeErreur}</span>
                      <AQIPBadge variant={inc.gravite === 'Critique' ? 'danger' : inc.gravite === 'Haute' ? 'warning' : 'default'}>
                        {inc.gravite}
                      </AQIPBadge>
                    </div>
                    <AQIPBadge variant={inc.statut === 'resolu' ? 'success' : inc.statut === 'nouveau' ? 'danger' : 'info'}>
                      {inc.statut}
                    </AQIPBadge>
                  </div>
                  <p className="text-sm text-white mb-2">{inc.erreurLibelle}</p>
                  <div className="flex items-center justify-between text-xs text-aqip-text-muted">
                    <span className="flex items-center gap-1">
                      <CanalIcon className={`h-3.5 w-3.5 ${canal?.color}`} />
                      {canal?.label || 'Système'}
                    </span>
                    <span>{new Date(inc.dateDetection).toLocaleDateString('fr-FR')}</span>
                  </div>
                </div>
              );
            })}
            {agentIncidents.length === 0 && (
              <div className="p-8 text-center text-aqip-text-muted text-sm">Aucun incident enregistré.</div>
            )}
          </div>
        </AQIPCard>

        {/* Section 3 — Analyse des Compétences */}
        <AQIPCard>
          <h2 className="text-lg font-semibold text-aqip-text-primary flex items-center gap-2 mb-6">
            <Target className="h-5 w-5 text-aqip-warning" />
            Analyse des Compétences
          </h2>
          {gaps.length > 0 ? (
            <div className="space-y-5">
              {gaps.map(gap => (
                <div key={gap.competenceId}>
                  <div className="flex justify-between items-baseline mb-1.5">
                    <span className="text-sm font-medium text-white">{gap.competenceLabel}</span>
                    <span className="text-xs text-aqip-text-muted">Gap : <span className="font-bold text-aqip-danger">{gap.gap} pts</span></span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1">
                      <AQIPProgress value={gap.niveauActuel} max={5} showValue={false} size="md" color={gap.gap >= 2 ? 'danger' : 'warning'} />
                    </div>
                    <span className="text-sm font-bold text-white w-16 text-right">{gap.niveauActuel} / {gap.niveauRequis}</span>
                  </div>
                  <div className="mt-1.5 flex flex-wrap gap-1">
                    {gap.erreursCausantes.map(code => (
                      <span key={code} className="text-[10px] font-mono bg-aqip-bg-elevated px-1.5 py-0.5 rounded text-aqip-text-muted">{code}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-aqip-text-muted text-sm py-8">Aucun gap de compétence identifié.</div>
          )}
        </AQIPCard>
      </div>

      {/* Section 4 — Plan de Développement Individuel */}
      <AQIPCard>
        <h2 className="text-lg font-semibold text-aqip-text-primary flex items-center gap-2 mb-6">
          <BookOpen className="h-5 w-5 text-aqip-primary" />
          Plan de Développement Individuel (PDI)
        </h2>
        <div className="space-y-4">
          {formations.map(f => {
            {/* const mapping = getSkillMapping(f.erreursConcernees[0]); */}
            return (
              <div key={f.formationId} className="p-4 bg-aqip-bg-elevated rounded-lg border border-aqip-border">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-white">{f.formationLabel}</h3>
                    <p className="text-xs text-aqip-text-muted mt-0.5">{f.duree} — {f.type}</p>
                  </div>
                  <AQIPBadge variant={f.priorite === 'haute' ? 'danger' : f.priorite === 'moyenne' ? 'warning' : 'default'}>
                    Priorité {f.priorite}
                  </AQIPBadge>
                </div>
                <p className="text-sm text-aqip-text-secondary mb-3">
                  Objectif : {f.impactAttendu} (<span className="text-aqip-accent font-semibold">-{f.impactPourcentage}%</span> d'erreurs similaires)
                </p>
                <div className="flex items-center gap-2 text-xs text-aqip-text-muted">
                  <span>Erreurs concernées :</span>
                  {f.erreursConcernees.map(code => (
                    <span key={code} className="font-mono bg-aqip-bg-surface px-1.5 py-0.5 rounded">{code}</span>
                  ))}
                </div>
              </div>
            );
          })}
          {formations.length === 0 && (
            <div className="text-center text-aqip-text-muted text-sm py-6">Aucune formation recommandée pour le moment.</div>
          )}
        </div>
      </AQIPCard>

      {/* Section 5 — Résultats Mesurables (Avant / Après) */}
      {hasImprovement && (
        <AQIPCard className="bg-gradient-to-r from-aqip-bg-surface to-aqip-accent/5 border-aqip-accent/20">
          <h2 className="text-lg font-semibold text-aqip-text-primary flex items-center gap-2 mb-6">
            <TrendingUp className="h-5 w-5 text-aqip-accent" />
            Résultats Mesurables
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-aqip-bg-surface rounded-lg">
              <div className="text-xs font-semibold uppercase tracking-wider text-aqip-text-muted mb-3">Score Composite</div>
              <div className="flex items-center justify-center gap-4">
                <div>
                  <div className="text-3xl font-bold text-aqip-danger">{scoreAvant}%</div>
                  <div className="text-xs text-aqip-text-muted">Avant</div>
                </div>
                <div className="text-aqip-text-muted text-2xl">→</div>
                <div>
                  <div className="text-3xl font-bold text-aqip-accent">{scoreApres}%</div>
                  <div className="text-xs text-aqip-text-muted">Après</div>
                </div>
              </div>
              <div className="mt-3 text-sm font-bold text-aqip-accent">+{scoreApres - scoreAvant} pts</div>
            </div>
            <div className="text-center p-6 bg-aqip-bg-surface rounded-lg">
              <div className="text-xs font-semibold uppercase tracking-wider text-aqip-text-muted mb-3">Erreurs FR-01</div>
              <div className="flex items-center justify-center gap-4">
                <div>
                  <div className="text-3xl font-bold text-aqip-danger">18</div>
                  <div className="text-xs text-aqip-text-muted">Avant</div>
                </div>
                <div className="text-aqip-text-muted text-2xl">→</div>
                <div>
                  <div className="text-3xl font-bold text-aqip-accent">5</div>
                  <div className="text-xs text-aqip-text-muted">Après</div>
                </div>
              </div>
              <div className="mt-3 text-sm font-bold text-aqip-accent">-72%</div>
            </div>
            <div className="text-center p-6 bg-aqip-bg-surface rounded-lg">
              <div className="text-xs font-semibold uppercase tracking-wider text-aqip-text-muted mb-3">Satisfaction Citoyen</div>
              <div className="flex items-center justify-center gap-4">
                <div>
                  <div className="text-3xl font-bold text-aqip-danger">3.8</div>
                  <div className="text-xs text-aqip-text-muted">Avant</div>
                </div>
                <div className="text-aqip-text-muted text-2xl">→</div>
                <div>
                  <div className="text-3xl font-bold text-aqip-accent">4.5</div>
                  <div className="text-xs text-aqip-text-muted">Après</div>
                </div>
              </div>
              <div className="mt-3 text-sm font-bold text-aqip-accent">+0.7 pts</div>
            </div>
          </div>
        </AQIPCard>
      )}
    </div>
  );
}
