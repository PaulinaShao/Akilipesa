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
  // Don't interfere with Firebase, Google APIs, or other critical services
  const url = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url;
  const shouldBypass = url && (
    url.includes('firestore.googleapis.com') ||
    url.includes('firebase.googleapis.com') ||
    url.includes('googleapis.com') ||
    url.includes('google.com') ||
    url.includes('gstatic.com') ||
    url.includes('fullstory.com') ||
    url.includes('builder.io') ||
    url.includes('firebase') ||
    url.includes('firestore') ||
    // Check if it's a data URL or blob URL
    url.startsWith('data:') ||
    url.startsWith('blob:') ||
    // Check if it has Firebase-specific headers or patterns
    (init?.headers && JSON.stringify(init.headers).includes('firebase'))
  );

  // If this is a critical service request, use original fetch directly
  if (shouldBypass) {
    return originalFetch(input, init);
  }

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
  try {
    if (typeof window !== 'undefined' && window.location.hostname.includes('fly.dev')) {
      console.log('🔧 Initializing enhanced fetch wrapper for fly.dev environment');
      console.log('🔧 Firebase and Google services will bypass the wrapper');
      window.fetch = enhancedFetch;
    }
  } catch (error) {
    console.warn('Failed to initialize fetch wrapper:', error);
    // Don't break the app if wrapper initialization fails
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
