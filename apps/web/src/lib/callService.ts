import AgoraRTC, { 
  IAgoraRTCClient, 
  ILocalVideoTrack, 
  ILocalAudioTrack, 
  IRemoteVideoTrack, 
  IRemoteAudioTrack,
  ClientRole 
} from 'agora-rtc-sdk-ng';

export interface CallConfig {
  appId: string;
  channel: string;
  token: string;
  uid: string | number;
  type: 'audio' | 'video';
}

export interface CallParticipant {
  uid: string | number;
  name?: string;
  avatar?: string;
  isLocal: boolean;
  audioTrack?: ILocalAudioTrack | IRemoteAudioTrack;
  videoTrack?: ILocalVideoTrack | IRemoteVideoTrack;
  isMuted: boolean;
  isVideoOff: boolean;
}

export interface CallMetrics {
  duration: number; // in seconds
  creditsUsed: number;
  creditsPerSecond: number;
  remainingCredits: number;
}

export interface StartCallParams {
  type: 'audio' | 'video';
  agentId?: string;
  targetId?: string;
}

export interface CreateRtcTokenResponse {
  token: string;
  channel: string;
  uid: number;
  appId: string;
  expiresAt: number;
}

class CallService {
  private client: IAgoraRTCClient | null = null;
  private localAudioTrack: ILocalAudioTrack | null = null;
  private localVideoTrack: ILocalVideoTrack | null = null;
  private participants = new Map<string | number, CallParticipant>();
  private callStartTime: number = 0;
  private metricsInterval: number | null = null;
  private onMetricsUpdate?: (metrics: CallMetrics) => void;
  private onParticipantUpdate?: (participants: CallParticipant[]) => void;
  private onCallEnd?: () => void;

  // Credit configuration
  private readonly CREDITS_PER_SECOND = {
    audio: 2,  // 2 credits per second for audio calls
    video: 5,  // 5 credits per second for video calls
  };

  constructor() {
    // Initialize Agora RTC client
    this.client = AgoraRTC.createClient({ 
      mode: 'rtc', 
      codec: 'vp8',
      role: 'host' as ClientRole
    });
  }

  /**
   * Start a new call
   */
  async startCall(params: StartCallParams, userCredits: number): Promise<CallConfig> {
    try {
      // Check if user has sufficient credits
      const estimatedCost = this.CREDITS_PER_SECOND[params.type];
      if (userCredits < estimatedCost * 10) { // Require at least 10 seconds worth of credits
        throw new Error(`Insufficient credits. You need at least ${estimatedCost * 10} credits for a ${params.type} call.`);
      }

      // Get RTC token from server
      const tokenResponse = await this.createRtcToken(params);
      
      // Initialize call
      const callConfig: CallConfig = {
        appId: tokenResponse.appId,
        channel: tokenResponse.channel,
        token: tokenResponse.token,
        uid: tokenResponse.uid,
        type: params.type,
      };

      await this.joinCall(callConfig);
      
      return callConfig;
    } catch (error) {
      console.error('Failed to start call:', error);
      throw error;
    }
  }

  /**
   * Create RTC token by calling the API
   */
  private async createRtcToken(params: StartCallParams): Promise<CreateRtcTokenResponse> {
    try {
      // For demo purposes, we'll mock the API response
      // In production, this would call /api/createRtcToken
      const mockResponse: CreateRtcTokenResponse = {
        token: 'mock-agora-token-' + Date.now(),
        channel: `call-${params.targetId || params.agentId || 'agent'}-${Date.now()}`,
        uid: Math.floor(Math.random() * 10000),
        appId: import.meta.env.VITE_AGORA_APP_ID || 'mock-app-id',
        expiresAt: Date.now() + (24 * 60 * 60 * 1000), // 24 hours
      };

      // TODO: Replace with actual API call
      // const response = await fetch('/api/createRtcToken', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(params),
      // });
      // return await response.json();

      return mockResponse;
    } catch (error) {
      console.error('Failed to create RTC token:', error);
      throw new Error('Failed to create call session');
    }
  }

  /**
   * Join a call with the given configuration
   */
  async joinCall(config: CallConfig): Promise<void> {
    if (!this.client) {
      throw new Error('Call client not initialized');
    }

    try {
      // Join the channel
      await this.client.join(config.appId, config.channel, config.token, config.uid);

      // Create local tracks
      if (config.type === 'video') {
        [this.localAudioTrack, this.localVideoTrack] = await AgoraRTC.createMicrophoneAndCameraTracks();
      } else {
        this.localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
      }

      // Publish local tracks
      const tracksToPublish: any[] = [this.localAudioTrack];
      if (this.localVideoTrack) {
        tracksToPublish.push(this.localVideoTrack);
      }
      await this.client.publish(tracksToPublish);

      // Add local participant
      this.addParticipant({
        uid: config.uid,
        name: 'You',
        isLocal: true,
        audioTrack: this.localAudioTrack,
        videoTrack: this.localVideoTrack || undefined,
        isMuted: false,
        isVideoOff: false,
      });

      // Set up event listeners
      this.setupEventListeners();

      // Start metrics tracking
      this.startMetricsTracking(config.type);

    } catch (error) {
      console.error('Failed to join call:', error);
      throw error;
    }
  }

