import { useState, useEffect } from "react";
import AppShell from "../../components/AppShell";
import FeedItem from "./FeedItem";
import { initiateCall } from "@/lib/callUtils";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/useToast";

// Demo data structure - replace with your real data
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
    hashtags: ["TechTZ", "Innovation", "Startup", "Africa", "Technology"],
    counts: { likes: 28900, comments: 1500, shares: 892 },
    liked: true
  },
  {
    id: "3",
    media: {
      type: "video" as const,
      src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
      poster: "https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=400&h=600&fit=crop"
    },
    user: "sarah_creates",
    caption: "Creating magic with every brushstroke 🎨 Art is the language of the soul.",
    hashtags: ["Art", "Creative", "Painting", "Magic", "Soul"],
    counts: { likes: 15600, comments: 890, shares: 445 },
    liked: false
  },
  {
    id: "4",
    media: {
      type: "image" as const,
      src: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=600&fit=crop"
    },
    user: "adventure_mike",
    caption: "Mountain peaks and endless possibilities! The view from up here is absolutely breathtaking 🏔️",
    hashtags: ["Adventure", "Mountains", "Nature", "Hiking", "Views"],
    counts: { likes: 67800, comments: 3200, shares: 1800 },
    liked: true
  }
];

export default function FeedScreen() {
  const [feedData, setFeedData] = useState(DEMO_FEED);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Simulate real data loading
  useEffect(() => {
    // You can replace this with actual API calls
    console.log("Loading feed data...");
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
    // Navigate to comments or open comment modal
    console.log("Opening comments for:", id);
    toast({
      title: "Comments",
      description: "Comments feature coming soon!",
    });
  };

  const handleShare = (id: string) => {
    console.log("Sharing:", id);
    toast({
      title: "Share",
      description: "Share feature coming soon!",
    });
  };

  const handleAudioCall = async (username: string) => {
    try {
      console.log("Initiating audio call to:", username);
      // Use your existing call system
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
      console.log("Initiating video call to:", username);
      // Use your existing call system
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
    <>
      {feedData.map((item) => (
        <FeedItem 
          key={item.id}
          media={item.media}
          user={item.user}
          live={item.live}
          caption={item.caption}
          hashtags={item.hashtags}
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
    </>
  );
}
