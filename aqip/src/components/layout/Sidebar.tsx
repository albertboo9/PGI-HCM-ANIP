import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, AlertTriangle, Users, BrainCircuit, PlayCircle,
  Network, Award, BookOpen, MessageSquare, TrendingUp,
  ShieldAlert, Settings, Briefcase, ChevronDown, ChevronRight,
  Target, FileText, MapPin, PenTool
} from 'lucide-react';
import clsx from 'clsx';
import { useState, useMemo } from 'react';
import { useAuthStore } from '../../store/authStore';

const getNavigationGroups = (role: string) => {
  const groups = [
    {
      name: 'Tableau de bord',
      roles: ['dg', 'drh', 'chef_centre', 'directeur_dept', 'responsable_qualite', 'auditeur', 'agent'],
      items: [
        { name: 'Vue Exécutive', to: '/dashboard', icon: LayoutDashboard },
      ]
    },
    {
      name: 'Espace Opérationnel',
      roles: ['agent'],
      items: [
        { name: 'Enrôlement (RAVIP)', to: '/workspace', icon: PenTool },
      ]
    },
    {
      name: 'Pilier 1: Référentiel',
      roles: ['dg', 'drh'],
      items: [
        { name: 'Métiers', to: '/referentiel/metiers', icon: Briefcase },
        { name: 'Compétences', to: '/referentiel/competences', icon: Target },
        { name: 'Profils & Agents', to: '/referentiel/profils', icon: Users },
        { name: 'Matrice', to: '/referentiel/matrice', icon: Network },
      ]
    },
    {
      name: 'Pilier 2: Qualité',
      roles: ['dg', 'drh', 'chef_centre', 'directeur_dept', 'responsable_qualite', 'auditeur'],
      items: [
        { name: 'Journal Incidents', to: '/incidents', icon: AlertTriangle },
        { name: 'Taxonomie Erreurs', to: '/qualite/erreurs', icon: FileText },
        { name: 'Centres & Antennes', to: '/qualite/centres', icon: MapPin },
        { name: 'Observatoire', to: '/qualite/observatoire', icon: TrendingUp },
      ]
    },
    {
      name: 'Pilier 3: Intelligence',
      roles: ['dg', 'drh', 'chef_centre', 'directeur_dept', 'responsable_qualite'],
      items: [
        { name: 'Assistant IA', to: '/ia', icon: BrainCircuit },
        { name: 'Scores & KPI', to: '/intelligence/scores', icon: TrendingUp },
      ]
    },
    {
      name: 'Pilier 4: Excellence',
      roles: ['dg', 'drh', 'agent'],
      items: [
        { name: 'Formation (LMS)', to: '/excellence/lms', icon: BookOpen },
        { name: 'Feedback 360', to: '/excellence/feedback', icon: MessageSquare },
        { name: 'Certifications', to: '/excellence/certifications', icon: Award },
      ]
    },
    {
      name: 'Pilier 5: Citoyen',
      roles: ['dg', 'agent', 'responsable_qualite'],
      items: [
        { name: 'Parcours Citoyen', to: '/citoyen', icon: Users },
        { name: 'Satisfaction (NPS)', to: '/satisfaction', icon: MessageSquare },
      ]
    },
    {
      name: 'Pilier 6: Pilotage',
      roles: ['dg', 'chef_centre', 'directeur_dept', 'responsable_qualite'],
      items: [
        { name: 'Mission Control', to: '/mission-control', icon: PlayCircle },
        { name: 'Command Center', to: '/pilotage/command-center', icon: ShieldAlert },
      ]
    },
    {
      name: 'Pilier 7 & 8: Gouv & RH',
      roles: ['dg', 'drh', 'auditeur'],
      items: [
        { name: 'Audit & Conformité', to: '/gouvernance/audit', icon: Settings },
        { name: 'Organigramme', to: '/rh/organigramme', icon: Network },
        { name: 'Matrice 9-Box', to: '/rh/talents', icon: Briefcase },
      ]
    }
  ];

  return groups.filter(g => g.roles.includes(role));
};

export default function Sidebar() {
  const { currentRole } = useAuthStore();
  
  const navGroups = useMemo(() => getNavigationGroups(currentRole), [currentRole]);

  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(
    navGroups.reduce((acc, group) => ({ ...acc, [group.name]: true }), {})
  );

  const toggleGroup = (name: string) => {
    setOpenGroups(prev => ({ ...prev, [name]: !prev[name] }));
  };

  return (
    <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-aqip-sidebar-bg border-r border-aqip-border px-6 pb-4 custom-scrollbar">
      <div className="flex h-16 shrink-0 items-center gap-3">
        <div className="h-8 w-8 rounded-lg bg-aqip-primary flex items-center justify-center text-white font-bold text-sm shadow-md">
          AQ
        </div>
        <div className="flex flex-col">
          <span className="text-lg font-bold text-aqip-text-primary tracking-tight">AQIP<span className="text-aqip-primary">.</span></span>
          <span className="text-[10px] uppercase font-semibold text-aqip-text-muted tracking-widest leading-none">ANIP Bénin</span>
        </div>
      </div>
      
      <nav className="flex flex-1 flex-col pb-8">
        <ul role="list" className="flex flex-1 flex-col gap-y-5">
          {navGroups.map((group) => (
            <li key={group.name}>
              <button
                onClick={() => toggleGroup(group.name)}
                className="flex w-full items-center justify-between text-[10px] font-semibold leading-6 text-aqip-text-muted hover:text-aqip-text-primary transition-colors mb-1.5 uppercase tracking-wider"
              >
                {group.name}
                {openGroups[group.name] ? (
                  <ChevronDown className="h-3.5 w-3.5" />
                ) : (
                  <ChevronRight className="h-3.5 w-3.5" />
                )}
              </button>
              
              {openGroups[group.name] && (
                <ul role="list" className="-mx-2 space-y-0.5">
                  {group.items.map((item) => (
                    <li key={item.name}>
                      <NavLink
                        to={item.to}
                        className={({ isActive }) =>
                          clsx(
                            isActive
                              ? 'bg-aqip-sidebar-active-bg text-aqip-sidebar-active-text font-medium'
                              : 'text-aqip-text-secondary hover:text-aqip-text-primary hover:bg-aqip-sidebar-hover-bg',
                            'group flex gap-x-3 rounded-md px-2 py-1.5 text-sm leading-6 transition-all'
                          )
                        }
                      >
                        {({ isActive }) => (
                          <>
                            <item.icon
                              className={clsx(
                                isActive ? 'text-aqip-sidebar-active-text' : 'text-aqip-text-muted group-hover:text-aqip-text-primary',
                                'h-4 w-4 shrink-0 transition-colors mt-0.5'
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
