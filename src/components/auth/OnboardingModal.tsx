import React, { useState } from 'react';
import { Sparkles, Check, ArrowRight, ArrowLeft, UserCheck, Heart, Camera, Upload, Trash2, Image as ImageIcon } from 'lucide-react';
import { User, InterestCategory } from '../../types';
import { availableInterests } from '../../data/mockData';

interface OnboardingModalProps {
  initialData: Partial<User>;
  onCompleteOnboarding: (finalUser: User, chosenInterests: string[]) => void;
  onBackToAuth?: () => void;
}

const sampleAvatars = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80'
];

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  initialData,
  onCompleteOnboarding,
  onBackToAuth
}) => {
  const [step, setStep] = useState<1 | 2>(1);

  // Step 1: Username & Profile
  const [username, setUsername] = useState(initialData.username || 'temuujin');
  const [name, setName] = useState(initialData.name || 'Temuujin E.');
  const [bio, setBio] = useState(
    initialData.bio || 'Exploring webop! Passionate about discovery & community 🚀'
  );
  const [avatar, setAvatar] = useState(
    initialData.avatar || sampleAvatars[0]
  );
  const [isCustomPfp, setIsCustomPfp] = useState(false);

  // Step 2: Interests
  const [selectedInterests, setSelectedInterests] = useState<string[]>(['photography', 'travel']);

  const sanitizedUsername = username.toLowerCase().replace(/[^a-z0-9_.]/g, '');
  const isUsernameValid = sanitizedUsername.length >= 3;

  const handleCustomPfpUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setAvatar(event.target.result as string);
          setIsCustomPfp(true);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleInterest = (id: string) => {
    setSelectedInterests((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isUsernameValid) return;
    setStep(2);
  };

  const handleFinish = () => {
    const fullUser: User = {
      id: initialData.id || `user_${Date.now()}`,
      name: name.trim() || sanitizedUsername,
      username: sanitizedUsername,
      avatar,
      bio: bio.trim(),
      email: initialData.email,
      provider: initialData.provider,
      interests: selectedInterests,
      isVerified: true,
      followersCount: 1,
      followingCount: 3,
      postsCount: 0,
      isOnline: true
    };

    onCompleteOnboarding(fullUser, selectedInterests);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-950/85 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl p-6 md:p-8 relative max-h-[95vh] overflow-y-auto">
        {/* Progress indicator */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-pink-500 to-indigo-600 flex items-center justify-center text-white shadow-sm">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="font-display font-extrabold text-lg text-neutral-900 dark:text-white">
              webop
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <span
              className={`w-2.5 h-2.5 rounded-full transition-colors ${
                step === 1 ? 'bg-indigo-600' : 'bg-emerald-500'
              }`}
            />
            <span
              className={`w-2.5 h-2.5 rounded-full transition-colors ${
                step === 2 ? 'bg-indigo-600' : 'bg-neutral-300 dark:bg-neutral-700'
              }`}
            />
            <span className="text-xs font-semibold text-neutral-400 ml-1">
              Step {step} of 2
            </span>
          </div>
        </div>

        {/* STEP 1: CHOOSE USERNAME & CUSTOM PFP */}
        {step === 1 && (
          <form onSubmit={handleNextStep} className="space-y-4 animate-in fade-in duration-150 text-left">
            {/* Back to Auth Button */}
            {onBackToAuth && (
              <button
                type="button"
                onClick={onBackToAuth}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-neutral-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors group mb-1"
              >
                <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
                <span>Буцах (Back to Login)</span>
              </button>
            )}

            <div>
              <h2 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
                Set up your Profile & PFP
              </h2>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                Choose your unique @username and upload your custom profile picture.
              </p>
            </div>

            {/* Custom PFP Upload Area */}
            <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700 flex flex-col sm:flex-row items-center gap-4">
              <div className="relative group shrink-0">
                <img
                  src={avatar}
                  alt="Avatar preview"
                  className="w-20 h-20 rounded-full object-cover ring-4 ring-indigo-500/30 shadow-md"
                />
                <label
                  className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity"
                  title="Upload Custom PFP"
                >
                  <Camera className="w-6 h-6" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleCustomPfpUpload}
                    className="hidden"
                  />
                </label>
                {isCustomPfp && (
                  <span className="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-1 rounded-full text-[10px] shadow">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </span>
                )}
              </div>

              <div className="flex-1 text-center sm:text-left space-y-2">
                <div className="flex flex-wrap items-center gap-2 justify-center sm:justify-start">
                  <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-sm transition-all active:scale-95">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Custom Photo</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleCustomPfpUpload}
                      className="hidden"
                    />
                  </label>

                  {isCustomPfp && (
                    <button
                      type="button"
                      onClick={() => {
                        setAvatar(sampleAvatars[0]);
                        setIsCustomPfp(false);
                      }}
                      className="px-2.5 py-1.5 rounded-xl bg-neutral-200 dark:bg-neutral-700 text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:bg-neutral-300"
                    >
                      Reset
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-1.5 justify-center sm:justify-start">
                  <span className="text-[11px] text-neutral-400">Or pick preset:</span>
                  {sampleAvatars.map((url, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setAvatar(url);
                        setIsCustomPfp(false);
                      }}
                      className={`w-7 h-7 rounded-full overflow-hidden border-2 transition-transform ${
                        avatar === url && !isCustomPfp ? 'border-indigo-600 scale-110' : 'border-transparent'
                      }`}
                    >
                      <img src={url} alt="preset" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Display Name */}
            <div>
              <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your display name"
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-sm font-semibold text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Username Input with live check */}
            <div>
              <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                Choose Username (@handle)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 font-semibold text-sm">
                  @
                </span>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value.toLowerCase())}
                  placeholder="username"
                  required
                  className="w-full pl-8 pr-10 py-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-sm font-semibold text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                />
                {isUsernameValid && (
                  <div className="absolute right-3.5 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                )}
              </div>
              <div className="flex items-center justify-between mt-1 text-[11px]">
                <span className={isUsernameValid ? 'text-emerald-500 font-semibold' : 'text-neutral-400'}>
                  {isUsernameValid ? `webop.me/@${sanitizedUsername} is ready` : 'Min 3 letters/numbers'}
                </span>
                <span className="text-neutral-400">Letters, numbers, underscores</span>
              </div>
            </div>

            {/* Bio Input */}
            <div>
              <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                Bio (Optional)
              </label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={2}
                placeholder="What do you love? Let friends know..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-xs text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={!isUsernameValid}
              className="w-full py-3.5 px-4 rounded-xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 transition-all flex items-center justify-center gap-2 shadow-md shadow-indigo-600/20 active:scale-[0.98]"
            >
              <span>Next: Choose Your Interests</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* STEP 2: WHAT ARE YOU INTERESTED IN? */}
        {step === 2 && (
          <div className="space-y-4 animate-in fade-in duration-150 text-left">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white flex items-center gap-2">
                <span>What are you interested in?</span>
                <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
              </h2>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                Pick what you like so webop can personalize your feed, stories, and friends recommendations.
              </p>
            </div>

            {/* Interests Grid */}
            <div className="grid grid-cols-2 gap-2.5 max-h-64 overflow-y-auto no-scrollbar py-1">
              {availableInterests.map((interest) => {
                const isSelected = selectedInterests.includes(interest.id);
                return (
                  <button
                    key={interest.id}
                    type="button"
                    onClick={() => toggleInterest(interest.id)}
                    className={`p-3 rounded-2xl border text-left transition-all relative flex flex-col justify-between ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-950 dark:text-indigo-200 shadow-sm'
                        : 'border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/40 text-neutral-800 dark:text-neutral-300 hover:border-neutral-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-2xl">{interest.emoji}</span>
                      {isSelected ? (
                        <div className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                      ) : (
                        <div className="w-5 h-5 rounded-full border border-neutral-300 dark:border-neutral-700" />
                      )}
                    </div>
                    <div>
                      <div className="text-xs font-bold">{interest.name}</div>
                      <div className="text-[10px] text-neutral-500 dark:text-neutral-400 line-clamp-1 mt-0.5">
                        {interest.description}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="flex items-center justify-between text-xs text-neutral-500 pt-1">
              <span>{selectedInterests.length} selected</span>
              <span className="text-[11px]">Select at least 1 to continue</span>
            </div>

            {/* Action buttons with clear Back button */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-700 text-xs font-bold text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors flex items-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Буцах (Back)</span>
              </button>

              <button
                type="button"
                onClick={handleFinish}
                disabled={selectedInterests.length === 0}
                className="flex-1 py-3.5 px-4 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-indigo-600 to-rose-600 hover:from-indigo-500 hover:to-rose-500 active:scale-[0.98] disabled:opacity-40 transition-all shadow-md shadow-indigo-600/20"
              >
                Enter webop Feed 🚀
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
