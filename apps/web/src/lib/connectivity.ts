/**
 * Network connectivity utilities for handling offline scenarios
 */

export function isOnline(): boolean {
  if (typeof navigator === 'undefined') return true;
  return navigator.onLine;
}

export function waitForOnline(timeout = 10000): Promise<boolean> {
  if (isOnline()) return Promise.resolve(true);
  
  return new Promise((resolve) => {
    const timeoutId = setTimeout(() => {
      window.removeEventListener('online', onlineHandler);
      resolve(false);
    }, timeout);

    const onlineHandler = () => {
      clearTimeout(timeoutId);
      window.removeEventListener('online', onlineHandler);
      resolve(true);
    };

    window.addEventListener('online', onlineHandler);
  });
}

export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  baseDelay = 1000
): Promise<T> {
  let lastError: Error;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      
      // If it's a network error and we're offline, wait for online
      if (!isOnline() && attempt < maxRetries) {
        console.log(`Attempt ${attempt + 1} failed, waiting for network...`);
        await waitForOnline(5000);
      }
      
      // If not the last attempt, wait with exponential backoff
      if (attempt < maxRetries) {
        const delay = baseDelay * Math.pow(2, attempt);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  throw lastError!;
}

/**
 * Check if an error is likely a network connectivity issue
 */
export function isNetworkError(error: any): boolean {
  if (!error) return false;
  
  const message = error.message?.toLowerCase() || '';
  const code = error.code?.toLowerCase() || '';
  
  return (
    message.includes('failed to fetch') ||
    message.includes('network error') ||
    message.includes('could not reach') ||
    message.includes('connection failed') ||
    code === 'unavailable' ||
    code === 'network-request-failed'
  );
}
