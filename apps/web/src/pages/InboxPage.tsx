import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MoreVertical, Phone, Video, Heart, Sparkles, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { requireAuth } from '@/lib/authGuard';
import Screen from '@/components/Screen';
import BackToTop from '@/components/BackToTop';

interface Message {
  id: string;
  user: {
    id: string;
    username: string;
    name: string;
    avatar: string;
    isOnline: boolean;
  };
  lastMessage: {
    text: string;
    timestamp: Date;
    isRead: boolean;
    type: 'text' | 'image' | 'video' | 'audio';
  };
  unreadCount: number;
}

const mockMessages: Message[] = [
  {
    id: 'akilipesa',
    user: {
      id: 'akilipesa',
      username: 'akilipesa_ai',
      name: 'AkiliPesa AI',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      isOnline: true,
    },
    lastMessage: {
      text: 'I understand you\'re facing cash flow challenges. Let me help you create a cash flow forecast...',
      timestamp: new Date(Date.now() - 2 * 60 * 1000), // 2 minutes ago
      isRead: false,
      type: 'text',
    },
    unreadCount: 1,
  },
  {
    id: '1',
    user: {
      id: '1',
      username: 'amina_tz',
      name: 'Amina Hassan',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b9d38aad?w=150&h=150&fit=crop&crop=face',
      isOnline: true,
    },
    lastMessage: {
      text: 'Thanks for liking my latest reel! 😊',
      timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
      isRead: false,
      type: 'text',
    },
    unreadCount: 2,
  },
  {
    id: '2',
    user: {
      id: '2',
      username: 'tech_james',
      name: 'James Mwangi',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      isOnline: false,
    },
    lastMessage: {
      text: 'Check out this new tech tutorial!',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      isRead: true,
      type: 'video',
    },
    unreadCount: 0,
  },
  {
    id: '3',
    user: {
      id: '3',
      username: 'fatuma_style',
      name: 'Fatuma Bakari',
      avatar: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=150&h=150&fit=crop&crop=face',
      isOnline: true,
    },
    lastMessage: {
      text: 'Love your fashion content! 💃',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
      isRead: true,
      type: 'text',
    },
    unreadCount: 0,
  },
];

function getTimeAgo(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  
  if (days > 0) return `${days}d`;
  if (hours > 0) return `${hours}h`;
  if (minutes > 0) return `${minutes}m`;
  return 'now';
}

