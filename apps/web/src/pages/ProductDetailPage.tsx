import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Star, 
  Heart, 
  Share, 
  ShoppingCart,
  Play,
  Clock,
  Users,
  Shield,
  Award,
  CheckCircle,
  MessageCircle,
  Phone,
  Video,
  Bookmark,
  Flag,
  MoreHorizontal
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ProductFeature {
  id: string;
  title: string;
  description: string;
  included: boolean;
}

interface Review {
  id: string;
  user: {
    name: string;
    avatar: string;
    verified: boolean;
  };
  rating: number;
  comment: string;
  date: string;
  helpful: number;
}

interface Product {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  price: number;
  currency: string;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  creator: {
    id: string;
    name: string;
    avatar: string;
    verified: boolean;
    rating: number;
    completedOrders: number;
    responseTime: string;
  };
  category: string;
  tags: string[];
  images: string[];
  videoPreview?: string;
  duration?: string;
  deliveryTime: string;
  features: ProductFeature[];
  reviews: Review[];
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  language: string;
  includes: string[];
  requirements?: string[];
}

const mockProduct: Product = {
  id: '1',
  title: 'AI-Powered Mathematics Tutoring',
  description: 'Get personalized math help with AI explanations and step-by-step solutions for all levels.',
  longDescription: 'This comprehensive AI tutoring service provides personalized mathematics instruction tailored to your learning style and pace. Our advanced AI system analyzes your strengths and weaknesses to create a customized learning path that ensures maximum understanding and retention.',
  price: 15000,
  currency: 'TSH',
  originalPrice: 25000,
  rating: 4.8,
  reviewCount: 1247,
  creator: {
    id: 'creator1',
    name: 'Dr. Amina Hassan',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b9d38aad?w=150&h=150&fit=crop&crop=face',
    verified: true,
    rating: 4.9,
    completedOrders: 2341,
    responseTime: '< 1 hour'
  },
  category: 'AI Tutoring',
  tags: ['Mathematics', 'AI Tutor', 'Personalized Learning', 'Step-by-step'],
  images: [
    'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1596495578065-6e0763fa1178?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600&h=400&fit=crop'
  ],
  videoPreview: 'https://sample-videos.com/zip/10/mp4/SampleVideo_360x240_1mb.mp4',
  duration: '1 hour session',
  deliveryTime: 'Instant access',
  difficulty: 'Beginner',
  language: 'English & Swahili',
  includes: [
    '1-hour personalized AI tutoring session',
    'Custom practice problems',
    'Progress tracking dashboard',
    'Certificate of completion',
    '30-day access to materials',
    '24/7 AI assistant support'
  ],
  requirements: [
    'Basic arithmetic knowledge',
    'Stable internet connection',
    'Computer or tablet'
  ],
  features: [
    {
      id: '1',
      title: 'Personalized Learning Path',
      description: 'AI adapts to your learning style and pace',
      included: true
    },
    {
      id: '2',
      title: 'Step-by-step Solutions',
      description: 'Detailed explanations for every problem',
      included: true
    },
    {
      id: '3',
      title: 'Progress Tracking',
      description: 'Monitor your improvement over time',
      included: true
    },
    {
      id: '4',
      title: 'Homework Help',
      description: 'Get help with your school assignments',
      included: true
    },
    {
      id: '5',
      title: 'Exam Preparation',
      description: 'Prepare for tests and exams',
      included: false
    }
  ],
  reviews: [
    {
      id: '1',
      user: {
        name: 'John Mwangi',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
        verified: true
      },
      rating: 5,
      comment: 'Excellent tutoring! The AI explanations are clear and the step-by-step approach really helped me understand calculus concepts.',
      date: '2 days ago',
      helpful: 23
    },
    {
      id: '2',
      user: {
        name: 'Grace Mutua',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
        verified: false
      },
      rating: 4,
      comment: 'Very helpful for my daughter\'s algebra homework. The AI is patient and explains things multiple ways.',
      date: '1 week ago',
      helpful: 15
    }
  ]
};

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [product] = useState<Product>(mockProduct);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'description' | 'features' | 'reviews'>('description');

  const formatPrice = (price: number, currency: string) => {
    return `${price.toLocaleString()} ${currency}`;
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={cn(
          'w-4 h-4',
          i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
        )}
      />
    ));
  };

  const handleAddToCart = () => {
    console.log('Adding to cart:', { productId: product.id, quantity });
    // In a real app, this would update cart state
    navigate('/checkout', {
      state: {
        items: [{ ...product, quantity }],
        total: product.price * quantity
      }
    });
  };

  const handleBuyNow = () => {
    navigate('/checkout', {
      state: {
        items: [{ ...product, quantity }],
        total: product.price * quantity,
        immediate: true
      }
    });
  };

  const handleContactCreator = () => {
    navigate(`/inbox/${product.creator.id}`, {
      state: { 
        user: product.creator,
        context: `Interested in: ${product.title}`
      }
    });
  };

  const handleCallCreator = () => {
    navigate('/call/new', {
      state: {
        targetUser: product.creator,
        context: `Call about: ${product.title}`
      }
    });
  };

  const handleShare = () => {
    const shareData = {
      title: product.title,
      text: `Check out this amazing ${product.category} service on AkiliPesa!`,
      url: `${window.location.origin}/product/${product.id}`
    };

    if (navigator.share) {
      navigator.share(shareData);
    } else {
      navigator.clipboard.writeText(shareData.url);
    }
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
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsSaved(!isSaved)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <Bookmark className={cn('w-6 h-6', isSaved ? 'fill-current text-primary' : 'text-gray-600')} />
            </button>
            <button
              onClick={handleShare}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <Share className="w-6 h-6 text-gray-600" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <MoreHorizontal className="w-6 h-6 text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Image Gallery */}
        <div className="relative">
          <div className="aspect-video bg-gray-100">
            {product.videoPreview ? (
              <div className="relative w-full h-full">
                <img
                  src={product.images[selectedImageIndex]}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
                <button className="absolute inset-0 bg-black/20 flex items-center justify-center">
                  <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center">
                    <Play className="w-8 h-8 text-gray-800 ml-1" />
                  </div>
                </button>
              </div>
            ) : (
              <img
                src={product.images[selectedImageIndex]}
                alt={product.title}
                className="w-full h-full object-cover"
              />
            )}
          </div>
          
          {/* Image Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex space-x-2 p-4 overflow-x-auto">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={cn(
                    'flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors',
                    selectedImageIndex === index ? 'border-primary' : 'border-gray-200'
                  )}
                >
                  <img src={image} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="p-4">
          {/* Title and Rating */}
          <div className="mb-4">
            <h1 className="text-2xl font-bold mb-2">{product.title}</h1>
            
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1">
                  {renderStars(product.rating)}
                </div>
                <span className="text-sm font-medium">{product.rating}</span>
                <span className="text-sm text-gray-500">({product.reviewCount} reviews)</span>
              </div>
              
              <button
                onClick={() => setIsLiked(!isLiked)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <Heart className={cn('w-6 h-6', isLiked ? 'fill-current text-red-500' : 'text-gray-400')} />
              </button>
            </div>

            {/* Price */}
            <div className="flex items-center space-x-3 mb-3">
              <span className="text-3xl font-bold text-primary">
                {formatPrice(product.price, product.currency)}
              </span>
              {product.originalPrice && (
                <span className="text-lg text-gray-500 line-through">
                  {formatPrice(product.originalPrice, product.currency)}
                </span>
              )}
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              <span className={cn(
                'px-3 py-1 text-xs rounded-full',
                product.difficulty === 'Beginner' ? 'bg-green-100 text-green-700' :
                product.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-700' :
                'bg-red-100 text-red-700'
              )}>
                {product.difficulty}
              </span>
              <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                {product.category}
              </span>
              {product.duration && (
                <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full flex items-center space-x-1">
                  <Clock className="w-3 h-3" />
                  <span>{product.duration}</span>
                </span>
              )}
            </div>
          </div>

          {/* Creator Info */}
          <div className="bg-gray-50 rounded-2xl p-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <img
                  src={product.creator.avatar}
                  alt={product.creator.name}
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <div className="flex items-center space-x-1">
                    <span className="font-semibold">{product.creator.name}</span>
                    {product.creator.verified && (
                      <CheckCircle className="w-4 h-4 text-primary" />
                    )}
                  </div>
                  <div className="flex items-center space-x-1 text-sm text-gray-600">
                    {renderStars(product.creator.rating)}
                    <span>({product.creator.completedOrders} orders)</span>
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <button
                  onClick={handleContactCreator}
                  className="p-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-full transition-colors"
                >
                  <MessageCircle className="w-5 h-5" />
                </button>
                <button
                  onClick={handleCallCreator}
                  className="p-2 bg-green-100 hover:bg-green-200 text-green-600 rounded-full transition-colors"
                >
                  <Phone className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200 mb-4">
            <div className="flex space-x-6">
              {[
                { id: 'description', label: 'Description' },
                { id: 'features', label: 'Features' },
                { id: 'reviews', label: 'Reviews' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={cn(
                    'py-3 px-1 border-b-2 font-medium text-sm transition-colors',
                    activeTab === tab.id
                      ? 'border-primary text-primary'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <AnimatePresence mode="wait">
            {activeTab === 'description' && (
              <motion.div
                key="description"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-4"
              >
                <div>
                  <p className="text-gray-700 leading-relaxed">
                    {showFullDescription ? product.longDescription : `${product.longDescription.substring(0, 150)}...`}
                  </p>
                  <button
                    onClick={() => setShowFullDescription(!showFullDescription)}
                    className="text-primary text-sm font-medium mt-2"
                  >
                    {showFullDescription ? 'Show Less' : 'Read More'}
                  </button>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">What's Included:</h4>
                  <ul className="space-y-2">
                    {product.includes.map((item, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {product.requirements && (
                  <div>
                    <h4 className="font-semibold mb-2">Requirements:</h4>
                    <ul className="space-y-1">
                      {product.requirements.map((req, index) => (
                        <li key={index} className="text-gray-700 text-sm">
                          • {req}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'features' && (
              <motion.div
                key="features"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-3"
              >
                {product.features.map((feature) => (
                  <div key={feature.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-xl">
                    <CheckCircle className={cn(
                      'w-5 h-5 flex-shrink-0 mt-0.5',
                      feature.included ? 'text-green-500' : 'text-gray-300'
                    )} />
                    <div>
                      <h5 className="font-medium">{feature.title}</h5>
                      <p className="text-sm text-gray-600">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}

            {activeTab === 'reviews' && (
              <motion.div
                key="reviews"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-4"
              >
                {product.reviews.map((review) => (
                  <div key={review.id} className="border-b border-gray-100 pb-4 last:border-b-0">
                    <div className="flex items-start space-x-3">
                      <img
                        src={review.user.avatar}
                        alt={review.user.name}
                        className="w-10 h-10 rounded-full"
                      />
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="font-medium">{review.user.name}</span>
                          {review.user.verified && (
                            <CheckCircle className="w-4 h-4 text-primary" />
                          )}
                          <div className="flex items-center space-x-1">
                            {renderStars(review.rating)}
                          </div>
                        </div>
                        <p className="text-gray-700 text-sm mb-2">{review.comment}</p>
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span>{review.date}</span>
                          <button className="hover:text-gray-700">
                            👍 Helpful ({review.helpful})
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="sticky bottom-0 bg-white border-t border-gray-100 p-4 safe-bottom">
        <div className="flex space-x-3">
          <button
            onClick={handleAddToCart}
            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 py-4 rounded-xl font-semibold transition-colors flex items-center justify-center space-x-2"
          >
            <ShoppingCart className="w-5 h-5" />
            <span>Add to Cart</span>
          </button>
          
          <button
            onClick={handleBuyNow}
            className="flex-1 bg-primary hover:bg-primary/90 text-white py-4 rounded-xl font-semibold transition-colors"
          >
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
}
