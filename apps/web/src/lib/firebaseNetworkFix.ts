// Firebase network isolation fix
// This ensures Firebase uses the original fetch function and isn't affected by any wrappers

let originalFetch: typeof fetch;

export function isolateFirebaseFromFetchWrappers() {
  // Use the preserved original fetch from the HTML script
  const preservedFetch = (window as any)._originalFetch;

  // Store the original fetch before any wrappers are applied
  if (!originalFetch) {
    originalFetch = preservedFetch || window.fetch.bind(window);
  }

  // Create a clean fetch function for Firebase
  const cleanFetch = originalFetch;

  // Override fetch temporarily during Firebase initialization
  const currentFetch = window.fetch;
  
  // Check if fetch has been wrapped (multiple times)
  if (currentFetch.toString().includes('eval') || 
      currentFetch.toString().includes('messageHandler') ||
      currentFetch.name !== 'fetch') {
    
    console.warn('🔧 Detected wrapped fetch function, isolating Firebase...');
    
    // Temporarily restore original fetch for Firebase operations
    window.fetch = cleanFetch;
    
    // Set up a promise to restore the wrapped fetch after a short delay
    setTimeout(() => {
      if (window.fetch === cleanFetch) {
        window.fetch = currentFetch;
        console.log('🔧 Restored wrapped fetch after Firebase isolation');
      }
    }, 2000);
  }
}

// Call this before Firebase initialization
export function restoreOriginalFetchForFirebase() {
  if (originalFetch) {
    const temp = window.fetch;
    window.fetch = originalFetch;
    
    // Return a function to restore the wrapped fetch
    return () => {
      window.fetch = temp;
    };
  }
  return () => {};
}

// Detect and fix fetch wrapping issues
export function detectFetchIssues() {
  const fetchStr = window.fetch.toString();
  const issues = [];
  
  if (fetchStr.includes('eval')) {
    issues.push('Fetch contains eval (likely FullStory)');
  }
  
  if (fetchStr.includes('messageHandler')) {
    issues.push('Fetch contains messageHandler');
  }
  
  if (fetchStr.length > 1000) {
    issues.push('Fetch function is unusually large (likely wrapped)');
  }
  
  if (window.fetch.name !== 'fetch') {
    issues.push(`Fetch name is '${window.fetch.name}' instead of 'fetch'`);
  }
  
  if (issues.length > 0) {
    console.warn('🚨 Fetch wrapping issues detected:', issues);
    return true;
  }
  
  return false;
}
