import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  AlertTriangle, 
  Users, 
  BrainCircuit, 
  PlayCircle,
  Settings
} from 'lucide-react';
import clsx from 'clsx';

const NAVIGATION = [
  { name: 'Dashboard DG', to: '/dashboard', icon: LayoutDashboard },
  { name: 'Journal Opérationnel', to: '/incidents', icon: AlertTriangle },
  { name: 'Parcours Citoyen', to: '/citoyen', icon: Users },
  { name: 'IA Experte ANIP', to: '/ia', icon: BrainCircuit },
  { name: 'Mission Control', to: '/mission-control', icon: PlayCircle },
];

export default function Sidebar() {
  return (
    <div className="flex h-full w-64 flex-col border-r border-aqip-border bg-aqip-bg-surface">
      <div className="flex h-16 shrink-0 items-center px-6 border-b border-aqip-border bg-gradient-to-r from-aqip-bg-surface to-aqip-bg-base">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-aqip-primary flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-aqip-primary/20">
            AQ
          </div>
          <span className="text-xl font-semibold tracking-tight text-white">AQIP v2</span>
        </div>
      </div>
      
      <div className="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
        <nav className="mt-2 flex-1 space-y-1 px-3">
          <div className="mb-4 px-3 text-xs font-semibold tracking-wider text-aqip-text-muted uppercase">
            Pilotage National
          </div>
          {NAVIGATION.map((item) => (
            <NavLink
              key={item.name}
              to={item.to}
              className={({ isActive }) =>
                clsx(
                  isActive
                    ? 'bg-aqip-primary/10 text-aqip-primary border-r-2 border-aqip-primary'
                    : 'text-aqip-text-muted hover:bg-aqip-bg-elevated hover:text-white',
                  'group flex items-center px-3 py-2.5 text-sm font-medium rounded-l-md transition-all duration-200'
                )
              }
            >
              <item.icon
                className={clsx('mr-3 h-5 w-5 flex-shrink-0')}
                aria-hidden="true"
              />
              {item.name}
            </NavLink>
          ))}
        </nav>
      </div>
      
      <div className="border-t border-aqip-border p-4">
        <button className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-aqip-text-muted hover:bg-aqip-bg-elevated hover:text-white transition-colors">
          <Settings className="h-5 w-5" />
          Paramètres
        </button>
      </div>
    </div>
  );
}
