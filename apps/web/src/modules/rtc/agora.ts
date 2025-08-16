import { getRtcToken } from '../api';

export interface RTCConfig {
  appId: string;
  channel: string;
  token?: string;
  uid?: number;
}

export interface MediaConfig {
  video: boolean;
  audio: boolean;
  cameraId?: string;
  microphoneId?: string;
}

export type RTCEvent = 
  | 'user-joined'
  | 'user-left' 
  | 'user-published'
  | 'user-unpublished'
  | 'connection-state-changed'
  | 'network-quality'
  | 'error';

export interface RTCUser {
  uid: number;
  hasAudio: boolean;
  hasVideo: boolean;
}

export interface NetworkQuality {
  uplinkNetworkQuality: number;
  downlinkNetworkQuality: number;
}

// Mock Agora client for development
class MockAgoraClient {
  private isJoined = false;
  private localTracks: any[] = [];
  private remoteUsers: Map<number, RTCUser> = new Map();
  private eventHandlers: Map<RTCEvent, Function[]> = new Map();

  async join(config: RTCConfig): Promise<number> {
    console.log('MockAgora: Joining channel', config.channel);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    this.isJoined = true;
    
    // Trigger connection state changed
    this.emit('connection-state-changed', 'CONNECTED');
    
    return config.uid || Math.floor(Math.random() * 100000);
  }

  async leave(): Promise<void> {
    console.log('MockAgora: Leaving channel');
    
    // Clean up local tracks
    for (const track of this.localTracks) {
      track.close && track.close();
    }
    this.localTracks = [];
    
    // Clear remote users
    this.remoteUsers.clear();
    
    this.isJoined = false;
    this.emit('connection-state-changed', 'DISCONNECTED');
  }

  async createMicrophoneAudioTrack(): Promise<any> {
    console.log('MockAgora: Creating microphone track');
    
    const track = {
      trackMediaType: 'audio',
      play: () => console.log('Playing audio track'),
      stop: () => console.log('Stopping audio track'),
      close: () => console.log('Closing audio track'),
      setEnabled: (enabled: boolean) => console.log('Audio enabled:', enabled),
      getMediaStreamTrack: () => null
    };
    
    this.localTracks.push(track);
    return track;
  }

  async createCameraVideoTrack(): Promise<any> {
    console.log('MockAgora: Creating camera track');
    
    const track = {
      trackMediaType: 'video',
      play: (element: HTMLElement) => {
        console.log('Playing video track in element:', element);
        // Create a colored div to simulate video
        const videoDiv = document.createElement('div');
        videoDiv.style.width = '100%';
        videoDiv.style.height = '100%';
        videoDiv.style.background = 'linear-gradient(45deg, #667eea 0%, #764ba2 100%)';
        videoDiv.style.display = 'flex';
        videoDiv.style.alignItems = 'center';
        videoDiv.style.justifyContent = 'center';
        videoDiv.style.color = 'white';
        videoDiv.style.fontSize = '14px';
        videoDiv.innerHTML = '📹 Mock Video';
        
        if (element) {
          element.innerHTML = '';
          element.appendChild(videoDiv);
        }
      },
      stop: () => console.log('Stopping video track'),
      close: () => console.log('Closing video track'),
      setEnabled: (enabled: boolean) => console.log('Video enabled:', enabled),
      getMediaStreamTrack: () => null
    };
    
    this.localTracks.push(track);
    return track;
  }

  async publish(tracks: any[]): Promise<void> {
    console.log('MockAgora: Publishing tracks', tracks.length);
    
    // Simulate remote user joining
    setTimeout(() => {
      const mockRemoteUid = Math.floor(Math.random() * 100000);
      const remoteUser: RTCUser = {
        uid: mockRemoteUid,
        hasAudio: true,
        hasVideo: true
      };
      
      this.remoteUsers.set(mockRemoteUid, remoteUser);
      this.emit('user-joined', remoteUser);
      this.emit('user-published', remoteUser, 'video');
      this.emit('user-published', remoteUser, 'audio');
    }, 2000);
  }

  async unpublish(tracks: any[]): Promise<void> {
    console.log('MockAgora: Unpublishing tracks', tracks.length);
  }