export default function InboxPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  const filters = [
    { id: 'all', name: 'All' },
    { id: 'unread', name: 'Unread' },
    { id: 'online', name: 'Online' },
  ];

  const filteredMessages = mockMessages.filter(message => {
    const matchesSearch = message.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         message.user.username.toLowerCase().includes(searchQuery.toLowerCase());
    
    let matchesFilter = true;
    if (selectedFilter === 'unread') {
      matchesFilter = message.unreadCount > 0;
    } else if (selectedFilter === 'online') {
      matchesFilter = message.user.isOnline;
    }
    
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="h-screen-safe bg-gem-dark overflow-y-auto">
      {/* Header */}
      <div className="safe-top p-4 border-b border-white/10">
        <div className="flex-between mb-4">
          <h1 className="text-2xl font-bold text-white">Inbox</h1>
          <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <MoreVertical className="w-5 h-5 text-white" />
          </button>
        </div>
        
        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search messages..."
            className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-full text-white placeholder:text-white/50 focus:border-accent-400 focus:ring-2 focus:ring-accent-400/20 transition-all"
          />
        </div>
        
        {/* Filters */}
        <div className="flex space-x-2">
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setSelectedFilter(filter.id)}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium transition-all",
                selectedFilter === filter.id
                  ? "bg-accent-500 text-white"
                  : "bg-white/10 text-white/60 hover:bg-white/20"
              )}
            >
              {filter.name}
            </button>
          ))}
        </div>
      </div>

      {/* Messages List */}
      <div className="divide-y divide-white/5">
        {/* AI Assistant - Pinned */}
        <div className="p-4 bg-gradient-to-r from-primary/10 to-secondary/10 border-b border-primary/20">
          <div className="flex items-center space-x-3">
            {/* AI Avatar */}
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 border-2 border-bg-primary rounded-full" />
            </div>

            {/* AI Message content */}
            <div
              className="flex-1 min-w-0 cursor-pointer"
              onClick={() => navigate('/chat/akili?role=system')}
            >
              <div className="flex-between mb-1">
                <div className="flex items-center space-x-2">
                  <span className="font-semibold text-white">
                    Chat with AkiliPesa
                  </span>
                  <div className="w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                    <Sparkles className="w-2 h-2 text-white" />
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-white/50 text-sm">now</span>
                </div>
              </div>

              <div className="flex-between">
                <p className="text-sm text-white/80">
                  💎 I'm here to help with payments, business, and more!
                </p>

                {/* Action buttons for AI */}
                <div className="flex items-center space-x-1 ml-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      requireAuth('start audio call with AkiliPesa AI', () => {
                        navigate('/call/new?mode=audio&target=akili');
                      });
                    }}
                    className="p-1.5 hover:bg-white/10 rounded-full transition-colors"
                  >
                    <Phone className="w-4 h-4 text-green-400" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      requireAuth('start video call with AkiliPesa AI', () => {
                        navigate('/call/new?mode=video&target=akili');
                      });
                    }}
                    className="p-1.5 hover:bg-white/10 rounded-full transition-colors"
                  >
                    <Video className="w-4 h-4 text-blue-400" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {filteredMessages.length > 0 ? (
          filteredMessages.map((message) => (
            <div
              key={message.id}
              className="p-4 hover:bg-white/5 transition-colors cursor-pointer"
              onClick={() => navigate(`/chat/${message.user.id}`)}
            >
              <div className="flex items-center space-x-3">
                {/* Avatar with online indicator */}
                <div className="relative">
                  <img
                    src={message.user.avatar}
                    alt={message.user.name}
                    className="w-12 h-12 rounded-full"
                  />
                  {message.user.isOnline && (
                    <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 border-2 border-gem-dark rounded-full" />
                  )}
                </div>
                
                {/* Message content */}
                <div className="flex-1 min-w-0">
                  <div className="flex-between mb-1">
                    <div className="flex items-center space-x-2">
                      <span className={cn(
                        "font-semibold truncate",
                        message.lastMessage.isRead ? "text-white/80" : "text-white"
                      )}>
                        {message.user.name}
                      </span>
                      <span className="text-white/50 text-sm">@{message.user.username}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-white/50 text-sm">
                        {getTimeAgo(message.lastMessage.timestamp)}
                      </span>
                      {message.unreadCount > 0 && (
                        <div className="w-5 h-5 bg-accent-500 rounded-full flex-center">
                          <span className="text-white text-xs font-bold">
                            {message.unreadCount}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex-between">
                    <p className={cn(
                      "text-sm truncate",
                      message.lastMessage.isRead ? "text-white/60" : "text-white/80"
                    )}>
                      {message.lastMessage.type === 'video' && '📹 '}
                      {message.lastMessage.type === 'image' && '📷 '}
                      {message.lastMessage.type === 'audio' && '🎵 '}
                      {message.lastMessage.text}
                    </p>
                    
                    {/* Action buttons */}
                    <div className="flex items-center space-x-1 ml-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/call/new?mode=audio&target=${message.user.id}`);
                        }}
                        className="p-1.5 hover:bg-white/10 rounded-full transition-colors"
                      >
                        <Phone className="w-4 h-4 text-green-400" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/call/new?mode=video&target=${message.user.id}`);
                        }}
                        className="p-1.5 hover:bg-white/10 rounded-full transition-colors"
                      >
                        <Video className="w-4 h-4 text-blue-400" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-white/10 rounded-full flex-center mx-auto mb-4">
              <Heart className="w-10 h-10 text-white/40" />
            </div>
            <h3 className="text-white font-semibold mb-2">No messages found</h3>
            <p className="text-white/60 text-sm">
              {searchQuery ? 'Try adjusting your search' : 'Start connecting with creators!'}
            </p>
          </div>
        )}
      </div>

      {/* Quick Actions (floating) */}
      <div className="fixed bottom-20 right-4 z-10 flex flex-col space-y-3">
        <button
          onClick={() => navigate('/search?mode=users')}
          className="w-12 h-12 bg-white/10 rounded-full flex-center shadow-lg hover:scale-110 transition-transform"
        >
          <Search className="w-5 h-5 text-white" />
        </button>
        <button
          onClick={() => navigate('/create?mode=message')}
          className="w-14 h-14 bg-accent rounded-full flex-center shadow-lg hover:scale-110 transition-transform"
        >
          <Plus className="w-6 h-6 text-black" />
        </button>
      </div>
    </div>
  );
}
