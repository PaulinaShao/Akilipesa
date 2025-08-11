import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Settings,
  Share,
  Grid3x3,
  Bookmark,
  ShoppingBag,
  DollarSign,
  Star,
  Users,
  Sparkles,
  TrendingUp,
  Award,
  Gift
} from 'lucide-react';
import { cn } from '@/lib/utils';
import ShareModal from '@/components/ShareModal';
import ProfileSettingsModal from '@/components/ProfileSettingsModal';

const profileData = {
  user: {
    id: 'current-user',
    username: 'your_username',
    name: 'Your Name',
    bio: 'Content creator & entrepreneur 🚀\nBuilding with AI in Tanzania 🇹���\nTech • Fashion • Culture',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face',
    verified: true,
    isLive: false,
  },
  stats: {
    followers: 125000,
    following: 1250,
    likes: 2450000,
    views: 15600000,
  },
  earnings: {
    total: 2450000, // TSH
    thisMonth: 380000,
    lastMonth: 420000,
    currency: 'TSH',
  },
  loyalty: {
    stars: 4.8,
    level: 'Gold Creator',
    nextLevel: 'Platinum Creator',
    progress: 75,
  },
  referrals: {
    count: 24,
    earnings: 120000,
    bonus: 50000,
  },
  clones: [
    {
      id: '1',
      name: 'Fashion Advisor',
      type: 'Fashion & Style',
      status: 'active',
      earnings: 45000,
      interactions: 1200,
    },
    {
      id: '2', 
      name: 'Business Mentor',
      type: 'Entrepreneurship',
      status: 'active',
      earnings: 78000,
      interactions: 850,
    },
  ],
};

const tabs = [
  { id: 'posts', name: 'Posts', icon: Grid3x3 },
  { id: 'saved', name: 'Saved', icon: Bookmark },
  { id: 'purchases', name: 'Purchases', icon: ShoppingBag },
  { id: 'earnings', name: 'Earnings', icon: DollarSign },
  { id: 'clones', name: 'My Clones', icon: Sparkles },
];

const mockPosts = Array.from({ length: 12 }, (_, i) => ({
  id: i + 1,
  thumbnail: `https://images.unsplash.com/photo-${1500000000000 + i}?w=300&h=300&fit=crop`,
  views: Math.floor(Math.random() * 100000) + 10000,
  likes: Math.floor(Math.random() * 10000) + 1000,
  type: Math.random() > 0.5 ? 'video' : 'image',
}));

function formatNumber(num: number): string {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('sw-TZ', {
    style: 'currency',
    currency: 'TSH',
    minimumFractionDigits: 0,
  }).format(amount);
}

