import { useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import AQIPStatCard from '../../components/ui/AQIPStatCard';
import AQIPCard from '../../components/ui/AQIPCard';
import AQIPScoreRing from '../../components/ui/AQIPScoreRing';
import AQIPProgress from '../../components/ui/AQIPProgress';
import { AlertTriangle, BookOpen, Clock, Users, ShieldCheck, FileText, Eye, MessageSquare, ArrowRight } from 'lucide-react';
import { useIncidentStore } from '../../store/incidentStore';
import { useAgentStore } from '../../store/agentStore';
import { getPriorityAgents } from '../../services/skillEngine';

const CANAL_CONFIG: Record<string, { label: string; icon: typeof Eye; color: string }> = {
  controleur: { label: 'Contrôleur', icon: ShieldCheck, color: 'text-aqip-primary' },
  chef_centre: { label: 'Chef Centre', icon: Eye, color: 'text-aqip-warning' },
  systeme: { label: 'Système', icon: FileText, color: 'text-aqip-accent' },
  citoyen: { label: 'Citoyen', icon: MessageSquare, color: 'text-aqip-danger' },
};

export default function CentreChefDashboard() {
  const { incidents, fetchIncidents } = useIncidentStore();
  const { agents, fetchAgents } = useAgentStore();

  const centreId = 'ctr-001'; // Mock for Cotonou Centre

  useEffect(() => {
    if (incidents.length === 0) fetchIncidents();
    if (agents.length === 0) fetchAgents();
  }, [incidents.length, agents.length, fetchIncidents, fetchAgents]);

  const centreAgents = useMemo(() => agents.filter(a => a.centreId === centreId), [agents, centreId]);
  const centreIncidents = useMemo(() => incidents.filter(i => i.centreId === centreId).sort((a, b) => new Date(b.dateDetection).getTime() - new Date(a.dateDetection).getTime()), [incidents, centreId]);
  
  const teamGaps = useMemo(() => getPriorityAgents(centreAgents, centreIncidents, 10), [centreAgents, centreIncidents]);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-2xl font-bold text-aqip-text-primary tracking-tight">Cotonou Centre — Mon Équipe</h1>
        <p className="text-sm text-aqip-text-muted mt-1">Supervision locale, détection des erreurs et accompagnement des agents.</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <AQIPStatCard title="Agents Actifs" value={centreAgents.length.toString()} icon={Users} trend={0} trendLabel="stable" />
        <AQIPStatCard title="Incidents Récents" value={centreIncidents.length.toString()} icon={AlertTriangle} color="danger" trend={-25} trendLabel="vs semaine passée" />
        <AQIPStatCard title="Agents en PDI" value={teamGaps.length.toString()} icon={BookOpen} color="warning" />
        <AQIPStatCard title="Couverture Gaps" value="82%" icon={ShieldCheck} color="primary" trend={1.5} trendLabel="vs mois" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Score du centre */}
        <AQIPCard className="flex flex-col items-center justify-center bg-gradient-to-br from-aqip-bg-surface to-aqip-accent/5 p-6">
          <AQIPScoreRing score={82} label="Couverture Gaps" size={140} strokeWidth={10} color="text-aqip-accent" />
          <div className="mt-4 w-full space-y-2">
            <AQIPProgress label="Contrôle Qualité" value={88} color="accent" size="sm" />
            <AQIPProgress label="Biométrie" value={72} color="warning" size="sm" />
            <AQIPProgress label="Accueil Citoyen" value={84} color="primary" size="sm" />
          </div>
        </AQIPCard>

        {/* Incidents récents */}
        <AQIPCard className="lg:col-span-2" noPadding>
          <div className="p-4 border-b border-aqip-border flex items-center justify-between">
            <h2 className="text-lg font-semibold text-aqip-text-primary flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-aqip-danger" />
              Dernières Détections
            </h2>
            <span className="text-xs text-aqip-text-muted flex items-center gap-1">
              <Clock className="h-3 w-3" /> Mis à jour à l'instant
            </span>
          </div>
          <div className="divide-y divide-aqip-border max-h-[300px] overflow-y-auto custom-scrollbar">
            {centreIncidents.slice(0, 5).map((inc) => {
              const canal = CANAL_CONFIG[(inc as any).canalDetection || 'systeme'];
              const CanalIcon = canal?.icon || FileText;
              const agent = centreAgents.find(a => a.id === inc.agentId);
              
              return (
                <div key={inc.id} className="flex flex-col sm:flex-row sm:items-center justify-between px-4 py-3 hover:bg-aqip-bg-elevated/50 transition-colors gap-3">
                  <div className="flex items-start gap-3">
                    <div className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 ${inc.gravite === 'Critique' ? 'bg-aqip-danger/20 text-aqip-danger' : inc.gravite === 'Haute' ? 'bg-aqip-warning/20 text-aqip-warning' : 'bg-aqip-primary/20 text-aqip-primary'}`}>
                      <AlertTriangle className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-aqip-text-primary">{inc.erreurLibelle}</p>
                      <p className="text-xs text-aqip-text-muted">{agent?.prenom} {agent?.nom} • {new Date(inc.dateDetection).toLocaleDateString('fr-FR')}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 sm:ml-auto pl-11 sm:pl-0">
                     <span className={`flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded bg-aqip-bg-surface border border-aqip-border ${canal?.color}`}>
                        <CanalIcon className="h-3 w-3" /> {canal?.label || 'Système'}
                     </span>
                     <Link to={`/agent/${inc.agentId}/dossier`} className="px-3 py-1.5 text-xs font-medium text-white bg-aqip-bg-elevated rounded hover:bg-aqip-border transition-colors">
                        Dossier
                     </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </AQIPCard>
      </div>

      {/* État de l'équipe */}
      <AQIPCard>
        <h2 className="text-lg font-semibold text-aqip-text-primary flex items-center gap-2 mb-4">
          <Users className="h-5 w-5 text-aqip-primary" />
          Mon Équipe — Suivi des Compétences
        </h2>
        <div className="space-y-3">
          {teamGaps.map(({ agent, totalGap, topGap, incidentCount }) => (
            <div key={agent.id} className="flex flex-col sm:flex-row sm:items-center gap-4 p-3 bg-aqip-bg-elevated rounded-lg border border-aqip-border hover:border-aqip-primary/30 transition-colors">
              <div className="h-10 w-10 rounded-full bg-aqip-bg-surface flex items-center justify-center text-aqip-text-muted font-bold text-sm shrink-0 border border-aqip-border">
                {agent.prenom[0]}{agent.nom[0]}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-aqip-text-primary truncate">{agent.prenom} {agent.nom}</p>
                <p className="text-xs text-aqip-text-muted">{agent.poste}</p>
              </div>
              
              <div className="flex-1 min-w-[200px]">
                {totalGap > 0 ? (
                  <>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-aqip-text-muted">Gap: {topGap?.competenceLabel}</span>
                      <span className="text-aqip-danger font-bold">-{topGap?.gap} pts</span>
                    </div>
                    <AQIPProgress value={5 - (topGap?.gap || 0)} max={5} showValue={false} size="sm" color="danger" />
                  </>
                ) : (
                  <>
                     <div className="flex justify-between text-xs mb-1">
                      <span className="text-aqip-text-muted">Compétences à jour</span>
                      <span className="text-aqip-accent font-bold">OK</span>
                    </div>
                    <AQIPProgress value={5} max={5} showValue={false} size="sm" color="accent" />
                  </>
                )}
              </div>
              
              <div className="flex items-center gap-4 sm:ml-4 border-t sm:border-t-0 sm:border-l border-aqip-border pt-3 sm:pt-0 sm:pl-4">
                 <div className="text-center px-2">
                    <div className="text-sm font-bold text-white">{incidentCount}</div>
                    <div className="text-[10px] text-aqip-text-muted uppercase">Erreurs</div>
                 </div>
                 <Link to={`/agent/${agent.id}/dossier`} className="ml-auto sm:ml-0 h-8 w-8 bg-aqip-primary/10 rounded flex items-center justify-center text-aqip-primary hover:bg-aqip-primary hover:text-white transition-colors">
                    <ArrowRight className="h-4 w-4" />
                 </Link>
              </div>
            </div>
          ))}
          {teamGaps.length === 0 && centreAgents.map(agent => (
             <div key={agent.id} className="flex flex-col sm:flex-row sm:items-center gap-4 p-3 bg-aqip-bg-elevated rounded-lg border border-aqip-border hover:border-aqip-primary/30 transition-colors">
              <div className="h-10 w-10 rounded-full bg-aqip-bg-surface flex items-center justify-center text-aqip-text-muted font-bold text-sm shrink-0 border border-aqip-border">
                {agent.prenom[0]}{agent.nom[0]}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-aqip-text-primary truncate">{agent.prenom} {agent.nom}</p>
                <p className="text-xs text-aqip-text-muted">{agent.poste}</p>
              </div>
              
              <div className="flex-1 min-w-[200px]">
                  <div className="flex justify-between text-xs mb-1">
                  <span className="text-aqip-text-muted">Compétences à jour</span>
                  <span className="text-aqip-accent font-bold">OK</span>
                </div>
                <AQIPProgress value={5} max={5} showValue={false} size="sm" color="accent" />
              </div>
              
              <div className="flex items-center gap-4 sm:ml-4 border-t sm:border-t-0 sm:border-l border-aqip-border pt-3 sm:pt-0 sm:pl-4">
                 <div className="text-center px-2">
                    <div className="text-sm font-bold text-white">0</div>
                    <div className="text-[10px] text-aqip-text-muted uppercase">Erreurs</div>
                 </div>
                 <Link to={`/agent/${agent.id}/dossier`} className="ml-auto sm:ml-0 h-8 w-8 bg-aqip-primary/10 rounded flex items-center justify-center text-aqip-primary hover:bg-aqip-primary hover:text-white transition-colors">
                    <ArrowRight className="h-4 w-4" />
                 </Link>
              </div>
            </div>
          ))}
        </div>
      </AQIPCard>
    </div>
  );
}
