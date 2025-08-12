/**
 * Debug utilities for development mode
 */

// Debug flag - can be controlled by environment or local setting
const DEBUG_ENABLED = import.meta.env.MODE === 'development' || 
                     import.meta.env.VITE_DEBUG_TRIAL_UI === 'true' ||
                     typeof window !== 'undefined' && (window as any).DEBUG_TRIAL_UI;

/**
 * Conditional console logging that only works in development
 */
export const debugLog = {
  log: (...args: any[]) => {
    if (DEBUG_ENABLED) {
      console.log(...args);
    }
  },
  warn: (...args: any[]) => {
    if (DEBUG_ENABLED) {
      console.warn(...args);
    }
  },
  error: (...args: any[]) => {
    if (DEBUG_ENABLED) {
      console.error(...args);
    }
  },
  info: (...args: any[]) => {
    if (DEBUG_ENABLED) {
      console.info(...args);
    }
  }
};

/**
 * Check if debug mode is enabled
 */
export const isDebugMode = (): boolean => DEBUG_ENABLED;

/**
 * Performance-aware debug logging for hot paths
 */
export const debugTrace = (message: string, data?: any) => {
  if (DEBUG_ENABLED && performance) {
    console.log(`[${performance.now().toFixed(2)}ms] ${message}`, data || '');
  }
};
