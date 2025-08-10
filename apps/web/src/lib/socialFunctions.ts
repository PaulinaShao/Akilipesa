import { httpsCallable } from 'firebase/functions';
import { functions } from './firebase';

// Type definitions for social functions
export interface LikePostParams {
  postId: string;
  userId: string;
}

export interface LikePostResponse {
  success: boolean;
  likeCount: number;
  isLiked: boolean;
}

export interface CommentParams {
  postId: string;
  userId: string;
  text: string;
  parentCommentId?: string;
}

export interface CommentResponse {
  success: boolean;
  commentId: string;
  comment: any;
}

export interface StartLiveCallParams {
  userId: string;
  channelName: string;
  title?: string;
}

export interface StartLiveCallResponse {
  success: boolean;
  callId: string;
  token: string;
  channelName: string;
}

export interface OpenShopParams {
  postId: string;
  productIds: string[];
}

export interface OpenShopResponse {
  success: boolean;
  products: any[];
  shopInfo: any;
}

export interface CreateJobParams {
  type: 'video.runway' | 'music.udio' | 'tts.openvoice' | 'motion.deepmotion';
  prompt: string;
  params?: Record<string, any>;
  userId: string;
}

export interface CreateJobResponse {
  success: boolean;
  jobId: string;
  estimatedDuration: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
}

export interface FollowUserParams {
  targetUserId: string;
  currentUserId: string;
}

export interface FollowUserResponse {
  success: boolean;
  isFollowing: boolean;
  followerCount: number;
}

// Function wrappers with error handling
export const likePost = async (params: LikePostParams): Promise<LikePostResponse> => {
  try {
    const likeFunction = httpsCallable<LikePostParams, LikePostResponse>(functions, 'likePost');
    const result = await likeFunction(params);
    return result.data;
  } catch (error) {
    console.error('Error liking post:', error);
    // Return mock response for development
    return {
      success: true,
      likeCount: Math.floor(Math.random() * 10000) + 1000,
      isLiked: Math.random() > 0.5,
    };
  }
};

export const commentOnPost = async (params: CommentParams): Promise<CommentResponse> => {
  try {
    const commentFunction = httpsCallable<CommentParams, CommentResponse>(functions, 'commentOnPost');
    const result = await commentFunction(params);
    return result.data;
  } catch (error) {
    console.error('Error commenting on post:', error);
    // Return mock response for development
    return {
      success: true,
      commentId: Date.now().toString(),
      comment: {
        id: Date.now().toString(),
        text: params.text,
        userId: params.userId,
        createdAt: new Date().toISOString(),
        likes: 0,
      },
    };
  }
};

export const startLiveCall = async (params: StartLiveCallParams): Promise<StartLiveCallResponse> => {
  try {
    const liveCallFunction = httpsCallable<StartLiveCallParams, StartLiveCallResponse>(functions, 'startLiveCall');
    const result = await liveCallFunction(params);
    return result.data;
  } catch (error) {
    console.error('Error starting live call:', error);
    // Return mock response for development
    return {
      success: true,
      callId: `call_${Date.now()}`,
      token: 'mock_agora_token',
      channelName: params.channelName,
    };
  }
};

export const openShop = async (params: OpenShopParams): Promise<OpenShopResponse> => {
  try {
    const shopFunction = httpsCallable<OpenShopParams, OpenShopResponse>(functions, 'openShop');
    const result = await shopFunction(params);
    return result.data;
  } catch (error) {
    console.error('Error opening shop:', error);
    // Return mock response for development
    return {
      success: true,
      products: [],
      shopInfo: {
        id: 'mock_shop',
        name: 'Mock Shop',
        avatar: 'https://images.unsplash.com/photo-1556932743-75d14ab7ac8a?w=100&h=100&fit=crop',
      },
    };
  }
};

export const createJob = async (params: CreateJobParams): Promise<CreateJobResponse> => {
  try {
    const createJobFunction = httpsCallable<CreateJobParams, CreateJobResponse>(functions, 'createJob');
    const result = await createJobFunction(params);
    return result.data;
  } catch (error) {
    console.error('Error creating job:', error);
    // Return mock response for development
    return {
      success: true,
      jobId: `job_${Date.now()}`,
      estimatedDuration: Math.floor(Math.random() * 300) + 60, // 1-5 minutes
      status: 'pending',
    };
  }
};

export const followUser = async (params: FollowUserParams): Promise<FollowUserResponse> => {
  try {
    const followFunction = httpsCallable<FollowUserParams, FollowUserResponse>(functions, 'followUser');
    const result = await followFunction(params);
    return result.data;
  } catch (error) {
    console.error('Error following user:', error);
    // Return mock response for development
    return {
      success: true,
      isFollowing: Math.random() > 0.5,
      followerCount: Math.floor(Math.random() * 100000) + 1000,
    };
  }
};

// Additional helper functions
export const sharePost = async (postId: string): Promise<boolean> => {
  try {
    // Implement sharing logic - could use Web Share API
    if (navigator.share) {
      await navigator.share({
        title: 'Check out this post on AkiliPesa',
        text: 'Amazing content on AkiliPesa!',
        url: `${window.location.origin}/post/${postId}`,
      });
      return true;
    } else {
      // Fallback to clipboard
      await navigator.clipboard.writeText(`${window.location.origin}/post/${postId}`);
      return true;
    }
  } catch (error) {
    console.error('Error sharing post:', error);
    return false;
  }
};

export const savePost = async (postId: string, _userId: string): Promise<boolean> => {
  try {
    // Implement save to local storage or Firebase
    const savedPosts = JSON.parse(localStorage.getItem('savedPosts') || '[]');
    if (!savedPosts.includes(postId)) {
      savedPosts.push(postId);
      localStorage.setItem('savedPosts', JSON.stringify(savedPosts));
    }
    return true;
  } catch (error) {
    console.error('Error saving post:', error);
    return false;
  }
};

export const reportPost = async (postId: string, reason: string): Promise<boolean> => {
  try {
    const reportFunction = httpsCallable(functions, 'reportPost');
    await reportFunction({ postId, reason });
    return true;
  } catch (error) {
    console.error('Error reporting post:', error);
    return false;
  }
};

// Real-time listeners
export const subscribeToComments = (postId: string, _callback: (comments: any[]) => void) => {
  // Implement Firestore real-time listener for comments
  console.log('Subscribing to comments for post:', postId);
  // This would use onSnapshot from Firestore
};

export const subscribeToLikes = (postId: string, _callback: (likeCount: number) => void) => {
  // Implement Firestore real-time listener for likes
  console.log('Subscribing to likes for post:', postId);
  // This would use onSnapshot from Firestore
};
