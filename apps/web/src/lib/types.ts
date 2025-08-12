// AkiliPesa Production Data Models
// Comprehensive type definitions for all Firestore collections

export interface User {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  
  // Profile Information
  displayName: string;
  username?: string;
  avatar?: string;
  bio?: string;
  website?: string;
  
  // Contact Information
  email?: string;
  phone?: string;
  msisdn?: string; // E.164 format phone number
  
  // Account Status
  verified: boolean;
  kycStatus: 'pending' | 'verified' | 'rejected' | 'not_required';
  accountStatus: 'active' | 'suspended' | 'deactivated';
  
  // Subscription & Billing
  plan: 'free' | 'premium' | 'pro' | 'enterprise';
  planExpiry?: Date;
  trialUsed: boolean;
  
  // Wallet & Earnings
  wallet: {
    balance: number;
    currency: string;
    pendingEarnings: number;
    totalEarnings: number;
    lastPayoutAt?: Date;
  };
  
  // Social Connections
  socialHandles: {
    instagram?: string;
    tiktok?: string;
    youtube?: string;
    twitter?: string;
    whatsapp?: string;
  };
  
  // Usage Statistics
  stats: {
    followersCount: number;
    followingCount: number;
    reelsCount: number;
    likesReceived: number;
    callsCount: number;
    callMinutes: number;
    jobsCount: number;
  };
  
  // Settings & Preferences
  settings: {
    language: string;
    currency: string;
    timezone: string;
    notifications: {
      email: boolean;
      sms: boolean;
      push: boolean;
    };
    privacy: {
      profileVisible: boolean;
      allowMessages: boolean;
      allowCalls: boolean;
    };
  };
  
  // Authentication
  authProviders: string[];
  lastLoginAt?: Date;
  deviceTokens: string[];
}

export interface Clone {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  
  // Ownership
  ownerId: string;
  ownerUsername: string;
  
  // Clone Configuration
  name: string;
  description: string;
  avatar: string;
  persona: {
    personality: string;
    speaking_style: string;
    background: string;
    expertise: string[];
    language: string;
  };
  
  // Capabilities
  capabilities: {
    text: boolean;
    audio: boolean;
    video: boolean;
    realtime: boolean;
  };
  
  // Pricing
  pricing: {
    textPerMessage: number;
    audioPerMinute: number;
    videoPerMinute: number;
    currency: string;
  };
  
  // Status & Configuration
  status: 'training' | 'active' | 'paused' | 'disabled';
  visibility: 'public' | 'private' | 'premium';
  
  // Training Data
  trainingData: {
    voiceSamples: string[];
    textSamples: string[];
    videoSamples: string[];
    totalSamples: number;
  };
  
  // Usage Statistics
  stats: {
    totalConversations: number;
    totalMessages: number;
    totalMinutes: number;
    totalEarnings: number;
    avgRating: number;
    ratingCount: number;
  };
  
  // AI Configuration
  aiConfig: {
    model: string;
    temperature: number;
    maxTokens: number;
    systemPrompt: string;
    fallbackResponses: string[];
  };
}

export interface CatalogItem {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  
  // Basic Information
  title: string;
  description: string;
  category: string;
  tags: string[];
  
  // Media
  media: {
    primary: string; // Main image/video URL
    gallery: string[]; // Additional media URLs
    thumbnail: string;
  };
  
  // Pricing
  price: number;
  currency: string;
  salePrice?: number;
  
  // Commission Structure
  commission: {
    platform: number; // Platform commission %
    agent: number; // Agent commission %
    creator: number; // Creator earnings %
  };
  
  // Ownership
  ownerId: string;
  ownerUsername: string;
  
  // Product Details
  type: 'digital' | 'service' | 'consultation' | 'subscription';
  availability: 'in_stock' | 'out_of_stock' | 'limited' | 'pre_order';
  inventory?: number;
  
  // Delivery Information
  delivery: {
    method: 'instant' | 'scheduled' | 'call_based';
    estimatedTime?: string;
    instructions?: string;
  };
  
  // Branding
  watermark: {
    enabled: boolean;
    position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center';
    opacity: number;
  };
  
  // Status
  status: 'draft' | 'published' | 'suspended' | 'archived';
  visibility: 'public' | 'private' | 'premium_only';
  
