import React, { useState } from 'react';
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  Volume2,
  VolumeX,
  Music,
  ChevronUp,
  ChevronDown,
  Sparkles
} from 'lucide-react';
import { Post, User } from '../../types';
import { playPopSound } from '../../utils/soundEffects';

interface ReelsViewProps {
  posts: Post[];
  currentUser: User;
  onLikeToggle: (postId: string) => void;
  onOpenShareModal: (post: Post) => void;
  onAuthorClick: (user: User) => void;
}

export const ReelsView: React.FC<ReelsViewProps> = ({
  posts,
  currentUser,
  onLikeToggle,
  onOpenShareModal,
  onAuthorClick
}) => {
  const [activeReelIndex, setActiveReelIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [showCommentsDrawer, setShowCommentsDrawer] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState<{ [postId: string]: string[] }>({});

  const currentReel = posts[activeReelIndex] || posts[0];

  const handleNext = () => {
    if (activeReelIndex < posts.length - 1) {
      setActiveReelIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (activeReelIndex > 0) {
      setActiveReelIndex((prev) => prev - 1);
    }
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    setComments((prev) => ({
      ...prev,
      [currentReel.id]: [...(prev[currentReel.id] || []), commentText.trim()]
    }));
    setCommentText('');
    playPopSound();
  };

  if (!currentReel) return null;

  return (
    <div className="flex-1 min-h-[calc(100vh-3.5rem)] md:min-h-screen flex items-center justify-center p-0 md:p-6 bg-neutral-950 text-white select-none relative">
      {/* Up / Down navigation triggers on desktop */}
      <div className="hidden md:flex flex-col gap-3 absolute right-12 top-1/2 -translate-y-1/2 z-30">
        <button
          onClick={handlePrev}
          disabled={activeReelIndex === 0}
          className="p-3 rounded-full bg-neutral-800/80 hover:bg-neutral-700 text-white disabled:opacity-20 transition-all"
        >
          <ChevronUp className="w-5 h-5" />
        </button>
        <button
          onClick={handleNext}
          disabled={activeReelIndex === posts.length - 1}
          className="p-3 rounded-full bg-neutral-800/80 hover:bg-neutral-700 text-white disabled:opacity-20 transition-all"
        >
          <ChevronDown className="w-5 h-5" />
        </button>
      </div>

      {/* Main Reel Vertical Phone Frame */}
      <div className="w-full h-[calc(100vh-3.5rem)] md:h-[85vh] md:max-w-sm rounded-none md:rounded-3xl overflow-hidden relative shadow-2xl bg-neutral-900 flex flex-col justify-between">
        {/* Media Background */}
        <div className="absolute inset-0 z-0">
          <img
            src={currentReel.mediaUrl}
            alt="Reel visual"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/80" />
        </div>

        {/* Top Header */}
        <div className="relative z-10 flex items-center justify-between p-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-rose-500" />
            <span className="text-xs font-bold uppercase tracking-wider text-white">
              webop Reels
            </span>
          </div>

          <button
            onClick={() => setIsMuted(!isMuted)}
            className="p-2 rounded-full bg-black/40 hover:bg-black/60 text-white transition-colors"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>

        {/* Bottom Content & Creator Info */}
        <div className="relative z-10 p-4 pb-6 flex items-end justify-between gap-4">
          {/* Left: Creator Info, Caption, Audio */}
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2.5">
              <img
                src={currentReel.author.avatar}
                alt={currentReel.author.name}
                referrerPolicy="no-referrer"
                onClick={() => onAuthorClick(currentReel.author)}
                className="w-9 h-9 rounded-full object-cover ring-2 ring-white/60 cursor-pointer"
              />
              <span
                onClick={() => onAuthorClick(currentReel.author)}
                className="text-sm font-bold text-white hover:underline cursor-pointer"
              >
                {currentReel.author.username}
              </span>
              <button className="px-3 py-1 rounded-lg bg-white/20 hover:bg-white/30 text-xs font-semibold backdrop-blur-sm transition-colors">
                Follow
              </button>
            </div>

            <p className="text-xs md:text-sm text-neutral-200 line-clamp-2 leading-relaxed">
              {currentReel.content}
            </p>

            {/* Audio Track Tag with Spinning Disc */}
            <div className="flex items-center gap-2 text-xs text-neutral-300">
              <Music className="w-3.5 h-3.5" />
              <span className="truncate">Original Audio · {currentReel.author.name}</span>
              <div className="w-5 h-5 rounded-full border border-white/40 flex items-center justify-center animate-spin ml-1 shrink-0">
                <div className="w-1.5 h-1.5 rounded-full bg-white" />
              </div>
            </div>
          </div>

          {/* Right: Vertical Interaction Column */}
          <div className="flex flex-col items-center gap-4 shrink-0">
            {/* Like */}
            <button
              onClick={() => {
                onLikeToggle(currentReel.id);
                playPopSound();
              }}
              className="flex flex-col items-center gap-1 group"
            >
              <div
                className={`p-2.5 rounded-full bg-black/40 group-hover:bg-black/60 backdrop-blur-md transition-all ${
                  currentReel.isLiked ? 'text-rose-500 scale-110' : 'text-white'
                }`}
              >
                <Heart className={`w-6 h-6 ${currentReel.isLiked ? 'fill-rose-500' : ''}`} />
              </div>
              <span className="text-[11px] font-bold text-white">
                {currentReel.likes}
              </span>
            </button>

            {/* Comments */}
            <button
              onClick={() => setShowCommentsDrawer(!showCommentsDrawer)}
              className="flex flex-col items-center gap-1 group"
            >
              <div className="p-2.5 rounded-full bg-black/40 group-hover:bg-black/60 backdrop-blur-md transition-all text-white">
                <MessageCircle className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-bold text-white">
                {currentReel.comments.length + (comments[currentReel.id]?.length || 0)}
              </span>
            </button>

            {/* Share */}
            <button
              onClick={() => onOpenShareModal(currentReel)}
              className="flex flex-col items-center gap-1 group"
            >
              <div className="p-2.5 rounded-full bg-black/40 group-hover:bg-black/60 backdrop-blur-md transition-all text-white">
                <Share2 className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-bold text-white">Share</span>
            </button>
          </div>
        </div>

        {/* Sliding Comments Drawer */}
        {showCommentsDrawer && (
          <div className="absolute inset-x-0 bottom-0 top-1/3 z-30 bg-neutral-900/95 backdrop-blur-xl rounded-t-3xl border-t border-neutral-800 p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
              <span className="text-xs font-bold">Comments</span>
              <button
                onClick={() => setShowCommentsDrawer(false)}
                className="text-xs text-neutral-400 hover:text-white"
              >
                Done
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-2 space-y-2">
              {currentReel.comments.map((c) => (
                <div key={c.id} className="text-xs">
                  <span className="font-bold mr-1.5">{c.author.username}</span>
                  <span className="text-neutral-300">{c.content}</span>
                </div>
              ))}
              {(comments[currentReel.id] || []).map((text, idx) => (
                <div key={idx} className="text-xs">
                  <span className="font-bold mr-1.5">@{currentUser.username}</span>
                  <span className="text-neutral-300">{text}</span>
                </div>
              ))}
            </div>

            <form onSubmit={handleAddComment} className="pt-2 border-t border-neutral-800 flex gap-2">
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Add a comment..."
                className="flex-1 px-3 py-1.5 rounded-full bg-neutral-800 text-xs text-white placeholder:text-neutral-500 focus:outline-none"
              />
              <button
                type="submit"
                disabled={!commentText.trim()}
                className="px-3 py-1.5 rounded-full bg-indigo-600 text-xs font-bold disabled:opacity-40"
              >
                Post
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
