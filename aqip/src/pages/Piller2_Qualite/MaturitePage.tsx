import AQIPCard from '../../components/ui/AQIPCard';
import AQIPBadge from '../../components/ui/AQIPBadge';
import { ArrowRight, TrendingUp, AlertTriangle } from 'lucide-react';

export default function MaturitePage() {
  const maturiteNiveaux = [
    { niveau: 1, nom: "Réactif", desc: "Gestion des incidents au cas par cas, peu de process.", centres: 2, color: "text-aqip-danger", bg: "bg-aqip-danger/10", border: "border-aqip-danger" },
    { niveau: 2, nom: "Contrôlé", desc: "Processus documentés, audits réguliers.", centres: 5, color: "text-aqip-warning", bg: "bg-aqip-warning/10", border: "border-aqip-warning" },
    { niveau: 3, nom: "Standardisé", desc: "Processus uniformes, formation continue systématisée.", centres: 4, color: "text-aqip-primary", bg: "bg-aqip-primary/10", border: "border-aqip-primary" },
    { niveau: 4, nom: "Piloté", desc: "Indicateurs quantitatifs, gestion par la data.", centres: 1, color: "text-aqip-accent", bg: "bg-aqip-accent/10", border: "border-aqip-accent" },
    { niveau: 5, nom: "Excellence", desc: "Amélioration continue proactive, IA et prédiction.", centres: 0, color: "text-aqip-gold", bg: "bg-aqip-gold/10", border: "border-aqip-gold" }
  ];

  const centresDetail = [
    { nom: "Natitingou Centre", iqsp: 45, niveau: 1, label: "Réactif", action: "Plan de redressement urgent" },
    { nom: "Djougou Centre", iqsp: 52, niveau: 1, label: "Réactif", action: "Formation Management Qualité" },
    { nom: "Cotonou Centre", iqsp: 76, niveau: 2, label: "Contrôlé", action: "Standardisation biométrique" },
    { nom: "Porto-Novo Centre", iqsp: 84, niveau: 3, label: "Standardisé", action: "Déploiement tableau bord local" },
    { nom: "Bohicon Centre", iqsp: 91, niveau: 4, label: "Piloté", action: "Candidat Centre d'Excellence" }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Modèle de Maturité Opérationnelle</h1>
        <p className="text-sm text-aqip-text-muted mt-1">Évaluation et trajectoire d'amélioration continue du réseau d'enrôlement national.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {maturiteNiveaux.map((niveau) => (
          <AQIPCard key={niveau.niveau} className={`border-t-4 ${niveau.border} relative overflow-hidden`} noPadding>
            <div className={`p-4 ${niveau.bg}`}>
              <div className={`text-3xl font-black opacity-20 absolute -right-2 -top-4 ${niveau.color}`}>
                N{niveau.niveau}
              </div>
              <h3 className={`text-base font-bold ${niveau.color} mb-1`}>{niveau.nom}</h3>
              <p className="text-xs text-aqip-text-muted mb-4 h-10">{niveau.desc}</p>
              <div className="flex justify-between items-center pt-3 border-t border-aqip-border">
                <span className="text-xs font-semibold text-white">Centres :</span>
                <span className="text-lg font-bold text-white">{niveau.centres}</span>
              </div>
            </div>
          </AQIPCard>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <AQIPCard className="lg:col-span-2" noPadding>
          <div className="p-4 border-b border-aqip-border">
            <h2 className="text-lg font-semibold text-white">Cartographie des Centres</h2>
          </div>
          <table className="w-full text-sm text-left">
            <thead className="text-xs uppercase text-aqip-text-muted bg-aqip-bg-elevated/50">
              <tr>
                <th className="px-6 py-3 font-medium">Centre</th>
                <th className="px-6 py-3 font-medium">Score IQSP</th>
                <th className="px-6 py-3 font-medium">Maturité Actuelle</th>
                <th className="px-6 py-3 font-medium">Action Recommandée (IA)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-aqip-border">
              {centresDetail.map((centre, i) => (
                <tr key={i} className="hover:bg-aqip-bg-elevated/30 transition-colors">
                  <td className="px-6 py-4 font-medium text-white">{centre.nom}</td>
                  <td className="px-6 py-4">
                    <span className={centre.iqsp < 60 ? "text-aqip-danger font-bold" : centre.iqsp < 80 ? "text-aqip-warning font-bold" : "text-aqip-accent font-bold"}>
                      {centre.iqsp} / 100
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <AQIPBadge variant={centre.niveau === 1 ? 'danger' : centre.niveau === 2 ? 'warning' : centre.niveau === 3 ? 'info' : 'success'}>
                      Niveau {centre.niveau} - {centre.label}
                    </AQIPBadge>
                  </td>
                  <td className="px-6 py-4 text-aqip-text-muted">
                    <div className="flex items-center gap-2">
                      <ArrowRight className="h-4 w-4 text-aqip-primary" />
                      {centre.action}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </AQIPCard>

        <div className="space-y-6">
          <AQIPCard>
            <h2 className="text-lg font-semibold text-white flex items-center gap-2 mb-4">
              <TrendingUp className="h-5 w-5 text-aqip-primary" />
              Objectif National 2026
            </h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-aqip-text-muted">Centres N3 et +</span>
                  <span className="text-white font-bold">5 / 12 (41%)</span>
                </div>
                <div className="w-full bg-aqip-bg-elevated rounded-full h-2.5">
                  <div className="bg-aqip-primary h-2.5 rounded-full" style={{ width: '41%' }}></div>
                </div>
              </div>
              <p className="text-sm text-aqip-text-muted">
                L'objectif est d'atteindre 80% des centres au niveau Standardisé (N3) d'ici la fin de l'année.
              </p>
            </div>
          </AQIPCard>

          <AQIPCard className="border-aqip-danger/30 bg-aqip-danger/5">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2 mb-2">
              <AlertTriangle className="h-5 w-5 text-aqip-danger" />
              Risque de Régression
            </h2>
            <p className="text-sm text-aqip-text-muted mb-4">
              Le centre de Parakou présente des signes de dégradation opérationnelle (rotation du personnel). Risque de retour au Niveau 1.
            </p>
            <button className="w-full py-2 bg-aqip-danger/20 text-aqip-danger font-medium rounded hover:bg-aqip-danger/30 transition-colors text-sm">
              Déclencher un Audit Flash
            </button>
          </AQIPCard>
        </div>
      </div>
    </div>
  );
}
