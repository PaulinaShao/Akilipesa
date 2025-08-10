import { cn } from '@/lib/utils';

interface TanzaniteLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export default function TanzaniteLogo({ className, size = 'md', showText = true }: TanzaniteLogoProps) {
  const sizes = {
    sm: { svg: 'h-6 w-6', text: 'text-lg' },
    md: { svg: 'h-8 w-8', text: 'text-xl' },
    lg: { svg: 'h-12 w-12', text: 'text-3xl' },
  };

  return (
    <div className={cn('flex items-center space-x-2', className)}>
      {/* Tanzanite Gemstone */}
      <div className={cn('relative', sizes[size].svg)}>
        <svg
          viewBox="0 0 32 32"
          fill="none"
          className="w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g transform="translate(2, 2)">
            {/* Main facets */}
            <path d="M14 2 L22 6 L18 14 L10 14 Z" fill="#2C3E9E" />
            <path d="M14 2 L18 14 L14 26 L6 14 Z" fill="#6C7BFF" />
            <path d="M22 6 L26 10 L18 14 L14 2 Z" fill="#9AD1FF" />
            <path d="M6 6 L14 2 L6 14 L2 10 Z" fill="#4854C7" />
            <path d="M6 14 L14 26 L10 22 L2 18 Z" fill="#2C3E9E" />
            <path d="M18 14 L26 18 L22 22 L14 26 Z" fill="#6C7BFF" />
            <path d="M2 10 L6 6 L6 14 L2 18 Z" fill="#1F2B70" />
            <path d="M26 10 L26 18 L22 22 L22 6 Z" fill="#5A6AE8" />
            {/* Inner reflections */}
            <path d="M14 8 L18 12 L14 18 L10 12 Z" fill="#B8C2FF" opacity="0.6" />
            <path d="M12 6 L16 4 L16 12 L12 12 Z" fill="#E6E9FF" opacity="0.4" />
          </g>
        </svg>
      </div>
      
      {showText && (
        <span className={cn('font-title font-bold text-gradient', sizes[size].text)}>
          AkiliPesa
        </span>
      )}
    </div>
  );
}