  // Statistics
  stats: {
    views: number;
    purchases: number;
    revenue: number;
    avgRating: number;
    reviewCount: number;
  };
}

export interface Reel {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  
  // Ownership
  ownerId: string;
  ownerUsername: string;
  ownerDisplayName: string;
  ownerAvatar: string;
  ownerVerified: boolean;
  
  // Content
  title?: string;
  caption: string;
  hashtags: string[];
  mentions: string[];
  
  // Media
  media: {
    type: 'video' | 'image' | 'carousel';
    url: string;
    thumbnail: string;
    duration?: number;
    aspectRatio: number;
    width: number;
    height: number;
    fileSize: number;
  };
  
  // Audio
  audio?: {
    id: string;
    name: string;
    artist: string;
    url: string;
    duration: number;
  };
  
  // Location
  location?: {
    name: string;
    coordinates?: [number, number]; // [longitude, latitude]
    city?: string;
    country?: string;
  };
  
  // Commerce
  commerceLink?: string;
  catalogItems: string[]; // References to catalog items
  
  // Engagement
  stats: {
    views: number;
    likes: number;
    comments: number;
    shares: number;
    saves: number;
    purchases: number;
  };
  
  // Status & Visibility
  status: 'draft' | 'published' | 'archived' | 'reported';
  visibility: 'public' | 'followers' | 'private';
  
  // Moderation
  moderation: {
    approved: boolean;
    reviewedAt?: Date;
    flags: string[];
    ageRating: 'general' | 'teen' | 'mature';
  };
  
  // Analytics
  insights: {
    reach: number;
    impressions: number;
    engagementRate: number;
    topCountries: string[];
    topCities: string[];
    ageGroups: Record<string, number>;
    trafficSources: Record<string, number>;
  };
  
  // AI Generation (if applicable)
  aiGenerated?: {
    provider: string;
    model: string;
    prompt: string;
    parameters: Record<string, any>;
    jobId: string;
  };
}

export interface Job {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
  
  // Ownership
  userId: string;
  username: string;
  
  // Job Configuration
  type: 'image.sd' | 'video.gen' | 'voice.clone' | 'chat.vllm' | 'transcribe.whisper' | 'music.udio' | 'animation.deepmotion' | 'avatar.synthesia' | 'effects.runway' | 'creative.kaiber';
  provider: 'runpod' | 'openai' | 'udio' | 'runway' | 'deepmotion' | 'synthesia' | 'kaiber';
  
  // Input Data
  inputs: {
    prompt?: string;
    imageUrl?: string;
    videoUrl?: string;
    audioUrl?: string;
    style?: string;
    duration?: number;
    resolution?: string;
    parameters?: Record<string, any>;
  };
  
  // Processing Status
  status: 'queued' | 'processing' | 'completed' | 'failed' | 'cancelled';
  progress: number; // 0-100
  
  // Progress Details
  progressDetails?: {
    step: string;
    message?: string;
    estimatedTime?: number;
  };
  
  // Results
  outputs?: {
    url?: string;
    urls?: string[];
    metadata?: Record<string, any>;
    downloadUrl?: string;
    previewUrl?: string;
  };
  
  // Error Information
  error?: string;
  errorCode?: string;
  retryCount: number;
  maxRetries: number;
  
  // Billing
  billing: {
    cost: number;
    currency: string;
    tier: 'free' | 'premium';
    charged: boolean;
  };
  
  // Processing Details
  processing: {
    startedAt?: Date;
    estimatedCompletionAt?: Date;
    processingTimeMs?: number;
    queuePosition?: number;
    workerId?: string;
  };
  
  // Usage Context
  context?: {
    source: 'web' | 'mobile' | 'api';
    feature: string;
    sessionId?: string;
    reelId?: string;
  };
}

export interface Order {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  
  // Parties
  payerId: string;
  payerUsername: string;
  sellerId: string;
  sellerUsername: string;
  agentId?: string;
  agentUsername?: string;
  
  // Order Details
  itemId: string;
  itemType: 'catalog' | 'call' | 'consultation' | 'subscription';
  quantity: number;
  
  // Pricing
  itemPrice: number;
  totalAmount: number;
  currency: string;
  
  // Commission Breakdown
  commissions: {
    platform: number;
    agent: number;
    creator: number;
  };
  
