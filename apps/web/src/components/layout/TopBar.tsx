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
  const planDisplay = userPlan === 'free' ? 'Free' : 
                     userPlan === 'starter' ? 'Starter' : 
                     userPlan === 'pro' ? 'Pro' : 'Free';
  
  // Format balance
  const formatBalance = (amount: number) => {
    return new Intl.NumberFormat('en-TZ', {
      style: 'currency',
      currency: 'TZS',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  return (
    <div className={`top-bar ${className}`}>
      <div className="top-bar-content">
        {/* Left: AkiliPesa Wordmark Only (Minimal Clean) */}
        <div className="top-bar-left">
          <div className="flex items-center">
            {/* Wordmark with Tanzanite gradient - minimal clean look */}
            <div className="tz-gem-text text-xl font-bold tracking-tight">
              AkiliPesa
            </div>
          </div>
        </div>

        {/* Center: Spacer */}
        <div className="flex-1" />

        {/* Right: Plan pill + Wallet balance */}
        <div className="top-bar-right">
          {/* Plan Pill */}
          <div className="plan-pill">
            {planDisplay}
          </div>
          
          {/* Wallet Balance */}
          <div className="wallet-balance">
            {formatBalance(userBalance)}
          </div>
        </div>
      </div>
    </div>
  );
}
