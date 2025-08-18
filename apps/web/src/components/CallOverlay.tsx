import { PhoneOff, Mic, MicOff, Video, VideoOff, Volume2, VolumeX } from "lucide-react";
import { useState } from "react";

export default function CallOverlay({ name, avatar, onEnd }: {
  name: string; 
  avatar: string; 
  onEnd: () => void;
}) {
  const [muted, setMuted] = useState(false);
  const [video, setVideo] = useState(true);
  const [speaker, setSpeaker] = useState(true);

  return (
    <div className="fixed inset-0 z-[60] tz-bg flex flex-col items-center justify-center">
      <div className="absolute inset-x-0 top-0 h-24 tz-top-veil" />
      <img src={avatar} alt="" className="h-28 w-28 rounded-full tz-gem-border object-cover" />
      <div className="mt-3 text-lg font-semibold">{name}</div>
      <div className="text-sm tz-text-dim">Ringing…</div>

      {/* controls */}
      <div className="mt-8 flex items-center gap-4">
        <Control 
          active={!muted} 
          onClick={() => setMuted(m => !m)} 
          iconOn={<Mic />} 
          iconOff={<MicOff />} 
        />
        <Control 
          active={video} 
          onClick={() => setVideo(v => !v)} 
          iconOn={<Video />} 
          iconOff={<VideoOff />} 
        />
        <Control 
          active={speaker} 
          onClick={() => setSpeaker(s => !s)} 
          iconOn={<Volume2 />} 
          iconOff={<VolumeX />} 
        />
      </div>

      <button onClick={onEnd} className="mt-8 h-14 w-14 rounded-full bg-red-500 grid place-items-center">
        <PhoneOff className="h-6 w-6 text-white" />
      </button>
    </div>
  );
}

function Control({ active, onClick, iconOn, iconOff }: {
  active: boolean; 
  onClick: () => void; 
  iconOn: React.ReactNode; 
  iconOff: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`h-12 px-4 rounded-full tz-glass flex items-center gap-2 transition-colors ${active ? "text-white" : "text-white/60"}`}
    >
      {active ? iconOn : iconOff}
    </button>
  );
}
