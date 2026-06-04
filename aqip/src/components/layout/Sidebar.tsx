import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, AlertTriangle, Users, BrainCircuit, PlayCircle,
  Network, MessageSquare, TrendingUp,
  ShieldAlert, Settings, Briefcase, ChevronDown, ChevronRight,
  Target, FileText, PenTool, Search, X, Library,
  BookOpen, Award, Map, BarChart3, UserCheck, DollarSign, HeartHandshake, Sparkles
} from 'lucide-react';
import clsx from 'clsx';
import { useState, useMemo } from 'react';
import { useAuthStore } from '../../store/authStore';
import type { Role } from '../../store/authStore';

interface SidebarProps {
  onClose?: () => void;
}

interface NavItem {
  name: string;
  to: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
}

interface NavGroup {
  name: string;
  items: NavItem[];
}

const getNavigationGroups = (role: Role, notificationsNonLues?: number): NavGroup[] => {
  // Menu Agent
  if (role === 'agent') {
    return [
      {
        name: 'Mon Espace',
        items: [
          { name: 'Tableau de bord', to: '/dashboard', icon: LayoutDashboard },
          { name: 'Mon Coach IA', to: '/ia', icon: BrainCircuit, badge: 1 },
          { name: 'Espace de Travail', to: '/workspace', icon: PenTool },
        ]
      },
      {
        name: 'Mes Formations',
        items: [
          { name: 'Catalogue Formations', to: '/formations/catalogue', icon: Library },
          { name: 'Mes Formations', to: '/excellence/lms', icon: BookOpen },
          { name: 'Mes Certifications', to: '/excellence/certifications', icon: Award },
        ]
      },
      {
        name: 'Mon Profil',
        items: [
          { name: 'Mes Compétences', to: '/referentiel/competences', icon: Target },
          { name: 'Feedbacks', to: '/excellence/feedback', icon: MessageSquare },
          { name: 'Mon Dossier', to: '/agent/usr-005/dossier', icon: FileText },
        ]
      },
    ];
  }

  // Menu Chef de Centre
  if (role === 'chef_centre') {
    return [
      {
        name: 'Pilotage',
        items: [
          { name: 'Tableau de bord', to: '/dashboard', icon: LayoutDashboard },
          { name: 'Command Center', to: '/pilotage/command-center', icon: PlayCircle },
          { name: 'Qualité Centre', to: '/qualite/centres', icon: TrendingUp },
        ]
      },
      {
        name: 'Supervision',
        items: [
          { name: 'Mon Équipe', to: '/rh/organigramme', icon: Users },
          { name: 'Incidents', to: '/incidents', icon: AlertTriangle, badge: notificationsNonLues },
          { name: 'Satisfaction Citoyen', to: '/satisfaction', icon: HeartHandshake },
        ]
      },
      {
        name: 'Développement',
        items: [
          { name: 'Assistant IA', to: '/ia', icon: BrainCircuit },
          { name: 'Formations Équipe', to: '/formations/catalogue', icon: Library },
          { name: 'Maturité Centre', to: '/maturite', icon: BarChart3 },
        ]
      },
    ];
  }

  // Menu DRH
  if (role === 'drh') {
    return [
      {
        name: 'Pilotage RH',
        items: [
          { name: 'Tableau de bord', to: '/dashboard', icon: LayoutDashboard },
          { name: 'Organigramme', to: '/rh/organigramme', icon: Network },
          { name: 'Talents & Succession', to: '/rh/talents', icon: UserCheck },
        ]
      },
      {
        name: 'Gestion RH',
        items: [
          { name: 'Référentiel Compétences', to: '/referentiel/competences', icon: Target },
          { name: 'Catalogue Formations', to: '/formations/catalogue', icon: Library },
          { name: 'Budget Formation', to: '/pilotage/command-center', icon: DollarSign },
          { name: 'Matrice Compétences', to: '/referentiel/matrice', icon: Grid3x3Icon },
        ]
      },
      {
        name: 'Décisions RH',
        items: [
          { name: 'Conseiller IA', to: '/ia', icon: BrainCircuit },
          { name: 'Dossier Agents', to: '/referentiel/profils', icon: FileText },
          { name: 'Feedbacks 360°', to: '/excellence/feedback', icon: MessageSquare },
        ]
      },
    ];
  }

  // Menu Directeur Départemental
  if (role === 'directeur_dept') {
    return [
      {
        name: 'Pilotage',
        items: [
          { name: 'Tableau de bord', to: '/dashboard', icon: LayoutDashboard },
          { name: 'Cartographie', to: '/qualite/centres', icon: Map },
          { name: 'Command Center', to: '/pilotage/command-center', icon: PlayCircle },
        ]
      },
      {
        name: 'Département',
        items: [
          { name: 'Centres', to: '/qualite/centres', icon: Briefcase },
          { name: 'Incidents', to: '/incidents', icon: AlertTriangle },
          { name: 'Satisfaction', to: '/satisfaction', icon: HeartHandshake },
        ]
      },
      {
        name: 'Analyse',
        items: [
          { name: 'Scores & Analytics', to: '/intelligence/scores', icon: TrendingUp },
          { name: 'Observatoire Données', to: '/qualite/observatoire', icon: BarChart3 },
          { name: 'Assistant IA', to: '/ia', icon: BrainCircuit },
        ]
      },
    ];
  }

  // Menu DG
  if (role === 'dg') {
    return [
      {
        name: 'Command Center',
        items: [
          { name: 'Pilotage National', to: '/dashboard', icon: LayoutDashboard },
          { name: 'Command Center', to: '/pilotage/command-center', icon: PlayCircle },
          { name: 'Mission Control', to: '/mission-control', icon: ShieldAlert },
        ]
      },
      {
        name: 'Performance',
        items: [
          { name: 'Cartographie Nationale', to: '/qualite/centres', icon: Map },
          { name: 'Scores Nationaux', to: '/intelligence/scores', icon: TrendingUp },
          { name: 'ROI Formations', to: '/pilotage/command-center', icon: DollarSign },
        ]
      },
      {
        name: 'RH Stratégique',
        items: [
          { name: 'Talents & Succession', to: '/rh/talents', icon: UserCheck },
          { name: 'Organigramme', to: '/rh/organigramme', icon: Network },
          { name: 'Observatoire', to: '/qualite/observatoire', icon: BarChart3 },
        ]
      },
      {
        name: 'Gouvernance',
        items: [
          { name: 'Assistant IA Stratégique', to: '/ia', icon: BrainCircuit },
          { name: 'Audit & Conformité', to: '/gouvernance/audit', icon: ShieldAlert },
          { name: 'Incidents Nationaux', to: '/incidents', icon: AlertTriangle },
        ]
      },
    ];
  }

  // Menu Auditeur
  if (role === 'auditeur') {
    return [
      {
        name: 'Audit',
        items: [
          { name: 'Tableau de bord', to: '/dashboard', icon: LayoutDashboard },
          { name: 'Audit Trail', to: '/gouvernance/audit', icon: Settings },
          { name: 'Incidents', to: '/incidents', icon: AlertTriangle },
        ]
      },
      {
        name: 'Conformité',
        items: [
          { name: 'Observatoire', to: '/qualite/observatoire', icon: BarChart3 },
          { name: 'Centres', to: '/qualite/centres', icon: Briefcase },
          { name: 'Satisfaction', to: '/satisfaction', icon: HeartHandshake },
        ]
      },
    ];
  }

  // Menu Responsable Qualité
  if (role === 'responsable_qualite') {
    return [
      {
        name: 'Qualité',
        items: [
          { name: 'Tableau de bord', to: '/dashboard', icon: LayoutDashboard },
          { name: 'Incidents', to: '/incidents', icon: AlertTriangle },
          { name: 'Erreurs & Analyse', to: '/qualite/erreurs', icon: PenTool },
        ]
      },
      {
        name: 'Supervision',
        items: [
          { name: 'Centres', to: '/qualite/centres', icon: Briefcase },
          { name: 'Observatoire', to: '/qualite/observatoire', icon: BarChart3 },
          { name: 'Maturité', to: '/maturite', icon: TrendingUp },
        ]
      },
      {
        name: 'Amélioration',
        items: [
          { name: 'Assistant IA Qualité', to: '/ia', icon: BrainCircuit },
          { name: 'Catalogue Formations', to: '/formations/catalogue', icon: Library },
          { name: 'Satisfaction Citoyen', to: '/satisfaction', icon: HeartHandshake },
        ]
      },
    ];
  }

  return [];
};

