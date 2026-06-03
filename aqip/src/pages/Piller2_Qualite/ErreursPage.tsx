import AQIPCard from '../../components/ui/AQIPCard';
import AQIPTable from '../../components/ui/AQIPTable';
import { AlertTriangle, Plus } from 'lucide-react';
import AQIPButton from '../../components/ui/AQIPButton';
import { errorTaxonomy } from '../../data/errorsLibrary';

export default function ErreursPage() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-aqip-text-primary tracking-tight">Taxonomie des Erreurs</h1>
          <p className="text-sm text-aqip-text-muted mt-1">Bibliothèque nationale des incidents opérationnels.</p>
        </div>
        <AQIPButton leftIcon={<Plus className="h-4 w-4" />}>
          Nouvelle Typologie
        </AQIPButton>
      </div>

      <AQIPCard noPadding>
        <div className="p-4 border-b border-aqip-border flex justify-between items-center bg-aqip-bg-surface shrink-0">
          <h2 className="text-lg font-semibold text-aqip-text-primary flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-aqip-danger" />
            Catalogue des Erreurs ({errorTaxonomy.length})
          </h2>
        </div>
        <AQIPTable
          data={errorTaxonomy}
          keyExtractor={(row) => row.id}
          columns={[
            { 
              header: 'Code', 
              accessor: (row) => <span className="font-mono text-xs font-semibold">{row.id}</span>,
              sortable: true
            },
            { header: 'Famille', accessor: 'famille', sortable: true },
            { header: 'Erreur', accessor: 'erreur' },
            { 
              header: 'Gravité', 
              accessor: (row) => (
                <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${
                  row.graviteParDefaut === 'Critique' || row.graviteParDefaut === 'Haute' ? 'bg-aqip-danger/10 text-aqip-danger ring-aqip-danger/20' : 'bg-aqip-warning/10 text-aqip-warning ring-aqip-warning/20'
                }`}>
                  {row.graviteParDefaut}
                </span>
              ),
              sortable: true
            },
            { header: 'Coût Est.', accessor: (row) => `${row.coutEstimeFcfa} FCFA` },
          ]}
        />
      </AQIPCard>
    </div>
  );
}
