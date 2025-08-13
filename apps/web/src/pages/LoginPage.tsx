import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAppStore } from '@/store';
import CodeInput from '@/components/auth/CodeInput';
import GoogleButton from '@/components/auth/GoogleButton';
import Brand from '@/components/Brand';
import { normalizeMsisdn, formatAsUserTypes, formatAsDisplay, isValidTanzaniaNumber } from '@/lib/phoneFormat';
import { retryWithBackoff } from '@/lib/retry';
import { useToast } from '@/hooks/useToast';
import { handlePostLogin, getPostLoginIntent } from '@/lib/authGuard';

export default function LoginPage() {
  const [activeTab, setActiveTab] = useState<'phone' | 'email'>('phone');
  const [step, setStep] = useState<'input' | 'code' | 'success'>('input');
  const [phoneInput, setPhoneInput] = useState('');
  const [phoneE164, setPhoneE164] = useState('');
  const [isPhoneValid, setIsPhoneValid] = useState(false);
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [resendTimer, setResendTimer] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  const location = useLocation();
  const { setUser } = useAppStore();
  const { addToast } = useToast();

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
      if (!isPhoneValid) {
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
      // Use retry with exponential backoff for Firebase operations
      await retryWithBackoff(
        async () => {
          // TODO: Replace with actual Firebase Auth signInWithPhoneNumber
          // const confirmationResult = await signInWithPhoneNumber(auth, phoneValidation.e164, recaptchaVerifier);

          // Simulate network delay and potential failure
          await new Promise(resolve => setTimeout(resolve, 1500));

          // Simulate random failures for testing
          if (Math.random() < 0.1) {
            throw new Error('Network error: Please check your connection');
          }
        },
        {
          maxAttempts: 3,
          onRetry: (attempt, error) => {
            addToast({
              title: `Retrying... (${attempt}/3)`,
              description: error.message,
              type: 'info'
            });
          }
        }
      );

      setStep('code');
      setResendTimer(30);
      addToast({
        title: 'Code sent!',
        description: `Verification code sent to ${activeTab === 'phone' ? phoneValidation.formatted : email}`,
        type: 'success'
      });
    } catch (error: any) {
      const message = error?.message || 'Failed to send code. Please try again.';
      setError(message);
      addToast({
        title: 'Failed to send code',
        description: message,
        type: 'error'
      });
    } finally {
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
        username: activeTab === 'phone' ? phoneValidation.formatted.replace(/\s/g, '') : email.split('@')[0],
        email: activeTab === 'email' ? email : `${phoneValidation.formatted.replace(/\s/g, '')}@phone.akilipesa.com`,
        phone: phoneValidation.e164,
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
        verified: false,
        plan: 'free' as const,
        balance: 1000,
        earnings: 0,
      };

      setUser(mockUser);
      setStep('success');

      // Navigate after short delay with post-login intent handling
      setTimeout(() => {
        const intent = getPostLoginIntent();
        if (intent?.href) {
          handlePostLogin();
        } else {
          navigate('/reels', { replace: true });
        }
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

      // Handle post-login intent or navigate to default location
      setTimeout(() => {
        const intent = getPostLoginIntent();
        if (intent?.href) {
          handlePostLogin();
        } else {
          navigate(from, { replace: true });
        }
      }, 100);
      
    } catch (error) {
      setError('Google sign-in failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneChange = (value: string) => {
    // Format as user types
    const formatted = formatAsUserTypes(value);
    setPhoneInput(formatted);
    setError('');

    // Debounced validation
    phoneDebouncer(value, (result) => {
      setPhoneValidation(result);
    });
  };

  const handlePhoneBlur = () => {
    // Immediate validation on blur
    const result = validateTZPhone(phoneInput);
    setPhoneValidation(result);
    if (result.isValid) {
      setPhoneInput(result.formatted);
    }
  };

  const isFormValid = () => {
    if (activeTab === 'phone') {
      return phoneValidation.isValid;
    } else {
      return email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
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
    <div className="min-h-screen bg-gradient-to-b from-[var(--tz-night)] via-[#1a1235] to-[#2d1b69] flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="mb-8">
          <button 
            onClick={handleBack}
            className="p-2 -ml-2 hover:bg-white/10 rounded-full transition-colors mb-6"
          >
            <ArrowLeft className="w-6 h-6 text-[var(--tz-muted)]" />
          </button>
          
          <div className="text-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="mb-8"
            >
              <Brand size="lg" showWordmark={true} animated={true} />
            </motion.div>

            <p className="text-[var(--tz-muted)] text-center mb-6">
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
            {/* Glass Card Container */}
            <div className="tz-glass-card p-6 space-y-6">
              {/* Tabs */}
              <div className="flex bg-black/20 rounded-xl p-1">
                <button
                  onClick={() => setActiveTab('phone')}
                  className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                    activeTab === 'phone'
                      ? 'tz-btn-primary'
                      : 'text-[var(--tz-muted)] hover:text-[var(--tz-ink)]'
                  }`}
                >
                  Phone
                </button>
                <button
                  onClick={() => setActiveTab('email')}
                  className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                    activeTab === 'email'
                      ? 'tz-btn-primary'
                      : 'text-[var(--tz-muted)] hover:text-[var(--tz-ink)]'
                  }`}
                >
                  Email
                </button>
              </div>

              {/* Input */}
              {activeTab === 'phone' ? (
                <div>
                  <label className="block text-sm text-[var(--tz-ink)] mb-2 font-medium">
                    Phone number
                  </label>
                  <div className="tz-phone-input-container">
                    <div className="tz-country-chip">
                      🇹🇿 +255
                    </div>
                    <input
                      type="tel"
                      value={phoneInput}
                      onChange={(e) => handlePhoneChange(e.target.value)}
                      onBlur={handlePhoneBlur}
                      placeholder="7XX XXX XXX"
                      className={`tz-input tz-phone-input ${
                        phoneInput && !phoneValidation.isValid ? 'border-rose-400' : ''
                      }`}
                      autoComplete="tel"
                    />
                  </div>
                  {phoneInput && !phoneValidation.isValid && phoneValidation.message && (
                    <p className="mt-1 text-xs text-rose-400">{phoneValidation.message}</p>
                  )}
                  {phoneValidation.isValid && (
                    <p className="mt-1 text-xs text-emerald-400">✓ Valid Tanzania mobile number</p>
                  )}
                  {error && <p className="mt-2 text-xs text-rose-400">{error}</p>}
                </div>
              ) : (
                <div>
                  <label className="block text-sm text-[var(--tz-ink)] mb-2 font-medium">
                    Email address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError('');
                    }}
                    placeholder="hello@example.com"
                    className="w-full px-4 py-3 tz-input"
                    autoComplete="email"
                  />
                  {error && <p className="mt-2 text-xs text-rose-400">{error}</p>}
                </div>
              )}

              {/* Send Code Button */}
              <motion.button
                whileHover={{ scale: (loading || !isFormValid()) ? 1 : 1.02 }}
                whileTap={{ scale: (loading || !isFormValid()) ? 1 : 0.98 }}
                onClick={handleSendCode}
                disabled={loading || !isFormValid()}
                className="w-full tz-btn-primary py-3 px-4 disabled:opacity-50 disabled:cursor-not-allowed"
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
                  <div className="w-full border-t border-white/10" />
                </div>
                <div className="relative flex justify-center">
                  <span className="px-4 bg-[var(--glass-bg)] text-[var(--tz-muted)] text-sm">or</span>
                </div>
              </div>

              {/* Google Button */}
              <GoogleButton onClick={handleGoogleAuth} loading={loading} />
            </div>

            {/* Footer */}
            <div className="text-center">
              <p className="text-xs text-[var(--tz-muted)] leading-relaxed">
                By continuing, you agree to our{' '}
                <a href="/terms" className="text-[var(--tz-ice-400)] hover:text-white transition-colors">Terms</a>
                {' �� '}
                <a href="/privacy" className="text-[var(--tz-ice-400)] hover:text-white transition-colors">Privacy</a>
                {' • '}
                <a href="/help" className="text-[var(--tz-ice-400)] hover:text-white transition-colors">Help</a>
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
            <div className="tz-glass-card p-6 space-y-6">
              <div className="text-center mb-4">
                <h2 className="text-xl font-semibold text-[var(--tz-ink)] mb-2">
                  Enter verification code
                </h2>
                <p className="text-[var(--tz-muted)] text-sm">
                  We sent a 6-digit code to {activeTab === 'phone' ? phoneValidation.e164 : email}
                </p>
              </div>

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
                className="w-full tz-btn-primary py-3 px-4 disabled:opacity-50 disabled:cursor-not-allowed"
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
                <p className="text-[var(--tz-muted)] text-sm mb-2">Didn't receive the code?</p>
                <button
                  onClick={handleResend}
                  disabled={resendTimer > 0}
                  className={`text-sm font-medium transition-colors ${
                    resendTimer > 0
                      ? 'text-[var(--tz-muted)] cursor-not-allowed'
                      : 'text-[var(--tz-ice-400)] hover:text-white'
                  }`}
                >
                  {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend code'}
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {step === 'success' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-6"
          >
            <div className="tz-glass-card p-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6"
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
                <h3 className="text-xl font-semibold text-[var(--tz-ink)] mb-2">Welcome to AkiliPesa!</h3>
                <p className="text-[var(--tz-muted)] text-sm">You're all set. Redirecting...</p>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
