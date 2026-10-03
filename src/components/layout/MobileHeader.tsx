import React from 'react';
import { Sparkles, Bell, MessageCircle, Sun, Moon, LogOut } from 'lucide-react';

interface MobileHeaderProps {
  onOpenNotifications: () => void;
  onOpenMessages: () => void;
  unreadNotifsCount: number;
  unreadMessagesCount: number;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  onBrandClick: () => void;
  isAuthenticated?: boolean;
  onLogout?: () => void;
}

export const MobileHeader: React.FC<MobileHeaderProps> = ({
  onOpenNotifications,
  onOpenMessages,
  unreadNotifsCount,
  unreadMessagesCount,
  darkMode,
  setDarkMode,
  onBrandClick,
  isAuthenticated,
  onLogout
}) => {
  return (
    <header className="md:hidden sticky top-0 z-30 flex items-center justify-between px-4 h-14 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800">
      <button
        onClick={onBrandClick}
        className="flex items-center gap-2 group active:scale-95 transition-transform"
      >
        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-pink-500 via-rose-500 to-indigo-600 flex items-center justify-center text-white shadow-sm">
          <Sparkles className="w-4 h-4" />
        </div>
        <span className="text-xl font-extrabold tracking-tight font-display bg-gradient-to-r from-neutral-900 to-indigo-900 dark:from-white dark:to-neutral-300 bg-clip-text text-transparent">
          webop
        </span>
      </button>

      <div className="flex items-center gap-1">
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="p-2 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full transition-colors"
          aria-label="Toggle dark mode"
        >
          {darkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
        </button>

        <button
          onClick={onOpenNotifications}
          className="p-2 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full relative transition-colors"
          aria-label="Notifications"
        >
          <Bell className="w-5 h-5" />
          {unreadNotifsCount > 0 && (
            <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-rose-500 ring-2 ring-white dark:ring-neutral-900" />
          )}
        </button>

        <button
          onClick={onOpenMessages}
          className="p-2 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full relative transition-colors"
          aria-label="Direct messages"
        >
          <MessageCircle className="w-5 h-5" />
          {unreadMessagesCount > 0 && (
            <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-indigo-500 ring-2 ring-white dark:ring-neutral-900" />
          )}
        </button>

        {isAuthenticated && onLogout && (
          <button
            onClick={onLogout}
            className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-full transition-colors ml-0.5"
            aria-label="Log out"
            title="Гарах (Log out)"
          >
            <LogOut className="w-5 h-5" />
          </button>
        )}
      </div>
    </header>
  );
};
