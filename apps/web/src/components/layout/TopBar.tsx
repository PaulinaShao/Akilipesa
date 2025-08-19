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
        {/* Left: AkiliPesa Logo */}
        <div className="top-bar-left">
          <div className="flex items-center gap-2">
            {/* Logo SVG - Tanzanite variant */}
            <svg 
              className="logo" 
              viewBox="0 0 120 32" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* AkiliPesa logo with Tanzanite colors */}
              <defs>
                <linearGradient id="tanzanite-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="var(--tz-accent)" />
                  <stop offset="100%" stopColor="var(--tz-gold)" />
                </linearGradient>
              </defs>
              <circle cx="16" cy="16" r="12" fill="url(#tanzanite-gradient)" />
              <path 
                d="M12 12h8l-2 8h-4l-2-8z" 
                fill="white" 
                opacity="0.9"
              />
              <text 
                x="36" 
                y="20" 
                fill="white" 
                fontSize="14" 
                fontWeight="600" 
                fontFamily="var(--font-primary)"
              >
                AkiliPesa
              </text>
            </svg>
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
