import { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Minus, Plus, CreditCard, Smartphone, MapPin, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface OrderItem {
  id: string;
  name: string;
  price: string;
  currency: string;
  image: string;
  quantity: number;
  seller: {
    id: string;
    name: string;
  };
}

interface DeliveryInfo {
  address: string;
  phone: string;
  estimatedDelivery: string;
  deliveryFee: string;
}

// Mock order data
const mockOrderItem: OrderItem = {
  id: '1',
  name: 'Traditional Kitenge Dress',
  price: '85,000',
  currency: 'TSH',
  image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop',
  quantity: 1,
  seller: {
    id: 'seller1',
    name: 'Amina Hassan'
  }
};

const mockDeliveryInfo: DeliveryInfo = {
  address: 'Mikocheni, Dar es Salaam',
  phone: '+255 754 123 456',
  estimatedDelivery: '2-3 business days',
  deliveryFee: '5,000'
};

export default function CheckoutPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialQty = parseInt(searchParams.get('qty') || '1');
  
  const [orderItem, setOrderItem] = useState<OrderItem>({ ...mockOrderItem, quantity: initialQty });
  const [deliveryInfo] = useState<DeliveryInfo>(mockDeliveryInfo);
  const [paymentMethod, setPaymentMethod] = useState<'mobile' | 'card'>('mobile');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const updateQuantity = (newQuantity: number) => {
    if (newQuantity > 0) {
      setOrderItem(prev => ({ ...prev, quantity: newQuantity }));
    }
  };

  const formatPrice = (price: string) => {
    return new Intl.NumberFormat('en-TZ').format(parseInt(price));
  };

  const calculateSubtotal = () => {
    return parseInt(orderItem.price) * orderItem.quantity;
  };

  const calculateTotal = () => {
    return calculateSubtotal() + parseInt(deliveryInfo.deliveryFee);
  };

  const startCheckout = async () => {
    setIsProcessing(true);
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate order ID
      const orderId = `ORDER_${Date.now()}`;
      
      // Navigate to order confirmation
      navigate(`/orders/${orderId}`, { 
        state: { 
          orderItem, 
          deliveryInfo, 
          total: calculateTotal() 
        } 
      });
      
    } catch (error) {
      console.error('Payment failed:', error);
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen-safe bg-gradient-to-b from-bg-primary to-bg-secondary">
      {/* Header */}
      <div className="safe-top p-4 flex items-center glass border-b border-white/10">
        <button 
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-white/10 rounded-full transition-colors mr-3"
        >
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>
        <h1 className="text-xl font-bold text-white">Checkout</h1>
      </div>

      <div className="p-6 space-y-6">
        {/* Order Summary */}
        <div className="card">
          <h2 className="text-lg font-semibold text-white mb-4">Order Summary</h2>
          
          <div className="flex space-x-4 mb-4">
            <img 
              src={orderItem.image}
              alt={orderItem.name}
              className="w-20 h-20 rounded-xl object-cover"
            />
            <div className="flex-1">
              <h3 className="font-semibold text-white">{orderItem.name}</h3>
              <p className="text-white/60 text-sm">by {orderItem.seller.name}</p>
              <div className="flex items-center justify-between mt-2">
                <span className="text-accent font-bold">
                  {formatPrice(orderItem.price)} {orderItem.currency}
                </span>
                
                {/* Quantity Selector */}
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => updateQuantity(orderItem.quantity - 1)}
                    className="p-1 glass rounded-full hover:bg-white/10 transition-colors"
                  >
                    <Minus className="w-4 h-4 text-white" />
                  </button>
                  <span className="text-white font-semibold w-8 text-center">
                    {orderItem.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(orderItem.quantity + 1)}
                    className="p-1 glass rounded-full hover:bg-white/10 transition-colors"
                  >
                    <Plus className="w-4 h-4 text-white" />
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Price Breakdown */}
          <div className="border-t border-white/20 pt-4 space-y-2">
            <div className="flex justify-between text-white/70">
              <span>Subtotal</span>
              <span>{formatPrice(calculateSubtotal().toString())} {orderItem.currency}</span>
            </div>
            <div className="flex justify-between text-white/70">
              <span>Delivery</span>
              <span>{formatPrice(deliveryInfo.deliveryFee)} {orderItem.currency}</span>
            </div>
            <div className="flex justify-between text-white font-bold text-lg border-t border-white/20 pt-2">
              <span>Total</span>
              <span>{formatPrice(calculateTotal().toString())} {orderItem.currency}</span>
            </div>
          </div>
        </div>

        {/* Delivery Information */}
        <div className="card">
          <h2 className="text-lg font-semibold text-white mb-4">Delivery Information</h2>
          
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <MapPin className="w-5 h-5 text-white/60 mt-0.5" />
              <div>
                <p className="text-white">{deliveryInfo.address}</p>
                <p className="text-white/60 text-sm">{deliveryInfo.phone}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Clock className="w-5 h-5 text-white/60" />
              <span className="text-white/70">
                Estimated delivery: {deliveryInfo.estimatedDelivery}
              </span>
            </div>
          </div>
          
          <button className="w-full mt-4 py-3 border border-white/20 rounded-xl text-white/70 hover:bg-white/5 transition-colors">
            Change Address
          </button>
        </div>

        {/* Payment Method */}
        <div className="card">
          <h2 className="text-lg font-semibold text-white mb-4">Payment Method</h2>
          
          <div className="space-y-3 mb-4">
            <button
              onClick={() => setPaymentMethod('mobile')}
              className={cn(
                'w-full p-4 rounded-xl border-2 transition-all',
                paymentMethod === 'mobile'
                  ? 'border-primary bg-primary/10'
                  : 'border-white/20 hover:border-white/30'
              )}
            >
              <div className="flex items-center space-x-3">
                <Smartphone className="w-6 h-6 text-white" />
                <div className="text-left">
                  <p className="font-semibold text-white">Mobile Money</p>
                  <p className="text-white/60 text-sm">M-Pesa, Tigo Pesa, Airtel Money</p>
                </div>
              </div>
            </button>
            
            <button
              onClick={() => setPaymentMethod('card')}
              className={cn(
                'w-full p-4 rounded-xl border-2 transition-all',
                paymentMethod === 'card'
                  ? 'border-primary bg-primary/10'
                  : 'border-white/20 hover:border-white/30'
              )}
            >
              <div className="flex items-center space-x-3">
                <CreditCard className="w-6 h-6 text-white" />
                <div className="text-left">
                  <p className="font-semibold text-white">Credit/Debit Card</p>
                  <p className="text-white/60 text-sm">Visa, Mastercard</p>
                </div>
              </div>
            </button>
          </div>

          {paymentMethod === 'mobile' && (
            <div>
              <label className="block text-white font-medium mb-2">Phone Number</label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="255 754 123 456"
                className="w-full px-4 py-3 rounded-xl glass text-white placeholder:text-white/50 border border-white/20 focus:border-primary transition-all focus:outline-none"
              />
              <p className="text-white/50 text-xs mt-2">
                You'll receive a prompt on your phone to complete the payment
              </p>
            </div>
          )}
        </div>

        {/* Payment Button */}
        <button
          onClick={startCheckout}
          disabled={isProcessing || (paymentMethod === 'mobile' && !phoneNumber)}
          className="w-full btn-primary py-4 text-lg font-semibold disabled:opacity-50"
        >
          {isProcessing ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Processing Payment...</span>
            </div>
          ) : (
            `Pay ${formatPrice(calculateTotal().toString())} ${orderItem.currency}`
          )}
        </button>

        <div className="text-center">
          <p className="text-white/40 text-xs leading-relaxed">
            By proceeding, you agree to our Terms of Service and Privacy Policy.
            Your payment is secured and encrypted.
          </p>
        </div>
      </div>
    </div>
  );
}
