import AQIPCard from '../../components/ui/AQIPCard';
import AQIPTable from '../../components/ui/AQIPTable';
import AQIPButton from '../../components/ui/AQIPButton';
import { Target, Plus } from 'lucide-react';

const COMPETENCES = [
  { id: 'C01', categorie: 'Technique', nom: 'Capture Biométrique', piller: 'Enrôlement', statut: 'Actif' },
  { id: 'C02', categorie: 'Transverse', nom: 'Orthographe & Grammaire (FR)', piller: 'Saisie', statut: 'Critique' },
  { id: 'C03', categorie: 'Comportemental', nom: 'Accueil Usager', piller: 'Service Client', statut: 'Actif' },
  { id: 'C04', categorie: 'Management', nom: 'Gestion des conflits', piller: 'Supervision', statut: 'Actif' },
];

export default function CompetencesPage() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-aqip-text-primary tracking-tight">Référentiel des Compétences</h1>
          <p className="text-sm text-aqip-text-muted mt-1">Dictionnaire des compétences requises pour l'ANIP.</p>
        </div>
        <AQIPButton leftIcon={<Plus className="h-4 w-4" />}>
          Ajouter une compétence
        </AQIPButton>
      </div>

      <AQIPCard noPadding>
        <div className="p-4 border-b border-aqip-border flex justify-between items-center bg-aqip-bg-surface shrink-0">
          <h2 className="text-lg font-semibold text-aqip-text-primary flex items-center gap-2">
            <Target className="h-5 w-5 text-aqip-accent" />
            Dictionnaire Actif
          </h2>
        </div>
        <AQIPTable
          data={COMPETENCES}
          keyExtractor={(row) => row.id}
          columns={[
            { header: 'ID', accessor: 'id' },
            { header: 'Compétence', accessor: 'nom', sortable: true },
            { header: 'Catégorie', accessor: 'categorie', sortable: true },
            { header: 'Pilier', accessor: 'piller' },
            { 
              header: 'Statut', 
              accessor: (row) => (
                <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${
                  row.statut === 'Critique' ? 'bg-aqip-danger/10 text-aqip-danger ring-aqip-danger/20' : 'bg-aqip-accent/10 text-aqip-accent ring-aqip-accent/20'
                }`}>
                  {row.statut}
                </span>
              )
            },
          ]}
        />
      </AQIPCard>
    </div>
  );
}
