import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  DollarSign,
  TrendingUp,
  TrendingDown,
  Eye,
  Share,
  Heart,
  Phone,
  Video,
  ShoppingBag,
  Calendar,
  Download,
  RefreshCw,
  Filter,
  CreditCard,
  Wallet,
  BarChart3,
  PieChart,
  Target,
  Award,
  Clock,
  Users
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface EarningSource {
  id: string;
  type: 'content' | 'calls' | 'tips' | 'affiliate' | 'subscriptions' | 'shop';
  title: string;
  amount: number;
  currency: string;
  change: number;
  changeType: 'increase' | 'decrease';
  icon: React.ComponentType<any>;
  color: string;
}

interface Transaction {
  id: string;
  type: 'earning' | 'payout' | 'tip';
  source: string;
  amount: number;
  currency: string;
  date: string;
  status: 'completed' | 'pending' | 'failed';
  description: string;
}

export default function EarningsPage() {
  const navigate = useNavigate();
  const [selectedPeriod, setSelectedPeriod] = useState<'day' | 'week' | 'month' | 'year'>('month');
  const [selectedTab, setSelectedTab] = useState<'overview' | 'breakdown' | 'transactions'>('overview');

  const totalEarnings = 284500;
  const availableBalance = 142250;
  const pendingPayouts = 42000;

  const earningsSources: EarningSource[] = [
    {
      id: 'content',
      type: 'content',
      title: 'Content Views',
      amount: 95000,
      currency: 'TSH',
      change: 12.5,
      changeType: 'increase',
      icon: Eye,
      color: 'text-blue-600'
    },
    {
      id: 'calls',
      type: 'calls',
      title: 'Video/Audio Calls',
      amount: 78500,
      currency: 'TSH',
      change: 8.3,
      changeType: 'increase',
      icon: Phone,
      color: 'text-green-600'
    },
    {
      id: 'tips',
      type: 'tips',
      title: 'Tips & Gifts',
      amount: 56000,
      currency: 'TSH',
      change: -2.1,
      changeType: 'decrease',
      icon: Heart,
      color: 'text-red-600'
    },
    {
      id: 'affiliate',
      type: 'affiliate',
      title: 'Affiliate Sales',
      amount: 34000,
      currency: 'TSH',
      change: 15.7,
      changeType: 'increase',
      icon: Share,
      color: 'text-purple-600'
    },
    {
      id: 'shop',
      type: 'shop',
      title: 'Shop Sales',
      amount: 21000,
      currency: 'TSH',
      change: 5.2,
      changeType: 'increase',
      icon: ShoppingBag,
      color: 'text-orange-600'
    }
  ];

  const recentTransactions: Transaction[] = [
    {
      id: '1',
      type: 'earning',
      source: 'Video Call with James M.',
      amount: 15000,
      currency: 'TSH',
      date: '2 hours ago',
      status: 'completed',
      description: '30-min business consultation call'
    },
    {
      id: '2',
      type: 'tip',
      source: 'Tip from Sarah K.',
      amount: 5000,
      currency: 'TSH',
      date: '5 hours ago',
      status: 'completed',
      description: 'Mathematics tutorial appreciation'
    },
    {
      id: '3',
      type: 'earning',
      source: 'Content Views',
      amount: 2500,
      currency: 'TSH',
      date: 'Yesterday',
      status: 'completed',
      description: 'Daily content monetization'
    },
    {
      id: '4',
      type: 'payout',
      source: 'Bank Transfer',
      amount: -50000,
      currency: 'TSH',
      date: '2 days ago',
      status: 'completed',
      description: 'Weekly payout to CRDB Bank'
    }
  ];

  const formatCurrency = (amount: number, currency: string = 'TSH') => {
    return `${amount.toLocaleString()} ${currency}`;
  };

  const getStatusColor = (status: Transaction['status']) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-100';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'failed':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const handleRequestPayout = () => {
    navigate('/payout');
  };

  const handleViewAnalytics = () => {
    navigate('/analytics');
  };

  return (
    <div className="h-screen-safe bg-white">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-100 safe-top">
        <div className="flex items-center justify-between p-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          
          <div className="text-center">
            <h1 className="text-xl font-bold">Earnings</h1>
            <p className="text-sm text-gray-600">Track your income</p>
          </div>
          
          <div className="flex items-center space-x-2">
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <Filter className="w-6 h-6" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <Download className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Period Selector */}
        <div className="px-4 pb-4">
          <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
            {[
              { id: 'day', label: 'Today' },
              { id: 'week', label: 'Week' },
              { id: 'month', label: 'Month' },
              { id: 'year', label: 'Year' }
            ].map((period) => (
              <button
                key={period.id}
                onClick={() => setSelectedPeriod(period.id as any)}
                className={cn(
                  'flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors',
                  selectedPeriod === period.id
                    ? 'bg-white text-primary shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                )}
              >
                {period.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Summary Cards */}
        <div className="p-4">
          <div className="grid grid-cols-1 gap-4 mb-6">
            {/* Total Earnings */}
            <div className="bg-gradient-to-br from-primary to-secondary rounded-2xl p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-white/80 text-sm">Total Earnings</p>
                  <h2 className="text-3xl font-bold">{formatCurrency(totalEarnings)}</h2>
                </div>
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <DollarSign className="w-6 h-6" />
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-4 h-4" />
                <span className="text-sm">+18.2% from last month</span>
              </div>
            </div>

            {/* Balance Cards */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-green-50 border border-green-200 rounded-2xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <Wallet className="w-5 h-5 text-green-600" />
                  <span className="text-xs text-green-600 font-medium">AVAILABLE</span>
                </div>
                <h3 className="text-xl font-bold text-green-800">
                  {formatCurrency(availableBalance)}
                </h3>
                <button
                  onClick={handleRequestPayout}
                  className="mt-3 w-full py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  Request Payout
                </button>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <Clock className="w-5 h-5 text-yellow-600" />
                  <span className="text-xs text-yellow-600 font-medium">PENDING</span>
                </div>
                <h3 className="text-xl font-bold text-yellow-800">
                  {formatCurrency(pendingPayouts)}
                </h3>
                <p className="text-xs text-yellow-700 mt-1">Processing 1-3 days</p>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200 mb-6">
            <div className="flex space-x-6">
              {[
                { id: 'overview', label: 'Overview', icon: BarChart3 },
                { id: 'breakdown', label: 'Breakdown', icon: PieChart },
                { id: 'transactions', label: 'Transactions', icon: CreditCard }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedTab(tab.id as any)}
                  className={cn(
                    'flex items-center space-x-2 py-3 px-1 border-b-2 font-medium text-sm transition-colors',
                    selectedTab === tab.id
                      ? 'border-primary text-primary'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  )}
                >
                  <tab.icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <AnimatePresence mode="wait">
            {selectedTab === 'overview' && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                {/* Quick Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 rounded-xl p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Users className="w-5 h-5 text-blue-600" />
                      <span className="text-sm font-medium text-blue-800">Active Clients</span>
                    </div>
                    <p className="text-2xl font-bold text-blue-800">47</p>
                    <p className="text-xs text-blue-600">+5 this month</p>
                  </div>

                  <div className="bg-purple-50 rounded-xl p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Target className="w-5 h-5 text-purple-600" />
                      <span className="text-sm font-medium text-purple-800">Conversion Rate</span>
                    </div>
                    <p className="text-2xl font-bold text-purple-800">12.5%</p>
                    <p className="text-xs text-purple-600">+2.1% from last month</p>
                  </div>
                </div>

                {/* Achievements */}
                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                      <Award className="w-6 h-6 text-yellow-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-yellow-800">Top Performer!</h3>
                      <p className="text-sm text-yellow-700">You're in the top 10% of creators this month</p>
                    </div>
                  </div>
                </div>

                {/* Performance Tips */}
                <div className="bg-gray-50 rounded-xl p-4">
                  <h3 className="font-semibold mb-3">💡 Tips to Increase Earnings</h3>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li>• Host more live sessions during peak hours (6-9 PM)</li>
                    <li>• Create educational content for higher engagement</li>
                    <li>• Respond to calls within 2 hours for better ratings</li>
                    <li>• Share your content on social media for more views</li>
                  </ul>
                </div>
              </motion.div>
            )}

            {selectedTab === 'breakdown' && (
              <motion.div
                key="breakdown"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-4"
              >
                {earningsSources.map((source) => (
                  <div key={source.id} className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                          <source.icon className={cn('w-5 h-5', source.color)} />
                        </div>
                        <div>
                          <h4 className="font-semibold">{source.title}</h4>
                          <p className="text-sm text-gray-600">
                            {formatCurrency(source.amount, source.currency)}
                          </p>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className={cn(
                          'flex items-center space-x-1 text-sm font-medium',
                          source.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                        )}>
                          {source.changeType === 'increase' ? (
                            <TrendingUp className="w-4 h-4" />
                          ) : (
                            <TrendingDown className="w-4 h-4" />
                          )}
                          <span>{Math.abs(source.change)}%</span>
                        </div>
                        <p className="text-xs text-gray-500">vs last month</p>
                      </div>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}

            {selectedTab === 'transactions' && (
              <motion.div
                key="transactions"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-3"
              >
                {recentTransactions.map((transaction) => (
                  <div key={transaction.id} className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="font-medium">{transaction.source}</h4>
                          <span className={cn(
                            'px-2 py-0.5 text-xs rounded-full font-medium',
                            getStatusColor(transaction.status)
                          )}>
                            {transaction.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">{transaction.description}</p>
                        <p className="text-xs text-gray-500 mt-1">{transaction.date}</p>
                      </div>
                      
                      <div className="text-right">
                        <p className={cn(
                          'font-bold text-lg',
                          transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
                        )}>
                          {transaction.amount > 0 ? '+' : ''}{formatCurrency(transaction.amount, transaction.currency)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}

                <button
                  onClick={() => navigate('/transactions')}
                  className="w-full py-3 mt-4 border border-gray-200 hover:bg-gray-50 rounded-xl font-medium transition-colors"
                >
                  View All Transactions
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
