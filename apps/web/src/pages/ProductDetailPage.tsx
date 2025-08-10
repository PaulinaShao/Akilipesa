import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, Share, Star, StarHalf, Phone, Video, MessageCircle, ShoppingCart, Minus, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProductMedia {
  id: string;
  type: 'image' | 'video';
  url: string;
  thumbnailUrl?: string;
}

interface ProductData {
  id: string;
  name: string;
  description: string;
  price: string;
  originalPrice?: string;
  currency: string;
  stock: number;
  rating: number;
  reviewCount: number;
  category: string;
  tags: string[];
  media: ProductMedia[];
  seller: {
    id: string;
    name: string;
    avatar: string;
    verified: boolean;
    rating: number;
    responseTime: string;
  };
  inclusions: string[];
  features: string[];
  reviews: Array<{
    id: string;
    userName: string;
    userAvatar: string;
    rating: number;
    comment: string;
    date: string;
    verified: boolean;
  }>;
}

// Mock product data
const mockProduct: ProductData = {
  id: '1',
  name: 'Traditional Kitenge Dress',
  description: 'Beautiful handcrafted Kitenge dress made from authentic Tanzanian fabric. Perfect for special occasions and cultural celebrations. Features vibrant patterns inspired by traditional Tanzanian art.',
  price: '85,000',
  originalPrice: '120,000',
  currency: 'TSH',
  stock: 15,
  rating: 4.8,
  reviewCount: 127,
  category: 'Fashion',
  tags: ['Kitenge', 'Traditional', 'Handmade', 'Fashion'],
  media: [
    {
      id: '1',
      type: 'image',
      url: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800&h=1000&fit=crop'
    },
    {
      id: '2',
      type: 'video',
      url: 'https://sample-videos.com/zip/10/mp4/SampleVideo_360x240_1mb.mp4',
      thumbnailUrl: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800&h=1000&fit=crop'
    },
    {
      id: '3',
      type: 'image',
      url: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=800&h=1000&fit=crop'
    }
  ],
  seller: {
    id: 'seller1',
    name: 'Amina Hassan',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b9d38aad?w=150&h=150&fit=crop&crop=face',
    verified: true,
    rating: 4.9,
    responseTime: '~2 hours'
  },
  inclusions: [
    'Traditional Kitenge dress',
    'Matching headwrap',
    'Care instructions',
    'Certificate of authenticity'
  ],
  features: [
    '100% authentic Tanzanian Kitenge fabric',
    'Hand-stitched by local artisans',
    'Available in multiple sizes',
    'Machine washable',
    'Fade-resistant colors'
  ],
  reviews: [
    {
      id: '1',
      userName: 'Fatuma K.',
      userAvatar: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=150&h=150&fit=crop&crop=face',
      rating: 5,
      comment: 'Absolutely beautiful dress! The quality is amazing and it fits perfectly. Highly recommend!',
      date: '2024-01-15',
      verified: true
    },
    {
      id: '2',
      userName: 'Grace M.',
      userAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      rating: 4,
      comment: 'Great quality fabric and fast delivery. Will definitely order again.',
      date: '2024-01-10',
      verified: true
    }
  ]
};

function StarRating({ rating, size = 'sm' }: { rating: number; size?: 'sm' | 'md' | 'lg' }) {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;
  
  const iconSize = size === 'sm' ? 'w-4 h-4' : size === 'md' ? 'w-5 h-5' : 'w-6 h-6';
  
  for (let i = 0; i < fullStars; i++) {
    stars.push(<Star key={i} className={cn(iconSize, 'fill-yellow-400 text-yellow-400')} />);
  }
  
  if (hasHalfStar) {
    stars.push(<StarHalf key="half" className={cn(iconSize, 'fill-yellow-400 text-yellow-400')} />);
  }
  
  const emptyStars = 5 - Math.ceil(rating);
  for (let i = 0; i < emptyStars; i++) {
    stars.push(<Star key={`empty-${i}`} className={cn(iconSize, 'text-gray-300')} />);
  }
  
  return <div className="flex items-center space-x-1">{stars}</div>;
}

