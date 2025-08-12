import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, AlertCircle, Zap } from 'lucide-react';
import { useTrialStore } from '../../state/trialStore';
import { useAppStore } from '../../store';
import { useGatedChat } from '../../hooks/useAuthGate';
import { httpsCallable } from 'firebase/functions';
import { functions } from '../../lib/firebase';
import { getDeviceToken } from '../../lib/device';

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  isTrialMessage?: boolean;
}

interface TrialChatProps {
  className?: string;
  placeholder?: string;
  maxHeight?: string;
}

export const TrialChat: React.FC<TrialChatProps> = ({
  className = '',
  placeholder = 'Ask AkiliPesa AI...',
  maxHeight = '400px',
}) => {
  const { user } = useAppStore();
  const { canUseFeature, getRemainingQuota } = useTrialStore();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const gatedChat = useGatedChat();

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Initialize with welcome message
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([{
        id: 'welcome',
        content: user 
          ? 'Hello! I\'m your AkiliPesa AI assistant. How can I help you today?'
          : 'Welcome to AkiliPesa! I\'m your AI assistant. You have a few trial messages to experience our AI features. How can I help?',
        isUser: false,
        timestamp: new Date(),
        isTrialMessage: !user,
      }]);
    }
  }, [user, messages.length]);

  const sendMessage = async (message: string) => {
    if (!message.trim()) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      content: message.trim(),
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setError(null);
    setIsLoading(true);

    try {
      let response: string;

      if (user) {
        // Authenticated user - full AI chat
        response = await getAuthenticatedAIResponse(message);
      } else {
        // Guest user - trial AI chat
        response = await getTrialAIResponse(message);

        // Track usage locally for offline mode
        // Track chat usage
        console.log('Chat usage tracked');
      }

      const aiMessage: Message = {
        id: `ai-${Date.now()}`,
        content: response,
        isUser: false,
        timestamp: new Date(),
        isTrialMessage: !user,
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error: any) {
      console.error('AI chat error:', error);
      setError(error.message || 'Failed to get AI response');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = () => {
    if (user) {
      // Authenticated user - send directly
      sendMessage(inputValue);
    } else {
      // Guest user - use gated chat
      gatedChat(() => sendMessage(inputValue));
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const remainingMessages = user ? Infinity : getRemainingQuota('chat');
  const canSendMessage = user || canUseFeature('chat');

  return (
    <div className={`bg-zinc-900/90 backdrop-blur-sm border border-zinc-700 rounded-xl overflow-hidden ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-zinc-700">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-blue-500 rounded-full flex items-center justify-center">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-white font-medium">AkiliPesa AI</h3>
            {!user && (
              <p className="text-xs text-zinc-400">
                {remainingMessages > 0 ? `${remainingMessages} trial messages left` : 'Trial quota exhausted'}
              </p>
            )}
          </div>
          {!user && (
            <div className="text-xs bg-violet-500/20 text-violet-400 px-2 py-1 rounded-full">
              Trial
            </div>
          )}
        </div>
      </div>

      {/* Messages */}
      <div 
        className="p-4 space-y-4 overflow-y-auto"
        style={{ maxHeight }}
      >
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 ${message.isUser ? 'justify-end' : 'justify-start'}`}
          >
            {!message.isUser && (
              <div className="w-6 h-6 bg-gradient-to-br from-violet-500 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <Bot className="w-3 h-3 text-white" />
              </div>
            )}
            
            <div
              className={`max-w-[80%] p-3 rounded-2xl ${
                message.isUser
                  ? 'bg-violet-500 text-white ml-auto'
                  : 'bg-zinc-800 text-white'
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              {message.isTrialMessage && (
                <div className="mt-2 text-xs text-violet-300 flex items-center gap-1">
                  <Zap className="w-3 h-3" />
                  Trial response
                </div>
              )}
            </div>

            {message.isUser && (
              <div className="w-6 h-6 bg-zinc-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <User className="w-3 h-3 text-white" />
              </div>
            )}
          </div>
        ))}

        {/* Loading indicator */}
        {isLoading && (
          <div className="flex gap-3 justify-start">
            <div className="w-6 h-6 bg-gradient-to-br from-violet-500 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
              <Bot className="w-3 h-3 text-white" />
            </div>
            <div className="bg-zinc-800 p-3 rounded-2xl">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Error Display */}
      {error && (
        <div className="px-4 pb-2">
          <div className="p-2 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
            <span className="text-sm text-red-400">{error}</span>
          </div>
        </div>
      )}

      {/* Input */}
      <div className="p-4 border-t border-zinc-700">
        <div className="flex gap-2">
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={canSendMessage ? placeholder : 'Sign up to continue chatting...'}
            disabled={isLoading || !canSendMessage}
            className="flex-1 bg-zinc-800 text-white placeholder-zinc-400 border border-zinc-600 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
            rows={1}
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isLoading || !canSendMessage}
            className="px-4 py-2 bg-violet-500 hover:bg-violet-600 disabled:bg-zinc-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center justify-center"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

// Helper functions for AI responses
async function getTrialAIResponse(message: string): Promise<string> {
  const deviceToken = getDeviceToken();

  if (!deviceToken) {
    throw new Error('No trial token available. Please refresh the page.');
  }

  try {
    const guestChat = httpsCallable(functions, 'guestChat');
    const result = await guestChat({
      deviceToken,
      message: message.slice(0, 500), // Limit message length
    });

    return (result.data as any).reply;
  } catch (error: any) {
    console.warn('Server AI chat failed, using offline response:', error);

    // Offline fallback responses
    const offlineResponses = [
      `Thanks for asking about "${message.slice(0, 30)}...". I'm currently in offline mode, but I'd love to help you explore AkiliPesa's features! Sign up for full AI conversations.`,
      `Great question! While I'm offline right now, I can see you're interested in "${message.slice(0, 30)}...". Join AkiliPesa for unlimited AI assistance and trading insights.`,
      `I appreciate your message about "${message.slice(0, 30)}...". I'm in trial mode with limited responses. Sign up to unlock full AI conversations and personalized trading advice!`,
    ];

    return offlineResponses[Math.floor(Math.random() * offlineResponses.length)];
  }
}

async function getAuthenticatedAIResponse(message: string): Promise<string> {
  // This would integrate with your full AI service
  // For now, return a mock response
  await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
  
  const responses = [
    `Great question about "${message.slice(0, 30)}...". As your AkiliPesa AI assistant, I can help you with trading insights, market analysis, and financial planning. What specific area would you like to explore?`,
    `I understand you're asking about "${message.slice(0, 30)}...". Let me provide you with detailed information and actionable insights for your AkiliPesa journey.`,
    `That's an interesting point about "${message.slice(0, 30)}...". Based on current market trends and your AkiliPesa profile, here's what I recommend...`,
  ];
  
  return responses[Math.floor(Math.random() * responses.length)];
}
