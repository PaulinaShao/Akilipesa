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
    <div className={`tiktok-topbar ${className}`}>
      {/* Left: AkiliPesa Logo */}
      <div className="tiktok-logo">
        AkiliPesa
      </div>

      {/* Right: FREE badge, wallet balance, Sign In */}
      <div className="tiktok-top-right">
        {/* FREE Badge */}
        <div className="tiktok-free-badge">
          {planDisplay}
        </div>

        {/* Wallet Balance */}
        <div className="tiktok-balance">
          {formatBalance(userBalance)}
        </div>

        {/* Sign In Label - only show if user is not signed in */}
        {!user && (
          <a href="/auth" className="tiktok-balance">
            Sign In
          </a>
        )}
      </div>
    </div>
  );
}
