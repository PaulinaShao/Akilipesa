import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  Eye,
  Heart,
  MessageCircle,
  Users,
  Download
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface AnalyticsData {
  overview: {
    totalViews: number;
    totalLikes: number;
    totalComments: number;
    totalShares: number;
    followers: number;
    engagement: number;
  };
  growth: {
    views: number;
    likes: number;
    comments: number;
    followers: number;
  };
  topContent: Array<{
    id: string;
    title: string;
    type: 'video' | 'image';
    views: number;
    likes: number;
    engagement: number;
    thumbnail: string;
  }>;
  audience: {
    demographics: Array<{
      age: string;
      percentage: number;
    }>;
    locations: Array<{
      country: string;
      percentage: number;
    }>;
    activeHours: Array<{
      hour: number;
      activity: number;
    }>;
  };
}

const mockAnalyticsData: AnalyticsData = {
  overview: {
    totalViews: 2450000,
    totalLikes: 185000,
    totalComments: 42000,
    totalShares: 18500,
    followers: 125000,
    engagement: 7.8,
  },
  growth: {
    views: 12.5,
    likes: 8.3,
    comments: -2.1,
    followers: 15.7,
  },
  topContent: [
    {
      id: '1',
      title: 'Traditional Dance Tutorial',
      type: 'video',
      views: 450000,
      likes: 35000,
      engagement: 8.9,
      thumbnail: 'https://images.unsplash.com/photo-1533929736458-ca588d08c8be?w=300&h=300&fit=crop',
    },
    {
      id: '2',
      title: 'Fashion Inspiration',
      type: 'image',
      views: 320000,
      likes: 28000,
      engagement: 9.2,
      thumbnail: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=300&h=300&fit=crop',
    },
    {
      id: '3',
      title: 'Tech Tips & Tricks',
      type: 'video',
      views: 280000,
      likes: 22000,
      engagement: 7.6,
      thumbnail: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=300&fit=crop',
    },
  ],
  audience: {
    demographics: [
      { age: '18-24', percentage: 35 },
      { age: '25-34', percentage: 42 },
      { age: '35-44', percentage: 18 },
      { age: '45+', percentage: 5 },
    ],
    locations: [
      { country: 'Tanzania', percentage: 65 },
      { country: 'Kenya', percentage: 15 },
      { country: 'Uganda', percentage: 12 },
      { country: 'Rwanda', percentage: 8 },
    ],
    activeHours: [
      { hour: 0, activity: 5 },
      { hour: 6, activity: 15 },
      { hour: 12, activity: 45 },
      { hour: 18, activity: 85 },
      { hour: 21, activity: 65 },
    ],
  },
};

function formatNumber(num: number): string {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
}

function formatPercentage(num: number): string {
  return `${num >= 0 ? '+' : ''}${num.toFixed(1)}%`;
}

