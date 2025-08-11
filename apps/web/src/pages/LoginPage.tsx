import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAppStore } from '@/store';
import PhoneInput from '@/components/auth/PhoneInput';
import CodeInput from '@/components/auth/CodeInput';
import GoogleButton from '@/components/auth/GoogleButton';
import { isValidTZ } from '@/lib/phone';

export default function LoginPage() {
  const [activeTab, setActiveTab] = useState<'phone' | 'email'>('phone');
  const [step, setStep] = useState<'input' | 'code' | 'success'>('input');
  const [phoneE164, setPhoneE164] = useState('');
  const [phoneLocal, setPhoneLocal] = useState('');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [resendTimer, setResendTimer] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  const location = useLocation();
  const { setUser } = useAppStore();

  const from = location.state?.from?.pathname || '/reels';

  // Resend timer
  useEffect(() => {
    if (resendTimer > 0) {
      const interval = setInterval(() => {
        setResendTimer(prev => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [resendTimer]);

  const handleSendCode = async () => {
    setError('');
    
    if (activeTab === 'phone') {
      if (!phoneLocal || !isValidTZ(phoneLocal)) {
        setError('Please enter a valid Tanzania phone number');
        return;
      }
    } else {
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        setError('Please enter a valid email address');
        return;
      }
    }

    setLoading(true);
    
    try {
      // Simulate sending code (replace with actual Firebase Auth)
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setStep('code');
      setResendTimer(30);
      setLoading(false);
    } catch (error) {
      setError('Failed to send code. Please try again.');
      setLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (code.length !== 6) {
      setError('Please enter the complete 6-digit code');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Simulate code verification (replace with actual Firebase Auth)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock successful authentication
      const mockUser = {
        id: 'user-123',
        name: 'Tanzania User',
        username: activeTab === 'phone' ? phoneLocal : email.split('@')[0],
        email: activeTab === 'email' ? email : `${phoneLocal}@phone.akilipesa.com`,
        phone: phoneE164,
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
        verified: false,
        plan: 'free' as const,
        balance: 1000,
        earnings: 0,
      };

      setUser(mockUser);
      setStep('success');
      
      // Navigate after short delay
      setTimeout(() => {
        navigate(from, { replace: true });
      }, 1000);
      
    } catch (error) {
      setError('Invalid verification code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setLoading(true);
    setError('');

    try {
      // Simulate Google auth (replace with actual Firebase Auth)
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const mockUser = {
        id: 'user-google-123',
        name: 'Google User',
        username: 'googleuser',
        email: 'user@gmail.com',
        phone: '',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b9d38aad?w=150&h=150&fit=crop&crop=face',
        verified: true,
        plan: 'free' as const,
        balance: 1000,
        earnings: 0,
      };

      setUser(mockUser);
      navigate(from, { replace: true });
      
    } catch (error) {
      setError('Google sign-in failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = () => {
    if (resendTimer > 0) return;
    handleSendCode();
  };

  const handleBack = () => {
    if (step === 'code') {
      setStep('input');
      setCode('');
      setError('');
    } else {
      navigate('/reels');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0b0c14] via-[#1a1235] to-[#2d1b69] flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="mb-8">
          <button 
            onClick={handleBack}
            className="p-2 -ml-2 hover:bg-white/10 rounded-full transition-colors mb-6"
          >
            <ArrowLeft className="w-6 h-6 text-zinc-400" />
          </button>
          
          <div className="text-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-16 h-16 bg-gradient-to-br from-violet-400 via-purple-500 to-indigo-600 rounded-lg transform rotate-45 mx-auto mb-6 shadow-xl"
            >
              <div className="absolute inset-2 bg-gradient-to-br from-white/30 to-transparent rounded" />
            </motion.div>
            
            <h1 className="text-3xl font-bold text-white mb-2">
              Sign in to AkiliPesa
            </h1>
            <p className="text-zinc-400">
              Save your likes, follow creators, buy & earn rewards.
            </p>
          </div>
        </div>

        {step === 'input' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Tabs */}
            <div className="flex bg-zinc-800 rounded-xl p-1">
              <button
                onClick={() => setActiveTab('phone')}
                className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                  activeTab === 'phone'
                    ? 'bg-violet-600 text-white'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                Phone
              </button>
              <button
                onClick={() => setActiveTab('email')}
                className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                  activeTab === 'email'
                    ? 'bg-violet-600 text-white'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                Email
              </button>
            </div>

            {/* Input */}
            {activeTab === 'phone' ? (
              <PhoneInput
                value={phoneE164}
                onChange={(e164, local) => {
                  setPhoneE164(e164);
                  setPhoneLocal(local);
                  setError('');
                }}
                error={error}
              />
            ) : (
              <div>
                <label className="block text-sm text-zinc-300 mb-2">Email address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError('');
                  }}
                  placeholder="hello@example.com"
                  className="w-full px-4 py-3 bg-zinc-900/60 border border-zinc-700 rounded-xl text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
                />
                {error && <p className="mt-2 text-xs text-rose-400">{error}</p>}
              </div>
            )}

            {/* Send Code Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSendCode}
              disabled={loading}
              className="w-full bg-violet-600 hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-xl transition-colors"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Sending code...
                </div>
              ) : (
                'Send code'
              )}
            </motion.button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-zinc-700" />
              </div>
              <div className="relative flex justify-center">
                <span className="px-4 bg-[#1a1235] text-zinc-500 text-sm">or</span>
              </div>
            </div>

            {/* Google Button */}
            <GoogleButton onClick={handleGoogleAuth} loading={loading} />

            {/* Footer */}
            <div className="text-center">
              <p className="text-xs text-zinc-500 leading-relaxed">
                By continuing, you agree to our{' '}
                <a href="/terms" className="text-violet-400 hover:text-violet-300">Terms</a>
                {' • '}
                <a href="/privacy" className="text-violet-400 hover:text-violet-300">Privacy</a>
                {' • '}
                <a href="/help" className="text-violet-400 hover:text-violet-300">Help</a>
              </p>
            </div>
          </motion.div>
        )}

        {step === 'code' && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <CodeInput
              value={code}
              onChange={setCode}
              error={error}
              onComplete={handleVerifyCode}
            />

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleVerifyCode}
              disabled={loading || code.length !== 6}
              className="w-full bg-violet-600 hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-xl transition-colors"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Verifying...
                </div>
              ) : (
                'Verify & continue'
              )}
            </motion.button>

            {/* Resend */}
            <div className="text-center">
              <p className="text-zinc-500 text-sm mb-2">Didn't receive the code?</p>
              <button
                onClick={handleResend}
                disabled={resendTimer > 0}
                className={`text-sm font-medium transition-colors ${
                  resendTimer > 0
                    ? 'text-zinc-600 cursor-not-allowed'
                    : 'text-violet-400 hover:text-violet-300'
                }`}
              >
                {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend code'}
              </button>
            </div>
          </motion.div>
        )}

        {step === 'success' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-6"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto"
            >
              <motion.svg
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="w-10 h-10 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <motion.path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </motion.svg>
            </motion.div>
            <div>
              <h3 className="text-xl font-semibold text-white mb-2">Welcome to AkiliPesa!</h3>
              <p className="text-zinc-400 text-sm">You're all set. Redirecting...</p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
