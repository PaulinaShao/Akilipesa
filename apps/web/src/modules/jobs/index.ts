import { useState, useEffect, useCallback } from 'react';
import { startJob, subscribeJob, subscribeUserJobs, cancelJob, type Job, type JobInput } from '../api';
import { useAppStore } from '../../store';

export interface JobProgress {
  step: string;
  progress: number;
  message?: string;
}

export interface JobResult {
  url?: string;
  metadata?: Record<string, any>;
  downloadUrl?: string;
}

export interface UseJobReturn {
  job: Job | null;
  isLoading: boolean;
  error: string | null;
  progress: number;
  startJob: (inputs: JobInput) => Promise<string>;
  cancelJob: () => Promise<void>;
  retry: () => Promise<void>;
}

export interface UseUserJobsReturn {
  jobs: Job[];
  isLoading: boolean;
  refresh: () => void;
}

/**
 * Hook for managing a single job
 */
export function useJob(jobId?: string): UseJobReturn {
  const [job, setJob] = useState<Job | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastInputs, setLastInputs] = useState<JobInput | null>(null);

  // Subscribe to job updates
  useEffect(() => {
    if (!jobId) return;

    setIsLoading(true);
    setError(null);

    const unsubscribe = subscribeJob(jobId, (updatedJob) => {
      setJob(updatedJob);
      setIsLoading(false);

      if (updatedJob?.status === 'failed') {
        setError(updatedJob.error || 'Job failed');
      } else if (updatedJob?.status === 'completed') {
        setError(null);
      }
    });

    return unsubscribe;
  }, [jobId]);

  const handleStartJob = useCallback(async (inputs: JobInput): Promise<string> => {
    setIsLoading(true);
    setError(null);
    setLastInputs(inputs);

    try {
      const newJobId = await startJob(inputs.type, inputs);
      return newJobId;
    } catch (err: any) {
      setError(err.message || 'Failed to start job');
      setIsLoading(false);
      throw err;
    }
  }, []);

  const handleCancelJob = useCallback(async (): Promise<void> => {
    if (!job?.id) return;

    try {
      await cancelJob(job.id);
    } catch (err: any) {
      setError(err.message || 'Failed to cancel job');
    }
  }, [job?.id]);

  const retry = useCallback(async (): Promise<void> => {
    if (!lastInputs) return;
    await handleStartJob(lastInputs);
  }, [lastInputs, handleStartJob]);

  return {
    job,
    isLoading,
    error,
    progress: job?.progress || 0,
    startJob: handleStartJob,
    cancelJob: handleCancelJob,
    retry,
  };
}

/**
 * Hook for managing user's job list
 */
export function useUserJobs(): UseUserJobsReturn {
  const { user } = useAppStore();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) {
      setJobs([]);
      setIsLoading(false);
      return;
    }

    const unsubscribe = subscribeUserJobs(user.id, (userJobs) => {
      setJobs(userJobs);
      setIsLoading(false);
    });

    return unsubscribe;
  }, [user?.id]);

  const refresh = useCallback(() => {
    setIsLoading(true);
    // Trigger re-subscription
    if (user?.id) {
      const unsubscribe = subscribeUserJobs(user.id, (userJobs) => {
        setJobs(userJobs);
        setIsLoading(false);
      });
      return unsubscribe;
    }
  }, [user?.id]);

  return {
    jobs,
    isLoading,
    refresh,
  };
}

/**
 * Utility functions for job management
 */
export const JobUtils = {
  /**
   * Get job type display name
   */
  getJobTypeName(type: string): string {
    const names: Record<string, string> = {
      image: 'AI Image',
      video: 'AI Video',
      audio: 'AI Audio',
      voice: 'AI Voice',
      music: 'AI Music',
    };
    return names[type] || type;
  },

  /**
   * Get job status color
   */
  getStatusColor(status: string): string {
    const colors: Record<string, string> = {
      queued: 'text-yellow-400',
      processing: 'text-blue-400',
      completed: 'text-green-400',
      failed: 'text-red-400',
    };
    return colors[status] || 'text-gray-400';
  },

  /**
   * Get job status icon
   */
  getStatusIcon(status: string): string {
    const icons: Record<string, string> = {
      queued: '⏳',
      processing: '⚡',
      completed: '✅',
      failed: '❌',
    };
    return icons[status] || '❓';
  },

  /**
   * Format job duration
   */
  formatDuration(createdAt: Date, completedAt?: Date): string {
    const end = completedAt || new Date();
    const duration = end.getTime() - createdAt.getTime();
    
    if (duration < 1000) {
      return '< 1s';
    } else if (duration < 60000) {
      return `${Math.floor(duration / 1000)}s`;
    } else if (duration < 3600000) {
      return `${Math.floor(duration / 60000)}m`;
    } else {
      return `${Math.floor(duration / 3600000)}h`;
    }
  },

  /**
   * Check if job can be retried
   */
  canRetry(status: string): boolean {
    return status === 'failed';
  },

  /**
   * Check if job can be cancelled
   */
  canCancel(status: string): boolean {
    return status === 'queued' || status === 'processing';
  },

  /**
   * Get estimated completion time
   */
  getEstimatedTime(type: string): string {
    const estimates: Record<string, string> = {
      image: '30-60 seconds',
      video: '2-5 minutes',
      audio: '1-2 minutes',
      voice: '30-90 seconds',
      music: '1-3 minutes',
    };
    return estimates[type] || '1-5 minutes';
  },

  /**
   * Parse job metadata for display
   */
  parseMetadata(metadata?: Record<string, any>): Array<{ key: string; value: string }> {
    if (!metadata) return [];
    
    return Object.entries(metadata)
      .filter(([_, value]) => value !== null && value !== undefined)
      .map(([key, value]) => ({
        key: key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()),
        value: String(value)
      }));
  },

  /**
   * Generate shareable URL for completed job
   */
  getShareableUrl(job: Job): string | null {
    if (job.status !== 'completed' || !job.outputs?.url) {
      return null;
    }
    
    // In a real app, this would generate a public sharing URL
    return job.outputs.url;
  }
};

/**
 * Job type configurations for UI
 */
export const JobTypes = {
  image: {
    name: 'AI Image',
    description: 'Generate images from text prompts',
    icon: '🎨',
    estimatedTime: '30-60 seconds',
    inputs: ['prompt'],
    examples: [
      'A majestic lion in the African savanna at sunset',
      'Modern minimalist living room with plants',
      'Futuristic city skyline with flying cars'
    ]
  },
  video: {
    name: 'AI Video',
    description: 'Create videos from prompts or images',
    icon: '🎬',
    estimatedTime: '2-5 minutes',
    inputs: ['prompt', 'imageUrl'],
    examples: [
      'Waves crashing on a tropical beach',
      'Time-lapse of a flower blooming',
      'Abstract liquid motion in slow motion'
    ]
  },
  voice: {
    name: 'AI Voice',
    description: 'Clone and generate realistic voices',
    icon: '🎤',
    estimatedTime: '30-90 seconds',
    inputs: ['text', 'voiceStyle'],
    examples: [
      'Professional announcement voice',
      'Friendly conversational tone',
      'Dramatic storytelling voice'
    ]
  },
  music: {
    name: 'AI Music',
    description: 'Compose music from descriptions',
    icon: '🎵',
    estimatedTime: '1-3 minutes',
    inputs: ['prompt', 'genre', 'duration'],
    examples: [
      'Upbeat jazz piano for a coffee shop',
      'Epic orchestral theme for adventure',
      'Relaxing ambient music for meditation'
    ]
  }
} as const;

export type JobType = keyof typeof JobTypes;
