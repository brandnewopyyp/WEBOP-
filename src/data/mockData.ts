import { User, Post, Story, Conversation, NotificationItem, Note, InterestCategory } from '../types';

export const availableInterests: InterestCategory[] = [
  { id: 'photography', name: 'Photography', emoji: '📸', description: 'Portraits, landscapes, street shots' },
  { id: 'travel', name: 'Travel & Nature', emoji: '🏔️', description: 'Alpine hikes, wild lakes, road trips' },
  { id: 'tech', name: 'Tech & Coding', emoji: '💻', description: 'Developer projects, AI, startups' },
  { id: 'design', name: 'Architecture & Design', emoji: '📐', description: 'Minimalist spaces, modern aesthetics' },
  { id: 'coffee', name: 'Coffee & Cafés', emoji: '☕', description: 'Specialty coffee, pastries, café culture' },
  { id: 'music', name: 'Music & Beats', emoji: '🎧', description: 'Synthwave, playlists, production' },
  { id: 'fashion', name: 'Fashion & Style', emoji: '🕶️', description: 'Streetwear, tailoring, neutral fits' },
  { id: 'gaming', name: 'Gaming & Esports', emoji: '🎮', description: 'Setups, competitive play, reviews' }
];

export const mockUsers: User[] = [
  {
    id: 'user_anar',
    name: 'Anar Bold',
    username: 'anar.shots',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&q=80',
    bio: 'Landscape & documentary shooter 🏔️ Always on the road.',
    isVerified: true,
    followersCount: 4890,
    followingCount: 412,
    postsCount: 76,
    isOnline: true,
    interests: ['photography', 'travel'],
    currentNote: {
      id: 'note_anar',
      userId: 'user_anar',
      userName: 'Anar Bold',
      userAvatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&q=80',
      content: 'Chasing sunsets in alpine peaks 🏕️',
      moodEmoji: '🌲',
      musicTrack: {
        title: 'A Moment Apart',
        artist: 'Odesza'
      },
      createdAt: '1h ago'
    }
  },
  {
    id: 'user_maral',
    name: 'Maral S.',
    username: 'maralaa.design',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
    bio: 'Architectural space & minimalist interior design 📐 Founder of Studio M.',
    isVerified: false,
    followersCount: 2310,
    followingCount: 310,
    postsCount: 42,
    isOnline: true,
    interests: ['design', 'coffee', 'photography'],
    currentNote: {
      id: 'note_maral',
      userId: 'user_maral',
      userName: 'Maral S.',
      userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
      content: 'New pavilion blueprint done ☕📐',
      moodEmoji: '✨',
      musicTrack: {
        title: 'Ylang Ylang',
        artist: 'FKJ'
      },
      createdAt: '2h ago'
    }
  },
  {
    id: 'user_bilguun',
    name: 'Bilguun Dev',
    username: 'bilguun.code',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    bio: 'Typescript enthusiast & open source hacker 💻 Gaming & coffee.',
    isVerified: false,
    followersCount: 1150,
    followingCount: 180,
    postsCount: 29,
    isOnline: true,
    interests: ['tech', 'gaming', 'coffee'],
    currentNote: {
      id: 'note_bilguun',
      userId: 'user_bilguun',
      userName: 'Bilguun Dev',
      userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
      content: 'Late night coding sprint ⚡🎧',
      moodEmoji: '💻',
      musicTrack: {
        title: 'Veridis Quo',
        artist: 'Daft Punk'
      },
      createdAt: '3h ago'
    }
  },
  {
    id: 'user_khulan',
    name: 'Khulan Ts.',
    username: 'khulan.mode',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=200&auto=format&fit=crop&q=80',
    bio: 'Wardrobe stylist & creative direction 🕶️ Minimalist luxury.',
    isVerified: true,
    followersCount: 8900,
    followingCount: 650,
    postsCount: 110,
    isOnline: false,
    lastSeen: '1h ago',
    interests: ['fashion', 'photography', 'design'],
    currentNote: {
      id: 'note_khulan',
      userId: 'user_khulan',
      userName: 'Khulan Ts.',
      userAvatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=200&auto=format&fit=crop&q=80',
      content: 'Golden hour mood ☀️',
      moodEmoji: '🕶️',
      createdAt: '6h ago'
    }
  }
];

