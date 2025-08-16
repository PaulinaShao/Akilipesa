import { useState, useRef, useEffect } from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { 
  ArrowLeft, 
  Send, 
  Mic, 
  Image, 
  Sparkles, 
  MicOff,
  Camera,
  Paperclip,
  MoreVertical
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { guestChat } from '@/modules/api';
import { Trial } from '@/state/guestTrialStore';
import { isGuest } from '@/lib/guards';
import { useGuestGate } from '@/features/auth/GuestGate';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  type: 'text' | 'image' | 'voice';
  metadata?: {
    imageUrl?: string;
    audioUrl?: string;
    isDemo?: boolean;
  };
}

export default function ChatAIPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const mode = searchParams.get('mode') || 'text';
  const isAkiliChat = location.pathname.includes('/chat/akili');
  const chatRole = searchParams.get('role') || 'assistant';
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: isAkiliChat && chatRole === 'system'
        ? `💎 Hello! I'm AkiliPesa, your personal AI assistant for payments, business, and financial services. I'm here to help you with transfers, wallet management, earning opportunities, and business growth. How can I assist you today?`
        : `Hello! I'm AkiliPesa AI Assistant. I can help you with ${mode === 'image' ? 'image analysis and generation' : mode === 'voice' ? 'voice interactions' : 'questions and creative tasks'}. How can I assist you today?`,
      sender: 'ai',
      timestamp: new Date(),
      type: 'text'
    }
  ]);
  
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [remainingChats, setRemainingChats] = useState(Trial.getRemainingQuota('chats'));
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { showGuestGate, GuestGateComponent } = useGuestGate();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const addMessage = (content: string, sender: 'user' | 'ai', type: 'text' | 'image' | 'voice' = 'text', metadata?: Message['metadata']) => {
    const message: Message = {
      id: Date.now().toString(),
      content,
      sender,
      timestamp: new Date(),
      type,
      metadata
    };
    setMessages(prev => [...prev, message]);
  };

  const handleSendMessage = async () => {
    if (!inputText.trim() || isLoading) return;

    // Check trial limits for guests
    if (isGuest()) {
      if (!Trial.canChat()) {
        showGuestGate('chat');
        return;
      }
      setRemainingChats(Trial.getRemainingQuota('chats'));
    }

    const userMessage = inputText.trim();
    setInputText('');
    addMessage(userMessage, 'user');
    setIsLoading(true);

    try {
      // Send to AI
      const response = await guestChat({
        deviceToken: 'guest',
        text: userMessage
      });

      addMessage(response.reply, 'ai', 'text', { isDemo: isGuest() });
    } catch (error) {
      console.error('Failed to send message:', error);
      addMessage(
        'Sorry, I encountered an error. Please try again or sign up for unlimited conversations!',
        'ai',
        'text',
        { isDemo: true }
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      addMessage(`I've uploaded an image. Can you analyze it?`, 'user', 'image', { imageUrl });
      
      // Simulate AI image analysis
      setTimeout(() => {
        addMessage(
          `I can see your image! ${mode === 'image' ? 'Based on what I observe, this appears to be an interesting visual. For detailed image analysis, please sign up for full AI capabilities!' : 'Image analysis is available in image mode. Switch modes or sign up for advanced features!'}`,
          'ai',
          'text',
          { isDemo: isGuest() }
        );
      }, 1500);
    }
  };

  const handleVoiceToggle = () => {
    if (mode !== 'voice') {
      navigate('/chat/ai?mode=voice');
      return;
    }

    if (isRecording) {
      setIsRecording(false);
      // Simulate voice processing
      addMessage('Voice message recorded', 'user', 'voice');
      setTimeout(() => {
        addMessage(
          'I heard your voice message! For full voice interaction capabilities, please upgrade to a premium account.',
          'ai',
          'text',
          { isDemo: isGuest() }
        );
      }, 1000);
    } else {
      setIsRecording(true);
      // In a real app, start recording here
      setTimeout(() => {
        setIsRecording(false);
      }, 3000); // Auto-stop after 3 seconds for demo
    }
  };

  const modeButtons = [
    {
      key: 'text',
      label: 'Text',
      icon: Sparkles,
      active: mode === 'text'
    },
    {
      key: 'image',
      label: 'Image',
      icon: Image,
      active: mode === 'image'
    },
    {
      key: 'voice',
      label: 'Voice',
      icon: Mic,
      active: mode === 'voice'
    }
  ];

  return (
    <div className="h-screen-safe bg-gradient-to-b from-[#0b0c14] to-[#1a1235] flex flex-col">
      {/* Header */}
      <div className="safe-top p-4 border-b border-white/10 bg-black/20 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate(isAkiliChat ? '/inbox' : '/create')}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>

          <div className="text-center">
            <h1 className="text-lg font-semibold text-white">
              {isAkiliChat ? 'Chat with AkiliPesa' : 'AkiliPesa AI'}
            </h1>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-xs text-green-400">
                {isAkiliChat ? 'Always Available' : 'Online'}
              </span>
            </div>
          </div>
          
          <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <MoreVertical className="w-6 h-6 text-white/60" />
          </button>
        </div>

        {/* Mode Selector */}
        <div className="flex gap-2 mt-3">
          {modeButtons.map((btn) => {
            const IconComponent = btn.icon;
            return (
              <button
                key={btn.key}
                onClick={() => navigate(`/chat/ai?mode=${btn.key}`)}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-xl text-sm transition-all",
                  btn.active
                    ? "bg-primary text-white"
                    : "bg-white/10 text-white/70 hover:bg-white/20"
                )}
              >
                <IconComponent className="w-4 h-4" />
                {btn.label}
              </button>
            );
          })}
        </div>

        {/* Trial indicator for guests */}
        {isGuest() && (
          <div className="mt-3 bg-amber-500/10 border border-amber-500/20 rounded-lg p-2">
            <div className="flex items-center gap-2 text-amber-400 text-xs">
              <Sparkles className="w-3 h-3" />
              <span>Guest Mode: {remainingChats} messages remaining today</span>
            </div>
          </div>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              "flex",
              message.sender === 'user' ? 'justify-end' : 'justify-start'
            )}
          >
            <div
              className={cn(
                "max-w-[80%] rounded-2xl px-4 py-3",
                message.sender === 'user'
                  ? "bg-primary text-white"
                  : "bg-white/10 text-white"
              )}
            >
              {message.type === 'image' && message.metadata?.imageUrl && (
                <img
                  src={message.metadata.imageUrl}
                  alt="Uploaded content"
                  className="w-full h-32 object-cover rounded-lg mb-2"
                />
              )}
              
              <p className="text-sm leading-relaxed">{message.content}</p>
              
              {message.metadata?.isDemo && (
                <div className="mt-2 text-xs text-primary/80">
                  Demo response • Sign up for advanced AI
                </div>
              )}
              
              <div className="mt-1 text-xs opacity-60">
                {message.timestamp.toLocaleTimeString([], { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </div>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white/10 rounded-2xl px-4 py-3">
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                </div>
                <span className="text-white/60 text-sm">AI is thinking...</span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-white/10 bg-black/20 backdrop-blur-sm safe-bottom">
        <div className="flex items-end gap-3">
          {/* Attachment buttons */}
          <div className="flex gap-2">
            {mode === 'image' && (
              <>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
                >
                  <Paperclip className="w-5 h-5 text-white" />
                </button>
                <button className="p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors">
                  <Camera className="w-5 h-5 text-white" />
                </button>
              </>
            )}
            
            {mode === 'voice' && (
              <button
                onClick={handleVoiceToggle}
                className={cn(
                  "p-3 rounded-full transition-colors",
                  isRecording
                    ? "bg-red-500 hover:bg-red-600 animate-pulse"
                    : "bg-white/10 hover:bg-white/20"
                )}
              >
                {isRecording ? (
                  <MicOff className="w-5 h-5 text-white" />
                ) : (
                  <Mic className="w-5 h-5 text-white" />
                )}
              </button>
            )}
          </div>

          {/* Text input */}
          <div className="flex-1 relative">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder={
                mode === 'voice' ? 'Tap mic to speak or type...' :
                mode === 'image' ? 'Ask about images or upload one...' :
                'Type your message...'
              }
              className="w-full bg-white/10 border border-white/20 rounded-2xl px-4 py-3 pr-12 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              disabled={isLoading}
            />
            
            <button
              onClick={handleSendMessage}
              disabled={!inputText.trim() || isLoading}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 bg-primary hover:bg-primary/90 disabled:bg-white/20 disabled:cursor-not-allowed rounded-full transition-colors"
            >
              <Send className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
      />

      {/* Guest Gate Modal */}
      {GuestGateComponent}
    </div>
  );
}
