import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CreditCard, Smartphone, Building2, Check } from 'lucide-react';

const PRESET_AMOUNTS = [500, 1000, 2000, 5000, 10000, 50000, 100000];

const PAYMENT_METHODS = [
  { id: 'mpesa', name: 'M-Pesa', icon: Smartphone, color: 'bg-green-600' },
  { id: 'tigopesa', name: 'Tigo Pesa', icon: Smartphone, color: 'bg-blue-600' },
  { id: 'airtelmoney', name: 'Airtel Money', icon: Smartphone, color: 'bg-red-600' },
  { id: 'bank', name: 'Bank Account', icon: Building2, color: 'bg-gray-600' },
  { id: 'stripe', name: 'Credit/Debit Card', icon: CreditCard, color: 'bg-purple-600' }
];

export default function AddFundsPage() {
  const navigate = useNavigate();
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | null>(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const finalAmount = selectedAmount || parseFloat(customAmount) || 0;
  const taxAmount = finalAmount * 0.18; // 18% tax
  const totalAmount = finalAmount + taxAmount;

  const handleAmountSelect = (amount: number) => {
    setSelectedAmount(amount);
    setCustomAmount('');
  };

  const handleCustomAmountChange = (value: string) => {
    setCustomAmount(value);
    setSelectedAmount(null);
  };

  const handleAddFunds = async () => {
    if (!finalAmount || !selectedPaymentMethod) return;

    setIsProcessing(true);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    setIsProcessing(false);
    setShowSuccess(true);
    
    // Navigate back after showing success
    setTimeout(() => {
      navigate('/wallet');
    }, 2000);
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Funds Added Successfully!</h2>
          <p className="text-gray-400 mb-4">TSH {finalAmount.toLocaleString()} has been added to your wallet</p>
          <div className="text-sm text-gray-500">
            <p>Tax: TSH {taxAmount.toLocaleString()}</p>
            <p>Total Charged: TSH {totalAmount.toLocaleString()}</p>
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
        <h1 className="text-xl font-semibold">Add Funds</h1>
        <div className="w-10" />
      </div>

      <div className="p-4 space-y-6">
        {/* Amount Selection */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Select Amount</h2>
          <div className="grid grid-cols-3 gap-3 mb-4">
            {PRESET_AMOUNTS.map((amount) => (
              <button
                key={amount}
                onClick={() => handleAmountSelect(amount)}
                className={`p-3 rounded-lg border text-center font-medium transition-colors ${
                  selectedAmount === amount
                    ? 'border-blue-500 bg-blue-500/20 text-blue-400'
                    : 'border-gray-700 bg-gray-800 hover:border-gray-600'
                }`}
              >
                TSH {amount.toLocaleString()}
              </button>
            ))}
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Or enter custom amount</label>
            <input
              type="number"
              value={customAmount}
              onChange={(e) => handleCustomAmountChange(e.target.value)}
              placeholder="Enter amount"
              className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg focus:border-blue-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Payment Methods */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Payment Method</h2>
          <div className="space-y-3">
            {PAYMENT_METHODS.map((method) => {
              const Icon = method.icon;
              return (
                <button
                  key={method.id}
                  onClick={() => setSelectedPaymentMethod(method.id)}
                  className={`w-full p-4 rounded-lg border flex items-center space-x-3 transition-colors ${
                    selectedPaymentMethod === method.id
                      ? 'border-blue-500 bg-blue-500/20'
                      : 'border-gray-700 bg-gray-800 hover:border-gray-600'
                  }`}
                >
                  <div className={`w-10 h-10 ${method.color} rounded-lg flex items-center justify-center`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-medium">{method.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Account Details */}
        {selectedPaymentMethod && ['mpesa', 'tigopesa', 'airtelmoney'].includes(selectedPaymentMethod) && (
          <div>
            <label className="block text-sm font-medium mb-2">Phone Number</label>
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="+255 XXX XXX XXX"
              className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg focus:border-blue-500 focus:outline-none"
            />
          </div>
        )}

        {selectedPaymentMethod === 'bank' && (
          <div>
            <label className="block text-sm font-medium mb-2">Account Number</label>
            <input
              type="text"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              placeholder="Enter your account number"
              className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg focus:border-blue-500 focus:outline-none"
            />
          </div>
        )}

        {/* Amount Summary */}
        {finalAmount > 0 && (
          <div className="bg-gray-800 rounded-lg p-4 space-y-2">
            <div className="flex justify-between">
              <span>Amount</span>
              <span>TSH {finalAmount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-400">
              <span>Tax (18%)</span>
              <span>TSH {taxAmount.toLocaleString()}</span>
            </div>
            <div className="border-t border-gray-700 pt-2 flex justify-between font-semibold">
              <span>Total</span>
              <span>TSH {totalAmount.toLocaleString()}</span>
            </div>
          </div>
        )}

        {/* Add Funds Button */}
        <button
          onClick={handleAddFunds}
          disabled={!finalAmount || !selectedPaymentMethod || isProcessing}
          className="w-full py-4 bg-blue-600 rounded-lg font-semibold disabled:bg-gray-700 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
        >
          {isProcessing ? 'Processing...' : `Add TSH ${finalAmount.toLocaleString()}`}
        </button>
      </div>
    </div>
  );
}
