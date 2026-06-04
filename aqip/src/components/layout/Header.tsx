import { Bell, Menu, MessageSquare } from 'lucide-react';
import RoleSwitcher from './RoleSwitcher';
import ThemeToggle from './ThemeToggle';

interface HeaderProps {
  onMenuClick?: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  return (
    <div className="flex flex-col shrink-0 w-full z-10 shadow-md">
      {/* Top Bar - Solid Premium Blue */}
      <header className="flex h-16 items-center justify-between bg-[#2B5E8D] px-4 sm:px-6 lg:px-8 border-b border-[#2B5E8D]">
      <div className="flex items-center gap-4 lg:hidden">
        <button 
          type="button" 
          onClick={onMenuClick}
          className="-m-2.5 p-2.5 text-white/80 hover:text-white transition-colors"
        >
          <span className="sr-only">Ouvrir le menu</span>
          <Menu className="h-7 w-7" aria-hidden="true" />
        </button>
        <div className="flex items-center gap-2 text-white">
          <div className="h-8 w-8 rounded-lg bg-white/20 backdrop-blur-md flex items-center justify-center font-bold text-sm shadow-inner">
            AQ
          </div>
          <span className="font-bold text-xl hidden sm:block tracking-tight text-white">ANIP Performance</span>
        </div>
      </div>

      <div className="hidden lg:flex flex-1 items-center gap-x-4 md:gap-x-6">
        <div className="flex items-center gap-3 text-white ml-2">
          <div className="h-10 w-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center font-bold text-lg border border-white/10 shadow-inner">
            AQ
          </div>
          <span className="font-bold text-2xl tracking-tight text-white drop-shadow-sm">ANIP Performance</span>
        </div>
      </div>
      
      <div className="flex items-center gap-x-3 sm:gap-x-5 lg:gap-x-6 ml-auto">
        <ThemeToggle />

        <button type="button" className="flex items-center gap-2 px-3 py-2 text-xs font-bold text-[#2B5E8D] bg-white hover:bg-gray-50 rounded-full transition-all shadow-sm">
          <MessageSquare className="h-4 w-4" />
          <span className="hidden sm:inline">Coach IA</span>
        </button>
        
        <button type="button" className="p-2 text-white/80 hover:text-white rounded-full transition-colors relative focus:outline-none focus:ring-2 focus:ring-white/50">
          <span className="sr-only">Voir les notifications</span>
          <Bell className="h-6 w-6" aria-hidden="true" />
          <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-sm border-2 border-[#2B5E8D]">
            3
          </span>
        </button>

        {/* Separator */}
        <div className="hidden lg:block lg:h-8 lg:w-px lg:bg-white/30" aria-hidden="true" />

        {/* Profile dropdown / Role Switcher */}
        <div className="text-white">
          <RoleSwitcher />
        </div>
      </div>
      </header>
    </div>
  );
}
