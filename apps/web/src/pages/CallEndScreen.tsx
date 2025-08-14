import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Star, 
  ThumbsUp, 
  ThumbsDown, 
  PhoneOff, 
  Clock, 
  Users, 
  DollarSign,
  Share,
  Home,
  MessageCircle,
  RefreshCw
} from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface CallEndData {
  duration: number;
  type: 'audio' | 'video';
  participants: number;
  cost: number;
  targetUser?: {
    name: string;
    avatar: string;
  };
}

export default function CallEndScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const callData = location.state as CallEndData || {
    duration: 1800,
    type: 'video',
    participants: 2,
    cost: 15000,
    targetUser: {
      name: 'Amina Hassan',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b9d38aad?w=150&h=150&fit=crop&crop=face'
    }
  };

  const [rating, setRating] = useState<number>(0);
  const [feedback, setFeedback] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    }
    return `${minutes}m ${secs}s`;
  };

  const formatCost = (amount: number) => {
    return `${amount.toLocaleString()} TSH`;
  };

  const handleSubmitFeedback = async () => {
    if (rating === 0) return;
    
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    console.log('Submitting feedback:', { rating, feedback });
    setSubmitted(true);
    setIsSubmitting(false);
    
    // Auto-navigate after showing success
    setTimeout(() => {
      navigate('/reels');
    }, 2000);
  };

  const handleSkip = () => {
    navigate('/reels');
  };

  const handleCallAgain = () => {
    navigate(-2); // Go back to the call setup
  };

  const handleShare = () => {
    // Share call experience
    const shareText = `Just had an amazing ${callData.type} call on AkiliPesa! ${formatDuration(callData.duration)} of great conversation. 🎉`;
    
    if (navigator.share) {
      navigator.share({
        title: 'AkiliPesa Call',
        text: shareText,
        url: window.location.origin
      });
    }
  };

  if (submitted) {
    return (
      <div className="h-screen-safe bg-gradient-to-b from-primary to-secondary flex items-center justify-center p-6">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
            className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <ThumbsUp className="w-12 h-12 text-white" />
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-2xl font-bold text-white mb-2"
          >
            Thank You!
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="text-white/80"
          >
            Your feedback helps us improve
          </motion.p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="h-screen-safe bg-white">
      {/* Header */}
      <div className="safe-top bg-gradient-to-b from-primary to-secondary text-white p-6 text-center">
        <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <PhoneOff className="w-10 h-10 text-white" />
        </div>
        
        <h1 className="text-2xl font-bold mb-2">Call Ended</h1>
        <p className="text-white/80">
          {callData.type === 'video' ? 'Video call' : 'Audio call'} with {callData.targetUser?.name}
        </p>
      </div>

      {/* Call Summary */}
      <div className="p-6">
        <div className="bg-gray-50 rounded-2xl p-4 mb-6">
          <h3 className="font-semibold mb-4">Call Summary</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <Clock className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Duration</p>
                <p className="font-semibold">{formatDuration(callData.duration)}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <Users className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Participants</p>
                <p className="font-semibold">{callData.participants}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Cost</p>
                <p className="font-semibold">{formatCost(callData.cost)}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Quality</p>
                <p className="font-semibold text-green-600">Excellent</p>
              </div>
            </div>
          </div>
        </div>

        {/* Rating Section */}
        <div className="mb-6">
          <h3 className="font-semibold mb-3">How was your call?</h3>
          
          <div className="flex justify-center space-x-2 mb-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setRating(star)}
                className={cn(
                  'p-2 transition-colors',
                  star <= rating ? 'text-yellow-400' : 'text-gray-300'
                )}
              >
                <Star className="w-8 h-8 fill-current" />
              </button>
            ))}
          </div>
          
          {rating > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="text-center mb-4"
            >
              <p className="text-sm text-gray-600">
                {rating <= 2 && 'Sorry to hear that. How can we improve?'}
                {rating === 3 && 'Thanks for the feedback. Any suggestions?'}
                {rating >= 4 && 'Great to hear! Tell us what went well.'}
              </p>
            </motion.div>
          )}
        </div>

        {/* Feedback Text */}
        {rating > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Share your experience... (optional)"
              rows={3}
              className="w-full p-4 border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </motion.div>
        )}

        {/* Action Buttons */}
        <div className="space-y-3">
          {rating > 0 && (
            <button
              onClick={handleSubmitFeedback}
              disabled={isSubmitting}
              className="w-full bg-primary hover:bg-primary/90 text-white py-4 rounded-xl font-semibold transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  <span>Submitting...</span>
                </>
              ) : (
                <span>Submit Feedback</span>
              )}
            </button>
          )}
          
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleCallAgain}
              className="flex items-center justify-center space-x-2 py-3 px-4 bg-green-50 hover:bg-green-100 text-green-700 rounded-xl font-medium transition-colors"
            >
              <PhoneOff className="w-5 h-5 rotate-180" />
              <span>Call Again</span>
            </button>
            
            <button
              onClick={handleShare}
              className="flex items-center justify-center space-x-2 py-3 px-4 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl font-medium transition-colors"
            >
              <Share className="w-5 h-5" />
              <span>Share</span>
            </button>
          </div>
          
          <button
            onClick={handleSkip}
            className="w-full py-3 text-gray-600 hover:text-gray-800 font-medium transition-colors"
          >
            {rating === 0 ? 'Skip Feedback' : 'Skip for Now'}
          </button>
        </div>
      </div>
    </div>
  );
}
