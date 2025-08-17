import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Search, 
  Filter,
  Star,
  ShoppingCart,
  Heart,
  Play,
  Clock,
  Users,
  Zap,
  Brain,
  Music,
  Video,
  BookOpen,
  Calculator,
  Briefcase,
  Gavel,
  Sprout,
  Target,
  Headphones,
  Camera,
  Palette,
  Code,
  TrendingUp,
  Award,
  CheckCircle,
  ShoppingBag
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface AIService {
  id: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  rating: number;
  reviews: number;
  creator: {
    name: string;
    avatar: string;
    verified: boolean;
  };
  category: string;
  tags: string[];
  thumbnail: string;
  duration?: string;
  isLive?: boolean;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  deliveryTime: string;
  features: string[];
}

interface Category {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  color: string;
  count: number;
}

const categories: Category[] = [
  { id: 'ai-tutoring', name: 'AI Tutoring', icon: Brain, color: 'from-purple-500 to-pink-500', count: 245 },
  { id: 'music-creation', name: 'Music Creation', icon: Music, color: 'from-green-500 to-teal-500', count: 156 },
  { id: 'video-editing', name: 'Video Editing', icon: Video, color: 'from-blue-500 to-cyan-500', count: 189 },
  { id: 'business-advice', name: 'Business Advice', icon: Briefcase, color: 'from-orange-500 to-red-500', count: 167 },
  { id: 'legal-help', name: 'Legal Help', icon: Gavel, color: 'from-indigo-500 to-purple-500', count: 78 },
  { id: 'farming-advice', name: 'Farming Advice', icon: Sprout, color: 'from-green-400 to-emerald-500', count: 134 },
  { id: 'finance-help', name: 'Finance Help', icon: Calculator, color: 'from-yellow-500 to-orange-500', count: 203 },
  { id: 'sports-predictions', name: 'Sports Predictions', icon: Target, color: 'from-red-500 to-pink-500', count: 92 }
];

const mockServices: AIService[] = [
  {
    id: '1',
    title: 'AI-Powered Mathematics Tutoring',
    description: 'Get personalized math help with AI explanations and step-by-step solutions for all levels.',
    price: 15000,
    currency: 'TSH',
    rating: 4.8,
    reviews: 1247,
    creator: {
      name: 'Dr. Amina Hassan',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b9d38aad?w=150&h=150&fit=crop&crop=face',
      verified: true
    },
    category: 'ai-tutoring',
    tags: ['Mathematics', 'AI Tutor', 'Step-by-step'],
    thumbnail: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=400&h=300&fit=crop',
    duration: '1 hour',
    difficulty: 'Beginner',
    deliveryTime: 'Instant',
    features: ['24/7 AI Support', 'Practice Problems', 'Progress Tracking', 'Certificate']
  },
  {
    id: '2',
    title: 'AI Music Producer',
    description: 'Create professional beats and melodies using AI. Perfect for artists and content creators.',
    price: 25000,
    currency: 'TSH',
    rating: 4.9,
    reviews: 856,
    creator: {
      name: 'James Mwangi',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      verified: true
    },
    category: 'music-creation',
    tags: ['Beat Making', 'AI Composition', 'Professional'],
    thumbnail: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop',
    duration: '2 hours',
    isLive: true,
    difficulty: 'Intermediate',
    deliveryTime: '24 hours',
    features: ['High Quality Output', 'Multiple Genres', 'Commercial License', 'Revisions']
  },
  {
    id: '3',
    title: 'Business Plan AI Assistant',
    description: 'Get a comprehensive business plan created by AI, tailored for the Tanzanian market.',
    price: 50000,
    currency: 'TSH',
    rating: 4.7,
    reviews: 423,
    creator: {
      name: 'Sarah Kimani',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      verified: true
    },
    category: 'business-advice',
    tags: ['Business Plan', 'Market Research', 'AI Analysis'],
    thumbnail: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=400&h=300&fit=crop',
    duration: '3-5 days',
    difficulty: 'Advanced',
    deliveryTime: '5 days',
    features: ['Market Analysis', 'Financial Projections', 'Executive Summary', 'Investor Ready']
  }
];

