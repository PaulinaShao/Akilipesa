/**
 * Centralized route configuration for AkiliPesa
 * Includes navigation helpers and route guards
 */

export const ROUTES = {
  // Core navigation
  HOME: '/reels',
  SEARCH: '/search', 
  CREATE: '/create',
  INBOX: '/inbox',
  PROFILE: '/profile',
  
  // Auth
  LOGIN: '/login',
  SPLASH: '/splash',
  
  // Content
  REEL: '/reel/:id',
  PROFILE_USER: '/profile/:userId',
  INBOX_THREAD: '/inbox/:threadId',
  PRODUCT: '/product/:id',
  
  // Creation flows
  CREATE_CAMERA: '/create/camera',
  CREATE_LIVE: '/create/live',
  CREATE_EDITOR: '/create/editor',
  
  // AI & Jobs
  AI_CREATE: '/ai/create',
  JOBS: '/jobs',
  JOB_STATUS: '/jobs/:jobId',
  
  // Communication
  CALL: '/call/:channel',
  CALL_NEW: '/call/new',
  LIVE_SESSION: '/live/:channelId',
  CHAT_AI: '/chat/ai',
  CHAT_AKILI: '/chat/akili',
  
  // Commerce
  WALLET: '/wallet',
  PURCHASES: '/purchases',
  EARNINGS: '/earnings',
  CHECKOUT: '/checkout',
  
  // Admin & Settings
  SETTINGS: '/settings',
  ADMIN: '/admin',
  ANALYTICS: '/analytics',
  
  // Legal & Support
  TERMS: '/terms',
  PRIVACY: '/privacy',
  HELP: '/help',
  TRIAL_POLICY: '/trial-policy',
  
  // Error handling
  NOT_FOUND: '*',
} as const;

// Helper functions for route building
export function buildRoute(route: string, params: Record<string, string> = {}): string {
  let path = route;
  Object.entries(params).forEach(([key, value]) => {
    path = path.replace(`:${key}`, value);
  });
  return path;
}

export function buildReelRoute(id: string): string {
  return buildRoute(ROUTES.REEL, { id });
}

export function buildProfileRoute(userId: string): string {
  return buildRoute(ROUTES.PROFILE_USER, { userId });
}

export function buildInboxThreadRoute(threadId: string): string {
  return buildRoute(ROUTES.INBOX_THREAD, { threadId });
}

export function buildProductRoute(id: string): string {
  return buildRoute(ROUTES.PRODUCT, { id });
}

export function buildCallRoute(channel: string): string {
  return buildRoute(ROUTES.CALL, { channel });
}

export function buildJobStatusRoute(jobId: string): string {
  return buildRoute(ROUTES.JOB_STATUS, { jobId });
}

export function buildLiveSessionRoute(channelId: string): string {
  return buildRoute(ROUTES.LIVE_SESSION, { channelId });
}

// Route metadata for navigation
export interface RouteConfig {
  path: string;
  title: string;
  icon?: string;
  requiresAuth?: boolean;
  guestAccessible?: boolean;
  bottomNav?: boolean;
}

export const ROUTE_CONFIG: Record<string, RouteConfig> = {
  [ROUTES.HOME]: {
    path: ROUTES.HOME,
    title: 'Home',
    icon: 'Home',
    guestAccessible: true,
    bottomNav: true,
  },
  [ROUTES.SEARCH]: {
    path: ROUTES.SEARCH,
    title: 'Search',
    icon: 'Search',
    guestAccessible: true,
    bottomNav: true,
  },
  [ROUTES.CREATE]: {
    path: ROUTES.CREATE,
    title: 'Create',
    icon: 'Plus',
    guestAccessible: true,
    bottomNav: true,
  },
  [ROUTES.INBOX]: {
    path: ROUTES.INBOX,
    title: 'Inbox',
    icon: 'MessageCircle',
    guestAccessible: true,
    bottomNav: true,
  },
  [ROUTES.PROFILE]: {
    path: ROUTES.PROFILE,
    title: 'Profile',
    icon: 'User',
    guestAccessible: true,
    bottomNav: true,
  },
  [ROUTES.LOGIN]: {
    path: ROUTES.LOGIN,
    title: 'Sign In',
    requiresAuth: false,
    guestAccessible: true,
  },
  [ROUTES.WALLET]: {
    path: ROUTES.WALLET,
    title: 'Wallet',
    icon: 'Wallet',
    requiresAuth: true,
  },
  [ROUTES.SETTINGS]: {
    path: ROUTES.SETTINGS,
    title: 'Settings',
    icon: 'Settings',
    requiresAuth: true,
  },
  [ROUTES.ADMIN]: {
    path: ROUTES.ADMIN,
    title: 'Admin',
    requiresAuth: true,
  },
};

// Navigation helpers
export function getBottomNavRoutes(): RouteConfig[] {
  return Object.values(ROUTE_CONFIG).filter(route => route.bottomNav);
}

export function isPublicRoute(path: string): boolean {
  const config = Object.values(ROUTE_CONFIG).find(route => route.path === path);
  return config?.guestAccessible ?? false;
}

export function requiresAuthentication(path: string): boolean {
  const config = Object.values(ROUTE_CONFIG).find(route => route.path === path);
  return config?.requiresAuth ?? false;
}

// Route validation
export function isValidRoute(path: string): boolean {
  return Object.values(ROUTES).includes(path as any) || path === ROUTES.NOT_FOUND;
}

// Default routes for different user states
export const DEFAULT_ROUTES = {
  GUEST: ROUTES.HOME,
  AUTHENTICATED: ROUTES.HOME,
  ADMIN: ROUTES.ADMIN,
  ERROR: ROUTES.HOME,
} as const;
