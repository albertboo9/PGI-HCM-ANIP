import { Menu } from 'lucide-react';
import RoleSwitcher from './RoleSwitcher';
import ThemeToggle from './ThemeToggle';
import CoachNotificationCenter from '../ui/CoachNotificationCenter';

interface HeaderProps {
  onMenuClick?: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  return (
    <div className="flex flex-col shrink-0 w-full z-10 shadow-md">
      {/* Top Bar - Solid Premium Blue */}
      <header className="flex h-16 items-center justify-between bg-[#2B5E8D] px-4 sm:px-6 lg:px-8 border-b border-[#2B5E8D]">
      <div className="flex items-center gap-4">
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

        <CoachNotificationCenter />

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
