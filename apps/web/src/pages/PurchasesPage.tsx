import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Package, ShoppingBag, Clock, CheckCircle, XCircle, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Purchase {
  id: string;
  type: 'product' | 'service' | 'subscription';
  title: string;
  description: string;
  price: number;
  currency: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  orderDate: Date;
  deliveryDate?: Date;
  seller: {
    username: string;
    displayName: string;
    avatar: string;
  };
  image: string;
  quantity: number;
}

const mockPurchases: Purchase[] = [
  {
    id: 'order-001',
    type: 'product',
    title: 'Traditional Kitenge Dress',
    description: 'Handmade Kitenge dress with Tanzanite-inspired patterns',
    price: 120000,
    currency: 'TSH',
    status: 'delivered',
    orderDate: new Date('2024-01-10'),
    deliveryDate: new Date('2024-01-15'),
    seller: {
      username: 'fatuma_style',
      displayName: 'Fatuma Bakari',
      avatar: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=150&h=150&fit=crop&crop=face',
    },
    image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=300&h=300&fit=crop',
    quantity: 1,
  },
  {
    id: 'order-002',
    type: 'service',
    title: 'AI Fashion Consultation',
    description: '1-hour personalized fashion advice session',
    price: 45000,
    currency: 'TSH',
    status: 'processing',
    orderDate: new Date('2024-01-18'),
    seller: {
      username: 'style_guru_ai',
      displayName: 'Fashion AI',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    },
    image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=300&h=300&fit=crop',
    quantity: 1,
  },
  {
    id: 'order-003',
    type: 'subscription',
    title: 'Premium Creator Plan',
    description: 'Monthly subscription with advanced AI features',
    price: 25000,
    currency: 'TSH',
    status: 'pending',
    orderDate: new Date('2024-01-20'),
    seller: {
      username: 'akilipesa',
      displayName: 'AkiliPesa',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    },
    image: 'https://images.unsplash.com/photo-1607860109020-de3eaa7e8ba8?w=300&h=300&fit=crop',
    quantity: 1,
  },
];

function formatCurrency(amount: number, currency: string): string {
  return new Intl.NumberFormat('sw-TZ', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
  }).format(amount);
}

function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function getStatusIcon(status: Purchase['status']) {
  switch (status) {
    case 'pending':
      return <Clock className="w-5 h-5 text-yellow-400" />;
    case 'processing':
      return <RotateCcw className="w-5 h-5 text-blue-400 animate-spin" />;
    case 'shipped':
      return <Package className="w-5 h-5 text-purple-400" />;
    case 'delivered':
      return <CheckCircle className="w-5 h-5 text-green-400" />;
    case 'cancelled':
      return <XCircle className="w-5 h-5 text-red-400" />;
    default:
      return <Clock className="w-5 h-5 text-gray-400" />;
  }
}

function getStatusColor(status: Purchase['status']) {
  switch (status) {
    case 'pending':
      return 'text-yellow-400';
    case 'processing':
      return 'text-blue-400';
    case 'shipped':
      return 'text-purple-400';
    case 'delivered':
      return 'text-green-400';
    case 'cancelled':
      return 'text-red-400';
    default:
      return 'text-gray-400';
  }
}

