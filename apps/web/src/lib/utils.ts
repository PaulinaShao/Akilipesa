import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPhoneNumber(phone: string): string {
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, '');
  
  // Add +255 if it doesn't start with country code
  if (cleaned.startsWith('0')) {
    return `+255${cleaned.slice(1)}`;
  } else if (cleaned.startsWith('255')) {
    return `+${cleaned}`;
  } else if (!cleaned.startsWith('+')) {
    return `+255${cleaned}`;
  }
  
  return cleaned;
}

export function formatCurrency(amount: number, currency = 'TSH'): string {
  return new Intl.NumberFormat('sw-TZ', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('sw-TZ', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase())
    .slice(0, 2)
    .join('');
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

export function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): T {
  let timeoutId: ReturnType<typeof setTimeout>;
  return ((...args: any[]) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(null, args), delay);
  }) as T;
}

export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): T {
  let inThrottle: boolean;
  return ((...args: any[]) => {
    if (!inThrottle) {
      func.apply(null, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  }) as T;
}

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function isValidTanzanianPhone(phone: string): boolean {
  // Accept E.164 format (+255xxxxxxxxx) and normalize other formats
  const cleaned = phone.replace(/[^\d+]/g, '');

  // Normalize to E.164 format first
  let normalized = cleaned;
  if (cleaned.startsWith('0')) {
    normalized = '+255' + cleaned.slice(1);
  } else if (cleaned.startsWith('255')) {
    normalized = '+' + cleaned;
  } else if (cleaned.match(/^[6789]/)) {
    normalized = '+255' + cleaned;
  }

  // Check E.164 format for Tanzania mobile numbers (6,7,8,9 prefixes)
  return /^\+255[6789]\d{8}$/.test(normalized);
}
