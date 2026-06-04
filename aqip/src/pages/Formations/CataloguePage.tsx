import { useState } from 'react';
import AQIPButton from '../../components/ui/AQIPButton';
import { Search, Star, Clock, Video, FileText, CheckCircle2, Lock } from 'lucide-react';
import { motion } from 'framer-motion';

const MOCK_FORMATIONS = [
  {
    id: 'f1',
    titre: 'Langue Française: Éviter les fautes de frappe',
    categorie: 'Qualité',
    duree: '30 min',
    modules: 4,
    rating: 4.8,
    isFree: true,
    image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=600&auto=format&fit=crop',
    status: 'available' as const,
  },
  {
    id: 'f2',
    titre: 'Capture Biométrique Avancée',
    categorie: 'Technique',
    duree: '2 heures',
    modules: 8,
    rating: 4.9,
    isFree: false,
    image: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?q=80&w=600&auto=format&fit=crop',
    status: 'available' as const,
  },
  {
    id: 'f3',
    titre: "Gestion du Stress en Centre d'Enrôlement",
    categorie: 'Soft Skills',
    duree: '1 heure',
    modules: 5,
    rating: 4.5,
    isFree: true,
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=600&auto=format&fit=crop',
    status: 'in_progress' as const,
  },
  {
    id: 'f4',
    titre: 'Fraude Documentaire: Détection & Prévention',
    categorie: 'Sécurité',
    duree: '4 heures',
    modules: 12,
    rating: 5.0,
    isFree: false,
    image: 'https://images.unsplash.com/photo-1614064641936-38998978ae13?q=80&w=600&auto=format&fit=crop',
    status: 'available' as const,
  },
  {
    id: 'f5',
    titre: 'Accueil & Service Citoyen',
    categorie: 'Soft Skills',
    duree: '45 min',
    modules: 3,
    rating: 4.7,
    isFree: true,
    image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=600&auto=format&fit=crop',
    status: 'available' as const,
  },
  {
    id: 'f6',
    titre: 'Procédures RAVIP: Mise à jour 2026',
    categorie: 'Technique',
    duree: '1h30',
    modules: 6,
    rating: 4.6,
    isFree: true,
    image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=600&auto=format&fit=crop',
    status: 'available' as const,
  },
  {
    id: 'f7',
    titre: 'Leadership & Management de Proximité',
    categorie: 'Management',
    duree: '6 heures',
    modules: 15,
    rating: 4.9,
    isFree: false,
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=600&auto=format&fit=crop',
    status: 'available' as const,
  },
  {
    id: 'f8',
    titre: 'Protection des Données Personnelles (RGPD)',
    categorie: 'Sécurité',
    duree: '2 heures',
    modules: 7,
    rating: 4.4,
    isFree: false,
    image: 'https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?q=80&w=600&auto=format&fit=crop',
    status: 'available' as const,
  },
];

type FormationStatus = 'available' | 'requested' | 'in_progress';

interface Formation {
  id: string;
  titre: string;
  categorie: string;
  duree: string;
  modules: number;
  rating: number;
  isFree: boolean;
  image: string;
  status: FormationStatus;
}

