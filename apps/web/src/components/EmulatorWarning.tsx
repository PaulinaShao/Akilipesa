import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, AlertTriangle, X } from 'lucide-react';

export const EmulatorWarning: React.FC = () => {
  const [isMinimized, setIsMinimized] = useState(true);
  const [isDismissed, setIsDismissed] = useState(false);
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    // Check if we're in emulator mode
    const isEmulatorMode = import.meta.env.DEV && 
                          (import.meta.env.VITE_FIREBASE_PROJECT_ID === 'demo-project' ||
                           window.location.hostname === 'localhost');
    setShowWarning(isEmulatorMode);
  }, []);

  if (!showWarning || isDismissed) return null;

  if (isMinimized) {
    return (
      <button
        onClick={() => setIsMinimized(false)}
        className="fixed bottom-4 left-4 bg-amber-500/90 backdrop-blur-sm border border-amber-400/30 rounded-lg px-3 py-2 text-xs text-amber-900 z-40 hover:bg-amber-500 transition-colors flex items-center gap-2"
      >
        <AlertTriangle className="w-3 h-3" />
        <span>Emulator</span>
        <ChevronUp className="w-3 h-3" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 left-4 bg-amber-500/90 backdrop-blur-sm border border-amber-400/30 rounded-lg text-xs text-amber-900 max-w-xs z-40">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-amber-400/20">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4" />
          <span className="font-semibold">Emulator Mode</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsMinimized(true)}
            className="text-amber-700 hover:text-amber-800 transition-colors"
          >
            <ChevronDown className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsDismissed(true)}
            className="text-amber-700 hover:text-amber-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      {/* Content */}
      <div className="p-3">
        <p className="font-medium mb-1">Running in emulator mode.</p>
        <p className="text-amber-800">Do not use with production credentials.</p>
        <div className="mt-2 text-[10px] text-amber-700">
          This warning only appears in development
        </div>
      </div>
    </div>
  );
};

export default EmulatorWarning;