export default function AnalyticsPage() {
  const navigate = useNavigate();
  const [analyticsData] = useState<AnalyticsData>(mockAnalyticsData);
  const [selectedPeriod, setSelectedPeriod] = useState<'7d' | '30d' | '90d'>('30d');
  const [selectedTab, setSelectedTab] = useState<'overview' | 'content' | 'audience'>('overview');

  const handleExportData = () => {
    console.log('Export analytics data');
  };

  const metrics = [
    {
      label: 'Total Views',
      value: analyticsData.overview.totalViews,
      growth: analyticsData.growth.views,
      icon: Eye,
      color: 'text-blue-400',
    },
    {
      label: 'Total Likes',
      value: analyticsData.overview.totalLikes,
      growth: analyticsData.growth.likes,
      icon: Heart,
      color: 'text-red-400',
    },
    {
      label: 'Comments',
      value: analyticsData.overview.totalComments,
      growth: analyticsData.growth.comments,
      icon: MessageCircle,
      color: 'text-green-400',
    },
    {
      label: 'Followers',
      value: analyticsData.overview.followers,
      growth: analyticsData.growth.followers,
      icon: Users,
      color: 'text-purple-400',
    },
  ];

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'content', label: 'Content' },
    { id: 'audience', label: 'Audience' },
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
            <h1 className="text-xl font-bold text-white">Analytics</h1>
            <p className="text-sm text-white/60">Track your performance and growth</p>
          </div>
          <button 
            onClick={handleExportData}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <Download className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>

      {/* Period Selector */}
      <div className="p-4 border-b border-white/10">
        <div className="flex space-x-2">
          {(['7d', '30d', '90d'] as const).map((period) => (
            <button
              key={period}
              onClick={() => setSelectedPeriod(period)}
              className={cn(
                'px-4 py-2 rounded-lg text-sm font-medium transition-all',
                selectedPeriod === period
                  ? 'bg-accent-500 text-white'
                  : 'bg-white/10 text-white/60 hover:bg-white/20'
              )}
            >
              {period === '7d' ? 'Last 7 days' : period === '30d' ? 'Last 30 days' : 'Last 90 days'}
            </button>
          ))}
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
            {/* Key Metrics */}
            <div className="grid grid-cols-2 gap-4">
              {metrics.map((metric) => {
                const IconComponent = metric.icon;
                return (
                  <div key={metric.label} className="card-gem p-4">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className={cn('w-8 h-8 rounded-full bg-white/10 flex-center', metric.color)}>
                        <IconComponent className="w-4 h-4" />
                      </div>
                      <span className="text-white/60 text-sm">{metric.label}</span>
                    </div>
                    <div className="text-2xl font-bold text-white mb-1">
                      {formatNumber(metric.value)}
                    </div>
                    <div className={cn(
                      'text-sm flex items-center space-x-1',
                      metric.growth >= 0 ? 'text-green-400' : 'text-red-400'
                    )}>
                      {metric.growth >= 0 ? (
                        <TrendingUp className="w-3 h-3" />
                      ) : (
                        <TrendingDown className="w-3 h-3" />
                      )}
                      <span>{formatPercentage(metric.growth)}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Engagement Rate */}
            <div className="card-gem p-4">
              <h3 className="text-white font-semibold mb-3">Engagement Rate</h3>
              <div className="text-center">
                <div className="text-3xl font-bold text-accent-400 mb-2">
                  {analyticsData.overview.engagement.toFixed(1)}%
                </div>
                <div className="text-white/60 text-sm">Average engagement across all content</div>
              </div>
            </div>
          </div>
        )}

        {selectedTab === 'content' && (
          <div className="space-y-6">
            {/* Top Performing Content */}
            <div className="card-gem p-4">
              <h3 className="text-white font-semibold mb-4">Top Performing Content</h3>
              <div className="space-y-3">
                {analyticsData.topContent.map((content, index) => (
                  <div key={content.id} className="flex items-center space-x-4 p-3 bg-white/5 rounded-lg">
                    <div className="text-accent-400 font-bold text-sm w-6">
                      #{index + 1}
                    </div>
                    <div className="w-12 h-12 bg-white/10 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={content.thumbnail}
                        alt={content.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-white font-medium text-sm truncate">
                        {content.title}
                      </div>
                      <div className="flex items-center space-x-4 text-white/60 text-xs">
                        <span className="flex items-center space-x-1">
                          <Eye className="w-3 h-3" />
                          <span>{formatNumber(content.views)}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Heart className="w-3 h-3" />
                          <span>{formatNumber(content.likes)}</span>
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-green-400 font-bold text-sm">
                        {content.engagement.toFixed(1)}%
                      </div>
                      <div className="text-white/60 text-xs">engagement</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {selectedTab === 'audience' && (
          <div className="space-y-6">
            {/* Demographics */}
            <div className="card-gem p-4">
              <h3 className="text-white font-semibold mb-4">Age Demographics</h3>
              <div className="space-y-3">
                {analyticsData.audience.demographics.map((demo) => (
                  <div key={demo.age} className="flex items-center space-x-3">
                    <div className="text-white font-medium text-sm w-16">
                      {demo.age}
                    </div>
                    <div className="flex-1 bg-white/20 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-accent-400 to-accent-600 h-2 rounded-full"
                        style={{ width: `${demo.percentage}%` }}
                      />
                    </div>
                    <div className="text-white/60 text-sm w-12 text-right">
                      {demo.percentage}%
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Locations */}
            <div className="card-gem p-4">
              <h3 className="text-white font-semibold mb-4">Top Locations</h3>
              <div className="space-y-3">
                {analyticsData.audience.locations.map((location) => (
                  <div key={location.country} className="flex items-center justify-between">
                    <span className="text-white font-medium text-sm">
                      {location.country}
                    </span>
                    <span className="text-accent-400 font-bold text-sm">
                      {location.percentage}%
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Peak Activity Hours */}
            <div className="card-gem p-4">
              <h3 className="text-white font-semibold mb-4">Peak Activity Hours</h3>
              <div className="flex items-end space-x-2 h-32">
                {analyticsData.audience.activeHours.map((hour) => (
                  <div key={hour.hour} className="flex-1 flex flex-col items-center">
                    <div
                      className="bg-gradient-to-t from-accent-400 to-accent-600 w-full rounded-t"
                      style={{ height: `${hour.activity}%` }}
                    />
                    <div className="text-white/60 text-xs mt-2">
                      {hour.hour}:00
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
