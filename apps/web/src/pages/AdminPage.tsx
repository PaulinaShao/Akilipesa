import { useState } from 'react';
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
  ArrowLeft
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
  { id: 'content', name: 'Content', icon: Shield },
  { id: 'commerce', name: 'Commerce', icon: ShoppingBag },
  { id: 'calls', name: 'Calls', icon: Phone },
  { id: 'payments', name: 'Payments', icon: DollarSign },
  { id: 'settings', name: 'Settings', icon: Settings },
];

const mockUsers = [
  { id: '1', name: 'Amina Hassan', username: 'amina_tz', email: 'amina@example.com', status: 'active', role: 'creator', plan: 'premium', balance: '45,600 TSH', joinDate: '2024-01-15', followers: '125K' },
  { id: '2', name: 'James Mwangi', username: 'tech_james', email: 'james@example.com', status: 'active', role: 'user', plan: 'free', balance: '8,900 TSH', joinDate: '2024-01-14', followers: '89K' },
  { id: '3', name: 'Fatuma Bakari', username: 'fatuma_style', email: 'fatuma@example.com', status: 'suspended', role: 'creator', plan: 'starter', balance: '23,400 TSH', joinDate: '2024-01-13', followers: '156K' },
  { id: '4', name: 'Michael Safari', username: 'safari_mike', email: 'mike@example.com', status: 'pending', role: 'user', plan: 'free', balance: '1,200 TSH', joinDate: '2024-01-12', followers: '12K' },
];

const mockContent = [
  { id: '1', type: 'reel', title: 'Traditional Dance Tutorial', creator: 'amina_tz', status: 'published', reports: 0, views: '125K', likes: '8.9K', uploadDate: '2024-01-15', flagged: false },
  { id: '2', type: 'reel', title: 'Tech Review: Latest Smartphone', creator: 'tech_james', status: 'flagged', reports: 5, views: '89K', likes: '6.2K', uploadDate: '2024-01-15', flagged: true },
  { id: '3', type: 'product', title: 'Kitenge Fashion Dress', creator: 'fatuma_style', status: 'pending', reports: 0, views: '45K', likes: '3.1K', uploadDate: '2024-01-14', flagged: false },
  { id: '4', type: 'reel', title: 'Safari Adventure Vlog', creator: 'safari_mike', status: 'published', reports: 1, views: '23K', likes: '1.8K', uploadDate: '2024-01-14', flagged: false },
];

const mockOrders = [
  { id: 'ORD-001', customer: 'John Doe', product: 'Tanzanite Jewelry', amount: '250,000 TSH', status: 'completed', date: '2024-01-15', seller: 'amina_tz' },
  { id: 'ORD-002', customer: 'Sarah Kim', product: 'Kitenge Dress', amount: '85,000 TSH', status: 'pending', date: '2024-01-15', seller: 'fatuma_style' },
  { id: 'ORD-003', customer: 'Ali Hassan', product: 'Tech Course', amount: '45,000 TSH', status: 'processing', date: '2024-01-14', seller: 'tech_james' },
  { id: 'ORD-004', customer: 'Grace Mwangi', product: 'Safari Package', amount: '120,000 TSH', status: 'cancelled', date: '2024-01-14', seller: 'safari_mike' },
];

const mockPayouts = [
  { id: 'PAY-001', user: 'amina_tz', amount: '45,600 TSH', method: 'M-Pesa', status: 'completed', date: '2024-01-15', commission: '6,840 TSH' },
  { id: 'PAY-002', user: 'fatuma_style', amount: '23,400 TSH', method: 'Bank Transfer', status: 'pending', date: '2024-01-15', commission: '3,510 TSH' },
  { id: 'PAY-003', user: 'tech_james', amount: '18,900 TSH', method: 'Tigo Pesa', status: 'processing', date: '2024-01-14', commission: '2,835 TSH' },
  { id: 'PAY-004', user: 'safari_mike', amount: '8,200 TSH', method: 'M-Pesa', status: 'failed', date: '2024-01-14', commission: '1,230 TSH' },
];

