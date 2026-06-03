import AQIPCard from '../../components/ui/AQIPCard';
import AQIPTable from '../../components/ui/AQIPTable';
import AQIPBadge from '../../components/ui/AQIPBadge';
import { ShieldCheck, History, Search } from 'lucide-react';

const AUDIT_LOGS = [
  { id: 'LOG-001', date: '03/06/2026 14:32', acteur: 'DRH Admin', action: 'Modification Matrice 9-Box', cible: 'Agent Koffi A.', statut: 'Succès', ip: '192.168.1.42' },
  { id: 'LOG-002', date: '03/06/2026 12:15', acteur: 'Chef de Centre (Parakou)', action: 'Validation Incident', cible: 'INC-2026-0042', statut: 'Succès', ip: '10.0.4.12' },
  { id: 'LOG-003', date: '03/06/2026 09:05', acteur: 'Système', action: 'Génération KPI Mensuels', cible: 'Dashboard National', statut: 'Succès', ip: 'localhost' },
  { id: 'LOG-004', date: '02/06/2026 16:45', acteur: 'Agent Zinsu P.', action: 'Accès Non Autorisé (Refusé)', cible: 'Module Finance', statut: 'Échec', ip: '192.168.2.105' },
  { id: 'LOG-005', date: '02/06/2026 14:20', acteur: 'Resp. Qualité', action: 'Mise à jour Taxonomie', cible: 'Erreur FR-04', statut: 'Succès', ip: '192.168.1.45' },
];

export default function AuditPage() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-aqip-text-primary tracking-tight">Audit & Conformité</h1>
          <p className="text-sm text-aqip-text-muted mt-1">Traçabilité immuable de toutes les actions sur la plateforme.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <AQIPCard className="bg-aqip-bg-surface border-aqip-primary/30">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-lg bg-aqip-primary/20 flex items-center justify-center">
              <ShieldCheck className="h-6 w-6 text-aqip-primary" />
            </div>
            <div>
              <div className="text-sm font-medium text-aqip-text-muted">Niveau de Conformité</div>
              <div className="text-2xl font-bold text-white">99.8%</div>
            </div>
          </div>
        </AQIPCard>
        <AQIPCard className="md:col-span-2 flex items-center justify-between">
          <div className="flex gap-8">
            <div>
              <div className="text-sm text-aqip-text-muted">Événements (24h)</div>
              <div className="text-xl font-bold text-white">1,452</div>
            </div>
            <div>
              <div className="text-sm text-aqip-text-muted">Tentatives Bloquées</div>
              <div className="text-xl font-bold text-aqip-warning">14</div>
            </div>
            <div>
              <div className="text-sm text-aqip-text-muted">Dernier Export</div>
              <div className="text-xl font-bold text-white">Ce matin, 06:00</div>
            </div>
          </div>
          <button className="px-4 py-2 bg-aqip-bg-elevated border border-aqip-border rounded-md text-sm font-medium hover:bg-aqip-border transition-colors">
            Exporter Rapport PDF
          </button>
        </AQIPCard>
      </div>

      <AQIPCard noPadding>
        <div className="p-4 border-b border-aqip-border flex justify-between items-center bg-aqip-bg-surface shrink-0">
          <h2 className="text-lg font-semibold text-aqip-text-primary flex items-center gap-2">
            <History className="h-5 w-5 text-aqip-primary" />
            Journal des Événements
          </h2>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-aqip-text-muted" />
            <input 
              type="text" 
              placeholder="Rechercher (ID, Acteur...)" 
              className="w-full pl-9 pr-4 py-1.5 bg-aqip-bg-elevated border-none rounded-md text-sm text-aqip-text-primary focus:ring-1 focus:ring-aqip-primary outline-none"
            />
          </div>
        </div>
        <AQIPTable
          data={AUDIT_LOGS}
          keyExtractor={(row) => row.id}
          columns={[
            { header: 'Date & Heure', accessor: 'date' },
            { header: 'Acteur', accessor: 'acteur' },
            { header: 'Action', accessor: 'action' },
            { header: 'Cible', accessor: 'cible' },
            { header: 'Adresse IP', accessor: 'ip', sortable: false },
            { 
              header: 'Statut', 
              accessor: (row) => (
                <AQIPBadge variant={row.statut === 'Succès' ? 'success' : 'danger'}>
                  {row.statut}
                </AQIPBadge>
              ) 
            },
          ]}
        />
      </AQIPCard>
    </div>
  );
}
