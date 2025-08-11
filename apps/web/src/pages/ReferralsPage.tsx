import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Users, 
  Gift, 
  Share, 
  Copy, 
  DollarSign,
  TrendingUp,
  Calendar,
  Star,
  CheckCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ReferralData {
  referralCode: string;
  totalReferrals: number;
  totalEarnings: number;
  thisMonthEarnings: number;
  pendingEarnings: number;
  conversionRate: number;
  tier: string;
  nextTierRequirement: number;
}

interface ReferralTier {
  name: string;
  requirement: number;
  commission: number;
  bonus: number;
  perks: string[];
}

interface Referral {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  status: 'pending' | 'active' | 'premium';
  joinDate: Date;
  earnings: number;
  isActive: boolean;
}

const mockReferralData: ReferralData = {
  referralCode: 'PAULINA2024',
  totalReferrals: 24,
  totalEarnings: 120000,
  thisMonthEarnings: 35000,
  pendingEarnings: 8500,
  conversionRate: 68.5,
  tier: 'Gold',
  nextTierRequirement: 26,
};

const referralTiers: ReferralTier[] = [
  {
    name: 'Bronze',
    requirement: 5,
    commission: 10,
    bonus: 5000,
    perks: ['Basic commission', 'Welcome bonus'],
  },
  {
    name: 'Silver',
    requirement: 15,
    commission: 15,
    bonus: 15000,
    perks: ['Higher commission', 'Monthly bonus', 'Priority support'],
  },
  {
    name: 'Gold',
    requirement: 25,
    commission: 20,
    bonus: 30000,
    perks: ['Premium commission', 'Exclusive rewards', 'VIP status'],
  },
  {
    name: 'Platinum',
    requirement: 50,
    commission: 25,
    bonus: 50000,
    perks: ['Maximum commission', 'Special recognition', 'Early access'],
  },
];

const mockReferrals: Referral[] = [
  {
    id: '1',
    username: 'jane_doe',
    displayName: 'Jane Doe',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b9d38aad?w=150&h=150&fit=crop&crop=face',
    status: 'premium',
    joinDate: new Date('2024-01-05'),
    earnings: 15000,
    isActive: true,
  },
  {
    id: '2',
    username: 'michael_tech',
    displayName: 'Michael Tech',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    status: 'active',
    joinDate: new Date('2024-01-12'),
    earnings: 8500,
    isActive: true,
  },
  {
    id: '3',
    username: 'sarah_creative',
    displayName: 'Sarah Creative',
    avatar: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=150&h=150&fit=crop&crop=face',
    status: 'pending',
    joinDate: new Date('2024-01-18'),
    earnings: 0,
    isActive: false,
  },
];

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('sw-TZ', {
    style: 'currency',
    currency: 'TSH',
    minimumFractionDigits: 0,
  }).format(amount);
}

function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function getStatusIcon(status: Referral['status']) {
  switch (status) {
    case 'premium':
      return <Star className="w-4 h-4 text-yellow-400 fill-current" />;
    case 'active':
      return <CheckCircle className="w-4 h-4 text-green-400" />;
    case 'pending':
      return <Calendar className="w-4 h-4 text-orange-400" />;
    default:
      return <Users className="w-4 h-4 text-gray-400" />;
  }
}

function getStatusColor(status: Referral['status']) {
  switch (status) {
    case 'premium':
      return 'text-yellow-400';
    case 'active':
      return 'text-green-400';
    case 'pending':
      return 'text-orange-400';
    default:
      return 'text-gray-400';
  }
}

function getTierColor(tier: string) {
  switch (tier) {
    case 'Bronze':
      return 'text-orange-600';
    case 'Silver':
      return 'text-gray-400';
    case 'Gold':
      return 'text-yellow-400';
    case 'Platinum':
      return 'text-purple-400';
    default:
      return 'text-gray-400';
  }
}