const mockCalls = [
  { id: 'CALL-001', participants: ['amina_tz', 'customer_001'], type: 'video', duration: '00:15:32', status: 'completed', cost: '1,500 TSH', date: '2024-01-15 14:30' },
  { id: 'CALL-002', participants: ['tech_james', 'customer_002'], type: 'audio', duration: '00:08:45', status: 'completed', cost: '800 TSH', date: '2024-01-15 13:15' },
  { id: 'CALL-003', participants: ['fatuma_style', 'customer_003'], type: 'video', duration: '00:22:18', status: 'completed', cost: '2,200 TSH', date: '2024-01-15 11:45' },
  { id: 'CALL-004', participants: ['safari_mike', 'customer_004'], type: 'audio', duration: '00:05:12', status: 'ended', cost: '500 TSH', date: '2024-01-15 10:20' },
];

export default function AdminPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');

  const handleUserAction = (userId: string, action: string) => {
    console.log(`${action} user ${userId}`);
    // In real app, this would call an API
  };

  const handleContentAction = (contentId: string, action: string) => {
    console.log(`${action} content ${contentId}`);
    // In real app, this would call an API
  };

  const handleOrderAction = (orderId: string, action: string) => {
    console.log(`${action} order ${orderId}`);
    // In real app, this would call an API
  };

  const handlePayoutAction = (payoutId: string, action: string) => {
    console.log(`${action} payout ${payoutId}`);
    // In real app, this would call an API
  };

  const exportData = (type: string) => {
    console.log(`Exporting ${type} data`);
    // In real app, this would generate and download CSV
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="flex h-screen">
        {/* Sidebar */}
        <div className="w-64 bg-slate-800/50 backdrop-blur-xl border-r border-slate-700">
          <div className="p-6 border-b border-slate-700">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => navigate('/reels')}
                className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-slate-400" />
              </button>
              <div>
                <h1 className="text-xl font-bold text-white">Admin Console</h1>
                <p className="text-slate-400 text-sm">AkiliPesa Management</p>
              </div>
            </div>
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
        <div className="flex-1 overflow-auto">
          <div className="p-6">
            {/* Dashboard */}
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
                      <div key={index} className="bg-slate-800/30 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
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

                {/* Quick Actions */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
                    <div className="space-y-3">
                      <button
                        onClick={() => setActiveTab('users')}
                        className="w-full flex items-center justify-between p-3 bg-slate-700/50 rounded-lg hover:bg-slate-700 transition-colors"
                      >
                        <span className="text-white">Manage Users</span>
                        <Users className="w-5 h-5 text-slate-400" />
                      </button>
                      <button
                        onClick={() => setActiveTab('content')}
                        className="w-full flex items-center justify-between p-3 bg-slate-700/50 rounded-lg hover:bg-slate-700 transition-colors"
                      >
                        <span className="text-white">Review Content</span>
                        <Shield className="w-5 h-5 text-slate-400" />
                      </button>
                      <button
                        onClick={() => setActiveTab('payments')}
                        className="w-full flex items-center justify-between p-3 bg-slate-700/50 rounded-lg hover:bg-slate-700 transition-colors"
                      >
                        <span className="text-white">Process Payouts</span>
                        <DollarSign className="w-5 h-5 text-slate-400" />
                      </button>
                    </div>
                  </div>

                  <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3 p-3 bg-slate-700/30 rounded-lg">
                        <CheckCircle className="w-5 h-5 text-green-400" />
                        <div className="flex-1">
                          <p className="text-white text-sm">Order #ORD-001 completed</p>
                          <p className="text-slate-400 text-xs">2 minutes ago</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3 p-3 bg-slate-700/30 rounded-lg">
                        <Flag className="w-5 h-5 text-yellow-400" />
                        <div className="flex-1">
                          <p className="text-white text-sm">Content flagged for review</p>
                          <p className="text-slate-400 text-xs">5 minutes ago</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3 p-3 bg-slate-700/30 rounded-lg">
                        <Users className="w-5 h-5 text-blue-400" />
                        <div className="flex-1">
                          <p className="text-white text-sm">New user registered</p>
                          <p className="text-slate-400 text-xs">8 minutes ago</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Users Management */}
            {activeTab === 'users' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-2">Users Management</h2>
                    <p className="text-slate-400">Manage user accounts, roles, and permissions</p>
                  </div>
                  <button
                    onClick={() => exportData('users')}
                    className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/80 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    <span>Export CSV</span>
                  </button>
                </div>

                {/* Search and Filters */}
                <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700 rounded-xl p-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex-1 relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search users..."
                        className="w-full pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:border-primary focus:outline-none"
                      />
                    </div>
                    <select className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-primary focus:outline-none">
                      <option value="">All Roles</option>
                      <option value="user">Users</option>
                      <option value="creator">Creators</option>
                    </select>
                    <select className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-primary focus:outline-none">
                      <option value="">All Status</option>
                      <option value="active">Active</option>
                      <option value="suspended">Suspended</option>
                      <option value="pending">Pending</option>
                    </select>
                  </div>
                </div>

                {/* Users Table */}
                <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700 rounded-xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-slate-700/50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase">User</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase">Role</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase">Plan</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase">Balance</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase">Status</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-700/50">
                        {mockUsers.map((user) => (
                          <tr key={user.id} className="hover:bg-slate-700/30">
                            <td className="px-6 py-4">
                              <div>
                                <div className="font-medium text-white">{user.name}</div>
                                <div className="text-slate-400 text-sm">@{user.username}</div>
                                <div className="text-slate-500 text-xs">{user.email}</div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                user.role === 'creator' ? 'bg-purple-500/20 text-purple-400' : 'bg-blue-500/20 text-blue-400'
                              }`}>
                                {user.role}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                user.plan === 'premium' ? 'bg-yellow-500/20 text-yellow-400' : 
                                user.plan === 'starter' ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'
                              }`}>
                                {user.plan}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-slate-200">{user.balance}</td>
                            <td className="px-6 py-4">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                user.status === 'active' ? 'bg-green-500/20 text-green-400' : 
                                user.status === 'suspended' ? 'bg-red-500/20 text-red-400' : 'bg-yellow-500/20 text-yellow-400'
                              }`}>
                                {user.status}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() => handleUserAction(user.id, 'view')}
                                  className="p-1 hover:bg-slate-600 rounded transition-colors"
                                >
                                  <Eye className="w-4 h-4 text-slate-400" />
                                </button>
                                <button
                                  onClick={() => handleUserAction(user.id, 'edit')}
                                  className="p-1 hover:bg-slate-600 rounded transition-colors"
                                >
                                  <Edit className="w-4 h-4 text-slate-400" />
                                </button>
                                <button
                                  onClick={() => handleUserAction(user.id, user.status === 'active' ? 'suspend' : 'activate')}
                                  className="p-1 hover:bg-slate-600 rounded transition-colors"
                                >
                                  {user.status === 'active' ? (
                                    <Ban className="w-4 h-4 text-red-400" />
                                  ) : (
                                    <CheckCircle className="w-4 h-4 text-green-400" />
                                  )}
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Content Management */}
            {activeTab === 'content' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-2">Content Management</h2>
                    <p className="text-slate-400">Review and moderate user-generated content</p>
                  </div>
                  <button
                    onClick={() => exportData('content')}
                    className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/80 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    <span>Export Report</span>
                  </button>
                </div>

                {/* Content Table */}
                <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700 rounded-xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-slate-700/50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase">Content</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase">Creator</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase">Performance</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase">Reports</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase">Status</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-700/50">
                        {mockContent.map((content) => (
                          <tr key={content.id} className="hover:bg-slate-700/30">
                            <td className="px-6 py-4">
                              <div>
                                <div className="font-medium text-white">{content.title}</div>
                                <span className={`inline-block mt-1 px-2 py-1 rounded-full text-xs font-medium ${
                                  content.type === 'reel' ? 'bg-purple-500/20 text-purple-400' : 'bg-green-500/20 text-green-400'
                                }`}>
                                  {content.type}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-slate-200">@{content.creator}</td>
                            <td className="px-6 py-4">
                              <div className="text-sm">
                                <div className="text-white">{content.views} views</div>
                                <div className="text-slate-400">{content.likes} likes</div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span className={`font-medium ${
                                content.reports > 3 ? 'text-red-400' : content.reports > 0 ? 'text-yellow-400' : 'text-green-400'
                              }`}>
                                {content.reports}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                content.status === 'published' ? 'bg-green-500/20 text-green-400' : 
                                content.status === 'flagged' ? 'bg-red-500/20 text-red-400' : 'bg-yellow-500/20 text-yellow-400'
                              }`}>
                                {content.status}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() => handleContentAction(content.id, 'view')}
                                  className="p-1 hover:bg-slate-600 rounded transition-colors"
                                >
                                  <Eye className="w-4 h-4 text-slate-400" />
                                </button>
                                <button
                                  onClick={() => handleContentAction(content.id, 'approve')}
                                  className="p-1 hover:bg-slate-600 rounded transition-colors"
                                >
                                  <CheckCircle className="w-4 h-4 text-green-400" />
                                </button>
                                <button
                                  onClick={() => handleContentAction(content.id, 'reject')}
                                  className="p-1 hover:bg-slate-600 rounded transition-colors"
                                >
                                  <XCircle className="w-4 h-4 text-red-400" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Commerce Management */}
            {activeTab === 'commerce' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-2">Commerce Management</h2>
                    <p className="text-slate-400">Manage orders, products, and commission rates</p>
                  </div>
                  <button
                    onClick={() => exportData('orders')}
                    className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/80 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    <span>Export Orders</span>
                  </button>
                </div>

                {/* Orders Table */}
                <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700 rounded-xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-slate-700/50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase">Order ID</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase">Customer</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase">Product</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase">Amount</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase">Seller</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase">Status</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-700/50">
                        {mockOrders.map((order) => (
                          <tr key={order.id} className="hover:bg-slate-700/30">
                            <td className="px-6 py-4 font-mono text-slate-200">{order.id}</td>
                            <td className="px-6 py-4 text-white">{order.customer}</td>
                            <td className="px-6 py-4 text-slate-200">{order.product}</td>
                            <td className="px-6 py-4 font-semibold text-white">{order.amount}</td>
                            <td className="px-6 py-4 text-slate-200">@{order.seller}</td>
                            <td className="px-6 py-4">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                order.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                                order.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                                order.status === 'processing' ? 'bg-blue-500/20 text-blue-400' :
                                'bg-red-500/20 text-red-400'
                              }`}>
                                {order.status}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() => handleOrderAction(order.id, 'view')}
                                  className="p-1 hover:bg-slate-600 rounded transition-colors"
                                >
                                  <Eye className="w-4 h-4 text-slate-400" />
                                </button>
                                <button
                                  onClick={() => handleOrderAction(order.id, 'process')}
                                  className="p-1 hover:bg-slate-600 rounded transition-colors"
                                >
                                  <CheckCircle className="w-4 h-4 text-green-400" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Calls Management */}
            {activeTab === 'calls' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-2">Calls Management</h2>
                    <p className="text-slate-400">Monitor live and completed call sessions</p>
                  </div>
                  <button
                    onClick={() => exportData('calls')}
                    className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/80 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    <span>Export Report</span>
                  </button>
                </div>

                {/* Calls Table */}
                <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700 rounded-xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-slate-700/50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase">Call ID</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase">Participants</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase">Type</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase">Duration</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase">Cost</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase">Status</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-700/50">
                        {mockCalls.map((call) => (
                          <tr key={call.id} className="hover:bg-slate-700/30">
                            <td className="px-6 py-4 font-mono text-slate-200">{call.id}</td>
                            <td className="px-6 py-4">
                              <div className="text-sm">
                                {call.participants.map((participant, index) => (
                                  <div key={index} className="text-slate-200">@{participant}</div>
                                ))}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                call.type === 'video' ? 'bg-purple-500/20 text-purple-400' : 'bg-blue-500/20 text-blue-400'
                              }`}>
                                {call.type}
                              </span>
                            </td>
                            <td className="px-6 py-4 font-mono text-slate-200">{call.duration}</td>
                            <td className="px-6 py-4 text-white">{call.cost}</td>
                            <td className="px-6 py-4">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                call.status === 'completed' ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'
                              }`}>
                                {call.status}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center space-x-2">
                                <button className="p-1 hover:bg-slate-600 rounded transition-colors">
                                  <Eye className="w-4 h-4 text-slate-400" />
                                </button>
                                <button className="p-1 hover:bg-slate-600 rounded transition-colors">
                                  <Download className="w-4 h-4 text-slate-400" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Payments Management */}
            {activeTab === 'payments' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-2">Payments Management</h2>
                    <p className="text-slate-400">Process payouts and manage mobile money transactions</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => exportData('payouts')}
                      className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <Upload className="w-4 h-4" />
                      <span>Bulk Approve</span>
                    </button>
                    <button
                      onClick={() => exportData('payouts')}
                      className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/80 transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      <span>Export CSV</span>
                    </button>
                  </div>
                </div>

                {/* Payouts Table */}
                <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700 rounded-xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-slate-700/50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase">Payout ID</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase">User</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase">Amount</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase">Commission</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase">Method</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase">Status</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-700/50">
                        {mockPayouts.map((payout) => (
                          <tr key={payout.id} className="hover:bg-slate-700/30">
                            <td className="px-6 py-4 font-mono text-slate-200">{payout.id}</td>
                            <td className="px-6 py-4 text-white">@{payout.user}</td>
                            <td className="px-6 py-4 font-semibold text-white">{payout.amount}</td>
                            <td className="px-6 py-4 text-slate-300">{payout.commission}</td>
                            <td className="px-6 py-4">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                payout.method === 'M-Pesa' ? 'bg-green-500/20 text-green-400' :
                                payout.method === 'Bank Transfer' ? 'bg-blue-500/20 text-blue-400' :
                                'bg-yellow-500/20 text-yellow-400'
                              }`}>
                                {payout.method}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                payout.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                                payout.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                                payout.status === 'processing' ? 'bg-blue-500/20 text-blue-400' :
                                'bg-red-500/20 text-red-400'
                              }`}>
                                {payout.status}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() => handlePayoutAction(payout.id, 'approve')}
                                  className="p-1 hover:bg-slate-600 rounded transition-colors"
                                >
                                  <CheckCircle className="w-4 h-4 text-green-400" />
                                </button>
                                <button
                                  onClick={() => handlePayoutAction(payout.id, 'reject')}
                                  className="p-1 hover:bg-slate-600 rounded transition-colors"
                                >
                                  <XCircle className="w-4 h-4 text-red-400" />
                                </button>
                                <button className="p-1 hover:bg-slate-600 rounded transition-colors">
                                  <MoreHorizontal className="w-4 h-4 text-slate-400" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Settings */}
            {activeTab === 'settings' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">Platform Settings</h2>
                  <p className="text-slate-400">Configure platform features and tiers</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Tier Settings */}
                  <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">User Tiers</h3>
                    <div className="space-y-4">
                      <div className="p-4 bg-slate-700/30 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-white">Free Tier</span>
                          <span className="text-gray-400">0 TSH/month</span>
                        </div>
                        <ul className="text-sm text-slate-400 space-y-1">
                          <li>• Basic features</li>
                          <li>• 5 calls/month</li>
                          <li>• Standard support</li>
                        </ul>
                      </div>
                      <div className="p-4 bg-slate-700/30 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-white">Starter Tier</span>
                          <span className="text-green-400">15,000 TSH/month</span>
                        </div>
                        <ul className="text-sm text-slate-400 space-y-1">
                          <li>• All basic features</li>
                          <li>• 50 calls/month</li>
                          <li>• Priority support</li>
                          <li>• Analytics dashboard</li>
                        </ul>
                      </div>
                      <div className="p-4 bg-slate-700/30 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-white">Premium Tier</span>
                          <span className="text-yellow-400">45,000 TSH/month</span>
                        </div>
                        <ul className="text-sm text-slate-400 space-y-1">
                          <li>• Unlimited calls</li>
                          <li>• Advanced analytics</li>
                          <li>• API access</li>
                          <li>• White-label options</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Feature Toggles */}
                  <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Feature Toggles</h3>
                    <div className="space-y-4">
                      {[
                        { name: 'AI Video Generation', enabled: true },
                        { name: 'Live Streaming', enabled: true },
                        { name: 'Marketplace', enabled: true },
                        { name: 'Mobile Money Payouts', enabled: true },
                        { name: 'Content Moderation', enabled: true },
                        { name: 'Referral Program', enabled: false },
                      ].map((feature, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                          <span className="text-white">{feature.name}</span>
                          <button
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                              feature.enabled ? 'bg-primary' : 'bg-slate-600'
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                feature.enabled ? 'translate-x-6' : 'translate-x-1'
                              }`}
                            />
                          </button>
                        </div>
                      ))}
                    </div>
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
