import { useState } from 'react';
import { Search, TrendingUp, Hash, Music, User, ShoppingBag, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const categories = [
  { id: 'all', name: 'All', icon: Search },
  { id: 'trending', name: 'Trending', icon: TrendingUp },
  { id: 'users', name: 'Users', icon: User },
  { id: 'sounds', name: 'Sounds', icon: Music },
  { id: 'products', name: 'Products', icon: ShoppingBag },
];

const trendingHashtags = [
  { name: '#Tanzania', posts: '2.3M', growth: '+15%' },
  { name: '#TechTZ', posts: '890K', growth: '+8%' },
  { name: '#Fashion', posts: '1.5M', growth: '+12%' },
  { name: '#Business', posts: '750K', growth: '+5%' },
  { name: '#Culture', posts: '980K', growth: '+10%' },
  { name: '#Food', posts: '1.2M', growth: '+7%' },
  { name: '#Music', posts: '650K', growth: '+20%' },
  { name: '#AI', posts: '420K', growth: '+25%' },
];

const trendingSounds = [
  { id: '1', name: 'Bongo Flava Beat', artist: 'Diamond Platnumz', uses: '125K', duration: '00:30' },
  { id: '2', name: 'Tanzanian Vibes', artist: 'Harmonize', uses: '89K', duration: '00:45' },
  { id: '3', name: 'Cultural Mix', artist: 'Rayvanny', uses: '156K', duration: '00:25' },
  { id: '4', name: 'Original Sound', artist: 'amina_tz', uses: '67K', duration: '00:20' },
];

const trendingUsers = [
  {
    id: '1',
    username: 'amina_tz',
    name: 'Amina Hassan',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b9d38aad?w=150&h=150&fit=crop&crop=face',
    followers: '125K',
    verified: true,
    category: 'Creator',
  },
  {
    id: '2',
    username: 'tech_james',
    name: 'James Mwangi',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    followers: '89K',
    verified: false,
    category: 'Tech',
  },
  {
    id: '3',
    username: 'fatuma_style',
    name: 'Fatuma Bakari',
    avatar: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=150&h=150&fit=crop&crop=face',
    followers: '156K',
    verified: true,
    category: 'Fashion',
  },
];

const trendingProducts = [
  {
    id: '1',
    name: 'Tanzanite Jewelry Set',
    price: '250,000 TSH',
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=200&h=200&fit=crop',
    seller: 'Gems Tanzania',
    rating: 4.8,
  },
  {
    id: '2',
    name: 'Kitenge Fashion Dress',
    price: '85,000 TSH',
    image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=200&h=200&fit=crop',
    seller: 'African Styles',
    rating: 4.6,
  },
];

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [showRecents, setShowRecents] = useState(false);

  const recentSearches = ['#Tanzania', 'Diamond Platnumz', 'Kitenge dress', 'AI tools'];

  const clearSearch = () => {
    setSearchQuery('');
    setShowRecents(false);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setShowRecents(false);
    // Perform search
    console.log('Searching for:', query);
  };

  return (
    <div className="h-screen-safe flex flex-col">
      {/* Header */}
      <div className="safe-top p-4 border-b border-white/10">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setShowRecents(true)}
            placeholder="Search for users, sounds, hashtags..."
            className="w-full pl-12 pr-12 py-4 input-field"
            autoComplete="off"
          />
          {searchQuery && (
            <button
              onClick={clearSearch}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 p-1 hover:bg-white/10 rounded-full transition-colors"
            >
              <X className="w-4 h-4 text-white/60" />
            </button>
          )}
        </div>

        {/* Categories */}
        {!showRecents && (
          <div className="flex space-x-2 mt-4 overflow-x-auto hide-scrollbar">
            {categories.map((category) => {
              const IconComponent = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={cn(
                    "flex items-center space-x-2 px-4 py-2 rounded-full whitespace-nowrap transition-all",
                    activeCategory === category.id
                      ? "bg-primary text-white"
                      : "bg-white/10 text-white/60 hover:bg-white/20"
                  )}
                >
                  <IconComponent className="w-4 h-4" />
                  <span className="font-medium">{category.name}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {showRecents && searchQuery === '' ? (
          /* Recent Searches */
          <div className="p-4">
            <h3 className="text-lg font-semibold text-white mb-4">Recent Searches</h3>
            <div className="space-y-2">
              {recentSearches.map((search, index) => (
                <button
                  key={index}
                  onClick={() => handleSearch(search)}
                  className="w-full text-left p-3 hover:bg-white/5 rounded-2xl transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <Search className="w-4 h-4 text-white/40" />
                    <span className="text-white">{search}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* Search Results / Discover Content */
          <div className="space-y-6 p-4">
            {/* Trending Hashtags */}
            {(activeCategory === 'all' || activeCategory === 'trending') && (
              <div>
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                  <Hash className="w-5 h-5 text-primary" />
                  <span>Trending Hashtags</span>
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {trendingHashtags.map((hashtag, index) => (
                    <button
                      key={index}
                      onClick={() => handleSearch(hashtag.name)}
                      className="card-hover text-left"
                    >
                      <div className="flex items-center space-x-2 mb-2">
                        <Hash className="w-4 h-4 text-primary" />
                        <span className="font-semibold text-white">{hashtag.name}</span>
                      </div>
                      <div className="text-white/60 text-sm">{hashtag.posts} posts</div>
                      <div className="text-accent text-sm font-medium">{hashtag.growth}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Trending Sounds */}
            {(activeCategory === 'all' || activeCategory === 'sounds') && (
              <div>
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                  <Music className="w-5 h-5 text-primary" />
                  <span>Trending Sounds</span>
                </h3>
                <div className="space-y-3">
                  {trendingSounds.map((sound) => (
                    <button
                      key={sound.id}
                      onClick={() => handleSearch(sound.name)}
                      className="w-full card-hover text-left"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-primary/20 rounded-xl flex-center">
                          <Music className="w-6 h-6 text-primary" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-white">{sound.name}</h4>
                          <p className="text-white/60 text-sm">{sound.artist}</p>
                          <div className="flex items-center space-x-3 text-white/40 text-xs">
                            <span>{sound.uses} uses</span>
                            <span>•</span>
                            <span>{sound.duration}</span>
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Trending Users */}
            {(activeCategory === 'all' || activeCategory === 'users') && (
              <div>
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                  <User className="w-5 h-5 text-primary" />
                  <span>Trending Creators</span>
                </h3>
                <div className="space-y-3">
                  {trendingUsers.map((user) => (
                    <button
                      key={user.id}
                      onClick={() => handleSearch(`@${user.username}`)}
                      className="w-full card-hover text-left"
                    >
                      <div className="flex items-center space-x-3">
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-12 h-12 rounded-full"
                        />
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <span className="font-semibold text-white">@{user.username}</span>
                            {user.verified && (
                              <div className="w-4 h-4 bg-primary rounded-full" />
                            )}
                          </div>
                          <p className="text-white/60 text-sm">{user.name}</p>
                          <div className="flex items-center space-x-3 text-white/40 text-xs">
                            <span>{user.followers} followers</span>
                            <span>•</span>
                            <span>{user.category}</span>
                          </div>
                        </div>
                        <button className="btn-outline text-sm px-4 py-2">
                          Follow
                        </button>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Trending Products */}
            {(activeCategory === 'all' || activeCategory === 'products') && (
              <div>
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                  <ShoppingBag className="w-5 h-5 text-primary" />
                  <span>Trending Products</span>
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {trendingProducts.map((product) => (
                    <button
                      key={product.id}
                      onClick={() => console.log('View product:', product.id)}
                      className="card-hover text-left"
                    >
                      <div className="aspect-square rounded-2xl overflow-hidden mb-3">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <h4 className="font-semibold text-white text-sm mb-1">{product.name}</h4>
                      <p className="text-primary font-bold text-sm mb-1">{product.price}</p>
                      <div className="flex items-center space-x-2 text-white/60 text-xs">
                        <span>{product.seller}</span>
                        <span>•</span>
                        <span>⭐ {product.rating}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
