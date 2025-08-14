import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Smartphone, Building2, Check, AlertCircle } from 'lucide-react';

const WITHDRAWAL_METHODS = [
  { id: 'mpesa', name: 'M-Pesa', icon: Smartphone, color: 'bg-green-600', fee: 100 },
  { id: 'tigopesa', name: 'Tigo Pesa', icon: Smartphone, color: 'bg-blue-600', fee: 100 },
  { id: 'airtelmoney', name: 'Airtel Money', icon: Smartphone, color: 'bg-red-600', fee: 100 },
  { id: 'bank', name: 'Bank Account', icon: Building2, color: 'bg-gray-600', fee: 500 }
];

export default function WithdrawPage() {
  const navigate = useNavigate();
  const [amount, setAmount] = useState('');
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [bankName, setBankName] = useState('');
  const [accountName, setAccountName] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const withdrawAmount = parseFloat(amount) || 0;
  const selectedMethodData = WITHDRAWAL_METHODS.find(m => m.id === selectedMethod);
  const fee = selectedMethodData?.fee || 0;
  const totalDeduction = withdrawAmount + fee;
  
  // Available balance (should come from state/context)
  const availableBalance = 284500;

  const handleWithdraw = async () => {
    if (!withdrawAmount || !selectedMethod || totalDeduction > availableBalance) return;

    setIsProcessing(true);
    
    // Simulate withdrawal processing
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
          <h2 className="text-2xl font-bold mb-2">Withdrawal Successful!</h2>
          <p className="text-gray-400 mb-4">TSH {withdrawAmount.toLocaleString()} has been sent to your {selectedMethodData?.name}</p>
          <div className="text-sm text-gray-500">
            <p>Withdrawal Fee: TSH {fee.toLocaleString()}</p>
            <p>Total Deducted: TSH {totalDeduction.toLocaleString()}</p>
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
        <h1 className="text-xl font-semibold">Withdraw Funds</h1>
        <div className="w-10" />
      </div>

      <div className="p-4 space-y-6">
        {/* Available Balance */}
        <div className="bg-gray-800 rounded-lg p-4 text-center">
          <p className="text-sm text-gray-400 mb-1">Available Balance</p>
          <p className="text-2xl font-bold text-green-400">TSH {availableBalance.toLocaleString()}</p>
        </div>

        {/* Amount Input */}
        <div>
          <label className="block text-sm font-medium mb-2">Withdrawal Amount</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount to withdraw"
            className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg focus:border-blue-500 focus:outline-none"
          />
          {withdrawAmount > availableBalance && (
            <div className="flex items-center space-x-2 mt-2 text-red-400">
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm">Insufficient balance</span>
            </div>
          )}
        </div>

        {/* Withdrawal Methods */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Withdrawal Method</h2>
          <div className="space-y-3">
            {WITHDRAWAL_METHODS.map((method) => {
              const Icon = method.icon;
              return (
                <button
                  key={method.id}
                  onClick={() => setSelectedMethod(method.id)}
                  className={`w-full p-4 rounded-lg border flex items-center justify-between transition-colors ${
                    selectedMethod === method.id
                      ? 'border-blue-500 bg-blue-500/20'
                      : 'border-gray-700 bg-gray-800 hover:border-gray-600'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 ${method.color} rounded-lg flex items-center justify-center`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-medium">{method.name}</span>
                  </div>
                  <span className="text-sm text-gray-400">Fee: TSH {method.fee}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Account Details */}
        {selectedMethod && ['mpesa', 'tigopesa', 'airtelmoney'].includes(selectedMethod) && (
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

        {selectedMethod === 'bank' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Bank Name</label>
              <input
                type="text"
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                placeholder="e.g., CRDB Bank"
                className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg focus:border-blue-500 focus:outline-none"
              />
            </div>
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
            <div>
              <label className="block text-sm font-medium mb-2">Account Name</label>
              <input
                type="text"
                value={accountName}
                onChange={(e) => setAccountName(e.target.value)}
                placeholder="Enter account holder name"
                className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>
        )}

        {/* Withdrawal Summary */}
        {withdrawAmount > 0 && selectedMethod && (
          <div className="bg-gray-800 rounded-lg p-4 space-y-2">
            <div className="flex justify-between">
              <span>Withdrawal Amount</span>
              <span>TSH {withdrawAmount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-400">
              <span>Withdrawal Fee</span>
              <span>TSH {fee.toLocaleString()}</span>
            </div>
            <div className="border-t border-gray-700 pt-2 flex justify-between font-semibold">
              <span>Total Deduction</span>
              <span>TSH {totalDeduction.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-400">
              <span>Remaining Balance</span>
              <span>TSH {(availableBalance - totalDeduction).toLocaleString()}</span>
            </div>
          </div>
        )}

        {/* Withdraw Button */}
        <button
          onClick={handleWithdraw}
          disabled={
            !withdrawAmount || 
            !selectedMethod || 
            isProcessing || 
            totalDeduction > availableBalance ||
            (selectedMethod === 'bank' && (!bankName || !accountNumber || !accountName)) ||
            (['mpesa', 'tigopesa', 'airtelmoney'].includes(selectedMethod) && !phoneNumber)
          }
          className="w-full py-4 bg-blue-600 rounded-lg font-semibold disabled:bg-gray-700 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
        >
          {isProcessing ? 'Processing...' : `Withdraw TSH ${withdrawAmount.toLocaleString()}`}
        </button>
      </div>
    </div>
  );
}
