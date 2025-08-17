import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  Video,
  ShoppingBag,
  DollarSign,
  Settings,
  Shield,
  BarChart3,
  Flag,
  Clock,
  Phone,
  Search,
  Edit,
  Ban,
  CheckCircle,
  XCircle,
  Eye,
  Download,
  Upload,
  MoreHorizontal,
  ArrowLeft,
  AlertTriangle,
  Lock,
  UserX
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { getRoleColor, getRoleDisplayName, type UserRole } from '@/lib/roleGuards';

// Mock admin data - in real app this would come from API
const adminStats = [
  { title: 'Active Users', value: '12.5K', change: '+8.2%', icon: Users, color: 'text-blue-400' },
  { title: 'Content Reports', value: '23', change: '+12%', icon: Flag, color: 'text-red-400' },
  { title: 'Pending Payouts', value: '2.1M TSH', change: '-5%', icon: DollarSign, color: 'text-yellow-400' },
  { title: 'Platform Revenue', value: '45.8M TSH', change: '+15%', icon: BarChart3, color: 'text-green-400' },
];

const platformSettings = [
  { id: 'commission_rate', label: 'Platform Commission', value: '15%', type: 'percentage' },
  { id: 'max_call_duration', label: 'Max Call Duration', value: '2 hours', type: 'duration' },
  { id: 'min_payout_amount', label: 'Minimum Payout', value: '50,000 TSH', type: 'currency' },
  { id: 'content_moderation', label: 'Auto Moderation', value: 'Enabled', type: 'toggle' },
];

const recentUsers = [
  { id: '1', name: 'Amina Hassan', username: 'amina_tz', email: 'amina@example.com', role: 'creator' as UserRole, status: 'active', joinDate: '2024-01-15' },
  { id: '2', name: 'James Mwangi', username: 'tech_james', email: 'james@example.com', role: 'user' as UserRole, status: 'active', joinDate: '2024-01-14' },
  { id: '3', name: 'Sarah Moderator', username: 'sarah_mod', email: 'sarah@akilipesa.com', role: 'moderator' as UserRole, status: 'active', joinDate: '2024-01-10' },
];

const flaggedContent = [
  { id: '1', title: 'Inappropriate content report', type: 'reel', reporter: 'user123', severity: 'high', date: '2024-01-15' },
  { id: '2', title: 'Spam product listing', type: 'product', reporter: 'user456', severity: 'medium', date: '2024-01-15' },
  { id: '3', title: 'Fake information claim', type: 'reel', reporter: 'user789', severity: 'low', date: '2024-01-14' },
];

