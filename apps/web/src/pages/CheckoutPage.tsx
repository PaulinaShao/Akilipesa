import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  ArrowLeft, 
  CreditCard, 
  Smartphone, 
  Wallet,
  Shield,
  CheckCircle,
  AlertCircle,
  Lock,
  Trash2,
  Plus,
  Minus,
  Gift
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface CheckoutItem {
  id: string;
  title: string;
  price: number;
  currency: string;
  quantity: number;
  image: string;
  creator: string;
}

interface PaymentMethod {
  id: string;
  type: 'mpesa' | 'card' | 'wallet' | 'bank';
  name: string;
  icon: React.ComponentType<any>;
  description: string;
  available: boolean;
}

export default function CheckoutPage() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [items, setItems] = useState<CheckoutItem[]>(
    location.state?.items || [
      {
        id: '1',
        title: 'AI-Powered Mathematics Tutoring',
        price: 15000,
        currency: 'TSH',
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=150&h=150&fit=crop',
        creator: 'Dr. Amina Hassan'
      }
    ]
  );

  const [selectedPayment, setSelectedPayment] = useState<string>('mpesa');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [showPromoCode, setShowPromoCode] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [promoDiscount, setPromoDiscount] = useState(0);

  const paymentMethods: PaymentMethod[] = [
    {
      id: 'mpesa',
      type: 'mpesa',
      name: 'M-Pesa',
      icon: Smartphone,
      description: 'Pay with your mobile money account',
      available: true
    },
    {
      id: 'wallet',
      type: 'wallet',
      name: 'AkiliPesa Wallet',
      icon: Wallet,
      description: 'Use your wallet balance',
      available: true
    },
    {
      id: 'card',
      type: 'card',
      name: 'Debit/Credit Card',
      icon: CreditCard,
      description: 'Visa, Mastercard accepted',
      available: true
    }
  ];

  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const processingFee = Math.round(subtotal * 0.02); // 2% processing fee
  const discount = Math.round(subtotal * (promoDiscount / 100));
  const total = subtotal + processingFee - discount;

  const formatPrice = (price: number, currency: string = 'TSH') => {
    return `${price.toLocaleString()} ${currency}`;
  };

  const updateQuantity = (itemId: string, change: number) => {
    setItems(prev => prev.map(item => 
      item.id === itemId 
        ? { ...item, quantity: Math.max(1, item.quantity + change) }
        : item
    ));
  };

  const removeItem = (itemId: string) => {
    setItems(prev => prev.filter(item => item.id !== itemId));
  };

  const applyPromoCode = () => {
    // Mock promo code validation
    const validCodes: Record<string, number> = {
      'SAVE10': 10,
      'WELCOME20': 20,
      'STUDENT15': 15
    };

    const discount = validCodes[promoCode.toUpperCase()];
    if (discount) {
      setPromoDiscount(discount);
      setShowPromoCode(false);
      setPromoCode('');
    } else {
      // Show error
      console.log('Invalid promo code');
    }
  };

  const handlePayment = async () => {
    if (selectedPayment === 'mpesa' && !phoneNumber) {
      return;
    }

    setIsProcessing(true);

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      console.log('Processing payment:', {
        method: selectedPayment,
        amount: total,
        items: items.map(item => ({ id: item.id, quantity: item.quantity })),
        phoneNumber: selectedPayment === 'mpesa' ? phoneNumber : undefined
      });

      setOrderComplete(true);
    } catch (error) {
      console.error('Payment failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  if (orderComplete) {
    return (
      <div className="h-screen-safe bg-gradient-to-b from-green-500 to-emerald-600 flex items-center justify-center p-6">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="text-center text-white"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
            className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle className="w-12 h-12 text-white" />
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-3xl font-bold mb-4"
          >
            Order Complete!
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="text-white/90 mb-8 max-w-sm"
          >
            Your payment was successful. You'll receive access details via email and SMS.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="space-y-3"
          >
            <button
              onClick={() => navigate('/purchases')}
              className="w-full bg-white/20 hover:bg-white/30 text-white py-3 px-6 rounded-xl font-semibold transition-colors"
            >
              View My Purchases
            </button>
            <button
              onClick={() => navigate('/reels')}
              className="w-full bg-white hover:bg-white/90 text-green-600 py-3 px-6 rounded-xl font-semibold transition-colors"
            >
              Continue Browsing
            </button>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="h-screen-safe bg-white flex items-center justify-center p-6">
        <div className="text-center">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Gift className="w-12 h-12 text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">Add some amazing AI services to get started!</p>
          <button
            onClick={() => navigate('/shop')}
            className="bg-primary hover:bg-primary/90 text-white py-3 px-6 rounded-xl font-semibold transition-colors"
          >
            Browse Shop
          </button>
        </div>
      </div>
    );
  }

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
          
          <h1 className="text-xl font-bold">Checkout</h1>
          
          <div className="w-10" />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Order Items */}
        <div className="p-4">
          <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
          
          <div className="space-y-4 mb-6">
            {items.map((item) => (
              <div key={item.id} className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-start space-x-3">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  
                  <div className="flex-1">
                    <h3 className="font-semibold mb-1 line-clamp-2">{item.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">by {item.creator}</p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-1 bg-white rounded-lg">
                          <button
                            onClick={() => updateQuantity(item.id, -1)}
                            className="p-2 hover:bg-gray-100 rounded-l-lg transition-colors"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="px-3 py-2 font-medium">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, 1)}
                            className="p-2 hover:bg-gray-100 rounded-r-lg transition-colors"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <span className="font-bold text-lg">
                          {formatPrice(item.price * item.quantity, item.currency)}
                        </span>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="p-1 text-red-500 hover:bg-red-50 rounded transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Promo Code */}
          <div className="mb-6">
            {!showPromoCode ? (
              <button
                onClick={() => setShowPromoCode(true)}
                className="text-primary font-medium hover:underline"
              >
                Have a promo code?
              </button>
            ) : (
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex space-x-3">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="Enter promo code"
                    className="flex-1 p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                  <button
                    onClick={applyPromoCode}
                    className="px-6 py-3 bg-primary hover:bg-primary/90 text-white rounded-lg font-medium transition-colors"
                  >
                    Apply
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Payment Methods */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-4">Payment Method</h2>
            
            <div className="space-y-3">
              {paymentMethods.map((method) => (
                <button
                  key={method.id}
                  onClick={() => setSelectedPayment(method.id)}
                  disabled={!method.available}
                  className={cn(
                    'w-full p-4 border-2 rounded-xl transition-colors text-left',
                    selectedPayment === method.id
                      ? 'border-primary bg-primary/5'
                      : 'border-gray-200 hover:border-gray-300',
                    !method.available && 'opacity-50 cursor-not-allowed'
                  )}
                >
                  <div className="flex items-center space-x-3">
                    <method.icon className="w-6 h-6 text-primary" />
                    <div className="flex-1">
                      <h3 className="font-semibold">{method.name}</h3>
                      <p className="text-sm text-gray-600">{method.description}</p>
                    </div>
                    {selectedPayment === method.id && (
                      <CheckCircle className="w-6 h-6 text-primary" />
                    )}
                  </div>
                </button>
              ))}
            </div>

            {/* M-Pesa Phone Number */}
            {selectedPayment === 'mpesa' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-4 p-4 bg-green-50 rounded-xl"
              >
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  M-Pesa Phone Number
                </label>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="+255 XXX XXX XXX"
                  className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500"
                />
                <p className="text-xs text-gray-600 mt-2">
                  You'll receive an M-Pesa prompt on this number
                </p>
              </motion.div>
            )}
          </div>

          {/* Order Total */}
          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <h3 className="font-semibold mb-3">Order Total</h3>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              
              <div className="flex justify-between text-sm text-gray-600">
                <span>Processing fee</span>
                <span>{formatPrice(processingFee)}</span>
              </div>
              
              {promoDiscount > 0 && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>Discount ({promoDiscount}%)</span>
                  <span>-{formatPrice(discount)}</span>
                </div>
              )}
              
              <div className="border-t border-gray-200 pt-2 mt-2">
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span className="text-primary">{formatPrice(total)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Security Notice */}
          <div className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
            <Shield className="w-4 h-4" />
            <span>Your payment is secured with 256-bit SSL encryption</span>
          </div>
        </div>
      </div>

      {/* Payment Button */}
      <div className="sticky bottom-0 bg-white border-t border-gray-100 p-4 safe-bottom">
        <button
          onClick={handlePayment}
          disabled={isProcessing || (selectedPayment === 'mpesa' && !phoneNumber)}
          className="w-full bg-primary hover:bg-primary/90 text-white py-4 rounded-xl font-bold text-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
        >
          {isProcessing ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Processing Payment...</span>
            </>
          ) : (
            <>
              <Lock className="w-5 h-5" />
              <span>Pay {formatPrice(total)}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
