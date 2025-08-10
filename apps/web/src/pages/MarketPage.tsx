import { useState } from 'react';
import { ShoppingBag, Star, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const categories = ['All', 'Fashion', 'Tech', 'Jewelry', 'Services', 'Food'];

const products = [
  {
    id: '1',
    name: 'Tanzanite Jewelry Set',
    price: 250000,
    currency: 'TSH',
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=300&h=300&fit=crop',
    seller: 'Gems Tanzania',
    rating: 4.8,
    reviews: 124,
    badge: 'AI',
    category: 'Jewelry',
  },
  {
    id: '2',
    name: 'Kitenge Fashion Dress',
    price: 85000,
    currency: 'TSH',
    image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=300&h=300&fit=crop',
    seller: 'African Styles',
    rating: 4.6,
    reviews: 89,
    badge: 'Creator',
    category: 'Fashion',
  },
  {
    id: '3',
    name: 'Tech Consultation',
    price: 50000,
    currency: 'TSH',
    image: 'https://images.unsplash.com/photo-1555421689-491a97ff2040?w=300&h=300&fit=crop',
    seller: 'James Tech',
    rating: 4.9,
    reviews: 156,
    badge: 'Creator',
    category: 'Services',
  },
  {
    id: '4',
    name: 'Traditional Artwork',
    price: 120000,
    currency: 'TSH',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=300&fit=crop',
    seller: 'Art Gallery TZ',
    rating: 4.7,
    reviews: 67,
    badge: 'AI',
    category: 'Art',
  },
];

export default function MarketPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.seller.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleProductClick = (productId: string) => {
    navigate(`/product/${productId}`);
  };

  return (
    <div className="h-screen-safe flex flex-col">
      {/* Header */}
      <div className="safe-top p-4 border-b border-white/10">
        <h1 className="heading-2 mb-4">Marketplace</h1>
        
        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products and services..."
            className="w-full pl-12 pr-4 py-3 input-field"
          />
        </div>

        {/* Categories */}
        <div className="flex space-x-2 overflow-x-auto hide-scrollbar">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                selectedCategory === category
                  ? 'bg-primary text-white'
                  : 'bg-white/10 text-white/60 hover:bg-white/20'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="grid grid-cols-2 gap-4">
          {filteredProducts.map((product) => (
            <button
              key={product.id}
              onClick={() => handleProductClick(product.id)}
              className="card-hover text-left"
            >
              <div className="aspect-square rounded-2xl overflow-hidden mb-3 relative">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2">
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                    product.badge === 'AI' 
                      ? 'bg-primary text-white' 
                      : 'bg-accent text-black'
                  }`}>
                    {product.badge}
                  </div>
                </div>
              </div>
              
              <h3 className="font-semibold text-white text-sm mb-1 line-clamp-2">
                {product.name}
              </h3>
              
              <p className="text-primary font-bold text-sm mb-1">
                {new Intl.NumberFormat('sw-TZ', {
                  style: 'currency',
                  currency: product.currency,
                  minimumFractionDigits: 0,
                }).format(product.price)}
              </p>
              
              <div className="flex items-center space-x-1 mb-1">
                <Star className="w-3 h-3 text-yellow-400 fill-current" />
                <span className="text-white/60 text-xs">{product.rating}</span>
                <span className="text-white/40 text-xs">({product.reviews})</span>
              </div>
              
              <p className="text-white/60 text-xs">{product.seller}</p>
            </button>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="empty-state">
            <ShoppingBag className="empty-state-icon" />
            <h3 className="empty-state-title">No products found</h3>
            <p className="empty-state-description">
              Try adjusting your search or browse different categories
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
