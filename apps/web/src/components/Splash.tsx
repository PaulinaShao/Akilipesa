import { useEffect } from "react";
import LoadingIcon from "./LoadingIcon";

type Props = {
  durationMs?: number;
  onDone: () => void;
};

export default function Splash({
  durationMs = 1500,
  onDone,
}: Props) {
  useEffect(() => {
    const t = setTimeout(() => {
      onDone();
      // Navigate to /reels after splash
      window.location.href = '/reels';
    }, durationMs);
    return () => clearTimeout(t);
  }, [durationMs, onDone]);

  return (
    <div className="fixed inset-0 z-[9999] grid place-items-center bg-[var(--tz-bg)]">
      <div className="relative">
        {/* Tanzanite glow effect */}
        <div className="absolute inset-0 -m-8 rounded-full blur-3xl opacity-60"
             style={{ background: "radial-gradient(closest-side, var(--tz-indigo), transparent)" }} />

        {/* Tanzanite A Icon with animation */}
        <div className="relative z-10">
          <LoadingIcon size="lg" />
        </div>
      </div>
      <p className="mt-8 text-lg font-medium tz-gem-text">AkiliPesa</p>
    </div>
  );
}
