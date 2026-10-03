import React, { useState } from 'react';
import { Plus, Music, Send, X } from 'lucide-react';
import { User, Note } from '../../types';

interface NotesBarProps {
  currentUser: User;
  users: User[];
  onOpenCreateNote: () => void;
  onReplyToNote: (recipient: User, replyText: string) => void;
}

export const NotesBar: React.FC<NotesBarProps> = ({
  currentUser,
  users,
  onOpenCreateNote,
  onReplyToNote
}) => {
  const [selectedNoteUser, setSelectedNoteUser] = useState<User | null>(null);
  const [replyInput, setReplyInput] = useState('');

  const usersWithNotes = users.filter((u) => u.currentNote);

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyInput.trim() || !selectedNoteUser) return;
    onReplyToNote(selectedNoteUser, replyInput.trim());
    setReplyInput('');
    setSelectedNoteUser(null);
  };

  return (
    <div className="w-full bg-white dark:bg-neutral-900 border-b border-neutral-200/80 dark:border-neutral-800/80 px-4 py-3">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
            Notes
          </span>
          <span className="text-[11px] text-neutral-400 dark:text-neutral-500">
            · Disappears in 24 hours
          </span>
        </div>
        <button
          onClick={onOpenCreateNote}
          className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 hover:underline"
        >
          {currentUser.currentNote ? 'Update Note' : '+ Share Note'}
        </button>
      </div>

      {/* Horizontal Carousel */}
      <div className="flex items-start gap-4 overflow-x-auto no-scrollbar py-2">
        {/* Current User Note Slot */}
        <div className="flex flex-col items-center shrink-0 w-20 relative">
          {/* Note Bubble */}
          <div
            onClick={onOpenCreateNote}
            className="cursor-pointer mb-2 px-2.5 py-1.5 rounded-2xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 shadow-sm hover:shadow transition-all hover:scale-105 max-w-[84px] text-center relative group"
          >
            {currentUser.currentNote ? (
              <div className="text-[11px] leading-tight text-neutral-800 dark:text-neutral-200 font-medium truncate">
                {currentUser.currentNote.moodEmoji && (
                  <span className="mr-0.5">{currentUser.currentNote.moodEmoji}</span>
                )}
                {currentUser.currentNote.content}
              </div>
            ) : (
              <div className="text-[10px] text-neutral-500 dark:text-neutral-400 font-medium leading-tight">
                Share a note...
              </div>
            )}

            {/* Bubble Tail */}
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-neutral-100 dark:bg-neutral-800 border-r border-b border-neutral-200 dark:border-neutral-700 rotate-45" />
          </div>

          {/* User Avatar with Plus badge */}
          <div className="relative cursor-pointer" onClick={onOpenCreateNote}>
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              referrerPolicy="no-referrer"
              className="w-14 h-14 rounded-full object-cover ring-2 ring-neutral-200 dark:ring-neutral-700"
            />
            <div className="absolute bottom-0 right-0 w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-md ring-2 ring-white dark:ring-neutral-900">
              <Plus className="w-3 h-3 stroke-[3]" />
            </div>
          </div>
          <span className="text-[11px] font-medium text-neutral-600 dark:text-neutral-400 mt-1 truncate max-w-full">
            Your note
          </span>
        </div>

        {/* Friends' Notes */}
        {usersWithNotes
          .filter((u) => u.id !== currentUser.id)
          .map((friend) => {
            const note = friend.currentNote!;
            return (
              <div
                key={friend.id}
                onClick={() => setSelectedNoteUser(friend)}
                className="flex flex-col items-center shrink-0 w-20 relative cursor-pointer group"
              >
                {/* Note Bubble */}
                <div className="mb-2 px-2.5 py-1.5 rounded-2xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 shadow-sm group-hover:shadow-md transition-all group-hover:-translate-y-0.5 max-w-[86px] text-center relative">
                  <div className="text-[11px] leading-tight text-neutral-900 dark:text-neutral-100 font-medium line-clamp-2">
                    {note.moodEmoji && <span className="mr-0.5">{note.moodEmoji}</span>}
                    {note.content}
                  </div>
                  {note.musicTrack && (
                    <div className="flex items-center justify-center gap-0.5 text-[9px] text-indigo-600 dark:text-indigo-400 mt-0.5 truncate font-semibold">
                      <Music className="w-2.5 h-2.5 shrink-0" />
                      <span className="truncate">{note.musicTrack.title}</span>
                    </div>
                  )}
                  {/* Bubble Tail */}
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-white dark:bg-neutral-800 border-r border-b border-neutral-200 dark:border-neutral-700 rotate-45" />
                </div>

                {/* Avatar with Online indicator */}
                <div className="relative">
                  <img
                    src={friend.avatar}
                    alt={friend.name}
                    referrerPolicy="no-referrer"
                    className="w-14 h-14 rounded-full object-cover ring-2 ring-indigo-500/20 group-hover:ring-indigo-500 transition-all"
                  />
                  {friend.isOnline && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-neutral-900" />
                  )}
                </div>

                <span className="text-[11px] font-medium text-neutral-700 dark:text-neutral-300 mt-1 truncate max-w-full">
                  {friend.name.split(' ')[0]}
                </span>
              </div>
            );
          })}
      </div>

      {/* Note Reply Modal */}
      {selectedNoteUser && selectedNoteUser.currentNote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-150">
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl p-6 relative">
            <button
              onClick={() => setSelectedNoteUser(null)}
              className="absolute top-4 right-4 p-1.5 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Note Header & Bubble */}
            <div className="flex flex-col items-center text-center mt-2 mb-6">
              <div className="relative mb-3">
                <div className="px-4 py-2.5 rounded-3xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 shadow-sm text-sm font-semibold text-neutral-900 dark:text-white max-w-xs">
                  {selectedNoteUser.currentNote.moodEmoji && (
                    <span className="mr-1.5 text-base">
                      {selectedNoteUser.currentNote.moodEmoji}
                    </span>
                  )}
                  {selectedNoteUser.currentNote.content}
                </div>
                {selectedNoteUser.currentNote.musicTrack && (
                  <div className="flex items-center justify-center gap-1.5 text-xs text-indigo-600 dark:text-indigo-400 font-medium mt-2">
                    <Music className="w-3.5 h-3.5 animate-bounce" />
                    <span>
                      {selectedNoteUser.currentNote.musicTrack.title} ·{' '}
                      {selectedNoteUser.currentNote.musicTrack.artist}
                    </span>
                  </div>
                )}
                <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-neutral-100 dark:bg-neutral-800 border-r border-b border-neutral-200 dark:border-neutral-700 rotate-45" />
              </div>

              <img
                src={selectedNoteUser.avatar}
                alt={selectedNoteUser.name}
                referrerPolicy="no-referrer"
                className="w-16 h-16 rounded-full object-cover ring-4 ring-neutral-100 dark:ring-neutral-800 mt-2"
              />
              <h4 className="font-bold text-base text-neutral-900 dark:text-white mt-2">
                {selectedNoteUser.name}
              </h4>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                @{selectedNoteUser.username} · {selectedNoteUser.currentNote.createdAt}
              </p>
            </div>

            {/* Reply Input Form */}
            <form onSubmit={handleSendReply} className="space-y-3">
              <div className="relative">
                <input
                  type="text"
                  value={replyInput}
                  onChange={(e) => setReplyInput(e.target.value)}
                  placeholder={`Reply to ${selectedNoteUser.name.split(' ')[0]}...`}
                  autoFocus
                  className="w-full px-4 py-3 pr-11 rounded-2xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-neutral-900 dark:text-white placeholder:text-neutral-400"
                />
                <button
                  type="submit"
                  disabled={!replyInput.trim()}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-2 rounded-xl text-indigo-600 dark:text-indigo-400 disabled:opacity-30 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
              <div className="flex justify-center gap-2 pt-1">
                {['❤️', '🔥', '😂', '🙌', '✨'].map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => {
                      onReplyToNote(selectedNoteUser, emoji);
                      setSelectedNoteUser(null);
                    }}
                    className="w-9 h-9 rounded-full bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 flex items-center justify-center text-lg active:scale-90 transition-transform"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
