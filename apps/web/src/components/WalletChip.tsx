import { useEffect, useState } from "react";

type Props = {
  variant?: "guest" | "user";
  onClick?: () => void;
  onBalanceClick?: () => void;
  onPlanClick?: () => void;
  labelGuest?: string;
  labelUser?: string;
  walletBalance?: number;
  currentPlan?: "free" | "starter" | "standard" | "pro";
};

export default function WalletChip({
  variant = "guest",
  onClick,
  onBalanceClick,
  onPlanClick,
  labelGuest = "Tap to start earning",
  labelUser = "—",
  walletBalance = 284500,
  currentPlan = "standard",
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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('sw-TZ', {
      style: 'currency',
      currency: 'TSH',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getPlanSymbol = (plan: string) => {
    switch (plan) {
      case "free":
        return "🆓";
      case "starter":
        return "⭐";
      case "standard":
        return "⚡";
      case "pro":
        return "👑";
      default:
        return "⭐";
    }
  };

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case "free":
        return "text-gray-300";
      case "starter":
        return "text-blue-300";
      case "standard":
        return "text-purple-300";
      case "pro":
        return "text-yellow-300";
      default:
        return "text-blue-300";
    }
  };

  return (
    <div className="fixed top-4 left-4 z-[60] flex items-center gap-2">
      {/* Primary Rewards/Earning Button */}
      <button
        onClick={onClick}
        className="px-4 h-10 rounded-full text-sm font-medium backdrop-blur-md shadow-lg
                   transition hover:scale-[1.02] border border-white/10 touch-target"
        style={{
          background:
            "linear-gradient(135deg, rgba(31,21,74,.70), rgba(74,35,150,.60))",
          color: "white",
          minHeight: '44px', // Ensure minimum tap target
        }}
      >
        <span className="inline-flex items-center gap-2">
          <span className="w-5 h-5 rounded-full bg-white/15 grid place-items-center">💎</span>
          Start earning
        </span>
      </button>

      {/* Compact Plan Indicator */}
      {currentPlan === 'free' && (
        <button
          onClick={onPlanClick}
          className="px-2 h-8 rounded-full text-xs font-medium backdrop-blur-md shadow-lg
                     border border-white/10 flex items-center gap-1 transition hover:scale-[1.02] animate-pulse"
          style={{
            background:
              "linear-gradient(135deg, rgba(31,21,74,.70), rgba(74,35,150,.60))",
            color: "white",
          }}
        >
          <span className="text-sm">🆓</span>
          <span className="text-gray-300">Free</span>
        </button>
      )}
    </div>
  );
}
