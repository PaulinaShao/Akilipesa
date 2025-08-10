import { useState } from 'react';
import ReelsFeed from '@/features/feed/components/ReelsFeed';
import CommentsBottomSheet from '@/components/overlays/CommentsBottomSheet';
import ProductDrawer from '@/components/overlays/ProductDrawer';
import { mockReels } from '@/features/feed/mockData';

export default function HomePage() {
  const [showComments, setShowComments] = useState(false);
  const [showProducts, setShowProducts] = useState(false);
  const [selectedReelId, setSelectedReelId] = useState<string>('');

  // These handlers would be passed to ReelsFeed component
  // Currently ReelsFeed handles its own interactions
  const selectedReel = mockReels.find(reel => reel.id === selectedReelId);

  return (
    <div className="h-screen-safe bg-black">
      {/* Main Reels Feed */}
      <ReelsFeed />
      
      {/* Comments Bottom Sheet */}
      <CommentsBottomSheet
        isOpen={showComments}
        reelId={selectedReelId}
        onClose={() => setShowComments(false)}
      />
      
      {/* Product Drawer */}
      <ProductDrawer
        isOpen={showProducts}
        products={selectedReel?.products || []}
        onClose={() => setShowProducts(false)}
      />
    </div>
  );
}
