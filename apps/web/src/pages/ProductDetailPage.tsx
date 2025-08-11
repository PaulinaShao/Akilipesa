import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ArrowLeft, 
  Heart, 
  Share, 
  Phone, 
  Video, 
  MessageCircle, 
  ShoppingCart, 
  CreditCard,
  Star,
  MoreHorizontal,
  UserCheck,
  MapPin,
  Clock,
  Shield,
  TrendingUp
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/store';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/queryClient';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  images: string[];
  category: string;
  seller: {
    id: string;
    username: string;
    displayName: string;
    avatar: string;
    verified: boolean;
    rating: number;
    totalSales: number;
    responseTime: string;
    location: string;
  };
  commission: {
    rate: number;
    amount: number;
  };
  stats: {
    views: number;
    likes: number;
    shares: number;
    sold: number;
  };
  features: string[];
  tags: string[];
  isLiked: boolean;
  inStock: boolean;
  deliveryTime: string;
  returnsPolicy: string;
}

const mockProduct: Product = {
  id: '1',
  name: 'Premium Tanzanite Jewelry Set',
  description: 'Handcrafted Tanzanite jewelry set featuring genuine stones sourced from the Mererani Hills. This exclusive collection includes matching earrings, necklace, and ring, perfect for special occasions or as an investment piece.',
  price: 450000,
  currency: 'TSH',
  images: [
    'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=400&h=400&fit=crop',
  ],
  category: 'Jewelry',
  seller: {
    id: 'seller1',
    username: 'gems_tanzania',
    displayName: 'Gems Tanzania Ltd',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    verified: true,
    rating: 4.8,
    totalSales: 1247,
    responseTime: '< 1 hour',
    location: 'Arusha, Tanzania',
  },
  commission: {
    rate: 15,
    amount: 67500,
  },
  stats: {
    views: 15670,
    likes: 892,
    shares: 234,
    sold: 67,
  },
  features: [
    'Genuine Tanzanite stones',
    'Certificate of authenticity',
    'Handcrafted design',
    '925 Sterling silver setting',
    'Gift box included',
    'Lifetime warranty',
  ],
  tags: ['luxury', 'handmade', 'tanzanite', 'jewelry', 'investment'],
  isLiked: false,
  inStock: true,
  deliveryTime: '3-5 business days',
  returnsPolicy: '30-day money-back guarantee',
};

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { startCall } = useAppStore();
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  // In a real app, this would fetch from the API
  const { data: product, isLoading } = useQuery({
    queryKey: ['product', id],
    queryFn: () => api.getProduct(id!),
    placeholderData: mockProduct,
  });

  useEffect(() => {
    if (product) {
      setIsLiked(product.isLiked);
    }
  }, [product]);

  const formatPrice = (amount: number, currency: string = 'TSH') => {
    return new Intl.NumberFormat('sw-TZ', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const handleCallVideo = () => {
    if (product) {
      startCall({ type: 'video', targetId: product.seller.id });
      navigate(`/call/${product.seller.id}?type=video`);
    }
  };

  const handleCallAudio = () => {
    if (product) {
      startCall({ type: 'audio', targetId: product.seller.id });
      navigate(`/call/${product.seller.id}?type=audio`);
    }
  };

  const handleAskAI = () => {
    navigate(`/chat/akilipesa?product=${id}`);
  };

  const handleAddToCart = () => {
    // Add to cart logic
    console.log('Added to cart:', { productId: id, quantity });
  };

  const handleBuyNow = () => {
    navigate(`/checkout/${id}?quantity=${quantity}`);
  };

  const handleShare = () => {
    const shareUrl = `${window.location.origin}/product/${id}`;
    const shareText = `Check out this ${product?.name} on AkiliPesa!`;
    
    if (navigator.share) {
      navigator.share({
        title: shareText,
        url: shareUrl,
      });
    } else {
      navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
    }
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    // API call to like/unlike
  };

  if (isLoading || !product) {
    return (
      <div className="h-screen-safe flex-center bg-gem-dark">
        <div className="animate-spin w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full" />
      </div>
    );
  }

  return (
    <div className="h-screen-safe bg-gem-dark overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-gem-dark/95 backdrop-blur-sm border-b border-white/10 p-4">
        <div className="flex items-center justify-between">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>
          
          <div className="flex items-center space-x-2">
            <button 
              onClick={handleLike}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <Heart className={cn(
                "w-6 h-6 transition-colors",
                isLiked ? "text-red-500 fill-current" : "text-white"
              )} />
            </button>
            <button 
              onClick={handleShare}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <Share className="w-6 h-6 text-white" />
            </button>
            <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
              <MoreHorizontal className="w-6 h-6 text-white" />
            </button>
          </div>
        </div>
      </div>

      {/* Product Images */}
      <div className="relative">
        <div className="aspect-square bg-white/5">
          <img
            src={product.images[activeImageIndex]}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>
        
        {product.images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {product.images.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveImageIndex(index)}
                className={cn(
                  'w-2 h-2 rounded-full transition-colors',
                  index === activeImageIndex ? 'bg-white' : 'bg-white/50'
                )}
              />
            ))}
          </div>
        )}
        
        {/* Commission Badge */}
        <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold">
          Earn {formatPrice(product.commission.amount)}
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4 space-y-6">
        {/* Basic Info */}
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">{product.name}</h1>
          <div className="flex items-center justify-between mb-4">
            <div className="text-3xl font-bold text-primary">
              {formatPrice(product.price, product.currency)}
            </div>
            <div className="flex items-center space-x-4 text-white/60 text-sm">
              <span className="flex items-center space-x-1">
                <Heart className="w-4 h-4" />
                <span>{formatNumber(product.stats.likes)}</span>
              </span>
              <span className="flex items-center space-x-1">
                <TrendingUp className="w-4 h-4" />
                <span>{formatNumber(product.stats.sold)} sold</span>
              </span>
            </div>
          </div>
          
          <p className="text-white/80 leading-relaxed">{product.description}</p>
        </div>

        {/* Seller Info */}
        <div className="card-gem p-4">
          <div className="flex items-center space-x-3 mb-4">
            <img
              src={product.seller.avatar}
              alt={product.seller.displayName}
              className="w-12 h-12 rounded-full"
            />
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <h3 className="font-bold text-white">{product.seller.displayName}</h3>
                {product.seller.verified && (
                  <UserCheck className="w-4 h-4 text-blue-400" />
                )}
              </div>
              <div className="flex items-center space-x-4 text-white/60 text-sm">
                <span className="flex items-center space-x-1">
                  <Star className="w-3 h-3 text-yellow-400 fill-current" />
                  <span>{product.seller.rating}</span>
                </span>
                <span>{formatNumber(product.seller.totalSales)} sales</span>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-center space-x-2 text-white/60">
              <MapPin className="w-4 h-4" />
              <span>{product.seller.location}</span>
            </div>
            <div className="flex items-center space-x-2 text-white/60">
              <Clock className="w-4 h-4" />
              <span>Responds {product.seller.responseTime}</span>
            </div>
          </div>
        </div>

        {/* Features */}
        <div>
          <h3 className="font-bold text-white mb-3">Features</h3>
          <div className="space-y-2">
            {product.features.map((feature, index) => (
              <div key={index} className="flex items-center space-x-2 text-white/80">
                <Shield className="w-4 h-4 text-green-400" />
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Delivery & Returns */}
        <div className="grid grid-cols-2 gap-4">
          <div className="card-gem p-3">
            <h4 className="font-semibold text-white mb-1">Delivery</h4>
            <p className="text-white/60 text-sm">{product.deliveryTime}</p>
          </div>
          <div className="card-gem p-3">
            <h4 className="font-semibold text-white mb-1">Returns</h4>
            <p className="text-white/60 text-sm">{product.returnsPolicy}</p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="sticky bottom-0 bg-gem-dark border-t border-white/10 p-4 safe-bottom">
        {/* Communication Buttons */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <button
            onClick={handleCallVideo}
            className="flex items-center justify-center space-x-2 py-3 bg-blue-500/20 border border-blue-500/50 rounded-xl text-blue-400 hover:bg-blue-500/30 transition-colors"
          >
            <Video className="w-5 h-5" />
            <span className="font-medium">Video Call</span>
          </button>
          
          <button
            onClick={handleCallAudio}
            className="flex items-center justify-center space-x-2 py-3 bg-green-500/20 border border-green-500/50 rounded-xl text-green-400 hover:bg-green-500/30 transition-colors"
          >
            <Phone className="w-5 h-5" />
            <span className="font-medium">Audio Call</span>
          </button>
          
          <button
            onClick={handleAskAI}
            className="flex items-center justify-center space-x-2 py-3 bg-purple-500/20 border border-purple-500/50 rounded-xl text-purple-400 hover:bg-purple-500/30 transition-colors"
          >
            <MessageCircle className="w-5 h-5" />
            <span className="font-medium">Ask AI</span>
          </button>
        </div>

        {/* Purchase Buttons */}
        <div className="flex space-x-3">
          <button
            onClick={handleAddToCart}
            className="flex-1 flex items-center justify-center space-x-2 py-4 bg-white/10 border border-white/20 rounded-xl text-white hover:bg-white/20 transition-colors"
          >
            <ShoppingCart className="w-5 h-5" />
            <span className="font-bold">Add to Cart</span>
          </button>
          
          <button
            onClick={handleBuyNow}
            className="flex-1 flex items-center justify-center space-x-2 py-4 bg-primary hover:bg-primary/90 rounded-xl text-white transition-colors"
          >
            <CreditCard className="w-5 h-5" />
            <span className="font-bold">Buy Now</span>
          </button>
        </div>
      </div>
    </div>
  );
}
