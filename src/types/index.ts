export interface User {
  id: string;
  name: string;
  username: string;
  avatar: string;
  bio?: string;
  email?: string;
  provider?: 'google' | 'discord' | 'guest';
  interests?: string[];
  isVerified?: boolean;
  followersCount: number;
  followingCount: number;
  postsCount: number;
  isOnline: boolean;
  lastSeen?: string;
  currentNote?: Note;
}

export interface Note {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  moodEmoji?: string;
  musicTrack?: {
    title: string;
    artist: string;
  };
  createdAt: string;
}

export interface Comment {
  id: string;
  author: {
    id: string;
    name: string;
    username: string;
    avatar: string;
  };
  content: string;
  likes: number;
  isLiked?: boolean;
  createdAt: string;
}

export interface Post {
  id: string;
  author: User;
  content: string;
  mediaUrl?: string;
  mediaType?: 'image' | 'video';
  location?: string;
  feeling?: string;
  category?: string;
  tags?: string[];
  likes: number;
  isLiked: boolean;
  saved: boolean;
  comments: Comment[];
  createdAt: string;
}

export interface Story {
  id: string;
  author: User;
  mediaUrl: string;
  caption?: string;
  createdAt: string;
  isViewed: boolean;
}

export interface Message {
  id: string;
  senderId: string;
  text?: string;
  mediaUrl?: string;
  isAudio?: boolean;
  audioDuration?: number;
  reaction?: string;
  timestamp: string;
}

export interface Conversation {
  id: string;
  participant: User;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  messages: Message[];
}

export interface CallSession {
  id: string;
  participant: User;
  type: 'audio' | 'video';
  status: 'outgoing_ringing' | 'incoming_ringing' | 'connected' | 'ended';
  duration: number;
  isMuted: boolean;
  isVideoOff: boolean;
  isScreenSharing?: boolean;
}

export interface NotificationItem {
  id: string;
  type: 'like' | 'comment' | 'follow' | 'mention' | 'friend_request';
  user: {
    id: string;
    name: string;
    username: string;
    avatar: string;
  };
  content: string;
  time: string;
  isRead: boolean;
  targetPostMedia?: string;
}

export interface InterestCategory {
  id: string;
  name: string;
  emoji: string;
  description: string;
}
