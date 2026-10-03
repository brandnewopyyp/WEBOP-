import React, { useState } from 'react';
import { Search, Heart, MessageCircle, MapPin, Sparkles } from 'lucide-react';
import { Post, User } from '../../types';

interface ExploreViewProps {
  posts: Post[];
  onSelectPost: (post: Post) => void;
  onAuthorClick: (user: User) => void;
}

export const ExploreView: React.FC<ExploreViewProps> = ({
  posts,
  onSelectPost,
  onAuthorClick
}) => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    'All',
    'Photography',
    'Architecture',
    'Aesthetics',
    'Travel',
    'Lifestyle',
    'Tech'
  ];

  const filteredPosts = posts.filter((p) => {
    const matchesSearch =
      p.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.author.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.location && p.location.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;
    if (activeCategory === 'All') return true;
    if (activeCategory === 'Photography') return p.content.includes('photo') || p.content.includes('shot');
    if (activeCategory === 'Architecture') return p.content.includes('architecture') || p.content.includes('pavilion');
    if (activeCategory === 'Travel') return p.content.includes('alpine') || p.content.includes('expedition');
    return true;
  });

  return (
    <div className="flex-1 min-h-screen pb-20 md:pb-8 p-4 md:p-6 max-w-5xl mx-auto">
      {/* Search Header */}
      <div className="mb-6 space-y-3">
        <div className="relative max-w-md mx-auto">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search posts, creators, locations..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
          />
        </div>

        {/* Filter Categories Bar */}
        <div className="flex items-center justify-center gap-2 overflow-x-auto no-scrollbar py-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                activeCategory === cat
                  ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 shadow-sm'
                  : 'bg-white dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 border border-neutral-200 dark:border-neutral-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of posts */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-4">
        {filteredPosts.map((post, idx) => (
          <div
            key={post.id}
            onClick={() => onSelectPost(post)}
            className={`group relative rounded-2xl overflow-hidden bg-neutral-900 cursor-pointer shadow-sm ${
              idx % 5 === 0 ? 'col-span-2 md:col-span-2 aspect-[16/10]' : 'aspect-square'
            }`}
          >
            <img
              src={post.mediaUrl}
              alt="Explore visual"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />

            {/* Hover overlay with likes & comments */}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-6 text-white font-bold text-sm">
              <span className="flex items-center gap-1.5">
                <Heart className="w-5 h-5 fill-white" />
                <span>{post.likes}</span>
              </span>
              <span className="flex items-center gap-1.5">
                <MessageCircle className="w-5 h-5 fill-white" />
                <span>{post.comments.length}</span>
              </span>
            </div>

            {/* Bottom creator chip */}
            <div className="absolute bottom-2 left-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="text-[11px] font-semibold text-white bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-full">
                @{post.author.username}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
