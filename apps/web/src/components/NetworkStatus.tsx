import React, { useState, useEffect } from 'react';
import { WifiOff, Wifi, AlertCircle } from 'lucide-react';

export const NetworkStatus: React.FC = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showOfflineWarning, setShowOfflineWarning] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowOfflineWarning(false);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowOfflineWarning(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Show warning if starting offline
    if (!navigator.onLine) {
      setShowOfflineWarning(true);
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Auto-hide offline warning after 3 seconds if back online
  useEffect(() => {
    if (isOnline && showOfflineWarning) {
      const timer = setTimeout(() => {
        setShowOfflineWarning(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isOnline, showOfflineWarning]);

  if (!showOfflineWarning && isOnline) {
    return null;
  }

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 max-w-sm w-full px-4">
      <div className={`rounded-lg p-3 shadow-lg transition-all duration-300 ${
        isOnline 
          ? 'bg-green-500/90 backdrop-blur-sm border border-green-400/30' 
          : 'bg-orange-500/90 backdrop-blur-sm border border-orange-400/30'
      }`}>
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0">
            {isOnline ? (
              <Wifi className="w-5 h-5 text-white" />
            ) : (
              <WifiOff className="w-5 h-5 text-white" />
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <p className="text-white font-medium text-sm">
              {isOnline ? 'Back online!' : 'No internet connection'}
            </p>
            <p className="text-white/80 text-xs">
              {isOnline 
                ? 'All features restored'
                : 'Using offline mode - limited features available'
              }
            </p>
          </div>

          {!isOnline && (
            <button
              onClick={() => setShowOfflineWarning(false)}
              className="flex-shrink-0 p-1 hover:bg-white/20 rounded-full transition-colors"
            >
              <AlertCircle className="w-4 h-4 text-white" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default NetworkStatus;
