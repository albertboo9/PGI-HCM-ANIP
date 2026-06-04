import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import AQIPCard from '../../components/ui/AQIPCard';
import AQIPStatCard from '../../components/ui/AQIPStatCard';
import AQIPBadge from '../../components/ui/AQIPBadge';
import { TrendingUp, Users, Target, AlertTriangle, ArrowRight, CheckCircle2, ShieldCheck, Briefcase } from 'lucide-react';
import { useAgentStore } from '../../store/agentStore';
import { useIncidentStore } from '../../store/incidentStore';
import { getPriorityAgents } from '../../services/skillEngine';

export default function TalentsPage() {
  const { agents } = useAgentStore();
  const { incidents } = useIncidentStore();

  const teamGaps = useMemo(() => getPriorityAgents(agents, incidents, 20), [agents, incidents]);

  // Mocking PDI states based on agent IDs to show different stages in the pipeline
  const getAgentPipeline = (index: number) => {
    if (index === 0) return { status: 'Terminé', roi: '+95% Qualité', pdi: 'Capture Biométrique', step: 4 };
    if (index === 1) return { status: 'En Formation', roi: 'En cours', pdi: 'Français Administratif', step: 3 };
    if (index === 2) return { status: 'PDI Validé', roi: 'Attente', pdi: 'Relation Citoyen', step: 2 };
    return { status: 'Action Requise', roi: '-', pdi: 'À définir', step: 1 };
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-[1400px] mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-aqip-text-primary tracking-tight">Centre de Développement des Talents</h1>
        <p className="text-sm text-aqip-text-muted mt-1">Supervision globale : De la détection des erreurs opérationnelles à la montée en compétences (HCM).</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <AQIPStatCard title="Agents en Parcours (PDI)" value="14" icon={Users} color="primary" trend={3} trendLabel="vs mois dernier" />
        <AQIPStatCard title="Incidents Corrigés" value="84%" icon={CheckCircle2} color="success" trend={12} trendLabel="post-formation" />
        <AQIPStatCard title="Budget PDI Engagé" value="1.2M FCFA" icon={Target} color="warning" />
        <AQIPStatCard title="ROI Économies (Erreurs évitées)" value="4.5M FCFA" icon={TrendingUp} color="accent" />
      </div>

      <AQIPCard className="overflow-hidden no-padding">
        <div className="p-5 border-b border-aqip-border bg-aqip-bg-surface flex items-center justify-between">
          <h2 className="text-lg font-bold text-aqip-text-primary flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-aqip-primary" />
            Pipeline d'Amélioration Continue
          </h2>
          <AQIPBadge variant="info">Vue consolidée DRH</AQIPBadge>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-aqip-bg-elevated border-b border-aqip-border text-aqip-text-muted text-xs uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4 font-semibold">Agent</th>
                <th className="px-6 py-4 font-semibold">Erreurs Opérationnelles</th>
                <th className="px-6 py-4 font-semibold">Compétence Cible</th>
                <th className="px-6 py-4 font-semibold">Statut PDI</th>
                <th className="px-6 py-4 font-semibold">Impact Métier (ROI)</th>
                <th className="px-6 py-4 text-right font-semibold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-aqip-border bg-white">
              {teamGaps.slice(0, 8).map(({ agent, incidentCount, topGap }, index) => {
                const pipeline = getAgentPipeline(index);
                
                return (
                  <tr key={agent.id} className="hover:bg-aqip-bg-elevated/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-aqip-primary/10 text-aqip-primary flex items-center justify-center font-bold text-xs shrink-0">
                          {agent.prenom[0]}{agent.nom[0]}
                        </div>
                        <div>
                          <p className="font-semibold text-aqip-text-primary">{agent.prenom} {agent.nom}</p>
                          <p className="text-[10px] text-aqip-text-muted uppercase">{agent.poste}</p>
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-aqip-danger" />
                        <span className="font-bold text-aqip-text-primary">{incidentCount}</span>
                        <span className="text-xs text-aqip-text-muted">récurrences</span>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-medium text-aqip-text-primary">{topGap?.competenceLabel || 'N/A'}</span>
                        <div className="flex items-center gap-1 text-xs mt-1">
                          <span className="text-aqip-danger font-bold">Gap -{topGap?.gap}</span>
                          <span className="text-aqip-text-muted">(Niv. requis: {topGap?.niveauRequis})</span>
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1.5 w-40">
                         <div className="flex justify-between items-center text-[10px] uppercase font-bold text-aqip-text-muted">
                           <span>{pipeline.status}</span>
                           <span>{pipeline.step}/4</span>
                         </div>
                         <div className="flex gap-1">
                           {[1, 2, 3, 4].map(s => (
                             <div key={s} className={`h-1.5 flex-1 rounded-full ${s <= pipeline.step ? 'bg-aqip-primary' : 'bg-aqip-border'}`}></div>
                           ))}
                         </div>
                         <span className="text-xs font-medium text-aqip-text-primary truncate">{pipeline.pdi}</span>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      {pipeline.step === 4 ? (
                        <div className="flex items-center gap-1.5 text-aqip-accent font-bold text-sm bg-aqip-accent-light px-2 py-1 rounded-md w-fit">
                          <CheckCircle2 className="h-4 w-4" /> {pipeline.roi}
                        </div>
                      ) : pipeline.step > 1 ? (
                        <div className="flex items-center gap-1.5 text-aqip-warning font-semibold text-sm">
                          <TrendingUp className="h-4 w-4" /> Formation en cours
                        </div>
                      ) : (
                        <span className="text-aqip-text-muted text-sm">—</span>
                      )}
                    </td>

                    <td className="px-6 py-4 text-right">
                       <Link to={`/agent/${agent.id}/dossier`} className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-aqip-primary hover:bg-aqip-primary hover:text-white border border-aqip-primary rounded transition-colors">
                          Dossier 360 <ArrowRight className="h-3 w-3" />
                       </Link>
                    </td>
                  </tr>
                );
              })}
              {teamGaps.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-aqip-text-muted">
                    Aucune donnée d'évaluation disponible.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </AQIPCard>
      
      {/* Explication HCM */}
      <AQIPCard className="bg-gradient-to-br from-aqip-bg-surface to-aqip-primary-light/50 border-aqip-primary/20 shadow-sm">
         <h3 className="font-bold text-aqip-text-primary flex items-center gap-2 mb-2">
            <ShieldCheck className="h-5 w-5 text-aqip-primary" /> Vision Stratégique ANIP
         </h3>
         <p className="text-sm text-aqip-text-secondary leading-relaxed">
           Contrairement à un logiciel de contrôle de saisie, ce module démontre la véritable nature du projet : <strong>le développement du capital humain</strong>.<br/>
           L'ANIP ne se contente pas de bloquer les erreurs, elle identifie les lacunes (Gap de compétence) à travers l'Intelligence Artificielle, propose des Plans de Développement Individuels (PDI), et mesure le retour sur investissement (ROI) après formation via la baisse des incidents.
         </p>
      </AQIPCard>
    </div>
  );
}
