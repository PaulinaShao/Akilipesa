import { useState } from 'react';
import { 
  Users, 
  Video, 
  ShoppingBag, 
  DollarSign, 
  TrendingUp, 
  Activity,
  Settings,
  Shield,
  BarChart3,
  Flag,
  Clock,
  Phone
} from 'lucide-react';

const stats = [
  { title: 'Daily Active Users', value: '45.2K', change: '+12%', icon: Users, color: 'text-blue-400' },
  { title: 'Total Reels', value: '1.2M', change: '+8%', icon: Video, color: 'text-purple-400' },
  { title: 'Watch Time (hrs)', value: '89.5K', change: '+15%', icon: Clock, color: 'text-green-400' },
  { title: 'Orders Today', value: '234', change: '+22%', icon: ShoppingBag, color: 'text-yellow-400' },
  { title: 'Payouts Pending', value: '12.3M TSH', change: '-5%', icon: DollarSign, color: 'text-red-400' },
  { title: 'Live Sessions', value: '45', change: '+18%', icon: Phone, color: 'text-pink-400' },
];

const sidebarItems = [
  { id: 'dashboard', name: 'Dashboard', icon: BarChart3 },
  { id: 'users', name: 'Users', icon: Users },
  { id: 'creators', name: 'Creators & Agents', icon: Activity },
  { id: 'content', name: 'Content Review', icon: Shield },
  { id: 'orders', name: 'Orders & Payouts', icon: DollarSign },
  { id: 'jobs', name: 'AI Jobs', icon: Settings },
  { id: 'live', name: 'Live Sessions', icon: Phone },
  { id: 'analytics', name: 'Analytics', icon: TrendingUp },
  { id: 'flags', name: 'Feature Flags', icon: Flag },
];

const recentUsers = [
  { id: '1', name: 'Amina Hassan', username: 'amina_tz', status: 'active', role: 'creator', joinDate: '2024-01-15' },
  { id: '2', name: 'James Mwangi', username: 'tech_james', status: 'active', role: 'user', joinDate: '2024-01-14' },
  { id: '3', name: 'Fatuma Bakari', username: 'fatuma_style', status: 'pending', role: 'creator', joinDate: '2024-01-13' },
];

const contentQueue = [
  { id: '1', type: 'reel', creator: 'amina_tz', status: 'pending', reports: 2, uploadDate: '2024-01-15' },
  { id: '2', type: 'reel', creator: 'tech_james', status: 'flagged', reports: 5, uploadDate: '2024-01-15' },
  { id: '3', type: 'product', creator: 'fatuma_style', status: 'pending', reports: 0, uploadDate: '2024-01-14' },
];

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="admin-layout">
      <div className="flex h-screen">
        {/* Sidebar */}
        <div className="admin-sidebar">
          <div className="p-6 border-b border-slate-700">
            <h1 className="text-xl font-bold text-white">Admin Console</h1>
            <p className="text-slate-400 text-sm">AkiliPesa Management</p>
          </div>
          
          <nav className="p-4">
            <div className="space-y-2">
              {sidebarItems.map((item) => {
                const IconComponent = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                      activeTab === item.id
                        ? 'bg-primary text-white'
                        : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                    }`}
                  >
                    <IconComponent className="w-5 h-5" />
                    <span className="font-medium">{item.name}</span>
                  </button>
                );
              })}
            </div>
          </nav>
        </div>

        {/* Main Content */}
        <div className="admin-main">
          <div className="p-6">
            {activeTab === 'dashboard' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">Dashboard</h2>
                  <p className="text-slate-400">Overview of platform performance</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {stats.map((stat, index) => {
                    const IconComponent = stat.icon;
                    return (
                      <div key={index} className="admin-card">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-slate-400 text-sm">{stat.title}</p>
                            <p className="text-2xl font-bold text-white">{stat.value}</p>
                            <p className={`text-sm ${stat.change.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                              {stat.change} from yesterday
                            </p>
                          </div>
                          <IconComponent className={`w-8 h-8 ${stat.color}`} />
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Recent Activity */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="admin-card">
                    <h3 className="text-lg font-semibold text-white mb-4">Recent Users</h3>
                    <div className="admin-table">
                      <table className="w-full">
                        <thead>
                          <tr>
                            <th>User</th>
                            <th>Role</th>
                            <th>Status</th>
                            <th>Joined</th>
                          </tr>
                        </thead>
                        <tbody>
                          {recentUsers.map((user) => (
                            <tr key={user.id}>
                              <td>
                                <div>
                                  <div className="font-medium">{user.name}</div>
                                  <div className="text-slate-400 text-sm">@{user.username}</div>
                                </div>
                              </td>
                              <td>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  user.role === 'creator' ? 'bg-purple-500/20 text-purple-400' : 'bg-blue-500/20 text-blue-400'
                                }`}>
                                  {user.role}
                                </span>
                              </td>
                              <td>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  user.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
                                }`}>
                                  {user.status}
                                </span>
                              </td>
                              <td className="text-slate-400">{user.joinDate}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="admin-card">
                    <h3 className="text-lg font-semibold text-white mb-4">Content Review Queue</h3>
                    <div className="admin-table">
                      <table className="w-full">
                        <thead>
                          <tr>
                            <th>Content</th>
                            <th>Creator</th>
                            <th>Reports</th>
                            <th>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {contentQueue.map((item) => (
                            <tr key={item.id}>
                              <td>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  item.type === 'reel' ? 'bg-purple-500/20 text-purple-400' : 'bg-green-500/20 text-green-400'
                                }`}>
                                  {item.type}
                                </span>
                              </td>
                              <td className="font-medium">@{item.creator}</td>
                              <td>
                                <span className={`font-medium ${
                                  item.reports > 3 ? 'text-red-400' : item.reports > 0 ? 'text-yellow-400' : 'text-green-400'
                                }`}>
                                  {item.reports}
                                </span>
                              </td>
                              <td>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  item.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-red-500/20 text-red-400'
                                }`}>
                                  {item.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab !== 'dashboard' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">
                    {sidebarItems.find(item => item.id === activeTab)?.name}
                  </h2>
                  <p className="text-slate-400">Management interface for {activeTab}</p>
                </div>

                <div className="admin-card">
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Settings className="w-8 h-8 text-slate-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">
                      {sidebarItems.find(item => item.id === activeTab)?.name} Panel
                    </h3>
                    <p className="text-slate-400 mb-6">
                      Detailed management interface for {activeTab} would be implemented here
                    </p>
                    <button className="btn-primary">
                      Configure {sidebarItems.find(item => item.id === activeTab)?.name}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
