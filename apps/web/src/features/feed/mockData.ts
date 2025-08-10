import { Reel, User, Product, Comment } from './types';

export const mockUsers: User[] = [
  {
    id: '1',
    username: 'amina_tz',
    displayName: 'Amina Hassan',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b9d38aad?w=150&h=150&fit=crop&crop=face',
    verified: true,
    isLive: true,
    followersCount: 125000,
    isFollowing: false,
  },
  {
    id: '2',
    username: 'james_dar',
    displayName: 'James Mwangi',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    verified: false,
    followersCount: 45000,
    isFollowing: true,
  },
  {
    id: '3',
    username: 'fatuma_style',
    displayName: 'Fatuma Bakari',
    avatar: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=150&h=150&fit=crop&crop=face',
    verified: true,
    followersCount: 89000,
    isFollowing: false,
  },
  {
    id: '4',
    username: 'mohammed_tech',
    displayName: 'Mohammed Ali',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    verified: false,
    followersCount: 32000,
    isFollowing: true,
  },
];

export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Tanzanite Jewelry Set',
    price: 250000,
    currency: 'TSH',
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=200&h=200&fit=crop',
    shop: {
      id: '1',
      name: 'Gems of Tanzania',
      avatar: 'https://images.unsplash.com/photo-1556932743-75d14ab7ac8a?w=100&h=100&fit=crop',
    },
    inStock: true,
  },
  {
    id: '2',
    name: 'Kitenge Fashion Dress',
    price: 85000,
    currency: 'TSH',
    image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=200&h=200&fit=crop',
    shop: {
      id: '2',
      name: 'African Styles',
      avatar: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=100&h=100&fit=crop',
    },
    inStock: true,
  },
];

