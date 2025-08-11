import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Story {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  hasViewed: boolean;
  isLive?: boolean;
}

const mockStories: Story[] = [
  {
    id: 'my-story',
    username: 'me',
    displayName: 'Your Story',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    hasViewed: false,
  },
  {
    id: '1',
    username: 'amina_tz',
    displayName: 'Amina',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b9d38aad?w=150&h=150&fit=crop&crop=face',
    hasViewed: false,
    isLive: true,
  },
  {
    id: '2',
    username: 'tech_james',
    displayName: 'James',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    hasViewed: true,
  },
  {
    id: '3',
    username: 'fatuma_style',
    displayName: 'Fatuma',
    avatar: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=150&h=150&fit=crop&crop=face',
    hasViewed: false,
  },
  {
    id: '4',
    username: 'safari_mike',
    displayName: 'Mike',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    hasViewed: true,
  },
  {
    id: '5',
    username: 'chef_mary',
    displayName: 'Mary',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    hasViewed: false,
  },
];

interface StoriesRailProps {
  className?: string;
  showStories?: boolean;
}

export default function StoriesRail({ className, showStories = true }: StoriesRailProps) {
  const navigate = useNavigate();
  const [stories] = useState<Story[]>(mockStories);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (!showStories) {
      setIsVisible(false);
      return;
    }

    // Intersection observer to hide stories when scrolling past first reel
    const secondReelEl = document.querySelector('[data-second-reel]');
    if (!secondReelEl) return;

    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.intersectionRatio <= 0.7);
      },
      { 
        threshold: [0, 0.3, 0.7, 1],
        rootMargin: '0px'
      }
    );

    intersectionObserver.observe(secondReelEl);

    return () => {
      intersectionObserver.disconnect();
    };
  }, [showStories]);

  const handleStoryClick = (story: Story) => {
    if (story.username === 'me') {
      navigate('/create/camera');
    } else {
      navigate(`/stories/${story.username}`);
    }
  };

  if (!showStories) return null;

  return (
    <div className={cn(
      'stories-rail transition-all duration-300',
      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none',
      className
    )}>
      <div className="flex space-x-3 px-4 py-3 overflow-x-auto hide-scrollbar">
        {stories.map((story) => (
          <button
            key={story.id}
            onClick={() => handleStoryClick(story)}
            className="flex-shrink-0 flex flex-col items-center space-y-2 touch-target"
          >
            {/* Avatar with ring */}
            <div className="relative">
              <div className={cn(
                'w-16 h-16 p-0.5 rounded-full',
                story.hasViewed 
                  ? 'bg-gradient-to-tr from-gray-400 to-gray-500' 
                  : 'bg-gradient-to-tr from-primary via-secondary to-accent',
                story.isLive && 'animate-pulse'
              )}>
                <div className="w-full h-full bg-black rounded-full p-0.5">
                  {story.username === 'me' ? (
                    <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center">
                      <Plus className="w-6 h-6 text-white" />
                    </div>
                  ) : (
                    <img 
                      src={story.avatar}
                      alt={story.displayName}
                      className="w-full h-full rounded-full object-cover"
                    />
                  )}
                </div>
              </div>
              
              {story.isLive && (
                <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2">
                  <span className="px-2 py-0.5 bg-red-500 text-white text-xs font-bold rounded-full">
                    LIVE
                  </span>
                </div>
              )}
            </div>
            
            {/* Username */}
            <span className="text-white text-xs font-medium max-w-16 truncate">
              {story.displayName}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
