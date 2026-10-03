import React, { useState } from 'react';
import { Image as ImageIcon, Smile, Video, Phone, Sparkles, SlidersHorizontal, Check } from 'lucide-react';
import { Post, Story, User, Note } from '../../types';
import { NotesBar } from '../notes/NotesBar';
import { StoryTray } from './StoryTray';
import { PostCard } from './PostCard';
import { trendingTopics, availableInterests } from '../../data/mockData';

interface FeedViewProps {
  currentUser: User;
  users: User[];
  posts: Post[];
  stories: Story[];
  onOpenStory: (story: Story) => void;
  onAddStory: () => void;
  onOpenCreatePost: () => void;
  onOpenCreateNote: () => void;
  onReplyToNote: (recipient: User, replyText: string) => void;
  onLikeToggle: (postId: string) => void;
  onSaveToggle: (postId: string) => void;
  onAddComment: (postId: string, text: string) => void;
  onOpenShareModal: (post: Post) => void;
  onStartCall: (participant: User, type: 'audio' | 'video') => void;
  onOpenMessagesWithUser: (user: User) => void;
  onAuthorClick: (user: User) => void;
  onOpenEditInterests: () => void;
}

export const FeedView: React.FC<FeedViewProps> = ({
  currentUser,
  users,
  posts,
  stories,
  onOpenStory,
  onAddStory,
  onOpenCreatePost,
  onOpenCreateNote,
  onReplyToNote,
  onLikeToggle,
  onSaveToggle,
  onAddComment,
  onOpenShareModal,
  onStartCall,
  onOpenMessagesWithUser,
  onAuthorClick,
  onOpenEditInterests
}) => {
  const [activeInterestFilter, setActiveInterestFilter] = useState<string>('all');

  const userInterests = currentUser.interests || ['photography', 'travel'];

  // Filter posts based on user selection or interests
  const filteredPosts = posts.filter((post) => {
    if (activeInterestFilter === 'all') {
      return true;
    }
    return (
      post.category === activeInterestFilter ||
      (post.tags && post.tags.includes(activeInterestFilter))
    );
  });

  return (
    <div className="flex-1 min-h-screen pb-20 md:pb-8 flex justify-center bg-neutral-50 dark:bg-neutral-950">
      <div className="w-full max-w-6xl px-0 md:px-6 py-0 md:py-6 flex gap-8 justify-center">
        {/* CENTER / MAIN FEED COLUMN */}
        <main className="w-full max-w-[630px] space-y-4">
          {/* Notes Tray (Instagram / Messenger style) */}
          <NotesBar
            currentUser={currentUser}
            users={users}
            onOpenCreateNote={onOpenCreateNote}
            onReplyToNote={onReplyToNote}
          />

          {/* Stories Tray */}
          <StoryTray
            stories={stories}
            currentUser={currentUser}
            onOpenStory={onOpenStory}
            onAddStory={onAddStory}
          />

          {/* Facebook-style "What's on your mind?" Composer Box */}
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 rounded-3xl p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                referrerPolicy="no-referrer"
                className="w-10 h-10 rounded-full object-cover ring-2 ring-indigo-500/20"
              />
              <button
                onClick={onOpenCreatePost}
                className="flex-1 py-2.5 px-4 rounded-full bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200/80 dark:hover:bg-neutral-700/80 text-left text-xs md:text-sm text-neutral-500 dark:text-neutral-400 font-medium transition-colors"
              >
                What's on your mind, {currentUser.name.split(' ')[0]}?
              </button>
            </div>

            <div className="flex items-center justify-around pt-3 mt-3 border-t border-neutral-100 dark:border-neutral-800">
              <button
                onClick={onOpenCreatePost}
                className="flex items-center gap-2 py-1 px-3 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-800 text-xs font-semibold text-neutral-700 dark:text-neutral-300 transition-colors"
              >
                <ImageIcon className="w-4 h-4 text-emerald-500" />
                <span>Photo</span>
              </button>

              <button
                onClick={onAddStory}
                className="flex items-center gap-2 py-1 px-3 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-800 text-xs font-semibold text-neutral-700 dark:text-neutral-300 transition-colors"
              >
                <Sparkles className="w-4 h-4 text-indigo-500" />
                <span>Story</span>
              </button>

              <button
                onClick={onOpenCreateNote}
                className="flex items-center gap-2 py-1 px-3 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-800 text-xs font-semibold text-neutral-700 dark:text-neutral-300 transition-colors"
              >
                <Smile className="w-4 h-4 text-amber-500" />
                <span>Note</span>
              </button>
            </div>
          </div>

          {/* Personalized Interests Filter Bar */}
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 rounded-3xl p-3 shadow-sm">
            <div className="flex items-center justify-between mb-2 px-1">
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                <span className="text-xs font-bold text-neutral-900 dark:text-white">
                  Curated for your interests
                </span>
              </div>
              <button
                onClick={onOpenEditInterests}
                className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
              >
                <SlidersHorizontal className="w-3 h-3" />
                <span>Customize</span>
              </button>
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
              <button
                onClick={() => setActiveInterestFilter('all')}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all whitespace-nowrap ${
                  activeInterestFilter === 'all'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200'
                }`}
              >
                ✨ For You
              </button>

              {userInterests.map((interestId) => {
                const interestObj = availableInterests.find((i) => i.id === interestId);
                if (!interestObj) return null;
                const isSelected = activeInterestFilter === interestId;
                return (
                  <button
                    key={interestId}
                    onClick={() => setActiveInterestFilter(interestId)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all whitespace-nowrap flex items-center gap-1 ${
                      isSelected
                        ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 shadow-sm'
                        : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200'
                    }`}
                  >
                    <span>{interestObj.emoji}</span>
                    <span>{interestObj.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Posts Stream */}
          <div className="space-y-4">
            {filteredPosts.length > 0 ? (
              filteredPosts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  currentUser={currentUser}
                  onLikeToggle={onLikeToggle}
                  onSaveToggle={onSaveToggle}
                  onAddComment={onAddComment}
                  onOpenShareModal={onOpenShareModal}
                  onAuthorClick={onAuthorClick}
                />
              ))
            ) : (
              <div className="bg-white dark:bg-neutral-900 rounded-3xl p-8 text-center border border-neutral-200 dark:border-neutral-800">
                <p className="text-sm font-semibold text-neutral-500">
                  No posts yet in this category. Be the first to share!
                </p>
                <button
                  onClick={onOpenCreatePost}
                  className="mt-3 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold"
                >
                  Create Post
                </button>
              </div>
            )}
          </div>
        </main>

        {/* RIGHT SIDEBAR (Desktop only) */}
        <aside className="hidden lg:block w-80 space-y-5 shrink-0 select-none">
          {/* Current User Overview Card */}
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 rounded-3xl p-4 shadow-sm flex items-center justify-between">
            <div
              onClick={() => onAuthorClick(currentUser)}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                referrerPolicy="no-referrer"
                className="w-12 h-12 rounded-full object-cover ring-2 ring-indigo-500/30"
              />
              <div>
                <span className="text-sm font-bold text-neutral-900 dark:text-white group-hover:text-indigo-600 block">
                  {currentUser.name}
                </span>
                <span className="text-xs text-neutral-500">
                  @{currentUser.username}
                </span>
              </div>
            </div>
            <button
              onClick={() => onAuthorClick(currentUser)}
              className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              View
            </button>
          </div>

          {/* Online Friends with Instant Call / Message Actions */}
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 rounded-3xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                Active Connections
              </span>
              <span className="text-[11px] text-emerald-500 font-semibold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Live
              </span>
            </div>

            <div className="space-y-3">
              {users
                .filter((u) => u.id !== currentUser.id && u.isOnline)
                .slice(0, 4)
                .map((friend) => (
                  <div
                    key={friend.id}
                    className="flex items-center justify-between group"
                  >
                    <div
                      onClick={() => onOpenMessagesWithUser(friend)}
                      className="flex items-center gap-2.5 cursor-pointer flex-1 min-w-0"
                    >
                      <div className="relative shrink-0">
                        <img
                          src={friend.avatar}
                          alt={friend.name}
                          referrerPolicy="no-referrer"
                          className="w-9 h-9 rounded-full object-cover"
                        />
                        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-neutral-900" />
                      </div>
                      <div className="truncate">
                        <div className="text-xs font-bold text-neutral-900 dark:text-white truncate">
                          {friend.name}
                        </div>
                        <div className="text-[10px] text-neutral-400 truncate">
                          @{friend.username}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0 ml-2">
                      <button
                        onClick={() => onStartCall(friend, 'audio')}
                        className="p-1.5 rounded-lg text-neutral-500 hover:text-indigo-600 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                        title="Voice Call"
                      >
                        <Phone className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onStartCall(friend, 'video')}
                        className="p-1.5 rounded-lg text-neutral-500 hover:text-indigo-600 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                        title="Video Call"
                      >
                        <Video className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Trending Topics & Hashtags */}
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 rounded-3xl p-4 shadow-sm">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-500 block mb-3">
              Trending on webop
            </span>
            <div className="space-y-2.5">
              {trendingTopics.map((topic) => (
                <div
                  key={topic.tag}
                  className="flex items-center justify-between text-xs hover:bg-neutral-50 dark:hover:bg-neutral-800/40 p-1.5 rounded-xl cursor-pointer transition-colors"
                >
                  <span className="font-bold text-neutral-900 dark:text-white">
                    {topic.tag}
                  </span>
                  <span className="text-[11px] text-neutral-400">
                    {topic.count}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Quiet Footer Links */}
          <div className="text-[11px] text-neutral-400 px-2 space-y-1">
            <div className="flex flex-wrap gap-x-2 gap-y-1">
              <span>About</span>
              <span>·</span>
              <span>Privacy</span>
              <span>·</span>
              <span>Terms</span>
              <span>·</span>
              <span>Language</span>
            </div>
            <div>© 2026 webop. All rights reserved.</div>
          </div>
        </aside>
      </div>
    </div>
  );
};
