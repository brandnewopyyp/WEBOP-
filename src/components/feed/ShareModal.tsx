import React, { useState } from 'react';
import { X, Send, Copy, Check, Share2, Sparkles } from 'lucide-react';
import { Post, User } from '../../types';

interface ShareModalProps {
  post: Post;
  users: User[];
  onClose: () => void;
  onSendToUser: (recipient: User, post: Post) => void;
  onShareToStory: (post: Post) => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  post,
  users,
  onClose,
  onSendToUser,
  onShareToStory
}) => {
  const [copied, setCopied] = useState(false);
  const [sentUserIds, setSentUserIds] = useState<string[]>([]);

  const handleCopy = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSend = (user: User) => {
    onSendToUser(user, post);
    setSentUserIds((prev) => [...prev, user.id]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-150">
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl p-5 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-base font-bold text-neutral-900 dark:text-white mb-4">
          Share Post
        </h3>

        {/* Share to Story option */}
        <div className="mb-4">
          <button
            onClick={() => {
              onShareToStory(post);
              onClose();
            }}
            className="w-full flex items-center gap-3 p-3 rounded-2xl bg-neutral-100 dark:bg-neutral-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 text-left transition-colors group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-500 to-indigo-600 text-white flex items-center justify-center shadow-sm">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="text-sm font-bold text-neutral-900 dark:text-white block group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                Add post to your story
              </span>
              <span className="text-xs text-neutral-500">
                Visible to followers for 24h
              </span>
            </div>
          </button>
        </div>

        {/* Quick Send to Direct Friends */}
        <div className="mb-4">
          <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider block mb-2">
            Send via Direct Message
          </span>
          <div className="space-y-2 max-h-48 overflow-y-auto no-scrollbar">
            {users
              .filter((u) => u.id !== 'user_me')
              .map((user) => {
                const isSent = sentUserIds.includes(user.id);
                return (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-2 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-800/60 transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <img
                        src={user.avatar}
                        alt={user.name}
                        referrerPolicy="no-referrer"
                        className="w-9 h-9 rounded-full object-cover"
                      />
                      <div className="text-left">
                        <div className="text-xs font-bold text-neutral-900 dark:text-white truncate">
                          {user.name}
                        </div>
                        <div className="text-[11px] text-neutral-500 truncate">
                          @{user.username}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleSend(user)}
                      disabled={isSent}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        isSent
                          ? 'bg-neutral-200 dark:bg-neutral-800 text-neutral-500'
                          : 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-sm'
                      }`}
                    >
                      {isSent ? 'Sent ✓' : 'Send'}
                    </button>
                  </div>
                );
              })}
          </div>
        </div>

        {/* Copy Link button */}
        <button
          onClick={handleCopy}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-xs font-semibold text-neutral-700 dark:text-neutral-300 transition-colors"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-emerald-500" />
              <span>Link Copied to Clipboard!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              <span>Copy Link</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