export default function PurchasesPage() {
  const navigate = useNavigate();
  const [purchases] = useState<Purchase[]>(mockPurchases);
  const [filter, setFilter] = useState<'all' | Purchase['status']>('all');

  const filteredPurchases = purchases.filter(
    purchase => filter === 'all' || purchase.status === filter
  );

  const handleOrderClick = (orderId: string) => {
    navigate(`/order/${orderId}`);
  };

  const handleReorder = (purchase: Purchase) => {
    console.log('Reorder:', purchase.id);
  };

  const handleTrackOrder = (orderId: string) => {
    navigate(`/order/${orderId}/track`);
  };

  const statusFilters = [
    { key: 'all', label: 'All', count: purchases.length },
    { key: 'pending', label: 'Pending', count: purchases.filter(p => p.status === 'pending').length },
    { key: 'processing', label: 'Processing', count: purchases.filter(p => p.status === 'processing').length },
    { key: 'delivered', label: 'Delivered', count: purchases.filter(p => p.status === 'delivered').length },
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
            <h1 className="text-xl font-bold text-white">My Purchases</h1>
            <p className="text-sm text-white/60">{purchases.length} orders</p>
          </div>
          <button 
            onClick={() => navigate('/shop')}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <ShoppingBag className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>

      {/* Status Filters */}
      <div className="p-4 border-b border-white/10">
        <div className="flex space-x-2 overflow-x-auto hide-scrollbar">
          {statusFilters.map((statusFilter) => (
            <button
              key={statusFilter.key}
              onClick={() => setFilter(statusFilter.key as typeof filter)}
              className={cn(
                'flex items-center space-x-2 px-4 py-2 rounded-full whitespace-nowrap transition-all',
                filter === statusFilter.key
                  ? 'bg-accent-500 text-white'
                  : 'bg-white/10 text-white/60 hover:bg-white/20'
              )}
            >
              <span className="font-medium">{statusFilter.label}</span>
              <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">
                {statusFilter.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {filteredPurchases.length > 0 ? (
          <div className="space-y-4">
            {filteredPurchases.map((purchase) => (
              <div 
                key={purchase.id} 
                className="card-gem p-4 cursor-pointer hover:bg-white/5 transition-colors"
                onClick={() => handleOrderClick(purchase.id)}
              >
                <div className="flex space-x-4">
                  {/* Product Image */}
                  <div className="w-16 h-16 bg-white/10 rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={purchase.image}
                      alt={purchase.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-white font-semibold text-sm truncate">
                          {purchase.title}
                        </h3>
                        <p className="text-white/60 text-xs truncate">
                          {purchase.description}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2 ml-2">
                        {getStatusIcon(purchase.status)}
                        <span className={cn('text-xs font-medium capitalize', getStatusColor(purchase.status))}>
                          {purchase.status}
                        </span>
                      </div>
                    </div>

                    {/* Seller Info */}
                    <div className="flex items-center space-x-2 mb-2">
                      <img
                        src={purchase.seller.avatar}
                        alt={purchase.seller.displayName}
                        className="w-4 h-4 rounded-full"
                      />
                      <span className="text-white/60 text-xs">@{purchase.seller.username}</span>
                    </div>

                    {/* Price and Date */}
                    <div className="flex items-center justify-between">
                      <div className="text-accent-400 font-bold text-sm">
                        {formatCurrency(purchase.price, purchase.currency)}
                        {purchase.quantity > 1 && (
                          <span className="text-white/60 text-xs ml-1">x{purchase.quantity}</span>
                        )}
                      </div>
                      <div className="text-white/60 text-xs">
                        {formatDate(purchase.orderDate)}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex space-x-2 mt-3">
                      {purchase.status === 'delivered' && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleReorder(purchase);
                          }}
                          className="flex-1 btn-gem-outline text-xs py-2"
                        >
                          Reorder
                        </button>
                      )}
                      {(purchase.status === 'processing' || purchase.status === 'shipped') && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleTrackOrder(purchase.id);
                          }}
                          className="flex-1 btn-gem text-xs py-2"
                        >
                          Track Order
                        </button>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOrderClick(purchase.id);
                        }}
                        className="flex-1 btn-gem-outline text-xs py-2"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-white/10 rounded-full flex-center mx-auto mb-4">
              <ShoppingBag className="w-10 h-10 text-white/40" />
            </div>
            <h3 className="text-white font-semibold mb-2">No purchases yet</h3>
            <p className="text-white/60 text-sm mb-6">
              Your purchases will appear here
            </p>
            <button 
              onClick={() => navigate('/shop')}
              className="btn-gem px-6 py-3"
            >
              Start Shopping
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
