import React, { useState } from 'react';
import { X, Check, Heart, Sparkles } from 'lucide-react';
import { availableInterests } from '../../data/mockData';

interface EditInterestsModalProps {
  currentInterests: string[];
  onClose: () => void;
  onSaveInterests: (selected: string[]) => void;
}

export const EditInterestsModal: React.FC<EditInterestsModalProps> = ({
  currentInterests,
  onClose,
  onSaveInterests
}) => {
  const [selected, setSelected] = useState<string[]>(currentInterests || ['photography']);

  const toggle = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleSave = () => {
    if (selected.length === 0) return;
    onSaveInterests(selected);
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

        <div className="text-left mb-4">
          <h3 className="text-lg font-bold text-neutral-900 dark:text-white flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-indigo-500" />
            <span>Customize Your Interests</span>
          </h3>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            Your feed and recommendations will adapt to these categories.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2.5 max-h-72 overflow-y-auto no-scrollbar py-2">
          {availableInterests.map((interest) => {
            const isSelected = selected.includes(interest.id);
            return (
              <button
                key={interest.id}
                type="button"
                onClick={() => toggle(interest.id)}
                className={`p-3 rounded-2xl border text-left transition-all ${
                  isSelected
                    ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-950 dark:text-indigo-200 shadow-sm'
                    : 'border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/40 text-neutral-800 dark:text-neutral-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xl">{interest.emoji}</span>
                  {isSelected ? (
                    <div className="w-4 h-4 rounded-full bg-indigo-600 text-white flex items-center justify-center">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                  ) : (
                    <div className="w-4 h-4 rounded-full border border-neutral-300 dark:border-neutral-700" />
                  )}
                </div>
                <div className="text-xs font-bold">{interest.name}</div>
              </button>
            );
          })}
        </div>

        <div className="flex items-center justify-between pt-4 mt-2 border-t border-neutral-100 dark:border-neutral-800">
          <span className="text-xs text-neutral-400">{selected.length} selected</span>
          <button
            onClick={handleSave}
            disabled={selected.length === 0}
            className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 transition-all shadow-md shadow-indigo-600/20"
          >
            Update Feed Preferences
          </button>
        </div>
      </div>
    </div>
  );
};
