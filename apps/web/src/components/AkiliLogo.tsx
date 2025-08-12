import Lottie from 'lottie-react';
import { cn } from '@/lib/utils';
import { LottieErrorBoundary } from './LottieErrorBoundary';

// Import the Lottie animation data dynamically to avoid build issues
const tanzaniteSparkleAnimation = () => import('/akilipesa_tanzanite_sparkle_v1.json');

interface AkiliLogoProps {
  variant?: 'hero' | 'compact' | 'navigation';
  className?: string;
  showSparkles?: boolean;
  animated?: boolean;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

export default function AkiliLogo({ 
  variant = 'compact', 
  className,
  showSparkles = true,
  animated = true,
  size = 'md'
}: AkiliLogoProps) {
  
  const sizeClasses = {
    xs: { container: 'w-6 h-6', text: 'text-sm' },
    sm: { container: 'w-8 h-8', text: 'text-base' },
    md: { container: 'w-12 h-12', text: 'text-lg' },
    lg: { container: 'w-16 h-16', text: 'text-xl' },
    xl: { container: 'w-24 h-24', text: 'text-2xl' }
  };

  const currentSize = sizeClasses[size];

  // New high-quality Tanzanite logo
  const logoImage = "https://cdn.builder.io/api/v1/image/assets%2Fd3b228cddfa346f0aa1ed35137c6f24e%2F22d55c7f38bd4fecbb8ee5c33096f088?format=webp&width=800";

  // Hero variant for splash, login, and major screens
  if (variant === 'hero') {
    return (
      <div className={cn('tz-logo-hero flex flex-col items-center gap-4', className)}>
        <div className="relative">
          {animated && showSparkles ? (
            <LottieErrorBoundary
              fallbackComponent={
                <img
                  src={logoImage}
                  alt="AkiliPesa Tanzanite logo"
                  className="w-32 h-32 object-contain"
                  loading="eager"
                />
              }
            >
              <div className="relative">
                {/* Background glow effect */}
                <div className="absolute inset-0 scale-110 opacity-70">
                  <Lottie
                    animationData={tanzaniteSparkleAnimation}
                    loop={true}
                    className="w-32 h-32 lottie-container"
                    style={{
                      filter: 'blur(2px)',
                    }}
                  />
                </div>
                {/* Main animated logo */}
                <Lottie
                  animationData={tanzaniteSparkleAnimation}
                  loop={true}
                  className="w-32 h-32 relative z-10 lottie-container"
                  rendererSettings={{
                    preserveAspectRatio: 'xMidYMid slice'
                  }}
                />
              </div>
            </LottieErrorBoundary>
          ) : (
            <img 
              src={logoImage}
              alt="AkiliPesa Tanzanite logo"
              className="w-32 h-32 object-contain"
              loading="eager"
            />
          )}
        </div>
        <div className="wordmark text-3xl font-bold bg-gradient-to-r from-[var(--tz-gem-500)] via-[var(--tz-royal-500)] to-[var(--tz-ice-400)] bg-clip-text text-transparent">
          AkiliPesa
        </div>
      </div>
    );
  }

  // Navigation variant for navbar
  if (variant === 'navigation') {
    return (
      <div className={cn('flex items-center gap-2', className)}>
        <div className="relative">
          {animated && showSparkles ? (
            <LottieErrorBoundary
              fallbackComponent={
                <img
                  src={logoImage}
                  alt="AkiliPesa"
                  className={cn(currentSize.container, "object-contain")}
                  loading="lazy"
                />
              }
            >
              <Lottie
                animationData={tanzaniteSparkleAnimation}
                loop={true}
                className={cn(currentSize.container, "lottie-container")}
                rendererSettings={{
                  preserveAspectRatio: 'xMidYMid slice'
                }}
              />
            </LottieErrorBoundary>
          ) : (
            <img 
              src={logoImage}
              alt="AkiliPesa"
              className={cn(currentSize.container, "object-contain")}
              loading="lazy"
            />
          )}
        </div>
        <span className={cn('wordmark font-bold text-[var(--tz-ink)]', currentSize.text)}>
          AkiliPesa
        </span>
      </div>
    );
  }

  // Compact variant for general use
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div className="relative">
        {animated && showSparkles ? (
          <LottieErrorBoundary
            fallbackComponent={
              <TanzaniteGemSVG className={cn(currentSize.container)} />
            }
          >
            <Lottie
              animationData={tanzaniteSparkleAnimation}
              loop={true}
              className={cn(currentSize.container, "lottie-container")}
              rendererSettings={{
                preserveAspectRatio: 'xMidYMid slice'
              }}
            />
          </LottieErrorBoundary>
        ) : (
          <TanzaniteGemSVG className={cn(currentSize.container)} />
        )}
      </div>
      <span className={cn('wordmark font-bold text-[var(--tz-ink)]', currentSize.text)}>
        AkiliPesa
      </span>
    </div>
  );
}

