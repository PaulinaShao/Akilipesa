import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Send, 
  Heart, 
  MoreVertical, 
  Reply,
  Smile,
  Camera,
  Gif
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { isGuest } from '@/lib/guards';

interface Comment {
  id: string;
  user: {
    id: string;
    username: string;
    displayName: string;
    avatar: string;
    verified: boolean;
  };
  content: string;
  timestamp: Date;
  likes: number;
  liked: boolean;
  replies?: Comment[];
  pinned?: boolean;
}

interface CommentDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  contentId: string;
  contentCreator: string;
  onAuthRequired: () => void;
}

const mockComments: Comment[] = [
  {
    id: '1',
    user: {
      id: 'creator',
      username: 'amina_tz',
      displayName: 'Amina Hassan',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b9d38aad?w=150&h=150&fit=crop&crop=face',
      verified: true
    },
    content: 'Thank you all for the amazing support! 🙏✨ More content coming soon!',
    timestamp: new Date(Date.now() - 2 * 60 * 1000),
    likes: 45,
    liked: false,
    pinned: true
  },
  {
    id: '2',
    user: {
      id: 'user1',
      username: 'james_tech',
      displayName: 'James Mwangi',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      verified: false
    },
    content: 'This is incredible! How did you learn to dance like this? 🔥',
    timestamp: new Date(Date.now() - 5 * 60 * 1000),
    likes: 12,
    liked: true,
    replies: [
      {
        id: '2a',
        user: {
          id: 'creator',
          username: 'amina_tz',
          displayName: 'Amina Hassan',
          avatar: 'https://images.unsplash.com/photo-1494790108755-2616b9d38aad?w=150&h=150&fit=crop&crop=face',
          verified: true
        },
        content: 'Years of practice! Started when I was 5 😊',
        timestamp: new Date(Date.now() - 3 * 60 * 1000),
        likes: 8,
        liked: false
      }
    ]
  },
  {
    id: '3',
    user: {
      id: 'user2',
      username: 'fatuma_style',
      displayName: 'Fatuma Bakari',
      avatar: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=150&h=150&fit=crop&crop=face',
      verified: true
    },
    content: 'Beautiful traditional moves! Proud to be Tanzanian 🇹🇿❤️',
    timestamp: new Date(Date.now() - 8 * 60 * 1000),
    likes: 23,
    liked: false
  }
];

