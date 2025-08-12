import React, { Component, ReactNode } from 'react';
import { RefreshCw, Wifi, WifiOff } from 'lucide-react';
import { retryWithBackoff } from '@/lib/retry';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  retryCount: number;
  isRetrying: boolean;
  isOffline: boolean;
}

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: (error: Error, retry: () => void) => ReactNode;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  private retryTimeoutId?: number;

  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      retryCount: 0,
      isRetrying: false,
      isOffline: !navigator.onLine,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error Boundary caught an error:', error, errorInfo);
  }

  componentDidMount() {
    // Listen for online/offline events
    window.addEventListener('online', this.handleOnline);
    window.addEventListener('offline', this.handleOffline);
  }

  componentWillUnmount() {
    window.removeEventListener('online', this.handleOnline);
    window.removeEventListener('offline', this.handleOffline);
    if (this.retryTimeoutId) {
      clearTimeout(this.retryTimeoutId);
    }
  }

  handleOnline = () => {
    this.setState({ isOffline: false });
    // Auto-retry when coming back online
    if (this.state.hasError) {
      this.handleRetry();
    }
  };

  handleOffline = () => {
    this.setState({ isOffline: true });
  };

  handleRetry = async () => {
    if (this.state.isRetrying) return;
    
    this.setState({ isRetrying: true });

    try {
      await retryWithBackoff(
        () => new Promise(resolve => setTimeout(resolve, 100)),
        {
          maxAttempts: 3,
          baseDelay: 500,
          onRetry: (attempt) => {
            console.log(`Retrying error recovery... attempt ${attempt}`);
          }
        }
      );

      // Reset error state
      this.setState({
        hasError: false,
        error: undefined,
        retryCount: this.state.retryCount + 1,
        isRetrying: false,
      });
    } catch (error) {
      this.setState({ isRetrying: false });
      console.error('Retry failed:', error);
    }
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback(this.state.error!, this.handleRetry);
      }

      return (
        <div className="min-h-screen bg-gradient-to-b from-[var(--tz-night)] via-[#1a1235] to-[#2d1b69] flex items-center justify-center p-6">
          <div className="tz-glass-card p-8 max-w-md w-full text-center">
            {/* Connection Status Icon */}
            <div className="mb-6">
              {this.state.isOffline ? (
                <WifiOff className="w-16 h-16 text-rose-400 mx-auto mb-4" />
              ) : (
                <RefreshCw className="w-16 h-16 text-[var(--tz-muted)] mx-auto mb-4" />
              )}
            </div>

            {/* Title and Description */}
            <h2 className="text-xl font-semibold text-[var(--tz-ink)] mb-4">
              {this.state.isOffline ? 'Connection Lost' : 'Something went wrong'}
            </h2>
            
            <p className="text-[var(--tz-muted)] mb-6 text-sm leading-relaxed">
              {this.state.isOffline
                ? 'Please check your internet connection and try again.'
                : 'We encountered an unexpected error. Don\'t worry, we\'re reconnecting...'
              }
            </p>

            {/* Error Details (only in development) */}
            {import.meta.env.MODE === 'development' && this.state.error && (
              <details className="mb-6 text-left">
                <summary className="text-xs text-[var(--tz-muted)] cursor-pointer mb-2">
                  Error Details (Development)
                </summary>
                <pre className="text-xs bg-black/20 p-3 rounded overflow-auto max-h-32">
                  {this.state.error.message}
                  {this.state.error.stack && `\n\n${this.state.error.stack}`}
                </pre>
              </details>
            )}

            {/* Retry Button */}
            <button
              onClick={this.handleRetry}
              disabled={this.state.isRetrying || this.state.isOffline}
              className="tz-btn-primary w-full py-3 px-4 disabled:opacity-50"
            >
              {this.state.isRetrying ? (
                <div className="flex items-center justify-center gap-2">
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Reconnecting...
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <RefreshCw className="w-4 h-4" />
                  Try Again
                </div>
              )}
            </button>

            {/* Connection Status */}
            <div className="mt-4 flex items-center justify-center gap-2 text-xs">
              {this.state.isOffline ? (
                <>
                  <WifiOff className="w-3 h-3 text-rose-400" />
                  <span className="text-rose-400">Offline</span>
                </>
              ) : (
                <>
                  <Wifi className="w-3 h-3 text-emerald-400" />
                  <span className="text-emerald-400">Connected</span>
                </>
              )}
              {this.state.retryCount > 0 && (
                <span className="text-[var(--tz-muted)] ml-2">
                  • Retry {this.state.retryCount}
                </span>
              )}
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Offline indicator component
export function OfflineIndicator() {
  const [isOffline, setIsOffline] = React.useState(!navigator.onLine);

  React.useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!isOffline) return null;

  return (
    <div className="fixed top-16 left-1/2 transform -translate-x-1/2 z-50">
      <div className="bg-amber-500/90 backdrop-blur-sm text-amber-900 px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2">
        <WifiOff className="w-4 h-4" />
        Offline – actions will sync when connected
      </div>
    </div>
  );
}
