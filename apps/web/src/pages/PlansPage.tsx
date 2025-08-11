import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Check, 
  Crown, 
  Star, 
  Zap, 
  Users, 
  Shield,
  Smartphone,
  MessageCircle,
  TrendingUp
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/store';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/queryClient';

interface Plan {
  id: string;
  name: string;
  tier: 'free' | 'starter' | 'premium' | 'business';
  price: number;
  currency: string;
  billingPeriod: 'monthly' | 'yearly';
  description: string;
  features: string[];
  limits: {
    aiMessages: number;
    videoCalls: number;
    audioMessages: number;
    fileUploads: number;
    customAI: boolean;
    prioritySupport: boolean;
    analytics: boolean;
    commission: number;
  };
  popular?: boolean;
  color: string;
  icon: any;
}

const mockPlans: Plan[] = [
  {
    id: 'free',
    name: 'Free',
    tier: 'free',
    price: 0,
    currency: 'TSH',
    billingPeriod: 'monthly',
    description: 'Perfect for getting started with AkiliPesa',
    features: [
      '10 AI messages per month',
      'Basic customer support',
      'Public profile',
      'Standard commission rates',
      'Mobile app access',
    ],
    limits: {
      aiMessages: 10,
      videoCalls: 0,
      audioMessages: 5,
      fileUploads: 0,
      customAI: false,
      prioritySupport: false,
      analytics: false,
      commission: 5,
    },
    color: 'from-gray-500 to-gray-600',
    icon: Star,
  },
  {
    id: 'starter',
    name: 'Starter',
    tier: 'starter',
    price: 25000,
    currency: 'TSH',
    billingPeriod: 'monthly',
    description: 'Great for individual creators and small businesses',
    features: [
      '100 AI messages per month',
      '5 video calls per month',
      'Unlimited audio messages',
      'File uploads (images, docs)',
      'Priority customer support',
      'Basic analytics',
      'Verified badge',
    ],
    limits: {
      aiMessages: 100,
      videoCalls: 5,
      audioMessages: -1,
      fileUploads: 50,
      customAI: false,
      prioritySupport: true,
      analytics: true,
      commission: 10,
    },
    color: 'from-blue-500 to-blue-600',
    icon: Zap,
  },
  {
    id: 'premium',
    name: 'Premium',
    tier: 'premium',
    price: 75000,
    currency: 'TSH',
    billingPeriod: 'monthly',
    description: 'Perfect for growing businesses and power users',
    features: [
      'Unlimited AI messages',
      'Unlimited video calls',
      'Unlimited audio messages',
      'Unlimited file uploads',
      'Custom AI training',
      'Advanced analytics',
      'API access',
      'White-label options',
    ],
    limits: {
      aiMessages: -1,
      videoCalls: -1,
      audioMessages: -1,
      fileUploads: -1,
      customAI: true,
      prioritySupport: true,
      analytics: true,
      commission: 15,
    },
    popular: true,
    color: 'from-purple-500 to-purple-600',
    icon: Crown,
  },
  {
    id: 'business',
    name: 'Business',
    tier: 'business',
    price: 150000,
    currency: 'TSH',
    billingPeriod: 'monthly',
    description: 'Enterprise-grade features for large organizations',
    features: [
      'Everything in Premium',
      'Team collaboration tools',
      'Advanced AI models',
      'Custom integrations',
      'Dedicated account manager',
      'SLA guarantee',
      'Custom reporting',
      'Multi-location support',
    ],
    limits: {
      aiMessages: -1,
      videoCalls: -1,
      audioMessages: -1,
      fileUploads: -1,
      customAI: true,
      prioritySupport: true,
      analytics: true,
      commission: 20,
    },
    color: 'from-yellow-500 to-yellow-600',
    icon: Users,
  },
];

