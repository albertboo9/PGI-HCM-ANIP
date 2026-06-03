import { useEffect } from 'react';
import AQIPCard from '../../components/ui/AQIPCard';
import AQIPTable from '../../components/ui/AQIPTable';
import AQIPAvatar from '../../components/ui/AQIPAvatar';
import AQIPButton from '../../components/ui/AQIPButton';
import { useAgentStore } from '../../store/agentStore';
import { Search, Filter } from 'lucide-react';

export default function ProfilsPage() {
  const { agents, fetchAgents, isLoading } = useAgentStore();

  useEffect(() => {
    fetchAgents();
  }, [fetchAgents]);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-aqip-text-primary tracking-tight">Profils & Agents</h1>
          <p className="text-sm text-aqip-text-muted mt-1">Annuaire complet du personnel et fiches de compétences.</p>
        </div>
      </div>

      <AQIPCard noPadding>
        <div className="p-4 border-b border-aqip-border flex flex-col sm:flex-row justify-between items-center bg-aqip-bg-surface shrink-0 gap-4">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-aqip-text-muted" />
            <input 
              type="text" 
              placeholder="Rechercher un agent (Nom, Matricule...)" 
              className="w-full pl-9 pr-4 py-2 bg-aqip-bg-elevated border-none rounded-md text-sm text-aqip-text-primary focus:ring-1 focus:ring-aqip-primary outline-none"
            />
          </div>
          <AQIPButton variant="secondary" leftIcon={<Filter className="h-4 w-4" />}>
            Filtres
          </AQIPButton>
        </div>

        <AQIPTable
          data={agents}
          keyExtractor={(row) => row.id}
          onRowClick={(row) => console.log('View Agent', row.id)}
          emptyMessage={isLoading ? "Chargement des agents..." : "Aucun agent trouvé."}
          columns={[
            { 
              header: 'Agent', 
              accessor: (row) => (
                <div className="flex items-center gap-3">
                  <AQIPAvatar initials={row.nom.charAt(0) + row.prenom.charAt(0)} size="sm" />
                  <div>
                    <div className="font-medium">{row.nom} {row.prenom}</div>
                    <div className="text-xs text-aqip-text-muted">{row.matricule}</div>
                  </div>
                </div>
              ),
              sortable: true 
            },
            { header: 'Poste', accessor: 'poste', sortable: true },
            { 
              header: 'Statut', 
              accessor: (row) => (
                <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${
                  row.statut === 'actif' ? 'bg-aqip-accent/10 text-aqip-accent ring-aqip-accent/20' : 'bg-aqip-warning/10 text-aqip-warning ring-aqip-warning/20'
                }`}>
                  {row.statut}
                </span>
              )
            },
            { 
              header: 'Score Global', 
              accessor: (row) => (
                <div className="flex items-center gap-2">
                  <div className="w-full bg-aqip-bg-elevated rounded-full h-1.5 w-24">
                    <div className="bg-aqip-primary h-1.5 rounded-full" style={{ width: `${row.scores?.composite || 0}%` }}></div>
                  </div>
                  <span className="text-xs font-semibold">{row.scores?.composite || 0}</span>
                </div>
              ),
              sortable: true
            },
          ]}
        />
      </AQIPCard>
    </div>
  );
}
