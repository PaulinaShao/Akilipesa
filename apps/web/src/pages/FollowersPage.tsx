import React, { useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { ArrowLeft, UserPlus, UserCheck, MessageCircle, Phone, Video } from 'lucide-react';
import { useGatedFollow, useGatedMessage } from '../hooks/useAuthGate';

interface User {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  bio?: string;
  verified: boolean;
  isFollowed: boolean;
  isLive?: boolean;
  mutualFollows?: number;
}

// Mock data
const mockUsers: User[] = [
  {
    id: '1',
    username: 'amina_hassan',
    displayName: 'Amina Hassan',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612e70a?w=150&h=150&fit=crop&crop=face',
    bio: 'Fashion designer from Dar es Salaam ✨',
    verified: true,
    isFollowed: false,
    mutualFollows: 12,
  },
  {
    id: '2',
    username: 'john_mwanza',
    displayName: 'John Mwanza',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    bio: 'Tech entrepreneur & AI enthusiast 🚀',
    verified: false,
    isFollowed: true,
    isLive: true,
    mutualFollows: 8,
  },
  {
    id: '3',
    username: 'grace_kilimo',
    displayName: 'Grace Kilimo',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    bio: 'Artist & content creator 🎨',
    verified: true,
    isFollowed: false,
    mutualFollows: 5,
  },
];

export default function FollowersPage() {
  const navigate = useNavigate();
  const { userId } = useParams();
  const [searchParams] = useSearchParams();
  const tab = searchParams.get('tab') || 'followers';
  
  const [users] = useState<User[]>(mockUsers);
  const [searchQuery, setSearchQuery] = useState('');
  
  const gatedFollow = useGatedFollow();
  const gatedMessage = useGatedMessage();
  
  const filteredUsers = users.filter(user =>
    user.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleFollow = (userId: string) => {
    gatedFollow(() => {
      console.log('Follow user:', userId);
      // TODO: Implement actual follow functionality
    });
  };

  const handleMessage = (userId: string) => {
    gatedMessage(() => {
      navigate(`/inbox/${userId}`);
    });
  };

  const handleCall = (userId: string, type: 'audio' | 'video') => {
    gatedMessage(() => {
      navigate(`/call/new?mode=${type}&target=${userId}`);
    });
  };

  const isFollowersTab = tab === 'followers';
  const title = isFollowersTab ? 'Followers' : 'Following';

  return (
    <div className="h-screen-safe bg-gradient-to-br from-[#0b0c14] to-[#2b1769] overflow-y-auto">
      {/* Header */}
      <div className="safe-top p-4 border-b border-white/10 sticky top-0 bg-gradient-to-br from-[#0b0c14] to-[#2b1769] backdrop-blur-sm z-10">
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <h1 className="text-xl font-bold text-white">{title}</h1>
        </div>

        {/* Tabs */}
        <div className="flex bg-white/10 rounded-lg p-1">
          <button
            onClick={() => navigate(`/profile/${userId}/followers?tab=followers`)}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              isFollowersTab
                ? 'bg-violet-500 text-white'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Followers
          </button>
          <button
            onClick={() => navigate(`/profile/${userId}/followers?tab=following`)}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              !isFollowersTab
                ? 'bg-violet-500 text-white'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Following
          </button>
        </div>

        {/* Search */}
        <div className="mt-4">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Search ${title.toLowerCase()}...`}
            className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {filteredUsers.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">👥</span>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">
              {searchQuery ? 'No results found' : `No ${title.toLowerCase()} yet`}
            </h3>
            <p className="text-zinc-400">
              {searchQuery 
                ? 'Try a different search term'
                : `${title} will appear here when available`
              }
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredUsers.map((user) => (
              <div
                key={user.id}
                className="bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => navigate(`/profile/${user.id}`)}
                    className="relative"
                  >
                    <img
                      src={user.avatar}
                      alt={user.displayName}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    {user.isLive && (
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 border-2 border-white rounded-full animate-pulse" />
                    )}
                  </button>

                  <div className="flex-1 min-w-0">
                    <button
                      onClick={() => navigate(`/profile/${user.id}`)}
                      className="text-left"
                    >
                      <div className="flex items-center gap-1">
                        <h3 className="text-white font-semibold truncate">
                          {user.displayName}
                        </h3>
                        {user.verified && (
                          <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-white text-xs">✓</span>
                          </div>
                        )}
                      </div>
                      <p className="text-zinc-400 text-sm">@{user.username}</p>
                      {user.bio && (
                        <p className="text-zinc-500 text-xs truncate mt-1">{user.bio}</p>
                      )}
                      {user.mutualFollows && user.mutualFollows > 0 && (
                        <p className="text-violet-400 text-xs mt-1">
                          {user.mutualFollows} mutual {user.mutualFollows === 1 ? 'follow' : 'follows'}
                        </p>
                      )}
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Call buttons */}
                    <button
                      onClick={() => handleCall(user.id, 'audio')}
                      className="p-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-lg transition-colors"
                      title="Audio call"
                    >
                      <Phone className="w-4 h-4" />
                    </button>
                    
                    <button
                      onClick={() => handleCall(user.id, 'video')}
                      className="p-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg transition-colors"
                      title="Video call"
                    >
                      <Video className="w-4 h-4" />
                    </button>

                    {/* Message button */}
                    <button
                      onClick={() => handleMessage(user.id)}
                      className="p-2 bg-violet-500/20 hover:bg-violet-500/30 text-violet-400 rounded-lg transition-colors"
                      title="Message"
                    >
                      <MessageCircle className="w-4 h-4" />
                    </button>

                    {/* Follow button */}
                    <button
                      onClick={() => handleFollow(user.id)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        user.isFollowed
                          ? 'bg-white/10 text-white border border-white/20 hover:bg-red-500/20 hover:text-red-400 hover:border-red-500/30'
                          : 'bg-violet-500 hover:bg-violet-600 text-white'
                      }`}
                    >
                      {user.isFollowed ? (
                        <UserCheck className="w-4 h-4" />
                      ) : (
                        <UserPlus className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
