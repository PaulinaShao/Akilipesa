import { useNavigate } from 'react-router-dom';
import { Wallet, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/store';

interface WalletChipProps {
  className?: string;
  balance?: number;
  plan?: string;
}

export default function WalletChip({ className, balance, plan }: WalletChipProps) {
  const navigate = useNavigate();
  const { user } = useAppStore();
  
  const displayBalance = balance ?? user?.balance ?? 0;
  const displayPlan = plan ?? user?.plan ?? 'free';
  
  const formatBalance = (amount: number) => {
    if (amount >= 1000000) {
      return `${(amount / 1000000).toFixed(1)}M`;
    }
    if (amount >= 1000) {
      return `${(amount / 1000).toFixed(1)}K`;
    }
    return amount.toLocaleString();
  };

  const getPlanColor = (planType: string) => {
    switch (planType) {
      case 'premium':
      case 'business':
        return 'text-yellow-400';
      case 'starter':
        return 'text-blue-400';
      default:
        return 'text-white';
    }
  };

  const getPlanBadge = (planType: string) => {
    switch (planType) {
      case 'business':
        return 'Business';
      case 'premium':
        return 'Premium';
      case 'starter':
        return 'Starter';
      default:
        return null;
    }
  };

  return (
    <button
      onClick={() => navigate('/wallet')}
      className={cn(
        'absolute top-4 left-4 z-20 flex items-center space-x-2',
        'h-14 px-4 bg-black/30 backdrop-blur-md border border-white/20',
        'rounded-2xl hover:bg-black/40 transition-all duration-200',
        'glass-effect shadow-lg',
        className
      )}
    >
      {/* Wallet Icon */}
      <div className="w-8 h-8 bg-primary/20 rounded-xl flex-center">
        <Wallet className="w-4 h-4 text-primary" />
      </div>
      
      {/* Balance Info */}
      <div className="flex flex-col items-start">
        <div className="flex items-center space-x-1">
          <span className="text-white font-bold text-sm">
            {formatBalance(displayBalance)} TSH
          </span>
          {getPlanBadge(displayPlan) && (
            <span className={cn(
              'text-xs font-medium px-1.5 py-0.5 rounded-full',
              'bg-white/20',
              getPlanColor(displayPlan)
            )}>
              {getPlanBadge(displayPlan)}
            </span>
          )}
        </div>
        <span className="text-white/60 text-xs">Tap to add funds</span>
      </div>
      
      {/* Add Funds Icon */}
      <div className="w-6 h-6 bg-green-500/20 rounded-full flex-center">
        <Plus className="w-3 h-3 text-green-400" />
      </div>
    </button>
  );
}
