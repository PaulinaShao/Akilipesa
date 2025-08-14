import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, Crown, Star, Zap } from 'lucide-react';

const PLANS = [
  {
    id: 'starter',
    name: 'Starter',
    icon: Star,
    color: 'bg-blue-600',
    features: [
      'Basic live streaming',
      'Standard video quality',
      'Basic analytics',
      'Community features',
      'Mobile app access'
    ],
    pricing: {
      daily: 500,
      weekly: 3000,
      monthly: 10000
    }
  },
  {
    id: 'standard',
    name: 'Standard',
    icon: Zap,
    color: 'bg-purple-600',
    popular: true,
    features: [
      'HD live streaming',
      'Advanced analytics',
      'Priority support',
      'Custom branding',
      'Multi-platform streaming',
      'Enhanced monetization'
    ],
    pricing: {
      daily: 1000,
      weekly: 6000,
      monthly: 20000
    }
  },
  {
    id: 'pro',
    name: 'Pro',
    icon: Crown,
    color: 'bg-yellow-600',
    features: [
      '4K live streaming',
      'Advanced AI features',
      '24/7 priority support',
      'White-label solutions',
      'API access',
      'Custom integrations',
      'Advanced monetization',
      'Dedicated account manager'
    ],
    pricing: {
      daily: 2000,
      weekly: 12000,
      monthly: 40000
    }
  }
];

const DURATIONS = [
  { id: 'daily', name: 'Daily', suffix: '/day' },
  { id: 'weekly', name: 'Weekly', suffix: '/week' },
  { id: 'monthly', name: 'Monthly', suffix: '/month' }
];

export default function UpgradePlanPage() {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState<string | null>('standard');
  const [selectedDuration, setSelectedDuration] = useState<'daily' | 'weekly' | 'monthly'>('monthly');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const currentPlan = PLANS.find(p => p.id === selectedPlan);
  const price = currentPlan?.pricing[selectedDuration] || 0;
  const taxAmount = price * 0.18;
  const totalAmount = price + taxAmount;

  const handleUpgrade = async () => {
    if (!selectedPlan) return;

    setIsProcessing(true);
    
    // Simulate upgrade processing
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    setIsProcessing(false);
    setShowSuccess(true);
    
    // Navigate back after showing success
    setTimeout(() => {
      navigate('/wallet');
    }, 2000);
  };

  const getExpirationDate = () => {
    const now = new Date();
    switch (selectedDuration) {
      case 'daily':
        return new Date(now.getTime() + 24 * 60 * 60 * 1000);
      case 'weekly':
        return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      case 'monthly':
        return new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
      default:
        return now;
    }
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Plan Upgraded Successfully!</h2>
          <p className="text-gray-400 mb-4">You're now on the {currentPlan?.name} plan</p>
          <div className="text-sm text-gray-500">
            <p>Expires: {getExpirationDate().toLocaleDateString()}</p>
            <p>Total Paid: TSH {totalAmount.toLocaleString()}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-800">
        <button onClick={() => navigate('/wallet')} className="p-2">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-semibold">Upgrade Plan</h1>
        <div className="w-10" />
      </div>

      <div className="p-4">
        {/* Duration Selection */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-4">Billing Period</h2>
          <div className="flex space-x-2">
            {DURATIONS.map((duration) => (
              <button
                key={duration.id}
                onClick={() => setSelectedDuration(duration.id as any)}
                className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
                  selectedDuration === duration.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                {duration.name}
              </button>
            ))}
          </div>
        </div>

        {/* Plans */}
        <div className="space-y-4 mb-6">
          {PLANS.map((plan) => {
            const Icon = plan.icon;
            const isSelected = selectedPlan === plan.id;
            
            return (
              <div
                key={plan.id}
                onClick={() => setSelectedPlan(plan.id)}
                className={`relative p-4 rounded-lg border cursor-pointer transition-colors ${
                  isSelected
                    ? 'border-blue-500 bg-blue-500/10'
                    : 'border-gray-700 bg-gray-800 hover:border-gray-600'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-2 left-4 bg-purple-600 text-white text-xs px-2 py-1 rounded">
                    Most Popular
                  </div>
                )}
                
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 ${plan.color} rounded-lg flex items-center justify-center`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">{plan.name}</h3>
                      <p className="text-2xl font-bold">
                        TSH {plan.pricing[selectedDuration].toLocaleString()}
                        <span className="text-sm text-gray-400">
                          {DURATIONS.find(d => d.id === selectedDuration)?.suffix}
                        </span>
                      </p>
                    </div>
                  </div>
                  {isSelected && (
                    <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4" />
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-2 text-sm">
                      <Check className="w-4 h-4 text-green-400" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Plan Summary */}
        {selectedPlan && (
          <div className="bg-gray-800 rounded-lg p-4 space-y-2 mb-6">
            <div className="flex justify-between">
              <span>{currentPlan?.name} Plan ({selectedDuration})</span>
              <span>TSH {price.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-400">
              <span>Tax (18%)</span>
              <span>TSH {taxAmount.toLocaleString()}</span>
            </div>
            <div className="border-t border-gray-700 pt-2 flex justify-between font-semibold">
              <span>Total</span>
              <span>TSH {totalAmount.toLocaleString()}</span>
            </div>
            <div className="text-sm text-gray-400 mt-2">
              <p>Expires: {getExpirationDate().toLocaleDateString()}</p>
            </div>
          </div>
        )}

        {/* Current Plan Status */}
        <div className="bg-gray-800 rounded-lg p-4 mb-6">
          <h3 className="font-semibold mb-2">Current Plan</h3>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400">Free Plan</p>
              <p className="text-sm text-gray-500">Basic features only</p>
            </div>
            <span className="text-sm text-yellow-400">Active</span>
          </div>
        </div>

        {/* Upgrade Button */}
        <button
          onClick={handleUpgrade}
          disabled={!selectedPlan || isProcessing}
          className="w-full py-4 bg-blue-600 rounded-lg font-semibold disabled:bg-gray-700 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
        >
          {isProcessing ? 'Processing...' : `Upgrade to ${currentPlan?.name} - TSH ${totalAmount.toLocaleString()}`}
        </button>

        <p className="text-sm text-gray-400 text-center mt-4">
          You can cancel or change your plan anytime from your account settings.
        </p>
      </div>
    </div>
  );
}
