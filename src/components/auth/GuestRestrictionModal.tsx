import React from 'react';
import { Lock, Sparkles, X, LogIn, Eye } from 'lucide-react';

interface GuestRestrictionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAuth: () => void;
  actionName?: string;
}

export const GuestRestrictionModal: React.FC<GuestRestrictionModalProps> = ({
  isOpen,
  onClose,
  onOpenAuth,
  actionName = 'энэ үйлдлийг хийх'
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4 animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 rounded-3xl w-full max-w-[380px] p-6 text-center shadow-2xl relative animate-in zoom-in-95 duration-150">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Lock Icon */}
        <div className="w-14 h-14 rounded-2xl bg-amber-500/10 dark:bg-amber-500/20 text-amber-500 flex items-center justify-center mx-auto mb-4 ring-8 ring-amber-500/5">
          <Lock className="w-7 h-7" />
        </div>

        <h3 className="text-lg font-black text-neutral-900 dark:text-white mb-2 font-display">
          Зочин горимын хязгаарлалт
        </h3>

        <div className="p-3 rounded-2xl bg-neutral-100 dark:bg-neutral-800/60 border border-neutral-200/60 dark:border-neutral-700/60 text-xs text-neutral-700 dark:text-neutral-300 text-left space-y-1.5 mb-5">
          <div className="flex items-center gap-1.5 font-bold text-neutral-900 dark:text-white">
            <Eye className="w-3.5 h-3.5 text-indigo-500" />
            <span>Зөвхөн үзэх эрхтэй (View-only)</span>
          </div>
          <p className="text-[11px] leading-relaxed text-neutral-600 dark:text-neutral-400">
            Та <span className="font-bold text-indigo-600 dark:text-indigo-400">{actionName}</span> оролдлоо. Зочин (Guest) эрхээр зөвхөн пост, reel үзэж, коммент унших боломжтой.
          </p>
        </div>

        <div className="space-y-2">
          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenAuth();
            }}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-rose-600 hover:from-indigo-500 hover:to-rose-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20 active:scale-[0.98] transition-all"
          >
            <LogIn className="w-4 h-4" />
            <span>Бүртгэлээр нэвтрэх</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 px-4 rounded-xl bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-750 text-neutral-700 dark:text-neutral-300 font-semibold text-xs transition-colors"
          >
            Үргэлжлүүлэн зөвхөн үзэх
          </button>
        </div>
      </div>
    </div>
  );
};
