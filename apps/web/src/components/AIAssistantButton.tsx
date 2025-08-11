import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { MessageCircle, X, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function AIAssistantButton() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMinimized, setIsMinimized] = useState(false);

  // Don't show on chat pages or login
  const shouldHide = location.pathname.includes('/chat') || 
                    location.pathname.includes('/login') ||
                    location.pathname.includes('/admin');

  if (shouldHide) return null;

  const handleChatOpen = () => {
    navigate('/chat/akilipesa?role=system');
  };

  return (
    <div className="fixed bottom-20 right-4 z-40">
      {!isMinimized ? (
        <div className="bg-gradient-to-br from-primary to-secondary rounded-2xl shadow-2xl overflow-hidden max-w-xs">
          {/* Header */}
          <div className="bg-black/20 p-3 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-white/20 rounded-full flex-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold text-sm">AkiliPesa AI</h3>
                <p className="text-white/80 text-xs">Online</p>
              </div>
            </div>
            <button
              onClick={() => setIsMinimized(true)}
              className="p-1 hover:bg-white/20 rounded-full transition-colors"
            >
              <X className="w-4 h-4 text-white" />
            </button>
          </div>

          {/* Content */}
          <div className="p-4">
            <p className="text-white text-sm mb-3">
              Hi! I'm your AI financial advisor. Need help with budgeting, investments, or business advice?
            </p>
            <button
              onClick={handleChatOpen}
              className="w-full bg-white/20 hover:bg-white/30 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors"
            >
              Start Chat
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsMinimized(false)}
          className={cn(
            "w-14 h-14 bg-gradient-to-br from-primary to-secondary rounded-full shadow-2xl",
            "flex-center transition-all duration-300 hover:scale-105 active:scale-95",
            "animate-pulse"
          )}
        >
          <MessageCircle className="w-6 h-6 text-white" />
          {/* Notification dot */}
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex-center">
            <span className="text-white text-xs font-bold">1</span>
          </div>
        </button>
      )}
    </div>
  );
}
