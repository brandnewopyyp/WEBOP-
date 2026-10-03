import React from 'react';
import { Home, Compass, PlusSquare, MessageCircle, User as UserIcon } from 'lucide-react';

interface BottomNavProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  openCreateModal: () => void;
  unreadMessagesCount: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  setCurrentTab,
  openCreateModal,
  unreadMessagesCount
}) => {
  return (
    <nav
      aria-label="Mobile Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md border-t border-neutral-200 dark:border-neutral-800 px-2 py-1 safe-area-pb"
    >
      <div className="grid grid-cols-5 items-center h-14">
        <button
          onClick={() => setCurrentTab('feed')}
          className={`flex flex-col items-center justify-center py-1 transition-colors ${
            currentTab === 'feed'
              ? 'text-indigo-600 dark:text-indigo-400'
              : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-900'
          }`}
        >
          <Home className={`w-6 h-6 ${currentTab === 'feed' ? 'stroke-[2.5px]' : 'stroke-2'}`} />
          <span className="text-[10px] font-medium tracking-tight mt-0.5">Feed</span>
        </button>

        <button
          onClick={() => setCurrentTab('explore')}
          className={`flex flex-col items-center justify-center py-1 transition-colors ${
            currentTab === 'explore'
              ? 'text-indigo-600 dark:text-indigo-400'
              : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-900'
          }`}
        >
          <Compass className={`w-6 h-6 ${currentTab === 'explore' ? 'stroke-[2.5px]' : 'stroke-2'}`} />
          <span className="text-[10px] font-medium tracking-tight mt-0.5">Explore</span>
        </button>

        <button
          onClick={openCreateModal}
          className="flex flex-col items-center justify-center -mt-3"
          aria-label="Create Post"
        >
          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-indigo-600 to-rose-500 text-white flex items-center justify-center shadow-lg shadow-indigo-600/30 active:scale-95 transition-transform">
            <PlusSquare className="w-6 h-6" />
          </div>
        </button>

        <button
          onClick={() => setCurrentTab('messages')}
          className={`flex flex-col items-center justify-center py-1 relative transition-colors ${
            currentTab === 'messages'
              ? 'text-indigo-600 dark:text-indigo-400'
              : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-900'
          }`}
        >
          <div className="relative">
            <MessageCircle className={`w-6 h-6 ${currentTab === 'messages' ? 'stroke-[2.5px]' : 'stroke-2'}`} />
            {unreadMessagesCount > 0 && (
              <span className="absolute -top-1 -right-2 min-w-4 h-4 px-1 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center">
                {unreadMessagesCount}
              </span>
            )}
          </div>
          <span className="text-[10px] font-medium tracking-tight mt-0.5">Chat</span>
        </button>

        <button
          onClick={() => setCurrentTab('profile')}
          className={`flex flex-col items-center justify-center py-1 transition-colors ${
            currentTab === 'profile'
              ? 'text-indigo-600 dark:text-indigo-400'
              : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-900'
          }`}
        >
          <UserIcon className={`w-6 h-6 ${currentTab === 'profile' ? 'stroke-[2.5px]' : 'stroke-2'}`} />
          <span className="text-[10px] font-medium tracking-tight mt-0.5">Profile</span>
        </button>
      </div>
    </nav>
  );
};
