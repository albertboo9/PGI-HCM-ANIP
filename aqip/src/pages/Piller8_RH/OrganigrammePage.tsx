import AQIPCard from '../../components/ui/AQIPCard';
import { Users, Briefcase, ChevronRight, User } from 'lucide-react';

const ORGANIGRAMME_DATA = [
  {
    role: 'Direction Générale (DG)',
    occupant: 'Dr. Zinsou',
    count: 3,
    children: [
      {
        role: 'Direction des Ressources Humaines (DRH)',
        occupant: 'Mme. Abena',
        count: 12,
        children: [
          { role: 'Département Formation & Compétences', count: 5 },
          { role: 'Département Paie & Admin', count: 7 },
        ]
      },
      {
        role: 'Direction Qualité & Conformité',
        occupant: 'M. Dossou',
        count: 8,
        children: [
          { role: 'Observatoire Qualité', count: 4 },
          { role: 'Auditeurs Internes', count: 4 },
        ]
      },
      {
        role: 'Direction des Opérations (Centres)',
        occupant: 'Mme. Koffi',
        count: 1240,
        children: [
          { role: 'Centres Littoral & Atlantique', count: 450 },
          { role: 'Centres Borgou & Alibori', count: 320 },
          { role: 'Autres Centres', count: 470 },
        ]
      }
    ]
  }
];

function OrgNode({ data, depth = 0 }: { data: any, depth?: number }) {
  return (
    <div className={`mt-2 ${depth > 0 ? 'ml-6 sm:ml-12 border-l border-aqip-border pl-4 sm:pl-8 relative' : ''}`}>
      {depth > 0 && <div className="absolute top-6 -left-0 w-4 sm:w-8 h-px bg-aqip-border" />}
      <div className="p-4 bg-aqip-bg-elevated rounded-lg border border-aqip-border hover:border-aqip-primary/30 transition-colors inline-flex flex-col min-w-[250px]">
        <div className="flex justify-between items-start gap-4">
          <h3 className="font-semibold text-white flex items-center gap-2">
            {depth === 0 ? <Briefcase className="h-4 w-4 text-aqip-primary" /> : <ChevronRight className="h-4 w-4 text-aqip-text-muted" />}
            {data.role}
          </h3>
          <span className="text-xs font-bold text-aqip-text-muted bg-aqip-bg-surface px-2 py-1 rounded-md flex items-center gap-1">
            <Users className="h-3 w-3" /> {data.count}
          </span>
        </div>
        {data.occupant && (
          <div className="mt-3 flex items-center gap-2 text-sm text-aqip-text-secondary">
            <div className="h-6 w-6 bg-aqip-bg-surface rounded-full flex items-center justify-center">
              <User className="h-3 w-3 text-aqip-primary" />
            </div>
            {data.occupant}
          </div>
        )}
      </div>
      {data.children && data.children.map((child: any, idx: number) => (
        <OrgNode key={idx} data={child} depth={depth + 1} />
      ))}
    </div>
  );
}

export default function OrganigrammePage() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-aqip-text-primary tracking-tight">Organigramme Stratégique</h1>
          <p className="text-sm text-aqip-text-muted mt-1">Structure hiérarchique et répartition des effectifs de l'ANIP.</p>
        </div>
      </div>

      <AQIPCard className="overflow-x-auto custom-scrollbar pb-8">
        <div className="min-w-[800px] py-4">
          {ORGANIGRAMME_DATA.map((node, idx) => (
            <OrgNode key={idx} data={node} />
          ))}
        </div>
      </AQIPCard>
    </div>
  );
}