export default function ShopPage() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [services, setServices] = useState<AIService[]>(mockServices);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<'popular' | 'price-low' | 'price-high' | 'rating'>('popular');

  const filteredServices = services.filter(service => {
    const matchesCategory = selectedCategory === 'all' || service.category === selectedCategory;
    const matchesSearch = service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         service.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         service.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const sortedServices = [...filteredServices].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'rating':
        return b.rating - a.rating;
      case 'popular':
      default:
        return b.reviews - a.reviews;
    }
  });

  const handleServiceClick = (serviceId: string) => {
    navigate(`/product/${serviceId}`);
  };

  const formatPrice = (price: number, currency: string) => {
    return `${price.toLocaleString()} ${currency}`;
  };

  return (
    <div className="h-screen-safe bg-white">
      {/* Header */}
      <div className="safe-top bg-white border-b border-gray-100">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => navigate('/reels')}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-xl font-bold">AI Shop</h1>
              <p className="text-sm text-gray-600">AI-powered services & content</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <Filter className="w-6 h-6" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors relative">
              <ShoppingCart className="w-6 h-6" />
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                <span className="text-xs text-white font-bold">2</span>
              </div>
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="px-4 pb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search AI services..."
              className="w-full pl-10 pr-4 py-3 bg-gray-50 rounded-xl border-none focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition-colors"
            />
          </div>
        </div>

        {/* Filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="border-t border-gray-100 overflow-hidden"
            >
              <div className="p-4 space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Sort by</label>
                  <div className="flex space-x-2">
                    {[
                      { id: 'popular', label: 'Popular' },
                      { id: 'price-low', label: 'Price: Low to High' },
                      { id: 'price-high', label: 'Price: High to Low' },
                      { id: 'rating', label: 'Highest Rated' }
                    ].map((option) => (
                      <button
                        key={option.id}
                        onClick={() => setSortBy(option.id as any)}
                        className={cn(
                          'px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                          sortBy === option.id
                            ? 'bg-primary text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        )}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Categories */}
      <div className="p-4">
        <div className="flex space-x-3 overflow-x-auto pb-2">
          <button
            onClick={() => setSelectedCategory('all')}
            className={cn(
              'flex-shrink-0 px-4 py-2 rounded-full font-medium transition-colors',
              selectedCategory === 'all'
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            )}
          >
            All
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={cn(
                'flex-shrink-0 flex items-center space-x-2 px-4 py-2 rounded-full font-medium transition-colors',
                selectedCategory === category.id
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              )}
            >
              <category.icon className="w-4 h-4" />
              <span>{category.name}</span>
              <span className="text-xs opacity-75">({category.count})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Featured Categories */}
      <div className="px-4 pb-4">
        <h2 className="text-lg font-bold mb-3">Featured Categories</h2>
        <div className="grid grid-cols-2 gap-3">
          {categories.slice(0, 4).map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className="p-4 rounded-2xl bg-gradient-to-br text-white text-left overflow-hidden relative"
              style={{
                background: `linear-gradient(135deg, var(--tw-gradient-from), var(--tw-gradient-to))`,
                ['--tw-gradient-from' as any]: category.color.split(' ')[1],
                ['--tw-gradient-to' as any]: category.color.split(' ')[3]
              } as React.CSSProperties}
            >
              <category.icon className="w-8 h-8 mb-2" />
              <h3 className="font-semibold mb-1">{category.name}</h3>
              <p className="text-sm opacity-90">{category.count} services</p>
              
              {/* Background decoration */}
              <div className="absolute -top-4 -right-4 w-16 h-16 bg-white/10 rounded-full" />
              <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-white/5 rounded-full" />
            </button>
          ))}
        </div>
      </div>

      {/* Services List */}
      <div className="flex-1 px-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">
            {selectedCategory === 'all' ? 'All Services' : categories.find(c => c.id === selectedCategory)?.name}
            <span className="text-sm text-gray-500 font-normal ml-2">
              ({sortedServices.length} results)
            </span>
          </h2>
        </div>

        <div className="space-y-4 pb-4">
          {sortedServices.map((service) => (
            <motion.div
              key={service.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-lg transition-shadow"
            >
              <button
                onClick={() => handleServiceClick(service.id)}
                className="w-full text-left"
              >
                <div className="relative">
                  <img
                    src={service.thumbnail}
                    alt={service.title}
                    className="w-full h-48 object-cover"
                  />
                  {service.isLive && (
                    <div className="absolute top-3 left-3 px-2 py-1 bg-red-500 text-white text-xs rounded-full font-medium flex items-center space-x-1">
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                      <span>LIVE</span>
                    </div>
                  )}
                  <div className="absolute top-3 right-3 p-2 bg-black/50 rounded-full backdrop-blur-sm">
                    <Heart className="w-5 h-5 text-white" />
                  </div>
                  {service.duration && (
                    <div className="absolute bottom-3 right-3 px-2 py-1 bg-black/70 text-white text-xs rounded-full flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>{service.duration}</span>
                    </div>
                  )}
                </div>

                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-1 line-clamp-1">{service.title}</h3>
                      <p className="text-gray-600 text-sm line-clamp-2 mb-2">{service.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 mb-3">
                    <img
                      src={service.creator.avatar}
                      alt={service.creator.name}
                      className="w-6 h-6 rounded-full"
                    />
                    <span className="text-sm text-gray-700">{service.creator.name}</span>
                    {service.creator.verified && (
                      <CheckCircle className="w-4 h-4 text-primary" />
                    )}
                    <span className={cn(
                      'px-2 py-1 text-xs rounded-full',
                      service.difficulty === 'Beginner' ? 'bg-green-100 text-green-700' :
                      service.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    )}>
                      {service.difficulty}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1 mb-3">
                    {service.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm font-medium">{service.rating}</span>
                        <span className="text-sm text-gray-500">({service.reviews})</span>
                      </div>
                      <div className="flex items-center space-x-1 text-sm text-gray-500">
                        <Clock className="w-4 h-4" />
                        <span>{service.deliveryTime}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-primary">
                        {formatPrice(service.price, service.currency)}
                      </div>
                    </div>
                  </div>
                </div>
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