  // Payment Information
  paymentId?: string;
  paymentMethod: 'mobile_money' | 'card' | 'bank_transfer' | 'crypto';
  
  // Status
  status: 'pending' | 'paid' | 'processing' | 'completed' | 'cancelled' | 'refunded';
  
  // Fulfillment
  fulfillment: {
    method: 'instant' | 'scheduled' | 'manual';
    status: 'pending' | 'in_progress' | 'completed' | 'failed';
    deliveredAt?: Date;
    trackingInfo?: string;
  };
  
  // Metadata
  metadata: {
    userAgent?: string;
    ipAddress?: string;
    utm?: Record<string, string>;
    referrer?: string;
  };
}

export interface Call {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  endedAt?: Date;
  
  // Channel Information
  channel: string;
  rtcProvider: 'agora' | 'zegocloud';
  
  // Participants
  participants: Array<{
    userId: string;
    username: string;
    role: 'host' | 'participant';
    joinedAt: Date;
    leftAt?: Date;
    duration: number; // in seconds
  }>;
  
  // Call Details
  type: 'private' | 'group' | 'public' | 'consultation';
  status: 'active' | 'ended' | 'failed';
  quality: 'low' | 'medium' | 'high' | 'ultra';
  
  // Duration & Billing
  totalMinutes: number;
  billableMinutes: number;
  tier: 'free' | 'premium';
  
  // Settlement
  settled: boolean;
  settlementId?: string;
  
  // Recording (if enabled)
  recording?: {
    enabled: boolean;
    url?: string;
    duration?: number;
    fileSize?: number;
  };
  
  // Analytics
  analytics: {
    networkQuality: Record<string, number>;
    audioQuality: Record<string, number>;
    videoQuality: Record<string, number>;
    reconnections: number;
    totalDataUsage: number;
  };
}

export interface Payment {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
  
  // Transaction Details
  amount: number;
  currency: string;
  type: 'purchase' | 'subscription' | 'call_charge' | 'payout' | 'refund';
  
  // Parties
  payerId?: string;
  payeeId?: string;
  
  // Gateway Information
  gateway: 'tigopesa' | 'stripe' | 'mpesa' | 'airtel' | 'tigo' | 'vodacom';
  gatewayTransactionId?: string;
  gatewayReference?: string;
  
  // Status
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled' | 'refunded';
  
  // Related Records
  orderId?: string;
  callId?: string;
  subscriptionId?: string;
  
  // Gateway Response
  gatewayResponse?: {
    code: string;
    message: string;
    raw: Record<string, any>;
  };
  
  // Fees
  fees: {
    gateway: number;
    platform: number;
    total: number;
  };
  
  // Metadata
  metadata: {
    description?: string;
    customerInfo?: Record<string, any>;
    utm?: Record<string, string>;
  };
}

export interface Share {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  
  // Content
  reelId: string;
  agentId?: string;
  
  // Target Platform
  target: 'instagram' | 'tiktok' | 'youtube' | 'whatsapp' | 'twitter' | 'system_share';
  
  // Share Data
  shareData: {
    caption: string;
    hashtags: string[];
    mediaUrl: string;
    thumbnailUrl?: string;
    trackingUrl: string;
  };
  
  // UTM Tracking
  utm: {
    source: string;
    medium: string;
    campaign: string;
    term?: string;
    content?: string;
  };
  
  // Status
  status: 'pending' | 'processing' | 'posted' | 'failed' | 'cancelled';
  
  // Platform Response
  platformResponse?: {
    postId?: string;
    url?: string;
    error?: string;
    metadata?: Record<string, any>;
  };
  
  // Analytics
  insights: {
    clicks: number;
    views: number;
    engagement: number;
    conversions: number;
    revenue: number;
  };
  
  // Watermark Configuration
  watermark: {
    applied: boolean;
    position: string;
    opacity: number;
    style: string;
  };
}

export interface Agent {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  
  // Basic Information
  name: string;
  description: string;
  avatar: string;
  
  // Owner Information
  ownerId: string;
  ownerUsername: string;
  
  // Agent Configuration
  type: 'reseller' | 'affiliate' | 'influencer' | 'brand_ambassador';
  status: 'active' | 'suspended' | 'pending_approval';
  
  // Commission Structure
  commissions: {
    defaultRate: number; // percentage
    categories: Record<string, number>; // category-specific rates
    minimumPayout: number;
    payoutSchedule: 'weekly' | 'monthly' | 'on_demand';
  };
  