export default function ReferralsPage() {
  const navigate = useNavigate();
  const [referralData] = useState<ReferralData>(mockReferralData);
  const [referrals] = useState<Referral[]>(mockReferrals);
  const [selectedTab, setSelectedTab] = useState<'overview' | 'referrals' | 'tiers'>('overview');

  const currentTier = referralTiers.find(tier => tier.name === referralData.tier);
  const nextTier = referralTiers.find(tier => tier.requirement > referralData.totalReferrals);
  const progress = nextTier ? (referralData.totalReferrals / nextTier.requirement) * 100 : 100;

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(referralData.referralCode);
      // Show success toast
      console.log('Referral code copied!');
    } catch (err) {
      console.error('Failed to copy code');
    }
  };

  const handleShare = () => {
    const shareText = `Join AkiliPesa with my referral code: ${referralData.referralCode}`;
    const shareUrl = `https://akilipesa.com/signup?ref=${referralData.referralCode}`;
    
    if (navigator.share) {
      navigator.share({
        title: 'Join AkiliPesa',
        text: shareText,
        url: shareUrl,
      });
    } else {
      // Fallback - copy to clipboard
      navigator.clipboard.writeText(`${shareText} - ${shareUrl}`);
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'referrals', label: 'My Referrals' },
    { id: 'tiers', label: 'Tiers' },
  ];

  return (
    <div className="h-screen-safe bg-gem-dark overflow-y-auto">
      {/* Header */}
      <div className="safe-top p-4 border-b border-white/10 sticky top-0 bg-gem-dark/95 backdrop-blur-sm z-10">
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-white">Referral Program</h1>
            <p className="text-sm text-white/60">Earn by inviting friends</p>
          </div>
          <button 
            onClick={handleShare}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <Share className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-white/10">
        <div className="flex overflow-x-auto hide-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id as typeof selectedTab)}
              className={cn(
                "flex items-center space-x-2 px-6 py-3 whitespace-nowrap transition-all border-b-2",
                selectedTab === tab.id
                  ? "text-accent-400 border-accent-400"
                  : "text-white/60 border-transparent hover:text-white"
              )}
            >
              <span className="font-medium">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {selectedTab === 'overview' && (
          <div className="space-y-6">
            {/* Referral Code */}
            <div className="card-gem p-4">
              <h3 className="text-white font-semibold mb-4 text-center">Your Referral Code</h3>
              <div className="bg-white/10 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-accent-400 mb-2">
                  {referralData.referralCode}
                </div>
                <div className="flex space-x-2">
                  <button 
                    onClick={handleCopyCode}
                    className="flex-1 btn-gem-outline py-2 flex items-center justify-center space-x-2"
                  >
                    <Copy className="w-4 h-4" />
                    <span>Copy</span>
                  </button>
                  <button 
                    onClick={handleShare}
                    className="flex-1 btn-gem py-2 flex items-center justify-center space-x-2"
                  >
                    <Share className="w-4 h-4" />
                    <span>Share</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-2 gap-4">
              <div className="card-gem p-4 text-center">
                <div className="text-2xl font-bold text-white mb-1">
                  {referralData.totalReferrals}
                </div>
                <div className="text-white/60 text-sm">Total Referrals</div>
              </div>
              <div className="card-gem p-4 text-center">
                <div className="text-2xl font-bold text-green-400 mb-1">
                  {formatCurrency(referralData.totalEarnings)}
                </div>
                <div className="text-white/60 text-sm">Total Earned</div>
              </div>
            </div>

            {/* Current Tier */}
            <div className="card-gem p-4">
              <h3 className="text-white font-semibold mb-3">Current Tier</h3>
              <div className="flex items-center space-x-4 mb-4">
                <div className={cn('text-2xl font-bold', getTierColor(referralData.tier))}>
                  {referralData.tier}
                </div>
                {currentTier && (
                  <div className="text-white/60 text-sm">
                    {currentTier.commission}% commission
                  </div>
                )}
              </div>
              
              {nextTier && (
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-white/60">Progress to {nextTier.name}</span>
                    <span className="text-white">{referralData.totalReferrals}/{nextTier.requirement}</span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-accent-400 to-accent-600 h-2 rounded-full"
                      style={{ width: `${Math.min(progress, 100)}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* This Month */}
            <div className="grid grid-cols-2 gap-4">
              <div className="card-gem p-4 text-center">
                <div className="text-xl font-bold text-accent-400 mb-1">
                  {formatCurrency(referralData.thisMonthEarnings)}
                </div>
                <div className="text-white/60 text-sm">This Month</div>
              </div>
              <div className="card-gem p-4 text-center">
                <div className="text-xl font-bold text-yellow-400 mb-1">
                  {formatCurrency(referralData.pendingEarnings)}
                </div>
                <div className="text-white/60 text-sm">Pending</div>
              </div>
            </div>
          </div>
        )}

        {selectedTab === 'referrals' && (
          <div className="space-y-4">
            {referrals.length > 0 ? (
              referrals.map((referral) => (
                <div key={referral.id} className="card-gem p-4">
                  <div className="flex items-center space-x-4">
                    <img
                      src={referral.avatar}
                      alt={referral.displayName}
                      className="w-12 h-12 rounded-full"
                    />
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-white font-medium text-sm">
                          {referral.displayName}
                        </span>
                        {getStatusIcon(referral.status)}
                      </div>
                      <div className="text-white/60 text-xs">
                        @{referral.username} • Joined {formatDate(referral.joinDate)}
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-accent-400 font-bold text-sm">
                        {formatCurrency(referral.earnings)}
                      </div>
                      <div className={cn('text-xs capitalize', getStatusColor(referral.status))}>
                        {referral.status}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-16">
                <div className="w-20 h-20 bg-white/10 rounded-full flex-center mx-auto mb-4">
                  <Users className="w-10 h-10 text-white/40" />
                </div>
                <h3 className="text-white font-semibold mb-2">No referrals yet</h3>
                <p className="text-white/60 text-sm mb-6">
                  Start inviting friends to earn commissions
                </p>
                <button 
                  onClick={handleShare}
                  className="btn-gem px-6 py-3"
                >
                  Invite Friends
                </button>
              </div>
            )}
          </div>
        )}

        {selectedTab === 'tiers' && (
          <div className="space-y-4">
            {referralTiers.map((tier) => {
              const isCurrentTier = tier.name === referralData.tier;
              const isUnlocked = referralData.totalReferrals >= tier.requirement;
              
              return (
                <div 
                  key={tier.name} 
                  className={cn(
                    'card-gem p-4 border-2',
                    isCurrentTier ? 'border-accent-500' : 'border-transparent'
                  )}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className={cn('text-xl font-bold', getTierColor(tier.name))}>
                        {tier.name}
                      </div>
                      {isCurrentTier && (
                        <span className="px-2 py-1 bg-accent-500 text-white text-xs rounded-full">
                          Current
                        </span>
                      )}
                    </div>
                    <div className="text-white/60 text-sm">
                      {tier.requirement} referrals
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="text-center">
                      <div className="text-lg font-bold text-green-400">
                        {tier.commission}%
                      </div>
                      <div className="text-white/60 text-xs">Commission</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-yellow-400">
                        {formatCurrency(tier.bonus)}
                      </div>
                      <div className="text-white/60 text-xs">Tier Bonus</div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    {tier.perks.map((perk, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        <span className="text-white/80 text-sm">{perk}</span>
                      </div>
                    ))}
                  </div>
                  
                  {!isUnlocked && (
                    <div className="mt-4 text-center">
                      <div className="text-white/60 text-sm">
                        {tier.requirement - referralData.totalReferrals} more referrals to unlock
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
