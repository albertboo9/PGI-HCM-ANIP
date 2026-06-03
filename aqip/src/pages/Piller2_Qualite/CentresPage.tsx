import { useEffect } from 'react';
import AQIPCard from '../../components/ui/AQIPCard';
import AQIPTable from '../../components/ui/AQIPTable';
import { useCentreStore } from '../../store/centreStore';
import { MapPin, Search } from 'lucide-react';
import AQIPButton from '../../components/ui/AQIPButton';

export default function CentresPage() {
  const { centres, fetchCentres, isLoading } = useCentreStore();

  useEffect(() => {
    fetchCentres();
  }, [fetchCentres]);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-aqip-text-primary tracking-tight">Centres & Antennes</h1>
          <p className="text-sm text-aqip-text-muted mt-1">Supervision des sites de production de l'ANIP.</p>
        </div>
      </div>

      <AQIPCard noPadding>
        <div className="p-4 border-b border-aqip-border flex justify-between items-center bg-aqip-bg-surface shrink-0">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-aqip-text-muted" />
            <input 
              type="text" 
              placeholder="Rechercher un centre..." 
              className="w-full pl-9 pr-4 py-2 bg-aqip-bg-elevated border-none rounded-md text-sm text-aqip-text-primary focus:ring-1 focus:ring-aqip-primary outline-none"
            />
          </div>
        </div>
        
        <AQIPTable
          data={centres}
          keyExtractor={(row) => row.id}
          emptyMessage={isLoading ? "Chargement..." : "Aucun centre trouvé."}
          columns={[
            { 
              header: 'Centre', 
              accessor: (row) => (
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-aqip-text-muted" />
                  <span className="font-semibold">{row.nom}</span>
                </div>
              ),
              sortable: true
            },
            { header: 'Effectif', accessor: (row) => `${row.agentsCount} agents`, sortable: true },
            { 
              header: 'Maturité', 
              accessor: (row) => (
                <span className="inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset bg-aqip-primary/10 text-aqip-primary ring-aqip-primary/20">
                  {row.maturite}
                </span>
              ),
              sortable: true
            },
            { 
              header: 'Statut', 
              accessor: (row) => (
                <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${
                  row.statut === 'alerte' ? 'bg-aqip-danger/10 text-aqip-danger ring-aqip-danger/20' : 'bg-aqip-accent/10 text-aqip-accent ring-aqip-accent/20'
                }`}>
                  {row.statut === 'alerte' ? 'En Alerte' : 'Actif'}
                </span>
              ),
              sortable: true
            },
            {
              header: 'Action',
              accessor: () => (
                <AQIPButton variant="ghost" size="sm">Détails</AQIPButton>
              )
            }
          ]}
        />
      </AQIPCard>
    </div>
  );
}
