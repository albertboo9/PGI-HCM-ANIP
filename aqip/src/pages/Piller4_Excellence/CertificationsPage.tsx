import AQIPCard from '../../components/ui/AQIPCard';
import AQIPButton from '../../components/ui/AQIPButton';
import AQIPProgress from '../../components/ui/AQIPProgress';
import { Award, CheckCircle, XCircle } from 'lucide-react';

const CERTIFICATIONS = [
  { id: 'CERT-01', nom: 'Habilitation Biométrique Niveau 1', valide: 450, expire: 25, type: 'Obligatoire' },
  { id: 'CERT-02', nom: 'Conformité RGPD / Protection des Données', valide: 380, expire: 95, type: 'Obligatoire' },
  { id: 'CERT-03', nom: 'Maîtrise Orthographique Avancée (ANIP)', valide: 120, expire: 5, type: 'Spécialisation' },
];

const AGENTS_STATUS = [
  { nom: 'Koffi Abena', centre: 'Cotonou', certs: 3, statut: 'À jour' },
  { nom: 'Zinsu Paul', centre: 'Parakou', certs: 1, statut: 'Expiré' },
  { nom: 'Mensah Kofi', centre: 'Porto-Novo', certs: 2, statut: 'En cours' },
];

export default function CertificationsPage() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-aqip-text-primary tracking-tight">Certifications Officielles</h1>
          <p className="text-sm text-aqip-text-muted mt-1">Suivi des habilitations réglementaires et certificats ANIP.</p>
        </div>
        <AQIPButton leftIcon={<Award className="h-4 w-4" />}>Créer Certification</AQIPButton>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          {CERTIFICATIONS.map((cert) => {
            const total = cert.valide + cert.expire;
            const pct = Math.round((cert.valide / total) * 100);
            return (
              <AQIPCard key={cert.id}>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-semibold text-white">{cert.nom}</h3>
                    <span className="text-xs text-aqip-text-muted">{cert.type}</span>
                  </div>
                  <span className="text-lg font-bold text-aqip-primary">{pct}%</span>
                </div>
                <AQIPProgress value={pct} color={pct < 80 ? 'warning' : 'success'} showValue={false} />
                <div className="mt-4 flex gap-6 text-sm">
                  <div className="flex items-center gap-1 text-aqip-text-muted">
                    <CheckCircle className="h-4 w-4 text-aqip-success" /> {cert.valide} valides
                  </div>
                  <div className="flex items-center gap-1 text-aqip-text-muted">
                    <XCircle className="h-4 w-4 text-aqip-warning" /> {cert.expire} expirées/en retard
                  </div>
                </div>
              </AQIPCard>
            );
          })}
        </div>

        <AQIPCard>
          <h2 className="text-lg font-semibold text-white mb-4">Statut par Agent (Aperçu)</h2>
          <div className="space-y-3">
            {AGENTS_STATUS.map((agent) => (
              <div key={agent.nom} className="flex justify-between items-center p-3 bg-aqip-bg-elevated rounded-lg border border-aqip-border">
                <div>
                  <div className="font-medium text-white">{agent.nom}</div>
                  <div className="text-xs text-aqip-text-muted">{agent.centre}</div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-sm font-semibold text-aqip-text-muted">{agent.certs} certif.</div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-md ${
                    agent.statut === 'À jour' ? 'bg-aqip-success/10 text-aqip-success' :
                    agent.statut === 'Expiré' ? 'bg-aqip-danger/10 text-aqip-danger' :
                    'bg-aqip-warning/10 text-aqip-warning'
                  }`}>
                    {agent.statut}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-4 py-2 text-sm text-aqip-primary hover:bg-aqip-bg-elevated rounded-md transition-colors">
            Voir tous les agents →
          </button>
        </AQIPCard>
      </div>
    </div>
  );
}
