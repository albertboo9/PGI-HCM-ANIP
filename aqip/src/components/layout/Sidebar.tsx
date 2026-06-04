import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, AlertTriangle, Users, BrainCircuit, PlayCircle,
  Network, Award, BookOpen, MessageSquare, TrendingUp,
  ShieldAlert, Settings, Briefcase, ChevronDown, ChevronRight,
  Target, FileText, MapPin, PenTool, Search
} from 'lucide-react';
import clsx from 'clsx';
import { useState, useMemo } from 'react';
import { useAuthStore } from '../../store/authStore';

interface SidebarProps {
  onClose?: () => void;
}

const getNavigationGroups = (role: string) => {
  if (role === 'dg' || role === 'drh') {
    return [
      {
        name: 'Général',
        items: [
          { name: 'Tableau de bord', to: '/dashboard', icon: LayoutDashboard },
          { name: 'Mission Control', to: '/mission-control', icon: PlayCircle },
          { name: 'Conseiller RH (IA)', to: '/ia', icon: BrainCircuit },
        ]
      },
      {
        name: 'Développement (HCM)',
        items: [
          { name: 'Catalogue Formations', to: '/excellence/lms', icon: BookOpen },
          { name: 'Matrice des Talents', to: '/rh/talents', icon: Briefcase },
          { name: 'Référentiel Compétences', to: '/referentiel/competences', icon: Target },
          { name: 'Feedback & Évaluations', to: '/excellence/feedback', icon: MessageSquare },
        ]
      },
      {
        name: 'Organisation',
        items: [
          { name: 'Organigramme', to: '/rh/organigramme', icon: Network },
          { name: 'Fiches Métiers', to: '/referentiel/metiers', icon: FileText },
          { name: 'Profils Agents', to: '/referentiel/profils', icon: Users },
        ]
      },
      {
        name: 'Qualité & Conformité',
        items: [
          { name: 'Journal des Incidents', to: '/incidents', icon: AlertTriangle },
          { name: 'Audit & Traçabilité', to: '/gouvernance/audit', icon: Settings },
          { name: 'Observatoire National', to: '/qualite/observatoire', icon: TrendingUp },
        ]
      }
    ];
  }

  if (role === 'chef_centre' || role === 'responsable_qualite' || role === 'directeur_dept') {
    return [
      {
        name: 'Général',
        items: [
          { name: 'Tableau de bord', to: '/dashboard', icon: LayoutDashboard },
          { name: 'Command Center', to: '/pilotage/command-center', icon: ShieldAlert },
        ]
      },
      {
        name: 'Supervision',
        items: [
          { name: 'Journal des Incidents', to: '/incidents', icon: AlertTriangle },
          { name: 'Réseau d\'Antennes', to: '/qualite/centres', icon: MapPin },
          { name: 'Satisfaction Citoyen', to: '/satisfaction', icon: MessageSquare },
        ]
      },
      {
        name: 'Outils & Analyse',
        items: [
          { name: 'Assistant IA', to: '/ia', icon: BrainCircuit },
          { name: 'Taxonomie Erreurs', to: '/qualite/erreurs', icon: FileText },
          { name: 'Scores & KPI', to: '/intelligence/scores', icon: TrendingUp },
        ]
      }
    ];
  }

  if (role === 'agent') {
    return [
      {
        name: 'Général',
        items: [
          { name: 'Mon Espace', to: '/dashboard', icon: LayoutDashboard },
        ]
      },
      {
        name: 'Opérations',
        items: [
          { name: 'Enrôlement (RAVIP)', to: '/workspace', icon: PenTool },
          { name: 'Parcours Citoyen', to: '/citoyen', icon: Users },
        ]
      },
      {
        name: 'Mon Développement',
        items: [
          { name: 'Mes Formations', to: '/excellence/lms', icon: BookOpen },
          { name: 'Feedback 360', to: '/excellence/feedback', icon: MessageSquare },
          { name: 'Mes Certifications', to: '/excellence/certifications', icon: Award },
        ]
      }
    ];
  }

  if (role === 'auditeur') {
    return [
      {
        name: 'Général',
        items: [
          { name: 'Tableau de bord', to: '/dashboard', icon: LayoutDashboard },
        ]
      },
      {
        name: 'Contrôle',
        items: [
          { name: 'Journal des Incidents', to: '/incidents', icon: AlertTriangle },
          { name: 'Audit & Conformité', to: '/gouvernance/audit', icon: Settings },
          { name: 'Observatoire', to: '/qualite/observatoire', icon: TrendingUp },
        ]
      }
    ];
  }

  return [];
};

