import React, { useState } from 'react';
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  MoreHorizontal,
  MapPin,
  Smile,
  Send
} from 'lucide-react';
import { Post, User } from '../../types';
import { playPopSound } from '../../utils/soundEffects';

interface PostCardProps {
  post: Post;
  currentUser: User;
  onLikeToggle: (postId: string) => void;
  onSaveToggle: (postId: string) => void;
  onAddComment: (postId: string, text: string) => void;
  onOpenShareModal: (post: Post) => void;
  onAuthorClick?: (user: User) => void;
}

export const PostCard: React.FC<PostCardProps> = ({
  post,
  currentUser,
  onLikeToggle,
  onSaveToggle,
  onAddComment,
  onOpenShareModal,
  onAuthorClick
}) => {
  const [showHeartAnim, setShowHeartAnim] = useState(false);
  const [commentInput, setCommentInput] = useState('');
  const [showAllComments, setShowAllComments] = useState(false);
  const [isCaptionExpanded, setIsCaptionExpanded] = useState(false);

  // Handle double tap to like
  const handleDoubleTap = () => {
    if (!post.isLiked) {
      onLikeToggle(post.id);
    }
    playPopSound();
    setShowHeartAnim(true);
    setTimeout(() => setShowHeartAnim(false), 900);
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim()) return;
    onAddComment(post.id, commentInput.trim());
    setCommentInput('');
    playPopSound();
  };

  const visibleComments = showAllComments
    ? post.comments
    : post.comments.slice(0, 2);

  return (
    <article className="w-full bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      {/* Post Header */}
      <div className="flex items-center justify-between p-4">
        <button
          onClick={() => onAuthorClick?.(post.author)}
          className="flex items-center gap-3 text-left group"
        >
          <div className="relative">
            <img
              src={post.author.avatar}
              alt={post.author.name}
              referrerPolicy="no-referrer"
              className="w-10 h-10 rounded-full object-cover ring-2 ring-transparent group-hover:ring-indigo-500 transition-all"
            />
            {post.author.isOnline && (
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-neutral-900" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-bold text-neutral-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                {post.author.name}
              </span>
              {post.feeling && (
                <span className="text-xs text-neutral-500 dark:text-neutral-400 font-normal">
                  is {post.feeling}
                </span>
              )}
            </div>
            <div className="flex items-center gap-1 text-[11px] text-neutral-500 dark:text-neutral-400">
              {post.location && (
                <>
                  <MapPin className="w-3 h-3 text-rose-500" />
                  <span className="truncate max-w-[140px] md:max-w-xs">{post.location}</span>
                  <span>·</span>
                </>
              )}
              <span>{post.createdAt}</span>
            </div>
          </div>
        </button>

        <button
          onClick={() => onOpenShareModal(post)}
          className="p-1.5 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 rounded-full transition-colors"
          aria-label="More post options"
        >
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>

      {/* Post Media (Image) with Double-Tap like */}
      {post.mediaUrl && (
        <div
          className="relative bg-neutral-950 aspect-auto max-h-[580px] overflow-hidden cursor-pointer select-none flex items-center justify-center"
          onDoubleClick={handleDoubleTap}
        >
          <img
            src={post.mediaUrl}
            alt="Post media"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover max-h-[580px]"
          />

          {/* Double Tap Heart Burst Animation */}
          {showHeartAnim && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <Heart className="w-28 h-28 text-white fill-rose-500 stroke-rose-500 drop-shadow-2xl animate-heart-burst" />
            </div>
          )}
        </div>
      )}

      {/* Post Action Buttons */}
      <div className="p-4 space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                onLikeToggle(post.id);
                playPopSound();
              }}
              className="p-1 rounded-full text-neutral-800 dark:text-neutral-200 hover:text-rose-500 dark:hover:text-rose-400 active:scale-90 transition-all"
              aria-label={post.isLiked ? 'Unlike post' : 'Like post'}
            >
              <Heart
                className={`w-6 h-6 transition-colors ${
                  post.isLiked ? 'fill-rose-500 text-rose-500 scale-110' : ''
                }`}
              />
            </button>

            <button
              onClick={() => setShowAllComments(!showAllComments)}
              className="p-1 rounded-full text-neutral-800 dark:text-neutral-200 hover:text-indigo-600 active:scale-90 transition-all"
              aria-label="View comments"
            >
              <MessageCircle className="w-6 h-6" />
            </button>

            <button
              onClick={() => onOpenShareModal(post)}
              className="p-1 rounded-full text-neutral-800 dark:text-neutral-200 hover:text-indigo-600 active:scale-90 transition-all"
              aria-label="Share post"
            >
              <Share2 className="w-6 h-6" />
            </button>
          </div>

          <button
            onClick={() => {
              onSaveToggle(post.id);
              playPopSound();
            }}
            className="p-1 rounded-full text-neutral-800 dark:text-neutral-200 hover:text-neutral-900 active:scale-90 transition-all"
            aria-label={post.saved ? 'Remove bookmark' : 'Bookmark post'}
          >
            <Bookmark
              className={`w-6 h-6 ${
                post.saved ? 'fill-neutral-900 dark:fill-white text-neutral-900 dark:text-white' : ''
              }`}
            />
          </button>
        </div>

        {/* Likes Count */}
        <div className="text-xs font-bold text-neutral-900 dark:text-white">
          <span>{post.likes.toLocaleString()} likes</span>
        </div>

        {/* Caption */}
        <div className="text-xs md:text-sm text-neutral-800 dark:text-neutral-200 leading-relaxed">
          <span
            onClick={() => onAuthorClick?.(post.author)}
            className="font-bold text-neutral-900 dark:text-white mr-1.5 cursor-pointer hover:underline"
          >
            {post.author.username}
          </span>
          <span>
            {isCaptionExpanded || post.content.length < 120
              ? post.content
              : `${post.content.slice(0, 120)}...`}
          </span>
          {post.content.length >= 120 && (
            <button
              onClick={() => setIsCaptionExpanded(!isCaptionExpanded)}
              className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 ml-1 font-medium text-xs"
            >
              {isCaptionExpanded ? 'less' : 'more'}
            </button>
          )}
        </div>

        {/* Comments Section */}
        {post.comments.length > 0 && (
          <div className="pt-1 space-y-1.5">
            {post.comments.length > 2 && (
              <button
                onClick={() => setShowAllComments(!showAllComments)}
                className="text-xs font-medium text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 block"
              >
                {showAllComments
                  ? 'Hide comments'
                  : `View all ${post.comments.length} comments`}
              </button>
            )}

            {visibleComments.map((comment) => (
              <div key={comment.id} className="text-xs text-neutral-800 dark:text-neutral-200 flex items-start justify-between">
                <p>
                  <span className="font-bold text-neutral-900 dark:text-white mr-1.5">
                    {comment.author.username}
                  </span>
                  <span>{comment.content}</span>
                </p>
                <span className="text-[10px] text-neutral-400 shrink-0 ml-2">
                  {comment.createdAt}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Add Comment Input Form */}
        <form
          onSubmit={handleCommentSubmit}
          className="pt-2 border-t border-neutral-100 dark:border-neutral-800 flex items-center gap-2"
        >
          <input
            type="text"
            value={commentInput}
            onChange={(e) => setCommentInput(e.target.value)}
            placeholder="Add a comment..."
            className="flex-1 text-xs bg-transparent text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none"
          />

          {commentInput.trim() ? (
            <button
              type="submit"
              className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700"
            >
              Post
            </button>
          ) : (
            <div className="flex items-center gap-1.5 text-neutral-400">
              {['❤️', '🙌', '🔥'].map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => setCommentInput((prev) => prev + emoji)}
                  className="hover:scale-125 transition-transform text-xs"
                >
                  {emoji}
                </button>
              ))}
            </div>
          )}
        </form>
      </div>
    </article>
  );
};
