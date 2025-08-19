import { useEffect, useRef, useState } from "react";
import { Heart, MessageCircle, Share, Phone, Video } from "lucide-react";

type Props = {
  media: { type: "video"|"image"; src: string; poster?: string };
  user: string;
  live?: boolean;
  caption: string;
  hashtags?: string[];
  counts: { likes:number; comments:number; shares:number };
  onLike?: () => void;
  onComment?: () => void;
  onShare?: () => void;
  onAudioCall?: () => void;
  onVideoCall?: () => void;
  onProfile?: () => void;
  liked?: boolean;
};

export default function FeedItem(p: Props){
  const ref = useRef<HTMLVideoElement|null>(null);
  const [captionExpanded, setCaptionExpanded] = useState(false);

  // Auto play/pause videos when the card is on screen
  useEffect(() => {
    if (p.media.type !== "video" || !ref.current) return;
    const el = ref.current;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        el.play().catch(() => {});
      } else {
        el.pause();
      }
    }, {threshold: 0.66});
    io.observe(el);
    return () => io.disconnect();
  }, [p.media.type]);

  // Clean caption: remove hashtags and keep exactly 3 words
  const cleanCaption = (str: string) => {
    if (!str) return "";
    // Remove hashtags
    const noHash = str.replace(/#[^\s#]+/g, "").trim();
    // Take first 3 words
    const words = noHash.split(/\s+/).filter(Boolean).slice(0, 3);
    return words.join(" ");
  };

  const truncatedCaption = cleanCaption(p.caption);

  return (
    <section className="feed-item">
      {p.media.type === "video" ? (
        <video
          ref={ref}
          className="feed-media"
          src={p.media.src}
          poster={p.media.poster}
          muted
          playsInline
          loop
        />
      ) : (
        <img className="feed-media" src={p.media.src} alt="" />
      )}

      {/* bottom fade never blocks taps */}
      <div className="bottom-fade" aria-hidden />

      {/* Right action rail */}
      <aside className="right-rail">
        <RailButton
          icon={<Heart className={`w-6 h-6 ${p.liked ? 'fill-current text-red-400' : 'text-white'}`} />}
          count={p.counts.likes}
          onClick={p.onLike}
          title="Like"
        />
        <RailButton
          icon={<MessageCircle className="w-6 h-6 text-white" />}
          count={p.counts.comments}
          onClick={p.onComment}
          title="Comment"
        />
        <RailButton
          icon={<Share className="w-6 h-6 text-white" />}
          count={p.counts.shares}
          onClick={p.onShare}
          title="Share"
        />

        {/* Call buttons - AkiliPesa style */}
        <RailButton
          icon={<Phone className="w-5 h-5 text-white" />}
          onClick={p.onAudioCall}
          title="Audio call"
        />
        <RailButton
          icon={<Video className="w-5 h-5 text-white" />}
          onClick={p.onVideoCall}
          title="Video call"
        />

      </aside>

      {/* Caption */}
      <div className="caption">
        <div style={{ marginBottom: "6px" }}>
          <span className="user">@{p.user}</span>
          {p.live && <span className="live">LIVE</span>}
        </div>
        <div style={{
          marginTop: 6,
          lineHeight: 1.35,
          fontSize: "14px",
          color: "white",
          textShadow: "0 2px 8px rgba(0,0,0,0.5)"
        }}>
          {truncatedCaption}
        </div>
      </div>

    </section>
  );
}

function RailButton({
  icon,
  count,
  title,
  onClick
}: {
  icon: React.ReactNode;
  count?: number;
  title?: string;
  onClick?: () => void;
}) {
  return (
    <div style={{display:"flex", flexDirection:"column", alignItems:"center"}}>
      <button
        className="rail-btn"
        aria-label={title ?? "Button"}
        onClick={onClick}
      >
        {icon}
      </button>
      {typeof count === "number" && (
        <div className="rail-count">{formatCount(count)}</div>
      )}
    </div>
  );
}

function formatCount(n: number) {
  if (n >= 1_000_000) return (n/1_000_000).toFixed(1).replace(/\.0$/,'')+'M';
  if (n >= 1_000) return (n/1_000).toFixed(1).replace(/\.0$/,'')+'K';
  return String(n);
}
