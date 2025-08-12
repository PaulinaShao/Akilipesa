import Lottie from 'lottie-react';
import { cn } from '@/lib/utils';
import { LottieErrorBoundary } from './LottieErrorBoundary';

// Import the Lottie animation data
import tanzaniteSparkleAnimation from '@/assets/akilipesa_tanzanite_sparkle_v1.json';

interface AkiliLogoProps {
  variant?: 'hero' | 'compact' | 'navigation';
  className?: string;
  showSparkles?: boolean;
  animated?: boolean;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
}

export default function AkiliLogo({ 
  variant = 'compact', 
  className,
  showSparkles = true,
  animated = true,
  size = 'md'
}: AkiliLogoProps) {
  
  // Enhanced sizing with 25% increase
  const sizeClasses = {
    xs: { container: 'w-8 h-8', text: 'text-base', logoSize: '32' },
    sm: { container: 'w-10 h-10', text: 'text-lg', logoSize: '40' },
    md: { container: 'w-16 h-16', text: 'text-xl', logoSize: '64' },
    lg: { container: 'w-20 h-20', text: 'text-2xl', logoSize: '80' },
    xl: { container: 'w-32 h-32', text: 'text-3xl', logoSize: '128' },
    xxl: { container: 'w-40 h-40', text: 'text-4xl', logoSize: '160' }
  };

  const currentSize = sizeClasses[size];

  // New high-quality Tanzanite logo with brain neural network design
  const newLogoImage = "/src/assets/akilipesa-new-logo.png";

  // Hero variant for splash, login, and major screens
  if (variant === 'hero') {
    return (
      <div className={cn('tz-logo-hero flex flex-col items-center gap-6', className)}>
        <div className="relative">
          {/* Enhanced glow effect */}
          <div className="absolute inset-0 scale-125 opacity-60">
            <div className="w-40 h-40 bg-gradient-to-r from-blue-600/40 via-violet-600/40 to-purple-600/40 rounded-full blur-3xl" />
          </div>
          
          {animated && showSparkles ? (
            <LottieErrorBoundary
              fallbackComponent={
                <div className="relative">
                  <img
                    src={newLogoImage}
                    alt="AkiliPesa Tanzanite AI logo"
                    className="w-40 h-40 object-contain drop-shadow-2xl relative z-10"
                    loading="eager"
                  />
                  {/* CSS sparkle effect fallback */}
                  <div className="absolute inset-0 opacity-70">
                    <div className="w-2 h-2 bg-blue-300 rounded-full absolute top-4 right-8 animate-pulse" />
                    <div className="w-1 h-1 bg-violet-300 rounded-full absolute top-12 right-4 animate-ping" style={{ animationDelay: '0.5s' }} />
                    <div className="w-2 h-2 bg-purple-300 rounded-full absolute bottom-8 left-6 animate-pulse" style={{ animationDelay: '1s' }} />
                    <div className="w-1 h-1 bg-blue-300 rounded-full absolute bottom-4 right-12 animate-ping" style={{ animationDelay: '1.5s' }} />
                  </div>
                </div>
              }
            >
              <div className="relative">
                {/* Background glow effect */}
                <div className="absolute inset-0 scale-110 opacity-70">
                  <Lottie
                    animationData={tanzaniteSparkleAnimation}
                    loop={true}
                    className="w-40 h-40 lottie-container"
                    style={{
                      filter: 'blur(2px)',
                    }}
                  />
                </div>
                {/* Main animated logo */}
                <Lottie
                  animationData={tanzaniteSparkleAnimation}
                  loop={true}
                  className="w-40 h-40 relative z-10 lottie-container"
                  rendererSettings={{
                    preserveAspectRatio: 'xMidYMid slice'
                  }}
                />
                {/* Overlay new logo */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <img
                    src={newLogoImage}
                    alt="AkiliPesa Tanzanite AI logo"
                    className="w-32 h-32 object-contain drop-shadow-xl"
                    loading="eager"
                  />
                </div>
              </div>
            </LottieErrorBoundary>
          ) : (
            <img 
              src={newLogoImage}
              alt="AkiliPesa Tanzanite AI logo"
              className="w-40 h-40 object-contain drop-shadow-2xl relative z-10"
              loading="eager"
            />
          )}
        </div>
        <div className="wordmark text-4xl font-bold bg-gradient-to-r from-blue-600 via-violet-600 to-purple-600 bg-clip-text text-transparent text-center">
          AkiliPesa
        </div>
      </div>
    );
  }

  // Navigation variant for navbar
  if (variant === 'navigation') {
    return (
      <div className={cn('flex items-center gap-3', className)}>
        <div className="relative">
          {animated && showSparkles ? (
            <LottieErrorBoundary
              fallbackComponent={
                <img
                  src={newLogoImage}
                  alt="AkiliPesa"
                  className={cn(currentSize.container, "object-contain drop-shadow-lg")}
                  loading="lazy"
                />
              }
            >
              <div className="relative">
                <Lottie
                  animationData={tanzaniteSparkleAnimation}
                  loop={true}
                  className={cn(currentSize.container, "lottie-container opacity-70 absolute inset-0")}
                  rendererSettings={{
                    preserveAspectRatio: 'xMidYMid slice'
                  }}
                />
                <img
                  src={newLogoImage}
                  alt="AkiliPesa"
                  className={cn(currentSize.container, "object-contain drop-shadow-lg relative z-10")}
                  loading="lazy"
                />
              </div>
            </LottieErrorBoundary>
          ) : (
            <img 
              src={newLogoImage}
              alt="AkiliPesa"
              className={cn(currentSize.container, "object-contain drop-shadow-lg")}
              loading="lazy"
            />
          )}
        </div>
        <span className={cn('wordmark font-bold bg-gradient-to-r from-blue-600 via-violet-600 to-purple-600 bg-clip-text text-transparent', currentSize.text)}>
          AkiliPesa
        </span>
      </div>
    );
  }

  // Compact variant for general use
  return (
    <div className={cn('flex items-center gap-3', className)}>
      <div className="relative">
        {animated && showSparkles ? (
          <LottieErrorBoundary
            fallbackComponent={
              <img
                src={newLogoImage}
                alt="AkiliPesa"
                className={cn(currentSize.container, "object-contain drop-shadow-md")}
                loading="lazy"
              />
            }
          >
            <div className="relative">
              <Lottie
                animationData={tanzaniteSparkleAnimation}
                loop={true}
                className={cn(currentSize.container, "lottie-container opacity-60 absolute inset-0")}
                rendererSettings={{
                  preserveAspectRatio: 'xMidYMid slice'
                }}
              />
              <img
                src={newLogoImage}
                alt="AkiliPesa"
                className={cn(currentSize.container, "object-contain drop-shadow-md relative z-10")}
                loading="lazy"
              />
            </div>
          </LottieErrorBoundary>
        ) : (
          <img
            src={newLogoImage}
            alt="AkiliPesa"
            className={cn(currentSize.container, "object-contain drop-shadow-md")}
            loading="lazy"
          />
        )}
      </div>
      <span className={cn('wordmark font-bold bg-gradient-to-r from-blue-600 via-violet-600 to-purple-600 bg-clip-text text-transparent', currentSize.text)}>
        AkiliPesa
      </span>
    </div>
  );
}

// Logo-only component for favicons and minimal usage
export function AkiliLogoMark({ 
  className, 
  animated = false,
  size = 'md' 
}: { 
  className?: string; 
  animated?: boolean;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}) {
  const sizeClasses = {
    xs: 'w-6 h-6',
    sm: 'w-8 h-8', 
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
    xl: 'w-20 h-20'
  };

  const newLogoImage = "/src/assets/akilipesa-new-logo.png";

  if (animated) {
    return (
      <LottieErrorBoundary
        fallbackComponent={
          <img
            src={newLogoImage}
            alt="AkiliPesa"
            className={cn(sizeClasses[size], "object-contain drop-shadow-md", className)}
            loading="lazy"
          />
        }
      >
        <div className="relative">
          <Lottie
            animationData={tanzaniteSparkleAnimation}
            loop={true}
            className={cn(sizeClasses[size], "lottie-container opacity-60 absolute inset-0")}
            rendererSettings={{
              preserveAspectRatio: 'xMidYMid slice'
            }}
          />
          <img
            src={newLogoImage}
            alt="AkiliPesa"
            className={cn(sizeClasses[size], "object-contain drop-shadow-md relative z-10", className)}
            loading="lazy"
          />
        </div>
      </LottieErrorBoundary>
    );
  }

  return (
    <img 
      src={newLogoImage}
      alt="AkiliPesa"
      className={cn(sizeClasses[size], "object-contain drop-shadow-md", className)}
      loading="lazy"
    />
  );
}


// Monochrome version for favicons
export function TanzaniteMarkMono({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <g transform="translate(4, 2)">
        <path d="M16 2 L28 8 L22 18 L10 18 Z" fill="currentColor" />
        <path d="M16 2 L22 18 L16 34 L4 18 Z" fill="currentColor" opacity="0.8" />
        <path d="M28 8 L32 14 L22 18 L16 2 Z" fill="currentColor" opacity="0.6" />
        <path d="M4 8 L16 2 L4 18 L0 14 Z" fill="currentColor" opacity="0.9" />
        <path d="M4 18 L16 34 L12 28 L0 22 Z" fill="currentColor" />
        <path d="M22 18 L32 22 L28 28 L16 34 Z" fill="currentColor" opacity="0.7" />
        <path d="M0 14 L4 8 L4 18 L0 22 Z" fill="currentColor" />
        <path d="M32 14 L32 22 L28 28 L28 8 Z" fill="currentColor" opacity="0.5" />
        
        {/* Simplified neural network pattern */}
        <g stroke="currentColor" strokeWidth="0.5" fill="none" opacity="0.4">
          <path d="M16 12 L20 16 L16 20 L12 16 Z" />
          <circle cx="16" cy="14" r="0.5" fill="currentColor" />
          <circle cx="16" cy="18" r="0.5" fill="currentColor" />
        </g>
      </g>
    </svg>
  );
}