function Grid3x3Icon({ className }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>;
}

export default function Sidebar({ onClose }: SidebarProps) {
  const { currentRole, currentUser } = useAuthStore();
  
  const navGroups = useMemo(() => getNavigationGroups(currentRole), [currentRole]);

  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(
    navGroups.reduce((acc, group) => ({ ...acc, [group.name]: true }), {})
  );

  const toggleGroup = (name: string) => {
    setOpenGroups(prev => ({ ...prev, [name]: !prev[name] }));
  };

  return (
    <div className="flex h-full flex-col bg-[var(--aqip-sidebar-bg)] border-r border-aqip-border overflow-hidden transition-colors duration-300">
      {/* En-tête avec infos utilisateur */}
      <div className="shrink-0 border-b border-aqip-border/50">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-white font-bold text-sm shadow-lg">
              {currentUser?.prenom?.[0]}{currentUser?.nom?.[0]}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-[var(--aqip-text-primary)] truncate">
                {currentUser?.prenom} {currentUser?.nom}
              </p>
              <p className="text-xs text-[var(--aqip-text-muted)] truncate">
                {currentUser?.role === 'dg' ? 'Directeur Général' :
                 currentUser?.role === 'drh' ? 'Directeur RH' :
                 currentUser?.role === 'chef_centre' ? 'Chef de Centre' :
                 currentUser?.role === 'directeur_dept' ? 'Directeur Départemental' :
                 currentUser?.role === 'agent' ? "Agent d'enrôlement" :
                 currentUser?.role === 'auditeur' ? 'Auditeur' :
                 currentUser?.role === 'responsable_qualite' ? 'Responsable Qualité' : ''}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="lg:hidden text-[var(--aqip-text-muted)] hover:text-[var(--aqip-text-primary)] p-1">
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Barre de recherche */}
      <div className="px-3 py-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--aqip-text-muted)]" />
          <input 
            type="text" 
            placeholder="Rechercher..." 
            className="w-full bg-[var(--aqip-bg-surface)] border border-aqip-border/50 text-[var(--aqip-text-primary)] text-sm rounded-lg pl-9 pr-3 py-2 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all placeholder:text-[var(--aqip-text-muted)]"
          />
        </div>
      </div>

      {/* Badge rôle actif */}
      <div className="px-3 pb-2">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-lg">
          <Sparkles className="h-3.5 w-3.5 text-blue-400" />
          <span className="text-xs font-medium text-blue-400 uppercase tracking-wider">
            {currentRole === 'dg' ? 'Vue DG' :
             currentRole === 'drh' ? 'Vue DRH' :
             currentRole === 'chef_centre' ? 'Vue Chef Centre' :
             currentRole === 'agent' ? 'Vue Agent' :
             currentRole === 'directeur_dept' ? 'Vue Département' :
             currentRole === 'auditeur' ? 'Vue Auditeur' :
             'Vue Qualité'}
          </span>
        </div>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 pb-8 custom-scrollbar">
        <ul role="list" className="flex flex-col gap-y-5">
          {navGroups.map((group) => (
            <li key={group.name}>
              <button
                onClick={() => toggleGroup(group.name)}
                className="flex w-full items-center justify-between text-xs font-semibold text-[var(--aqip-text-muted)] hover:text-[var(--aqip-text-primary)] transition-colors mb-1.5 px-2 tracking-wider uppercase"
              >
                {group.name}
                {openGroups[group.name] ? (
                  <ChevronDown className="h-3.5 w-3.5 opacity-70" />
                ) : (
                  <ChevronRight className="h-3.5 w-3.5 opacity-70" />
                )}
              </button>
              
              {openGroups[group.name] && (
                <ul role="list" className="space-y-0.5">
                  {group.items.map((item) => (
                    <li key={item.name}>
                      <NavLink
                        to={item.to}
                        onClick={() => {
                          if (window.innerWidth < 1024 && onClose) {
                            onClose();
                          }
                        }}
                        className={({ isActive }) =>
                          clsx(
                            isActive
                              ? 'bg-blue-600/20 text-blue-400 font-semibold border-l-2 border-blue-400'
                              : 'text-[var(--aqip-text-secondary)] hover:text-[var(--aqip-text-primary)] hover:bg-[var(--aqip-bg-elevated)] border-l-2 border-transparent',
                            'group flex items-center gap-x-3 rounded-r-lg px-3 py-2 text-sm transition-all'
                          )
                        }
                      >
                        <item.icon className="h-4.5 w-4.5 shrink-0 text-[var(--aqip-text-muted)] group-hover:text-[var(--aqip-text-primary)] transition-colors" />
                        <span className="flex-1">{item.name}</span>
                        {item.badge !== undefined && item.badge > 0 && (
                          <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full">
                            {item.badge}
                          </span>
                        )}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}