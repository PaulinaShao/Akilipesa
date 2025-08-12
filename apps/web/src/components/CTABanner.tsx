import { useNavigate } from 'react-router-dom';
import { Star, Zap, DollarSign, Sparkles, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CTABannerProps {
  variant?: 'earning' | 'features' | 'premium' | 'create';
  className?: string;
  onClose?: () => void;
  compact?: boolean;
}

export default function CTABanner({ 
  variant = 'earning', 
  className,
  onClose,
  compact = false 
}: CTABannerProps) {
  const navigate = useNavigate();

  const variants = {
    earning: {
      title: 'Start Earning with AkiliPesa',
      subtitle: 'Turn your creativity into cash',
      benefits: [
        { icon: DollarSign, text: 'Earn from every reel and interaction' },
        { icon: Star, text: 'Get paid for product sales' },
        { icon: Zap, text: 'Access AI creation tools' }
      ],
      action: 'Sign up to earn',
      route: '/auth/login'
    },
    features: {
      title: 'Unlock Full Features',
      subtitle: 'Get the complete AkiliPesa experience',
      benefits: [
        { icon: Sparkles, text: 'AI-powered content creation' },
        { icon: Star, text: 'Live streaming & calls' },
        { icon: DollarSign, text: 'Business tools & analytics' }
      ],
      action: 'Get full access',
      route: '/auth/login'
    },
    premium: {
      title: 'Upgrade to Premium',
      subtitle: 'Unlock advanced creator tools',
      benefits: [
        { icon: Zap, text: 'Advanced AI features' },
        { icon: Star, text: 'Priority support' },
        { icon: DollarSign, text: 'Higher earning rates' }
      ],
      action: 'Upgrade now',
      route: '/plans'
    },
    create: {
      title: 'Ready to Create?',
      subtitle: 'Share your story with the world',
      benefits: [
        { icon: Sparkles, text: 'Professional editing tools' },
        { icon: Star, text: 'Reach millions of viewers' },
        { icon: DollarSign, text: 'Monetize your content' }
      ],
      action: 'Start creating',
      route: '/create'
    }
  };

  const config = variants[variant];

  if (compact) {
    return (
      <div className={cn('cta-banner p-4', className)}>
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h3 className="text-lg font-bold text-white mb-1">{config.title}</h3>
            <p className="text-white/80 text-sm">{config.subtitle}</p>
          </div>
          <button
            onClick={() => navigate(config.route)}
            className="btn-primary px-4 py-2 text-sm ml-4 flex items-center gap-2"
          >
            {config.action}
            <ArrowRight className="w-4 h-4" />
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 text-white/60 hover:text-white ml-2"
            >
              ×
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={cn('cta-banner', className)}>
      <div className="relative z-10">
        <h2 className="cta-highlight">{config.title}</h2>
        <p className="text-white/90 mb-6">{config.subtitle}</p>
        
        <div className="benefit-list">
          {config.benefits.map((benefit, index) => (
            <div key={index} className="benefit-item">
              <benefit.icon className="benefit-icon" />
              <span>{benefit.text}</span>
            </div>
          ))}
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => navigate(config.route)}
            className="btn-primary flex-1 flex items-center justify-center gap-2"
          >
            {config.action}
            <ArrowRight className="w-5 h-5" />
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="btn-secondary px-4 py-3 text-white/80"
            >
              Later
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// Sticky CTA for guest users
export function StickyGuestCTA({ onDismiss }: { onDismiss?: () => void }) {
  const navigate = useNavigate();
  
  return (
    <div className="fixed bottom-20 left-4 right-4 z-40 sm:left-6 sm:right-6 lg:left-8 lg:right-8">
      <div className="cta-banner p-4 animate-slide-up">
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <h3 className="text-white font-bold text-sm mb-1 truncate">
              Sign in to like and earn 💎
            </h3>
            <p className="text-white/80 text-xs">
              Join thousands earning from their content
            </p>
          </div>
          <div className="flex items-center gap-2 ml-4">
            <button
              onClick={() => navigate('/auth/login')}
              className="btn-primary px-3 py-2 text-xs font-semibold whitespace-nowrap"
            >
              Sign in
            </button>
            {onDismiss && (
              <button
                onClick={onDismiss}
                className="p-2 text-white/60 hover:text-white"
              >
                ×
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
