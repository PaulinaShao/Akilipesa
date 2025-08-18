import Screen from "@/components/Screen";
import { HeaderTop } from "@/components/layout/HeaderTop";
import BottomNav from "@/components/layout/BottomNav";
import { FeedCard } from "@/components/feed/FeedCard";
import { useAuthStatus } from "@/auth/useAuthStatus";

const DEMO = [
  {
    mediaUrl: "https://images.unsplash.com/photo-1520975930498-6a1f979c6f3b?w=1200",
    caption: "Showcasing the beauty of Tanzanian culture 🇹🇿✨ What do you think about this traditional dance? This is our rich heritage passed down through generations, and every movement tells a story of our ancestors. The rhythms connect us to our roots and bring our community together in celebration. Would love to hear your thoughts on preserving cultural traditions in the modern world! #Tanzania #Culture #Dance #Traditional #Beauty",
    likeCount: 28900, 
    commentCount: 1500, 
    phoneE164: "+255700000001"
  },
  {
    mediaUrl: "https://images.unsplash.com/photo-1499084732479-de2c02d45fc4?w=1200",
    caption: "Tech innovation meets African creativity! 🔬💡 Building the future from Tanzania 💙 Our startup ecosystem is growing rapidly with amazing talents working on solutions that matter. From fintech to agtech, we are solving real problems and creating opportunities for millions across East Africa. #TechTZ #Innovation #Startup #Africa #Technology",
    likeCount: 892, 
    commentCount: 62, 
    phoneE164: null
  },
  {
    mediaUrl: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200",
    caption: "Fashion meets tradition 💃 New Kitenge collection inspired by Tanzanite gems! Available now 👗✨ #Fashion #Kitenge #Tanzania #Style #Handmade",
    likeCount: 19876, 
    commentCount: 987, 
    phoneE164: "+255700000002"
  },
  {
    mediaUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200",
    caption: "Live cooking session! Today we are making traditional Ugali with sukuma wiki and some delicious nyama choma 🔥 Join me as I share family recipes passed down through generations. Perfect for Sunday dinner with the family! #Cooking #TanzanianFood #LiveCooking #Traditional #Recipe",
    likeCount: 34567, 
    commentCount: 2156, 
    phoneE164: "+255700000003"
  },
];

export default function HomeFeedPage(){
  const { isAuthed } = useAuthStatus();

  return (
    <>
      <HeaderTop isAuthed={isAuthed} />
      <Screen>
        {DEMO.map((f, i)=>(
          <FeedCard key={i} {...f} />
        ))}
      </Screen>
      <BottomNav />
    </>
  );
}