export default function ProductDetailPage() {
  const navigate = useNavigate();
  const [product] = useState<ProductData>(mockProduct);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isLiked, setIsLiked] = useState(false);
  const [activeTab, setActiveTab] = useState<'description' | 'inclusions' | 'reviews'>('description');

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);

  const handleBuyNow = () => {
    navigate(`/checkout/${product.id}?qty=${quantity}`);
  };

  const handleChat = () => {
    navigate(`/chat/${product.seller.id}`);
  };

  const handleCall = () => {
    navigate(`/call/new?mode=audio&target=${product.seller.id}`);
  };

  const handleVideoCall = () => {
    navigate(`/call/new?mode=video&target=${product.seller.id}`);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: product.description,
        url: window.location.href,
      });
    }
  };

  const formatPrice = (price: string) => {
    return new Intl.NumberFormat('en-TZ').format(parseInt(price));
  };

  return (
    <div className="min-h-screen-safe bg-gradient-to-b from-bg-primary to-bg-secondary pb-24">
      {/* Header */}
      <div className="safe-top p-4 flex items-center justify-between glass border-b border-white/10">
        <button 
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-white/10 rounded-full transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>
        <div className="flex items-center space-x-2">
          <button 
            onClick={() => setIsLiked(!isLiked)}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <Heart className={cn('w-6 h-6', isLiked ? 'fill-red-500 text-red-500' : 'text-white')} />
          </button>
          <button 
            onClick={handleShare}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <Share className="w-6 h-6 text-white" />
          </button>
        </div>
      </div>

      {/* Hero Media Carousel */}
      <div className="relative h-96 bg-black">
        {product.media[currentMediaIndex].type === 'video' ? (
          <video 
            src={product.media[currentMediaIndex].url}
            poster={product.media[currentMediaIndex].thumbnailUrl}
            className="w-full h-full object-cover"
            controls
            muted
          />
        ) : (
          <img 
            src={product.media[currentMediaIndex].url}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        )}
        
        {/* Media indicators */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {product.media.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentMediaIndex(index)}
              className={cn(
                'w-2 h-2 rounded-full transition-all',
                index === currentMediaIndex ? 'bg-white' : 'bg-white/40'
              )}
            />
          ))}
        </div>
      </div>

      {/* Product Info */}
      <div className="p-6 space-y-6">
        {/* Title and Seller */}
        <div>
          <div className="flex items-start justify-between mb-2">
            <h1 className="text-2xl font-bold text-white leading-tight flex-1 mr-4">
              {product.name}
            </h1>
            <div className="flex flex-col items-end">
              <div className="flex items-baseline space-x-2">
                <span className="text-2xl font-bold text-accent">
                  {formatPrice(product.price)} {product.currency}
                </span>
                {product.originalPrice && (
                  <span className="text-sm text-white/50 line-through">
                    {formatPrice(product.originalPrice)} {product.currency}
                  </span>
                )}
              </div>
            </div>
          </div>
          
          {/* Seller chip */}
          <button 
            onClick={() => navigate(`/profile/${product.seller.id}`)}
            className="flex items-center space-x-3 p-3 glass rounded-2xl hover:bg-white/10 transition-colors mb-4"
          >
            <img 
              src={product.seller.avatar}
              alt={product.seller.name}
              className="w-10 h-10 rounded-full"
            />
            <div className="flex-1 text-left">
              <div className="flex items-center space-x-2">
                <span className="font-semibold text-white">{product.seller.name}</span>
                {product.seller.verified && (
                  <div className="w-4 h-4 bg-primary rounded-full" />
                )}
              </div>
              <div className="flex items-center space-x-2 text-sm text-white/60">
                <StarRating rating={product.seller.rating} size="sm" />
                <span>• Responds in {product.seller.responseTime}</span>
              </div>
            </div>
          </button>

          {/* Rating and Stock */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <StarRating rating={product.rating} size="md" />
              <span className="text-white/70">
                {product.rating} ({product.reviewCount} reviews)
              </span>
            </div>
            <span className="text-sm text-white/60">
              {product.stock} in stock
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-3 gap-3">
          <button 
            onClick={handleChat}
            className="btn-secondary py-3 flex items-center justify-center space-x-2"
          >
            <MessageCircle className="w-5 h-5" />
            <span>Chat</span>
          </button>
          <button 
            onClick={handleCall}
            className="btn-secondary py-3 flex items-center justify-center space-x-2"
          >
            <Phone className="w-5 h-5" />
            <span>Call</span>
          </button>
          <button 
            onClick={handleVideoCall}
            className="btn-secondary py-3 flex items-center justify-center space-x-2"
          >
            <Video className="w-5 h-5" />
            <span>Video</span>
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-white/20">
          <div className="flex space-x-6">
            {(['description', 'inclusions', 'reviews'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  'py-3 px-1 border-b-2 font-medium text-sm capitalize transition-colors',
                  activeTab === tab
                    ? 'border-primary text-primary'
                    : 'border-transparent text-white/60 hover:text-white'
                )}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="space-y-4">
          {activeTab === 'description' && (
            <div>
              <p className="text-white/80 leading-relaxed mb-4">
                {product.description}
              </p>
              <div className="space-y-3">
                <h3 className="font-semibold text-white">Features:</h3>
                <ul className="space-y-2">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                      <span className="text-white/70">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'inclusions' && (
            <div className="space-y-3">
              <h3 className="font-semibold text-white">What's included:</h3>
              <ul className="space-y-2">
                {product.inclusions.map((inclusion, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0" />
                    <span className="text-white/70">{inclusion}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-4">
              {product.reviews.map((review) => (
                <div key={review.id} className="glass rounded-2xl p-4">
                  <div className="flex items-start space-x-3">
                    <img 
                      src={review.userAvatar}
                      alt={review.userName}
                      className="w-10 h-10 rounded-full"
                    />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="font-semibold text-white">{review.userName}</span>
                        {review.verified && (
                          <span className="text-xs text-primary">Verified</span>
                        )}
                        <span className="text-xs text-white/50">{review.date}</span>
                      </div>
                      <StarRating rating={review.rating} size="sm" />
                      <p className="text-white/70 mt-2">{review.comment}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Sticky Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-bg-primary via-bg-primary to-transparent p-4 safe-bottom">
        <div className="glass rounded-2xl p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-white text-xl font-bold">
                {formatPrice(product.price)} {product.currency}
              </span>
              {product.originalPrice && (
                <span className="text-white/50 text-sm line-through ml-2">
                  {formatPrice(product.originalPrice)} {product.currency}
                </span>
              )}
            </div>
            
            {/* Quantity Selector */}
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-2 glass rounded-full hover:bg-white/10 transition-colors"
              >
                <Minus className="w-4 h-4 text-white" />
              </button>
              <span className="text-white font-semibold w-8 text-center">{quantity}</span>
              <button
                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                className="p-2 glass rounded-full hover:bg-white/10 transition-colors"
              >
                <Plus className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>
          
          <button 
            onClick={handleBuyNow}
            disabled={product.stock === 0}
            className="w-full btn-primary py-4 flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            <ShoppingCart className="w-5 h-5" />
            <span className="font-semibold">
              {product.stock === 0 ? 'Out of Stock' : 'Buy Now'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
