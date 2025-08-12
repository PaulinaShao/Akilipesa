/**
 * Retry utility with exponential backoff
 */

export interface RetryOptions {
  maxAttempts?: number;
  baseDelay?: number;
  maxDelay?: number;
  backoffFactor?: number;
  onRetry?: (attempt: number, error: Error) => void;
}

const DEFAULT_OPTIONS: Required<RetryOptions> = {
  maxAttempts: 5,
  baseDelay: 500,
  maxDelay: 30000,
  backoffFactor: 2,
  onRetry: () => {},
};

/**
 * Retry an async operation with exponential backoff
 */
export async function retryWithBackoff<T>(
  operation: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  let lastError: Error;
  
  for (let attempt = 1; attempt <= opts.maxAttempts; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error as Error;
      
      // Don't retry on the last attempt
      if (attempt === opts.maxAttempts) {
        throw lastError;
      }
      
      // Calculate delay with exponential backoff
      const delay = Math.min(
        opts.baseDelay * Math.pow(opts.backoffFactor, attempt - 1),
        opts.maxDelay
      );
      
      // Call retry callback
      opts.onRetry(attempt, lastError);
      
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError!;
}

/**
 * Create a retry wrapper for a specific operation
 */
export function createRetryWrapper<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  options: RetryOptions = {}
): T {
  return ((...args: Parameters<T>) => {
    return retryWithBackoff(() => fn(...args), options);
  }) as T;
}

/**
 * Network-aware retry - don't retry if offline
 */
export async function retryIfOnline<T>(
  operation: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  if (!navigator.onLine) {
    throw new Error('Device is offline');
  }
  
  return retryWithBackoff(operation, {
    ...options,
    onRetry: (attempt, error) => {
      // Stop retrying if we go offline
      if (!navigator.onLine) {
        throw new Error('Device went offline during retry');
      }
      options.onRetry?.(attempt, error);
    }
  });
}
