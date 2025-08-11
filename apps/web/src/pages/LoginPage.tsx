import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Phone, Mail, ArrowLeft, MessageCircle } from 'lucide-react';
import TanzaniteLogo from '@/components/TanzaniteLogo';
import NumberInputTZ from '@/components/NumberInputTZ';
import RecaptchaBadge from '@/components/RecaptchaBadge';
import { useToast } from '@/hooks/useToast';
import { cn, isValidTanzanianPhone, isValidEmail } from '@/lib/utils';

interface OTPInputProps {
  value: string;
  onChange: (value: string) => void;
  onComplete: () => void;
}

function OTPInput({ value, onChange, onComplete }: OTPInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const newValue = e.target.value.replace(/[^0-9]/g, '');
    if (newValue.length <= 1) {
      const newOTP = value.split('');
      newOTP[index] = newValue;
      const result = newOTP.join('');
      onChange(result);
      
      // Auto-advance to next input
      if (newValue && index < 5) {
        const nextInput = document.getElementById(`otp-${index + 1}`);
        nextInput?.focus();
      }
      
      // Auto-submit when complete
      if (result.length === 6 && !result.includes('')) {
        setTimeout(onComplete, 100);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'Backspace' && !value[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  return (
    <div className="flex space-x-2 justify-center">
      {Array.from({ length: 6 }).map((_, index) => (
        <input
          key={index}
          id={`otp-${index}`}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={value[index] || ''}
          onChange={(e) => handleChange(e, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          className="w-12 h-12 text-center text-lg font-bold bg-white/5 border border-white/20 rounded-lg text-white focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
          autoComplete="one-time-code"
        />
      ))}
    </div>
  );
}

export default function LoginPage() {
  const [method, setMethod] = useState<'phone' | 'email'>('phone');
  const [step, setStep] = useState<'input' | 'otp'>('input');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [otp, setOTP] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const navigate = useNavigate();
  const location = useLocation();
  const { addToast } = useToast();

  const from = location.state?.from?.pathname || '/reels';

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
    // WhatsApp number for AkiliPesa verification
    const WHATSAPP_NUMBER = 'whatsapp:+15557679073';
    const phoneNumber = '+15557679073';

    // Create WhatsApp deep link to request verification token
    const message = encodeURIComponent('Hello AkiliPesa! I need a verification token to sign in to my account.');
    const whatsappUrl = `https://wa.me/${phoneNumber.replace('+', '')}?text=${message}`;

    // Open WhatsApp in new tab/app
    window.open(whatsappUrl, '_blank');

    addToast({
      type: 'info',
      title: 'WhatsApp Verification',
      description: 'Message AkiliPesa on WhatsApp to receive your verification token',
    });

    // After user clicks WhatsApp, show a prompt to enter the token they received
    setTimeout(() => {
      const token = prompt('Enter the verification token you received from AkiliPesa on WhatsApp:');
      if (token) {
        handleWhatsAppTokenVerification(token);
      }
    }, 2000);
  };

  const handleWhatsAppTokenVerification = async (token: string) => {
    if (!token || token.length < 4) {
      addToast({
        type: 'error',
        title: 'Invalid Token',
        description: 'Please enter a valid verification token from WhatsApp',
      });
      return;
    }

    setIsLoading(true);

    try {
      // Simulate token verification
      await new Promise(resolve => setTimeout(resolve, 1500));

      // For demo purposes, accept any token with 4+ characters
      if (token.length >= 4) {
        addToast({
          type: 'success',
          title: 'WhatsApp Login Successful',
          description: 'Welcome to AkiliPesa!',
        });
        navigate(from, { replace: true });
      } else {
        addToast({
          type: 'error',
          title: 'Invalid Token',
          description: 'The verification token is incorrect. Please try again.',
        });
      }
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Verification Failed',
        description: 'Unable to verify WhatsApp token. Please try again.',
      });
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
                {step === 'input' ? 'Welcome Back' : 'Enter Code'}
              </h1>
              <p className="text-base text-white/70 leading-relaxed">
                {step === 'input'
                  ? 'Sign in to continue to AkiliPesa'
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
                      <NumberInputTZ
                        value={phoneNumber}
                        onChange={setPhoneNumber}
                        placeholder="7XX XXX XXX"
                        className={cn(
                          errors.phone && "border-red-500"
                        )}
                      />
                      {errors.phone && (
                        <p className="text-red-400 text-sm mt-2">{errors.phone}</p>
                      )}
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
                      className="w-full py-3 h-12 rounded-xl bg-[#25D366] hover:bg-[#1FB256] text-[#0B0A15] font-bold transition-all duration-200 flex items-center justify-center space-x-3 focus:outline-none focus:ring-2 focus:ring-[#25D366]/20"
                      aria-label="Continue with WhatsApp"
                    >
                      <div className="w-5 h-5 bg-[#075E54] rounded-full flex items-center justify-center">
                        <MessageCircle className="w-3 h-3 text-white" />
                      </div>
                      <span className="font-bold">Continue with WhatsApp</span>
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