export default function CommentDrawer({ 
  isOpen, 
  onClose, 
  contentId, 
  contentCreator,
  onAuthRequired 
}: CommentDrawerProps) {
  const [comments, setComments] = useState<Comment[]>(mockComments);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const commentsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  useEffect(() => {
    commentsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [comments]);

  const handleSubmitComment = async () => {
    if (!newComment.trim()) return;

    if (isGuest()) {
      onAuthRequired();
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Create new comment
      const comment: Comment = {
        id: Date.now().toString(),
        user: {
          id: 'current_user',
          username: 'you',
          displayName: 'You',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
          verified: false
        },
        content: newComment.trim(),
        timestamp: new Date(),
        likes: 0,
        liked: false
      };

      if (replyingTo) {
        // Add as reply
        setComments(prev => prev.map(c => {
          if (c.id === replyingTo) {
            return {
              ...c,
              replies: [...(c.replies || []), comment]
            };
          }
          return c;
        }));
        setReplyingTo(null);
      } else {
        // Add as new comment
        setComments(prev => [...prev, comment]);
      }

      setNewComment('');
      
      // TODO: Call API to post comment
      console.log('Comment posted:', { contentId, comment });
      
    } catch (error) {
      console.error('Failed to post comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLikeComment = async (commentId: string) => {
    if (isGuest()) {
      onAuthRequired();
      return;
    }

    setComments(prev => prev.map(comment => {
      if (comment.id === commentId) {
        return {
          ...comment,
          liked: !comment.liked,
          likes: comment.liked ? comment.likes - 1 : comment.likes + 1
        };
      }
      
      if (comment.replies) {
        return {
          ...comment,
          replies: comment.replies.map(reply => {
            if (reply.id === commentId) {
              return {
                ...reply,
                liked: !reply.liked,
                likes: reply.liked ? reply.likes - 1 : reply.likes + 1
              };
            }
            return reply;
          })
        };
      }
      
      return comment;
    }));
    
    // TODO: Call API to like comment
    console.log('Comment liked:', { contentId, commentId });
  };

  const handleReply = (commentId: string, username: string) => {
    if (isGuest()) {
      onAuthRequired();
      return;
    }
    
    setReplyingTo(commentId);
    setNewComment(`@${username} `);
    inputRef.current?.focus();
  };

  const formatTimeAgo = (date: Date): string => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    
    if (diffMins < 1) return 'now';
    if (diffMins < 60) return `${diffMins}m`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h`;
    
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d`;
  };

  const CommentItem = ({ comment, isReply = false }: { comment: Comment; isReply?: boolean }) => (
    <div className={cn("flex gap-3", isReply && "ml-10 mt-2")}>
      <img 
        src={comment.user.avatar}
        alt={comment.user.displayName}
        className="w-8 h-8 rounded-full object-cover flex-shrink-0"
      />
      <div className="flex-1 min-w-0">
        <div className="bg-zinc-800 rounded-2xl px-3 py-2">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-white font-medium text-sm">{comment.user.displayName}</span>
            {comment.user.verified && (
              <div className="w-3 h-3 bg-primary rounded-full" />
            )}
            {comment.pinned && (
              <span className="text-xs bg-primary/20 text-primary px-1.5 py-0.5 rounded">
                Pinned
              </span>
            )}
          </div>
          <p className="text-white text-sm leading-relaxed">{comment.content}</p>
        </div>
        
        <div className="flex items-center gap-4 mt-2 px-3">
          <span className="text-zinc-500 text-xs">{formatTimeAgo(comment.timestamp)}</span>
          
          <button
            onClick={() => handleLikeComment(comment.id)}
            className={cn(
              "flex items-center gap-1 text-xs transition-colors",
              comment.liked ? "text-red-400" : "text-zinc-500 hover:text-white"
            )}
          >
            <Heart className={cn("w-3 h-3", comment.liked && "fill-current")} />
            {comment.likes > 0 && <span>{comment.likes}</span>}
          </button>
          
          {!isReply && (
            <button
              onClick={() => handleReply(comment.id, comment.user.username)}
              className="text-zinc-500 hover:text-white text-xs transition-colors"
            >
              Reply
            </button>
          )}
          
          <button className="text-zinc-500 hover:text-white transition-colors">
            <MoreVertical className="w-3 h-3" />
          </button>
        </div>
        
        {/* Replies */}
        {comment.replies && comment.replies.length > 0 && (
          <div className="mt-3 space-y-2">
            {comment.replies.map(reply => (
              <CommentItem key={reply.id} comment={reply} isReply />
            ))}
          </div>
        )}
      </div>
    </div>
  );

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end justify-center">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Drawer */}
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          className="relative w-full max-w-md bg-zinc-900 rounded-t-3xl border-t border-zinc-700 max-h-[90vh] flex flex-col"
        >
          {/* Handle */}
          <div className="flex justify-center pt-3 pb-2">
            <div className="w-10 h-1 bg-zinc-600 rounded-full" />
          </div>

          {/* Header */}
          <div className="flex items-center justify-between px-4 pb-4 border-b border-zinc-700">
            <h3 className="text-white font-semibold text-lg">
              Comments ({comments.length + comments.reduce((acc, c) => acc + (c.replies?.length || 0), 0)})
            </h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-zinc-800 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-zinc-400" />
            </button>
          </div>

          {/* Comments List */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
            {comments.map(comment => (
              <CommentItem key={comment.id} comment={comment} />
            ))}
            <div ref={commentsEndRef} />
          </div>

          {/* Reply indicator */}
          {replyingTo && (
            <div className="px-4 py-2 bg-zinc-800/50 border-t border-zinc-700">
              <div className="flex items-center justify-between">
                <span className="text-zinc-400 text-sm">
                  Replying to @{comments.find(c => c.id === replyingTo)?.user.username}
                </span>
                <button
                  onClick={() => {
                    setReplyingTo(null);
                    setNewComment('');
                  }}
                  className="text-zinc-500 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Input */}
          <div className="p-4 border-t border-zinc-700">
            <div className="flex items-end gap-3">
              <div className="flex-1 flex items-end gap-2 bg-zinc-800 rounded-2xl px-4 py-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSubmitComment()}
                  placeholder={isGuest() ? "Sign in to comment..." : "Add a comment..."}
                  className="flex-1 bg-transparent text-white placeholder-zinc-500 focus:outline-none"
                  disabled={isSubmitting || isGuest()}
                />
                <div className="flex items-center gap-2">
                  <button className="text-zinc-500 hover:text-white transition-colors">
                    <Smile className="w-5 h-5" />
                  </button>
                  <button className="text-zinc-500 hover:text-white transition-colors">
                    <Camera className="w-5 h-5" />
                  </button>
                </div>
              </div>
              
              <button
                onClick={handleSubmitComment}
                disabled={!newComment.trim() || isSubmitting || isGuest()}
                className="p-3 bg-primary hover:bg-primary/90 disabled:bg-zinc-700 disabled:cursor-not-allowed rounded-full transition-colors"
              >
                <Send className="w-5 h-5 text-white" />
              </button>
            </div>
            
            {isGuest() && (
              <div className="mt-2 text-center">
                <button
                  onClick={onAuthRequired}
                  className="text-primary hover:text-primary/80 text-sm transition-colors"
                >
                  Sign in to join the conversation
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
