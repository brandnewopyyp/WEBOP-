import React, { useState } from 'react';
import { X, Music, Check, Sparkles } from 'lucide-react';
import { Note, User } from '../../types';
import { sampleMusicTracks } from '../../data/mockData';

interface CreateNoteModalProps {
  currentUser: User;
  onClose: () => void;
  onSaveNote: (note: Partial<Note>) => void;
  onDeleteNote?: () => void;
}

export const CreateNoteModal: React.FC<CreateNoteModalProps> = ({
  currentUser,
  onClose,
  onSaveNote,
  onDeleteNote
}) => {
  const [content, setContent] = useState(currentUser.currentNote?.content || '');
  const [moodEmoji, setMoodEmoji] = useState(currentUser.currentNote?.moodEmoji || '✨');
  const [selectedMusic, setSelectedMusic] = useState<{ title: string; artist: string } | null>(
    currentUser.currentNote?.musicTrack || null
  );
  const [showMusicPicker, setShowMusicPicker] = useState(false);
  const [audience, setAudience] = useState<'mutual' | 'close'>('mutual');

  const moodEmojis = ['✨', '🔥', '☕', '🏕️', '💻', '🎧', '⚡', '🌙', '🍕', '🚀'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    onSaveNote({
      content: content.trim().slice(0, 60),
      moodEmoji,
      musicTrack: selectedMusic || undefined,
      createdAt: 'Just now'
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-150">
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <h3 className="text-lg font-bold text-neutral-900 dark:text-white">
            {currentUser.currentNote ? 'Edit your note' : 'Share a thought'}
          </h3>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            Your note is visible to mutual connections for 24 hours.
          </p>
        </div>

        {/* Live Note Preview Bubble */}
        <div className="flex flex-col items-center justify-center my-4">
          <div className="relative mb-2">
            <div className="px-4 py-2.5 rounded-2xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 shadow-sm min-w-[120px] max-w-xs text-center text-sm font-semibold text-neutral-900 dark:text-white">
              {moodEmoji && <span className="mr-1.5">{moodEmoji}</span>}
              {content.trim() ? content : 'Share what’s on your mind...'}
              {selectedMusic && (
                <div className="flex items-center justify-center gap-1 text-[11px] text-indigo-600 dark:text-indigo-400 mt-1 font-medium">
                  <Music className="w-3 h-3 animate-spin" />
                  <span>{selectedMusic.title} · {selectedMusic.artist}</span>
                </div>
              )}
            </div>
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-neutral-100 dark:bg-neutral-800 border-r border-b border-neutral-200 dark:border-neutral-700 rotate-45" />
          </div>

          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            referrerPolicy="no-referrer"
            className="w-16 h-16 rounded-full object-cover ring-2 ring-indigo-500/30"
          />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Note Input */}
          <div>
            <div className="relative">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value.slice(0, 60))}
                rows={2}
                placeholder="Share a thought..."
                className="w-full px-4 py-3 rounded-2xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-neutral-900 dark:text-white resize-none"
              />
              <span className="absolute bottom-2.5 right-3 text-[11px] font-mono text-neutral-400">
                {content.length}/60
              </span>
            </div>
          </div>

          {/* Quick Mood Emojis */}
          <div>
            <label className="block text-xs font-semibold text-neutral-500 dark:text-neutral-400 mb-1.5">
              Mood / Vibe
            </label>
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
              {moodEmojis.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => setMoodEmoji(emoji)}
                  className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg transition-all ${
                    moodEmoji === emoji
                      ? 'bg-indigo-600 text-white shadow-sm scale-105'
                      : 'bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-800'
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          {/* Music Track selector */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 flex items-center gap-1.5">
                <Music className="w-3.5 h-3.5 text-indigo-500" />
                <span>Soundtrack</span>
              </label>
              {selectedMusic && (
                <button
                  type="button"
                  onClick={() => setSelectedMusic(null)}
                  className="text-[11px] text-rose-500 hover:underline"
                >
                  Remove
                </button>
              )}
            </div>

            {!showMusicPicker && !selectedMusic && (
              <button
                type="button"
                onClick={() => setShowMusicPicker(true)}
                className="w-full py-2.5 px-3 rounded-xl border border-dashed border-neutral-300 dark:border-neutral-700 hover:border-indigo-500 text-xs font-medium text-neutral-600 dark:text-neutral-400 flex items-center justify-center gap-2 hover:bg-neutral-50 dark:hover:bg-neutral-800/60 transition-colors"
              >
                <Music className="w-4 h-4 text-indigo-500" />
                <span>Add a 30s song clip</span>
              </button>
            )}

            {(showMusicPicker || selectedMusic) && (
              <div className="p-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 max-h-36 overflow-y-auto space-y-1">
                {sampleMusicTracks.map((track) => {
                  const isSelected =
                    selectedMusic?.title === track.title && selectedMusic?.artist === track.artist;
                  return (
                    <button
                      key={track.title}
                      type="button"
                      onClick={() => {
                        setSelectedMusic(track);
                        setShowMusicPicker(false);
                      }}
                      className={`w-full flex items-center justify-between p-2 rounded-lg text-left text-xs transition-colors ${
                        isSelected
                          ? 'bg-indigo-600 text-white font-semibold'
                          : 'hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200'
                      }`}
                    >
                      <div className="truncate">
                        <div>{track.title}</div>
                        <div className={`text-[10px] ${isSelected ? 'text-indigo-100' : 'text-neutral-500'}`}>
                          {track.artist}
                        </div>
                      </div>
                      {isSelected && <Check className="w-3.5 h-3.5" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Share Audience */}
          <div className="flex items-center gap-2 pt-1 text-xs">
            <button
              type="button"
              onClick={() => setAudience('mutual')}
              className={`flex-1 py-2 px-3 rounded-xl border text-center font-medium transition-all ${
                audience === 'mutual'
                  ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300'
                  : 'border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400'
              }`}
            >
              Mutual Followers
            </button>
            <button
              type="button"
              onClick={() => setAudience('close')}
              className={`flex-1 py-2 px-3 rounded-xl border text-center font-medium transition-all ${
                audience === 'close'
                  ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300'
                  : 'border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400'
              }`}
            >
              Close Friends ⭐️
            </button>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 pt-2">
            {currentUser.currentNote && onDeleteNote && (
              <button
                type="button"
                onClick={() => {
                  onDeleteNote();
                  onClose();
                }}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
              >
                Delete Note
              </button>
            )}
            <button
              type="submit"
              disabled={!content.trim()}
              className="flex-1 py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 active:scale-[0.98] disabled:opacity-40 transition-all shadow-md shadow-indigo-600/20"
            >
              Share Note
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
