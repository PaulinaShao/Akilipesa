import { useEffect } from "react";
import AkiliLogo from "./AkiliLogo";

type Props = {
  durationMs?: number;
  onDone: () => void;
};

export default function Splash({
  durationMs = 2800,
  onDone,
}: Props) {
  useEffect(() => {
    const t = setTimeout(onDone, durationMs);
    return () => clearTimeout(t);
  }, [durationMs, onDone]);

  return (
    <div className="fixed inset-0 z-[9999] grid place-items-center bg-[var(--bg)]">
      <div className="relative w-[140px] h-[140px]">
        {/* glow */}
        <div className="absolute inset-0 rounded-full blur-2xl opacity-70"
             style={{ background: "radial-gradient(closest-side, rgba(105,77,255,.45), rgba(0,0,0,0))" }} />
        {/* Tanzanite logo with sparkles */}
        <div className="relative z-10 w-full h-full">
          <AkiliLogo variant="hero" size="xl" showSparkles={true} animated={true} />
        </div>
      </div>
      <p className="mt-6 text-sm tracking-wide text-white/70">AkiliPesa</p>
    </div>
  );
}
