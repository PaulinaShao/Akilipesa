import { useAppStore } from '@/store';

interface TopBarProps {
  className?: string;
}

export default function TopBar({ className = '' }: TopBarProps) {
  const { user } = useAppStore();

  // Get user plan and balance
  const userPlan = user?.plan || 'free';
  const userBalance = user?.balance || 0;

  // Format plan display
  const planDisplay = userPlan === 'free' ? 'FREE' :
                     userPlan === 'starter' ? 'STARTER' :
                     userPlan === 'pro' ? 'PRO' : 'FREE';

  // Format balance for compact display
  const formatBalance = (amount: number) => {
    if (amount >= 1000000) {
      return `${(amount / 1000000).toFixed(1)}M TZS`;
    } else if (amount >= 1000) {
      return `${(amount / 1000).toFixed(1)}K TZS`;
    }
    return `${amount.toLocaleString()} TZS`;
  };

  return (
    <div className={`top-bar ${className}`}>
      <div className="top-bar-content">
        {/* Left: AkiliPesa Wordmark */}
        <div className="top-bar-left">
          <div className="tz-gem-text text-base font-semibold tracking-tight">
            AkiliPesa
          </div>

          {/* TikTok-style navigation tabs */}
          <div className="top-nav-tabs">
            <a href="#" className="nav-tab">Following</a>
            <a href="#" className="nav-tab">Friends</a>
            <a href="#" className="nav-tab active">For You</a>
          </div>
        </div>

        {/* Right: FREE badge, wallet balance, Sign Up */}
        <div className="top-bar-right">
          {/* FREE Badge */}
          <div className="plan-pill">
            {planDisplay}
          </div>

          {/* Wallet Balance */}
          <div className="wallet-balance">
            {formatBalance(userBalance)}
          </div>

          {/* Sign Up Link */}
          {!user && (
            <a href="/auth" className="sign-up-btn">
              Sign Up
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
