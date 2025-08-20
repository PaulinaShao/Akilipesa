import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/useToast";
import { initiateCall } from "@/lib/callUtils";
import TikTokLayout, { TikTokVideo } from "@/components/TikTokLayout";

// Demo feed data - keeping original AkiliPesa content
const DEMO_FEED = [
  {
    id: "1",
    media: {
      type: "video" as const, 
      src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
      poster: "https://images.unsplash.com/photo-1494790108755-2616c27eb3ea?w=400&h=600&fit=crop"
    },
    user: "amina_tz", 
    live: true,
    caption: "Showcasing the beauty of Tanzanian culture! What do you think? This is an amazing experience that I want to share with all of you. The traditions here are so rich and vibrant.",
    hashtags: ["Tanzania", "Culture", "Dance", "Beautiful", "Traditional"],
    counts: { likes: 45200, comments: 2800, shares: 1200 },
    liked: false
  },
  {
    id: "2",
    media: {
      type: "image" as const, 
      src: "https://images.unsplash.com/photo-1531384441138-2736e62e0919?w=400&h=600&fit=crop"
    },
    user: "tech_james",
    caption: "Tech innovation meets African creativity. Building the future one line of code at a time! 💻✨ #TechAfrica",
    hashtags: ["TechAfrica", "Innovation", "Code", "Future"],
    counts: { likes: 23100, comments: 891, shares: 445 },
    liked: true
  },
  {
    id: "3",
    media: {
      type: "video" as const,
      src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
      poster: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=600&fit=crop"
    },
    user: "sarah_ke",
    caption: "Exploring Kenya's stunning landscapes and wildlife. Nature at its finest! 🦁🌍",
    hashtags: ["Kenya", "Wildlife", "Nature", "Safari", "Beautiful"],
    counts: { likes: 67800, comments: 4200, shares: 2100 },
    liked: false
  }
];

export default function TikTokFeedScreen() {
  const [feedData, setFeedData] = useState(DEMO_FEED);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Initialize feed data
  useEffect(() => {
    // In a real app, fetch from API
    setFeedData(DEMO_FEED);
  }, []);

  const handleLike = (id: string) => {
    setFeedData(prev => prev.map(item => {
      if (item.id === id) {
        const isLiked = !item.liked;
        return {
          ...item,
          liked: isLiked,
          counts: {
            ...item.counts,
            likes: isLiked ? item.counts.likes + 1 : item.counts.likes - 1
          }
        };
      }
      return item;
    }));
  };

  const handleComment = (id: string) => {
    console.log("Opening comments for:", id);
    toast({
      title: "Comments",
      description: "Comments feature coming soon!",
    });
  };

  const handleShare = (id: string) => {
    console.log("Sharing:", id);
    toast({
      title: "Shared",
      description: "Content shared successfully!",
    });
  };

  const handleAudioCall = async (username: string) => {
    try {
      await initiateCall({
        targetUserId: username,
        callType: 'audio'
      });
    } catch (error) {
      console.error("Call failed:", error);
      toast({
        title: "Call Failed",
        description: "Unable to start call. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleVideoCall = async (username: string) => {
    try {
      await initiateCall({
        targetUserId: username,
        callType: 'video'
      });
    } catch (error) {
      console.error("Call failed:", error);
      toast({
        title: "Call Failed",
        description: "Unable to start call. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleProfile = (username: string) => {
    navigate(`/profile/${username}`);
  };

  return (
    <TikTokLayout>
      {feedData.map((item) => (
        <TikTokVideo
          key={item.id}
          media={item.media}
          user={item.user}
          live={item.live}
          caption={item.caption}
          counts={item.counts}
          liked={item.liked}
          onLike={() => handleLike(item.id)}
          onComment={() => handleComment(item.id)}
          onShare={() => handleShare(item.id)}
          onAudioCall={() => handleAudioCall(item.user)}
          onVideoCall={() => handleVideoCall(item.user)}
          onProfile={() => handleProfile(item.user)}
        />
      ))}
    </TikTokLayout>
  );
}
