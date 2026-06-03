import { useNavigate } from 'react-router-dom';
import AQIPCard from '../../components/ui/AQIPCard';
import AQIPBadge from '../../components/ui/AQIPBadge';
import { Star, TrendingUp, Users, MessageSquareWarning, MapPin } from 'lucide-react';

export default function SatisfactionPage() {
  const navigate = useNavigate();

  // Données mockées pour la démo
  const stats = {
    nps: 42,
    satisfactionGlobale: 4.2,
    totalRetours: 1452,
    reclamationsOuvertes: 18,
  };

  const feedbacks = [
    { id: 'sat-001', citoyen: 'Mme DOSSOU', service: 'Demande NPI', centre: 'Cotonou Centre', note: 4, tempsAttente: 45, commentaire: "Processus fluide mais attente un peu longue.", date: "10/04/2026" },
    { id: 'sat-002', citoyen: 'M. BIO', service: 'Renouvellement CNI', centre: 'Natitingou Centre', note: 2, tempsAttente: 120, commentaire: "Système biométrique en panne, j'ai dû revenir.", date: "12/04/2026" },
    { id: 'sat-003', citoyen: 'Mme ADE', service: 'Acte de Naissance', centre: 'Porto-Novo Centre', note: 5, tempsAttente: 10, commentaire: "Agent très souriant, dossier traité rapidement.", date: "12/04/2026" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Expérience Citoyenne (NPS)</h1>
        <p className="text-sm text-aqip-text-muted mt-1">Supervision de la satisfaction des usagers et de la qualité du service rendu.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <AQIPCard className="flex flex-col gap-2">
          <div className="text-sm font-medium text-aqip-text-muted flex items-center justify-between">
            Net Promoter Score
            <TrendingUp className="h-4 w-4 text-aqip-accent" />
          </div>
          <div className="text-3xl font-bold text-white">+{stats.nps}</div>
          <div className="text-xs text-aqip-accent">+5 pts depuis le mois dernier</div>
        </AQIPCard>
        
        <AQIPCard className="flex flex-col gap-2">
          <div className="text-sm font-medium text-aqip-text-muted flex items-center justify-between">
            Satisfaction Globale
            <Star className="h-4 w-4 text-aqip-gold" />
          </div>
          <div className="text-3xl font-bold text-white">{stats.satisfactionGlobale} <span className="text-lg text-aqip-text-muted">/ 5</span></div>
          <div className="text-xs text-aqip-text-muted">Basé sur 1,452 avis</div>
        </AQIPCard>

        <AQIPCard className="flex flex-col gap-2">
          <div className="text-sm font-medium text-aqip-text-muted flex items-center justify-between">
            Réclamations Ouvertes
            <MessageSquareWarning className="h-4 w-4 text-aqip-danger" />
          </div>
          <div className="text-3xl font-bold text-white">{stats.reclamationsOuvertes}</div>
          <div className="text-xs text-aqip-danger">3 urgentes nécessitant action</div>
        </AQIPCard>

        <AQIPCard className="flex flex-col gap-2 cursor-pointer border-aqip-primary hover:bg-aqip-bg-elevated transition-colors" onClick={() => navigate('/citoyen/journey')}>
          <div className="text-sm font-medium text-aqip-text-muted flex items-center justify-between">
            Parcours Citoyen (Focus)
            <Users className="h-4 w-4 text-aqip-primary" />
          </div>
          <div className="text-lg font-bold text-white mt-1">Analyser le cycle de vie</div>
          <div className="text-xs text-aqip-primary mt-1 flex items-center gap-1">
            Découvrir l'histoire de Mme Dossou
          </div>
        </AQIPCard>
      </div>

      <AQIPCard noPadding>
        <div className="border-b border-aqip-border px-6 py-4 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-white">Derniers Retours Citoyens</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs uppercase text-aqip-text-muted bg-aqip-bg-elevated/50">
              <tr>
                <th className="px-6 py-3 font-medium">Citoyen</th>
                <th className="px-6 py-3 font-medium">Service</th>
                <th className="px-6 py-3 font-medium">Centre</th>
                <th className="px-6 py-3 font-medium">Note</th>
                <th className="px-6 py-3 font-medium">Commentaire</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-aqip-border">
              {feedbacks.map((fb) => (
                <tr key={fb.id} className="hover:bg-aqip-bg-elevated/30 transition-colors">
                  <td className="px-6 py-4 font-medium text-white">{fb.citoyen}</td>
                  <td className="px-6 py-4 text-aqip-text-muted">{fb.service}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1 text-aqip-text-muted">
                      <MapPin className="h-3 w-3" />
                      {fb.centre}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <AQIPBadge variant={fb.note >= 4 ? 'success' : fb.note >= 3 ? 'warning' : 'danger'}>
                      {fb.note} / 5
                    </AQIPBadge>
                  </td>
                  <td className="px-6 py-4 text-aqip-text-muted max-w-xs truncate" title={fb.commentaire}>
                    "{fb.commentaire}"
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </AQIPCard>
    </div>
  );
}