  async subscribe(user: RTCUser, mediaType: 'audio' | 'video'): Promise<any> {
    console.log('MockAgora: Subscribing to user', user.uid, mediaType);
    
    if (mediaType === 'video') {
      return {
        trackMediaType: 'video',
        play: (element: HTMLElement) => {
          const videoDiv = document.createElement('div');
          videoDiv.style.width = '100%';
          videoDiv.style.height = '100%';
          videoDiv.style.background = 'linear-gradient(45deg, #f093fb 0%, #f5576c 100%)';
          videoDiv.style.display = 'flex';
          videoDiv.style.alignItems = 'center';
          videoDiv.style.justifyContent = 'center';
          videoDiv.style.color = 'white';
          videoDiv.style.fontSize = '14px';
          videoDiv.innerHTML = `📹 Remote User ${user.uid}`;
          
          if (element) {
            element.innerHTML = '';
            element.appendChild(videoDiv);
          }
        },
        stop: () => console.log('Stopping remote video'),
      };
    } else {
      return {
        trackMediaType: 'audio',
        play: () => console.log('Playing remote audio'),
        stop: () => console.log('Stopping remote audio'),
      };
    }
  }

  on(event: RTCEvent, handler: Function): void {
    if (!this.eventHandlers.has(event)) {
      this.eventHandlers.set(event, []);
    }
    this.eventHandlers.get(event)!.push(handler);
  }

  off(event: RTCEvent, handler: Function): void {
    const handlers = this.eventHandlers.get(event);
    if (handlers) {
      const index = handlers.indexOf(handler);
      if (index > -1) {
        handlers.splice(index, 1);
      }
    }
  }

  private emit(event: RTCEvent, ...args: any[]): void {
    const handlers = this.eventHandlers.get(event);
    if (handlers) {
      handlers.forEach(handler => {
        try {
          handler(...args);
        } catch (error) {
          console.error('RTC event handler error:', error);
        }
      });
    }
  }

  getRemoteUsers(): RTCUser[] {
    return Array.from(this.remoteUsers.values());
  }

  getConnectionState(): string {
    return this.isJoined ? 'CONNECTED' : 'DISCONNECTED';
  }
}

// Singleton client instance
let client: MockAgoraClient | null = null;

/**
 * Initialize RTC client
 */
export function createRTCClient(): MockAgoraClient {
  if (!client) {
    client = new MockAgoraClient();
  }
  return client;
}

/**
 * Join RTC channel with automatic token fetching
 */
export async function join(channel: string, token?: string, uid?: number): Promise<{
  client: MockAgoraClient;
  uid: number;
}> {
  const rtcClient = createRTCClient();
  
  let rtcToken = token;
  let rtcUid = uid;
  let appId = import.meta.env.VITE_AGORA_APP_ID || 'mock_app_id';

  // Fetch token from server if not provided
  if (!rtcToken) {
    try {
      const tokenData = await getRtcToken(channel, uid);
      rtcToken = tokenData.token;
      rtcUid = tokenData.uid;
      // Note: The API response format doesn't include appId in this implementation
      // but the server knows the correct appId, so we trust the token
    } catch (error) {
      console.warn('Failed to get RTC token, using mock:', error);
      rtcToken = 'mock_token';
      rtcUid = uid || Math.floor(Math.random() * 100000);
    }
  }

  const joinedUid = await rtcClient.join({
    appId,
    channel,
    token: rtcToken,
    uid: rtcUid
  });
  
  return {
    client: rtcClient,
    uid: joinedUid
  };
}

/**
 * Leave RTC channel
 */
export async function leave(): Promise<void> {
  if (client) {
    await client.leave();
  }
}

/**
 * Create and publish local media tracks
 */
export async function publishLocalTracks(config: MediaConfig): Promise<{
  audioTrack?: any;
  videoTrack?: any;
}> {
  const rtcClient = createRTCClient();
  const tracks: any[] = [];
  let audioTrack, videoTrack;
  
  if (config.audio) {
    audioTrack = await rtcClient.createMicrophoneAudioTrack();
    tracks.push(audioTrack);
  }
  
  if (config.video) {
    videoTrack = await rtcClient.createCameraVideoTrack();
    tracks.push(videoTrack);
  }
  
  if (tracks.length > 0) {
    await rtcClient.publish(tracks);
  }
  
  return { audioTrack, videoTrack };
}

/**
 * Subscribe to remote user's media
 */
export async function subscribeToUser(user: RTCUser, mediaType: 'audio' | 'video'): Promise<any> {
  const rtcClient = createRTCClient();
  return await rtcClient.subscribe(user, mediaType);
}

/**
 * Add event listener
 */
export function on(event: RTCEvent, handler: Function): void {
  const rtcClient = createRTCClient();
  rtcClient.on(event, handler);
}

/**
 * Remove event listener
 */
export function off(event: RTCEvent, handler: Function): void {
  const rtcClient = createRTCClient();
  rtcClient.off(event, handler);
}

/**
 * Get current connection state
 */
export function getConnectionState(): string {
  return client?.getConnectionState() || 'DISCONNECTED';
}

/**
 * Get remote users in channel
 */
export function getRemoteUsers(): RTCUser[] {
  return client?.getRemoteUsers() || [];
}