export const allCuratedPosts: Post[] = [
  {
    id: 'post_1',
    author: mockUsers[0], // Anar
    category: 'travel',
    tags: ['travel', 'photography'],
    content: 'First light over the glacial alpine heights. Woke up at 5:00 AM in sub-zero crisp breeze, but this breathtaking serenity makes every step worth it. What is your dream expedition this season? 🏔️🌲',
    mediaUrl: '/src/assets/images/post_nature_travel_1791047655275.jpg',
    mediaType: 'image',
    location: 'Alpine Glacial Lake, Altai',
    feeling: 'feeling inspired',
    likes: 342,
    isLiked: false,
    saved: false,
    createdAt: '2 hours ago',
    comments: [
      {
        id: 'c1',
        author: mockUsers[1],
        content: 'The lighting on those snow peaks is out of this world! Incredible shot Anar 🔥',
        likes: 14,
        createdAt: '1 hour ago'
      },
      {
        id: 'c2',
        author: mockUsers[2],
        content: 'Looks like a cinematic still frame 👏',
        likes: 4,
        createdAt: '25 mins ago'
      }
    ]
  },
  {
    id: 'post_2',
    author: mockUsers[1], // Maral
    category: 'coffee',
    tags: ['coffee', 'design'],
    content: 'Aesthetic morning routine: slow hand-crafted flat white and warm flaky croissant before heading to the architectural site survey. Starting the day with intention and quiet stillness ☕🥐',
    mediaUrl: '/src/assets/images/post_cozy_cafe_1791047666157.jpg',
    mediaType: 'image',
    location: 'Café Travertine, Downtown',
    feeling: 'feeling relaxed',
    likes: 189,
    isLiked: true,
    saved: true,
    createdAt: '4 hours ago',
    comments: [
      {
        id: 'c3',
        author: mockUsers[2],
        content: 'That latte art precision is unmatched!',
        likes: 5,
        createdAt: '3 hours ago'
      }
    ]
  },
  {
    id: 'post_3',
    author: mockUsers[3], // Khulan
    category: 'fashion',
    tags: ['fashion', 'photography'],
    content: 'Autumn tailoring & neutral textures. Soft golden hour tones against raw brutalist concrete. Simplicity is the ultimate sophistication ✨',
    mediaUrl: '/src/assets/images/post_portrait_lifestyle_1791047689447.jpg',
    mediaType: 'image',
    location: 'Design District',
    feeling: 'feeling fabulous',
    likes: 512,
    isLiked: false,
    saved: false,
    createdAt: '6 hours ago',
    comments: [
      {
        id: 'c4',
        author: mockUsers[1],
        content: 'The fit and the lighting are perfection! 🔥',
        likes: 9,
        createdAt: '5 hours ago'
      }
    ]
  },
  {
    id: 'post_4',
    author: mockUsers[2], // Bilguun Dev
    category: 'design',
    tags: ['design', 'tech'],
    content: 'Completed the structural glass pavilion exterior inspection. Cantilevered geometric concrete with twilight sky reflection. Modern architecture truly bridges geometry and nature 🌆📐',
    mediaUrl: '/src/assets/images/post_modern_architecture_1791047678225.jpg',
    mediaType: 'image',
    location: 'West Horizon Complex',
    feeling: 'feeling accomplished',
    likes: 275,
    isLiked: false,
    saved: false,
    createdAt: '9 hours ago',
    comments: [
      {
        id: 'c5',
        author: mockUsers[0],
        content: 'The glass reflections in the evening light look astonishing!',
        likes: 6,
        createdAt: '7 hours ago'
      }
    ]
  }
];

