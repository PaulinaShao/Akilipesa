import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, CreditCard, Smartphone, Building2, Check, Trash2, Edit } from 'lucide-react';

interface PaymentMethod {
  id: string;
  type: 'mpesa' | 'tigopesa' | 'airtelmoney' | 'bank' | 'card';
  name: string;
  details: string;
  isDefault: boolean;
  lastUsed?: Date;
}

const mockPaymentMethods: PaymentMethod[] = [
  {
    id: '1',
    type: 'mpesa',
    name: 'M-Pesa',
    details: '+255 123 456 789',
    isDefault: true,
    lastUsed: new Date(Date.now() - 24 * 60 * 60 * 1000),
  },
  {
    id: '2',
    type: 'bank',
    name: 'CRDB Bank',
    details: '****1234',
    isDefault: false,
    lastUsed: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
  },
  {
    id: '3',
    type: 'card',
    name: 'Visa Card',
    details: '****5678',
    isDefault: false,
  },
];

export default function PaymentMethodsPage() {
  const navigate = useNavigate();
  const [paymentMethods, setPaymentMethods] = useState(mockPaymentMethods);
  const [showAddMethod, setShowAddMethod] = useState(false);

  const getMethodIcon = (type: PaymentMethod['type']) => {
    switch (type) {
      case 'mpesa':
      case 'tigopesa':
      case 'airtelmoney':
        return <Smartphone className="w-6 h-6 text-green-400" />;
      case 'bank':
        return <Building2 className="w-6 h-6 text-blue-400" />;
      case 'card':
        return <CreditCard className="w-6 h-6 text-purple-400" />;
      default:
        return <CreditCard className="w-6 h-6 text-gray-400" />;
    }
  };

  const getMethodColor = (type: PaymentMethod['type']) => {
    switch (type) {
      case 'mpesa':
        return 'bg-green-600';
      case 'tigopesa':
        return 'bg-blue-600';
      case 'airtelmoney':
        return 'bg-red-600';
      case 'bank':
        return 'bg-gray-600';
      case 'card':
        return 'bg-purple-600';
      default:
        return 'bg-gray-600';
    }
  };

  const handleSetDefault = (id: string) => {
    setPaymentMethods(methods =>
      methods.map(method => ({
        ...method,
        isDefault: method.id === id
      }))
    );
  };

  const handleDeleteMethod = (id: string) => {
    setPaymentMethods(methods => methods.filter(method => method.id !== id));
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  if (showAddMethod) {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <button onClick={() => setShowAddMethod(false)} className="p-2">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-semibold">Add Payment Method</h1>
          <div className="w-10" />
        </div>

        <div className="p-4 space-y-4">
          {/* Mobile Money */}
          <div>
            <h2 className="text-lg font-semibold mb-3">Mobile Money</h2>
            <div className="space-y-3">
              {[
                { id: 'mpesa', name: 'M-Pesa', color: 'bg-green-600' },
                { id: 'tigopesa', name: 'Tigo Pesa', color: 'bg-blue-600' },
                { id: 'airtelmoney', name: 'Airtel Money', color: 'bg-red-600' },
              ].map((provider) => (
                <button
                  key={provider.id}
                  className="w-full p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors flex items-center space-x-3"
                >
                  <div className={`w-10 h-10 ${provider.color} rounded-lg flex items-center justify-center`}>
                    <Smartphone className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-medium">{provider.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Bank Account */}
          <div>
            <h2 className="text-lg font-semibold mb-3">Bank Account</h2>
            <button className="w-full p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors flex items-center space-x-3">
              <div className="w-10 h-10 bg-gray-600 rounded-lg flex items-center justify-center">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <span className="font-medium">Add Bank Account</span>
            </button>
          </div>

          {/* Credit/Debit Card */}
          <div>
            <h2 className="text-lg font-semibold mb-3">Credit/Debit Card</h2>
            <button className="w-full p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-white" />
              </div>
              <span className="font-medium">Add Card (Visa/MasterCard)</span>
            </button>
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
        <h1 className="text-xl font-semibold">Payment Methods</h1>
        <button 
          onClick={() => setShowAddMethod(true)}
          className="p-2 text-blue-400"
        >
          <Plus className="w-6 h-6" />
        </button>
      </div>

      <div className="p-4">
        {/* Add New Method Button */}
        <button
          onClick={() => setShowAddMethod(true)}
          className="w-full p-4 border-2 border-dashed border-gray-700 rounded-lg hover:border-gray-600 transition-colors flex items-center justify-center space-x-2 text-gray-400 hover:text-gray-300 mb-6"
        >
          <Plus className="w-5 h-5" />
          <span>Add New Payment Method</span>
        </button>

        {/* Existing Payment Methods */}
        <div className="space-y-3">
          {paymentMethods.map((method) => (
            <div key={method.id} className="bg-gray-800 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-12 h-12 ${getMethodColor(method.type)} rounded-lg flex items-center justify-center`}>
                    {getMethodIcon(method.type)}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="font-medium">{method.name}</h3>
                      {method.isDefault && (
                        <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded">
                          Default
                        </span>
                      )}
                    </div>
                    <p className="text-gray-400 text-sm">{method.details}</p>
                    {method.lastUsed && (
                      <p className="text-gray-500 text-xs">
                        Last used {formatDate(method.lastUsed)}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  {!method.isDefault && (
                    <button
                      onClick={() => handleSetDefault(method.id)}
                      className="text-blue-400 hover:text-blue-300 text-sm"
                    >
                      Set Default
                    </button>
                  )}
                  <button className="p-2 text-gray-400 hover:text-gray-300">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleDeleteMethod(method.id)}
                    className="p-2 text-red-400 hover:text-red-300"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Security Notice */}
        <div className="mt-6 p-4 bg-blue-600/20 border border-blue-600/50 rounded-lg">
          <h3 className="font-medium text-blue-400 mb-2">Security Notice</h3>
          <p className="text-sm text-gray-300">
            Your payment information is encrypted and secure. We use industry-standard 
            security measures to protect your financial data.
          </p>
        </div>
      </div>
    </div>
  );
}
