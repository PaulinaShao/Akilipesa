export interface User {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  verified: boolean;
  isLive?: boolean;
  followersCount: number;
  isFollowing?: boolean;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  currency: string;
  image: string;
  shop: {
    id: string;
    name: string;
    avatar: string;
  };
  inStock: boolean;
}

export interface Reel {
  id: string;
  user: User;
  video: {
    url: string;
    thumbnail: string;
    duration: number;
    aspectRatio: number;
  };
  audio: {
    id: string;
    name: string;
    artist: string;
    url: string;
  };
  caption: string;
  hashtags: string[];
  mentions: string[];
  location?: {
    name: string;
    coordinates?: [number, number];
  };
  stats: {
    views: number;
    likes: number;
    comments: number;
    shares: number;
    saves: number;
  };
  interactions: {
    liked: boolean;
    saved: boolean;
    followed: boolean;
  };
  products?: Product[];
  isAd?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Comment {
  id: string;
  user: User;
  text: string;
  likes: number;
  replies: Comment[];
  isLiked: boolean;
  isPinned: boolean;
  createdAt: Date;
}

export interface LiveCallState {
  isActive: boolean;
  callId?: string;
  participants: number;
  duration: number;
}
