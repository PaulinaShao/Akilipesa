import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface WalletChipProps {
  balance: number;
  plan: 'Free' | 'Starter' | 'Premium';
  className?: string;
}

const formatTZS = (amount: number): string => {
  return new Intl.NumberFormat('en-TZ', {
    style: 'decimal',
    maximumFractionDigits: 0
  }).format(amount);
};

const getPlanBadgeColors = (plan: string) => {
  switch (plan) {
    case 'Premium':
      return 'bg-teal-400 text-black';
    case 'Starter':  
      return 'bg-purple-500 text-white';
    case 'Free':
    default:
      return 'bg-slate-500 text-white';
  }
};

export default function WalletChip({ balance, plan, className }: WalletChipProps) {
  const navigate = useNavigate();
  const [hide, setHide] = useState(false);

  useEffect(() => {
    const secondReelEl = document.querySelector('[data-second-reel]');
    if (!secondReelEl) return;

    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        setHide(entry.intersectionRatio > 0.3);
      },
      { 
        threshold: [0, 0.3, 1],
        rootMargin: '0px'
      }
    );

    intersectionObserver.observe(secondReelEl);

    return () => {
      intersectionObserver.disconnect();
    };
  }, []);

  return (
    <button
      className={cn(
        'wallet-chip',
        hide ? 'hide' : '',
        className
      )}
      onClick={() => navigate('/wallet')}
      aria-label={`Wallet balance: ${formatTZS(balance)} TSH, ${plan} plan`}
    >
      <span className="chip-icon">💎</span>
      <span className="amount">{formatTZS(balance)} <span className="currency">TSH</span></span>
      <span className={cn('plan-badge', getPlanBadgeColors(plan))}>
        {plan}
      </span>
      <span className="chevron">›</span>
    </button>
  );
}