export default function PlansPage() {
  const navigate = useNavigate();
  const { user } = useAppStore();
  const queryClient = useQueryClient();
  const [selectedBilling, setSelectedBilling] = useState<'monthly' | 'yearly'>('monthly');

  // Plans query
  const { data: plans } = useQuery({
    queryKey: ['plans'],
    queryFn: () => api.getPlans(),
    placeholderData: mockPlans,
  });

  // Purchase plan mutation
  const purchasePlanMutation = useMutation({
    mutationFn: (planId: string) => api.purchasePlan(user?.id || '', planId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
      navigate('/wallet');
    },
  });

  const formatCurrency = (amount: number, currency = 'TSH') => {
    if (amount === 0) return 'Free';
    return new Intl.NumberFormat('sw-TZ', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getYearlyPrice = (monthlyPrice: number) => {
    return monthlyPrice * 12 * 0.8; // 20% discount for yearly
  };

  const handlePurchasePlan = (planId: string) => {
    if (planId === 'free') {
      // Free plan doesn't need purchase
      return;
    }
    
    navigate(`/checkout/plan/${planId}?billing=${selectedBilling}`);
  };

  const getCurrentPlanFeatures = () => {
    const currentPlan = plans?.find((p: Plan) => p.tier === user?.plan);
    return currentPlan?.features || [];
  };

  return (
    <div className="h-screen-safe bg-gem-dark overflow-y-auto">
      {/* Header */}
      <div className="safe-top bg-gem-dark/95 backdrop-blur-sm border-b border-white/10 p-4">
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-white">Plans & Pricing</h1>
            <p className="text-sm text-white/60">Choose the perfect plan for your needs</p>
          </div>
        </div>
      </div>

      {/* Current Plan Banner */}
      {user && (
        <div className="p-4">
          <div className="card-gem p-4 mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary/20 rounded-full flex-center">
                <Crown className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-white font-semibold">
                  Current Plan: {user.plan?.charAt(0).toUpperCase() + user.plan?.slice(1)}
                </p>
                <p className="text-white/60 text-sm">
                  {getCurrentPlanFeatures().length} features included
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Billing Toggle */}
      <div className="px-4 mb-6">
        <div className="flex items-center justify-center space-x-4">
          <span className={cn(
            'text-sm font-medium transition-colors',
            selectedBilling === 'monthly' ? 'text-white' : 'text-white/60'
          )}>
            Monthly
          </span>
          
          <button
            onClick={() => setSelectedBilling(selectedBilling === 'monthly' ? 'yearly' : 'monthly')}
            className={cn(
              'w-12 h-6 rounded-full transition-colors relative',
              selectedBilling === 'yearly' ? 'bg-primary' : 'bg-white/20'
            )}
          >
            <div className={cn(
              'w-4 h-4 bg-white rounded-full absolute top-1 transition-transform',
              selectedBilling === 'yearly' ? 'translate-x-7' : 'translate-x-1'
            )} />
          </button>
          
          <div className="flex items-center space-x-2">
            <span className={cn(
              'text-sm font-medium transition-colors',
              selectedBilling === 'yearly' ? 'text-white' : 'text-white/60'
            )}>
              Yearly
            </span>
            <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full font-bold">
              Save 20%
            </span>
          </div>
        </div>
      </div>

      {/* Plans Grid */}
      <div className="px-4 space-y-4">
        {plans?.map((plan: Plan) => {
          const IconComponent = plan.icon;
          const isCurrentPlan = plan.tier === user?.plan;
          const price = selectedBilling === 'yearly' ? getYearlyPrice(plan.price) : plan.price;
          
          return (
            <div
              key={plan.id}
              className={cn(
                'relative rounded-2xl border-2 transition-all',
                plan.popular 
                  ? 'border-primary bg-gradient-to-br from-primary/10 to-secondary/10' 
                  : 'border-white/20 bg-white/5',
                isCurrentPlan && 'ring-2 ring-green-400/50'
              )}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <div className="bg-primary text-white px-4 py-1 rounded-full text-sm font-bold">
                    Most Popular
                  </div>
                </div>
              )}

              {/* Current Plan Badge */}
              {isCurrentPlan && (
                <div className="absolute -top-3 right-4">
                  <div className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                    Current Plan
                  </div>
                </div>
              )}

              <div className="p-6">
                {/* Plan Header */}
                <div className="flex items-center space-x-3 mb-4">
                  <div className={cn(
                    'w-12 h-12 rounded-xl flex-center bg-gradient-to-br',
                    plan.color
                  )}>
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                    <p className="text-white/60 text-sm">{plan.description}</p>
                  </div>
                </div>

                {/* Pricing */}
                <div className="mb-6">
                  <div className="flex items-baseline space-x-2">
                    <span className="text-3xl font-bold text-white">
                      {formatCurrency(price, plan.currency)}
                    </span>
                    {plan.price > 0 && (
                      <span className="text-white/60 text-sm">
                        /{selectedBilling}
                      </span>
                    )}
                  </div>
                  
                  {selectedBilling === 'yearly' && plan.price > 0 && (
                    <p className="text-green-400 text-sm">
                      Save {formatCurrency(plan.price * 12 * 0.2)} per year
                    </p>
                  )}
                </div>

                {/* Features */}
                <div className="space-y-3 mb-6">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                      <span className="text-white/80 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Limits Summary */}
                <div className="grid grid-cols-2 gap-3 mb-6 p-3 bg-white/5 rounded-xl">
                  <div className="text-center">
                    <p className="text-white font-bold">
                      {plan.limits.aiMessages === -1 ? '∞' : plan.limits.aiMessages}
                    </p>
                    <p className="text-white/60 text-xs">AI Messages</p>
                  </div>
                  <div className="text-center">
                    <p className="text-white font-bold">{plan.limits.commission}%</p>
                    <p className="text-white/60 text-xs">Commission</p>
                  </div>
                </div>

                {/* Action Button */}
                <button
                  onClick={() => handlePurchasePlan(plan.id)}
                  disabled={isCurrentPlan || purchasePlanMutation.isPending}
                  className={cn(
                    'w-full py-3 rounded-xl font-bold transition-colors',
                    isCurrentPlan
                      ? 'bg-green-500/20 text-green-400 cursor-not-allowed'
                      : plan.popular
                      ? 'bg-primary hover:bg-primary/90 text-white'
                      : 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
                  )}
                >
                  {isCurrentPlan 
                    ? 'Current Plan' 
                    : plan.price === 0 
                    ? 'Get Started' 
                    : 'Upgrade Now'
                  }
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Features Comparison */}
      <div className="p-4 mt-8">
        <div className="card-gem p-6">
          <h3 className="text-xl font-bold text-white mb-4 text-center">
            All Plans Include
          </h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-3">
              <Shield className="w-5 h-5 text-blue-400" />
              <span className="text-white/80 text-sm">Secure messaging</span>
            </div>
            <div className="flex items-center space-x-3">
              <Smartphone className="w-5 h-5 text-green-400" />
              <span className="text-white/80 text-sm">Mobile app access</span>
            </div>
            <div className="flex items-center space-x-3">
              <MessageCircle className="w-5 h-5 text-purple-400" />
              <span className="text-white/80 text-sm">AI chat support</span>
            </div>
            <div className="flex items-center space-x-3">
              <TrendingUp className="w-5 h-5 text-yellow-400" />
              <span className="text-white/80 text-sm">Earnings tracking</span>
            </div>
          </div>
        </div>
      </div>

      <div className="h-20" /> {/* Bottom padding */}
    </div>
  );
}