export default function AdminPage() {
  const navigate = useNavigate();
  const { isAuthenticated, canAccessAdmin, isAdmin, user } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');

  // Check access permissions
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/reels');
      return;
    }

    if (!canAccessAdmin()) {
      navigate('/reels');
      return;
    }
  }, [isAuthenticated, canAccessAdmin, navigate]);

  // Show loading or redirect if no access
  if (!isAuthenticated || !canAccessAdmin()) {
    return (
      <div className="page-root bg-gradient-to-br from-[#0b0c14] to-[#2b1769] flex items-center justify-center">
        <div className="text-center">
          <Lock className="w-16 h-16 text-white/60 mx-auto mb-4" />
          <h2 className="text-white text-xl font-semibold mb-2">Access Restricted</h2>
          <p className="text-white/60 mb-4">You don't have permission to access the admin console.</p>
          <button
            onClick={() => navigate('/reels')}
            className="px-6 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg transition-colors"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'dashboard', name: 'Dashboard', icon: BarChart3 },
    { id: 'users', name: 'Users', icon: Users },
    { id: 'content', name: 'Content', icon: Shield },
    ...(isAdmin() ? [{ id: 'settings', name: 'Settings', icon: Settings }] : []),
  ];

  const handleUserAction = (userId: string, action: string) => {
    console.log(`Admin action: ${action} user ${userId}`);
    // In real app, this would call an API
  };

  const handleContentAction = (contentId: string, action: string) => {
    console.log(`Admin action: ${action} content ${contentId}`);
    // In real app, this would call an API
  };

  const handleSettingChange = (settingId: string, newValue: string) => {
    console.log(`Admin setting: ${settingId} = ${newValue}`);
    // In real app, this would call an API
  };

  return (
    <div className="page-root bg-gradient-to-br from-[#0b0c14] to-[#2b1769]">
      {/* Header */}
      <div className="safe-top p-4 border-b border-white/10 sticky top-0 bg-black/20 backdrop-blur-md z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/reels')}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <h1 className="text-2xl font-bold text-white">Admin Console</h1>
          </div>
          
          <div className="flex items-center gap-2">
            <div className={cn(
              "px-3 py-1 rounded-full text-xs font-medium border",
              getRoleColor(user!.role),
              user!.role === 'admin' ? 'bg-red-500/20 border-red-500/30' : 'bg-orange-500/20 border-orange-500/30'
            )}>
              {getRoleDisplayName(user!.role)}
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="p-4 border-b border-white/10">
        <div className="flex gap-1 bg-white/5 rounded-lg p-1">
          {tabs.map((tab) => {
            const IconComponent = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm font-medium transition-all",
                  activeTab === tab.id
                    ? "bg-violet-600 text-white"
                    : "text-white/60 hover:text-white hover:bg-white/10"
                )}
              >
                <IconComponent className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="p-4">
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {adminStats.map((stat) => {
                const IconComponent = stat.icon;
                return (
                  <div key={stat.title} className="bg-white/5 border border-white/10 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <IconComponent className={cn("w-5 h-5", stat.color)} />
                      <span className={cn(
                        "text-xs font-medium",
                        stat.change.startsWith('+') ? 'text-green-400' : 'text-red-400'
                      )}>
                        {stat.change}
                      </span>
                    </div>
                    <h3 className="text-white font-semibold text-lg">{stat.value}</h3>
                    <p className="text-white/60 text-sm">{stat.title}</p>
                  </div>
                );
              })}
            </div>

            {/* Recent Activity */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                <Flag className="w-5 h-5 text-red-400" />
                Content Requiring Attention
              </h3>
              <div className="space-y-3">
                {flaggedContent.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                    <div className="flex-1">
                      <h4 className="text-white font-medium">{item.title}</h4>
                      <p className="text-white/60 text-sm">
                        {item.type} • Reported by {item.reporter} • {item.date}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={cn(
                        "px-2 py-1 rounded-full text-xs font-medium",
                        item.severity === 'high' ? 'bg-red-500/20 text-red-300' :
                        item.severity === 'medium' ? 'bg-yellow-500/20 text-yellow-300' :
                        'bg-blue-500/20 text-blue-300'
                      )}>
                        {item.severity}
                      </span>
                      <button
                        onClick={() => handleContentAction(item.id, 'review')}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                      >
                        <Eye className="w-4 h-4 text-white/60" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="space-y-6">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search users..."
                className="w-full bg-white/5 border border-white/20 rounded-xl pl-10 pr-4 py-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>

            {/* Users List */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <h3 className="text-white font-semibold mb-4">Recent Users</h3>
              <div className="space-y-3">
                {recentUsers.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-violet-500 to-purple-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-medium text-sm">
                          {user.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <h4 className="text-white font-medium">{user.name}</h4>
                        <p className="text-white/60 text-sm">@{user.username} • {user.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={cn(
                        "px-2 py-1 rounded-full text-xs font-medium",
                        getRoleColor(user.role).replace('text-', 'bg-').replace('-400', '-500/20'),
                        getRoleColor(user.role).replace('-400', '-300')
                      )}>
                        {getRoleDisplayName(user.role)}
                      </span>
                      <span className={cn(
                        "px-2 py-1 rounded-full text-xs font-medium",
                        user.status === 'active' ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'
                      )}>
                        {user.status}
                      </span>
                      {isAdmin() && (
                        <button
                          onClick={() => handleUserAction(user.id, 'edit')}
                          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                        >
                          <Edit className="w-4 h-4 text-white/60" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'content' && (
          <div className="space-y-6">
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <h3 className="text-white font-semibold mb-4">Content Moderation Queue</h3>
              <div className="space-y-3">
                {flaggedContent.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                    <div className="flex-1">
                      <h4 className="text-white font-medium">{item.title}</h4>
                      <p className="text-white/60 text-sm mb-2">
                        Type: {item.type} • Severity: {item.severity} • Date: {item.date}
                      </p>
                      <p className="text-white/40 text-xs">Reported by: {item.reporter}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleContentAction(item.id, 'approve')}
                        className="p-2 bg-green-500/20 hover:bg-green-500/30 text-green-300 rounded-lg transition-colors"
                      >
                        <CheckCircle className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleContentAction(item.id, 'reject')}
                        className="p-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg transition-colors"
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleContentAction(item.id, 'view')}
                        className="p-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 rounded-lg transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'settings' && isAdmin() && (
          <div className="space-y-6">
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Platform Settings
              </h3>
              <div className="space-y-4">
                {platformSettings.map((setting) => (
                  <div key={setting.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                    <div>
                      <h4 className="text-white font-medium">{setting.label}</h4>
                      <p className="text-white/60 text-sm">Current: {setting.value}</p>
                    </div>
                    <button
                      onClick={() => handleSettingChange(setting.id, setting.value)}
                      className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    >
                      <Edit className="w-4 h-4 text-white/60" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6">
              <h3 className="text-red-300 font-semibold mb-4 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Danger Zone
              </h3>
              <div className="space-y-3">
                <button className="w-full p-3 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-300 rounded-lg transition-colors text-left">
                  Export All User Data
                </button>
                <button className="w-full p-3 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-300 rounded-lg transition-colors text-left">
                  Reset Platform Statistics
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
