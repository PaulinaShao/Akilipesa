import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Bookmark, Heart, MessageCircle } from 'lucide-react';

interface SavedPost {
  id: string;
  type: 'image' | 'video';
  thumbnail: string;
  user: {
    username: string;
    displayName: string;
    avatar: string;
  };
  stats: {
    likes: number;
    comments: number;
  };
  dateSaved: Date;
}

const mockSavedPosts: SavedPost[] = [
  {
    id: '1',
    type: 'image',
    thumbnail: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=300&h=300&fit=crop',
    user: {
      username: 'fatuma_style',
      displayName: 'Fatuma Bakari',
      avatar: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=150&h=150&fit=crop&crop=face',
    },
    stats: {
      likes: 19876,
      comments: 987,
    },
    dateSaved: new Date('2024-01-15'),
  },
  {
    id: '2',
    type: 'video',
    thumbnail: 'https://images.unsplash.com/photo-1533929736458-ca588d08c8be?w=300&h=300&fit=crop',
    user: {
      username: 'amina_tz',
      displayName: 'Amina Hassan',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b9d38aad?w=150&h=150&fit=crop&crop=face',
    },
    stats: {
      likes: 45231,
      comments: 2847,
    },
    dateSaved: new Date('2024-01-10'),
  },
  {
    id: '3',
    type: 'image',
    thumbnail: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=300&fit=crop',
    user: {
      username: 'tech_james',
      displayName: 'James Mwangi',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    },
    stats: {
      likes: 28934,
      comments: 1456,
    },
    dateSaved: new Date('2024-01-08'),
  },
];

function formatNumber(num: number): string {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
}

export default function SavedPostsPage() {
  const navigate = useNavigate();
  const [savedPosts] = useState<SavedPost[]>(mockSavedPosts);

  const handlePostClick = (postId: string) => {
    navigate(`/post/${postId}`);
  };

  const handleUnsave = (postId: string) => {
    console.log('Unsave post:', postId);
  };

  return (
    <div className="h-screen-safe bg-gem-dark overflow-y-auto">
      {/* Header */}
      <div className="safe-top p-4 border-b border-white/10 sticky top-0 bg-gem-dark/95 backdrop-blur-sm z-10">
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-white">Saved Posts</h1>
            <p className="text-sm text-white/60">{savedPosts.length} saved posts</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {savedPosts.length > 0 ? (
          <div className="profile-grid">
            {savedPosts.map((post) => (
              <div key={post.id} className="profile-grid-item group cursor-pointer" onClick={() => handlePostClick(post.id)}>
                <img
                  src={post.thumbnail}
                  alt={`Saved post ${post.id}`}
                  className="w-full h-full object-cover"
                />
                
                {/* Video indicator */}
                {post.type === 'video' && (
                  <div className="absolute top-2 right-2 w-6 h-6 bg-black/60 rounded-full flex-center">
                    <div className="w-0 h-0 border-l-[6px] border-l-white border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent ml-1" />
                  </div>
                )}

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-3">
                  <div className="flex justify-end">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleUnsave(post.id);
                      }}
                      className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
                    >
                      <Bookmark className="w-4 h-4 text-white fill-current" />
                    </button>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center space-x-4 text-white">
                      <div className="flex items-center space-x-1">
                        <Heart className="w-4 h-4" />
                        <span className="text-sm">{formatNumber(post.stats.likes)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MessageCircle className="w-4 h-4" />
                        <span className="text-sm">{formatNumber(post.stats.comments)}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <img
                        src={post.user.avatar}
                        alt={post.user.displayName}
                        className="w-6 h-6 rounded-full"
                      />
                      <span className="text-white text-sm font-medium">@{post.user.username}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-white/10 rounded-full flex-center mx-auto mb-4">
              <Bookmark className="w-10 h-10 text-white/40" />
            </div>
            <h3 className="text-white font-semibold mb-2">No saved posts</h3>
            <p className="text-white/60 text-sm mb-6">
              Posts you save will appear here for easy access
            </p>
            <button 
              onClick={() => navigate('/')}
              className="btn-gem px-6 py-3"
            >
              Discover Posts
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
