import { call } from './firebase';
import { auth } from './firebase';

// AI jobs
export async function startJob(type: string, inputs: any) {
  const res = await call<{type:string,inputs:any},{jobId:string}>('createJob')({ type, inputs });
  return res.data.jobId;
}

// Agora tokens
export async function getRtc() {
  const res = await call<{}, {channel:string, uid:number, token:string, appId:string}>('getRtcToken')({});
  return res.data;
}

export async function endCall(payload: {channel:string, minutes:number, msisdn?:string, tier?:'free'|'premium'}) {
  await call<typeof payload, {ok:true}>('endCall')(payload);
}

// Payments
export async function createOrder(payload: any) {
  const res = await call<any, {paymentLink:string}>('payments-createOrder')(payload);
  return res.data.paymentLink;
}

// User permissions and interactions
export function canPerformAction(action: 'like' | 'comment' | 'follow' | 'call' | 'share' | 'shop'): boolean {
  // Check if user is authenticated
  const user = auth.currentUser;
  if (!user || user.isAnonymous) {
    return false; // Require auth for all actions
  }
  return true;
}

// Social interactions
export async function toggleLike(contentId: string): Promise<{liked: boolean, count: number}> {
  // In a real app, this would call the backend
  // For now, return mock data
  return {
    liked: Math.random() > 0.5,
    count: Math.floor(Math.random() * 1000) + 100
  };
}

export async function toggleFollow(userId: string): Promise<{following: boolean}> {
  // In a real app, this would call the backend
  return {
    following: Math.random() > 0.5
  };
}

// Content sharing
export function getContentForSharing(contentId: string): {url: string, title: string, description: string} {
  return {
    url: `${window.location.origin}/reel/${contentId}`,
    title: 'Check out this amazing content on AkiliPesa!',
    description: 'Discover amazing content and creators on AkiliPesa - Tanzania\'s premier social commerce platform.'
  };
}

// Call flow
export async function startCallFlow(targetUserId: string, callType: 'audio' | 'video' = 'audio'): Promise<{success: boolean, channelId?: string}> {
  try {
    // Get RTC token for the call
    const rtcData = await getRtc();

    // In a real app, you would:
    // 1. Create a call record in the database
    // 2. Send notification to target user
    // 3. Return channel info for both users

    return {
      success: true,
      channelId: rtcData.channel
    };
  } catch (error) {
    console.error('Failed to start call:', error);
    return {
      success: false
    };
  }
}
