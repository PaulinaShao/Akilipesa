import { useMemo } from "react";
import { Heart, MessageCircle, Share2, Phone, Video } from "lucide-react";

export default function RightActionRail({
  likeCount = 0,
  commentCount = 0,
  share = () => {},
  phoneE164,            // e.g. "+2557xxxxxxx" if available
}: {
  likeCount?: number;
  commentCount?: number;
  share?: () => void;
  phoneE164?: string | null;
}){
  const waAudio = useMemo(
    () => phoneE164 ? `https://wa.me/${phoneE164.replace(/\D/g,"")}` : null,
    [phoneE164]
  );
  const waVideo = useMemo(
    () => phoneE164 ? `https://wa.me/${phoneE164.replace(/\D/g,"")}?video_call` : null,
    [phoneE164]
  );

  return (
    <aside
      className="
        pointer-events-auto
        fixed right-2 top-1/2 -translate-y-1/2 z-[50] action-rail
        flex flex-col items-center gap-3
      "
      aria-label="Actions"
    >
      {/* Like (count only) */}
      <button className="rail-btn" aria-label="Likes">
        <Heart className="h-6 w-6" />
      </button>
      <span className="text-white text-xs/4">{formatCount(likeCount)}</span>

      {/* Comments (count only) */}
      <button className="rail-btn" aria-label="Comments">
        <MessageCircle className="h-6 w-6" />
      </button>
      <span className="text-white text-xs/4">{formatCount(commentCount)}</span>

      {/* Share */}
      <button className="rail-btn" aria-label="Share" onClick={share}>
        <Share2 className="h-6 w-6" />
      </button>

      {/* WhatsApp audio */}
      <a
        className="rail-btn"
        aria-label="WhatsApp audio call"
        href={waAudio ?? "#"}
        onClick={(e)=>{ if(!waAudio){ e.preventDefault(); toast("No number"); } }}
        target="_blank" rel="noreferrer"
      >
        <Phone className="h-6 w-6" />
      </a>

      {/* WhatsApp video */}
      <a
        className="rail-btn"
        aria-label="WhatsApp video call"
        href={waVideo ?? "#"}
        onClick={(e)=>{ if(!waVideo){ e.preventDefault(); toast("No number"); } }}
        target="_blank" rel="noreferrer"
      >
        <Video className="h-6 w-6" />
      </a>
    </aside>
  );
}

function formatCount(n:number){
  if(n>=1_000_000) return (n/1_000_000).toFixed(1)+"M";
  if(n>=1_000) return (n/1_000).toFixed(1)+"K";
  return String(n);
}

function toast(msg:string){ 
  console.warn(msg); 
  // You can integrate with your existing toast system here
}
