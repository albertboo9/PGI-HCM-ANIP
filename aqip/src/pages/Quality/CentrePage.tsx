import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import AQIPCard from '../../components/ui/AQIPCard';
import { useCentreStore } from '../../store/centreStore';
import { useAgentStore } from '../../store/agentStore';
import { useIncidentStore } from '../../store/incidentStore';
import { getAgentSkillGaps } from '../../services/skillEngine';
import { motion } from 'framer-motion';
import { Users, TrendingUp, ShieldAlert, Award, BookOpen, Target, Star, AlertTriangle, ArrowRight, Sparkles } from 'lucide-react';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from 'recharts';

export default function CentrePage() {
  const centres = useCentreStore(s => s.centres);
  const agents = useAgentStore(s => s.agents);
  const incidents = useIncidentStore(s => s.incidents);

  // Pour la démo, le Chef de Centre voit le centre de Cotonou
  const centre = centres.find(c => c.id === 'ctr-001') || centres[0];
  const centreAgents = useMemo(() =>
    agents.filter(a => a.centreId === centre?.id),
  [agents, centre]);

  const agentsAvecGaps = useMemo(() =>
    centreAgents.map(agent => ({
      agent,
      gaps: getAgentSkillGaps(agent, incidents),
      nbIncidents: incidents.filter(i => i.agentId === agent.id).length,
    })).sort((a, b) => b.gaps.length - a.gaps.length),
  [centreAgents, incidents]);

  const agentsPrioritaires = agentsAvecGaps.filter(a => a.gaps.length >= 2);
  const topPerformers = agentsAvecGaps.filter(a => a.gaps.length === 0).slice(0, 3);
  const totalIncidentsCentre = incidents.filter(i => i.centreId === centre?.id).length;

  // Radar data
  const radarData = [
    { competence: 'Biométrie', score: 72, fullMark: 100 },
    { competence: 'État Civil', score: 68, fullMark: 100 },
    { competence: 'Accueil', score: 88, fullMark: 100 },
    { competence: 'Productivité', score: 81, fullMark: 100 },
    { competence: 'Qualité', score: 75, fullMark: 100 },
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Hero */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <AQIPCard className="bg-gradient-to-r from-[#2B5E8D] to-[#1E3A8A] text-white border-none shadow-[var(--aqip-shadow-glow)] relative overflow-hidden p-0">
          <div className="relative z-10 p-6 md:p-8">
            <h1 className="text-2xl font-bold tracking-tight">Vue Centre — {centre?.nom || 'Cotonou'}</h1>
            <p className="text-white/80 mt-1 text-sm">Pilotage de la performance et des compétences de votre équipe</p>
            <div className="flex flex-wrap gap-3 mt-4">
              <div className="bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-white/20 flex items-center gap-2 text-sm">
                <Users className="h-4 w-4" /> {centreAgents.length} agents
              </div>
              <div className="bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-white/20 flex items-center gap-2 text-sm">
                <ShieldAlert className="h-4 w-4" /> {totalIncidentsCentre} incidents
              </div>
              <div className="bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-white/20 flex items-center gap-2 text-sm">
                <BookOpen className="h-4 w-4" /> {agentsPrioritaires.length} agents à accompagner
              </div>
            </div>
          </div>
          <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-white opacity-10 blur-3xl rounded-full"></div>
        </AQIPCard>
      </motion.div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <AQIPCard className="text-center">
          <div className="text-3xl font-black text-[var(--aqip-accent)]">{centreAgents.length}</div>
          <div className="text-xs text-[var(--aqip-text-muted)] mt-1">Effectif total</div>
        </AQIPCard>
        <AQIPCard className="text-center">
          <div className="text-3xl font-black text-[var(--aqip-warning)]">{agentsPrioritaires.length}</div>
          <div className="text-xs text-[var(--aqip-text-muted)] mt-1">Agents à accompagner</div>
        </AQIPCard>
        <AQIPCard className="text-center">
          <div className="text-3xl font-black text-[var(--aqip-accent)]">{topPerformers.length}</div>
          <div className="text-xs text-[var(--aqip-text-muted)] mt-1">Top performers</div>
        </AQIPCard>
        <AQIPCard className="text-center">
          <div className="text-3xl font-black text-[var(--aqip-primary)]">75%</div>
          <div className="text-xs text-[var(--aqip-text-muted)] mt-1">Score qualité centre</div>
        </AQIPCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Radar Compétences Centre */}
        <AQIPCard>
          <h2 className="text-lg font-bold text-[var(--aqip-text-primary)] mb-4 flex items-center gap-2">
            <Target className="h-5 w-5 text-[var(--aqip-primary)]" /> Radar de Compétences du Centre
          </h2>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="var(--aqip-border)" />
                <PolarAngleAxis dataKey="competence" tick={{ fontSize: 11, fill: 'var(--aqip-text-muted)' }} />
                <PolarRadiusAxis angle={90} domain={[0, 100]} tick={false} axisLine={false} />
                <Radar name="Centre" dataKey="score" stroke="var(--aqip-primary)" fill="var(--aqip-primary)" fillOpacity={0.2} strokeWidth={2} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </AQIPCard>

        {/* Agents Prioritaires */}
        <AQIPCard>
          <h2 className="text-lg font-bold text-[var(--aqip-text-primary)] mb-4 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-[var(--aqip-warning)]" /> Agents à Accompagner
          </h2>
          <div className="space-y-3 max-h-[320px] overflow-y-auto custom-scrollbar">
            {agentsPrioritaires.length > 0 ? (
              agentsPrioritaires.map(({ agent, gaps }) => (
                <div key={agent.id} className="bg-[var(--aqip-bg-elevated)] border border-[var(--aqip-border)] rounded-xl p-3 hover:border-[var(--aqip-warning)]/40 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-[var(--aqip-warning)]/10 flex items-center justify-center text-sm font-bold text-[var(--aqip-warning)]">
                        {agent.prenom[0]}{agent.nom[0]}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-[var(--aqip-text-primary)]">{agent.prenom} {agent.nom}</p>
                        <p className="text-[10px] text-[var(--aqip-text-muted)]">{agent.poste} — {incidents.filter(i => i.agentId === agent.id).length} incidents</p>
                      </div>
                    </div>
                    <Link to={`/agent/${agent.id}/dossier`} className="text-[10px] font-bold text-[var(--aqip-primary)] hover:underline flex items-center gap-1">
                      Dossier <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {gaps.slice(0, 3).map(gap => (
                      <span key={gap.competenceId} className="text-[9px] bg-[var(--aqip-danger)]/5 border border-[var(--aqip-danger)]/20 px-2 py-0.5 rounded-full text-[var(--aqip-danger)] flex items-center gap-1">
                        {gap.competenceLabel} <span className="font-bold">-{gap.gap}</span>
                      </span>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-[var(--aqip-text-muted)] text-sm">Aucun agent critique détecté. Félicitations !</div>
            )}
          </div>
        </AQIPCard>
      </div>

      {/* Top Performers + Formations en cours */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AQIPCard>
          <h2 className="text-lg font-bold text-[var(--aqip-text-primary)] mb-4 flex items-center gap-2">
            <Award className="h-5 w-5 text-[var(--aqip-accent)]" /> Top Performers
          </h2>
          <div className="space-y-3">
            {topPerformers.length > 0 ? (
              topPerformers.map(({ agent }) => (
                <div key={agent.id} className="flex items-center justify-between bg-[var(--aqip-bg-elevated)] border border-[var(--aqip-border)] rounded-xl p-3">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-[var(--aqip-accent)]/10 flex items-center justify-center text-sm font-bold text-[var(--aqip-accent)]">
                      {agent.prenom[0]}{agent.nom[0]}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-[var(--aqip-text-primary)]">{agent.prenom} {agent.nom}</p>
                      <p className="text-[10px] text-[var(--aqip-text-muted)]">{agent.poste} — Score {agent.scores.composite}%</p>
                    </div>
                  </div>
                  <Star className="h-4 w-4 text-[var(--aqip-gold)] fill-[var(--aqip-gold)]" />
                </div>
              ))
            ) : (
              agentsAvecGaps.slice(0, 3).map(({ agent }) => (
                <div key={agent.id} className="flex items-center justify-between bg-[var(--aqip-bg-elevated)] border border-[var(--aqip-border)] rounded-xl p-3">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-[var(--aqip-primary)]/10 flex items-center justify-center text-sm font-bold text-[var(--aqip-primary)]">
                      {agent.prenom[0]}{agent.nom[0]}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-[var(--aqip-text-primary)]">{agent.prenom} {agent.nom}</p>
                      <p className="text-[10px] text-[var(--aqip-text-muted)]">{agent.poste} — Score {agent.scores.composite}%</p>
                    </div>
                  </div>
                  <TrendingUp className="h-4 w-4 text-[var(--aqip-accent)]" />
                </div>
              ))
            )}
          </div>
        </AQIPCard>

        {/* Évolution des compétences */}
        <AQIPCard className="bg-gradient-to-r from-[var(--aqip-primary)]/10 to-[var(--aqip-accent)]/5 border-[var(--aqip-primary)]/20">
          <h2 className="text-lg font-bold text-[var(--aqip-text-primary)] mb-4 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-[var(--aqip-primary)]" /> Évolution des Compétences
          </h2>
          <div className="space-y-4">
            {radarData.map(item => (
              <div key={item.competence} className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="font-medium text-[var(--aqip-text-primary)]">{item.competence}</span>
                  <span className="text-[var(--aqip-text-muted)]">{item.score}%</span>
                </div>
                <div className="h-2 bg-[var(--aqip-bg-elevated)] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[var(--aqip-primary)] to-[var(--aqip-accent)] rounded-full transition-all duration-500"
                    style={{ width: `${item.score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
          <p className="text-[10px] text-[var(--aqip-text-muted)] mt-4 leading-relaxed">
            Progression sur 3 mois. La compétence « État Civil » est en amélioration (+8 pts) grâce aux formations prescrites.
          </p>
        </AQIPCard>
      </div>

      {/* Formations en cours au centre */}
      <AQIPCard>
        <h2 className="text-lg font-bold text-[var(--aqip-text-primary)] mb-4 flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-[var(--aqip-primary)]" /> Formations en Cours
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-[var(--aqip-bg-elevated)] border border-[var(--aqip-border)] rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <BookOpen className="h-4 w-4 text-[var(--aqip-primary)]" />
              <span className="text-[10px] font-bold text-[var(--aqip-primary)] uppercase tracking-wider">En cours</span>
            </div>
            <h4 className="text-sm font-bold text-[var(--aqip-text-primary)]">Langue Française: Éviter les fautes</h4>
            <p className="text-[10px] text-[var(--aqip-text-muted)] mt-1">3 agents inscrits</p>
            <div className="mt-3 h-1.5 bg-[var(--aqip-bg-surface)] rounded-full overflow-hidden">
              <div className="h-full bg-[var(--aqip-accent)] rounded-full" style={{ width: '65%' }} />
            </div>
          </div>
          <div className="bg-[var(--aqip-bg-elevated)] border border-[var(--aqip-border)] rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Target className="h-4 w-4 text-[var(--aqip-warning)]" />
              <span className="text-[10px] font-bold text-[var(--aqip-warning)] uppercase tracking-wider">Prescrit</span>
            </div>
            <h4 className="text-sm font-bold text-[var(--aqip-text-primary)]">Capture Biométrique Avancée</h4>
            <p className="text-[10px] text-[var(--aqip-text-muted)] mt-1">2 agents assignés — PDI</p>
            <div className="mt-3 h-1.5 bg-[var(--aqip-bg-surface)] rounded-full overflow-hidden">
              <div className="h-full bg-[var(--aqip-warning)] rounded-full" style={{ width: '40%' }} />
            </div>
          </div>
          <div className="bg-[var(--aqip-bg-elevated)] border border-[var(--aqip-border)] rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Award className="h-4 w-4 text-[var(--aqip-accent)]" />
              <span className="text-[10px] font-bold text-[var(--aqip-accent)] uppercase tracking-wider">Terminée</span>
            </div>
            <h4 className="text-sm font-bold text-[var(--aqip-text-primary)]">Accueil & Service Citoyen</h4>
            <p className="text-[10px] text-[var(--aqip-text-muted)] mt-1">5 agents certifiés — Score moyen 92%</p>
            <div className="mt-3 h-1.5 bg-[var(--aqip-bg-surface)] rounded-full overflow-hidden">
              <div className="h-full bg-[var(--aqip-accent)] rounded-full" style={{ width: '100%' }} />
            </div>
          </div>
        </div>
      </AQIPCard>
    </div>
  );
}