import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Eye, 
  Heart, 
  Gift,
  Download,
  Calendar,
  CreditCard
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface EarningsData {
  total: number;
  thisMonth: number;
  lastMonth: number;
  thisWeek: number;
  yesterday: number;
  pendingPayouts: number;
  currency: string;
}

interface EarningsSource {
  type: 'views' | 'likes' | 'gifts' | 'calls' | 'products' | 'referrals';
  amount: number;
  percentage: number;
  change: number;
  isPositive: boolean;
}

interface Transaction {
  id: string;
  type: 'earning' | 'withdrawal' | 'bonus';
  amount: number;
  source: string;
  date: Date;
  status: 'completed' | 'pending' | 'failed';
}

const mockEarningsData: EarningsData = {
  total: 2450000,
  thisMonth: 380000,
  lastMonth: 420000,
  thisWeek: 85000,
  yesterday: 12000,
  pendingPayouts: 45000,
  currency: 'TSH',
};

const mockEarningsSources: EarningsSource[] = [
  {
    type: 'views',
    amount: 180000,
    percentage: 47.4,
    change: 12.5,
    isPositive: true,
  },
  {
    type: 'gifts',
    amount: 95000,
    percentage: 25.0,
    change: -3.2,
    isPositive: false,
  },
  {
    type: 'calls',
    amount: 68000,
    percentage: 17.9,
    change: 8.7,
    isPositive: true,
  },
  {
    type: 'products',
    amount: 25000,
    percentage: 6.6,
    change: 15.3,
    isPositive: true,
  },
  {
    type: 'referrals',
    amount: 12000,
    percentage: 3.1,
    change: 2.1,
    isPositive: true,
  },
];

const mockTransactions: Transaction[] = [
  {
    id: 'txn-001',
    type: 'earning',
    amount: 12000,
    source: 'Video views',
    date: new Date('2024-01-19'),
    status: 'completed',
  },
  {
    id: 'txn-002',
    type: 'withdrawal',
    amount: -50000,
    source: 'Bank transfer',
    date: new Date('2024-01-18'),
    status: 'completed',
  },
  {
    id: 'txn-003',
    type: 'earning',
    amount: 8500,
    source: 'Audio call',
    date: new Date('2024-01-17'),
    status: 'completed',
  },
  {
    id: 'txn-004',
    type: 'bonus',
    amount: 25000,
    source: 'Referral bonus',
    date: new Date('2024-01-15'),
    status: 'completed',
  },
  {
    id: 'txn-005',
    type: 'earning',
    amount: 15000,
    source: 'Product sale',
    date: new Date('2024-01-14'),
    status: 'pending',
  },
];

function formatCurrency(amount: number, currency: string = 'TSH'): string {
  return new Intl.NumberFormat('sw-TZ', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
  }).format(Math.abs(amount));
}

function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function getSourceIcon(type: EarningsSource['type']) {
  switch (type) {
    case 'views':
      return <Eye className="w-5 h-5" />;
    case 'likes':
      return <Heart className="w-5 h-5" />;
    case 'gifts':
      return <Gift className="w-5 h-5" />;
    case 'calls':
      return <DollarSign className="w-5 h-5" />;
    case 'products':
      return <CreditCard className="w-5 h-5" />;
    case 'referrals':
      return <Users className="w-5 h-5" />;
    default:
      return <DollarSign className="w-5 h-5" />;
  }
}

function getTransactionIcon(type: Transaction['type']) {
  switch (type) {
    case 'earning':
      return <TrendingUp className="w-4 h-4 text-green-400" />;
    case 'withdrawal':
      return <Download className="w-4 h-4 text-blue-400" />;
    case 'bonus':
      return <Gift className="w-4 h-4 text-purple-400" />;
    default:
      return <DollarSign className="w-4 h-4 text-gray-400" />;
  }
}

