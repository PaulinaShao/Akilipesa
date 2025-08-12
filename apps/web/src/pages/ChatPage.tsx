import { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { requireAuth } from '@/lib/authGuard';
import { 
  ArrowLeft, 
  Phone, 
  Video, 
  MoreVertical, 
  Send, 
  Mic, 
  Image, 
  Camera, 
  Paperclip,
  Play,
  Pause,
  Download,
  Crown,
  Zap,
  Star,
  CheckCheck,
  Check,
  Clock
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  content: string;
  type: 'text' | 'image' | 'video' | 'voice' | 'file';
  sender: 'user' | 'akilipesa';
  timestamp: Date;
  status: 'sending' | 'sent' | 'delivered' | 'read';
  fileUrl?: string;
  fileName?: string;
  fileSize?: string;
  duration?: string;
}

interface UserPlan {
  name: string;
  type: 'free' | 'basic' | 'premium' | 'pro';
  messagesLeft: number;
  maxMessages: number;
  features: string[];
  canCall: boolean;
  canSendFiles: boolean;
  aiProvider: 'openai' | 'runpod' | 'make.com';
}

const mockUserPlan: UserPlan = {
  name: 'Premium Plan',
  type: 'premium',
  messagesLeft: 150,
  maxMessages: 500,
  features: ['Unlimited Text', 'Voice Messages', 'Video Calls', 'File Sharing', 'Priority Support'],
  canCall: true,
  canSendFiles: true,
  aiProvider: 'openai'
};

const mockMessages: Message[] = [
  {
    id: '1',
    content: 'Hello! I\'m AkiliPesa, your AI financial advisor. How can I help you today?',
    type: 'text',
    sender: 'akilipesa',
    timestamp: new Date(Date.now() - 300000),
    status: 'read'
  },
  {
    id: '2',
    content: 'Hi! I need help with managing my small business finances in Tanzania',
    type: 'text',
    sender: 'user',
    timestamp: new Date(Date.now() - 240000),
    status: 'read'
  },
  {
    id: '3',
    content: 'Great! I\'d be happy to help you with your business finances. What specific area would you like to focus on - budgeting, tax planning, investment strategies, or cash flow management?',
    type: 'text',
    sender: 'akilipesa',
    timestamp: new Date(Date.now() - 180000),
    status: 'read'
  },
  {
    id: '4',
    content: 'Cash flow management is my biggest challenge right now',
    type: 'text',
    sender: 'user',
    timestamp: new Date(Date.now() - 120000),
    status: 'read'
  }
];

function MessageBubble({ message, isLast }: { message: Message; isLast: boolean }) {
  const isUser = message.sender === 'user';
  const [isPlaying, setIsPlaying] = useState(false);

  const getStatusIcon = () => {
    if (message.sender === 'akilipesa') return null;
    
    switch (message.status) {
      case 'sending':
        return <Clock className="w-4 h-4 text-white/60" />;
      case 'sent':
        return <Check className="w-4 h-4 text-white/60" />;
      case 'delivered':
        return <CheckCheck className="w-4 h-4 text-white/60" />;
      case 'read':
        return <CheckCheck className="w-4 h-4 text-accent-400" />;
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  return (
    <div className={cn(
      'flex mb-2',
      isUser ? 'justify-end' : 'justify-start',
      isLast && 'mb-4'
    )}>
      {!isUser && (
        <img
          src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face"
          alt="AkiliPesa"
          className="w-8 h-8 rounded-full mr-2 mt-1 border-2 border-primary/50"
        />
      )}
      
      <div className={cn(
        'max-w-[280px] rounded-2xl px-4 py-2 relative',
        isUser 
          ? 'bg-primary text-white rounded-br-md' 
          : 'bg-white/10 text-white rounded-bl-md'
      )}>
        {message.type === 'text' && (
          <p className="text-sm leading-relaxed">{message.content}</p>
        )}

        {message.type === 'voice' && (
          <div className="flex items-center space-x-3 min-w-[200px]">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-10 h-10 bg-white/20 rounded-full flex-center hover:bg-white/30 transition-colors"
            >
              {isPlaying ? (
                <Pause className="w-5 h-5" />
              ) : (
                <Play className="w-5 h-5 ml-0.5" />
              )}
            </button>
            <div className="flex-1">
              <div className="flex space-x-1 items-center h-8">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div
                    key={i}
                    className={cn(
                      'w-1 bg-current rounded-full transition-all',
                      isPlaying && i < 6 ? 'h-6' : 'h-3'
                    )}
                  />
                ))}
              </div>
            </div>
            <span className="text-xs opacity-60">{message.duration || '0:15'}</span>
          </div>
        )}

        {message.type === 'image' && (
          <div className="rounded-lg overflow-hidden">
            <img
              src={message.fileUrl}
              alt="Shared image"
              className="w-full h-auto max-w-[200px]"
            />
          </div>
        )}

        {message.type === 'file' && (
          <div className="flex items-center space-x-3 min-w-[200px]">
            <div className="w-10 h-10 bg-white/20 rounded-full flex-center">
              <Paperclip className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">{message.fileName}</p>
              <p className="text-xs opacity-60">{message.fileSize}</p>
            </div>
            <button className="text-accent-400 hover:text-accent-300">
              <Download className="w-4 h-4" />
            </button>
          </div>
        )}

        <div className="flex items-center justify-end space-x-1 mt-1">
          <span className="text-xs opacity-60">{formatTime(message.timestamp)}</span>
          {getStatusIcon()}
        </div>
      </div>
    </div>
  );
}

