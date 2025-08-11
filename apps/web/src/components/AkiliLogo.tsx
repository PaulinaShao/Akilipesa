import { cn } from '@/lib/utils';

interface AkiliLogoProps {
  variant?: 'hero' | 'compact';
  className?: string;
  showSparkles?: boolean;
  animated?: boolean;
}

export default function AkiliLogo({ 
  variant = 'compact', 
  className,
  showSparkles = true,
  animated = true
}: AkiliLogoProps) {
  
  if (variant === 'hero') {
    return (
      <div className={cn('tz-logo-hero', className)}>
        <div className="gem-container">
          <div className={cn('relative', animated && 'akili-shimmer')}>
            <img 
              src="https://cdn.builder.io/api/v1/image/assets%2Fd3b228cddfa346f0aa1ed35137c6f24e%2Ffd67d4de68ee4ceeb0c28b038f4887ef?format=webp&width=200"
              alt="AkiliPesa Tanzanite logo"
              className="w-16 h-16 object-contain"
              loading="eager"
            />
            {showSparkles && animated && (
              <>
                <div className="sparkle sparkle-tiny sparkle-1" />
                <div className="sparkle sparkle-2" />
                <div className="sparkle sparkle-tiny sparkle-3" />
                <div className="sparkle sparkle-large sparkle-4" />
                <div className="sparkle sparkle-5" />
              </>
            )}
          </div>
        </div>
        <div className="wordmark">AkiliPesa</div>
      </div>
    );
  }

  return (
    <div className={cn('tz-logo-compact', className)}>
      <div className={cn('relative w-8 h-8', animated && 'akili-shimmer')}>
        <TanzaniteGemSVG className="w-full h-full" />
        {showSparkles && animated && (
          <>
            <div className="sparkle sparkle-tiny sparkle-1" />
            <div className="sparkle sparkle-2" />
          </>
        )}
      </div>
      <span className="wordmark text-lg font-bold">AkiliPesa</span>
    </div>
  );
}

// Optimized SVG component for the compact logo
function TanzaniteGemSVG({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <g transform="translate(2, 2)">
        {/* Main facets */}
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
