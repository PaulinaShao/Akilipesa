import { v4 as uuidv4 } from 'uuid';

const DEVICE_TOKEN_KEY = 'ap.dt';
const DEVICE_ID_KEY = 'ap.deviceId';

export interface DeviceInfo {
  id: string;
  userAgent: string;
  screen: string;
  timezone: string;
  language: string;
}

export function getDeviceId(): string {
  let deviceId = localStorage.getItem(DEVICE_ID_KEY);
  if (!deviceId) {
    deviceId = uuidv4();
    localStorage.setItem(DEVICE_ID_KEY, deviceId);
  }
  return deviceId;
}

export function getDeviceInfo(): DeviceInfo {
  return {
    id: getDeviceId(),
    userAgent: navigator.userAgent.slice(0, 200),
    screen: `${screen.width}x${screen.height}`,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    language: navigator.language,
  };
}

export function getDeviceToken(): string | null {
  return localStorage.getItem(DEVICE_TOKEN_KEY);
}

export function setDeviceToken(token: string): void {
  localStorage.setItem(DEVICE_TOKEN_KEY, token);
}

export function clearDeviceToken(): void {
  localStorage.removeItem(DEVICE_TOKEN_KEY);
}

export function getDeviceFingerprint(): string {
  const info = getDeviceInfo();
  return btoa(`${info.id}:${info.screen}:${info.timezone}`).slice(0, 32);
}