export default function Sidebar({ onClose }: SidebarProps) {
  const { currentRole } = useAuthStore();
  
  const navGroups = useMemo(() => getNavigationGroups(currentRole), [currentRole]);

  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(
    navGroups.reduce((acc, group) => ({ ...acc, [group.name]: true }), {})
  );

  const toggleGroup = (name: string) => {
    setOpenGroups(prev => ({ ...prev, [name]: !prev[name] }));
  };

  return (
    <div className="flex h-full flex-col bg-aqip-sidebar-bg border-r border-aqip-border overflow-hidden">
      {/* Sidebar Header */}
      <div className="flex h-16 shrink-0 items-center gap-3 px-6 border-b border-aqip-border/50">
        <div className="h-8 w-8 rounded-lg bg-aqip-primary flex items-center justify-center text-white font-bold text-sm shadow-md">
          AQ
        </div>
        <div className="flex flex-col">
          <span className="text-lg font-bold text-aqip-text-primary tracking-tight leading-tight">AQIP<span className="text-aqip-primary">.</span></span>
          <span className="text-[10px] uppercase font-semibold text-aqip-text-muted tracking-widest leading-none">ANIP Bénin</span>
        </div>
      </div>

      {/* Quick Search Box (Mock) */}
      <div className="px-4 py-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-aqip-text-muted" />
          <input 
            type="text" 
            placeholder="Rechercher..." 
            className="w-full bg-aqip-bg-surface border border-aqip-border/50 text-aqip-text-primary text-sm rounded-lg pl-9 pr-3 py-2 focus:ring-1 focus:ring-aqip-primary focus:border-aqip-primary transition-all placeholder:text-aqip-text-muted"
          />
        </div>
      </div>
      
      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto px-4 pb-8 custom-scrollbar">
        <ul role="list" className="flex flex-col gap-y-6">
          {navGroups.map((group) => (
            <li key={group.name}>
              <button
                onClick={() => toggleGroup(group.name)}
                className="flex w-full items-center justify-between text-xs font-semibold text-aqip-text-muted hover:text-aqip-text-primary transition-colors mb-2 tracking-wide"
              >
                {group.name}
                {openGroups[group.name] ? (
                  <ChevronDown className="h-3.5 w-3.5 opacity-70" />
                ) : (
                  <ChevronRight className="h-3.5 w-3.5 opacity-70" />
                )}
              </button>
              
              {openGroups[group.name] && (
                <ul role="list" className="space-y-1">
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
                              ? 'bg-aqip-primary/10 text-aqip-primary font-medium'
                              : 'text-aqip-text-secondary hover:text-aqip-text-primary hover:bg-aqip-bg-elevated',
                            'group flex items-center gap-x-3 rounded-md px-3 py-2 text-sm transition-all'
                          )
                        }
                      >
                        {({ isActive }) => (
                          <>
                            <item.icon
                              className={clsx(
                                isActive ? 'text-aqip-primary' : 'text-aqip-text-muted group-hover:text-aqip-text-primary',
                                'h-4 w-4 shrink-0 transition-colors'
                              )}
                              aria-hidden="true"
                            />
                            {item.name}
                          </>
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
