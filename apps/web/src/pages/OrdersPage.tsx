import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Package, Truck, MapPin, Phone, MessageCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface OrderStatus {
  status: 'confirmed' | 'preparing' | 'shipped' | 'delivered';
  steps: Array<{
    label: string;
    completed: boolean;
    date?: string;
  }>;
}

interface OrderDetails {
  id: string;
  date: string;
  status: OrderStatus;
  item: {
    id: string;
    name: string;
    price: string;
    currency: string;
    image: string;
    quantity: number;
  };
  seller: {
    id: string;
    name: string;
    phone: string;
  };
  delivery: {
    address: string;
    phone: string;
    estimatedDate: string;
    fee: string;
  };
  total: number;
  trackingNumber?: string;
}

export default function OrdersPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [order, setOrder] = useState<OrderDetails | null>(null);

  useEffect(() => {
    // If coming from checkout, use the state data
    if (location.state) {
      const { orderItem, deliveryInfo, total } = location.state;
      const newOrder: OrderDetails = {
        id: id || `ORDER_${Date.now()}`,
        date: new Date().toISOString().split('T')[0],
        status: {
          status: 'confirmed',
          steps: [
            { label: 'Order Confirmed', completed: true, date: new Date().toLocaleString() },
            { label: 'Preparing Order', completed: false },
            { label: 'Order Shipped', completed: false },
            { label: 'Delivered', completed: false }
          ]
        },
        item: {
          id: orderItem.id,
          name: orderItem.name,
          price: orderItem.price,
          currency: orderItem.currency,
          image: orderItem.image,
          quantity: orderItem.quantity
        },
        seller: {
          id: orderItem.seller.id,
          name: orderItem.seller.name,
          phone: '+255 754 123 456'
        },
        delivery: {
          address: deliveryInfo.address,
          phone: deliveryInfo.phone,
          estimatedDate: deliveryInfo.estimatedDelivery,
          fee: deliveryInfo.deliveryFee
        },
        total,
        trackingNumber: `TZ${Date.now().toString().slice(-8)}`
      };
      setOrder(newOrder);
    }
  }, [id, location.state]);

  const formatPrice = (price: number | string) => {
    const numPrice = typeof price === 'string' ? parseInt(price) : price;
    return new Intl.NumberFormat('en-TZ').format(numPrice);
  };

  const handleContactSeller = () => {
    if (order) {
      navigate(`/chat/${order.seller.id}`);
    }
  };

  const handleCallSeller = () => {
    if (order?.seller.phone) {
      window.open(`tel:${order.seller.phone}`);
    }
  };

  if (!order) {
    return (
      <div className="min-h-screen-safe bg-gradient-to-b from-bg-primary to-bg-secondary flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white">Loading order details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen-safe bg-gradient-to-b from-bg-primary to-bg-secondary">
      {/* Header */}
      <div className="safe-top p-4 flex items-center glass border-b border-white/10">
        <button 
          onClick={() => navigate('/reels')}
          className="p-2 hover:bg-white/10 rounded-full transition-colors mr-3"
        >
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>
        <h1 className="text-xl font-bold text-white">Order Details</h1>
      </div>

      <div className="p-6 space-y-6">
        {/* Order Confirmation */}
        <div className="text-center">
          <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-10 h-10 text-green-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Order Confirmed!</h2>
          <p className="text-white/70">Your order has been placed successfully</p>
          <p className="text-white/50 text-sm">Order #{order.id}</p>
        </div>

        {/* Order Status */}
        <div className="card">
          <h3 className="text-lg font-semibold text-white mb-4">Order Status</h3>
          
          <div className="space-y-4">
            {order.status.steps.map((step, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className={cn(
                  'w-6 h-6 rounded-full flex items-center justify-center mt-0.5',
                  step.completed 
                    ? 'bg-primary' 
                    : 'border-2 border-white/20'
                )}>
                  {step.completed && (
                    <CheckCircle className="w-4 h-4 text-white" />
                  )}
                </div>
                <div className="flex-1">
                  <p className={cn(
                    'font-medium',
                    step.completed ? 'text-white' : 'text-white/50'
                  )}>
                    {step.label}
                  </p>
                  {step.date && (
                    <p className="text-white/50 text-sm">{step.date}</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {order.trackingNumber && (
            <div className="mt-4 p-3 glass rounded-xl">
              <p className="text-white/70 text-sm">Tracking Number</p>
              <p className="text-white font-mono">{order.trackingNumber}</p>
            </div>
          )}
        </div>

        {/* Order Item */}
        <div className="card">
          <h3 className="text-lg font-semibold text-white mb-4">Order Items</h3>
          
          <div className="flex space-x-4">
            <img 
              src={order.item.image}
              alt={order.item.name}
              className="w-20 h-20 rounded-xl object-cover"
            />
            <div className="flex-1">
              <h4 className="font-semibold text-white">{order.item.name}</h4>
              <p className="text-white/60 text-sm">Quantity: {order.item.quantity}</p>
              <p className="text-accent font-bold mt-2">
                {formatPrice(order.item.price)} {order.item.currency}
              </p>
            </div>
          </div>
        </div>

        {/* Seller Information */}
        <div className="card">
          <h3 className="text-lg font-semibold text-white mb-4">Seller</h3>
          
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="font-semibold text-white">{order.seller.name}</p>
              <p className="text-white/60 text-sm">{order.seller.phone}</p>
            </div>
          </div>
          
          <div className="flex space-x-3">
            <button 
              onClick={handleContactSeller}
              className="flex-1 btn-secondary py-3 flex items-center justify-center space-x-2"
            >
              <MessageCircle className="w-5 h-5" />
              <span>Chat</span>
            </button>
            <button 
              onClick={handleCallSeller}
              className="flex-1 btn-secondary py-3 flex items-center justify-center space-x-2"
            >
              <Phone className="w-5 h-5" />
              <span>Call</span>
            </button>
          </div>
        </div>

        {/* Delivery Information */}
        <div className="card">
          <h3 className="text-lg font-semibold text-white mb-4">Delivery Information</h3>
          
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <MapPin className="w-5 h-5 text-white/60 mt-0.5" />
              <div>
                <p className="text-white">{order.delivery.address}</p>
                <p className="text-white/60 text-sm">{order.delivery.phone}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Truck className="w-5 h-5 text-white/60" />
              <span className="text-white/70">
                Estimated delivery: {order.delivery.estimatedDate}
              </span>
            </div>
          </div>
        </div>

        {/* Payment Summary */}
        <div className="card">
          <h3 className="text-lg font-semibold text-white mb-4">Payment Summary</h3>
          
          <div className="space-y-2">
            <div className="flex justify-between text-white/70">
              <span>Subtotal</span>
              <span>
                {formatPrice(parseInt(order.item.price) * order.item.quantity)} {order.item.currency}
              </span>
            </div>
            <div className="flex justify-between text-white/70">
              <span>Delivery</span>
              <span>{formatPrice(order.delivery.fee)} {order.item.currency}</span>
            </div>
            <div className="flex justify-between text-white font-bold text-lg border-t border-white/20 pt-2">
              <span>Total Paid</span>
              <span>{formatPrice(order.total)} {order.item.currency}</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <button 
            onClick={() => navigate('/reels')}
            className="w-full btn-primary py-3"
          >
            Continue Shopping
          </button>
          
          <button 
            onClick={() => navigate('/orders')}
            className="w-full btn-secondary py-3"
          >
            View All Orders
          </button>
        </div>
      </div>
    </div>
  );
}
