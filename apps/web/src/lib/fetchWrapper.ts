// Enhanced fetch wrapper to handle network issues
const originalFetch = window.fetch;

interface FetchOptions extends RequestInit {
  timeout?: number;
  retries?: number;
}

async function enhancedFetch(
  input: RequestInfo | URL,
  init?: FetchOptions
): Promise<Response> {
  const { timeout = 10000, retries = 2, ...fetchInit } = init || {};
  
  for (let attempt = 0; attempt <= retries; attempt++) {
    let timeoutId: NodeJS.Timeout | undefined;

    try {
      // Create abort controller for timeout
      const controller = new AbortController();
      timeoutId = setTimeout(() => controller.abort(), timeout);

      const response = await originalFetch(input, {
        ...fetchInit,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // If response is ok, return it
      if (response.ok || attempt === retries) {
        return response;
      }

      // If not ok and we have retries left, wait and try again
      if (attempt < retries) {
        await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
      }

    } catch (error) {
      if (timeoutId) clearTimeout(timeoutId);

      // If it's the last attempt, throw the error
      if (attempt === retries) {
        console.error('Enhanced fetch failed after all retries:', error);
        throw error;
      }

      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
      console.warn(`Fetch attempt ${attempt + 1} failed, retrying...`, error);
    }
  }
  
  throw new Error('All fetch attempts failed');
}

// Only override fetch in problematic environments (like fly.dev with FullStory)
export function initializeFetchWrapper() {
  if (typeof window !== 'undefined' && window.location.hostname.includes('fly.dev')) {
    console.log('🔧 Initializing enhanced fetch wrapper for fly.dev environment');
    window.fetch = enhancedFetch;
  }
}

// Restore original fetch
export function restoreOriginalFetch() {
  if (typeof window !== 'undefined') {
    window.fetch = originalFetch;
  }
}

// Export enhanced fetch for manual use
export { enhancedFetch };
