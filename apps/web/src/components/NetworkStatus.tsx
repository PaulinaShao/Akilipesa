import React, { useState, useEffect } from 'react';
import { isOnline } from '../lib/connectivity';

interface NetworkStatusProps {
  showDetails?: boolean;
}

export function NetworkStatus({ showDetails = false }: NetworkStatusProps) {
  const [online, setOnline] = useState(isOnline());
  const [lastCheck, setLastCheck] = useState(new Date());

  useEffect(() => {
    const handleOnline = () => {
      setOnline(true);
      setLastCheck(new Date());
    };
    
    const handleOffline = () => {
      setOnline(false);
      setLastCheck(new Date());
    };

    // Check status periodically
    const interval = setInterval(() => {
      const currentStatus = isOnline();
      if (currentStatus !== online) {
        setOnline(currentStatus);
        setLastCheck(new Date());
      }
    }, 5000);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      clearInterval(interval);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [online]);

  if (!showDetails && online) return null;

  return (
    <div className={`fixed top-4 right-4 z-50 px-3 py-2 rounded-lg text-sm font-medium ${
      online 
        ? 'bg-green-100 text-green-800 border border-green-200' 
        : 'bg-red-100 text-red-800 border border-red-200'
    }`}>
      <div className="flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${online ? 'bg-green-500' : 'bg-red-500'}`} />
        <span>{online ? 'Online' : 'Offline'}</span>
      </div>
      {showDetails && (
        <div className="text-xs opacity-75 mt-1">
          Last check: {lastCheck.toLocaleTimeString()}
        </div>
      )}
    </div>
  );
}

// Hook for components to check network status
export function useNetworkStatus() {
  const [online, setOnline] = useState(isOnline());

  useEffect(() => {
    const handleOnline = () => setOnline(true);
    const handleOffline = () => setOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return online;
}
