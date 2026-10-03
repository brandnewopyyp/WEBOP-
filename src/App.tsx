/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  mockUsers,
  allCuratedPosts,
  initialStories,
  initialConversations,
  initialNotifications
} from './data/mockData';
import {
  User,
  Post,
  Story,
  Conversation,
  NotificationItem,
  CallSession,
  Note
} from './types';

import { Sidebar } from './components/layout/Sidebar';
import { BottomNav } from './components/layout/BottomNav';
import { MobileHeader } from './components/layout/MobileHeader';
import { FeedView } from './components/feed/FeedView';
import { MessengerView } from './components/messages/MessengerView';
import { ReelsView } from './components/reels/ReelsView';
import { ExploreView } from './components/explore/ExploreView';
import { ProfileView } from './components/profile/ProfileView';
import { CallModal } from './components/calling/CallModal';
import { CreateNoteModal } from './components/notes/CreateNoteModal';
import { CreatePostModal } from './components/feed/CreatePostModal';
import { StoryViewerModal } from './components/feed/StoryViewerModal';
import { ShareModal } from './components/feed/ShareModal';
import { EditProfileModal } from './components/profile/EditProfileModal';
import { EditInterestsModal } from './components/auth/EditInterestsModal';
import { NotificationsDrawer } from './components/notifications/NotificationsDrawer';
import { AuthModal } from './components/auth/AuthModal';
import { OnboardingModal } from './components/auth/OnboardingModal';
import { Sparkles } from 'lucide-react';
import { playPopSound, playMessageSentSound } from './utils/soundEffects';

const defaultFallbackUser: User = {
  id: 'user_me',
  name: 'Temuulen E.',
  username: 'temuu',
  email: 'temucluade@gmail.com',
  provider: 'google',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
  bio: 'Building the next gen social web with webop 🚀 | Photography, design & code',
  isVerified: true,
  followersCount: 142,
  followingCount: 38,
  postsCount: 2,
  interests: ['photography', 'travel', 'tech'],
  isOnline: true,
  currentNote: {
    id: 'note_me',
    userId: 'user_me',
    userName: 'Temuulen E.',
    userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    content: 'Exploring webop vibes 🚀',
    moodEmoji: '✨',
    musicTrack: {
      title: 'Starboy',
      artist: 'The Weeknd'
    },
    createdAt: '15m ago'
  }
};

