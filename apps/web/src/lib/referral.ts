import { generateId } from './utils';

export interface ReferralLink {
  originalUrl: string;
  referralCode: string;
  referralUrl: string;
  userId: string;
  itemType: 'product' | 'reel' | 'user' | 'shop';
  itemId: string;
}

export interface ShareEarnConfig {
  productShare: number; // TSH amount earned per product share conversion
  reelShare: number;    // TSH amount earned per reel share
  userShare: number;    // TSH amount earned per user referral
  shopShare: number;    // TSH amount earned per shop referral
}

// Default earnings configuration
export const SHARE_EARN_CONFIG: ShareEarnConfig = {
  productShare: 500,  // 500 TSH per product purchase via referral
  reelShare: 100,     // 100 TSH per reel view milestone
  userShare: 1000,    // 1000 TSH per user signup via referral
  shopShare: 2000,    // 2000 TSH per shop follow via referral
};

/**
 * Generate a unique referral code for a user
 */
export function generateReferralCode(userId: string, itemType: string): string {
  const timestamp = Date.now().toString(36);
  const userPrefix = userId.slice(0, 3).toUpperCase();
  const typePrefix = itemType.slice(0, 1).toUpperCase();
  const randomSuffix = generateId().slice(0, 4).toUpperCase();
  
  return `${userPrefix}${typePrefix}${timestamp}${randomSuffix}`;
}

/**
 * Create a referral link for sharing content
 */
export function createReferralLink(
  userId: string,
  itemType: 'product' | 'reel' | 'user' | 'shop',
  itemId: string,
  baseUrl: string = window.location.origin
): ReferralLink {
  const referralCode = generateReferralCode(userId, itemType);
  
  // Determine the original URL based on item type
  let originalUrl = '';
  switch (itemType) {
    case 'product':
      originalUrl = `${baseUrl}/product/${itemId}`;
      break;
    case 'reel':
      originalUrl = `${baseUrl}/reels?reel=${itemId}`;
      break;
    case 'user':
      originalUrl = `${baseUrl}/profile/${itemId}`;
      break;
    case 'shop':
      originalUrl = `${baseUrl}/shop/${itemId}`;
      break;
  }
  
  // Create referral URL with code
  const referralUrl = `${originalUrl}?ref=${referralCode}`;
  
  return {
    originalUrl,
    referralCode,
    referralUrl,
    userId,
    itemType,
    itemId,
  };
}

/**
 * Extract referral code from URL
 */
export function extractReferralCode(url: string): string | null {
  try {
    const urlObj = new URL(url);
    return urlObj.searchParams.get('ref');
  } catch {
    return null;
  }
}

/**
 * Parse referral code to get information
 */
export function parseReferralCode(code: string): {
  userPrefix: string;
  itemType: string;
  timestamp: string;
} | null {
  if (code.length < 8) return null;
  
  try {
    const userPrefix = code.slice(0, 3);
    const typePrefix = code.slice(3, 4);
    const rest = code.slice(4);
    
    // Extract timestamp (first part before random suffix)
    const timestamp = rest.slice(0, -4);
    
    const typeMap: { [key: string]: string } = {
      'P': 'product',
      'R': 'reel',
      'U': 'user',
      'S': 'shop',
    };
    
    return {
      userPrefix,
      itemType: typeMap[typePrefix] || 'unknown',
      timestamp,
    };
  } catch {
    return null;
  }
}

/**
 * Calculate earnings for different share types
 */
export function calculateShareEarnings(
  itemType: 'product' | 'reel' | 'user' | 'shop',
  conversionType: 'view' | 'click' | 'purchase' | 'signup' | 'follow' = 'click'
): number {
  const config = SHARE_EARN_CONFIG;
  
  switch (itemType) {
    case 'product':
      return conversionType === 'purchase' ? config.productShare : 0;
    case 'reel':
      return conversionType === 'view' ? config.reelShare : 0;
    case 'user':
      return conversionType === 'signup' ? config.userShare : 0;
    case 'shop':
      return conversionType === 'follow' ? config.shopShare : 0;
    default:
      return 0;
  }
}

/**
 * Create share message with referral link
 */
export function createShareMessage(
  itemType: 'product' | 'reel' | 'user' | 'shop',
  itemName: string,
  referralUrl: string
): string {
  const messages = {
    product: `Check out this amazing product: ${itemName}! 🛍️\n\nShop now and get the best deals: ${referralUrl}\n\n#AkiliPesa #ShoppingDeals`,
    reel: `Watch this awesome video: ${itemName}! 🎥\n\nSee more on AkiliPesa: ${referralUrl}\n\n#AkiliPesa #Entertainment`,
    user: `Follow ${itemName} on AkiliPesa! 👤\n\nConnect and discover amazing content: ${referralUrl}\n\n#AkiliPesa #SocialNetwork`,
    shop: `Visit ${itemName} shop on AkiliPesa! 🏪\n\nDiscover their amazing products: ${referralUrl}\n\n#AkiliPesa #Shopping`,
  };
  
  return messages[itemType] || `Check this out on AkiliPesa: ${referralUrl}`;
}

/**
 * Share via platform with referral link
 */
export function shareVia(
  platform: 'whatsapp' | 'facebook' | 'twitter' | 'telegram' | 'copy',
  referralUrl: string,
  message: string
): void {
  const encodedMessage = encodeURIComponent(message);
  const encodedUrl = encodeURIComponent(referralUrl);
  
  let shareUrl = '';
  
  switch (platform) {
    case 'whatsapp':
      shareUrl = `https://wa.me/?text=${encodedMessage}`;
      break;
    case 'facebook':
      shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedMessage}`;
      break;
    case 'twitter':
      shareUrl = `https://twitter.com/intent/tweet?text=${encodedMessage}`;
      break;
    case 'telegram':
      shareUrl = `https://t.me/share/url?url=${encodedUrl}&text=${encodedMessage}`;
      break;
    case 'copy':
      navigator.clipboard.writeText(message);
      return;
  }
  
  if (shareUrl) {
    window.open(shareUrl, '_blank', 'width=600,height=400');
  }
}

/**
 * Track referral click/conversion (for analytics)
 */
export async function trackReferralEvent(
  referralCode: string,
  eventType: 'click' | 'view' | 'purchase' | 'signup' | 'follow',
  itemId: string
): Promise<void> {
  try {
    // This would normally call your analytics/tracking API
    const eventData = {
      referralCode,
      eventType,
      itemId,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
    };
    
    console.log('Tracking referral event:', eventData);
    
    // TODO: Replace with actual API call
    // await fetch('/api/referrals/track', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(eventData),
    // });
  } catch (error) {
    console.error('Failed to track referral event:', error);
  }
}
