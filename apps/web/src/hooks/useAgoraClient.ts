import { useEffect, useRef } from 'react';
import AgoraRTC, { IAgoraRTCClient } from 'agora-rtc-sdk-ng';

export function useAgoraClient(enabled: boolean) {
  const ref = useRef<IAgoraRTCClient | null>(null);

  useEffect(() => {
    if (!enabled || ref.current) return;

    ref.current = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });
    return () => {
      ref.current?.leave().catch(() => {});
      ref.current = null;
    };
  }, [enabled]);

  return ref.current;
}
