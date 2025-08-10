import { useState } from 'react';
import { Search, TrendingUp, Users, ShoppingBag, Sparkles, Hash } from 'lucide-react';
import { cn } from '@/lib/utils';

const categories = [
  { id: 'trending', name: 'Trending', icon: TrendingUp },
  { id: 'creators', name: 'Creators', icon: Users },
  { id: 'marketplace', name: 'Shop', icon: ShoppingBag },
  { id: 'clones', name: 'AI Clones', icon: Sparkles },
];

const trendingHashtags = [
  { name: '#Tanzania', posts: '2.3M', trend: '+15%' },
  { name: '#TechTZ', posts: '890K', trend: '+8%' },
  { name: '#Fashion', posts: '1.5M', trend: '+12%' },
  { name: '#Business', posts: '750K', trend: '+5%' },
  { name: '#Culture', posts: '980K', trend: '+10%' },
  { name: '#Food', posts: '1.2M', trend: '+7%' },
];

const featuredCreators = [
  {
    id: '1',
    username: 'amina_tz',
    name: 'Amina Hassan',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b9d38aad?w=150&h=150&fit=crop&crop=face',
    followers: '125K',
    verified: true,
  },
  {
    id: '2',
    username: 'tech_james',
    name: 'James Mwangi',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    followers: '89K',
    verified: false,
  },
];

const marketplaceItems = [
  {
    id: '1',
    name: 'Tanzanite Jewelry',
    price: '250,000 TSH',
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=200&h=200&fit=crop',
    seller: 'Gems Tanzania',
  },
  {
    id: '2',
    name: 'Kitenge Dress',
    price: '85,000 TSH',
    image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=200&h=200&fit=crop',
    seller: 'African Styles',
  },
];

export default function DiscoverPage() {
  const [activeCategory, setActiveCategory] = useState('trending');
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="h-screen-safe bg-gem-dark overflow-y-auto">
      {/* Header */}
      <div className="safe-top p-4 border-b border-white/10">
        <h1 className="text-2xl font-bold text-white mb-4">Discover</h1>
        
        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search hashtags, creators, products..."
            className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-full text-white placeholder:text-white/50 focus:border-accent-400 focus:ring-2 focus:ring-accent-400/20 transition-all"
          />
        </div>
        
        {/* Category tabs */}
        <div className="flex space-x-2 overflow-x-auto hide-scrollbar">
          {categories.map((category) => {
            const IconComponent = category.icon;
            return (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={cn(
                  "flex items-center space-x-2 px-4 py-2 rounded-full whitespace-nowrap transition-all",
                  activeCategory === category.id
                    ? "bg-accent-500 text-white"
                    : "bg-white/10 text-white/60 hover:bg-white/20"
                )}
              >
                <IconComponent className="w-4 h-4" />
                <span className="font-medium">{category.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-6">
        {activeCategory === 'trending' && (
          <div className="space-y-6">
            {/* Trending Hashtags */}
            <div>
              <h2 className="text-xl font-bold text-white mb-4">Trending Hashtags</h2>
              <div className="grid grid-cols-2 gap-3">
                {trendingHashtags.map((hashtag) => (
                  <div key={hashtag.name} className="card-gem p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Hash className="w-5 h-5 text-accent-400" />
                      <span className="font-semibold text-white">{hashtag.name}</span>
                    </div>
                    <div className="text-white/60 text-sm">
                      {hashtag.posts} posts
                    </div>
                    <div className="text-green-400 text-sm font-medium">
                      {hashtag.trend}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeCategory === 'creators' && (
          <div>
            <h2 className="text-xl font-bold text-white mb-4">Featured Creators</h2>
            <div className="space-y-4">
              {featuredCreators.map((creator) => (
                <div key={creator.id} className="card-gem p-4">
                  <div className="flex items-center space-x-3">
                    <img
                      src={creator.avatar}
                      alt={creator.name}
                      className="w-12 h-12 rounded-full"
                    />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold text-white">@{creator.username}</span>
                        {creator.verified && (
                          <div className="w-4 h-4 bg-accent-400 rounded-full" />
                        )}
                      </div>
                      <div className="text-white/60 text-sm">{creator.name}</div>
                      <div className="text-white/60 text-sm">{creator.followers} followers</div>
                    </div>
                    <button className="btn-gem-outline text-sm px-4 py-2">
                      Follow
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeCategory === 'marketplace' && (
          <div>
            <h2 className="text-xl font-bold text-white mb-4">Featured Products</h2>
            <div className="grid grid-cols-2 gap-4">
              {marketplaceItems.map((item) => (
                <div key={item.id} className="card-gem p-3">
                  <div className="aspect-square rounded-lg overflow-hidden mb-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="font-semibold text-white text-sm mb-1">{item.name}</h3>
                  <p className="text-accent-400 font-bold text-sm mb-1">{item.price}</p>
                  <p className="text-white/60 text-xs">{item.seller}</p>
                  <button className="w-full btn-gem text-sm py-2 mt-3">
                    View Product
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeCategory === 'clones' && (
          <div>
            <h2 className="text-xl font-bold text-white mb-4">AI Clones</h2>
            <div className="card-gem p-6 text-center">
              <Sparkles className="w-16 h-16 text-accent-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">AI Clones Coming Soon</h3>
              <p className="text-white/60 mb-4">
                Create AI versions of yourself for automated content creation and customer service.
              </p>
              <button className="btn-gem">Join Waitlist</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
