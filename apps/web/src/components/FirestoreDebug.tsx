import React, { useState, useEffect } from 'react';
import { getConnectionStatus, forceEnableFirestore, resetFirestoreConnection } from '../lib/firestoreManager';
import { getFirebaseStatus } from '../lib/firebaseEnhanced';

const debugEnabled = () => {
  const url = new URL(window.location.href);
  if (url.searchParams.get("debug") === "1") return true;
  if (localStorage.getItem("enableFirestoreDebug") === "1") return true;
  return import.meta.env.VITE_SHOW_FIRESTORE_DEBUG === "1";
};

export function FirestoreDebug() {
  const [status, setStatus] = useState(getConnectionStatus());
  const [firebaseStatus, setFirebaseStatus] = useState(getFirebaseStatus());
  const [showDetails, setShowDetails] = useState(false);
  const [on, setOn] = useState(debugEnabled());

  useEffect(() => {
    const interval = setInterval(() => {
      setStatus(getConnectionStatus());
      setFirebaseStatus(getFirebaseStatus());
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const handleForceReconnect = async () => {
    try {
      await forceEnableFirestore();
      setStatus(getConnectionStatus());
    } catch (error) {
      console.error('Force reconnect failed:', error);
    }
  };

  const handleReset = () => {
    resetFirestoreConnection();
    setStatus(getConnectionStatus());
  };

  if (!import.meta.env.DEV && !showDetails) {
    return (
      <button
        onClick={() => setShowDetails(true)}
        className="fixed bottom-4 right-4 bg-gray-800 text-white px-2 py-1 rounded text-xs z-50"
      >
        Debug
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 bg-white border border-gray-300 rounded-lg p-4 shadow-lg z-50 max-w-sm text-xs">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold">Firestore Debug</h3>
        <button
          onClick={() => setShowDetails(false)}
          className="text-gray-500 hover:text-gray-700"
        >
          ×
        </button>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${
            status.isConnected ? 'bg-green-500' : 'bg-red-500'
          }`} />
          <span>{status.isConnected ? 'Connected' : 'Disconnected'}</span>
        </div>
        
        <div className="text-gray-600">
          <div>Network: {status.isOnline ? '✅' : '❌'}</div>
          <div>Attempts: {status.connectionAttempts}</div>
          <div>Max reached: {status.maxAttemptsReached ? '⚠️' : '✅'}</div>
          {status.lastError && (
            <div className="text-red-600 break-words">
              Error: {status.lastError}
            </div>
          )}
        </div>

        <div className="border-t pt-2">
          <div className="text-gray-500 mb-1">Firebase Status:</div>
          <div>Project: {firebaseStatus.config.projectId}</div>
          <div>Domain: {firebaseStatus.environment.hostname}</div>
          <div>Mode: {firebaseStatus.environment.isDev ? 'Dev' : 'Prod'}</div>
        </div>

        <div className="flex gap-2 pt-2">
          <button
            onClick={handleForceReconnect}
            className="bg-blue-500 text-white px-2 py-1 rounded text-xs"
            disabled={status.isConnected}
          >
            Reconnect
          </button>
          <button
            onClick={handleReset}
            className="bg-gray-500 text-white px-2 py-1 rounded text-xs"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}
