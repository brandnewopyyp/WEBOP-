import React from 'react';
import { X, Heart, MessageCircle, UserPlus, Sparkles, Check } from 'lucide-react';
import { NotificationItem, User } from '../../types';

interface NotificationsDrawerProps {
  notifications: NotificationItem[];
  onClose: () => void;
  onMarkAllAsRead: () => void;
  onAcceptFriendRequest: (notifId: string) => void;
}

export const NotificationsDrawer: React.FC<NotificationsDrawerProps> = ({
  notifications,
  onClose,
  onMarkAllAsRead,
  onAcceptFriendRequest
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end md:p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full md:w-96 h-full md:h-[90vh] bg-white dark:bg-neutral-900 border-l md:border border-neutral-200 dark:border-neutral-800 md:rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-neutral-200 dark:border-neutral-800">
          <div>
            <h3 className="text-base font-bold text-neutral-900 dark:text-white">
              Notifications
            </h3>
            <button
              onClick={onMarkAllAsRead}
              className="text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
            >
              Mark all as read
            </button>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto divide-y divide-neutral-100 dark:divide-neutral-800/60 p-2">
          {notifications.map((notif) => {
            return (
              <div
                key={notif.id}
                className={`p-3 rounded-2xl flex items-start gap-3 transition-colors ${
                  notif.isRead
                    ? 'hover:bg-neutral-50 dark:hover:bg-neutral-800/40'
                    : 'bg-indigo-50/50 dark:bg-indigo-950/20'
                }`}
              >
                {/* Avatar with type badge */}
                <div className="relative shrink-0">
                  <img
                    src={notif.user.avatar}
                    alt={notif.user.name}
                    referrerPolicy="no-referrer"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-white dark:bg-neutral-800 flex items-center justify-center shadow-xs">
                    {notif.type === 'like' && (
                      <Heart className="w-2.5 h-2.5 fill-rose-500 text-rose-500" />
                    )}
                    {notif.type === 'comment' && (
                      <MessageCircle className="w-2.5 h-2.5 text-indigo-600" />
                    )}
                    {notif.type === 'friend_request' && (
                      <UserPlus className="w-2.5 h-2.5 text-emerald-500" />
                    )}
                    {notif.type === 'follow' && (
                      <Sparkles className="w-2.5 h-2.5 text-amber-500" />
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 text-xs text-neutral-800 dark:text-neutral-200 leading-relaxed">
                  <p>
                    <span className="font-bold text-neutral-900 dark:text-white mr-1">
                      {notif.user.name}
                    </span>
                    <span>{notif.content}</span>
                  </p>
                  <span className="text-[10px] text-neutral-400 block mt-1">
                    {notif.time}
                  </span>

                  {/* Friend Request Action buttons */}
                  {notif.type === 'friend_request' && !notif.isRead && (
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => onAcceptFriendRequest(notif.id)}
                        className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-bold text-[11px] shadow-xs"
                      >
                        Confirm
                      </button>
                      <button
                        onClick={() => onAcceptFriendRequest(notif.id)}
                        className="px-3 py-1 bg-neutral-200 dark:bg-neutral-800 hover:bg-neutral-300 text-neutral-700 dark:text-neutral-300 rounded-lg font-semibold text-[11px]"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>

                {/* Target Post Media Thumbnail if present */}
                {notif.targetPostMedia && (
                  <img
                    src={notif.targetPostMedia}
                    alt="Target post"
                    className="w-10 h-10 rounded-xl object-cover shrink-0 border border-neutral-200 dark:border-neutral-700"
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
