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
        {/* Left: AkiliPesa Wordmark with Tanzanite Gradient */}
        <div className="top-bar-left">
          <div className="flex items-center gap-3">
            {/* Tanzanite "A" Icon with flag stripe */}
            <div className="relative">
              <svg
                className="w-8 h-8"
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <linearGradient id="tanzanite-pleochroic" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="var(--tz-blue-deep)" />
                    <stop offset="55%" stopColor="var(--tz-indigo)" />
                    <stop offset="100%" stopColor="var(--tz-violet)" />
                  </linearGradient>
                  {/* Tanzania flag stripe */}
                  <linearGradient id="tz-flag-stripe" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#1db954" />    {/* green */}
                    <stop offset="20%" stopColor="#c9a24a" />   {/* yellow */}
                    <stop offset="40%" stopColor="#000" />      {/* black */}
                    <stop offset="60%" stopColor="#c9a24a" />   {/* yellow */}
                    <stop offset="80%" stopColor="#0052cc" />   {/* blue */}
                  </linearGradient>
                </defs>
                {/* Main "A" shape */}
                <path
                  d="M16 4L24 28H20L18.5 24H13.5L12 28H8L16 4Z M15 16H17L16 12L15 16Z"
                  fill="url(#tanzanite-pleochroic)"
                />
                {/* Flag stripe on A leg */}
                <rect x="12" y="20" width="2" height="8" fill="url(#tz-flag-stripe)" opacity="0.8" />
                {/* AI node cluster (subtle) */}
                <circle cx="16" cy="14" r="1.5" fill="white" opacity="0.6" />
                <circle cx="14" cy="16" r="1" fill="white" opacity="0.4" />
                <circle cx="18" cy="16" r="1" fill="white" opacity="0.4" />
              </svg>
            </div>

            {/* Wordmark with Tanzanite gradient */}
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
