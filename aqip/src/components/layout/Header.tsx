import { Bell, Search, Menu } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import RoleSwitcher from './RoleSwitcher';

interface HeaderProps {
  onMenuClick?: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-aqip-border bg-aqip-bg-surface px-4 sm:px-6 lg:px-8 shadow-sm">
      <div className="flex items-center gap-4 lg:hidden">
        <button 
          type="button" 
          onClick={onMenuClick}
          className="-m-2.5 p-2.5 text-aqip-text-muted hover:text-white transition-colors"
        >
          <span className="sr-only">Ouvrir le menu</span>
          <Menu className="h-6 w-6" aria-hidden="true" />
        </button>
        <div className="h-8 w-8 rounded-lg bg-aqip-primary flex items-center justify-center text-white font-bold text-sm">
          AQ
        </div>
      </div>

      <div className="hidden lg:flex flex-1 items-center gap-x-4 md:gap-x-6">
        <form className="relative flex flex-1 max-w-lg" action="#" method="GET">
          <label htmlFor="search-field" className="sr-only">
            Rechercher un agent, un centre, un incident...
          </label>
          <Search
            className="pointer-events-none absolute inset-y-0 left-0 h-full w-5 text-aqip-text-muted ml-3"
            aria-hidden="true"
          />
          <input
            id="search-field"
            className="block h-10 w-full rounded-md border border-aqip-border bg-aqip-bg-elevated py-1.5 pl-10 pr-3 text-aqip-text-primary placeholder:text-aqip-text-muted focus:ring-1 focus:ring-inset focus:ring-aqip-primary sm:text-sm sm:leading-6 transition-all"
            placeholder="Rechercher (Dossier, Agent, Centre...)"
            type="search"
            name="search"
          />
        </form>
      </div>
      
      <div className="flex items-center gap-x-2 sm:gap-x-4 lg:gap-x-6 ml-auto lg:ml-6">
        <ThemeToggle />
        
        <button type="button" className="p-2 text-aqip-text-muted hover:text-aqip-text-primary hover:bg-aqip-bg-elevated rounded-full transition-colors relative">
          <span className="sr-only">Voir les notifications</span>
          <Bell className="h-5 w-5" aria-hidden="true" />
          <span className="absolute top-2 right-2.5 block h-2 w-2 rounded-full bg-aqip-danger ring-2 ring-aqip-bg-surface" />
        </button>

        {/* Separator */}
        <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-aqip-border" aria-hidden="true" />

        {/* Profile dropdown / Role Switcher */}
        <RoleSwitcher />
      </div>
    </header>
  );
}
