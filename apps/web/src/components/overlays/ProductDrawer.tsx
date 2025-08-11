import { useState, useEffect } from 'react';
import { X, ShoppingCart, Star, Share, Heart, ExternalLink, MessageCircle, ThumbsUp, Phone, Video, MoreHorizontal, Flag, Copy, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Product } from '@/features/feed/types';
import { formatCurrency } from '@/features/feed/mockData';
import { createReferralLink } from '@/lib/referral';
import ShareModal from './ShareModal';

interface ProductDrawerProps {
  isOpen: boolean;
  products: Product[];
  onClose: () => void;
}

interface ProductCardProps {
  product: Product;
  onAddToCart: (productId: string) => void;
  onToggleFavorite: (productId: string) => void;
  onShare: (productId: string) => void;
  onViewShop: (shopId: string) => void;
  onLike: (productId: string) => void;
  onComment: (productId: string) => void;
  onCallVideo: (sellerId: string) => void;
  onCallAudio: (sellerId: string) => void;
  onReport: (productId: string) => void;
  onCopyLink: (productId: string) => void;
}

function ProductCard({
  product,
  onAddToCart,
  onToggleFavorite,
  onShare,
  onViewShop,
  onLike,
  onComment,
  onCallVideo,
  onCallAudio,
  onReport,
  onCopyLink
}: ProductCardProps) {
  const [isFavorited, setIsFavorited] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);

  const handleAddToCart = async () => {
    setIsAddingToCart(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    onAddToCart(product.id);
    setIsAddingToCart(false);
  };

  const handleToggleFavorite = () => {
    setIsFavorited(!isFavorited);
    onToggleFavorite(product.id);
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    onLike(product.id);
  };

  const handleCopyLink = async () => {
    // TODO: Get current user ID from auth context
    const currentUserId = 'current-user-id'; // Replace with actual user ID

    // Create referral link for share-to-earn
    const referralLink = createReferralLink(currentUserId, 'product', product.id);
    await navigator.clipboard.writeText(referralLink.referralUrl);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
    onCopyLink(product.id);
    setShowMoreMenu(false);
  };

  const handleReport = () => {
    onReport(product.id);
    setShowMoreMenu(false);
  };

  return (
    <div className="card-gem p-4 space-y-4">
      {/* Product image */}
      <div className="relative aspect-square rounded-lg overflow-hidden">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-full object-cover"
        />
        
        {/* Stock status */}
        <div className="absolute top-2 right-2">
          <div className={cn(
            "px-2 py-1 rounded-full text-xs font-medium",
            product.inStock 
              ? "bg-green-500/20 text-green-400" 
              : "bg-red-500/20 text-red-400"
          )}>
            {product.inStock ? 'In Stock' : 'Out of Stock'}
          </div>
        </div>
        
        {/* Favorite button */}
        <button 
          onClick={handleToggleFavorite}
          className={cn(
            "absolute top-2 left-2 w-8 h-8 rounded-full flex-center transition-all",
            isFavorited 
              ? "bg-red-500 text-white" 
              : "bg-black/50 text-white/80 hover:bg-black/70"
          )}
        >
          <Heart className={cn("w-4 h-4", isFavorited && "fill-current")} />
        </button>
      </div>
      
      {/* Product info */}
      <div className="space-y-2">
        <h3 className="text-white font-semibold leading-tight">
          {product.name}
        </h3>
        
        <div className="text-2xl font-bold text-accent-400">
          {formatCurrency(product.price, product.currency)}
        </div>
        
        {/* Shop info */}
        <div className="flex items-center space-x-2">
          <img 
            src={product.shop.avatar} 
            alt={product.shop.name}
            className="w-6 h-6 rounded-full"
          />
          <span className="text-white/80 text-sm">{product.shop.name}</span>
          <button 
            onClick={() => onViewShop(product.shop.id)}
            className="text-accent-400 text-sm hover:text-accent-300 transition-colors"
          >
            <ExternalLink className="w-3 h-3" />
          </button>
        </div>
        
        {/* Rating */}
        <div className="flex items-center space-x-1">
          {[1, 2, 3, 4, 5].map(star => (
            <Star 
              key={star} 
              className="w-4 h-4 text-yellow-400 fill-current" 
            />
          ))}
          <span className="text-white/60 text-sm ml-2">(4.8)</span>
        </div>
      </div>
      
      {/* Add to Cart Button */}
      <button
        onClick={handleAddToCart}
        disabled={!product.inStock || isAddingToCart}
        className={cn(
          "w-full btn-gem py-3 flex items-center justify-center space-x-2 mb-3",
          !product.inStock && "opacity-50 cursor-not-allowed"
        )}
      >
        {isAddingToCart ? (
          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : (
          <>
            <ShoppingCart className="w-5 h-5" />
            <span>Add to Cart</span>
          </>
        )}
      </button>

      {/* Social Actions Row */}
      <div className="flex items-center justify-between">
        {/* Left: Like & Comment */}
        <div className="flex items-center space-x-1">
          <button
            onClick={handleLike}
            className={cn(
              "flex items-center space-x-1 px-3 py-2 rounded-lg transition-all",
              isLiked
                ? "bg-red-500/20 text-red-400"
                : "bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"
            )}
          >
            <ThumbsUp className={cn("w-4 h-4", isLiked && "fill-current")} />
            <span className="text-sm">Like</span>
          </button>

          <button
            onClick={() => onComment(product.id)}
            className="flex items-center space-x-1 px-3 py-2 rounded-lg bg-white/5 text-white/70 hover:bg-white/10 hover:text-white transition-all"
          >
            <MessageCircle className="w-4 h-4" />
            <span className="text-sm">Comment</span>
          </button>
        </div>

        {/* Right: Call Actions & More */}
        <div className="flex items-center space-x-1">
          <button
            onClick={() => onCallVideo(product.seller?.id || product.shop.id)}
            className="w-9 h-9 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-lg flex-center transition-all"
            title="Video Call"
          >
            <Video className="w-4 h-4" />
          </button>

          <button
            onClick={() => onCallAudio(product.seller?.id || product.shop.id)}
            className="w-9 h-9 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg flex-center transition-all"
            title="Audio Call"
          >
            <Phone className="w-4 h-4" />
          </button>

          {/* More Menu */}
          <div className="relative">
            <button
              onClick={() => setShowMoreMenu(!showMoreMenu)}
              className="w-9 h-9 bg-white/5 hover:bg-white/10 text-white/70 hover:text-white rounded-lg flex-center transition-all"
              title="More"
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>

            {/* More Dropdown */}
            {showMoreMenu && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowMoreMenu(false)}
                />
                <div className="absolute right-0 top-10 z-20 bg-[#1A1035] border border-white/20 rounded-lg py-2 min-w-[140px] shadow-xl">
                  <button
                    onClick={() => onShare(product.id)}
                    className="w-full px-4 py-2 text-left text-white/80 hover:bg-white/10 hover:text-white transition-colors flex items-center space-x-2"
                  >
                    <Share className="w-4 h-4" />
                    <span className="text-sm">Share</span>
                  </button>

                  <button
                    onClick={handleCopyLink}
                    className="w-full px-4 py-2 text-left text-white/80 hover:bg-white/10 hover:text-white transition-colors flex items-center space-x-2"
                  >
                    {linkCopied ? (
                      <>
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        <span className="text-sm text-green-400">Link Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span className="text-sm">Copy Link</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={handleReport}
                    className="w-full px-4 py-2 text-left text-red-400 hover:bg-red-500/10 transition-colors flex items-center space-x-2"
                  >
                    <Flag className="w-4 h-4" />
                    <span className="text-sm">Report</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProductDrawer({
  isOpen,
  products,
  onClose
}: ProductDrawerProps) {
  const [cartCount, setCartCount] = useState(0);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [selectedProductForShare, setSelectedProductForShare] = useState<Product | null>(null);

  useEffect(() => {
    if (isOpen && products.length === 0) {
      // Close drawer if no products
      onClose();
    }
  }, [isOpen, products.length, onClose]);

  const handleAddToCart = (productId: string) => {
    setCartCount(prev => prev + 1);
    console.log('Added to cart:', productId);
    // TODO: Implement cart functionality
  };

  const handleToggleFavorite = (productId: string) => {
    console.log('Toggle favorite:', productId);
    // TODO: Implement favorites functionality
  };

  const handleShare = (productId: string) => {
    console.log('Share product:', productId);
    const product = products.find(p => p.id === productId);
    if (!product) return;

    // TODO: Get current user ID from auth context
    const currentUserId = 'current-user-id'; // Replace with actual user ID

    // Create referral link for share-to-earn
    const referralLink = createReferralLink(currentUserId, 'product', productId);
    const shareMessage = createShareMessage('product', product.name, referralLink.referralUrl);

    // For now, copy to clipboard with referral link
    navigator.clipboard.writeText(shareMessage);
    console.log('Referral link created:', referralLink);

    // TODO: Show share options modal
  };

  const handleViewShop = (shopId: string) => {
    console.log('View shop:', shopId);
    // TODO: Navigate to shop page
  };

  const handleLike = (productId: string) => {
    console.log('Like product:', productId);
    // TODO: Implement like functionality
  };

  const handleComment = (productId: string) => {
    console.log('Comment on product:', productId);
    // TODO: Open comment drawer or navigate to product detail
  };

  const handleCallVideo = (sellerId: string) => {
    console.log('Video call seller:', sellerId);
    // TODO: Implement video call functionality
  };

  const handleCallAudio = (sellerId: string) => {
    console.log('Audio call seller:', sellerId);
    // TODO: Implement audio call functionality
  };

  const handleReport = (productId: string) => {
    console.log('Report product:', productId);
    // TODO: Implement report functionality
  };

  const handleCopyLink = (productId: string) => {
    console.log('Copy product link:', productId);
    // Link copying is handled in ProductCard component
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-modal-backdrop"
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className={cn("product-drawer", isOpen && "open")}>
        {/* Header */}
        <div className="flex-between p-4 border-b border-white/10">
          <div>
            <h3 className="text-white font-semibold text-lg">
              Shop Products
            </h3>
            <p className="text-white/60 text-sm">
              {products.length} {products.length === 1 ? 'item' : 'items'}
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            {/* Cart indicator */}
            {cartCount > 0 && (
              <div className="relative">
                <div className="w-8 h-8 bg-accent-500 rounded-full flex-center">
                  <ShoppingCart className="w-4 h-4 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex-center">
                  <span className="text-white text-xs font-bold">{cartCount}</span>
                </div>
              </div>
            )}
            
            <button 
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
        
        {/* Products list */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {products.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={handleAddToCart}
              onToggleFavorite={handleToggleFavorite}
              onShare={handleShare}
              onViewShop={handleViewShop}
              onLike={handleLike}
              onComment={handleComment}
              onCallVideo={handleCallVideo}
              onCallAudio={handleCallAudio}
              onReport={handleReport}
              onCopyLink={handleCopyLink}
            />
          ))}
        </div>
        
        {/* Footer */}
        <div className="p-4 border-t border-white/10 safe-bottom">
          <div className="flex items-center space-x-3">
            <button className="flex-1 btn-gem py-3">
              View All Products
            </button>
            <button className="flex-1 btn-gem-outline py-3">
              Visit Shop
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