export default function App() {
  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('webop_auth_state') === 'logged_in';
    }
    return false;
  });

  const [onboardingInitialData, setOnboardingInitialData] = useState<Partial<User> | null>(null);
  const [isAuthModalDismissed, setIsAuthModalDismissed] = useState<boolean>(false);

  const [currentUser, setCurrentUser] = useState<User>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('webop_auth_user');
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch {}
      }
    }
    return defaultFallbackUser;
  });

  const [users, setUsers] = useState<User[]>([currentUser, ...mockUsers]);
  const [posts, setPosts] = useState<Post[]>(allCuratedPosts);
  const [stories, setStories] = useState<Story[]>(initialStories);
  const [conversations, setConversations] = useState<Conversation[]>(initialConversations);
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);

  // Navigation
  const [currentTab, setCurrentTab] = useState<string>('feed');
  const [selectedProfileUser, setSelectedProfileUser] = useState<User>(currentUser);

  // Theme
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return (
        localStorage.getItem('webop_theme') === 'dark' ||
        (!('webop_theme' in localStorage) &&
          window.matchMedia('(prefers-color-scheme: dark)').matches)
      );
    }
    return false;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
      localStorage.setItem('webop_theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('webop_theme', 'light');
    }
  }, [darkMode]);

  // Keep selectedProfileUser in sync if currentUser updates
  useEffect(() => {
    if (selectedProfileUser.id === currentUser.id) {
      setSelectedProfileUser(currentUser);
    }
  }, [currentUser]);

  // Save current user to localStorage whenever it changes
  useEffect(() => {
    if (isAuthenticated) {
      localStorage.setItem('webop_auth_user', JSON.stringify(currentUser));
      localStorage.setItem('webop_auth_state', 'logged_in');
    }
  }, [currentUser, isAuthenticated]);

  // Modals & Drawers state
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [isCreateNoteOpen, setIsCreateNoteOpen] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isEditInterestsOpen, setIsEditInterestsOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [activeStory, setActiveStory] = useState<Story | null>(null);
  const [shareModalPost, setShareModalPost] = useState<Post | null>(null);

  // Active Call State
  const [activeCallSession, setActiveCallSession] = useState<CallSession | null>(null);

  // Active Conversation ID
  const [activeConvId, setActiveConvId] = useState<string>('conv_anar');

  // Unread counts
  const unreadMessagesCount = conversations.reduce((acc, c) => acc + c.unreadCount, 0);
  const unreadNotifsCount = notifications.filter((n) => !n.isRead).length;

  // Auth Handlers
  const handleStartAuthFlow = (userData: Partial<User>) => {
    setOnboardingInitialData(userData);
  };

  const handleCompleteOnboarding = (finalUser: User, chosenInterests: string[]) => {
    setCurrentUser(finalUser);
    setSelectedProfileUser(finalUser);
    setUsers((prev) => [finalUser, ...prev.filter((u) => u.id !== finalUser.id)]);
    setIsAuthenticated(true);
    setOnboardingInitialData(null);
    localStorage.setItem('webop_auth_user', JSON.stringify(finalUser));
    localStorage.setItem('webop_auth_state', 'logged_in');
    playPopSound();
  };

  const handleLogout = () => {
    localStorage.removeItem('webop_auth_state');
    localStorage.removeItem('webop_auth_user');
    setIsAuthenticated(false);
    setIsAuthModalDismissed(false);
    setOnboardingInitialData(null);
    setCurrentUser(defaultFallbackUser);
    setSelectedProfileUser(defaultFallbackUser);
    setCurrentTab('feed');
    playPopSound();
  };

  const handleSaveInterests = (newInterests: string[]) => {
    const updated = { ...currentUser, interests: newInterests };
    setCurrentUser(updated);
    playPopSound();
  };

  // Handlers for Posts
  const handleLikeToggle = (postId: string) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const isLiked = !p.isLiked;
          return {
            ...p,
            isLiked,
            likes: isLiked ? p.likes + 1 : Math.max(0, p.likes - 1)
          };
        }
        return p;
      })
    );
  };

  const handleSaveToggle = (postId: string) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          return { ...p, saved: !p.saved };
        }
        return p;
      })
    );
  };

  const handleAddComment = (postId: string, text: string) => {
    const newComment = {
      id: `c_${Date.now()}`,
      author: {
        id: currentUser.id,
        name: currentUser.name,
        username: currentUser.username,
        avatar: currentUser.avatar
      },
      content: text,
      likes: 0,
      createdAt: 'Just now'
    };

    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          return {
            ...p,
            comments: [...p.comments, newComment]
          };
        }
        return p;
      })
    );
  };

  const handleCreatePost = (postData: {
    content: string;
    mediaUrl?: string;
    location?: string;
    feeling?: string;
  }) => {
    const newPost: Post = {
      id: `post_${Date.now()}`,
      author: currentUser,
      content: postData.content,
      mediaUrl: postData.mediaUrl,
      mediaType: 'image',
      location: postData.location,
      feeling: postData.feeling,
      category: currentUser.interests?.[0] || 'photography',
      tags: currentUser.interests || ['photography'],
      likes: 1,
      isLiked: true,
      saved: false,
      comments: [],
      createdAt: 'Just now'
    };

    setPosts((prev) => [newPost, ...prev]);
    setCurrentUser((prev) => ({ ...prev, postsCount: prev.postsCount + 1 }));
    setCurrentTab('feed');
  };

  // Handlers for Notes
  const handleSaveNote = (noteData: Partial<Note>) => {
    const newNote: Note = {
      id: `note_${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      content: noteData.content || '',
      moodEmoji: noteData.moodEmoji,
      musicTrack: noteData.musicTrack,
      createdAt: 'Just now'
    };

    setCurrentUser((prev) => ({ ...prev, currentNote: newNote }));
    setUsers((prev) =>
      prev.map((u) => (u.id === currentUser.id ? { ...u, currentNote: newNote } : u))
    );
    playPopSound();
  };

  const handleDeleteNote = () => {
    setCurrentUser((prev) => ({ ...prev, currentNote: undefined }));
    setUsers((prev) =>
      prev.map((u) => (u.id === currentUser.id ? { ...u, currentNote: undefined } : u))
    );
  };

  const handleReplyToNote = (recipient: User, replyText: string) => {
    let conv = conversations.find((c) => c.participant.id === recipient.id);
    const newMsg = {
      id: `m_${Date.now()}`,
      senderId: currentUser.id,
      text: `Replied to note "${recipient.currentNote?.content}": ${replyText}`,
      timestamp: 'Just now'
    };

    if (conv) {
      setConversations((prev) =>
        prev.map((c) =>
          c.id === conv!.id
            ? {
                ...c,
                lastMessage: newMsg.text,
                lastMessageTime: 'Just now',
                messages: [...c.messages, newMsg]
              }
            : c
        )
      );
      setActiveConvId(conv.id);
    } else {
      const newConv: Conversation = {
        id: `conv_${recipient.id}`,
        participant: recipient,
        lastMessage: newMsg.text,
        lastMessageTime: 'Just now',
        unreadCount: 0,
        messages: [newMsg]
      };
      setConversations((prev) => [newConv, ...prev]);
      setActiveConvId(newConv.id);
    }

    setCurrentTab('messages');
    playMessageSentSound();
  };

  // Handlers for Messaging
  const handleSendMessage = (conversationId: string, msgData: any) => {
    const newMsg = {
      id: `msg_${Date.now()}`,
      ...msgData
    };

    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === conversationId) {
          const previewText = msgData.isAudio ? 'Voice message (audio)' : msgData.text || 'Photo';
          return {
            ...c,
            lastMessage: previewText,
            lastMessageTime: 'Just now',
            messages: [...c.messages, newMsg]
          };
        }
        return c;
      })
    );
  };

  // Calling Functionality
  const handleStartCall = (participant: User, type: 'audio' | 'video') => {
    setActiveCallSession({
      id: `call_${Date.now()}`,
      participant,
      type,
      status: 'outgoing_ringing',
      duration: 0,
      isMuted: false,
      isVideoOff: false
    });
  };

  const handleEndCall = () => {
    setActiveCallSession(null);
  };

  const handleToggleMute = () => {
    if (activeCallSession) {
      setActiveCallSession({
        ...activeCallSession,
        isMuted: !activeCallSession.isMuted
      });
    }
  };

  const handleToggleVideo = () => {
    if (activeCallSession) {
      setActiveCallSession({
        ...activeCallSession,
        isVideoOff: !activeCallSession.isVideoOff
      });
    }
  };

  // Navigation helpers
  const handleOpenMessagesWithUser = (targetUser: User) => {
    let conv = conversations.find((c) => c.participant.id === targetUser.id);
    if (!conv) {
      conv = {
        id: `conv_${targetUser.id}`,
        participant: targetUser,
        lastMessage: 'Started a new chat',
        lastMessageTime: 'Just now',
        unreadCount: 0,
        messages: []
      };
      setConversations((prev) => [conv!, ...prev]);
    }
    setActiveConvId(conv.id);
    setCurrentTab('messages');
  };

  const handleAuthorClick = (author: User) => {
    setSelectedProfileUser(author);
    setCurrentTab('profile');
  };

  // Share helpers
  const handleSendPostToUser = (recipient: User, post: Post) => {
    handleSendMessage(
      conversations.find((c) => c.participant.id === recipient.id)?.id || activeConvId,
      {
        senderId: currentUser.id,
        text: `Check out this post by @${post.author.username}: "${post.content.slice(0, 60)}..."`,
        mediaUrl: post.mediaUrl,
        timestamp: 'Just now'
      }
    );
  };

  const handleShareToStory = (post: Post) => {
    const newStory: Story = {
      id: `story_${Date.now()}`,
      author: currentUser,
      mediaUrl: post.mediaUrl || currentUser.avatar,
      caption: `Shared from @${post.author.username}`,
      createdAt: 'Just now',
      isViewed: false
    };
    setStories((prev) => [newStory, ...prev]);
    playPopSound();
  };

  const handleSendStoryReply = (author: User, replyText: string) => {
    handleSendMessage(
      conversations.find((c) => c.participant.id === author.id)?.id || activeConvId,
      {
        senderId: currentUser.id,
        text: `Replied to your story: ${replyText}`,
        timestamp: 'Just now'
      }
    );
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 flex flex-col md:flex-row">
      {/* Auth Modal if user is not logged in */}
      {!isAuthenticated && !onboardingInitialData && !isAuthModalDismissed && (
        <AuthModal
          onSuccessAuth={handleStartAuthFlow}
          onClose={() => setIsAuthModalDismissed(true)}
        />
      )}

      {/* Floating Login Pill if browsing as guest */}
      {!isAuthenticated && isAuthModalDismissed && (
        <button
          onClick={() => setIsAuthModalDismissed(false)}
          className="fixed bottom-20 md:bottom-6 right-6 z-40 px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-xl shadow-indigo-600/30 flex items-center gap-2 active:scale-95 transition-all"
        >
          <Sparkles className="w-4 h-4" />
          <span>Log In</span>
        </button>
      )}

      {/* Onboarding Modal (Username selection & Interests questionnaire) */}
      {onboardingInitialData && (
        <OnboardingModal
          initialData={onboardingInitialData}
          onCompleteOnboarding={handleCompleteOnboarding}
          onBackToAuth={() => setOnboardingInitialData(null)}
        />
      )}

      {/* Mobile Sticky Header */}
      <MobileHeader
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        onOpenMessages={() => setCurrentTab('messages')}
        unreadNotifsCount={unreadNotifsCount}
        unreadMessagesCount={unreadMessagesCount}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        onBrandClick={() => setCurrentTab('feed')}
        isAuthenticated={isAuthenticated}
        onLogout={handleLogout}
      />

      {/* Desktop Persistent Sidebar */}
      <Sidebar
        currentTab={currentTab}
        setCurrentTab={(tab) => {
          if (tab === 'notes') {
            setIsCreateNoteOpen(true);
            return;
          }
          if (tab === 'notifications') {
            setIsNotificationsOpen(true);
            return;
          }
          if (tab === 'profile') {
            setSelectedProfileUser(currentUser);
          }
          setCurrentTab(tab);
        }}
        unreadMessagesCount={unreadMessagesCount}
        unreadNotifsCount={unreadNotifsCount}
        openCreateModal={() => setIsCreatePostOpen(true)}
        openCreateNoteModal={() => setIsCreateNoteOpen(true)}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        currentUser={currentUser}
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {currentTab === 'feed' && (
          <FeedView
            currentUser={currentUser}
            users={users}
            posts={posts}
            stories={stories}
            onOpenStory={(story) => setActiveStory(story)}
            onAddStory={() => setIsCreatePostOpen(true)}
            onOpenCreatePost={() => setIsCreatePostOpen(true)}
            onOpenCreateNote={() => setIsCreateNoteOpen(true)}
            onReplyToNote={handleReplyToNote}
            onLikeToggle={handleLikeToggle}
            onSaveToggle={handleSaveToggle}
            onAddComment={handleAddComment}
            onOpenShareModal={(post) => setShareModalPost(post)}
            onStartCall={handleStartCall}
            onOpenMessagesWithUser={handleOpenMessagesWithUser}
            onAuthorClick={handleAuthorClick}
            onOpenEditInterests={() => setIsEditInterestsOpen(true)}
          />
        )}

        {currentTab === 'messages' && (
          <MessengerView
            conversations={conversations}
            activeConversationId={activeConvId}
            onSelectConversation={(id) => {
              setActiveConvId(id);
              setConversations((prev) =>
                prev.map((c) => (c.id === id ? { ...c, unreadCount: 0 } : c))
              );
            }}
            onSendMessage={handleSendMessage}
            onStartCall={handleStartCall}
            currentUser={currentUser}
            users={users}
            onOpenCreateNote={() => setIsCreateNoteOpen(true)}
            onReplyToNote={handleReplyToNote}
          />
        )}

        {currentTab === 'reels' && (
          <ReelsView
            posts={posts}
            currentUser={currentUser}
            onLikeToggle={handleLikeToggle}
            onOpenShareModal={(post) => setShareModalPost(post)}
            onAuthorClick={handleAuthorClick}
          />
        )}

        {(currentTab === 'explore' || currentTab === 'search') && (
          <ExploreView
            posts={posts}
            onSelectPost={(post) => setShareModalPost(post)}
            onAuthorClick={handleAuthorClick}
          />
        )}

        {currentTab === 'profile' && (
          <ProfileView
            user={selectedProfileUser}
            currentUser={currentUser}
            posts={posts}
            onOpenEditProfile={() => setIsEditProfileOpen(true)}
            onStartCall={handleStartCall}
            onOpenMessagesWithUser={handleOpenMessagesWithUser}
            onSelectPost={(post) => setShareModalPost(post)}
            onOpenCreateNote={() => setIsCreateNoteOpen(true)}
            onOpenEditInterests={() => setIsEditInterestsOpen(true)}
            onLogout={handleLogout}
          />
        )}
      </div>

      {/* Mobile Ergonomic Bottom Tab Navigation */}
      <BottomNav
        currentTab={currentTab}
        setCurrentTab={(tab) => {
          if (tab === 'profile') {
            setSelectedProfileUser(currentUser);
          }
          setCurrentTab(tab);
        }}
        openCreateModal={() => setIsCreatePostOpen(true)}
        unreadMessagesCount={unreadMessagesCount}
      />

      {/* Interactive Call Modal (Audio & Video) */}
      {activeCallSession && (
        <CallModal
          session={activeCallSession}
          onEndCall={handleEndCall}
          onToggleMute={handleToggleMute}
          onToggleVideo={handleToggleVideo}
          currentUser={currentUser}
        />
      )}

      {/* Create Note Modal */}
      {isCreateNoteOpen && (
        <CreateNoteModal
          currentUser={currentUser}
          onClose={() => setIsCreateNoteOpen(false)}
          onSaveNote={handleSaveNote}
          onDeleteNote={handleDeleteNote}
        />
      )}

      {/* Create Post Modal */}
      {isCreatePostOpen && (
        <CreatePostModal
          currentUser={currentUser}
          onClose={() => setIsCreatePostOpen(false)}
          onSubmitPost={handleCreatePost}
        />
      )}

      {/* Fullscreen Interactive Story Viewer */}
      {activeStory && (
        <StoryViewerModal
          stories={stories}
          initialStoryId={activeStory.id}
          onClose={() => setActiveStory(null)}
          onSendStoryReply={handleSendStoryReply}
        />
      )}

      {/* Post Share Modal */}
      {shareModalPost && (
        <ShareModal
          post={shareModalPost}
          users={users}
          onClose={() => setShareModalPost(null)}
          onSendToUser={handleSendPostToUser}
          onShareToStory={handleShareToStory}
        />
      )}

      {/* Edit Profile Modal */}
      {isEditProfileOpen && (
        <EditProfileModal
          currentUser={currentUser}
          onClose={() => setIsEditProfileOpen(false)}
          onSave={(updated) => {
            const newUser = { ...currentUser, ...updated };
            setCurrentUser(newUser);
            setUsers((prev) =>
              prev.map((u) => (u.id === currentUser.id ? newUser : u))
            );
          }}
        />
      )}

      {/* Edit Interests Modal */}
      {isEditInterestsOpen && (
        <EditInterestsModal
          currentInterests={currentUser.interests || ['photography', 'travel']}
          onClose={() => setIsEditInterestsOpen(false)}
          onSaveInterests={handleSaveInterests}
        />
      )}

      {/* Notifications Drawer */}
      {isNotificationsOpen && (
        <NotificationsDrawer
          notifications={notifications}
          onClose={() => setIsNotificationsOpen(false)}
          onMarkAllAsRead={() => {
            setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
          }}
          onAcceptFriendRequest={(id) => {
            setNotifications((prev) =>
              prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
            );
            playPopSound();
          }}
        />
      )}
    </div>
  );
}
