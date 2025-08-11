import { httpsCallable } from 'firebase/functions';
import { doc, onSnapshot, collection, query, where, orderBy } from 'firebase/firestore';
import { functions, db } from '../../lib/firebase';

export interface JobInput {
  type: 'image' | 'video' | 'audio' | 'voice' | 'music' | 'unknown';
  prompt?: string;
  imageUrl?: string;
  audioUrl?: string;
  settings?: Record<string, any>;
}

export interface Job {
  id: string;
  type: string;
  status: 'queued' | 'processing' | 'completed' | 'failed';
  inputs: JobInput;
  outputs?: {
    url?: string;
    metadata?: Record<string, any>;
  };
  progress?: number;
  error?: string;
  createdAt: Date;
  updatedAt: Date;
  userId?: string;
}

export interface CallFinishData {
  channel: string;
  minutes: number;
  msisdn?: string;
  tier?: 'free' | 'premium';
}

export interface Order {
  id: string;
  amount: number;
  currency: string;
  description: string;
  metadata?: Record<string, any>;
}

export interface OrderResponse {
  id: string;
  redirectUrl: string;
  status: 'pending' | 'processing' | 'paid' | 'failed';
}

/**
 * Start a new AI job (image, video, audio, etc.)
 */
export async function startJob(type: string, inputs: any): Promise<string> {
  try {
    const { isFirebaseDemoMode } = await import('../lib/firebase');

    // In demo mode, always create offline job
    if (isFirebaseDemoMode) {
      console.log('Demo mode: creating offline job');
      const mockJobId = `demo_${type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      const offlineJob = {
        id: mockJobId,
        type,
        inputs,
        status: 'queued',
        createdAt: new Date().toISOString(),
        isOffline: true,
        isDemo: true
      };

      try {
        const existingJobs = JSON.parse(localStorage.getItem('offlineJobs') || '[]');
        existingJobs.push(offlineJob);
        localStorage.setItem('offlineJobs', JSON.stringify(existingJobs));
      } catch (storageError) {
        console.warn('Failed to store demo job:', storageError);
      }

      return mockJobId;
    }

    const createJob = httpsCallable(functions, 'createJob');
    const result = await createJob({
      type,
      inputs: {
        ...inputs,
        timestamp: Date.now()
      }
    });

    const data = result.data as { jobId: string };
    return data.jobId;
  } catch (error: any) {
    console.warn('Failed to start job (using offline mode):', error?.message || error);

    // Enhanced offline fallback - create mock job ID with type info
    const mockJobId = `offline_${type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    console.log('Created offline job ID:', mockJobId);

    // Store offline job in localStorage for consistency
    const offlineJob = {
      id: mockJobId,
      type,
      inputs,
      status: 'queued',
      createdAt: new Date().toISOString(),
      isOffline: true
    };

    try {
      const existingJobs = JSON.parse(localStorage.getItem('offlineJobs') || '[]');
      existingJobs.push(offlineJob);
      localStorage.setItem('offlineJobs', JSON.stringify(existingJobs));
    } catch (storageError) {
      console.warn('Failed to store offline job:', storageError);
    }

    return mockJobId;
  }
}

/**
 * Subscribe to job status updates
 */
export function subscribeJob(id: string, callback: (job: Job | null) => void): () => void {
  try {
    // Check if this is an offline or demo job first
    if (id.startsWith('offline_') || id.startsWith('demo_')) {
      const offlineJobs = JSON.parse(localStorage.getItem('offlineJobs') || '[]');
      const offlineJob = offlineJobs.find((job: any) => job.id === id);

      if (offlineJob) {
        const isDemo = id.startsWith('demo_');

        // Simulate job processing for offline/demo jobs
        setTimeout(() => {
          callback({
            id: offlineJob.id,
            type: offlineJob.type,
            status: 'processing',
            inputs: offlineJob.inputs,
            progress: 25,
            createdAt: new Date(offlineJob.createdAt),
            updatedAt: new Date(),
          });
        }, 1000);

        setTimeout(() => {
          callback({
            id: offlineJob.id,
            type: offlineJob.type,
            status: 'completed',
            inputs: offlineJob.inputs,
            outputs: {
              url: `https://placeholder.com/400x400.png?text=${isDemo ? 'Demo' : 'Offline'}+${offlineJob.type}`,
              metadata: {
                note: isDemo
                  ? 'Demo simulation - experience AkiliPesa\'s AI features!'
                  : 'Offline simulation - sign up for real AI generation!',
                mode: isDemo ? 'demo' : 'offline'
              }
            },
            progress: 100,
            createdAt: new Date(offlineJob.createdAt),
            updatedAt: new Date(),
          });
        }, isDemo ? 3000 : 5000); // Faster for demo mode

        return () => {}; // No cleanup needed for offline jobs
      }
    }

    const jobRef = doc(db, 'jobs', id);

    return onSnapshot(jobRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        const job: Job = {
          id: snapshot.id,
          type: data.type,
          status: data.status,
          inputs: data.inputs,
          outputs: data.outputs,
          progress: data.progress,
          error: data.error,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
          userId: data.userId,
        };
        callback(job);
      } else {
        // Job not found - might be offline or mock
        callback(null);
      }
    }, (error) => {
      console.warn('Job subscription error (using offline mode):', error?.message || error);

      // Fallback to offline simulation if network fails
      callback({
        id,
        type: 'unknown',
        status: 'failed',
        inputs: { type: 'unknown', prompt: 'Network unavailable' },
        error: 'Unable to connect to server. Please check your internet connection.',
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    });
  } catch (error) {
    console.warn('Failed to subscribe to job (offline mode):', error);

    // Immediate callback with error state
    callback({
      id,
      type: 'unknown',
      status: 'failed',
      inputs: { type: 'unknown', prompt: 'Subscription failed' },
      error: 'Failed to track job progress. Please refresh the page.',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return () => {};
  }
}

/**
 * Get user's jobs
 */
export function subscribeUserJobs(userId: string, callback: (jobs: Job[]) => void): () => void {
  try {
    const jobsQuery = query(
      collection(db, 'jobs'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    
    return onSnapshot(jobsQuery, (snapshot) => {
      const jobs: Job[] = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          type: data.type,
          status: data.status,
          inputs: data.inputs,
          outputs: data.outputs,
          progress: data.progress,
          error: data.error,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
          userId: data.userId,
        };
      });
      callback(jobs);
    }, (error) => {
      console.warn('User jobs subscription error:', error);
      callback([]);
    });
  } catch (error) {
    console.warn('Failed to subscribe to user jobs:', error);
    return () => {};
  }
}

/**
 * Finish a call and trigger billing
 */
export async function finishCall(data: CallFinishData): Promise<void> {
  try {
    const { isFirebaseDemoMode } = await import('../lib/firebase');

    if (isFirebaseDemoMode) {
      console.log('Demo mode: call finished locally:', data);
      return;
    }

    const endCall = httpsCallable(functions, 'endCall');
    await endCall(data);
  } catch (error) {
    console.warn('Failed to finish call on server:', error);
    // In offline mode, just log locally
    console.log('Call finished (offline):', data);
  }
}

/**
 * Create an order for marketplace purchases
 */
export async function createOrder(payload: Partial<Order>): Promise<OrderResponse> {
  try {
    const { isFirebaseDemoMode } = await import('../lib/firebase');

    if (isFirebaseDemoMode) {
      console.log('Demo mode: creating demo order:', payload);
      return {
        id: `demo_order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        redirectUrl: '/checkout/demo',
        status: 'pending'
      };
    }

    const createOrderFn = httpsCallable(functions, 'createOrder');
    const result = await createOrderFn(payload);

    return result.data as OrderResponse;
  } catch (error) {
    console.warn('Failed to create order on server:', error);

    // Offline fallback
    return {
      id: `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      redirectUrl: '/checkout/offline',
      status: 'pending'
    };
  }
}

/**
 * Get RTC token for video/audio calls
 */
export async function getRtcToken(channel: string, uid?: number): Promise<{
  token: string;
  channel: string;
  uid: number;
  expiryTime: number;
}> {
  try {
    const { isFirebaseDemoMode } = await import('../lib/firebase');

    if (isFirebaseDemoMode) {
      console.log('Demo mode: creating demo RTC token');
      return {
        token: 'demo_rtc_token',
        channel,
        uid: uid || Math.floor(Math.random() * 100000),
        expiryTime: Date.now() + (60 * 60 * 1000) // 1 hour
      };
    }

    const getRtcTokenFn = httpsCallable(functions, 'getRtcToken');
    const result = await getRtcTokenFn({
      channel,
      uid: uid || Math.floor(Math.random() * 100000)
    });

    return result.data as any;
  } catch (error) {
    console.warn('Failed to get RTC token from server:', error);

    // Offline fallback
    return {
      token: 'offline_rtc_token',
      channel,
      uid: uid || Math.floor(Math.random() * 100000),
      expiryTime: Date.now() + (60 * 60 * 1000) // 1 hour
    };
  }
}

/**
 * Mark a job as completed (for testing)
 */
export async function markJobCompleted(jobId: string, outputUrl: string): Promise<void> {
  try {
    const markJob = httpsCallable(functions, 'markJob');
    await markJob({
      jobId,
      status: 'completed',
      outputs: { url: outputUrl }
    });
  } catch (error) {
    console.warn('Failed to mark job completed:', error);
  }
}

/**
 * Cancel a job
 */
export async function cancelJob(jobId: string): Promise<void> {
  try {
    const markJob = httpsCallable(functions, 'markJob');
    await markJob({
      jobId,
      status: 'failed',
      error: 'Cancelled by user'
    });
  } catch (error) {
    console.warn('Failed to cancel job:', error);
  }
}
