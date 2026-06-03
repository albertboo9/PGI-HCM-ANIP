import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useIncidentStore } from '../../store/incidentStore';
import AQIPCard from '../../components/ui/AQIPCard';
import AQIPBadge from '../../components/ui/AQIPBadge';
import { AlertTriangle, TrendingDown, DollarSign } from 'lucide-react';

export default function IncidentsPage() {
  const navigate = useNavigate();
  const { incidents, isLoading, fetchIncidents, getTotalNonQualityCost } = useIncidentStore();

  useEffect(() => {
    fetchIncidents();
  }, [fetchIncidents]);

  if (isLoading) return <div className="p-8 text-center text-aqip-text-muted">Chargement du journal opérationnel...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Journal Opérationnel Terrain</h1>
        <p className="text-sm text-aqip-text-muted mt-1">Supervision en temps réel des erreurs et incidents de service public.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <AQIPCard className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-lg bg-aqip-danger/20 flex items-center justify-center">
            <AlertTriangle className="h-6 w-6 text-aqip-danger" />
          </div>
          <div>
            <div className="text-sm font-medium text-aqip-text-muted">Incidents Actifs</div>
            <div className="text-2xl font-bold text-white">{incidents.filter(i => i.statut !== 'resolu').length}</div>
          </div>
        </AQIPCard>
        
        <AQIPCard className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-lg bg-aqip-warning/20 flex items-center justify-center">
            <DollarSign className="h-6 w-6 text-aqip-warning" />
          </div>
          <div>
            <div className="text-sm font-medium text-aqip-text-muted">Coût de la Non-Qualité (30j)</div>
            <div className="text-2xl font-bold text-white">{getTotalNonQualityCost().toLocaleString()} FCFA</div>
          </div>
        </AQIPCard>

        <AQIPCard className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-lg bg-aqip-accent/20 flex items-center justify-center">
            <TrendingDown className="h-6 w-6 text-aqip-accent" />
          </div>
          <div>
            <div className="text-sm font-medium text-aqip-text-muted">Tendance Résolution</div>
            <div className="text-2xl font-bold text-white">+14%</div>
          </div>
        </AQIPCard>
      </div>

      <AQIPCard noPadding>
        <div className="border-b border-aqip-border px-6 py-4">
          <h2 className="text-lg font-semibold text-white">Derniers Incidents (Temps Réel)</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs uppercase text-aqip-text-muted bg-aqip-bg-elevated/50">
              <tr>
                <th className="px-6 py-3 font-medium">Référence</th>
                <th className="px-6 py-3 font-medium">Catégorie & Erreur</th>
                <th className="px-6 py-3 font-medium">Agent</th>
                <th className="px-6 py-3 font-medium">Gravité</th>
                <th className="px-6 py-3 font-medium">Impact Financier</th>
                <th className="px-6 py-3 font-medium">Statut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-aqip-border">
              {incidents.map((incident) => (
                <tr 
                  key={incident.id} 
                  onClick={() => navigate(`/incidents/${incident.id}`)}
                  className="hover:bg-aqip-bg-elevated/30 transition-colors cursor-pointer"
                >
                  <td className="px-6 py-4 font-medium text-white">{incident.dossierRef || 'N/A'}</td>
                  <td className="px-6 py-4">
                    <div className="text-white">{incident.erreurLibelle}</div>
                    <div className="text-xs text-aqip-text-muted">{incident.categorie}</div>
                  </td>
                  <td className="px-6 py-4 text-aqip-text-muted">{incident.agentId}</td>
                  <td className="px-6 py-4">
                    <AQIPBadge variant={incident.gravite === 'Critique' ? 'danger' : incident.gravite === 'Haute' ? 'warning' : 'info'}>
                      {incident.gravite}
                    </AQIPBadge>
                  </td>
                  <td className="px-6 py-4 text-aqip-danger font-medium">
                    -{incident.coutEstime?.toLocaleString() || 0} FCFA
                  </td>
                  <td className="px-6 py-4">
                    <AQIPBadge variant={incident.statut === 'resolu' ? 'success' : incident.statut === 'analyse' ? 'warning' : 'default'}>
                      {incident.statut.toUpperCase()}
                    </AQIPBadge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </AQIPCard>
    </div>
  );
}