  /**
   * Set up Agora event listeners
   */
  private setupEventListeners(): void {
    if (!this.client) return;

    // Handle remote user joining
    this.client.on('user-published', async (user, mediaType) => {
      await this.client!.subscribe(user, mediaType);
      
      const participant = this.participants.get(user.uid) || {
        uid: user.uid,
        isLocal: false,
        isMuted: false,
        isVideoOff: false,
      };

      if (mediaType === 'video') {
        participant.videoTrack = user.videoTrack;
        participant.isVideoOff = false;
      } else if (mediaType === 'audio') {
        participant.audioTrack = user.audioTrack;
        participant.isMuted = false;
      }

      this.addParticipant(participant);
    });

    // Handle remote user leaving
    this.client.on('user-unpublished', (user, mediaType) => {
      const participant = this.participants.get(user.uid);
      if (!participant) return;

      if (mediaType === 'video') {
        participant.videoTrack = undefined;
        participant.isVideoOff = true;
      } else if (mediaType === 'audio') {
        participant.audioTrack = undefined;
        participant.isMuted = true;
      }

      this.updateParticipant(participant);
    });

    // Handle user leaving
    this.client.on('user-left', (user) => {
      this.removeParticipant(user.uid);
    });
  }

  /**
   * Start tracking call metrics and credits
   */
  private startMetricsTracking(callType: 'audio' | 'video'): void {
    this.callStartTime = Date.now();
    const creditsPerSecond = this.CREDITS_PER_SECOND[callType];

    this.metricsInterval = setInterval(() => {
      const duration = Math.floor((Date.now() - this.callStartTime) / 1000);
      const creditsUsed = duration * creditsPerSecond;

      const metrics: CallMetrics = {
        duration,
        creditsUsed,
        creditsPerSecond,
        remainingCredits: Math.max(0, 1000 - creditsUsed), // TODO: Get actual user credits
      };

      this.onMetricsUpdate?.(metrics);

      // Warning when credits are low
      if (metrics.remainingCredits <= creditsPerSecond * 30) { // 30 seconds warning
        console.warn('Low credits warning:', metrics);
      }

      // Auto-end call when credits are exhausted
      if (metrics.remainingCredits <= 0) {
        console.warn('Credits exhausted, ending call');
        this.endCall();
      }
    }, 1000);
  }

  /**
   * Mute/unmute local audio
   */
  async toggleMute(): Promise<boolean> {
    if (!this.localAudioTrack) return false;

    const isMuted = !this.localAudioTrack.enabled;
    await this.localAudioTrack.setEnabled(!isMuted);
    
    // Update local participant
    const localParticipant = Array.from(this.participants.values()).find(p => p.isLocal);
    if (localParticipant) {
      localParticipant.isMuted = isMuted;
      this.updateParticipant(localParticipant);
    }

    return isMuted;
  }

  /**
   * Turn video on/off
   */
  async toggleVideo(): Promise<boolean> {
    if (!this.localVideoTrack) return false;

    const isVideoOff = !this.localVideoTrack.enabled;
    await this.localVideoTrack.setEnabled(!isVideoOff);
    
    // Update local participant
    const localParticipant = Array.from(this.participants.values()).find(p => p.isLocal);
    if (localParticipant) {
      localParticipant.isVideoOff = isVideoOff;
      this.updateParticipant(localParticipant);
    }

    return isVideoOff;
  }

  /**
   * End the current call
   */
  async endCall(): Promise<void> {
    try {
      // Stop metrics tracking
      if (this.metricsInterval) {
        clearInterval(this.metricsInterval);
        this.metricsInterval = null;
      }

      // Close local tracks
      if (this.localAudioTrack) {
        this.localAudioTrack.close();
        this.localAudioTrack = null;
      }
      if (this.localVideoTrack) {
        this.localVideoTrack.close();
        this.localVideoTrack = null;
      }

      // Leave the channel
      if (this.client) {
        await this.client.leave();
      }

      // Clear participants
      this.participants.clear();
      this.onParticipantUpdate?.([]);
      
      // Notify call ended
      this.onCallEnd?.();

      console.log('Call ended successfully');
    } catch (error) {
      console.error('Error ending call:', error);
    }
  }

  /**
   * Get current call participants
   */
  getParticipants(): CallParticipant[] {
    return Array.from(this.participants.values());
  }

  /**
   * Set callbacks for call events
   */
  setCallbacks(callbacks: {
    onMetricsUpdate?: (metrics: CallMetrics) => void;
    onParticipantUpdate?: (participants: CallParticipant[]) => void;
    onCallEnd?: () => void;
  }): void {
    this.onMetricsUpdate = callbacks.onMetricsUpdate;
    this.onParticipantUpdate = callbacks.onParticipantUpdate;
    this.onCallEnd = callbacks.onCallEnd;
  }

  /**
   * Add or update a participant
   */
  private addParticipant(participant: CallParticipant): void {
    this.participants.set(participant.uid, participant);
    this.onParticipantUpdate?.(this.getParticipants());
  }

  /**
   * Update an existing participant
   */
  private updateParticipant(participant: CallParticipant): void {
    this.participants.set(participant.uid, participant);
    this.onParticipantUpdate?.(this.getParticipants());
  }

  /**
   * Remove a participant
   */
  private removeParticipant(uid: string | number): void {
    this.participants.delete(uid);
    this.onParticipantUpdate?.(this.getParticipants());
  }
}

// Export singleton instance
export const callService = new CallService();
