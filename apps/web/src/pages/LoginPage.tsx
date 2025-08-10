import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Phone, Mail, ArrowLeft } from 'lucide-react';
import TanzaniteLogo from '@/components/TanzaniteLogo';
import { Card, CardContent, CardHeader } from '@/components/Card';
import NumberInputTZ from '@/components/NumberInputTZ';
import RecaptchaBadge from '@/components/RecaptchaBadge';
import { useToast } from '@/hooks/useToast';
import { cn, isValidTanzanianPhone, isValidEmail } from '@/lib/utils';

export default function LoginPage() {
  const [method, setMethod] = useState<'phone' | 'email'>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { addToast } = useToast();

  const from = location.state?.from?.pathname || '/dashboard';

  const handlePhoneLogin = async () => {
    if (!isValidTanzanianPhone(phoneNumber)) {
      addToast({
        type: 'error',
        title: 'Invalid Phone Number',
        description: 'Please enter a valid Tanzanian phone number',
      });
      return;
    }

    setIsLoading(true);
    try {
      // Simulate phone authentication
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      addToast({
        type: 'success',
        title: 'Verification Sent',
        description: 'Check your phone for the verification code',
      });

      // In a real app, you'd verify the SMS code here
      setTimeout(() => {
        navigate(from, { replace: true });
      }, 1000);
      
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Authentication Failed',
        description: 'Unable to send verification code. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailLogin = async () => {
    if (!isValidEmail(email)) {
      addToast({
        type: 'error',
        title: 'Invalid Email',
        description: 'Please enter a valid email address',
      });
      return;
    }

    setIsLoading(true);
    try {
      // Simulate email authentication
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      addToast({
        type: 'success',
        title: 'Sign In Successful',
        description: 'Welcome to AkiliPesa!',
      });

      navigate(from, { replace: true });
      
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Authentication Failed',
        description: 'Invalid credentials. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      // Simulate Google authentication
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

  return (
    <div className="min-h-screen section-padding flex items-center justify-center">
      <div className="w-full max-w-md">
        {/* Back Button */}
        <Link to="/" className="inline-flex items-center text-slate-600 hover:text-primary-600 mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>

        {/* Login Card */}
        <Card variant="glow" padding="lg">
          <CardHeader>
            <div className="text-center mb-6">
              <TanzaniteLogo size="lg" className="justify-center mb-4" />
              <h1 className="heading-2 mb-2">Welcome Back</h1>
              <p className="text-slate-600">Sign in to access your AkiliPesa account</p>
            </div>

            {/* Method Toggle */}
            <div className="flex bg-slate-100 rounded-tanzanite p-1 mb-6">
              <button
                onClick={() => setMethod('phone')}
                className={cn(
                  'flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-lg transition-all',
                  method === 'phone' ? 'bg-white shadow-sm text-primary-600' : 'text-slate-600'
                )}
              >
                <Phone className="w-4 h-4" />
                <span className="text-sm font-medium">Phone</span>
              </button>
              <button
                onClick={() => setMethod('email')}
                className={cn(
                  'flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-lg transition-all',
                  method === 'email' ? 'bg-white shadow-sm text-primary-600' : 'text-slate-600'
                )}
              >
                <Mail className="w-4 h-4" />
                <span className="text-sm font-medium">Email</span>
              </button>
            </div>
          </CardHeader>

          <CardContent>
            {method === 'phone' ? (
              <div className="space-y-6">
                <NumberInputTZ
                  value={phoneNumber}
                  onChange={setPhoneNumber}
                  placeholder="Enter your phone number"
                  error={phoneNumber && !isValidTanzanianPhone(phoneNumber) ? 'Please enter a valid Tanzanian phone number' : undefined}
                />
                
                <button
                  onClick={handlePhoneLogin}
                  disabled={!isValidTanzanianPhone(phoneNumber) || isLoading}
                  className={cn(
                    'w-full btn-primary',
                    isLoading && 'opacity-50 cursor-not-allowed'
                  )}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                      <span>Sending Code...</span>
                    </div>
                  ) : (
                    'Send Verification Code'
                  )}
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className={cn(
                      'input',
                      email && !isValidEmail(email) && 'border-danger ring-2 ring-danger/20'
                    )}
                  />
                  {email && !isValidEmail(email) && (
                    <p className="mt-2 text-sm text-danger">
                      Please enter a valid email address
                    </p>
                  )}
                </div>
                
                <button
                  onClick={handleEmailLogin}
                  disabled={!isValidEmail(email) || isLoading}
                  className={cn(
                    'w-full btn-primary',
                    isLoading && 'opacity-50 cursor-not-allowed'
                  )}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                      <span>Signing In...</span>
                    </div>
                  ) : (
                    'Sign In'
                  )}
                </button>
              </div>
            )}

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-slate-500">Or continue with</span>
              </div>
            </div>

            {/* Google Sign In */}
            <button
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className={cn(
                'w-full btn-secondary flex items-center justify-center space-x-3',
                isLoading && 'opacity-50 cursor-not-allowed'
              )}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span>Google</span>
            </button>

            <RecaptchaBadge className="mt-6" />

            {/* Footer */}
            <div className="mt-8 text-center text-sm text-slate-600">
              <p>
                Don't have an account?{' '}
                <span className="text-primary-600 font-medium">
                  Sign up automatically on first login
                </span>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
