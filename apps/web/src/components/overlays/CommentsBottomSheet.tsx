import { useState, useRef, useEffect } from 'react';
import { X, Heart, MoreHorizontal, Send, Smile } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Comment } from '@/features/feed/types';
import { mockComments } from '@/features/feed/mockData';

interface CommentsBottomSheetProps {
  isOpen: boolean;
  reelId: string;
  onClose: () => void;
}

interface CommentItemProps {
  comment: Comment;
  onLike: (commentId: string) => void;
  onReply: (commentId: string) => void;
  level?: number;
}

function CommentItem({ comment, onLike, onReply, level = 0 }: CommentItemProps) {
  const [showReplies, setShowReplies] = useState(level === 0);

  return (
    <div className={cn("space-y-3", level > 0 && "ml-8")}>
      <div className="flex items-start space-x-3">
        {/* Avatar */}
        <img 
          src={comment.user.avatar} 
          alt={comment.user.displayName}
          className="w-8 h-8 rounded-full flex-shrink-0"
        />
        
        {/* Comment content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-1">
            <span className="font-semibold text-white text-sm">
              @{comment.user.username}
            </span>
            {comment.user.verified && (
              <div className="w-3 h-3 bg-accent-400 rounded-full" />
            )}
            {comment.isPinned && (
              <span className="px-1.5 py-0.5 bg-accent-500/20 text-accent-400 text-xs rounded">
                Pinned
              </span>
            )}
          </div>
          
          <p className="text-white/90 text-sm leading-relaxed mb-2">
            {comment.text}
          </p>
          
          {/* Comment actions */}
          <div className="flex items-center space-x-4 text-white/60 text-xs">
            <span>2h</span>
            <button 
              onClick={() => onLike(comment.id)}
              className={cn(
                "flex items-center space-x-1 hover:text-white transition-colors",
                comment.isLiked && "text-social-like"
              )}
            >
              <Heart className={cn("w-3 h-3", comment.isLiked && "fill-current")} />
              <span>{comment.likes}</span>
            </button>
            <button 
              onClick={() => onReply(comment.id)}
              className="hover:text-white transition-colors"
            >
              Reply
            </button>
          </div>
        </div>
        
        {/* More options */}
        <button className="p-1 hover:bg-white/10 rounded transition-colors">
          <MoreHorizontal className="w-4 h-4 text-white/60" />
        </button>
      </div>
      
      {/* Replies */}
      {comment.replies.length > 0 && (
        <div className="space-y-3">
          {showReplies && comment.replies.map(reply => (
            <CommentItem
              key={reply.id}
              comment={reply}
              onLike={onLike}
              onReply={onReply}
              level={level + 1}
            />
          ))}
          
          {!showReplies && (
            <button 
              onClick={() => setShowReplies(true)}
              className="text-white/60 text-sm hover:text-white transition-colors ml-8"
            >
              Show {comment.replies.length} replies
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default function CommentsBottomSheet({ 
  isOpen, 
  reelId, 
  onClose 
}: CommentsBottomSheetProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      // Load comments for the reel
      setComments(mockComments[reelId] || []);
      
      // Focus input after animation
      setTimeout(() => {
        inputRef.current?.focus();
      }, 300);
    }
  }, [isOpen, reelId]);

  const handleSubmitComment = async () => {
    if (!newComment.trim() || isLoading) return;

    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Add new comment (mock)
    const mockNewComment: Comment = {
      id: Date.now().toString(),
      user: {
        id: 'current-user',
        username: 'you',
        displayName: 'You',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face',
        verified: false,
        followersCount: 0,
      },
      text: newComment,
      likes: 0,
      replies: [],
      isLiked: false,
      isPinned: false,
      createdAt: new Date(),
    };
    
    setComments(prev => [mockNewComment, ...prev]);
    setNewComment('');
    setIsLoading(false);
  };

  const handleLikeComment = (commentId: string) => {
    setComments(prev => prev.map(comment => {
      if (comment.id === commentId) {
        return {
          ...comment,
          isLiked: !comment.isLiked,
          likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1,
        };
      }
      return comment;
    }));
  };

  const handleReplyToComment = (commentId: string) => {
    console.log('Reply to comment:', commentId);
    // TODO: Implement reply functionality
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-modal-backdrop"
        onClick={onClose}
      />
      
      {/* Bottom sheet */}
      <div className={cn("bottom-sheet", isOpen && "open")}>
        {/* Handle */}
        <div className="bottom-sheet-handle" />
        
        {/* Header */}
        <div className="flex-between px-4 pb-3 border-b border-white/10">
          <h3 className="text-white font-semibold">
            {comments.length} comments
          </h3>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>
        
        {/* Comments list */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 max-h-[60vh]">
          {comments.length > 0 ? (
            comments.map(comment => (
              <CommentItem
                key={comment.id}
                comment={comment}
                onLike={handleLikeComment}
                onReply={handleReplyToComment}
              />
            ))
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-white/10 rounded-full flex-center mx-auto mb-3">
                <Heart className="w-8 h-8 text-white/40" />
              </div>
              <p className="text-white/60 text-sm">No comments yet</p>
              <p className="text-white/40 text-xs mt-1">Be the first to comment!</p>
            </div>
          )}
        </div>
        
        {/* Comment input */}
        <div className="p-4 border-t border-white/10 safe-bottom">
          <div className="flex items-center space-x-3">
            <img 
              src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face"
              alt="Your avatar"
              className="w-8 h-8 rounded-full flex-shrink-0"
            />
            
            <div className="flex-1 flex items-center space-x-2">
              <div className="flex-1 relative">
                <input
                  ref={inputRef}
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSubmitComment()}
                  placeholder="Add a comment..."
                  className="w-full bg-white/10 border border-white/20 rounded-full px-4 py-2 text-white placeholder:text-white/50 focus:border-accent-400 focus:ring-2 focus:ring-accent-400/20 transition-all"
                />
              </div>
              
              <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
                <Smile className="w-5 h-5 text-white/60" />
              </button>
              
              <button 
                onClick={handleSubmitComment}
                disabled={!newComment.trim() || isLoading}
                className={cn(
                  "p-2 rounded-full transition-all",
                  newComment.trim() 
                    ? "bg-accent-500 text-white hover:bg-accent-600" 
                    : "bg-white/10 text-white/40 cursor-not-allowed"
                )}
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
