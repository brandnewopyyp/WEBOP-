import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Send, Heart } from 'lucide-react';
import { Story, User } from '../../types';
import { playPopSound } from '../../utils/soundEffects';

interface StoryViewerModalProps {
  stories: Story[];
  initialStoryId: string;
  onClose: () => void;
  onSendStoryReply: (author: User, replyText: string) => void;
}

export const StoryViewerModal: React.FC<StoryViewerModalProps> = ({
  stories,
  initialStoryId,
  onClose,
  onSendStoryReply
}) => {
  const [currentIndex, setCurrentIndex] = useState(() => {
    const idx = stories.findIndex((s) => s.id === initialStoryId);
    return idx !== -1 ? idx : 0;
  });
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [liked, setLiked] = useState(false);

  const currentStory = stories[currentIndex];

  // Story progress timer (5 seconds per slide)
  useEffect(() => {
    setProgress(0);
    setLiked(false);
  }, [currentIndex]);

  useEffect(() => {
    if (isPaused) return;

    const interval = window.setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          if (currentIndex < stories.length - 1) {
            setCurrentIndex((c) => c + 1);
            return 0;
          } else {
            onClose();
            return 100;
          }
        }
        return prev + 2;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [currentIndex, isPaused, stories.length, onClose]);

  const handlePrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (currentIndex > 0) {
      setCurrentIndex((c) => c - 1);
    }
  };

  const handleNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (currentIndex < stories.length - 1) {
      setCurrentIndex((c) => c + 1);
    } else {
      onClose();
    }
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    onSendStoryReply(currentStory.author, replyText.trim());
    setReplyText('');
    playPopSound();
  };

  const handleReaction = (emoji: string) => {
    playPopSound();
    onSendStoryReply(currentStory.author, emoji);
  };

  if (!currentStory) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center select-none">
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-50 p-2 text-white/80 hover:text-white bg-black/40 hover:bg-black/60 rounded-full transition-colors"
        aria-label="Close stories"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Nav Chevrons for Desktop */}
      {currentIndex > 0 && (
        <button
          onClick={handlePrev}
          className="hidden md:flex absolute left-8 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm transition-all"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
      )}

      {currentIndex < stories.length - 1 && (
        <button
          onClick={handleNext}
          className="hidden md:flex absolute right-8 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm transition-all"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      )}

      {/* Phone/Story Container */}
      <div
        className="w-full h-full md:h-[90vh] md:max-w-md md:rounded-3xl overflow-hidden relative bg-neutral-950 flex flex-col justify-between shadow-2xl"
        onMouseDown={() => setIsPaused(true)}
        onMouseUp={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
      >
        {/* Progress Bar Segments */}
        <div className="absolute top-3 left-3 right-3 z-30 flex items-center gap-1.5">
          {stories.map((s, idx) => (
            <div
              key={s.id}
              className="flex-1 h-1 rounded-full bg-white/30 overflow-hidden"
            >
              <div
                className="h-full bg-white transition-all ease-linear"
                style={{
                  width:
                    idx < currentIndex
                      ? '100%'
                      : idx === currentIndex
                      ? `${progress}%`
                      : '0%'
                }}
              />
            </div>
          ))}
        </div>

        {/* Story Author Header */}
        <div className="absolute top-7 left-4 right-4 z-30 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <img
              src={currentStory.author.avatar}
              alt={currentStory.author.name}
              referrerPolicy="no-referrer"
              className="w-9 h-9 rounded-full object-cover ring-2 ring-white/60"
            />
            <div>
              <span className="text-sm font-bold text-white leading-tight drop-shadow-md">
                {currentStory.author.name}
              </span>
              <span className="text-[11px] text-white/80 block drop-shadow-md">
                {currentStory.createdAt}
              </span>
            </div>
          </div>
        </div>

        {/* Story Visual Media */}
        <div className="w-full h-full relative">
          <img
            src={currentStory.mediaUrl}
            alt={currentStory.caption || 'Story'}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />

          {/* Gradient Scrim */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 pointer-events-none" />

          {/* Tap Areas for previous/next */}
          <div
            className="absolute inset-y-0 left-0 w-1/3 cursor-pointer"
            onClick={handlePrev}
          />
          <div
            className="absolute inset-y-0 right-0 w-2/3 cursor-pointer"
            onClick={handleNext}
          />

          {/* Caption */}
          {currentStory.caption && (
            <div className="absolute bottom-24 left-4 right-4 z-20">
              <p className="text-sm md:text-base font-semibold text-white drop-shadow-lg bg-black/30 backdrop-blur-md p-3 rounded-2xl border border-white/10">
                {currentStory.caption}
              </p>
            </div>
          )}
        </div>

        {/* Bottom Reaction & Message Bar */}
        <div className="absolute bottom-0 left-0 right-0 z-30 p-4 bg-gradient-to-t from-black via-black/80 to-transparent">
          <div className="flex items-center gap-2 mb-2 justify-center">
            {['🔥', '❤️', '😂', '😮', '👏'].map((emoji) => (
              <button
                key={emoji}
                onClick={() => handleReaction(emoji)}
                className="w-9 h-9 rounded-full bg-white/15 hover:bg-white/30 text-white backdrop-blur-sm text-lg flex items-center justify-center active:scale-90 transition-transform"
              >
                {emoji}
              </button>
            ))}
          </div>

          <form onSubmit={handleSendReply} className="flex items-center gap-2">
            <input
              type="text"
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder={`Send message to ${currentStory.author.name.split(' ')[0]}...`}
              className="flex-1 px-4 py-2.5 rounded-full bg-white/15 border border-white/20 text-xs text-white placeholder:text-white/60 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-white"
            />

            <button
              type="button"
              onClick={() => {
                setLiked(!liked);
                playPopSound();
              }}
              className="p-2.5 rounded-full bg-white/15 text-white backdrop-blur-sm transition-transform active:scale-90"
            >
              <Heart className={`w-5 h-5 ${liked ? 'fill-rose-500 text-rose-500' : ''}`} />
            </button>

            {replyText.trim() && (
              <button
                type="submit"
                className="p-2.5 rounded-full bg-indigo-600 text-white transition-transform active:scale-90"
              >
                <Send className="w-4 h-4" />
              </button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};
