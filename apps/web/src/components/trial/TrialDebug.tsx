import React, { useState, useEffect } from 'react';
import { useTrialStore } from '../../state/trialStore';
import { useAppStore } from '../../store';

export const TrialDebug: React.FC = () => {
  const { user } = useAppStore();
  const { deviceToken, config, usage, isLoading, canUseFeature, getRemainingQuota } = useTrialStore();
  const [isDemoMode, setIsDemoMode] = useState(false);

  useEffect(() => {
    // Check demo mode
    const checkDemoMode = async () => {
      try {
        const { isFirebaseDemoMode } = await import('../../lib/firebase');
        setIsDemoMode(isFirebaseDemoMode);
      } catch (error) {
        console.warn('Failed to check demo mode:', error);
      }
    };
    checkDemoMode();
  }, []);

  // Only show in development
  if (!import.meta.env.DEV) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-black/90 border border-violet-500/30 rounded-lg p-4 text-xs text-white max-w-xs z-50">
      <h3 className="text-violet-400 font-semibold mb-2">🧪 Trial Debug</h3>
      
      <div className="space-y-1">
        <div>
          <span className="text-zinc-400">Mode:</span> {isDemoMode ? '🎭 Demo' : '🌐 Production'}
        </div>

        <div>
          <span className="text-zinc-400">User:</span> {user ? '✅ Authenticated' : '❌ Guest'}
        </div>
        
        <div>
          <span className="text-zinc-400">Device Token:</span> 
          <div className="text-green-400 font-mono text-[10px]">
            {deviceToken ? deviceToken.slice(0, 20) + '...' : 'None'}
          </div>
        </div>
        
        <div>
          <span className="text-zinc-400">Config:</span> {config ? '✅ Loaded' : isLoading ? '⏳ Loading' : '❌ Failed'}
        </div>
        
        {config && (
          <div className="text-[10px] text-zinc-500">
            Chat: {config.chatMessagesPerDay} | Calls: {config.callsPerDay} | Reactions: {config.reactionLimit}
          </div>
        )}
        
        <div>
          <span className="text-zinc-400">Usage:</span> {usage ? '✅ Tracked' : '❌ None'}
        </div>
        
        {usage && (
          <div className="text-[10px] text-zinc-500">
            Day: {usage.dayKey} | Chat: {usage.chatUsed} | Calls: {usage.callsUsed} | Reactions: {usage.reactionsUsed}
          </div>
        )}
        
        <div className="pt-2 border-t border-zinc-700">
          <div className="text-zinc-400 mb-1">Remaining Quotas:</div>
          <div className="flex gap-2 text-[10px]">
            <span className={`px-1 rounded ${canUseFeature('chat') ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
              Chat: {getRemainingQuota('chat')}
            </span>
            <span className={`px-1 rounded ${canUseFeature('call') ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
              Call: {getRemainingQuota('call')}
            </span>
            <span className={`px-1 rounded ${canUseFeature('reaction') ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
              Like: {getRemainingQuota('reaction')}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
