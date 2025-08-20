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

  // Clean caption: remove hashtags and keep exactly 3 words (performance optimized)
  const cleanCaption = (str: string) => {
    if (!str) return "";
    // Remove hashtags and take first 3 words in one pass
    const cleaned = str.replace(/#[^\s#]+/g, "").trim().split(/\s+/).filter(Boolean).slice(0, 3).join(" ");
    return cleaned;
  };

  const truncatedCaption = cleanCaption(p.caption);

  return (
    <section className="tiktok-feed-item" data-component="feed-item">
      {p.media.type === "video" ? (
        <video
          ref={ref}
          className="tiktok-media"
          src={p.media.src}
          poster={p.media.poster}
          muted
          playsInline
          loop
          data-legitimate="true"
        />
      ) : (
        <img className="tiktok-media" src={p.media.src} alt="" data-legitimate="true" />
      )}

      {/* Subtle gradient overlay for text readability */}
      <div className="caption-overlay" aria-hidden="true" data-legitimate="true" />

      {/* Right action rail */}
      <aside className="tiktok-right-rail" data-component="action-rail" data-legitimate="true">
        <RailButton
          icon={<Heart className={`${p.liked ? 'fill-current text-red-400' : 'text-white'}`} size={28} />}
          count={p.counts.likes}
          onClick={p.onLike}
          title="Like"
        />
        <RailButton
          icon={<MessageCircle className="text-white" size={28} />}
          count={p.counts.comments}
          onClick={p.onComment}
          title="Comment"
        />
        <RailButton
          icon={<Share className="text-white" size={28} />}
          count={p.counts.shares}
          onClick={p.onShare}
          title="Share"
        />
        <RailButton
          icon={<Phone className="text-white" size={28} />}
          onClick={p.onAudioCall}
          title="Audio call"
        />
        <RailButton
          icon={<Video className="text-white" size={28} />}
          onClick={p.onVideoCall}
          title="Video call"
        />
      </aside>

      {/* Caption Block with Avatar */}
      <div className="tiktok-caption" data-component="caption" data-legitimate="true">        <div className="tiktok-user-info">
        <button
          className="tiktok-avatar"
          onClick={p.onProfile}
          style={{
            background: "linear-gradient(45deg, #6da8ff, #7d6bff)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            fontSize: "16px",
            color: "white",
            border: "none"
          }}
          aria-label={`View ${p.user}'s profile`}
          data-legitimate="true"
        >
          @
        </button>
        </div>        <div className="tiktok-caption-text" data-legitimate="true">
          <div className="tiktok-username">
            @{p.user}
            {p.live && (
              <span className="tiktok-live-badge" data-legitimate="true">
                LIVE
              </span>
            )}
          </div>
          <div>
            {truncatedCaption}
          </div>
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
    <div className="flex flex-col items-center">
      <button
        className="tiktok-action-btn"
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
