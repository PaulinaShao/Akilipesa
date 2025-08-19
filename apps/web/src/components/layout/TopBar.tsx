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
        {/* Left: AkiliPesa Logo */}
        <div className="top-bar-left">
          <div className="logo-container">
            <img
              src="https://cdn.builder.io/api/v1/image/assets%2Fd3b228cddfa346f0aa1ed35137c6f24e%2F6d889672dba44d67810beb12835dca8c?format=webp&width=800"
              alt="AkiliPesa"
              className="akilipesa-logo"
            />
          </div>
        </div>

        {/* Right: FREE badge, wallet balance, Sign In */}
        <div className="top-bar-right">
          {/* FREE Badge */}
          <div className="plan-pill">
            {planDisplay}
          </div>

          {/* Wallet Balance */}
          <div className="wallet-balance">
            {formatBalance(userBalance)}
          </div>

          {/* Sign In Label - only show if user is not signed in */}
          {!user && (
            <a href="/auth" className="sign-in-label">
              Sign In
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
