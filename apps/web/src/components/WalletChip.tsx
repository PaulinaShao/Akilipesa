import React, { useEffect, useState } from "react";

type Props = {
  variant?: "guest" | "user";
  onClick?: () => void;
  labelGuest?: string;
  labelUser?: string;
};

export default function WalletChip({
  variant = "guest",
  onClick,
  labelGuest = "Tap to start earning",
  labelUser = "—",
}: Props) {
  // hide after first scroll > 60px
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const onScroll = () => {
      if (window.scrollY > 60) setVisible(false);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  const label = variant === "guest" ? labelGuest : labelUser;

  return (
    <button
      onClick={onClick}
      className="fixed top-4 left-4 z-[60] px-3 h-9 rounded-full text-sm font-medium
                 backdrop-blur-md shadow-lg transition hover:scale-[1.02]
                 border border-white/10"
      style={{
        background:
          "linear-gradient(135deg, rgba(31,21,74,.70), rgba(74,35,150,.60))",
        color: "white",
      }}
    >
      <span className="inline-flex items-center gap-2">
        <span className="w-5 h-5 rounded-full bg-white/15 grid place-items-center">💎</span>
        {label}
      </span>
    </button>
  );
}
