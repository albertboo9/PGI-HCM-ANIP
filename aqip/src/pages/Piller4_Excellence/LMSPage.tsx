import { Link } from 'react-router-dom';
import AQIPCard from '../../components/ui/AQIPCard';
import AQIPTable from '../../components/ui/AQIPTable';
import AQIPButton from '../../components/ui/AQIPButton';
import AQIPProgress from '../../components/ui/AQIPProgress';
import { PlayCircle, Plus, BookOpen } from 'lucide-react';

const FORMATIONS = [
  { id: 'F01', nom: 'Orthographe & Etat Civil', pilier: 'Qualité', participants: 45, completion: 80 },
  { id: 'F02', nom: 'Accueil PMR', pilier: 'Citoyen', participants: 120, completion: 45 },
  { id: 'F03', nom: 'Nouveaux Kits Biométriques', pilier: 'Opération', participants: 350, completion: 15 },
];

export default function LMSPage() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-aqip-text-primary tracking-tight">Centre de Formation (LMS)</h1>
          <p className="text-sm text-aqip-text-muted mt-1">Gestion des parcours de développement des compétences.</p>
        </div>
        <div className="flex gap-2">
          <Link to="/excellence/catalogue">
            <AQIPButton leftIcon={<BookOpen className="h-4 w-4" />}>
              Ouvrir le Catalogue
            </AQIPButton>
          </Link>
          <AQIPButton leftIcon={<Plus className="h-4 w-4" />}>
            Nouveau Parcours
          </AQIPButton>
        </div>
      </div>

      <AQIPCard noPadding>
        <div className="p-4 border-b border-aqip-border flex justify-between items-center bg-aqip-bg-surface shrink-0">
          <h2 className="text-lg font-semibold text-aqip-text-primary flex items-center gap-2">
            <PlayCircle className="h-5 w-5 text-aqip-primary" />
            Parcours Actifs
          </h2>
        </div>
        <AQIPTable
          data={FORMATIONS}
          keyExtractor={(row) => row.id}
          columns={[
            { header: 'Formation', accessor: 'nom', sortable: true },
            { header: 'Pilier', accessor: 'pilier' },
            { header: 'Inscrits', accessor: (row) => `${row.participants} agents`, sortable: true },
            { 
              header: 'Progression Moyenne', 
              accessor: (row) => (
                <div className="w-32">
                  <AQIPProgress value={row.completion} />
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
