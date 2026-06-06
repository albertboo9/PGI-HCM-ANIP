import { useState, useMemo } from 'react';
import AQIPCard from '../../components/ui/AQIPCard';
import { Search, Star, Clock, Video, FileText, CheckCircle2, Library, Target, Building2, Sparkles, Send, ChevronRight, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuthStore } from '../../store/authStore';
import { useAgentStore } from '../../store/agentStore';
import { useIncidentStore } from '../../store/incidentStore';
import { getAgentSkillGaps, getRecommendedFormations } from '../../services/skillEngine';
import { getProactiveMessage } from '../../services/coachEngine';

type TabId = 'libre' | 'prescrit' | 'externe';

interface Formation {
  id: string;
  titre: string;
  categorie: string;
  duree: string;
  modules: number;
  rating: number;
  isFree: boolean;
  image: string;
  status: 'available' | 'requested' | 'in_progress';
  segment: TabId;
  motif?: string;
  cout?: string;
}

const MOCK_FORMATIONS: Formation[] = [
  // CATALOGUE LIBRE
  { id: 'f1', titre: 'Langue Française: Éviter les fautes de frappe', categorie: 'Qualité', duree: '30 min', modules: 4, rating: 4.8, isFree: true, image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=600&auto=format&fit=crop', status: 'available', segment: 'libre' },
  { id: 'f3', titre: "Gestion du Stress en Centre d'Enrôlement", categorie: 'Soft Skills', duree: '1 heure', modules: 5, rating: 4.5, isFree: true, image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=600&auto=format&fit=crop', status: 'in_progress', segment: 'libre' },
  { id: 'f5', titre: 'Accueil & Service Citoyen', categorie: 'Soft Skills', duree: '45 min', modules: 3, rating: 4.7, isFree: true, image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=600&auto=format&fit=crop', status: 'available', segment: 'libre' },
  { id: 'f6', titre: 'Procédures RAVIP: Mise à jour 2026', categorie: 'Technique', duree: '1h30', modules: 6, rating: 4.6, isFree: true, image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=600&auto=format&fit=crop', status: 'available', segment: 'libre' },

  // FORMATIONS PRESCRITES (Coach / PDI / Qualité)
  { id: 'f2', titre: 'Capture Biométrique Avancée', categorie: 'Technique', duree: '2 heures', modules: 8, rating: 4.9, isFree: false, image: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?q=80&w=600&auto=format&fit=crop', status: 'available', segment: 'prescrit', motif: 'Prescrit par le Coach suite à 7 erreurs BIO-03' },
  { id: 'f4', titre: 'Fraude Documentaire: Détection & Prévention', categorie: 'Sécurité', duree: '4 heures', modules: 12, rating: 5.0, isFree: false, image: 'https://images.unsplash.com/photo-1614064641936-38998978ae13?q=80&w=600&auto=format&fit=crop', status: 'available', segment: 'prescrit', motif: 'Inscrit au PDI — Qualité documentaire' },

  // FORMATIONS EXTERNES
  { id: 'f7', titre: 'Leadership & Management de Proximité', categorie: 'Management', duree: '6 heures', modules: 15, rating: 4.9, isFree: false, image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=600&auto=format&fit=crop', status: 'available', segment: 'externe', cout: '150 000 FCFA' },
  { id: 'f8', titre: 'Protection des Données Personnelles (RGPD)', categorie: 'Sécurité', duree: '2 heures', modules: 7, rating: 4.4, isFree: false, image: 'https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?q=80&w=600&auto=format&fit=crop', status: 'available', segment: 'externe', cout: '85 000 FCFA' },
];

const TABS: { id: TabId; label: string; icon: typeof Library; description: string; badge: string }[] = [
  { id: 'libre', label: 'Catalogue Libre', icon: Library, description: 'Formations accessibles immédiatement, sans validation.', badge: 'Accès libre' },
  { id: 'prescrit', label: 'Formations Prescrites', icon: Target, description: 'Issues du Coach, d\'un PDI ou d\'un constat qualité.', badge: 'Recommandé' },
  { id: 'externe', label: 'Formations Externes', icon: Building2, description: 'Nécessitent une validation hiérarchique (Chef → DRH).', badge: 'Validation requise' },
];

export default function CataloguePage() {
  const [activeTab, setActiveTab] = useState<TabId>('libre');
  const [formations, setFormations] = useState<Formation[]>(MOCK_FORMATIONS);
  const [demandeEnCours, setDemandeEnCours] = useState<string | null>(null);
  const { currentUser } = useAuthStore();
  const agents = useAgentStore(s => s.agents);
  const incidents = useIncidentStore(s => s.incidents);

  const userIdToAgentId: Record<string, string> = { 'usr-005': 'agt-001' };
  const agentId = userIdToAgentId[currentUser?.id || ''] || 'agt-001';
  const agent = agents.find(a => a.id === agentId);
  const gaps = useMemo(() => agent ? getAgentSkillGaps(agent, incidents) : [], [agent, incidents]);
  const recommended = useMemo(() => getRecommendedFormations(gaps), [gaps]);

  const filteredFormations = useMemo(() =>
    formations.filter(f => f.segment === activeTab),
  [formations, activeTab]);


  const handleStart = (id: string) => {
    setFormations(prev => prev.map(f => f.id === id ? { ...f, status: 'in_progress' } : f));
  };

  const handleDemandeExterne = (id: string) => {
    setDemandeEnCours(id);
    setTimeout(() => {
      setFormations(prev => prev.map(f => f.id === id ? { ...f, status: 'requested' } : f));
      setDemandeEnCours(null);
    }, 1500);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Hero Banner */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="relative rounded-2xl overflow-hidden bg-[#2B5E8D] text-white shadow-[var(--aqip-shadow-lg)]">
          <div className="absolute inset-0 bg-gradient-to-r from-[#1E3A8A]/95 via-[#2B5E8D]/80 to-transparent z-10"></div>
          <img src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=2000&auto=format&fit=crop" alt="Hero" className="absolute inset-0 w-full h-full object-cover opacity-40" />
          <div className="relative z-20 p-6 md:p-10 flex flex-col md:flex-row items-center gap-6">
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-2xl md:text-3xl font-black mb-2 tracking-tight drop-shadow-md">Learning Campus ANIP</h1>
              <p className="text-sm text-white/80 max-w-xl font-medium leading-relaxed">
                Développez vos compétences grâce à notre catalogue de formations. Les formations libres sont accessibles immédiatement. Les formations prescrites sont issues de votre Coach ou de votre PDI.
              </p>
            </div>
            <div className="w-full md:w-72 relative shrink-0">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input type="text" placeholder="Rechercher une formation..." className="w-full bg-white/95 text-gray-900 rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:ring-4 focus:ring-white/20 shadow-lg font-medium text-sm backdrop-blur-sm" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Coach — Message contextuel */}
      {agent && activeTab === 'prescrit' && gaps.length > 0 && (
        <AQIPCard className="bg-gradient-to-r from-[var(--aqip-primary)]/10 to-[var(--aqip-accent)]/5 border-[var(--aqip-primary)]/20">
          <div className="flex items-start gap-3">
            <div className="h-8 w-8 rounded-full bg-[var(--aqip-primary)]/20 flex items-center justify-center shrink-0 mt-0.5">
              <Sparkles className="h-4 w-4 text-[var(--aqip-primary)]" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-[var(--aqip-text-secondary)] leading-relaxed italic">
                « {getProactiveMessage(agent, incidents)} »
              </p>
              <div className="flex gap-2 mt-2">
                {recommended.slice(0, 2).map(f => (
                  <span key={f.formationId} className="text-[10px] bg-[var(--aqip-bg-surface)] border border-[var(--aqip-border)] px-2 py-1 rounded-full text-[var(--aqip-text-secondary)] flex items-center gap-1">
                    <BookOpen className="h-3 w-3 text-[var(--aqip-primary)]" /> {f.formationLabel}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </AQIPCard>
      )}

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 justify-center">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const count = formations.filter(f => f.segment === tab.id).length;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold transition-all ${
                activeTab === tab.id
                  ? 'bg-[#2B5E8D] text-white shadow-lg'
                  : 'bg-[var(--aqip-bg-surface)] text-[var(--aqip-text-secondary)] hover:bg-[var(--aqip-bg-elevated)] border border-[var(--aqip-border)]'
              }`}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-[var(--aqip-bg-elevated)] text-[var(--aqip-text-muted)]'}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Description de l'onglet actif */}
      <div className="text-center">
        <p className="text-xs text-[var(--aqip-text-muted)] max-w-lg mx-auto">
          {TABS.find(t => t.id === activeTab)?.description}
        </p>
      </div>

      {/* Grille */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {filteredFormations.map((form, index) => (
          <motion.div key={form.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: index * 0.06 }}>
            <div className="h-full flex flex-col rounded-xl overflow-hidden bg-[var(--aqip-bg-surface)] border border-[var(--aqip-border)] hover:shadow-[var(--aqip-shadow-lg)] hover:-translate-y-1 transition-all duration-300 group">
              {/* Image */}
              <div className="relative h-40 w-full overflow-hidden">
                <img src={form.image} alt={form.titre} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                <div className="absolute top-3 left-3">
                  {form.segment === 'libre' && (
                    <span className="bg-[var(--aqip-accent)] text-white text-[10px] font-black uppercase px-2.5 py-1 rounded-full shadow-md tracking-wider">Libre</span>
                  )}
                  {form.segment === 'prescrit' && (
                    <span className="bg-[var(--aqip-warning)] text-white text-[10px] font-black uppercase px-2.5 py-1 rounded-full shadow-md tracking-wider flex items-center gap-1">
                      <Target className="h-3 w-3" /> Prescrit
                    </span>
                  )}
                  {form.segment === 'externe' && (
                    <span className="bg-[var(--aqip-primary)] text-white text-[10px] font-black uppercase px-2.5 py-1 rounded-full shadow-md tracking-wider flex items-center gap-1">
                      <Building2 className="h-3 w-3" /> Externe
                    </span>
                  )}
                </div>
                <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm text-white text-xs font-bold px-2 py-1 rounded-md flex items-center gap-1">
                  <Star className="h-3 w-3 fill-[var(--aqip-gold)] text-[var(--aqip-gold)]" /> {form.rating}
                </div>
              </div>

              {/* Content */}
              <div className="p-4 flex flex-col flex-1">
                <div className="text-[10px] text-[var(--aqip-primary)] font-bold mb-1 uppercase tracking-widest">{form.categorie}</div>
                <h3 className="text-sm font-bold text-[var(--aqip-text-primary)] leading-snug mb-2 line-clamp-2 group-hover:text-[var(--aqip-primary)] transition-colors">{form.titre}</h3>

                {form.motif && (
                  <div className="mb-3 p-2 bg-[var(--aqip-warning)]/5 border border-[var(--aqip-warning)]/20 rounded-lg text-[10px] text-[var(--aqip-text-muted)] leading-relaxed">
                    <span className="font-bold text-[var(--aqip-warning)]">Motif :</span> {form.motif}
                  </div>
                )}

                <div className="flex items-center gap-3 text-xs text-[var(--aqip-text-muted)] font-medium mb-3">
                  <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5"/> {form.duree}</span>
                  <span className="flex items-center gap-1"><Video className="h-3.5 w-3.5"/> {form.modules} leçons</span>
                </div>

                {form.cout && (
                  <div className="text-[10px] text-[var(--aqip-text-muted)] mb-3 font-medium">Coût : <span className="font-bold text-[var(--aqip-text-primary)]">{form.cout}</span></div>
                )}

                <div className="mt-auto pt-3 border-t border-[var(--aqip-border)]">
                  {form.status === 'in_progress' ? (
                    <button className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold text-[var(--aqip-primary)] bg-[var(--aqip-primary)]/5 border border-[var(--aqip-primary)]/20 hover:bg-[var(--aqip-primary)]/10 transition-colors">
                      <FileText className="h-4 w-4" /> Reprendre
                    </button>
                  ) : form.status === 'requested' ? (
                    <div className="flex items-center justify-center gap-2 w-full py-2.5 bg-[var(--aqip-bg-elevated)] text-[var(--aqip-text-muted)] text-sm font-bold rounded-lg border border-[var(--aqip-border)]">
                      <CheckCircle2 className="h-4 w-4 text-[var(--aqip-accent)]" /> Demande Envoyée
                    </div>
                  ) : form.segment === 'libre' ? (
                    <button onClick={() => handleStart(form.id)} className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold text-white bg-[var(--aqip-accent)] hover:opacity-90 transition-opacity shadow-sm">
                      <Video className="h-4 w-4" /> Commencer
                    </button>
                  ) : form.segment === 'prescrit' ? (
                    <button onClick={() => handleStart(form.id)} className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold text-white bg-[var(--aqip-warning)] hover:opacity-90 transition-opacity shadow-sm">
                      <Target className="h-4 w-4" /> Suivre la formation
                    </button>
                  ) : (
                    <div>
                      {demandeEnCours === form.id ? (
                        <div className="flex items-center justify-center gap-2 w-full py-2.5 bg-[var(--aqip-bg-elevated)] text-[var(--aqip-text-muted)] text-sm font-bold rounded-lg border border-[var(--aqip-border)] animate-pulse">
                          <Send className="h-4 w-4" /> Envoi en cours...
                        </div>
                      ) : (
                        <button onClick={() => handleDemandeExterne(form.id)} className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold text-white bg-[var(--aqip-primary)] hover:opacity-90 transition-opacity shadow-sm">
                          <Send className="h-4 w-4" /> Demander l'accès
                        </button>
                      )}
                      <p className="text-[9px] text-[var(--aqip-text-muted)] text-center mt-1.5 flex items-center justify-center gap-1">
                        <ChevronRight className="h-3 w-3" /> Agent → Chef de Centre → DRH
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredFormations.length === 0 && (
        <div className="text-center py-16">
          <BookOpen className="h-12 w-12 text-[var(--aqip-text-muted)] opacity-30 mx-auto mb-4" />
          <p className="text-sm font-bold text-[var(--aqip-text-muted)]">Aucune formation dans cette catégorie pour le moment.</p>
        </div>
      )}
    </div>
  );
}