  // Territory & Targeting
  territory: {
    countries: string[];
    cities: string[];
    languages: string[];
    demographics?: Record<string, any>;
  };
  
  // Performance Metrics
  stats: {
    totalSales: number;
    totalCommissions: number;
    conversionRate: number;
    clickThroughRate: number;
    averageOrderValue: number;
    customersReferred: number;
  };
  
  // Tracking
  tracking: {
    uniqueCode: string;
    trackingDomains: string[];
    attributionWindow: number; // days
    lastClickAttribution: boolean;
  };
  
  // Payout Information
  payouts: {
    method: 'mobile_money' | 'bank_transfer' | 'crypto';
    details: Record<string, any>;
    schedule: string;
    minimumAmount: number;
  };
}

// User Interaction Types
export interface UserInteraction {
  userId: string;
  targetId: string;
  targetType: 'user' | 'reel' | 'comment' | 'clone';
  action: 'like' | 'follow' | 'save' | 'share' | 'comment' | 'view' | 'purchase';
  timestamp: Date;
  metadata?: Record<string, any>;
}

// Notification Types
export interface Notification {
  id: string;
  userId: string;
  type: 'like' | 'comment' | 'follow' | 'purchase' | 'system' | 'payment' | 'job_complete';
  title: string;
  message: string;
  read: boolean;
  createdAt: Date;
  data?: Record<string, any>;
}

// Analytics Types
export interface AnalyticsEvent {
  id: string;
  userId?: string;
  sessionId: string;
  event: string;
  properties: Record<string, any>;
  timestamp: Date;
  source: 'web' | 'mobile' | 'api';
}

// System Configuration
export interface SystemConfig {
  id: string;
  updatedAt: Date;
  
  // Feature Flags
  features: Record<string, boolean>;
  
  // Rate Limits
  rateLimits: {
    guestJobs: number;
    guestCalls: number;
    userJobs: number;
    userCalls: number;
  };
  
  // Pricing
  pricing: {
    freeTierLimits: Record<string, number>;
    premiumRates: Record<string, number>;
    currency: string;
  };
  
  // AI Providers
  aiProviders: {
    runpod: {
      enabled: boolean;
      endpoints: Record<string, string>;
    };
    openai: {
      enabled: boolean;
      models: string[];
    };
    [key: string]: any;
  };
  
  // Social Integration
  socialPlatforms: Record<string, {
    enabled: boolean;
    apiEnabled: boolean;
    autoPostEnabled: boolean;
  }>;
}

// Re-export existing types for compatibility
export type { User as FeedUser, Product, Reel as FeedReel, Comment, LiveCallState } from '../features/feed/types';
export type { JobProgress, JobResult, JobType } from '../modules/jobs';

// Utility types
export type DocumentReference<T = any> = {
  id: string;
  path: string;
  data?: T;
};

export type Timestamp = {
  seconds: number;
  nanoseconds: number;
  toDate(): Date;
};

export type CollectionName = 
  | 'users'
  | 'clones'
  | 'catalog'
  | 'reels'
  | 'jobs'
  | 'orders'
  | 'calls'
  | 'payments'
  | 'shares'
  | 'agents'
  | 'notifications'
  | 'analytics'
  | 'system_config';

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T = any> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

// Error Types
export interface AppError {
  code: string;
  message: string;
  details?: Record<string, any>;
  timestamp: Date;
}

// Constants for type safety
export const USER_PLANS = ['free', 'premium', 'pro', 'enterprise'] as const;
export const USER_STATUSES = ['active', 'suspended', 'deactivated'] as const;
export const KYC_STATUSES = ['pending', 'verified', 'rejected', 'not_required'] as const;
export const JOB_STATUSES = ['queued', 'processing', 'completed', 'failed', 'cancelled'] as const;
export const ORDER_STATUSES = ['pending', 'paid', 'processing', 'completed', 'cancelled', 'refunded'] as const;
export const PAYMENT_STATUSES = ['pending', 'processing', 'completed', 'failed', 'cancelled', 'refunded'] as const;
export const CONTENT_STATUSES = ['draft', 'published', 'archived', 'reported'] as const;
export const VISIBILITY_LEVELS = ['public', 'private', 'followers', 'premium_only'] as const;