function PlanBanner({ plan }: { plan: UserPlan }) {
  const getPlanIcon = () => {
    switch (plan.type) {
      case 'free':
        return <Star className="w-4 h-4" />;
      case 'basic':
        return <Zap className="w-4 h-4" />;
      case 'premium':
      case 'pro':
        return <Crown className="w-4 h-4" />;
    }
  };

  const getPlanColor = () => {
    switch (plan.type) {
      case 'free':
        return 'from-gray-500 to-gray-600';
      case 'basic':
        return 'from-blue-500 to-blue-600';
      case 'premium':
        return 'from-purple-500 to-purple-600';
      case 'pro':
        return 'from-yellow-500 to-yellow-600';
    }
  };

  const progressPercentage = (plan.messagesLeft / plan.maxMessages) * 100;

  return (
    <div className={cn(
      'mx-4 mb-4 p-3 rounded-xl bg-gradient-to-r',
      getPlanColor()
    )}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          {getPlanIcon()}
          <span className="font-bold text-white text-sm">{plan.name}</span>
        </div>
        <button className="text-white/80 hover:text-white text-xs font-medium">
          Upgrade →
        </button>
      </div>
      
      <div className="mb-2">
        <div className="flex justify-between text-xs text-white/80 mb-1">
          <span>Messages: {plan.messagesLeft}/{plan.maxMessages}</span>
          <span>AI: {plan.aiProvider.toUpperCase()}</span>
        </div>
        <div className="w-full bg-white/20 rounded-full h-1.5">
          <div
            className="bg-white h-1.5 rounded-full transition-all"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>
      
      <div className="flex flex-wrap gap-1">
        {plan.features.slice(0, 3).map((feature, index) => (
          <span key={index} className="text-xs bg-white/20 px-2 py-0.5 rounded-full text-white">
            {feature}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function ChatPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [messages, setMessages] = useState<Message[]>(mockMessages);

  // Use the id parameter to customize chat behavior
  const isAkiliPesaChat = id === 'akilipesa' || id === 'akili';
  const [newMessage, setNewMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [showAttachments, setShowAttachments] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const sendMessage = () => {
    if (!newMessage.trim()) return;

    const message: Message = {
      id: Date.now().toString(),
      content: newMessage,
      type: 'text',
      sender: 'user',
      timestamp: new Date(),
      status: 'sending'
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');

    // Simulate message status updates
    setTimeout(() => {
      setMessages(prev => prev.map(m => 
        m.id === message.id ? { ...m, status: 'sent' } : m
      ));
    }, 1000);

    setTimeout(() => {
      setMessages(prev => prev.map(m => 
        m.id === message.id ? { ...m, status: 'delivered' } : m
      ));
    }, 2000);

    // Simulate AI response with typing indicator
    if (isAkiliPesaChat) {
      setIsTyping(true);

      setTimeout(() => {
        setIsTyping(false);

        // Generate AI response based on user plan
        const getAIResponse = () => {
          const responses = {
            free: 'Thanks for your message! Upgrade to Premium for detailed financial advice and personalized recommendations.',
            basic: 'I understand your concern. Here\'s a basic overview of cash flow management principles...',
            premium: 'I understand you\'re facing cash flow challenges. Let me help you create a detailed cash flow forecast and identify specific strategies to improve your working capital. Based on my analysis...',
            pro: 'I understand you\'re facing cash flow challenges. Let me provide you with a comprehensive analysis using advanced AI models. I\'ll create a detailed cash flow forecast, identify optimization opportunities, and provide real-time market insights...'
          };
          return responses[mockUserPlan.type] || responses.free;
        };

        const aiResponse: Message = {
          id: (Date.now() + 1).toString(),
          content: getAIResponse(),
          type: 'text',
          sender: 'akilipesa',
          timestamp: new Date(),
          status: 'sent'
        };
        setMessages(prev => [...prev, aiResponse]);
      }, 2500);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const startVoiceRecording = () => {
    setIsRecording(true);
    // Implement voice recording logic
  };

  const stopVoiceRecording = () => {
    setIsRecording(false);
    // Process and send voice message
  };

  const handleFileUpload = (type: 'image' | 'file') => {
    // Set file input accept type based on parameter
    if (fileInputRef.current) {
      fileInputRef.current.accept = type === 'image' ? 'image/*,video/*' : '.pdf,.doc,.docx,.txt';
      fileInputRef.current.click();
    }
    setShowAttachments(false);
  };

  const makeCall = (type: 'audio' | 'video') => {
    const callTarget = isAkiliPesaChat ? 'akilipesa' : id;
    navigate(`/call/${callTarget}?type=${type}`);
  };

  return (
    <div className="h-screen-safe flex flex-col bg-gem-dark">
      {/* Header */}
      <div className="safe-top bg-gem-dark/95 backdrop-blur-sm border-b border-white/10 p-4">
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          
          <img
            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face"
            alt="AkiliPesa"
            className="w-10 h-10 rounded-full border-2 border-primary/50"
          />
          
          <div className="flex-1">
            <h1 className="font-bold text-white">
              {isAkiliPesaChat ? 'AkiliPesa AI' : 'Chat User'}
            </h1>
            <p className="text-sm text-white/60">
              {isAkiliPesaChat ? 'Financial Advisor • Online' : 'Last seen recently'}
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => makeCall('video')}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
              disabled={!mockUserPlan.canCall}
            >
              <Video className="w-5 h-5 text-white" />
            </button>
            <button 
              onClick={() => makeCall('audio')}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
              disabled={!mockUserPlan.canCall}
            >
              <Phone className="w-5 h-5 text-white" />
            </button>
            <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
              <MoreVertical className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
      </div>

      {/* Plan Banner - only show for AkiliPesa chat */}
      {isAkiliPesaChat && <PlanBanner plan={mockUserPlan} />}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-1">
        {messages.map((message, index) => (
          <MessageBubble
            key={message.id}
            message={message}
            isLast={index === messages.length - 1}
          />
        ))}

        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex justify-start mb-4">
            <img
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face"
              alt="AkiliPesa"
              className="w-8 h-8 rounded-full mr-2 mt-1 border-2 border-primary/50"
            />
            <div className="bg-white/10 text-white rounded-2xl rounded-bl-md px-4 py-3 max-w-[200px]">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-white/60 rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-white/60 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-white/60 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-white/10">
        {/* Attachment Options */}
        {showAttachments && (
          <div className="grid grid-cols-4 gap-3 mb-4">
            <button
              onClick={() => handleFileUpload('image')}
              className="flex flex-col items-center space-y-2 p-3 bg-white/10 rounded-xl hover:bg-white/20 transition-colors"
            >
              <Image className="w-6 h-6 text-white" />
              <span className="text-xs text-white">Photo</span>
            </button>
            <button
              onClick={() => navigate('/create/camera')}
              className="flex flex-col items-center space-y-2 p-3 bg-white/10 rounded-xl hover:bg-white/20 transition-colors"
            >
              <Camera className="w-6 h-6 text-white" />
              <span className="text-xs text-white">Camera</span>
            </button>
            <button
              onClick={() => handleFileUpload('file')}
              className="flex flex-col items-center space-y-2 p-3 bg-white/10 rounded-xl hover:bg-white/20 transition-colors"
              disabled={!mockUserPlan.canSendFiles}
            >
              <Paperclip className="w-6 h-6 text-white" />
              <span className="text-xs text-white">Document</span>
            </button>
            <button
              onClick={() => makeCall('video')}
              className="flex flex-col items-center space-y-2 p-3 bg-white/10 rounded-xl hover:bg-white/20 transition-colors"
              disabled={!mockUserPlan.canCall}
            >
              <Video className="w-6 h-6 text-white" />
              <span className="text-xs text-white">Video Call</span>
            </button>
          </div>
        )}

        {/* Message Input */}
        <div className="flex items-end space-x-2">
          <button
            onClick={() => setShowAttachments(!showAttachments)}
            className="p-3 hover:bg-white/10 rounded-full transition-colors"
          >
            <Paperclip className="w-5 h-5 text-white" />
          </button>
          
          <div className="flex-1 bg-white/10 rounded-2xl border border-white/20 focus-within:border-primary transition-colors">
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              className="w-full bg-transparent px-4 py-3 text-white placeholder-white/60 resize-none focus:outline-none max-h-32"
              rows={1}
              style={{ 
                minHeight: '48px',
                height: 'auto'
              }}
            />
          </div>
          
          {newMessage.trim() ? (
            <button
              onClick={sendMessage}
              className="p-3 bg-primary hover:bg-primary/90 rounded-full transition-colors"
            >
              <Send className="w-5 h-5 text-white" />
            </button>
          ) : (
            <button
              onMouseDown={startVoiceRecording}
              onMouseUp={stopVoiceRecording}
              onMouseLeave={stopVoiceRecording}
              className={cn(
                'p-3 rounded-full transition-colors',
                isRecording 
                  ? 'bg-red-500 hover:bg-red-600' 
                  : 'bg-white/10 hover:bg-white/20'
              )}
            >
              <Mic className="w-5 h-5 text-white" />
            </button>
          )}
        </div>
        
        {isRecording && (
          <div className="flex items-center justify-center mt-2 text-red-400 text-sm">
            <div className="w-2 h-2 bg-red-400 rounded-full mr-2 animate-pulse" />
            Recording... Release to send
          </div>
        )}
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,video/*,.pdf,.doc,.docx"
        className="hidden"
        onChange={(e) => {
          // Handle file upload
          console.log('File selected:', e.target.files?.[0]);
        }}
      />
    </div>
  );
}
