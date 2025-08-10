import { useState, useEffect } from 'react';
import { CreditCard, Plus, Download, Check, Clock, X } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/Card';
import { getMockUser, getMockPayments, Payment } from '@/lib/mock-data';
import { formatCurrency, formatDate } from '@/lib/utils';
import { useToast } from '@/hooks/useToast';

interface PricingPlan {
  name: string;
  price: number;
  credits: number;
  features: string[];
  popular?: boolean;
}

export default function BillingPage() {
  const [user] = useState(getMockUser());
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'tigo_pesa' | 'airtel_money' | 'vodacom_mpesa'>('tigo_pesa');
  const { addToast } = useToast();

  useEffect(() => {
    loadPayments();
  }, []);

  const loadPayments = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setPayments(getMockPayments());
    setIsLoading(false);
  };

  const pricingPlans: PricingPlan[] = [
    {
      name: 'Starter',
      price: 5000,
      credits: 50,
      features: [
        '50 AI Credits',
        '5 Voice Calls',
        '10 Content Generations',
        'Basic Support',
      ],
    },
    {
      name: 'Professional',
      price: 15000,
      credits: 200,
      features: [
        '200 AI Credits',
        '20 Voice Calls',
        '50 Content Generations',
        'Priority Support',
        'Advanced Analytics',
      ],
      popular: true,
    },
    {
      name: 'Enterprise',
      price: 35000,
      credits: 500,
      features: [
        '500 AI Credits',
        'Unlimited Voice Calls',
        'Unlimited Content Generations',
        '24/7 Support',
        'Custom Integrations',
        'Team Management',
      ],
    },
  ];

  const handlePurchase = async (plan: PricingPlan) => {
    setSelectedPlan(plan.name);
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const newPayment: Payment = {
        id: `pay_${Date.now()}`,
        amount: plan.price,
        currency: 'TSH',
        method: paymentMethod,
        status: 'completed',
        createdAt: new Date(),
        description: `${plan.name} plan - ${plan.credits} credits`,
      };
      
      setPayments(prev => [newPayment, ...prev]);
      
      addToast({
        type: 'success',
        title: 'Payment Successful',
        description: `${plan.credits} credits have been added to your account`,
      });
      
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Payment Failed',
        description: 'Unable to process payment. Please try again.',
      });
    } finally {
      setSelectedPlan(null);
    }
  };

  const getStatusIcon = (status: Payment['status']) => {
    switch (status) {
      case 'completed':
        return <Check className="w-5 h-5 text-success" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-warning" />;
      case 'failed':
        return <X className="w-5 h-5 text-danger" />;
    }
  };

  const getStatusColor = (status: Payment['status']) => {
    switch (status) {
      case 'completed':
        return 'text-success bg-success/10';
      case 'pending':
        return 'text-warning bg-warning/10';
      case 'failed':
        return 'text-danger bg-danger/10';
    }
  };

  const getMethodName = (method: Payment['method']) => {
    switch (method) {
      case 'tigo_pesa':
        return 'Tigo Pesa';
      case 'airtel_money':
        return 'Airtel Money';
      case 'vodacom_mpesa':
        return 'Vodacom M-Pesa';
    }
  };

  if (isLoading) {
    return (
      <div className="container-responsive section-padding">
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-slate-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-64 bg-slate-200 rounded-tanzanite"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-responsive section-padding">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="heading-2 mb-4">Billing & Credits</h1>
        <p className="text-slate-600 max-w-2xl mx-auto">
          Manage your credits, view payment history, and upgrade your plan for more AI capabilities
        </p>
      </div>

      {/* Current Balance */}
      <Card variant="gradient" className="mb-12">
        <CardContent>
          <div className="text-center">
            <h2 className="text-4xl font-bold text-primary-600 mb-2">
              {user.credits}
            </h2>
            <p className="text-slate-600 mb-4">Available Credits</p>
            <div className="flex items-center justify-center space-x-4 text-sm text-slate-500">
              <span>Plan: {user.plan.charAt(0).toUpperCase() + user.plan.slice(1)}</span>
              <span>•</span>
              <span>Member since {formatDate(user.createdAt).split(',')[0]}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pricing Plans */}
      <div className="mb-12">
        <h2 className="heading-3 text-center mb-8">Choose Your Plan</h2>
        
        {/* Payment Method Selection */}
        <div className="max-w-md mx-auto mb-8">
          <label className="block text-sm font-medium text-slate-700 mb-3">
            Payment Method
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { value: 'tigo_pesa', label: 'Tigo Pesa' },
              { value: 'airtel_money', label: 'Airtel Money' },
              { value: 'vodacom_mpesa', label: 'M-Pesa' },
            ].map((method) => (
              <button
                key={method.value}
                onClick={() => setPaymentMethod(method.value as any)}
                className={`p-3 text-sm rounded-lg border-2 transition-all ${
                  paymentMethod === method.value
                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                {method.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pricingPlans.map((plan, index) => (
            <Card key={index} variant={plan.popular ? 'glow' : 'default'} className="relative">
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-primary-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </span>
                </div>
              )}
              
              <CardHeader>
                <div className="text-center">
                  <h3 className="heading-3 mb-2">{plan.name}</h3>
                  <div className="mb-4">
                    <span className="text-3xl font-bold text-primary-600">
                      {formatCurrency(plan.price)}
                    </span>
                  </div>
                  <p className="text-slate-600">{plan.credits} AI Credits</p>
                </div>
              </CardHeader>

              <CardContent>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center space-x-2">
                      <Check className="w-5 h-5 text-success flex-shrink-0" />
                      <span className="text-slate-600">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <button
                  onClick={() => handlePurchase(plan)}
                  disabled={selectedPlan === plan.name}
                  className={`w-full ${plan.popular ? 'btn-primary' : 'btn-secondary'}`}
                >
                  {selectedPlan === plan.name ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current" />
                      <span>Processing...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center space-x-2">
                      <Plus className="w-4 h-4" />
                      <span>Purchase Plan</span>
                    </div>
                  )}
                </button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Payment History */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="heading-3">Payment History</h2>
          <button className="btn-secondary flex items-center space-x-2">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>

        <Card>
          <CardContent className="p-0">
            {payments.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="text-left p-4 font-medium text-slate-700">Date</th>
                      <th className="text-left p-4 font-medium text-slate-700">Description</th>
                      <th className="text-left p-4 font-medium text-slate-700">Method</th>
                      <th className="text-left p-4 font-medium text-slate-700">Amount</th>
                      <th className="text-left p-4 font-medium text-slate-700">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments.map((payment) => (
                      <tr key={payment.id} className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="p-4 text-slate-600">
                          {formatDate(payment.createdAt)}
                        </td>
                        <td className="p-4 text-slate-900">
                          {payment.description}
                        </td>
                        <td className="p-4 text-slate-600">
                          {getMethodName(payment.method)}
                        </td>
                        <td className="p-4 font-medium text-slate-900">
                          {formatCurrency(payment.amount)}
                        </td>
                        <td className="p-4">
                          <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(payment.status)}`}>
                            {getStatusIcon(payment.status)}
                            <span className="capitalize">{payment.status}</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12">
                <CreditCard className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                <h3 className="heading-3 mb-2">No payments yet</h3>
                <p className="text-slate-600">Your payment history will appear here</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
