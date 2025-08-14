import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Wallet, 
  Plus, 
  TrendingUp, 
  Download, 
  CreditCard, 
  Smartphone, 
  DollarSign,
  Receipt,
  Send,
  Eye,
  EyeOff
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/store';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/queryClient';

interface Transaction {
  id: string;
  type: 'deposit' | 'withdrawal' | 'earning' | 'purchase' | 'commission';
  amount: number;
  description: string;
  date: Date;
  status: 'pending' | 'completed' | 'failed';
  reference: string;
}

interface WalletData {
  balance: number;
  earnings: number;
  totalDeposits: number;
  totalWithdrawals: number;
  pendingAmount: number;
  currency: string;
}

const mockWalletData: WalletData = {
  balance: 284500,
  earnings: 156700,
  totalDeposits: 500000,
  totalWithdrawals: 128000,
  pendingAmount: 45000,
  currency: 'TSH',
};

const mockTransactions: Transaction[] = [
  {
    id: '1',
    type: 'earning',
    amount: 12500,
    description: 'Commission from Tanzanite jewelry sale',
    date: new Date(Date.now() - 2 * 60 * 60 * 1000),
    status: 'completed',
    reference: 'COM-001234',
  },
  {
    id: '2',
    type: 'deposit',
    amount: 50000,
    description: 'M-Pesa deposit',
    date: new Date(Date.now() - 24 * 60 * 60 * 1000),
    status: 'completed',
    reference: 'DEP-005678',
  },
  {
    id: '3',
    type: 'withdrawal',
    amount: -25000,
    description: 'Bank transfer to CRDB',
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    status: 'pending',
    reference: 'WIT-009876',
  },
  {
    id: '4',
    type: 'purchase',
    amount: -15000,
    description: 'Standard Plan Upgrade',
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    status: 'completed',
    reference: 'PUR-123456',
  },
  {
    id: '5',
    type: 'commission',
    amount: 8750,
    description: 'Referral bonus - User registration',
    date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    status: 'completed',
    reference: 'REF-654321',
  },
];

interface Receipt {
  id: string;
  transactionId: string;
  amount: number;
  tax: number;
  total: number;
  description: string;
  date: Date;
  paymentMethod: string;
  reference: string;
  status: 'completed' | 'pending' | 'failed';
}

const mockReceipts: Receipt[] = [
  {
    id: 'REC-001',
    transactionId: 'DEP-005678',
    amount: 50000,
    tax: 9000,
    total: 59000,
    description: 'Wallet Top-up via M-Pesa',
    date: new Date(Date.now() - 24 * 60 * 60 * 1000),
    paymentMethod: 'M-Pesa (+255 123 456 789)',
    reference: 'DEP-005678',
    status: 'completed',
  },
  {
    id: 'REC-002',
    transactionId: 'PUR-123456',
    amount: 15000,
    tax: 2700,
    total: 17700,
    description: 'Standard Plan Purchase - Monthly',
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    paymentMethod: 'Wallet Balance',
    reference: 'PUR-123456',
    status: 'completed',
  },
  {
    id: 'REC-003',
    transactionId: 'WIT-009876',
    amount: 25000,
    tax: 0,
    total: 25000,
    description: 'Withdrawal to CRDB Bank',
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    paymentMethod: 'Bank Transfer',
    reference: 'WIT-009876',
    status: 'pending',
  },
];

