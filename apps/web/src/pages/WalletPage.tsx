import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, ArrowDown, TrendingUp, Users, Megaphone, Copy, Share, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EarningsData {
  total: number;
  today: number;
  thisMonth: number;
  sparklineData: number[];
}

interface PayoutData {
  pending: number;
  completed: number;
  failed: number;
  nextPayout: string;
}

const mockEarnings: EarningsData = {
  total: 284500,
  today: 2400,
  thisMonth: 45300,
  sparklineData: [1200, 1800, 2100, 1900, 2400, 2200, 2800, 2400]
};

const mockPayouts: PayoutData = {
  pending: 12500,
  completed: 272000,
  failed: 0,
  nextPayout: '2024-01-20'
};

const mockReferrals = {
  totalEarned: 156000,
  activeReferrals: 23,
  pendingInvites: 5,
  bonusThisMonth: 12400
};

const mockAdsBalance = {
  balance: 45000,
  spent: 158000,
  impressions: 245000,
  clicks: 8400
};

export default function WalletPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'earnings' | 'payouts' | 'referrals' | 'ads'>('earnings');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-TZ').format(amount);
  };

  const copyReferralCode = () => {
    navigator.clipboard.writeText('AKILI2024');
    // Would show toast notification
  };

  const shareReferralLink = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Join AkiliPesa and earn money!',
        text: 'Use my referral code AKILI2024 to get started with AkiliPesa',
        url: 'https://akilipesa.com/join/AKILI2024'
      });
    }
  };

  const tabs = [
    { id: 'earnings', label: 'Earnings', icon: TrendingUp },
    { id: 'payouts', label: 'Payouts', icon: ArrowDown },
    { id: 'referrals', label: 'Referrals', icon: Users },
    { id: 'ads', label: 'Ads Balance', icon: Megaphone }
  ];

  const renderSparkline = (data: number[]) => {
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min;
    
    const points = data.map((value, index) => {
      const x = (index / (data.length - 1)) * 100;
      const y = 100 - ((value - min) / range) * 100;
      return `${x},${y}`;
    }).join(' ');

    return (
      <svg className="w-full h-16" viewBox="0 0 100 100" preserveAspectRatio="none">
        <polyline
          fill="none"
          stroke="url(#gradient)"
          strokeWidth="2"
          points={points}
        />
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#33FFC1" />
            <stop offset="100%" stopColor="#8A5CF6" />
          </linearGradient>
        </defs>
      </svg>
    );
  };

  return (
    <div className="min-h-screen-safe bg-gradient-to-b from-bg-primary to-bg-secondary">
      {/* Header */}
      <div className="safe-top p-4 flex items-center justify-between glass border-b border-white/10">
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>
          <h1 className="text-xl font-bold text-white">Wallet</h1>
        </div>
        <div className="flex items-center space-x-2">
          <button 
            onClick={() => navigate('/wallet/add-funds')}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <Plus className="w-6 h-6 text-white" />
          </button>
        </div>
      </div>

      {/* Balance Overview */}
      <div className="p-6">
        <div className="card text-center mb-6">
          <h2 className="text-white/70 text-sm uppercase tracking-wider mb-2">Total Balance</h2>
          <div className="text-4xl font-bold text-white mb-4">
            {formatCurrency(mockEarnings.total)} <span className="text-xl text-white/60">TSH</span>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <p className="text-white/50 text-xs">Today</p>
              <p className="text-accent font-bold text-lg">+{formatCurrency(mockEarnings.today)}</p>
            </div>
            <div>
              <p className="text-white/50 text-xs">This Month</p>
              <p className="text-primary font-bold text-lg">+{formatCurrency(mockEarnings.thisMonth)}</p>
            </div>
          </div>

          <div className="flex space-x-3">
            <button 
              onClick={() => navigate('/wallet/withdraw')}
              className="flex-1 btn-primary py-3"
            >
              Withdraw
            </button>
            <button 
              onClick={() => navigate('/wallet/add-funds')}
              className="flex-1 btn-secondary py-3"
            >
              Add Funds
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex bg-white/5 rounded-2xl p-1 mb-6">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={cn(
                  'flex-1 flex items-center justify-center space-x-2 py-3 rounded-xl transition-all text-sm',
                  activeTab === tab.id
                    ? 'bg-primary text-white shadow-lg'
                    : 'text-white/60 hover:text-white'
                )}
              >
                <Icon className="w-4 h-4" />
                <span className="font-medium">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        {activeTab === 'earnings' && (
          <div className="space-y-4">
            <div className="card">
              <h3 className="text-lg font-semibold text-white mb-4">Earnings Overview</h3>
              
              {/* Sparkline Chart */}
              <div className="mb-4">
                <p className="text-white/60 text-sm mb-2">Last 30 days earnings</p>
                <div className="h-16 glass rounded-lg p-3">
                  {renderSparkline(mockEarnings.sparklineData)}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="glass rounded-xl p-4">
                  <p className="text-white/50 text-xs">Videos</p>
                  <p className="text-white font-bold text-lg">{formatCurrency(85400)} TSH</p>
                </div>
                <div className="glass rounded-xl p-4">
                  <p className="text-white/50 text-xs">Products</p>
                  <p className="text-white font-bold text-lg">{formatCurrency(142600)} TSH</p>
                </div>
                <div className="glass rounded-xl p-4">
                  <p className="text-white/50 text-xs">Referrals</p>
                  <p className="text-white font-bold text-lg">{formatCurrency(32100)} TSH</p>
                </div>
                <div className="glass rounded-xl p-4">
                  <p className="text-white/50 text-xs">Live Calls</p>
                  <p className="text-white font-bold text-lg">{formatCurrency(24400)} TSH</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'payouts' && (
          <div className="space-y-4">
            <div className="card">
              <h3 className="text-lg font-semibold text-white mb-4">Payout Status</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 glass rounded-xl">
                  <span className="text-white/70">Pending</span>
                  <span className="text-yellow-400 font-bold">{formatCurrency(mockPayouts.pending)} TSH</span>
                </div>
                <div className="flex justify-between items-center p-3 glass rounded-xl">
                  <span className="text-white/70">Completed</span>
                  <span className="text-green-400 font-bold">{formatCurrency(mockPayouts.completed)} TSH</span>
                </div>
                <div className="flex justify-between items-center p-3 glass rounded-xl">
                  <span className="text-white/70">Failed</span>
                  <span className="text-red-400 font-bold">{formatCurrency(mockPayouts.failed)} TSH</span>
                </div>
              </div>

              <div className="mt-6 p-4 bg-primary/10 rounded-xl border border-primary/20">
                <p className="text-primary font-semibold mb-1">Next Payout</p>
                <p className="text-white/70 text-sm">
                  Scheduled for {mockPayouts.nextPayout}
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'referrals' && (
          <div className="space-y-4">
            <div className="card">
              <h3 className="text-lg font-semibold text-white mb-4">Referral Program</h3>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="glass rounded-xl p-4">
                  <p className="text-white/50 text-xs">Total Earned</p>
                  <p className="text-accent font-bold text-lg">{formatCurrency(mockReferrals.totalEarned)} TSH</p>
                </div>
                <div className="glass rounded-xl p-4">
                  <p className="text-white/50 text-xs">Active Referrals</p>
                  <p className="text-primary font-bold text-lg">{mockReferrals.activeReferrals}</p>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold text-white">Your Referral Code</h4>
                <div className="flex items-center space-x-3 p-3 glass rounded-xl">
                  <span className="flex-1 font-mono text-white text-lg">AKILI2024</span>
                  <button 
                    onClick={copyReferralCode}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <Copy className="w-5 h-5 text-white/60" />
                  </button>
                  <button 
                    onClick={shareReferralLink}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <Share className="w-5 h-5 text-white/60" />
                  </button>
                </div>

                <button className="w-full btn-primary py-3 flex items-center justify-center space-x-2">
                  <ExternalLink className="w-5 h-5" />
                  <span>Share Referral Link</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'ads' && (
          <div className="space-y-4">
            <div className="card">
              <h3 className="text-lg font-semibold text-white mb-4">Ads Balance</h3>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="glass rounded-xl p-4">
                  <p className="text-white/50 text-xs">Available Balance</p>
                  <p className="text-accent font-bold text-lg">{formatCurrency(mockAdsBalance.balance)} TSH</p>
                </div>
                <div className="glass rounded-xl p-4">
                  <p className="text-white/50 text-xs">Total Spent</p>
                  <p className="text-white font-bold text-lg">{formatCurrency(mockAdsBalance.spent)} TSH</p>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold text-white">Campaign Performance</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="glass rounded-xl p-3">
                    <p className="text-white/50 text-xs">Impressions</p>
                    <p className="text-white font-bold">{formatCurrency(mockAdsBalance.impressions)}</p>
                  </div>
                  <div className="glass rounded-xl p-3">
                    <p className="text-white/50 text-xs">Clicks</p>
                    <p className="text-white font-bold">{formatCurrency(mockAdsBalance.clicks)}</p>
                  </div>
                </div>

                <button className="w-full btn-primary py-3">
                  Create New Campaign
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
