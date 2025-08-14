import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Search, 
  Filter,
  Users,
  Clock,
  Star,
  Play,
  Video,
  Mic,
  Globe,
  Lock,
  Calendar,
  MapPin,
  Heart,
  Share,
  Eye,
  TrendingUp,
  Zap,
  Crown,
  Gift
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface Session {
  id: string;
  title: string;
  description: string;
  host: {
    id: string;
    name: string;
    avatar: string;
    verified: boolean;
    followers: number;
  };
  type: 'live' | 'call' | 'event' | 'workshop';
  privacy: 'public' | 'private' | 'followers';
  participants: {
    current: number;
    max: number;
  };
  startTime: string;
  duration: string;
  status: 'live' | 'upcoming' | 'ended';
  category: string;
  tags: string[];
  thumbnail: string;
  price?: number;
  currency?: string;
  rating?: number;
  isLiked?: boolean;
  isTrending?: boolean;
}

const mockSessions: Session[] = [
  {
    id: '1',
    title: 'Live Mathematics Tutorial - Calculus Basics',
    description: 'Join Dr. Amina for an interactive calculus session covering derivatives and integrals.',
    host: {
      id: 'host1',
      name: 'Dr. Amina Hassan',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b9d38aad?w=150&h=150&fit=crop&crop=face',
      verified: true,
      followers: 12500
    },
    type: 'live',
    privacy: 'public',
    participants: { current: 247, max: 500 },
    startTime: 'now',
    duration: '2 hours',
    status: 'live',
    category: 'Education',
    tags: ['Mathematics', 'Calculus', 'Tutorial'],
    thumbnail: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=400&h=300&fit=crop',
    rating: 4.9,
    isTrending: true
  },
  {
    id: '2',
    title: 'Business Strategy Workshop',
    description: 'Learn how to build a successful business plan for the Tanzanian market.',
    host: {
      id: 'host2',
      name: 'James Mwangi',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      verified: true,
      followers: 8900
    },
    type: 'workshop',
    privacy: 'public',
    participants: { current: 45, max: 100 },
    startTime: '2:00 PM',
    duration: '3 hours',
    status: 'upcoming',
    category: 'Business',
    tags: ['Strategy', 'Planning', 'Entrepreneurship'],
    thumbnail: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=400&h=300&fit=crop',
    price: 25000,
    currency: 'TSH',
    rating: 4.7
  },
  {
    id: '3',
    title: 'AI Music Production Masterclass',
    description: 'Create beats and melodies using AI tools. Bring your creativity to life!',
    host: {
      id: 'host3',
      name: 'Sarah Kimani',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      verified: false,
      followers: 5200
    },
    type: 'event',
    privacy: 'followers',
    participants: { current: 89, max: 150 },
    startTime: '6:00 PM',
    duration: '1.5 hours',
    status: 'upcoming',
    category: 'Creative',
    tags: ['Music', 'AI', 'Production'],
    thumbnail: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop',
    isLiked: true
  },
  {
    id: '4',
    title: 'Group Video Call - Language Exchange',
    description: 'Practice English and Swahili with native speakers in a friendly environment.',
    host: {
      id: 'host4',
      name: 'Grace Mutua',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
      verified: false,
      followers: 3400
    },
    type: 'call',
    privacy: 'public',
    participants: { current: 12, max: 20 },
    startTime: '7:30 PM',
    duration: '1 hour',
    status: 'upcoming',
    category: 'Language',
    tags: ['English', 'Swahili', 'Practice'],
    thumbnail: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=300&fit=crop'
  }
];

