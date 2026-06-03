import AQIPCard from '../../components/ui/AQIPCard';
import AQIPBadge from '../../components/ui/AQIPBadge';
import { Search, BookOpen, Star, Clock, Filter, ArrowRight } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

const CATALOGUE = [
  { id: 'MOD-01', titre: 'Orthographe & Noms Africains', categorie: 'Linguistique', niveau: 'Débutant', duree: '2h', notes: 4.8, img: 'bg-aqip-primary/20' },
  { id: 'MOD-02', titre: 'Capture Biométrique Avancée', categorie: 'Technique', niveau: 'Avancé', duree: '4h', notes: 4.9, img: 'bg-aqip-accent/20' },
  { id: 'MOD-03', titre: 'Accueil & Gestion des Citoyens', categorie: 'Soft Skills', niveau: 'Intermédiaire', duree: '3h', notes: 4.5, img: 'bg-aqip-warning/20' },
  { id: 'MOD-04', titre: 'Cadre Légal de l\'Identité (ANIP)', categorie: 'Juridique', niveau: 'Expert', duree: '6h', notes: 4.7, img: 'bg-aqip-danger/20' },
  { id: 'MOD-05', titre: 'Utilisation du système PGI', categorie: 'Technique', niveau: 'Débutant', duree: '1h 30m', notes: 4.6, img: 'bg-aqip-primary/20' },
  { id: 'MOD-06', titre: 'Gestion du stress en Centre', categorie: 'Soft Skills', niveau: 'Tous', duree: '2h', notes: 4.3, img: 'bg-aqip-warning/20' },
];

export default function CatalogueFormationsPage() {
  const { currentRole } = useAuthStore();
  const isAgent = currentRole === 'agent';

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-aqip-text-primary tracking-tight">Catalogue des Formations</h1>
          <p className="text-sm text-aqip-text-muted mt-1">Parcourez et {isAgent ? 'inscrivez-vous' : 'prescrivez'} les modules d'apprentissage certifiés.</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-aqip-text-muted" />
          <input 
            type="text" 
            placeholder="Rechercher un module (ex: Orthographe, Biométrie...)" 
            className="w-full pl-10 pr-4 py-2.5 bg-aqip-bg-elevated border border-aqip-border rounded-lg text-sm text-aqip-text-primary focus:border-aqip-primary outline-none transition-colors"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-aqip-bg-surface border border-aqip-border rounded-lg text-sm font-medium text-aqip-text-primary hover:bg-aqip-bg-elevated transition-colors">
          <Filter className="h-4 w-4" /> Filtres
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {CATALOGUE.map((mod) => (
          <AQIPCard key={mod.id} className="flex flex-col h-full hover:border-aqip-primary/50 transition-colors group cursor-pointer" noPadding>
            <div className={`h-32 ${mod.img} rounded-t-lg flex items-center justify-center`}>
              <BookOpen className="h-10 w-10 text-white opacity-50" />
            </div>
            <div className="p-5 flex-1 flex flex-col">
              <div className="flex justify-between items-start mb-2">
                <AQIPBadge variant={
                  mod.categorie === 'Technique' ? 'info' : 
                  mod.categorie === 'Linguistique' ? 'warning' : 
                  mod.categorie === 'Juridique' ? 'danger' : 'default'
                }>
                  {mod.categorie}
                </AQIPBadge>
                <div className="flex items-center gap-1 text-sm font-medium text-aqip-text-primary">
                  <Star className="h-3.5 w-3.5 text-aqip-accent fill-aqip-accent" /> {mod.notes}
                </div>
              </div>
              <h3 className="font-semibold text-lg text-white mb-2 leading-tight group-hover:text-aqip-primary transition-colors">{mod.titre}</h3>
              
              <div className="mt-auto pt-4 flex items-center justify-between border-t border-aqip-border text-sm">
                <div className="flex items-center gap-3 text-aqip-text-muted">
                  <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {mod.duree}</span>
                  <span>{mod.niveau}</span>
                </div>
                <button className="text-aqip-primary font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                  {isAgent ? "S'inscrire" : "Prescrire"} <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </AQIPCard>
        ))}
      </div>
    </div>
  );
}