export const initialStories: Story[] = [
  {
    id: 'story_1',
    author: mockUsers[0], // Anar
    mediaUrl: '/src/assets/images/post_nature_travel_1791047655275.jpg',
    caption: 'Camp setup at 2,800m altitude ⛺',
    createdAt: '1h ago',
    isViewed: false
  },
  {
    id: 'story_2',
    author: mockUsers[1], // Maral
    mediaUrl: '/src/assets/images/post_cozy_cafe_1791047666157.jpg',
    caption: 'Morning brew perfection ✨',
    createdAt: '2h ago',
    isViewed: false
  },
  {
    id: 'story_3',
    author: mockUsers[3], // Khulan
    mediaUrl: '/src/assets/images/post_portrait_lifestyle_1791047689447.jpg',
    caption: 'Backstage at fashion week 🕶️',
    createdAt: '3h ago',
    isViewed: false
  },
  {
    id: 'story_4',
    author: mockUsers[2], // Bilguun
    mediaUrl: '/src/assets/images/post_modern_architecture_1791047678225.jpg',
    caption: 'Late night inspection walk 📐',
    createdAt: '5h ago',
    isViewed: true
  }
];

export const initialConversations: Conversation[] = [
  {
    id: 'conv_anar',
    participant: mockUsers[0], // Anar
    lastMessage: 'Let’s jump on a quick video call, got the drone shots ready!',
    lastMessageTime: '10:14 AM',
    unreadCount: 1,
    messages: [
      {
        id: 'm1',
        senderId: 'user_anar',
        text: 'Hey! Welcome to webop! How are you finding it so far?',
        timestamp: '10:02 AM'
      },
      {
        id: 'm2',
        senderId: 'user_me',
        text: 'Going great! Just polishing the calling feature and Notes bar right now 🚀',
        timestamp: '10:05 AM'
      },
      {
        id: 'm3',
        senderId: 'user_anar',
        text: 'Awesome! Did you check out the alpine photography I posted?',
        timestamp: '10:08 AM',
        reaction: '❤️'
      },
      {
        id: 'm4',
        senderId: 'user_anar',
        text: 'Let’s jump on a quick video call, got the drone shots ready!',
        timestamp: '10:14 AM'
      }
    ]
  },
  {
    id: 'conv_maral',
    participant: mockUsers[1], // Maral
    lastMessage: 'Voice message (0:24)',
    lastMessageTime: 'Yesterday',
    unreadCount: 0,
    messages: [
      {
        id: 'm6',
        senderId: 'user_maral',
        text: 'Hey! Glad you joined webop. Love the clean design here.',
        timestamp: 'Yesterday 4:20 PM'
      },
      {
        id: 'm8',
        senderId: 'user_maral',
        isAudio: true,
        audioDuration: 24,
        timestamp: 'Yesterday 4:30 PM'
      }
    ]
  }
];

export const initialNotifications: NotificationItem[] = [
  {
    id: 'notif_1',
    type: 'follow',
    user: mockUsers[0],
    content: 'started following you on webop.',
    time: '5m ago',
    isRead: false
  },
  {
    id: 'notif_2',
    type: 'like',
    user: mockUsers[1],
    content: 'liked your note in the Notes feed.',
    time: '20m ago',
    isRead: false
  }
];

export const trendingTopics = [
  { tag: '#webopLaunch', count: '14.2k posts' },
  { tag: '#Photography', count: '89.5k posts' },
  { tag: '#AltaiExpedition', count: '5.8k posts' },
  { tag: '#MinimalArchitecture', count: '22.1k posts' },
  { tag: '#CoffeeAesthetics', count: '18.4k posts' }
];

export const sampleMusicTracks = [
  { title: 'Starboy', artist: 'The Weeknd' },
  { title: 'Birds of a Feather', artist: 'Billie Eilish' },
  { title: 'Veridis Quo', artist: 'Daft Punk' },
  { title: 'A Moment Apart', artist: 'Odesza' },
  { title: 'Ylang Ylang', artist: 'FKJ' },
  { title: 'Blinding Lights', artist: 'The Weeknd' },
  { title: 'FE!N', artist: 'Travis Scott' }
];