export default function EarningsPage() {
  const navigate = useNavigate();
  const [earningsData] = useState<EarningsData>(mockEarningsData);
  const [earningsSources] = useState<EarningsSource[]>(mockEarningsSources);
  const [transactions] = useState<Transaction[]>(mockTransactions);
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('month');

  const monthlyGrowth = ((earningsData.thisMonth - earningsData.lastMonth) / earningsData.lastMonth) * 100;

  const handleWithdraw = () => {
    navigate('/earnings/withdraw');
  };

  const handleViewAnalytics = () => {
    navigate('/analytics');
  };

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
            <h1 className="text-xl font-bold text-white">Earnings</h1>
            <p className="text-sm text-white/60">Track your income and performance</p>
          </div>
          <button 
            onClick={handleViewAnalytics}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <TrendingUp className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-6">
        {/* Total Earnings Card */}
        <div className="card-gem p-6 text-center">
          <div className="text-3xl font-bold text-white mb-2">
            {formatCurrency(earningsData.total, earningsData.currency)}
          </div>
          <div className="text-white/60 text-sm mb-4">Total Earned</div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-xl font-bold text-green-400">
                {formatCurrency(earningsData.thisMonth, earningsData.currency)}
              </div>
              <div className="text-white/60 text-xs">This Month</div>
              <div className={cn(
                'text-xs flex items-center justify-center space-x-1 mt-1',
                monthlyGrowth >= 0 ? 'text-green-400' : 'text-red-400'
              )}>
                {monthlyGrowth >= 0 ? (
                  <TrendingUp className="w-3 h-3" />
                ) : (
                  <TrendingDown className="w-3 h-3" />
                )}
                <span>{Math.abs(monthlyGrowth).toFixed(1)}%</span>
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-xl font-bold text-yellow-400">
                {formatCurrency(earningsData.pendingPayouts, earningsData.currency)}
              </div>
              <div className="text-white/60 text-xs">Pending</div>
              <button 
                onClick={handleWithdraw}
                className="text-xs text-accent-400 hover:text-accent-300 mt-1"
              >
                Withdraw
              </button>
            </div>
          </div>
        </div>

        {/* Period Selector */}
        <div className="flex space-x-2">
          {(['week', 'month', 'year'] as const).map((period) => (
            <button
              key={period}
              onClick={() => setSelectedPeriod(period)}
              className={cn(
                'flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all',
                selectedPeriod === period
                  ? 'bg-accent-500 text-white'
                  : 'bg-white/10 text-white/60 hover:bg-white/20'
              )}
            >
              {period.charAt(0).toUpperCase() + period.slice(1)}
            </button>
          ))}
        </div>

        {/* Earnings Sources */}
        <div className="card-gem p-4">
          <h3 className="text-white font-semibold mb-4 flex items-center space-x-2">
            <DollarSign className="w-5 h-5 text-accent-400" />
            <span>Earnings Sources</span>
          </h3>
          
          <div className="space-y-3">
            {earningsSources.map((source) => (
              <div key={source.type} className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-accent-500/20 rounded-full flex-center">
                  {getSourceIcon(source.type)}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-white font-medium text-sm capitalize">
                      {source.type}
                    </span>
                    <span className="text-white font-bold">
                      {formatCurrency(source.amount, earningsData.currency)}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="w-full bg-white/20 rounded-full h-1.5 mr-3">
                      <div
                        className="bg-gradient-to-r from-accent-400 to-accent-600 h-1.5 rounded-full"
                        style={{ width: `${source.percentage}%` }}
                      />
                    </div>
                    <div className={cn(
                      'text-xs flex items-center space-x-1',
                      source.isPositive ? 'text-green-400' : 'text-red-400'
                    )}>
                      {source.isPositive ? (
                        <TrendingUp className="w-3 h-3" />
                      ) : (
                        <TrendingDown className="w-3 h-3" />
                      )}
                      <span>{source.change}%</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="card-gem p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-accent-400" />
              <span>Recent Activity</span>
            </h3>
            <button 
              onClick={() => navigate('/earnings/history')}
              className="text-accent-400 text-sm hover:text-accent-300"
            >
              View All
            </button>
          </div>
          
          <div className="space-y-3">
            {transactions.slice(0, 5).map((transaction) => (
              <div key={transaction.id} className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg">
                <div className="flex-shrink-0">
                  {getTransactionIcon(transaction.type)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-white font-medium text-sm">
                      {transaction.source}
                    </span>
                    <span className={cn(
                      'font-bold text-sm',
                      transaction.amount >= 0 ? 'text-green-400' : 'text-white'
                    )}>
                      {transaction.amount >= 0 ? '+' : ''}
                      {formatCurrency(transaction.amount, earningsData.currency)}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-white/60 text-xs">
                      {formatDate(transaction.date)}
                    </span>
                    <span className={cn(
                      'text-xs px-2 py-0.5 rounded-full',
                      transaction.status === 'completed'
                        ? 'bg-green-500/20 text-green-400'
                        : transaction.status === 'pending'
                        ? 'bg-yellow-500/20 text-yellow-400'
                        : 'bg-red-500/20 text-red-400'
                    )}>
                      {transaction.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-4">
          <button 
            onClick={handleWithdraw}
            className="btn-gem py-3 flex items-center justify-center space-x-2"
          >
            <Download className="w-5 h-5" />
            <span>Withdraw</span>
          </button>
          <button 
            onClick={handleViewAnalytics}
            className="btn-gem-outline py-3 flex items-center justify-center space-x-2"
          >
            <TrendingUp className="w-5 h-5" />
            <span>Analytics</span>
          </button>
        </div>
      </div>
    </div>
  );
}
