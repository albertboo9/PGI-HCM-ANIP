import { NavLink } from 'react-router-dom';
import { LayoutDashboard, AlertTriangle, Users, BrainCircuit, PlayCircle } from 'lucide-react';
import clsx from 'clsx';

const BOTTOM_NAV = [
  { name: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
  { name: 'Incidents', to: '/incidents', icon: AlertTriangle },
  { name: 'Citoyen', to: '/citoyen', icon: Users },
  { name: 'IA', to: '/ia', icon: BrainCircuit },
  { name: 'Replay', to: '/mission-control', icon: PlayCircle },
];

export default function MobileBottomNav() {
  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 border-t border-aqip-border bg-aqip-bg-surface pb-safe z-40">
      <nav className="flex justify-around items-center h-16 px-2">
        {BOTTOM_NAV.map((item) => (
          <NavLink
            key={item.name}
            to={item.to}
            className={({ isActive }) =>
              clsx(
                isActive
                  ? 'text-aqip-primary'
                  : 'text-aqip-text-muted hover:text-aqip-text-primary',
                'flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors'
              )
            }
          >
            <item.icon className="h-5 w-5" aria-hidden="true" />
            <span className="text-[10px] font-medium leading-none">{item.name}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
