import { useState } from 'react';
import CallOverlay from './CallOverlay';

export default function CallDemo() {
  const [showCall, setShowCall] = useState(false);

  return (
    <div className="p-4">
      <button 
        onClick={() => setShowCall(true)}
        className="tz-gem-border px-4 py-2 rounded-lg text-white tz-shimmer"
      >
        Start Demo Call
      </button>

      {showCall && (
        <CallOverlay
          name="Amina Hassan"
          avatar="https://images.unsplash.com/photo-1494790108755-2616b9d38aad?w=150&h=150&fit=crop&crop=face"
          onEnd={() => setShowCall(false)}
        />
      )}
    </div>
  );
}