export default function ProfilePage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('posts');
  const [showShareModal, setShowShareModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  return (
    <div className="h-screen-safe bg-gem-dark overflow-y-auto">
      {/* Profile Header */}
      <div className="safe-top p-4 border-b border-white/10">
        <div className="flex-between mb-4">
          <h1 className="text-xl font-bold text-white">@{profileData.user.username}</h1>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowShareModal(true)}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <Share className="w-5 h-5 text-white" />
            </button>
            <button
              onClick={() => navigate('/settings')}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <Settings className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        {/* Profile Info */}
        <div className="flex items-start space-x-4 mb-4">
          <div className="relative">
            <img
              src={profileData.user.avatar}
              alt={profileData.user.name}
              className="w-20 h-20 rounded-full border-2 border-accent-400/50"
            />
            {profileData.user.verified && (
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-accent-500 rounded-full flex-center border-2 border-gem-dark">
                <div className="w-3 h-3 bg-white rounded-full" />
              </div>
            )}
          </div>
          
          <div className="flex-1">
            <h2 className="text-white font-bold text-xl mb-1">{profileData.user.name}</h2>
            <p className="text-white/80 text-sm leading-relaxed whitespace-pre-line">
              {profileData.user.bio}
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-4">
          {[
            {
              label: 'Followers',
              value: formatNumber(profileData.stats.followers),
              clickable: true,
              route: `/profile/${profileData.user.id}/followers?tab=followers`
            },
            {
              label: 'Following',
              value: formatNumber(profileData.stats.following),
              clickable: true,
              route: `/profile/${profileData.user.id}/followers?tab=following`
            },
            { label: 'Likes', value: formatNumber(profileData.stats.likes) },
            { label: 'Views', value: formatNumber(profileData.stats.views) },
          ].map((stat) => (
            <button
              key={stat.label}
              className={`text-center ${stat.clickable ? 'hover:bg-white/10 rounded-lg p-2 transition-colors' : 'p-2'}`}
              onClick={stat.clickable ? () => navigate(stat.route!) : undefined}
              disabled={!stat.clickable}
            >
              <div className="text-white font-bold text-lg">{stat.value}</div>
              <div className="text-white/60 text-xs">{stat.label}</div>
            </button>
          ))}
        </div>

        {/* Loyalty Status */}
        <div className="card-gem p-3 mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-yellow-500 rounded-full flex-center">
              <Award className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <span className="text-white font-semibold">{profileData.loyalty.level}</span>
                <div className="flex items-center space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className="w-3 h-3 text-yellow-400 fill-current"
                    />
                  ))}
                  <span className="text-white/80 text-sm">({profileData.loyalty.stars})</span>
                </div>
              </div>
              <div className="w-full bg-white/20 rounded-full h-1.5 mt-1">
                <div
                  className="bg-gradient-to-r from-yellow-400 to-yellow-600 h-1.5 rounded-full"
                  style={{ width: `${profileData.loyalty.progress}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => navigate('/analytics')}
            className="btn-gem py-3 flex items-center justify-center space-x-2"
          >
            <TrendingUp className="w-5 h-5" />
            <span>Analytics</span>
          </button>
          <button
            onClick={() => navigate('/referrals')}
            className="btn-gem-outline py-3 flex items-center justify-center space-x-2"
          >
            <Gift className="w-5 h-5" />
            <span>Referrals</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-white/10">
        <div className="flex overflow-x-auto hide-scrollbar">
          {tabs.map((tab) => {
            const IconComponent = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  if (tab.id === 'saved') {
                    navigate('/saved-posts');
                  } else if (tab.id === 'purchases') {
                    navigate('/purchases');
                  } else if (tab.id === 'earnings') {
                    navigate('/earnings');
                  } else {
                    setActiveTab(tab.id);
                  }
                }}
                className={cn(
                  "flex items-center space-x-2 px-4 py-3 whitespace-nowrap transition-all border-b-2",
                  activeTab === tab.id
                    ? "text-accent-400 border-accent-400"
                    : "text-white/60 border-transparent hover:text-white"
                )}
              >
                <IconComponent className="w-4 h-4" />
                <span className="text-sm font-medium">{tab.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div className="p-4">
        {activeTab === 'posts' && (
          <div className="profile-grid">
            {mockPosts.map((post) => (
              <div key={post.id} className="profile-grid-item cursor-pointer">
                <img
                  src={post.thumbnail}
                  alt={`Post ${post.id}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        )}

        {activeTab === 'earnings' && (
          <div className="space-y-4">
            {/* Earnings Overview */}
            <div className="grid grid-cols-2 gap-4">
              <div className="card-gem p-4 text-center">
                <div className="text-2xl font-bold text-green-400">
                  {formatCurrency(profileData.earnings.thisMonth)}
                </div>
                <div className="text-white/60 text-sm">This Month</div>
              </div>
              <div className="card-gem p-4 text-center">
                <div className="text-2xl font-bold text-white">
                  {formatCurrency(profileData.earnings.total)}
                </div>
                <div className="text-white/60 text-sm">Total Earned</div>
              </div>
            </div>

            {/* Referral Earnings */}
            <div className="card-gem p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-white font-semibold flex items-center space-x-2">
                  <Users className="w-5 h-5 text-accent-400" />
                  <span>Referral Program</span>
                </h3>
                <button
                  onClick={() => navigate('/referrals')}
                  className="text-accent-400 hover:text-accent-300 text-sm font-medium transition-colors"
                >
                  View All
                </button>
              </div>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-xl font-bold text-white">{profileData.referrals.count}</div>
                  <div className="text-white/60 text-xs">Referrals</div>
                </div>
                <div>
                  <div className="text-xl font-bold text-accent-400">
                    {formatCurrency(profileData.referrals.earnings)}
                  </div>
                  <div className="text-white/60 text-xs">Earned</div>
                </div>
                <div>
                  <div className="text-xl font-bold text-green-400">
                    {formatCurrency(profileData.referrals.bonus)}
                  </div>
                  <div className="text-white/60 text-xs">Bonus</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'clones' && (
          <div className="space-y-4">
            <div className="flex-between">
              <h3 className="text-white font-semibold">My AI Clones</h3>
              <button className="btn-gem text-sm px-4 py-2">Create Clone</button>
            </div>

            {profileData.clones.map((clone) => (
              <div key={clone.id} className="card-gem p-4">
                <div className="flex-between mb-3">
                  <div>
                    <h4 className="text-white font-semibold">{clone.name}</h4>
                    <p className="text-white/60 text-sm">{clone.type}</p>
                  </div>
                  <div className={cn(
                    "px-2 py-1 rounded-full text-xs font-medium",
                    clone.status === 'active' 
                      ? "bg-green-500/20 text-green-400"
                      : "bg-red-500/20 text-red-400"
                  )}>
                    {clone.status}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-lg font-bold text-accent-400">
                      {formatCurrency(clone.earnings)}
                    </div>
                    <div className="text-white/60 text-xs">Earnings</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-white">
                      {formatNumber(clone.interactions)}
                    </div>
                    <div className="text-white/60 text-xs">Interactions</div>
                  </div>
                </div>

                <div className="flex space-x-2 mt-3">
                  <button className="flex-1 btn-gem-outline text-sm py-2">Configure</button>
                  <button className="flex-1 btn-gem text-sm py-2">Analytics</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Saved and Purchases tabs now navigate to dedicated pages */}
      </div>

      {/* Modals */}
      <ShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        username={profileData.user.username}
      />

      <ProfileSettingsModal
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
        isOwnProfile={true}
        username={profileData.user.username}
      />
    </div>
  );
}
