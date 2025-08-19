import { useEffect, useRef, useState } from "react";
import { Heart, MessageCircle, Share, Phone, Video, Music } from "lucide-react";

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

  // Keep caption to three words only for TikTok-style brevity
  const words = p.caption.split(' ');
  const threeWordCaption = words.slice(0, 3).join(' ');
  const truncatedCaption = words.length > 3 ? threeWordCaption + '...' : p.caption;
  const shouldShowMore = words.length > 3;

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
          style={{
            left: "-6px",
            top: "-39px"
          }}
        />
      ) : (
        <img className="feed-media" src={p.media.src} alt="" />
      )}

      {/* bottom fade never blocks taps */}
      <div className="bottom-fade" aria-hidden />

      {/* Right action rail */}
      <aside className="right-rail">
        {/* Profile avatar with follow button */}
        <div style={{display:"grid", placeItems:"center", marginBottom: "8px"}}>
          <button 
            onClick={p.onProfile}
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "50%",
              border: "2px solid white",
              background: "linear-gradient(45deg, #6da8ff, #7d6bff)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              fontSize: "20px",
              color: "white"
            }}
            aria-label={`View ${p.user}'s profile`}
          >
            @
          </button>
        </div>

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

        {/* Spinning music disc */}
        <div style={{
          marginTop: "12px",
          display: "grid", 
          placeItems: "center"
        }}>
          <div style={{
            width: "48px",
            height: "48px",
            borderRadius: "50%",
            background: "linear-gradient(45deg, #333, #666)",
            border: "2px solid rgba(255,255,255,0.3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            animation: "spin 10s linear infinite"
          }}>
            <Music className="h-5 w-5 text-white" />
          </div>
        </div>
      </aside>

      {/* Caption */}
      <div className="caption">
        <div style={{ marginBottom: "6px" }}>
          <span className="user">@{p.user}</span>
          {p.live && <span className="live">LIVE</span>}
        </div>
        <div style={{marginTop:6, lineHeight:1.35}}>
          {captionExpanded ? p.caption : truncatedCaption}
          {shouldShowMore && (
            <button 
              onClick={() => setCaptionExpanded(!captionExpanded)}
              className="more"
              style={{ 
                background: 'none', 
                border: 'none', 
                color: 'inherit',
                textDecoration: 'none'
              }}
            >
              {captionExpanded ? ' less' : ' more'}
            </button>
          )}
        </div>
        {p.hashtags?.length ? (
          <div style={{opacity:.9, marginTop:6}}>
            {p.hashtags.map((h,i) => (
              <span key={i} style={{marginRight:8, color: 'var(--tnz-accent)'}}>
                #{h}
              </span>
            ))}
          </div>
        ) : null}
        
        {/* Sound info */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "6px",
          marginTop: "8px",
          opacity: 0.8,
          fontSize: "12px"
        }}>
          <Music className="h-3 w-3" />
          <span>Original sound - {p.user}</span>
        </div>
      </div>

      {/* Add spinning animation */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
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
