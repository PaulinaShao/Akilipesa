import { isGuest } from '@/lib/guards';
import { Trial } from '@/state/guestTrialStore';

/**
 * Checks if user is authenticated, shows upsell if guest
 * @returns Promise<boolean> - true if authenticated, false if guest (and upsell shown)
 */
export async function ensureAuthOrUpsell(): Promise<boolean> {
  if (isGuest()) {
    // Will be handled by the component calling this
    return false;
  }
  return true;
}

/**
 * Toggle like on content with optimistic UI
 */
export async function toggleLike(contentId: string, contentType: 'reel' | 'comment' = 'reel'): Promise<void> {
  console.log(`Toggling like for ${contentType}:`, contentId);
  
  try {
    // In a real app, this would call Firebase Functions
    // const toggleLikeFn = httpsCallable(functions, 'toggleLike');
    // await toggleLikeFn({ contentId, contentType });
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
  } catch (error) {
    console.error('Failed to toggle like:', error);
    // Re-throw for optimistic UI rollback
    throw error;
  }
}

/**
 * Add comment to content
 */
export async function addComment(contentId: string, text: string, replyToId?: string): Promise<void> {
  console.log('Adding comment:', { contentId, text, replyToId });
  
  try {
    // Check trial limits for guests
    if (isGuest()) {
      if (!Trial.canChat()) {
        throw new Error('Guest comment limit exceeded');
      }
    }
    
    // In a real app, this would call Firebase Functions
    // const addCommentFn = httpsCallable(functions, 'addComment');
    // await addCommentFn({ contentId, text, replyToId });
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
  } catch (error) {
    console.error('Failed to add comment:', error);
    throw error;
  }
}

/**
 * Attach affiliate tag to URL for earning tracking
 */
export async function attachAffiliateTag(url: string, userId?: string): Promise<string> {
  console.log('Attaching affiliate tag to:', url);
  
  try {
    // In a real app, this would call Firebase Functions to generate tracked URL
    // const createAffiliateLinkFn = httpsCallable(functions, 'createAffiliateLink');
    // const result = await createAffiliateLinkFn({ url, userId });
    // return result.data.affiliateUrl;
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Mock affiliate URL
    const affiliateId = userId || 'guest';
    const timestamp = Date.now();
    return `${url}?ref=${encodeURIComponent(affiliateId)}&aff=1&t=${timestamp}`;
    
  } catch (error) {
    console.error('Failed to create affiliate link:', error);
    // Return original URL as fallback
    return url;
  }
}

/**
 * Start call flow - handles auth check and creates call session
 */
export async function startCallFlow(
  targetId: string,
  type: 'audio' | 'video',
  privacy: 'private' | 'public' = 'private',
  inviteIds: string[] = []
): Promise<{ channel: string; rtcToken?: string }> {
  console.log('Starting call flow:', { targetId, type, privacy, inviteIds });
  
  try {
    // Check trial limits for guests
    if (isGuest()) {
      const callResult = await Trial.useCall();
      if (!callResult.success) {
        throw new Error('Guest call limit exceeded');
      }
    }
    
    // In a real app, this would call Firebase Functions
    // const startCallFn = httpsCallable(functions, 'startCall');
    // const result = await startCallFn({ targetId, type, privacy, inviteIds });
    // return result.data;
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Mock call session
    const channel = `call_${targetId}_${Date.now()}`;
    const rtcToken = `mock_rtc_token_${Math.random().toString(36).substr(2, 9)}`;
    
    return { channel, rtcToken };
    
  } catch (error) {
    console.error('Failed to start call:', error);
    throw error;
  }
}

/**
 * Finish call and handle billing
 */
export async function finishCall(
  channel: string, 
  minutes: number, 
  msisdn?: string, 
  tier: 'free' | 'premium' = 'free'
): Promise<void> {
  console.log('Finishing call:', { channel, minutes, msisdn, tier });
  
  try {
    // In a real app, this would call Firebase Functions
    // const finishCallFn = httpsCallable(functions, 'finishCall');
    // await finishCallFn({ channel, minutes, msisdn, tier });
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
  } catch (error) {
    console.error('Failed to finish call:', error);
    // Don't throw - call ending should not fail
  }
}

/**
 * Follow/unfollow user
 */
export async function toggleFollow(userId: string): Promise<boolean> {
  console.log('Toggling follow for user:', userId);
  
  try {
    // In a real app, this would call Firebase Functions
    // const toggleFollowFn = httpsCallable(functions, 'toggleFollow');
    // const result = await toggleFollowFn({ userId });
    // return result.data.isFollowing;
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 400));
    
    // Mock follow state (random for demo)
    return Math.random() > 0.5;
    
  } catch (error) {
    console.error('Failed to toggle follow:', error);
    throw error;
  }
}

/**
 * Share content with tracking
 */
export async function trackShare(
  contentId: string,
  platform: string,
  hasAffiliate: boolean = false
): Promise<void> {
  console.log('Tracking share:', { contentId, platform, hasAffiliate });
  
  try {
    // In a real app, this would call Firebase Functions
    // const trackShareFn = httpsCallable(functions, 'trackShare');
    // await trackShareFn({ contentId, platform, hasAffiliate });
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 200));
    
  } catch (error) {
    console.error('Failed to track share:', error);
    // Don't throw - sharing should not fail due to tracking issues
  }
}

/**
 * Get content details for sharing
 */
export async function getContentForSharing(contentId: string): Promise<{
  id: string;
  type: 'reel' | 'product' | 'live';
  title: string;
  creator: string;
  url: string;
  thumbnailUrl?: string;
}> {
  console.log('Getting content for sharing:', contentId);
  
  try {
    // In a real app, this would fetch from Firestore
    // const contentDoc = await getDoc(doc(db, 'content', contentId));
    // return contentDoc.data();
    
    // Mock content data
    return {
      id: contentId,
      type: 'reel',
      title: 'Amazing Tanzanian dance moves! 🇹🇿✨',
      creator: 'Amina Hassan',
      url: `https://akilipesa.com/reel/${contentId}`,
      thumbnailUrl: 'https://images.unsplash.com/photo-1533929736458-ca588d08c8be?w=400&h=700&fit=crop'
    };
    
  } catch (error) {
    console.error('Failed to get content:', error);
    throw error;
  }
}

/**
 * Get user's trial/quota status
 */
export function getTrialStatus() {
  return Trial.getUsageStatus();
}

/**
 * Check if action is allowed for current user
 */
export function canPerformAction(action: 'like' | 'comment' | 'call' | 'create'): boolean {
  if (!isGuest()) return true;
  
  switch (action) {
    case 'like':
    case 'comment':
      return false; // Guests can't like or comment
    case 'call':
      return Trial.canStartCall();
    case 'create':
      return Trial.canJob();
    default:
      return false;
  }
}
