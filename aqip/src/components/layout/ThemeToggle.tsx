import { Sun, Moon } from 'lucide-react';
import { useThemeStore } from '../../store/themeStore';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useThemeStore();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full text-aqip-text-muted hover:bg-aqip-bg-elevated hover:text-aqip-text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-aqip-primary focus:ring-offset-2 focus:ring-offset-aqip-bg-base"
      aria-label="Toggle theme"
      title={`Passer au mode ${theme === 'light' ? 'sombre' : 'clair'}`}
    >
      {theme === 'light' ? (
        <Moon className="h-5 w-5" />
      ) : (
        <Sun className="h-5 w-5" />
      )}
    </button>
  );
}
