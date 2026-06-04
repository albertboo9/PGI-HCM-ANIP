import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, AlertTriangle, Users, BrainCircuit, PlayCircle,
  Network, MessageSquare, TrendingUp,
  ShieldAlert, Settings, Briefcase, ChevronDown, ChevronRight,
  Target, FileText, PenTool, Search, X, Library
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
          { name: 'Matrice des Talents', to: '/rh/talents', icon: Briefcase },
          { name: 'Référentiel Compétences', to: '/referentiel/competences', icon: Target },
          { name: 'Catalogue Formations', to: '/formations/catalogue', icon: Library },
        ]
      },
      {
        name: 'Organisation',
        items: [
          { name: 'Organigramme', to: '/rh/organigramme', icon: Network },
          { name: 'Profils Agents', to: '/referentiel/profils', icon: Users },
        ]
      },
      {
        name: 'Qualité & Conformité',
        items: [
          { name: 'Journal des Incidents', to: '/incidents', icon: AlertTriangle },
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
          { name: 'Satisfaction Citoyen', to: '/satisfaction', icon: MessageSquare },
        ]
      },
      {
        name: 'Développement',
        items: [
          { name: 'Assistant IA', to: '/ia', icon: BrainCircuit },
          { name: 'Catalogue Formations', to: '/formations/catalogue', icon: Library },
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
        ]
      },
      {
        name: 'Mon Développement',
        items: [
          { name: 'Catalogue Formations', to: '/formations/catalogue', icon: Library },
          { name: 'Documents', to: '/documents', icon: FileText },
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
    <div className="flex h-full flex-col bg-[var(--aqip-sidebar-bg)] border-r border-aqip-border overflow-hidden transition-colors duration-300">
      <div className="flex h-16 shrink-0 items-center justify-between px-6 border-b border-aqip-border/50">
        <span className="text-sm font-bold text-aqip-text-primary tracking-widest uppercase">Menu Principal</span>
        {/* Mobile close button */}
        <button onClick={onClose} className="lg:hidden text-aqip-text-muted hover:text-aqip-text-primary p-1">
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="px-4 py-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-aqip-text-muted" />
          <input 
            type="text" 
            placeholder="Rechercher..." 
            className="w-full bg-[var(--aqip-bg-surface)] border border-aqip-border/50 text-aqip-text-primary text-sm rounded-lg pl-9 pr-3 py-2 focus:ring-1 focus:ring-[#2B5E8D] focus:border-[#2B5E8D] transition-all placeholder:text-[var(--aqip-text-muted)] shadow-sm"
          />
        </div>
      </div>
      
      <nav className="flex-1 overflow-y-auto px-4 pb-8 custom-scrollbar">
        <ul role="list" className="flex flex-col gap-y-6">
          {navGroups.map((group) => (
            <li key={group.name}>
              <button
                onClick={() => toggleGroup(group.name)}
                className="flex w-full items-center justify-between text-xs font-semibold text-[var(--aqip-text-muted)] hover:text-[var(--aqip-text-primary)] transition-colors mb-2 tracking-wide"
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
                              ? 'bg-[#2B5E8D] text-white font-bold shadow-md'
                              : 'text-[var(--aqip-text-secondary)] hover:text-[var(--aqip-text-primary)] hover:bg-[var(--aqip-bg-elevated)]',
                            'group flex items-center gap-x-3 rounded-lg px-3 py-2.5 text-sm transition-all'
                          )
                        }
                      >
                        {({ isActive }) => (
                          <>
                            <item.icon
                              className={clsx(
                                isActive ? 'text-white' : 'text-[var(--aqip-text-muted)] group-hover:text-[var(--aqip-text-primary)]',
                                'h-5 w-5 shrink-0 transition-colors'
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