// Fallback SVG component for when Lottie fails or in static mode
function TanzaniteGemSVG({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <g transform="translate(2, 2)">
        {/* Main facets with updated Tanzanite colors */}
        <path d="M14 2 L22 6 L18 14 L10 14 Z" fill="#6E3CE6" />
        <path d="M14 2 L18 14 L14 26 L6 14 Z" fill="#2C3CFF" />
        <path d="M22 6 L26 10 L18 14 L14 2 Z" fill="#6BB6FF" />
        <path d="M6 6 L14 2 L6 14 L2 10 Z" fill="#5A2FD8" />
        <path d="M6 14 L14 26 L10 22 L2 18 Z" fill="#4726C5" />
        <path d="M18 14 L26 18 L22 22 L14 26 Z" fill="#6E3CE6" />
        <path d="M2 10 L6 6 L6 14 L2 18 Z" fill="#4726C5" />
        <path d="M26 10 L26 18 L22 22 L22 6 Z" fill="#6BB6FF" />
        {/* Inner reflections */}
        <path d="M14 8 L18 12 L14 18 L10 12 Z" fill="#B8C2FF" opacity="0.7" />
        <path d="M12 6 L16 4 L16 12 L12 12 Z" fill="#E6E9FF" opacity="0.5" />
        {/* Highlight */}
        <path d="M14 4 L16 6 L14 10 L12 6 Z" fill="#FFFFFF" opacity="0.6" />
      </g>
    </svg>
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
    xs: 'w-4 h-4',
    sm: 'w-6 h-6', 
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const logoImage = "https://cdn.builder.io/api/v1/image/assets%2Fd3b228cddfa346f0aa1ed35137c6f24e%2F22d55c7f38bd4fecbb8ee5c33096f088?format=webp&width=800";

  if (animated) {
    return (
      <LottieErrorBoundary
        fallbackComponent={
          <img
            src={logoImage}
            alt="AkiliPesa"
            className={cn(sizeClasses[size], "object-contain", className)}
            loading="lazy"
          />
        }
      >
        <Lottie
          animationData={tanzaniteSparkleAnimation}
          loop={true}
          className={cn(sizeClasses[size], "lottie-container", className)}
          rendererSettings={{
            preserveAspectRatio: 'xMidYMid slice'
          }}
        />
      </LottieErrorBoundary>
    );
  }

  return (
    <img 
      src={logoImage}
      alt="AkiliPesa"
      className={cn(sizeClasses[size], "object-contain", className)}
      loading="lazy"
    />
  );
}

// Monochrome version for favicons
export function TanzaniteMarkMono({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <g transform="translate(2, 2)">
        <path d="M14 2 L22 6 L18 14 L10 14 Z" fill="currentColor" />
        <path d="M14 2 L18 14 L14 26 L6 14 Z" fill="currentColor" opacity="0.8" />
        <path d="M22 6 L26 10 L18 14 L14 2 Z" fill="currentColor" opacity="0.6" />
        <path d="M6 6 L14 2 L6 14 L2 10 Z" fill="currentColor" opacity="0.9" />
        <path d="M6 14 L14 26 L10 22 L2 18 Z" fill="currentColor" />
        <path d="M18 14 L26 18 L22 22 L14 26 Z" fill="currentColor" opacity="0.7" />
        <path d="M2 10 L6 6 L6 14 L2 18 Z" fill="currentColor" />
        <path d="M26 10 L26 18 L22 22 L22 6 Z" fill="currentColor" opacity="0.5" />
      </g>
    </svg>
  );
}
