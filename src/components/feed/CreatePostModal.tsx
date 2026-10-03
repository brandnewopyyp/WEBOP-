import React, { useState } from 'react';
import { X, Image as ImageIcon, MapPin, Smile, Globe, Users, Check } from 'lucide-react';
import { Post, User } from '../../types';

interface CreatePostModalProps {
  currentUser: User;
  onClose: () => void;
  onSubmitPost: (postData: {
    content: string;
    mediaUrl?: string;
    location?: string;
    feeling?: string;
  }) => void;
}

const sampleImagePresets = [
  { label: 'Alpine Glacial Peak', url: '/src/assets/images/post_nature_travel_1791047655275.jpg' },
  { label: 'Café & Pastry', url: '/src/assets/images/post_cozy_cafe_1791047666157.jpg' },
  { label: 'Minimal Architecture', url: '/src/assets/images/post_modern_architecture_1791047678225.jpg' },
  { label: 'Editorial Fashion', url: '/src/assets/images/post_portrait_lifestyle_1791047689447.jpg' }
];

export const CreatePostModal: React.FC<CreatePostModalProps> = ({
  currentUser,
  onClose,
  onSubmitPost
}) => {
  const [content, setContent] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(sampleImagePresets[0].url);
  const [location, setLocation] = useState('');
  const [feeling, setFeeling] = useState('');
  const [audience, setAudience] = useState<'public' | 'friends'>('public');
  const [showLocationInput, setShowLocationInput] = useState(false);
  const [showFeelingSelector, setShowFeelingSelector] = useState(false);

  const feelings = [
    'feeling inspired ✨',
    'feeling blessed 🙏',
    'feeling excited 🚀',
    'feeling happy 😊',
    'traveling to ✈️',
    'drinking coffee ☕'
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setSelectedImage(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() && !selectedImage) return;

    onSubmitPost({
      content: content.trim(),
      mediaUrl: selectedImage || undefined,
      location: location.trim() || undefined,
      feeling: feeling || undefined
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-150">
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl p-6 relative max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
          <h3 className="text-base font-bold text-neutral-900 dark:text-white">
            Create New Post
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto py-4 space-y-4 no-scrollbar">
          {/* User Info & Audience Selector */}
          <div className="flex items-center gap-3">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              referrerPolicy="no-referrer"
              className="w-11 h-11 rounded-full object-cover"
            />
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-bold text-neutral-900 dark:text-white">
                  {currentUser.name}
                </span>
                {feeling && (
                  <span className="text-xs text-neutral-500">
                    is {feeling}
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={() => setAudience(audience === 'public' ? 'friends' : 'public')}
                className="inline-flex items-center gap-1 px-2 py-0.5 mt-0.5 rounded-md bg-neutral-100 dark:bg-neutral-800 text-[11px] font-semibold text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200"
              >
                {audience === 'public' ? (
                  <>
                    <Globe className="w-3 h-3" />
                    <span>Public</span>
                  </>
                ) : (
                  <>
                    <Users className="w-3 h-3" />
                    <span>Friends Only</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Caption Input */}
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={3}
            placeholder={`What's on your mind, ${currentUser.name.split(' ')[0]}?`}
            className="w-full text-sm bg-transparent border-none text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none resize-none"
          />

          {/* Location Bar if enabled */}
          {showLocationInput && (
            <div className="flex items-center gap-2 px-3 py-2 bg-neutral-100 dark:bg-neutral-800 rounded-xl">
              <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Add location (e.g. Ulaanbaatar, Altai Lake)..."
                className="w-full text-xs bg-transparent border-none text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => {
                  setLocation('');
                  setShowLocationInput(false);
                }}
              >
                <X className="w-4 h-4 text-neutral-400" />
              </button>
            </div>
          )}

          {/* Feeling Selector if enabled */}
          {showFeelingSelector && (
            <div className="p-3 bg-neutral-100 dark:bg-neutral-800 rounded-xl space-y-2">
              <span className="text-xs font-semibold text-neutral-500">How are you feeling?</span>
              <div className="flex flex-wrap gap-1.5">
                {feelings.map((f) => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => {
                      setFeeling(f);
                      setShowFeelingSelector(false);
                    }}
                    className="px-2.5 py-1 text-xs rounded-lg bg-white dark:bg-neutral-700 text-neutral-800 dark:text-neutral-200 hover:bg-indigo-50"
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Image Preview & Selector */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                Photo attachment
              </label>
              {selectedImage && (
                <button
                  type="button"
                  onClick={() => setSelectedImage(null)}
                  className="text-xs text-rose-500 hover:underline"
                >
                  Remove Photo
                </button>
              )}
            </div>

            {selectedImage ? (
              <div className="relative rounded-2xl overflow-hidden border border-neutral-200 dark:border-neutral-800 aspect-video max-h-60">
                <img
                  src={selectedImage}
                  alt="Post preview"
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="grid grid-cols-4 gap-2">
                {sampleImagePresets.map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => setSelectedImage(preset.url)}
                    className="aspect-square rounded-xl overflow-hidden border border-neutral-200 dark:border-neutral-700 hover:opacity-80 transition-opacity relative group"
                  >
                    <img
                      src={preset.url}
                      alt={preset.label}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white text-[10px] font-bold p-1 text-center">
                      {preset.label}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Quick Action Additions */}
          <div className="flex items-center justify-between p-3 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/40">
            <span className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
              Add to your post
            </span>

            <div className="flex items-center gap-1">
              <label
                className="p-2 text-emerald-500 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-full cursor-pointer transition-colors"
                title="Photo/Video"
              >
                <ImageIcon className="w-5 h-5" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>

              <button
                type="button"
                onClick={() => setShowLocationInput(!showLocationInput)}
                className="p-2 text-rose-500 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-full transition-colors"
                title="Location"
              >
                <MapPin className="w-5 h-5" />
              </button>

              <button
                type="button"
                onClick={() => setShowFeelingSelector(!showFeelingSelector)}
                className="p-2 text-amber-500 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-full transition-colors"
                title="Feeling / Activity"
              >
                <Smile className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Submit CTA */}
          <button
            type="submit"
            disabled={!content.trim() && !selectedImage}
            className="w-full py-3 px-4 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-indigo-600 to-rose-600 hover:from-indigo-500 hover:to-rose-500 active:scale-[0.98] disabled:opacity-40 transition-all shadow-md shadow-indigo-600/20"
          >
            Post to webop
          </button>
        </form>
      </div>
    </div>
  );
};