export default function JoinPage() {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState<Session[]>(mockSessions);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTab, setSelectedTab] = useState<'all' | 'live' | 'upcoming' | 'trending'>('all');

  const categories = [
    'all', 'Education', 'Business', 'Creative', 'Language', 'Technology', 'Health', 'Entertainment'
  ];

  const filteredSessions = sessions.filter(session => {
    const matchesCategory = selectedCategory === 'all' || session.category === selectedCategory;
    const matchesSearch = session.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         session.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         session.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    let matchesTab = true;
    if (selectedTab === 'live') {
      matchesTab = session.status === 'live';
    } else if (selectedTab === 'upcoming') {
      matchesTab = session.status === 'upcoming';
    } else if (selectedTab === 'trending') {
      matchesTab = session.isTrending === true;
    }

    return matchesCategory && matchesSearch && matchesTab;
  });

  const handleJoinSession = (session: Session) => {
    if (session.status === 'live') {
      if (session.type === 'live') {
        navigate(`/live/${session.id}`);
      } else {
        navigate(`/call/${session.id}`);
      }
    } else {
      // Show session preview/details
      navigate(`/session/${session.id}`);
    }
  };

  const handleLikeSession = (sessionId: string) => {
    setSessions(prev => prev.map(session => 
      session.id === sessionId 
        ? { ...session, isLiked: !session.isLiked }
        : session
    ));
  };

  const getStatusColor = (status: Session['status']) => {
    switch (status) {
      case 'live':
        return 'text-red-500 bg-red-100';
      case 'upcoming':
        return 'text-blue-500 bg-blue-100';
      case 'ended':
        return 'text-gray-500 bg-gray-100';
      default:
        return 'text-gray-500 bg-gray-100';
    }
  };

  const getTypeIcon = (type: Session['type']) => {
    switch (type) {
      case 'live':
        return <Play className="w-4 h-4" />;
      case 'call':
        return <Video className="w-4 h-4" />;
      case 'workshop':
        return <Users className="w-4 h-4" />;
      case 'event':
        return <Calendar className="w-4 h-4" />;
      default:
        return <Play className="w-4 h-4" />;
    }
  };

  const formatPrice = (price: number, currency: string) => {
    return `${price.toLocaleString()} ${currency}`;
  };

  return (
    <div className="h-screen-safe bg-white">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-100 safe-top">
        <div className="flex items-center justify-between p-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          
          <div>
            <h1 className="text-xl font-bold">Join Sessions</h1>
            <p className="text-sm text-gray-600">Discover live events and calls</p>
          </div>
          
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <Filter className="w-6 h-6" />
          </button>
        </div>

        {/* Search */}
        <div className="px-4 pb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search sessions..."
              className="w-full pl-10 pr-4 py-3 bg-gray-50 rounded-xl border-none focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition-colors"
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="px-4 pb-2">
          <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
            {[
              { id: 'all', label: 'All' },
              { id: 'live', label: 'Live' },
              { id: 'upcoming', label: 'Upcoming' },
              { id: 'trending', label: 'Trending' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedTab(tab.id as any)}
                className={cn(
                  'flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors',
                  selectedTab === tab.id
                    ? 'bg-white text-primary shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Categories */}
        <div className="px-4 pb-4">
          <div className="flex space-x-3 overflow-x-auto pb-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={cn(
                  'flex-shrink-0 px-4 py-2 rounded-full font-medium transition-colors capitalize',
                  selectedCategory === category
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                )}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Sessions List */}
      <div className="flex-1 overflow-y-auto">
        {filteredSessions.length === 0 ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No sessions found</h3>
              <p className="text-gray-600">Try adjusting your search or filters</p>
            </div>
          </div>
        ) : (
          <div className="p-4 space-y-4">
            {filteredSessions.map((session) => (
              <motion.div
                key={session.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="relative">
                  <img
                    src={session.thumbnail}
                    alt={session.title}
                    className="w-full h-48 object-cover"
                  />
                  
                  {/* Status Badge */}
                  <div className="absolute top-3 left-3 flex items-center space-x-2">
                    <span className={cn(
                      'px-2 py-1 text-xs font-medium rounded-full flex items-center space-x-1',
                      getStatusColor(session.status)
                    )}>
                      {getTypeIcon(session.type)}
                      <span className="capitalize">{session.status}</span>
                    </span>
                    
                    {session.isTrending && (
                      <span className="px-2 py-1 bg-orange-100 text-orange-600 text-xs rounded-full flex items-center space-x-1">
                        <TrendingUp className="w-3 h-3" />
                        <span>Trending</span>
                      </span>
                    )}
                  </div>

                  {/* Privacy Indicator */}
                  <div className="absolute top-3 right-3">
                    {session.privacy === 'private' ? (
                      <Lock className="w-5 h-5 text-white" />
                    ) : session.privacy === 'followers' ? (
                      <Users className="w-5 h-5 text-white" />
                    ) : (
                      <Globe className="w-5 h-5 text-white" />
                    )}
                  </div>

                  {/* Participants Counter */}
                  <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs flex items-center space-x-1">
                    <Users className="w-3 h-3" />
                    <span>{session.participants.current}/{session.participants.max}</span>
                  </div>
                </div>

                <div className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-bold text-lg mb-1 line-clamp-1">{session.title}</h3>
                      <p className="text-gray-600 text-sm line-clamp-2 mb-2">{session.description}</p>
                    </div>
                    
                    <button
                      onClick={() => handleLikeSession(session.id)}
                      className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      <Heart className={cn(
                        'w-5 h-5',
                        session.isLiked ? 'fill-current text-red-500' : 'text-gray-400'
                      )} />
                    </button>
                  </div>

                  {/* Host Info */}
                  <div className="flex items-center space-x-3 mb-3">
                    <img
                      src={session.host.avatar}
                      alt={session.host.name}
                      className="w-10 h-10 rounded-full"
                    />
                    <div className="flex-1">
                      <div className="flex items-center space-x-1">
                        <span className="font-medium text-sm">{session.host.name}</span>
                        {session.host.verified && (
                          <Crown className="w-4 h-4 text-primary" />
                        )}
                      </div>
                      <p className="text-xs text-gray-500">
                        {session.host.followers.toLocaleString()} followers
                      </p>
                    </div>
                  </div>

                  {/* Session Details */}
                  <div className="flex items-center justify-between mb-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{session.startTime}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{session.duration}</span>
                      </div>
                      {session.rating && (
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span>{session.rating}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {session.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => handleJoinSession(session)}
                      className={cn(
                        'flex-1 py-3 rounded-xl font-semibold transition-colors flex items-center justify-center space-x-2',
                        session.status === 'live'
                          ? 'bg-red-500 hover:bg-red-600 text-white'
                          : 'bg-primary hover:bg-primary/90 text-white'
                      )}
                    >
                      {session.status === 'live' ? (
                        <>
                          <Play className="w-5 h-5" />
                          <span>Join Live</span>
                        </>
                      ) : (
                        <>
                          <Calendar className="w-5 h-5" />
                          <span>View Details</span>
                        </>
                      )}
                    </button>

                    {session.price && (
                      <div className="text-right">
                        <div className="text-lg font-bold text-primary">
                          {formatPrice(session.price, session.currency!)}
                        </div>
                      </div>
                    )}

                    <button className="p-3 hover:bg-gray-100 rounded-xl transition-colors">
                      <Share className="w-5 h-5 text-gray-600" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Floating Create Button */}
      <button
        onClick={() => navigate('/create/live')}
        className="fixed bottom-6 right-6 w-14 h-14 bg-primary hover:bg-primary/90 text-white rounded-full shadow-lg flex items-center justify-center transition-colors safe-bottom"
      >
        <Video className="w-6 h-6" />
      </button>
    </div>
  );
}
