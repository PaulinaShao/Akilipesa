import { useState } from "react";
import RightActionRail from "./RightActionRail";

export function FeedCard({
  mediaUrl,
  caption,
  likeCount,
  commentCount,
  phoneE164,
}:{
  mediaUrl: string;
  caption: string;
  likeCount: number;
  commentCount: number;
  phoneE164?: string | null;
}){
  const [open, setOpen] = useState(false);

  return (
    <section className="relative w-full h-[var(--vh)] overflow-hidden">
      <img
        src={mediaUrl}
        alt=""
        className="absolute inset-0 w-full h-full object-cover"
        draggable={false}
      />

      {/* Bottom glass background for readability */}
      <div className="feed-bottom-glass"></div>

      {/* Caption area */}
      <div className="feed-caption p-4">
        <div className="max-w-screen-sm mx-auto text-white">
          {/* handle + live dots etc can be placed above */}
          <p className={`text-[15px] ${open ? "" : "caption"}`}>
            {caption}
          </p>
          {caption.length > 120 && (
            <button
              className="mt-1 text-[13px] font-semibold text-indigo-300"
              onClick={()=>setOpen(v=>!v)}
              aria-expanded={open}
            >
              {open ? "Show less" : "More"}
            </button>
          )}
        </div>
      </div>

      <RightActionRail
        likeCount={likeCount}
        commentCount={commentCount}
        phoneE164={phoneE164 ?? null}
        share={()=>{
          if(navigator.share){
            navigator.share({ title: "AkiliPesa", url: location.href }).catch(()=>{});
          } else {
            navigator.clipboard?.writeText(location.href);
          }
        }}
      />
    </section>
  );
}
