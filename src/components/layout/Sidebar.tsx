import React from 'react';
import {
  Home,
  Search,
  Compass,
  Film,
  MessageCircle,
  Bell,
  PlusSquare,
  StickyNote,
  Sun,
  Moon,
  Sparkles,
  LogOut
} from 'lucide-react';
import { User } from '../../types';

interface SidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  unreadMessagesCount: number;
  unreadNotifsCount: number;
  openCreateModal: () => void;
  openCreateNoteModal: () => void;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  currentUser: User;
  onLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  setCurrentTab,
  unreadMessagesCount,
  unreadNotifsCount,
  openCreateModal,
  openCreateNoteModal,
  darkMode,
  setDarkMode,
  currentUser,
  onLogout
}) => {
  const navItems = [
    { id: 'feed', label: 'Feed', icon: Home },
    { id: 'search', label: 'Search', icon: Search },
    { id: 'explore', label: 'Explore', icon: Compass },
    { id: 'reels', label: 'Reels', icon: Film },
    {
      id: 'messages',
      label: 'Messages',
      icon: MessageCircle,
      badge: unreadMessagesCount
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: Bell,
      badge: unreadNotifsCount
    },
    { id: 'notes', label: 'Notes', icon: StickyNote }
  ];

  return (
    <aside className="hidden md:flex flex-col justify-between w-64 lg:w-72 h-screen sticky top-0 px-4 py-6 border-r border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shrink-0 z-30 select-none">
      <div>
        {/* Brand Zone */}
        <div className="flex items-center justify-between px-3 mb-8">
          <button
            onClick={() => setCurrentTab('feed')}
            className="flex items-center gap-2.5 text-left group transition-transform active:scale-95"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-pink-500 via-rose-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-rose-500/20 group-hover:shadow-rose-500/35 transition-all">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="text-2xl font-extrabold tracking-tight font-display bg-gradient-to-r from-neutral-900 via-neutral-800 to-indigo-950 dark:from-white dark:via-neutral-100 dark:to-neutral-300 bg-clip-text text-transparent">
                webop
              </span>
            </div>
          </button>
        </div>

        {/* Primary Navigation */}
        <nav className="space-y-1.5" aria-label="Main Navigation">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-semibold transition-all relative ${
                  isActive
                    ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white'
                    : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800/60 hover:text-neutral-900 dark:hover:text-neutral-200'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <Icon
                    className={`w-5 h-5 transition-transform ${
                      isActive ? 'stroke-[2.5px] scale-105' : 'stroke-[1.8px]'
                    }`}
                  />
                  <span className="whitespace-nowrap">{item.label}</span>
                </div>
                {item.badge && item.badge > 0 ? (
                  <span className="min-w-5 h-5 px-1.5 rounded-full bg-rose-500 text-white text-[11px] font-bold flex items-center justify-center">
                    {item.badge}
                  </span>
                ) : null}
              </button>
            );
          })}

          {/* Quick Create Buttons */}
          <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800/80 space-y-2">
            <button
              onClick={openCreateModal}
              className="w-full flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-indigo-600 to-rose-600 hover:from-indigo-500 hover:to-rose-500 active:scale-[0.98] transition-all shadow-md shadow-indigo-600/20"
            >
              <PlusSquare className="w-5 h-5" />
              <span>Create Post</span>
            </button>

            <button
              onClick={openCreateNoteModal}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-semibold text-neutral-700 dark:text-neutral-300 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700/80 active:scale-[0.98] transition-all"
            >
              <StickyNote className="w-4 h-4 text-indigo-500" />
              <span>Leave a Note 💭</span>
            </button>
          </div>
        </nav>
      </div>

      {/* Footer Profile, Dark Mode, and Logout */}
      <div className="space-y-2 pt-4 border-t border-neutral-100 dark:border-neutral-800">
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
        >
          <span className="flex items-center gap-2.5">
            {darkMode ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-indigo-500" />
            )}
            <span>{darkMode ? 'Light Theme' : 'Dark Theme'}</span>
          </span>
          <span className="text-[10px] text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">
            {darkMode ? 'Dark' : 'Light'}
          </span>
        </button>

        {/* User Profile Tile with Logout Trigger */}
        <div className="flex items-center justify-between p-1.5 rounded-2xl bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200/60 dark:border-neutral-800">
          <button
            onClick={() => setCurrentTab('profile')}
            className="flex items-center gap-2.5 flex-1 min-w-0 text-left p-1 rounded-xl hover:bg-neutral-200/50 dark:hover:bg-neutral-700/50 transition-colors"
          >
            <div className="relative shrink-0">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                referrerPolicy="no-referrer"
                className="w-9 h-9 rounded-full object-cover ring-2 ring-indigo-500/30"
              />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-neutral-900" />
            </div>
            <div className="flex-1 truncate">
              <div className="text-xs font-bold text-neutral-900 dark:text-white truncate">
                {currentUser.name}
              </div>
              <div className="text-[10px] text-neutral-500 dark:text-neutral-400 truncate">
                @{currentUser.username}
              </div>
            </div>
          </button>

          <button
            onClick={onLogout}
            className="p-2 text-neutral-400 hover:text-rose-500 dark:hover:text-rose-400 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
            title="Log out / Switch Account"
            aria-label="Log out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