export const mockReels: Reel[] = [
  {
    id: '1',
    user: mockUsers[0],
    video: {
      url: 'https://sample-videos.com/zip/10/mp4/SampleVideo_360x240_1mb.mp4',
      thumbnail: 'https://images.unsplash.com/photo-1533929736458-ca588d08c8be?w=400&h=600&fit=crop',
      duration: 30,
      aspectRatio: 9/16,
    },
    audio: {
      id: '1',
      name: 'Bongo Flava Beat',
      artist: 'Diamond Platnumz',
      url: '',
    },
    caption: 'Showcasing the beauty of Tanzanian culture! 🇹🇿✨ What do you think about this traditional dance? #Tanzania #Culture #Dance',
    hashtags: ['#Tanzania', '#Culture', '#Dance', '#Traditional', '#Beauty'],
    mentions: ['@culturalheritage'],
    location: {
      name: 'Dar es Salaam, Tanzania',
      coordinates: [-6.7924, 39.2083],
    },
    stats: {
      views: 234567,
      likes: 45231,
      comments: 2847,
      shares: 1205,
      saves: 3421,
    },
    interactions: {
      liked: false,
      saved: false,
      followed: false,
    },
    products: [mockProducts[1]],
    createdAt: new Date('2024-01-15T10:30:00Z'),
    updatedAt: new Date('2024-01-15T10:30:00Z'),
  },
  {
    id: '2',
    user: mockUsers[1],
    video: {
      url: 'https://sample-videos.com/zip/10/mp4/SampleVideo_360x240_2mb.mp4',
      thumbnail: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=600&fit=crop',
      duration: 45,
      aspectRatio: 9/16,
    },
    audio: {
      id: '2',
      name: 'Afrobeat Vibes',
      artist: 'Burna Boy',
      url: '',
    },
    caption: 'Tech innovation meets African creativity! 🚀 Building the future from Tanzania 💙 #TechTZ #Innovation #Startup',
    hashtags: ['#TechTZ', '#Innovation', '#Startup', '#Africa', '#Technology'],
    mentions: [],
    stats: {
      views: 145890,
      likes: 28934,
      comments: 1456,
      shares: 892,
      saves: 2103,
    },
    interactions: {
      liked: true,
      saved: false,
      followed: true,
    },
    createdAt: new Date('2024-01-14T15:20:00Z'),
    updatedAt: new Date('2024-01-14T15:20:00Z'),
  },
  {
    id: '3',
    user: mockUsers[2],
    video: {
      url: 'https://sample-videos.com/zip/10/mp4/SampleVideo_360x240_5mb.mp4',
      thumbnail: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=600&fit=crop',
      duration: 25,
      aspectRatio: 9/16,
    },
    audio: {
      id: '3',
      name: 'Fashion Week',
      artist: 'Original Audio',
      url: '',
    },
    caption: 'Fashion meets tradition 💃 New Kitenge collection inspired by Tanzanite gems! Available now 👗✨',
    hashtags: ['#Fashion', '#Kitenge', '#Tanzania', '#Style', '#Handmade'],
    mentions: ['@tanzanitefashion'],
    stats: {
      views: 98765,
      likes: 19876,
      comments: 987,
      shares: 543,
      saves: 1876,
    },
    interactions: {
      liked: false,
      saved: true,
      followed: false,
    },
    products: [mockProducts[0], mockProducts[1]],
    createdAt: new Date('2024-01-13T09:15:00Z'),
    updatedAt: new Date('2024-01-13T09:15:00Z'),
  },
  {
    id: '4',
    user: mockUsers[3],
    video: {
      url: 'https://sample-videos.com/zip/10/mp4/SampleVideo_360x240_1mb.mp4',
      thumbnail: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=600&fit=crop',
      duration: 60,
      aspectRatio: 9/16,
    },
    audio: {
      id: '4',
      name: 'Entrepreneurship Motivation',
      artist: 'Original Audio',
      url: '',
    },
    caption: 'From zero to hero! 🚀 How I built my business using AI tools. Link in bio for the full course! #Entrepreneur #AI #Business',
    hashtags: ['#Entrepreneur', '#AI', '#Business', '#Success', '#Motivation'],
    mentions: [],
    stats: {
      views: 567890,
      likes: 67890,
      comments: 3456,
      shares: 2345,
      saves: 4567,
    },
    interactions: {
      liked: true,
      saved: true,
      followed: true,
    },
    isAd: true,
    createdAt: new Date('2024-01-12T14:45:00Z'),
    updatedAt: new Date('2024-01-12T14:45:00Z'),
  },
];

export const mockComments: { [reelId: string]: Comment[] } = {
  '1': [
    {
      id: '1',
      user: mockUsers[1],
      text: 'This is absolutely beautiful! Tanzania has such rich culture 🇹🇿❤️',
      likes: 234,
      replies: [
        {
          id: '1-1',
          user: mockUsers[0],
          text: 'Thank you so much! 🙏',
          likes: 45,
          replies: [],
          isLiked: false,
          isPinned: false,
          createdAt: new Date('2024-01-15T11:00:00Z'),
        }
      ],
      isLiked: true,
      isPinned: true,
      createdAt: new Date('2024-01-15T10:45:00Z'),
    },
    {
      id: '2',
      user: mockUsers[2],
      text: 'Love the traditional moves! Can you teach us? 💃',
      likes: 89,
      replies: [],
      isLiked: false,
      isPinned: false,
      createdAt: new Date('2024-01-15T11:15:00Z'),
    },
  ],
  '2': [
    {
      id: '3',
      user: mockUsers[0],
      text: 'Tech innovation in Africa is amazing! Keep it up brother 🚀',
      likes: 156,
      replies: [],
      isLiked: true,
      isPinned: false,
      createdAt: new Date('2024-01-14T15:30:00Z'),
    },
  ],
};

// Helper functions
export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toString();
}

export function formatCurrency(amount: number, currency: string): string {
  return new Intl.NumberFormat('sw-TZ', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
  }).format(amount);
}

export function getTimeAgo(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(hours / 24);
  
  if (days > 0) {
    return `${days}d ago`;
  }
  if (hours > 0) {
    return `${hours}h ago`;
  }
  return 'now';
}
