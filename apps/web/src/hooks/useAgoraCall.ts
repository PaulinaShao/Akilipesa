import { useState, useEffect, useRef } from 'react';
import AgoraRTC, { IAgoraRTCClient, ILocalAudioTrack, ILocalVideoTrack } from 'agora-rtc-sdk-ng';
import { getRtc } from '@/lib/api';
import { useAgoraClient } from './useAgoraClient';

export interface AgoraCallConfig {
  appId?: string;
  channel?: string;
  token?: string;
  uid?: number;
}

export interface UseAgoraCallReturn {
  client: IAgoraRTCClient | null;
  localAudioTrack: ILocalAudioTrack | null;
  localVideoTrack: ILocalVideoTrack | null;
  isJoined: boolean;
  isConnecting: boolean;
  error: string | null;
  join: (config?: AgoraCallConfig) => Promise<void>;
  leave: () => Promise<void>;
  toggleMute: () => Promise<void>;
  toggleVideo: () => Promise<void>;
  isMuted: boolean;
  isVideoEnabled: boolean;
}

export function useAgoraCall(enabled: boolean = false): UseAgoraCallReturn {
  // Use centralized client
  const client = useAgoraClient(enabled);
  const [localAudioTrack, setLocalAudioTrack] = useState<ILocalAudioTrack | null>(null);
  const [localVideoTrack, setLocalVideoTrack] = useState<ILocalVideoTrack | null>(null);
  const [isJoined, setIsJoined] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(false);

  // Use ref to store current values for cleanup
  const clientRef = useRef<IAgoraRTCClient | null>(null);
  const localAudioTrackRef = useRef<ILocalAudioTrack | null>(null);
  const localVideoTrackRef = useRef<ILocalVideoTrack | null>(null);

  useEffect(() => {
    return () => {
      // Cleanup on unmount
      cleanup();
    };
  }, []);

  const cleanup = async () => {
    try {
      if (localAudioTrackRef.current) {
        localAudioTrackRef.current.close();
        localAudioTrackRef.current = null;
        setLocalAudioTrack(null);
      }
      if (localVideoTrackRef.current) {
        localVideoTrackRef.current.close();
        localVideoTrackRef.current = null;
        setLocalVideoTrack(null);
      }
      if (clientRef.current && isJoined) {
        await clientRef.current.leave();
        setIsJoined(false);
      }
    } catch (error) {
      console.warn('Error during cleanup:', error);
    }
  };

  const join = async (config?: AgoraCallConfig) => {
    if (!client) {
      throw new Error('Agora client not initialized');
    }

    setIsConnecting(true);
    setError(null);

    try {
      let appId = config?.appId;
      let channel = config?.channel;
      let token = config?.token;
      let uid = config?.uid;

      // If appId, channel, or token are not provided, get them from the server
      if (!appId || !channel || !token) {
        console.log('Getting RTC token from server...');
        const rtcData = await getRtc();
        appId = rtcData.appId;
        channel = rtcData.channel;
        token = rtcData.token;
        uid = parseInt(rtcData.uid);
      }

      // Join the channel
      const joinedUid = await client.join(appId, channel, token, uid || null);
      console.log('Joined channel successfully:', { channel, uid: joinedUid });

      // Create audio track
      const audioTrack = await AgoraRTC.createMicrophoneAudioTrack();
      setLocalAudioTrack(audioTrack);
      localAudioTrackRef.current = audioTrack;

      // Publish audio track
      await client.publish([audioTrack]);

      setIsJoined(true);
      setIsConnecting(false);
    } catch (error: any) {
      console.error('Failed to join call:', error);
      setError(error.message || 'Failed to join call');
      setIsConnecting(false);
      throw error;
    }
  };

  const leave = async () => {
    if (!client || !isJoined) return;

    try {
      await cleanup();
      await client.leave();
      setIsJoined(false);
      console.log('Left channel successfully');
    } catch (error: any) {
      console.error('Failed to leave call:', error);
      setError(error.message || 'Failed to leave call');
      throw error;
    }
  };

  const toggleMute = async () => {
    if (!localAudioTrack) return;

    try {
      if (isMuted) {
        await localAudioTrack.setEnabled(true);
        setIsMuted(false);
      } else {
        await localAudioTrack.setEnabled(false);
        setIsMuted(true);
      }
    } catch (error: any) {
      console.error('Failed to toggle mute:', error);
      setError(error.message || 'Failed to toggle mute');
      throw error;
    }
  };

  const toggleVideo = async () => {
    if (!client) return;

    try {
      if (isVideoEnabled && localVideoTrack) {
        // Disable video
        await client.unpublish([localVideoTrack]);
        localVideoTrack.close();
        setLocalVideoTrack(null);
        localVideoTrackRef.current = null;
        setIsVideoEnabled(false);
      } else {
        // Enable video
        const videoTrack = await AgoraRTC.createCameraVideoTrack();
        setLocalVideoTrack(videoTrack);
        localVideoTrackRef.current = videoTrack;
        await client.publish([videoTrack]);
        setIsVideoEnabled(true);
      }
    } catch (error: any) {
      console.error('Failed to toggle video:', error);
      setError(error.message || 'Failed to toggle video');
      throw error;
    }
  };

  return {
    client,
    localAudioTrack,
    localVideoTrack,
    isJoined,
    isConnecting,
    error,
    join,
    leave,
    toggleMute,
    toggleVideo,
    isMuted,
    isVideoEnabled,
  };
}
