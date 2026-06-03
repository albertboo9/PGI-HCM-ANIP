import { Bell, Search, UserCircle, ChevronDown } from 'lucide-react';

export default function Header() {
  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-aqip-border bg-aqip-bg-surface px-6 shadow-sm">
      <div className="flex flex-1 items-center gap-x-4 md:gap-x-6">
        <form className="relative flex flex-1" action="#" method="GET">
          <label htmlFor="search-field" className="sr-only">
            Rechercher un agent, un centre, un incident...
          </label>
          <Search
            className="pointer-events-none absolute inset-y-0 left-0 h-full w-5 text-aqip-text-muted ml-2"
            aria-hidden="true"
          />
          <input
            id="search-field"
            className="block h-10 w-full rounded-md border-0 bg-aqip-bg-elevated py-1.5 pl-10 pr-3 text-aqip-text-primary placeholder:text-aqip-text-muted focus:ring-1 focus:ring-inset focus:ring-aqip-primary sm:text-sm sm:leading-6 transition-all"
            placeholder="Rechercher (Dossier, Agent, Centre...)"
            type="search"
            name="search"
          />
        </form>
      </div>
      
      <div className="flex items-center gap-x-4 lg:gap-x-6 ml-6">
        <button type="button" className="-m-2.5 p-2.5 text-aqip-text-muted hover:text-white transition-colors relative">
          <span className="sr-only">Voir les notifications</span>
          <Bell className="h-5 w-5" aria-hidden="true" />
          <span className="absolute top-2 right-2.5 block h-2 w-2 rounded-full bg-aqip-danger ring-2 ring-aqip-bg-surface" />
        </button>

        {/* Separator */}
        <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-aqip-border" aria-hidden="true" />

        {/* Profile dropdown / Role Switcher */}
        <div className="flex items-center gap-x-4 cursor-pointer hover:bg-aqip-bg-elevated p-2 rounded-md transition-colors">
          <UserCircle className="h-8 w-8 text-aqip-text-muted" aria-hidden="true" />
          <span className="hidden lg:flex lg:items-center">
            <span className="flex flex-col text-sm font-semibold leading-6 text-white" aria-hidden="true">
              <span>Directeur Général</span>
              <span className="text-xs font-normal text-aqip-text-muted">Mode Démo Actif</span>
            </span>
            <ChevronDown className="ml-2 h-4 w-4 text-aqip-text-muted" aria-hidden="true" />
          </span>
        </div>
      </div>
    </header>
  );
}
