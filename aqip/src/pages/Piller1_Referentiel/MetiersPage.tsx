import AQIPCard from '../../components/ui/AQIPCard';
import AQIPTable from '../../components/ui/AQIPTable';
import AQIPButton from '../../components/ui/AQIPButton';
import { Briefcase, Plus } from 'lucide-react';

const METIERS = [
  { id: '1', nom: "Agent d'Enrôlement", piliers: 'Accueil, Biométrie', effectif: 850, niveauRequis: 'Bac+2' },
  { id: '2', nom: "Superviseur Centre", piliers: 'Management, Qualité', effectif: 120, niveauRequis: 'Bac+3' },
  { id: '3', nom: "Opérateur Saisie", piliers: 'État Civil, Langue', effectif: 340, niveauRequis: 'Bac' },
  { id: '4', nom: "Auditeur Qualité", piliers: 'Conformité, Audit', effectif: 25, niveauRequis: 'Bac+5' },
];

export default function MetiersPage() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-aqip-text-primary tracking-tight">Référentiel des Métiers</h1>
          <p className="text-sm text-aqip-text-muted mt-1">Catalogue officiel des fonctions de l'ANIP.</p>
        </div>
        <AQIPButton leftIcon={<Plus className="h-4 w-4" />}>
          Nouveau Métier
        </AQIPButton>
      </div>

      <AQIPCard noPadding>
        <div className="p-4 border-b border-aqip-border flex justify-between items-center bg-aqip-bg-surface shrink-0">
          <h2 className="text-lg font-semibold text-aqip-text-primary flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-aqip-primary" />
            Liste des Fonctions
          </h2>
        </div>
        <AQIPTable
          data={METIERS}
          keyExtractor={(row) => row.id}
          columns={[
            { header: 'Métier', accessor: 'nom', sortable: true },
            { header: 'Piliers de Compétence', accessor: 'piliers' },
            { header: 'Niveau Requis', accessor: 'niveauRequis' },
            { 
              header: 'Effectif Actuel', 
              accessor: (row) => (
                <span className="inline-flex items-center rounded-md bg-aqip-bg-elevated px-2 py-1 text-xs font-medium text-aqip-text-primary ring-1 ring-inset ring-aqip-border">
                  {row.effectif} agents
                </span>
              ),
              sortable: true
            },
          ]}
        />
      </AQIPCard>
    </div>
  );
}
