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

  const validateInput = () => {
    const newErrors: Record<string, string> = {};
    
    if (method === 'phone') {
      if (!phoneNumber) {
        newErrors.phone = 'Phone number is required';
      } else if (!isValidTanzanianPhone(phoneNumber)) {
        newErrors.phone = 'Please enter a valid Tanzanian phone number';
      }
    } else {
      if (!email) {
        newErrors.email = 'Email is required';
      } else if (!isValidEmail(email)) {
        newErrors.email = 'Please enter a valid email address';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSendCode = async () => {
    if (!validateInput()) return;
    
    setIsLoading(true);
    setErrors({});
    
    try {
      // Simulate sending OTP
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setStep('otp');
      setResendTimer(30);
      
      // Start countdown
      const interval = setInterval(() => {
        setResendTimer(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      addToast({
        type: 'success',
        title: 'Code Sent',
        description: method === 'phone' 
          ? `Verification code sent to ${phoneNumber}`
          : `Verification code sent to ${email}`,
      });
      
    } catch (error) {
      setErrors({ general: 'Failed to send code. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) {
      setErrors({ otp: 'Please enter the complete 6-digit code' });
      return;
    }
    
    setIsLoading(true);
    setErrors({});
    
    try {
      // Simulate OTP verification
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (otp === '123456' || otp.length === 6) {
        addToast({
          type: 'success',
          title: 'Welcome to AkiliPesa!',
          description: 'You have successfully signed in',
        });
        navigate(from, { replace: true });
      } else {
        setErrors({ otp: 'Invalid verification code' });
      }
      
    } catch (error) {
      setErrors({ otp: 'Verification failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleWhatsAppLogin = () => {
    // WhatsApp number for AkiliPesa verification from environment
    const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || 'whatsapp:+15557679073';
    const phoneNumber = WHATSAPP_NUMBER.replace('whatsapp:', '');

    // Create WhatsApp deep link to request verification token
    const message = encodeURIComponent('Hello AkiliPesa! I need a verification token to sign in to my account.');
    const whatsappUrl = `https://wa.me/${phoneNumber.replace('+', '')}?text=${message}`;

    // Open WhatsApp in new tab/app
    window.open(whatsappUrl, '_blank');

    // Switch to WhatsApp token input step
    setMethod('whatsapp');
    setStep('whatsapp-token');

    addToast({
      type: 'info',
      title: 'WhatsApp Opened',
      description: 'Enter the verification token you receive from AkiliPesa',
    });
  };

  const handleWhatsAppTokenVerification = async () => {
    if (!whatsappToken || whatsappToken.length < 4) {
      setErrors({ whatsappToken: 'Please enter a valid verification token from WhatsApp' });
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      // Simulate token verification
      await new Promise(resolve => setTimeout(resolve, 1500));

      // For demo purposes, accept any token with 4+ characters
      if (whatsappToken.length >= 4) {
        addToast({
          type: 'success',
          title: 'WhatsApp Login Successful',
          description: 'Welcome to AkiliPesa!',
        });
        navigate(from, { replace: true });
      } else {
        setErrors({ whatsappToken: 'The verification token is incorrect. Please try again.' });
      }
    } catch (error) {
      setErrors({ whatsappToken: 'Unable to verify WhatsApp token. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      // Simulate Google login
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      addToast({
        type: 'success',
        title: 'Google Sign In Successful',
        description: 'Welcome to AkiliPesa!',
      });
      
      navigate(from, { replace: true });
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Google Sign In Failed',
        description: 'Unable to sign in with Google. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = () => {
    if (resendTimer > 0) return;
    handleSendCode();
  };

  const handleBack = () => {
    if (step === 'otp') {
      setStep('input');
      setOTP('');
      setErrors({});
    } else if (step === 'whatsapp-token') {
      setStep('input');
      setMethod('phone');
      setWhatsappToken('');
      setErrors({});
    } else {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen-safe flex flex-col text-base">
      {/* Background with deep radial Tanzanite gradient */}
      <div className="absolute inset-0" style={{
        background: 'radial-gradient(1200px 700px at 20% 0%, #1A1035 0%, #0B0A15 50%, #07060E 100%)'
      }} />
      
      {/* Content */}
      <div className="relative z-10 flex-1 flex flex-col">
        {/* Header */}
        <div className="safe-top p-4">
          <button 
            onClick={handleBack}
            className="p-2 hover:bg-white/10 rounded-full transition-colors touch-target"
            aria-label="Go back"
          >
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Main content */}
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="w-full max-w-sm">
            {/* Logo */}
            <div className="text-center mb-8">
              <TanzaniteLogo size="lg" className="justify-center mb-6" />
              <h1 className="text-3xl font-bold mb-3 text-white leading-tight" style={{
                letterSpacing: '0.2px',
                textShadow: '0 1px 0 rgba(255, 255, 255, 0.04)'
              }}>
                {step === 'input'
                  ? 'Welcome Back'
                  : step === 'whatsapp-token'
                    ? 'WhatsApp Verification'
                    : 'Enter Code'
                }
              </h1>
              <p className="text-base text-white/70 leading-relaxed">
                {step === 'input'
                  ? 'Sign in to continue to AkiliPesa'
                  : step === 'whatsapp-token'
                    ? 'Enter the verification token from AkiliPesa WhatsApp'
                    : `We sent a code to ${method === 'phone' ? phoneNumber : email}`
                }
              </p>
            </div>

            {/* Form Card - Tanzanite Glass */}
            <div className="space-y-6 rounded-2xl border border-white/18 p-6" style={{
              background: 'linear-gradient(180deg, #0B0A15 0%, #15102B 100%)',
              boxShadow: '0 12px 40px rgba(46, 20, 80, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.06)'
            }}>
              {step === 'input' ? (
                <>
                  {/* Method Toggle */}
                  <div className="glass rounded-2xl p-1 flex">
                    <button
                      onClick={() => setMethod('phone')}
                      className={cn(
                        "flex-1 flex items-center justify-center space-x-2 py-3 rounded-xl transition-all",
                        method === 'phone' 
                          ? "bg-primary text-white shadow-lg" 
                          : "text-white/60 hover:text-white"
                      )}
                    >
                      <Phone className="w-4 h-4" />
                      <span className="font-medium">Phone</span>
                    </button>
                    <button
                      onClick={() => setMethod('email')}
                      className={cn(
                        "flex-1 flex items-center justify-center space-x-2 py-3 rounded-xl transition-all",
                        method === 'email' 
                          ? "bg-primary text-white shadow-lg" 
                          : "text-white/60 hover:text-white"
                      )}
                    >
                      <Mail className="w-4 h-4" />
                      <span className="font-medium">Email</span>
                    </button>
                  </div>

                  {/* Input Fields */}
                  {method === 'phone' ? (
                    <div>
                      <label className="block text-white font-medium mb-3 text-base">Phone Number</label>
                      <PhoneInputTZ
                        value={phoneNumber}
                        onChange={setPhoneNumber}
                        placeholder="7XX XXX XXX"
                        error={errors.phone}
                        className={cn(
                          errors.phone && "border-red-500"
                        )}
                      />
                    </div>
                  ) : (
                    <div>
                      <label className="block text-white font-medium mb-3 text-base">Email Address</label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="hello@example.com"
                        className={cn(
                          "w-full px-4 py-4 text-base rounded-lg bg-white/5 border border-white/10",
                          "text-white placeholder:text-gray-400 focus:border-primary focus:bg-white/10",
                          "transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/20",
                          errors.email && "border-red-500"
                        )}
                        autoComplete="email"
                      />
                      {errors.email && (
                        <p className="text-red-400 text-sm mt-2">{errors.email}</p>
                      )}
                    </div>
                  )}

                  {/* General Error */}
                  {errors.general && (
                    <p className="text-red-400 text-sm text-center">{errors.general}</p>
                  )}

                  {/* Send Code Button */}
                  <button
                    onClick={handleSendCode}
                    disabled={isLoading}
                    className="w-full py-4 text-base font-semibold bg-primary hover:bg-primary/90 text-white rounded-lg transition-all duration-200 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Sending Code...</span>
                      </div>
                    ) : (
                      'Send Code'
                    )}
                  </button>

                  {/* Divider */}
                  <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-white/20" />
                    </div>
                    <div className="relative flex justify-center">
                      <span className="px-4 bg-[#0b0b16] text-sm text-white/60">Or continue with</span>
                    </div>
                  </div>

                  {/* Alternative Login Methods */}
                  <div className="space-y-3">
                    <button
                      onClick={handleWhatsAppLogin}
                      className="w-full py-3 h-12 rounded-xl bg-[#25D366] hover:bg-[#128C7E] text-white font-semibold transition-all duration-200 flex items-center justify-center space-x-3 focus:outline-none focus:ring-2 focus:ring-[#25D366]/20"
                      aria-label="Continue with WhatsApp"
                    >
                      <svg
                        className="w-5 h-5 text-white"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                      </svg>
                      <span className="font-semibold">Continue with WhatsApp</span>
                    </button>

                    <button
                      onClick={handleGoogleLogin}
                      disabled={isLoading}
                      className="w-full py-4 text-base font-semibold bg-white/10 hover:bg-white/20 text-white rounded-lg border border-white/20 transition-all duration-200 flex items-center justify-center space-x-3 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-white/20"
                    >
                      <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                      <span className="font-semibold">Continue with Google</span>
                    </button>
                  </div>
                </>
              ) : step === 'whatsapp-token' ? (
                <>
                  {/* WhatsApp Token Input */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-white font-medium mb-3 text-base">Verification Token</label>
                      <input
                        type="text"
                        value={whatsappToken}
                        onChange={(e) => setWhatsappToken(e.target.value.toUpperCase())}
                        placeholder="Enter token from WhatsApp"
                        className={cn(
                          "w-full px-4 py-4 text-base rounded-lg bg-white/5 border border-white/10",
                          "text-white placeholder:text-gray-400 focus:border-primary focus:bg-white/10",
                          "transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/20",
                          "text-center font-mono text-lg tracking-widest",
                          errors.whatsappToken && "border-red-500"
                        )}
                        autoComplete="off"
                        maxLength={20}
                      />
                      {errors.whatsappToken && (
                        <p className="text-red-400 text-sm mt-2 text-center">{errors.whatsappToken}</p>
                      )}
                    </div>
                  </div>

                  {/* Verify Button */}
                  <button
                    onClick={handleWhatsAppTokenVerification}
                    disabled={isLoading || whatsappToken.length < 4}
                    className="w-full py-4 text-base font-semibold bg-primary hover:bg-primary/90 text-white rounded-lg transition-all duration-200 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Verifying...</span>
                      </div>
                    ) : (
                      'Verify Token'
                    )}
                  </button>

                  {/* Help Text */}
                  <div className="text-center">
                    <p className="text-white/60 text-sm mb-2">
                      Open WhatsApp and check your message from AkiliPesa
                    </p>
                    <button
                      onClick={handleWhatsAppLogin}
                      className="text-primary hover:text-primary/80 font-medium text-sm"
                    >
                      Resend WhatsApp Message
                    </button>
                  </div>
                </>
              ) : (
                <>
                  {/* OTP Input */}
                  <div className="space-y-4">
                    <OTPInput
                      value={otp}
                      onChange={setOTP}
                      onComplete={handleVerifyOTP}
                    />

                    {errors.otp && (
                      <p className="text-red-400 text-sm text-center">{errors.otp}</p>
                    )}
                  </div>

                  {/* Verify Button */}
                  <button
                    onClick={handleVerifyOTP}
                    disabled={isLoading || otp.length !== 6}
                    className="w-full py-4 text-base font-semibold bg-primary hover:bg-primary/90 text-white rounded-lg transition-all duration-200 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Verifying...</span>
                      </div>
                    ) : (
                      'Verify Code'
                    )}
                  </button>

                  {/* Resend Code */}
                  <div className="text-center">
                    <p className="text-white/60 text-base mb-2">Didn't receive the code?</p>
                    <button
                      onClick={handleResendCode}
                      disabled={resendTimer > 0}
                      className={cn(
                        "font-semibold transition-colors",
                        resendTimer > 0
                          ? "text-white/40 cursor-not-allowed"
                          : "text-primary hover:text-primary/80"
                      )}
                    >
                      {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend Code'}
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Legal */}
            <div className="mt-6 text-center">
              <p className="text-xs text-white/40 leading-relaxed">
                By continuing, you agree to our{' '}
                <Link to="/terms" className="text-primary hover:underline">Terms of Service</Link>
                {' '}and{' '}
                <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link>
              </p>
            </div>

            {/* reCAPTCHA Notice - moved below CTAs */}
            <div className="mt-4">
              <RecaptchaBadge variant="compact" className="justify-center" />
              <p className="text-xs text-white/40 text-center mt-2 leading-relaxed">
                This site is protected by reCAPTCHA and the Google Privacy Policy applies.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom safe area */}
        <div className="safe-bottom" />
      </div>
    </div>
  );
}
