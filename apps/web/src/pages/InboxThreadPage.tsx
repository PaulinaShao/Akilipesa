import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Phone, Video, MoreVertical, Send, Mic, Image, Smile } from 'lucide-react';
import { requireAuth } from '@/lib/authGuard';

interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: Date;
  type: 'text' | 'image' | 'audio' | 'system';
  imageUrl?: string;
  audioUrl?: string;
}

interface User {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  isOnline: boolean;
  lastSeen?: Date;
}

// Mock data
const mockUser: User = {
  id: '1',
  username: 'amina_hassan',
  displayName: 'Amina Hassan',
  avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612e70a?w=150&h=150&fit=crop&crop=face',
  isOnline: true,
};

const mockMessages: Message[] = [
  {
    id: '1',
    senderId: '1',
    content: 'Hey! Love your latest reel about AI trends',
    timestamp: new Date(Date.now() - 60 * 60 * 1000),
    type: 'text',
  },
  {
    id: '2',
    senderId: 'current',
    content: 'Thank you! I\'m really excited about the AI developments in Tanzania',
    timestamp: new Date(Date.now() - 55 * 60 * 1000),
    type: 'text',
  },
  {
    id: '3',
    senderId: '1',
    content: 'Would love to collaborate on a project sometime',
    timestamp: new Date(Date.now() - 50 * 60 * 1000),
    type: 'text',
  },
  {
    id: '4',
    senderId: 'current',
    content: 'That sounds amazing! Let\'s schedule a call to discuss',
    timestamp: new Date(Date.now() - 5 * 60 * 1000),
    type: 'text',
  },
];

export default function InboxThreadPage() {
  const navigate = useNavigate();
  const { threadId } = useParams();
  const [messages] = useState<Message[]>(mockMessages);
  const [newMessage, setNewMessage] = useState('');
  const [user] = useState<User>(mockUser);

  // Use threadId for future API calls
  console.log('Thread ID:', threadId);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    console.log('Sending message:', newMessage);
    // TODO: Implement actual message sending
    setNewMessage('');
  };

  const handleCall = (type: 'audio' | 'video') => {
    requireAuth(`start ${type} call with ${user.displayName}`, () => {
      navigate(`/call/new?mode=${type}&target=${user.id}`);
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  const formatDate = (date: Date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <div className="h-screen-safe bg-gradient-to-br from-[#0b0c14] to-[#2b1769] flex flex-col">
      {/* Header */}
      <div className="safe-top p-4 border-b border-white/10 bg-gradient-to-br from-[#0b0c14] to-[#2b1769] backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>

          <button
            onClick={() => navigate(`/profile/${user.id}`)}
            className="flex items-center gap-3 flex-1"
          >
            <div className="relative">
              <img
                src={user.avatar}
                alt={user.displayName}
                className="w-10 h-10 rounded-full object-cover"
              />
              {user.isOnline && (
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
              )}
            </div>
            <div className="text-left">
              <h3 className="text-white font-semibold">{user.displayName}</h3>
              <p className="text-zinc-400 text-sm">
                {user.isOnline ? 'Online' : user.lastSeen ? `Last seen ${formatTime(user.lastSeen)}` : 'Offline'}
              </p>
            </div>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleCall('audio')}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <Phone className="w-5 h-5 text-white" />
            </button>
            <button
              onClick={() => handleCall('video')}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <Video className="w-5 h-5 text-white" />
            </button>
            <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
              <MoreVertical className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => {
          const isOwn = message.senderId === 'current';
          const showDate = index === 0 || 
            formatDate(message.timestamp) !== formatDate(messages[index - 1].timestamp);

          return (
            <div key={message.id}>
              {showDate && (
                <div className="text-center mb-4">
                  <span className="bg-white/10 text-zinc-400 text-xs px-3 py-1 rounded-full">
                    {formatDate(message.timestamp)}
                  </span>
                </div>
              )}
              
              <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[70%] ${isOwn ? 'order-2' : 'order-1'}`}>
                  <div
                    className={`px-4 py-2 rounded-2xl ${
                      isOwn
                        ? 'bg-gradient-to-r from-violet-600 to-violet-500 text-white ml-2'
                        : 'bg-white/10 text-white mr-2'
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                  </div>
                  <div className={`mt-1 ${isOwn ? 'text-right' : 'text-left'}`}>
                    <span className="text-zinc-500 text-xs">
                      {formatTime(message.timestamp)}
                    </span>
                  </div>
                </div>
                
                {!isOwn && (
                  <div className="order-0 mr-2">
                    <img
                      src={user.avatar}
                      alt={user.displayName}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Message Input */}
      <div className="p-4 border-t border-white/10 bg-gradient-to-br from-[#0b0c14] to-[#2b1769]">
        <form onSubmit={handleSendMessage} className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <Image className="w-5 h-5 text-zinc-400" />
            </button>
            <button
              type="button"
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <Mic className="w-5 h-5 text-zinc-400" />
            </button>
          </div>

          <div className="flex-1 relative">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="w-full bg-white/10 border border-white/20 rounded-full px-4 py-2 pr-12 text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-white/10 rounded-full transition-colors"
            >
              <Smile className="w-4 h-4 text-zinc-400" />
            </button>
          </div>

          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="p-2 bg-gradient-to-r from-violet-600 to-violet-500 hover:from-violet-500 hover:to-violet-400 disabled:from-zinc-600 disabled:to-zinc-600 text-white rounded-full transition-all"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
}