export default function CataloguePage() {
  const [filter, setFilter] = useState('All');
  const [formations, setFormations] = useState<Formation[]>(MOCK_FORMATIONS as Formation[]);

  const handleRequest = (id: string) => {
    setFormations(prev => prev.map(f => f.id === id ? { ...f, status: 'requested' as FormationStatus } : f));
  };

  const handleStart = (id: string) => {
    setFormations(prev => prev.map(f => f.id === id ? { ...f, status: 'in_progress' as FormationStatus } : f));
  };

  const categories = ['All', ...Array.from(new Set(MOCK_FORMATIONS.map(f => f.categorie)))];
  const filteredFormations = filter === 'All' ? formations : formations.filter(f => f.categorie === filter);

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Hero Banner */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="relative rounded-2xl overflow-hidden bg-[#2B5E8D] text-white shadow-[var(--aqip-shadow-lg)]">
          <div className="absolute inset-0 bg-gradient-to-r from-[#1E3A8A]/95 via-[#2B5E8D]/80 to-transparent z-10"></div>
          <img 
            src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=2000&auto=format&fit=crop" 
            alt="Hero" 
            className="absolute inset-0 w-full h-full object-cover opacity-40" 
          />
          
          <div className="relative z-20 p-8 md:p-14 flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl md:text-4xl font-black mb-3 tracking-tight drop-shadow-md">Catalogue de Formations</h1>
              <p className="text-base text-white/80 max-w-xl font-medium leading-relaxed">
                Explorez les parcours certifiants de l'institution. Les formations gratuites sont accessibles immédiatement. 
                Pour les formations payantes, soumettez une demande d'approbation à votre supérieur.
              </p>
            </div>
            
            <div className="w-full md:w-80 relative shrink-0">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input 
                type="text" 
                placeholder="Rechercher..." 
                className="w-full bg-white/95 text-gray-900 rounded-xl pl-12 pr-4 py-3.5 focus:outline-none focus:ring-4 focus:ring-white/20 shadow-lg font-medium text-sm backdrop-blur-sm"
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2 justify-center">
        {categories.map((cat) => (
          <button 
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
              filter === cat 
                ? 'bg-[#2B5E8D] text-white shadow-md' 
                : 'bg-[var(--aqip-bg-surface)] text-[var(--aqip-text-secondary)] hover:bg-[var(--aqip-bg-elevated)] border border-[var(--aqip-border)]'
            }`}
          >
            {cat === 'All' ? 'Toutes' : cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredFormations.map((form, index) => (
          <motion.div 
            key={form.id} 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.4, delay: index * 0.08 }}
          >
            <div className="h-full flex flex-col rounded-xl overflow-hidden bg-[var(--aqip-bg-surface)] border border-[var(--aqip-border)] hover:shadow-[var(--aqip-shadow-lg)] hover:-translate-y-1 transition-all duration-300 group">
              {/* Image & Badge */}
              <div className="relative h-44 w-full overflow-hidden">
                <img src={form.image} alt={form.titre} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                <div className="absolute top-3 left-3">
                  {form.isFree ? (
                    <span className="bg-[var(--aqip-accent)] text-white text-[10px] font-black uppercase px-3 py-1 rounded-full shadow-md tracking-wider">Gratuit</span>
                  ) : (
                    <span className="bg-[var(--aqip-warning)] text-white text-[10px] font-black uppercase px-3 py-1 rounded-full shadow-md flex items-center gap-1 tracking-wider"><Lock className="h-3 w-3"/> Payant</span>
                  )}
                </div>
                <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm text-white text-xs font-bold px-2 py-1 rounded-md flex items-center gap-1">
                  <Star className="h-3 w-3 fill-[var(--aqip-gold)] text-[var(--aqip-gold)]" /> {form.rating}
                </div>
              </div>

              {/* Content */}
              <div className="p-4 flex flex-col flex-1">
                <div className="text-[10px] text-[var(--aqip-primary)] font-bold mb-1.5 uppercase tracking-widest">{form.categorie}</div>
                <h3 className="text-sm font-bold text-[var(--aqip-text-primary)] leading-snug mb-3 line-clamp-2 group-hover:text-[var(--aqip-primary)] transition-colors">{form.titre}</h3>
                
                <div className="flex items-center gap-3 text-xs text-[var(--aqip-text-muted)] font-medium mb-4">
                  <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5"/> {form.duree}</span>
                  <span className="flex items-center gap-1"><Video className="h-3.5 w-3.5"/> {form.modules} leçons</span>
                </div>

                <div className="mt-auto pt-3 border-t border-[var(--aqip-border)]">
                  {form.status === 'in_progress' ? (
                    <button className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold text-[var(--aqip-primary)] bg-[var(--aqip-primary)]/5 border border-[var(--aqip-primary)]/20 hover:bg-[var(--aqip-primary)]/10 transition-colors">
                      <FileText className="h-4 w-4" /> Reprendre
                    </button>
                  ) : form.status === 'requested' ? (
                    <div className="flex items-center justify-center gap-2 w-full py-2.5 bg-[var(--aqip-bg-elevated)] text-[var(--aqip-text-muted)] text-sm font-bold rounded-lg border border-[var(--aqip-border)]">
                      <CheckCircle2 className="h-4 w-4 text-[var(--aqip-accent)]" /> Demande Envoyée
                    </div>
                  ) : form.isFree ? (
                    <AQIPButton variant="primary" onClick={() => handleStart(form.id)} className="w-full justify-center gap-2">
                      <Video className="h-4 w-4" /> Commencer
                    </AQIPButton>
                  ) : (
                    <button 
                      onClick={() => handleRequest(form.id)} 
                      className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold text-white bg-[var(--aqip-warning)] hover:opacity-90 transition-opacity shadow-sm"
                    >
                      <Lock className="h-4 w-4" /> Demander Accès
                    </button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
