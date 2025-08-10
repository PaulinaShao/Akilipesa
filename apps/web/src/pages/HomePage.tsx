import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Phone, Zap, Shield, Smartphone } from 'lucide-react';
import TanzaniteLogo from '@/components/TanzaniteLogo';
import { Card, CardContent, CardHeader } from '@/components/Card';
import NumberInputTZ from '@/components/NumberInputTZ';
import RecaptchaBadge from '@/components/RecaptchaBadge';
import { cn, isValidTanzanianPhone } from '@/lib/utils';

export default function HomePage() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  const handlePhoneVerification = async () => {
    if (!isValidTanzanianPhone(phoneNumber)) {
      return;
    }
    
    setIsVerifying(true);
    // Simulate verification process
    setTimeout(() => {
      setIsVerifying(false);
      // Redirect to login/dashboard
      window.location.href = '/login';
    }, 2000);
  };

  const features = [
    {
      icon: <Zap className="w-8 h-8 text-primary-600" />,
      title: 'AI-Powered Assistance',
      description: 'Get intelligent financial advice powered by advanced AI technology tailored for Tanzania.',
    },
    {
      icon: <Phone className="w-8 h-8 text-accent-500" />,
      title: 'Voice Calls',
      description: 'Speak directly with our AI assistant in Swahili or English for personalized support.',
    },
    {
      icon: <Shield className="w-8 h-8 text-glow-400" />,
      title: 'Secure & Private',
      description: 'Your financial data is protected with enterprise-grade security and encryption.',
    },
    {
      icon: <Smartphone className="w-8 h-8 text-success" />,
      title: 'Mobile-First',
      description: 'Designed for Tanzanian users with seamless mobile money integration.',
    },
  ];

  const stats = [
    { value: '10,000+', label: 'Active Users' },
    { value: '50,000+', label: 'AI Consultations' },
    { value: '99.9%', label: 'Uptime' },
    { value: '24/7', label: 'Support' },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="section-padding bg-tanzanite-subtle">
        <div className="container-responsive">
          <div className="text-center max-w-4xl mx-auto">
            {/* Logo */}
            <div className="mb-8 flex justify-center">
              <TanzaniteLogo size="lg" className="scale-125" />
            </div>

            {/* Hero Content */}
            <h1 className="heading-1 mb-6">
              Your Smart Financial
              <span className="block">Assistant for Tanzania</span>
            </h1>
            
            <p className="text-responsive text-slate-600 mb-12 max-w-2xl mx-auto">
              Get personalized financial advice, budget planning, and AI-powered insights 
              designed specifically for Tanzanian markets and mobile money systems.
            </p>

            {/* Phone Verification Card */}
            <Card className="max-w-md mx-auto mb-12" variant="glow">
              <CardHeader>
                <h3 className="heading-3 mb-2">Get Started Today</h3>
                <p className="text-slate-600">Enter your phone number to verify and access AkiliPesa</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <NumberInputTZ
                    value={phoneNumber}
                    onChange={setPhoneNumber}
                    placeholder="Enter your phone number"
                    error={phoneNumber && !isValidTanzanianPhone(phoneNumber) ? 'Please enter a valid Tanzanian phone number' : undefined}
                  />
                  
                  <button
                    onClick={handlePhoneVerification}
                    disabled={!isValidTanzanianPhone(phoneNumber) || isVerifying}
                    className={cn(
                      'w-full btn-primary flex items-center justify-center space-x-2',
                      isVerifying && 'opacity-50 cursor-not-allowed'
                    )}
                  >
                    {isVerifying ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                        <span>Verifying...</span>
                      </>
                    ) : (
                      <>
                        <span>Verify Number</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                  
                  <RecaptchaBadge variant="compact" className="justify-center" />
                </div>
              </CardContent>
            </Card>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <Link to="/dashboard" className="btn-accent px-8 py-4 text-lg">
                Start AI Call
              </Link>
              <Link to="/login" className="btn-secondary px-8 py-4 text-lg">
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white border-y border-slate-200">
        <div className="container-responsive">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-title font-bold text-gradient mb-2">
                  {stat.value}
                </div>
                <div className="text-slate-600 text-sm md:text-base">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section-padding">
        <div className="container-responsive">
          <div className="text-center mb-16">
            <h2 className="heading-2 mb-6">
              Why Choose AkiliPesa?
            </h2>
            <p className="text-responsive text-slate-600 max-w-2xl mx-auto">
              Built specifically for Tanzania with cutting-edge AI technology and deep understanding of local financial needs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} variant="glow" className="text-center">
                <CardContent>
                  <div className="flex justify-center mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="heading-3 mb-3">{feature.title}</h3>
                  <p className="text-slate-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-tanzanite-gradient">
        <div className="container-responsive text-center">
          <h2 className="heading-2 text-white mb-6">
            Ready to Transform Your Financial Future?
          </h2>
          <p className="text-xl text-white/90 mb-12 max-w-2xl mx-auto">
            Join thousands of Tanzanians who trust AkiliPesa for their financial guidance and planning.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <Link to="/login" className="btn-secondary px-8 py-4 text-lg">
              Get Started Free
            </Link>
            <Link to="/calls" className="btn-accent px-8 py-4 text-lg">
              Schedule AI Call
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