export default function WalletPage() {
  const navigate = useNavigate();
  const { user, updateBalance } = useAppStore();
  const queryClient = useQueryClient();
  const [showBalance, setShowBalance] = useState(true);
  const [selectedTab, setSelectedTab] = useState<'overview' | 'transactions' | 'receipts'>('overview');

  // Wallet data query
  const { data: walletData } = useQuery({
    queryKey: ['wallet', user?.id],
    queryFn: () => api.getWallet(user?.id || ''),
    placeholderData: mockWalletData,
  });

  // Add funds mutation
  useMutation({
    mutationFn: (amount: number) => api.addFunds(user?.id || '', amount),
    onSuccess: (data) => {
      updateBalance(data.amount);
      queryClient.invalidateQueries({ queryKey: ['wallet'] });
    },
  });

  const formatCurrency = (amount: number, currency = 'TSH') => {
    return new Intl.NumberFormat('sw-TZ', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
    }).format(Math.abs(amount));
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getTransactionIcon = (type: Transaction['type']) => {
    switch (type) {
      case 'deposit':
        return <Plus className="w-4 h-4 text-green-400" />;
      case 'withdrawal':
        return <Download className="w-4 h-4 text-red-400" />;
      case 'earning':
        return <TrendingUp className="w-4 h-4 text-blue-400" />;
      case 'purchase':
        return <CreditCard className="w-4 h-4 text-orange-400" />;
      case 'commission':
        return <DollarSign className="w-4 h-4 text-purple-400" />;
      default:
        return <Wallet className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: Transaction['status']) => {
    switch (status) {
      case 'completed':
        return 'text-green-400';
      case 'pending':
        return 'text-yellow-400';
      case 'failed':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  const handleAddFunds = (amount?: number) => {
    navigate('/add-funds');
  };

  const handleWithdraw = () => {
    navigate('/withdraw');
  };

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'transactions', label: 'Transactions' },
    { id: 'receipts', label: 'Receipts' },
  ];

  return (
    <div className="h-screen-safe bg-gem-dark overflow-y-auto">
      {/* Header */}
      <div className="safe-top bg-gem-dark/95 backdrop-blur-sm border-b border-white/10 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-white" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-white">Wallet</h1>
              <p className="text-sm text-white/60">Manage your funds</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => setShowBalance(!showBalance)}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              {showBalance ? (
                <Eye className="w-5 h-5 text-white" />
              ) : (
                <EyeOff className="w-5 h-5 text-white" />
              )}
            </button>
            <button
              onClick={() => navigate('/upgrade-plan')}
              className="btn-gem text-sm px-4 py-2"
            >
              Upgrade Plan
            </button>
          </div>
        </div>
      </div>

      {/* Balance Card */}
      <div className="p-4">
        <div className="card-gem p-6 text-center mb-6">
          <div className="w-16 h-16 bg-primary/20 rounded-full flex-center mx-auto mb-4">
            <Wallet className="w-8 h-8 text-primary" />
          </div>
          
          <div className="space-y-2">
            <p className="text-white/60 text-sm">Available Balance</p>
            <h2 className="text-3xl font-bold text-white">
              {showBalance 
                ? formatCurrency(walletData?.balance || 0, walletData?.currency)
                : '••••••'
              }
            </h2>
            
            {walletData?.pendingAmount > 0 && (
              <p className="text-yellow-400 text-sm">
                {formatCurrency(walletData.pendingAmount)} pending
              </p>
            )}
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-3 mt-6">
            <button
              onClick={() => handleAddFunds(50000)}
              className="flex items-center justify-center space-x-2 py-3 bg-green-500/20 border border-green-500/50 rounded-xl text-green-400 hover:bg-green-500/30 transition-colors"
            >
              <Plus className="w-5 h-5" />
              <span className="font-medium">Add Funds</span>
            </button>
            
            <button
              onClick={handleWithdraw}
              className="flex items-center justify-center space-x-2 py-3 bg-blue-500/20 border border-blue-500/50 rounded-xl text-blue-400 hover:bg-blue-500/30 transition-colors"
            >
              <Send className="w-5 h-5" />
              <span className="font-medium">Withdraw</span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="card-gem p-4 text-center">
            <TrendingUp className="w-6 h-6 text-blue-400 mx-auto mb-2" />
            <p className="text-white/60 text-sm">Total Earnings</p>
            <p className="text-xl font-bold text-white">
              {showBalance 
                ? formatCurrency(walletData?.earnings || 0)
                : '••••••'
              }
            </p>
          </div>
          
          <div className="card-gem p-4 text-center">
            <Download className="w-6 h-6 text-green-400 mx-auto mb-2" />
            <p className="text-white/60 text-sm">Total Deposits</p>
            <p className="text-xl font-bold text-white">
              {showBalance 
                ? formatCurrency(walletData?.totalDeposits || 0)
                : '••••••'
              }
            </p>
          </div>
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

      {/* Tab Content */}
      <div className="p-4">
        {selectedTab === 'overview' && (
          <div className="space-y-4">
            {/* Quick Add Amounts */}
            <div>
              <h3 className="text-white font-semibold mb-3">Quick Add Funds</h3>
              <div className="grid grid-cols-2 gap-3">
                {[25000, 50000, 100000, 200000].map((amount) => (
                  <button
                    key={amount}
                    onClick={() => handleAddFunds(amount)}
                    className="p-4 bg-white/10 rounded-xl hover:bg-white/20 transition-colors text-center"
                  >
                    <p className="text-white font-bold">{formatCurrency(amount)}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Payment Methods */}
            <div>
              <h3 className="text-white font-semibold mb-3">Payment Methods</h3>
              <div className="space-y-3">
                <button 
                  onClick={() => navigate('/wallet/payment-methods')}
                  className="w-full p-4 bg-white/10 rounded-xl hover:bg-white/20 transition-colors flex items-center space-x-3"
                >
                  <Smartphone className="w-6 h-6 text-green-400" />
                  <div className="text-left">
                    <p className="text-white font-medium">M-Pesa</p>
                    <p className="text-white/60 text-sm">Instant funding via mobile money</p>
                  </div>
                </button>
                
                <button 
                  onClick={() => navigate('/wallet/payment-methods')}
                  className="w-full p-4 bg-white/10 rounded-xl hover:bg-white/20 transition-colors flex items-center space-x-3"
                >
                  <CreditCard className="w-6 h-6 text-blue-400" />
                  <div className="text-left">
                    <p className="text-white font-medium">Bank Card</p>
                    <p className="text-white/60 text-sm">Visa, MasterCard accepted</p>
                  </div>
                </button>
              </div>
            </div>
          </div>
        )}

        {selectedTab === 'transactions' && (
          <div className="space-y-3">
            {mockTransactions.map((transaction) => (
              <div key={transaction.id} className="card-gem p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-white/10 rounded-full flex-center">
                    {getTransactionIcon(transaction.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-white truncate">
                        {transaction.description}
                      </p>
                      <p className={cn(
                        'font-bold',
                        transaction.amount >= 0 ? 'text-green-400' : 'text-red-400'
                      )}>
                        {transaction.amount >= 0 ? '+' : ''}
                        {formatCurrency(transaction.amount)}
                      </p>
                    </div>
                    
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-white/60 text-sm">
                        {formatDate(transaction.date)}
                      </p>
                      <p className={cn('text-xs', getStatusColor(transaction.status))}>
                        {transaction.status}
                      </p>
                    </div>
                    
                    <p className="text-white/40 text-xs">
                      Ref: {transaction.reference}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {selectedTab === 'receipts' && (
          <div className="space-y-3">
            {mockReceipts.length > 0 ? (
              mockReceipts.map((receipt) => (
                <div key={receipt.id} className="card-gem p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-500/20 rounded-full flex-center">
                        <Receipt className="w-5 h-5 text-blue-400" />
                      </div>
                      <div>
                        <p className="font-medium text-white">{receipt.description}</p>
                        <p className="text-sm text-white/60">{formatDate(receipt.date)}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-white">
                        {formatCurrency(receipt.total)}
                      </p>
                      <p className={cn('text-xs', getStatusColor(receipt.status))}>
                        {receipt.status}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between text-white/60">
                      <span>Amount:</span>
                      <span>{formatCurrency(receipt.amount)}</span>
                    </div>
                    {receipt.tax > 0 && (
                      <div className="flex justify-between text-white/60">
                        <span>Tax (18%):</span>
                        <span>{formatCurrency(receipt.tax)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-white font-medium">
                      <span>Total:</span>
                      <span>{formatCurrency(receipt.total)}</span>
                    </div>
                    <div className="pt-2 border-t border-white/10">
                      <div className="flex justify-between text-white/60">
                        <span>Payment Method:</span>
                        <span className="text-right">{receipt.paymentMethod}</span>
                      </div>
                      <div className="flex justify-between text-white/40 text-xs mt-1">
                        <span>Reference:</span>
                        <span>{receipt.reference}</span>
                      </div>
                    </div>
                  </div>

                  <button className="w-full mt-3 py-2 bg-blue-500/20 text-blue-400 rounded-lg text-sm hover:bg-blue-500/30 transition-colors">
                    Download Receipt
                  </button>
                </div>
              ))
            ) : (
              <div className="text-center py-16">
                <Receipt className="w-16 h-16 text-white/40 mx-auto mb-4" />
                <h3 className="text-white font-semibold mb-2">No Receipts Yet</h3>
                <p className="text-white/60 text-sm">
                  Your transaction receipts will appear here
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
