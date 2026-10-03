import React, { useState } from 'react';
import {
  Grid,
  Bookmark,
  Film,
  UserCheck,
  Edit3,
  Phone,
  Video,
  MessageCircle,
  Share2,
  Check,
  Sparkles,
  Music,
  SlidersHorizontal,
  LogOut
} from 'lucide-react';
import { Post, User } from '../../types';
import { availableInterests } from '../../data/mockData';

interface ProfileViewProps {
  user: User;
  currentUser: User;
  posts: Post[];
  onOpenEditProfile: () => void;
  onStartCall: (participant: User, type: 'audio' | 'video') => void;
  onOpenMessagesWithUser: (user: User) => void;
  onSelectPost: (post: Post) => void;
  onOpenCreateNote: () => void;
  onOpenEditInterests?: () => void;
  onLogout?: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  user,
  currentUser,
  posts,
  onOpenEditProfile,
  onStartCall,
  onOpenMessagesWithUser,
  onSelectPost,
  onOpenCreateNote,
  onOpenEditInterests,
  onLogout
}) => {
  const [activeTab, setActiveTab] = useState<'posts' | 'saved' | 'reels'>('posts');
  const [isFollowing, setIsFollowing] = useState(false);

  const isMe = user.id === currentUser.id;
  const userPosts = posts.filter((p) => p.author.id === user.id);
  const savedPosts = posts.filter((p) => p.saved);

  const displayedPosts =
    activeTab === 'posts' ? userPosts : activeTab === 'saved' ? savedPosts : userPosts;

  const userInterests = user.interests || ['photography', 'travel'];

  return (
    <div className="flex-1 min-h-screen pb-20 md:pb-8 p-4 md:p-8 max-w-4xl mx-auto">
      {/* Profile Header */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 rounded-3xl p-6 md:p-8 shadow-sm mb-6">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-10">
          {/* Avatar Slot with active Note thought bubble */}
          <div className="flex flex-col items-center shrink-0">
            {/* Note Bubble above profile avatar if present */}
            {user.currentNote && (
              <div
                onClick={isMe ? onOpenCreateNote : undefined}
                className={`mb-3 px-3 py-1.5 rounded-2xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 shadow-sm text-center relative ${
                  isMe ? 'cursor-pointer hover:scale-105 transition-transform' : ''
                }`}
              >
                <div className="text-xs font-semibold text-neutral-900 dark:text-white">
                  {user.currentNote.moodEmoji && (
                    <span className="mr-1">{user.currentNote.moodEmoji}</span>
                  )}
                  {user.currentNote.content}
                </div>
                {user.currentNote.musicTrack && (
                  <div className="flex items-center justify-center gap-1 text-[10px] text-indigo-600 dark:text-indigo-400 font-medium mt-0.5">
                    <Music className="w-2.5 h-2.5" />
                    <span>{user.currentNote.musicTrack.title}</span>
                  </div>
                )}
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-neutral-100 dark:bg-neutral-800 border-r border-b border-neutral-200 dark:border-neutral-700 rotate-45" />
              </div>
            )}

            <div className="relative">
              <img
                src={user.avatar}
                alt={user.name}
                referrerPolicy="no-referrer"
                className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover ring-4 ring-indigo-500/20 shadow-md"
              />
              {user.isOnline && (
                <span className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-emerald-500 ring-4 ring-white dark:ring-neutral-900" />
              )}
            </div>
          </div>

          {/* User Details & Stats */}
          <div className="flex-1 text-center md:text-left space-y-4">
            <div className="flex flex-col md:flex-row items-center gap-3 md:gap-6">
              <h2 className="text-xl md:text-2xl font-bold text-neutral-900 dark:text-white flex items-center gap-1.5">
                <span>{user.name}</span>
                {user.isVerified && (
                  <span className="w-4 h-4 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px]">
                    ✓
                  </span>
                )}
              </h2>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                {isMe ? (
                  <>
                    <button
                      onClick={onOpenEditProfile}
                      className="px-4 py-2 rounded-xl text-xs font-semibold bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-900 dark:text-white transition-colors flex items-center gap-1.5"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit Profile</span>
                    </button>
                    <button
                      onClick={onOpenCreateNote}
                      className="px-3 py-2 rounded-xl text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 transition-colors"
                    >
                      Note 💭
                    </button>
                    {onLogout && (
                      <button
                        onClick={onLogout}
                        className="px-3.5 py-2 rounded-xl text-xs font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 hover:bg-rose-100 dark:hover:bg-rose-900/40 transition-colors flex items-center gap-1.5 shadow-xs active:scale-95"
                        title="Log Out"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Гарах (Log out)</span>
                      </button>
                    )}
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => setIsFollowing(!isFollowing)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                        isFollowing
                          ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200'
                          : 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-md shadow-indigo-600/20'
                      }`}
                    >
                      {isFollowing ? 'Following' : 'Follow'}
                    </button>

                    <button
                      onClick={() => onOpenMessagesWithUser(user)}
                      className="p-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 text-neutral-700 dark:text-neutral-300 transition-colors"
                      title="Send Message"
                    >
                      <MessageCircle className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => onStartCall(user, 'audio')}
                      className="p-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 text-neutral-700 dark:text-neutral-300 transition-colors"
                      title="Audio Call"
                    >
                      <Phone className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => onStartCall(user, 'video')}
                      className="p-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 text-neutral-700 dark:text-neutral-300 transition-colors"
                      title="Video Call"
                    >
                      <Video className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Counts */}
            <div className="flex items-center justify-center md:justify-start gap-6 text-xs md:text-sm text-neutral-600 dark:text-neutral-300">
              <div>
                <span className="font-bold text-neutral-900 dark:text-white mr-1">
                  {userPosts.length || user.postsCount}
                </span>
                <span>posts</span>
              </div>
              <div>
                <span className="font-bold text-neutral-900 dark:text-white mr-1">
                  {user.followersCount.toLocaleString()}
                </span>
                <span>followers</span>
              </div>
              <div>
                <span className="font-bold text-neutral-900 dark:text-white mr-1">
                  {user.followingCount.toLocaleString()}
                </span>
                <span>following</span>
              </div>
            </div>

            {/* Bio */}
            <div className="text-xs md:text-sm text-neutral-800 dark:text-neutral-200 leading-relaxed max-w-lg">
              <span className="font-semibold block text-neutral-500 text-[11px] mb-0.5">
                @{user.username}
              </span>
              <p>{user.bio || 'Exploring ideas, connections, and creativity.'}</p>
            </div>

            {/* Interests Badges */}
            <div className="pt-2">
              <div className="flex items-center justify-between mb-1.5 max-w-sm">
                <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
                  Interests & Vibe
                </span>
                {isMe && onOpenEditInterests && (
                  <button
                    onClick={onOpenEditInterests}
                    className="text-[10px] text-indigo-600 dark:text-indigo-400 font-semibold hover:underline flex items-center gap-1"
                  >
                    <SlidersHorizontal className="w-2.5 h-2.5" />
                    <span>Change</span>
                  </button>
                )}
              </div>
              <div className="flex flex-wrap gap-1.5 justify-center md:justify-start">
                {userInterests.map((interestId) => {
                  const interestObj = availableInterests.find((i) => i.id === interestId);
                  if (!interestObj) return null;
                  return (
                    <span
                      key={interestId}
                      className="px-2.5 py-1 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 text-xs font-medium flex items-center gap-1 border border-neutral-200 dark:border-neutral-700/60"
                    >
                      <span>{interestObj.emoji}</span>
                      <span>{interestObj.name}</span>
                    </span>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center justify-center gap-8 border-b border-neutral-200 dark:border-neutral-800 mb-6">
        <button
          onClick={() => setActiveTab('posts')}
          className={`flex items-center gap-2 py-3 text-xs font-bold uppercase tracking-wider transition-colors relative ${
            activeTab === 'posts'
              ? 'text-indigo-600 dark:text-indigo-400'
              : 'text-neutral-400 hover:text-neutral-700'
          }`}
        >
          <Grid className="w-4 h-4" />
          <span>Posts</span>
          {activeTab === 'posts' && (
            <span className="absolute bottom-0 inset-x-0 h-0.5 bg-indigo-600 dark:bg-indigo-400" />
          )}
        </button>

        {isMe && (
          <button
            onClick={() => setActiveTab('saved')}
            className={`flex items-center gap-2 py-3 text-xs font-bold uppercase tracking-wider transition-colors relative ${
              activeTab === 'saved'
                ? 'text-indigo-600 dark:text-indigo-400'
                : 'text-neutral-400 hover:text-neutral-700'
            }`}
          >
            <Bookmark className="w-4 h-4" />
            <span>Saved ({savedPosts.length})</span>
            {activeTab === 'saved' && (
              <span className="absolute bottom-0 inset-x-0 h-0.5 bg-indigo-600 dark:bg-indigo-400" />
            )}
          </button>
        )}

        <button
          onClick={() => setActiveTab('reels')}
          className={`flex items-center gap-2 py-3 text-xs font-bold uppercase tracking-wider transition-colors relative ${
            activeTab === 'reels'
              ? 'text-indigo-600 dark:text-indigo-400'
              : 'text-neutral-400 hover:text-neutral-700'
          }`}
        >
          <Film className="w-4 h-4" />
          <span>Reels</span>
          {activeTab === 'reels' && (
            <span className="absolute bottom-0 inset-x-0 h-0.5 bg-indigo-600 dark:bg-indigo-400" />
          )}
        </button>
      </div>

      {/* Posts Grid */}
      {displayedPosts.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-4">
          {displayedPosts.map((post) => (
            <div
              key={post.id}
              onClick={() => onSelectPost(post)}
              className="aspect-square rounded-2xl overflow-hidden bg-neutral-900 relative group cursor-pointer shadow-sm"
            >
              <img
                src={post.mediaUrl}
                alt="Post thumbnail"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-bold text-xs gap-4">
                <span>❤️ {post.likes}</span>
                <span>💬 {post.comments.length}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 text-neutral-400">
          <p className="text-sm font-semibold">No posts to display in this tab</p>
        </div>
      )}

      {/* Bottom Logout Card if user is viewing their own profile */}
      {isMe && onLogout && (
        <div className="mt-8 p-4 rounded-3xl bg-neutral-100/70 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-neutral-800 dark:text-neutral-200">
              Account Session
            </div>
            <div className="text-[11px] text-neutral-400">
              Signed in as @{user.username}
            </div>
          </div>
          <button
            onClick={onLogout}
            className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 shadow-md shadow-rose-600/20 flex items-center gap-1.5 transition-all active:scale-95"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Бүртгэлээс гарах (Log Out)</span>
          </button>
        </div>
      )}
    </div>
  );
};
