export interface Job {
  id: string;
  type: 'udio' | 'runway' | 'deepmotion' | 'tts';
  title: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  createdAt: Date;
  completedAt?: Date;
  prompt?: string;
  result?: string;
  progress?: number;
}

export interface Call {
  id: string;
  channelName: string;
  participants: string[];
  startTime: Date;
  endTime?: Date;
  duration?: number;
  status: 'active' | 'ended';
}

export interface Payment {
  id: string;
  amount: number;
  currency: string;
  method: 'tigo_pesa' | 'airtel_money' | 'vodacom_mpesa';
  status: 'pending' | 'completed' | 'failed';
  createdAt: Date;
  description: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  credits: number;
  plan: 'free' | 'basic' | 'premium';
  createdAt: Date;
}

// Mock data for development
export const mockJobs: Job[] = [
  {
    id: 'job_001',
    type: 'udio',
    title: 'AI Music Generation',
    status: 'completed',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    completedAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
    prompt: 'Create an upbeat Afrobeat song with traditional instruments',
    result: 'https://example.com/generated-music.mp3',
    progress: 100,
  },
  {
    id: 'job_002',
    type: 'runway',
    title: 'Video Generation',
    status: 'processing',
    createdAt: new Date(Date.now() - 30 * 60 * 1000),
    prompt: 'Generate a video of Tanzanian landscape with wildlife',
    progress: 65,
  },
  {
    id: 'job_003',
    type: 'tts',
    title: 'Swahili Voice Synthesis',
    status: 'pending',
    createdAt: new Date(Date.now() - 5 * 60 * 1000),
    prompt: 'Convert text to natural Swahili speech',
    progress: 0,
  },
];

export const mockCalls: Call[] = [
  {
    id: 'call_001',
    channelName: 'financial_consultation_001',
    participants: ['user_001', 'ai_assistant'],
    startTime: new Date(Date.now() - 15 * 60 * 1000),
    status: 'active',
  },
  {
    id: 'call_002',
    channelName: 'budget_planning_002',
    participants: ['user_001', 'ai_assistant'],
    startTime: new Date(Date.now() - 2 * 60 * 60 * 1000),
    endTime: new Date(Date.now() - 1.5 * 60 * 60 * 1000),
    duration: 30 * 60, // 30 minutes
    status: 'ended',
  },
];

export const mockPayments: Payment[] = [
  {
    id: 'pay_001',
    amount: 10000,
    currency: 'TSH',
    method: 'tigo_pesa',
    status: 'completed',
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    description: 'Credits purchase - 100 credits',
  },
  {
    id: 'pay_002',
    amount: 25000,
    currency: 'TSH',
    method: 'vodacom_mpesa',
    status: 'completed',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    description: 'Premium plan upgrade',
  },
  {
    id: 'pay_003',
    amount: 5000,
    currency: 'TSH',
    method: 'airtel_money',
    status: 'pending',
    createdAt: new Date(Date.now() - 10 * 60 * 1000),
    description: 'Credits purchase - 50 credits',
  },
];

export const mockUser: User = {
  id: 'user_001',
  name: 'Amina Hassan',
  email: 'amina.hassan@example.com',
  phone: '+255712345678',
  credits: 150,
  plan: 'basic',
  createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
};

// Helper functions for mock data
export function getMockJobs(): Job[] {
  return [...mockJobs];
}

export function getMockCalls(): Call[] {
  return [...mockCalls];
}

export function getMockPayments(): Payment[] {
  return [...mockPayments];
}

export function getMockUser(): User {
  return { ...mockUser };
}

export function createMockJob(type: Job['type'], prompt: string): Job {
  return {
    id: `job_${Date.now()}`,
    type,
    title: `${type.charAt(0).toUpperCase() + type.slice(1)} Generation`,
    status: 'pending',
    createdAt: new Date(),
    prompt,
    progress: 0,
  };
}
