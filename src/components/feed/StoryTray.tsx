import React from 'react';
import { Plus } from 'lucide-react';
import { Story, User } from '../../types';

interface StoryTrayProps {
  stories: Story[];
  currentUser: User;
  onOpenStory: (story: Story) => void;
  onAddStory: () => void;
}

export const StoryTray: React.FC<StoryTrayProps> = ({
  stories,
  currentUser,
  onOpenStory,
  onAddStory
}) => {
  return (
    <div className="w-full bg-white dark:bg-neutral-900 border-b border-neutral-200/80 dark:border-neutral-800/80 p-4">
      <div className="flex items-center gap-3.5 overflow-x-auto no-scrollbar py-1">
        {/* Add Story Button for Current User */}
        <div
          onClick={onAddStory}
          className="flex flex-col items-center shrink-0 cursor-pointer group"
        >
          <div className="relative">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              referrerPolicy="no-referrer"
              className="w-16 h-16 rounded-full object-cover p-0.5 ring-2 ring-neutral-200 dark:ring-neutral-700 group-hover:scale-105 transition-transform"
            />
            <div className="absolute bottom-0 right-0 w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center ring-2 ring-white dark:ring-neutral-900 shadow-sm">
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
            </div>
          </div>
          <span className="text-[11px] font-medium text-neutral-700 dark:text-neutral-300 mt-1.5 truncate max-w-[68px]">
            Your Story
          </span>
        </div>

        {/* Stories from Friends */}
        {stories.map((story) => (
          <div
            key={story.id}
            onClick={() => onOpenStory(story)}
            className="flex flex-col items-center shrink-0 cursor-pointer group"
          >
            <div
              className={`p-[2.5px] rounded-full transition-all group-hover:scale-105 ${
                story.isViewed
                  ? 'bg-neutral-300 dark:bg-neutral-700'
                  : 'bg-gradient-to-tr from-amber-400 via-rose-500 to-indigo-600 shadow-sm shadow-rose-500/20'
              }`}
            >
              <div className="p-0.5 bg-white dark:bg-neutral-900 rounded-full">
                <img
                  src={story.author.avatar}
                  alt={story.author.name}
                  referrerPolicy="no-referrer"
                  className="w-14 h-14 rounded-full object-cover"
                />
              </div>
            </div>
            <span className="text-[11px] font-medium text-neutral-700 dark:text-neutral-300 mt-1.5 truncate max-w-[68px]">
              {story.author.name.split(' ')[0]}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
