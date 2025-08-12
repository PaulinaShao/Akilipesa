import { cn } from '@/lib/utils';
import './Brand.css';

type BrandProps = {
  size?: 'sm' | 'md' | 'lg';
  showWordmark?: boolean;
  animated?: boolean;
  className?: string;
};

export default function Brand({
  size = 'lg',
  showWordmark: _showWordmark = true, // Kept for API compatibility, wordmark is included in logo
  animated = true,
  className
}: BrandProps) {
  return (
    <div 
      className={cn(
        'brand', 
        `brand-${size}`, 
        animated && 'brand-animated', 
        className
      )} 
      aria-label="AkiliPesa"
    >
      {/* Glow background effect */}
      {animated && <div className="brand-glow" />}
      
      {/* Main logo */}
      <img
        src="/src/assets/brand/akilipesa-logo-new.webp"
        alt="AkiliPesa tanzanite AI logo"
        className="brand-logo"
        loading="eager"
      />
      
      {/* Wordmark - already included in the logo image */}
    </div>
  );
}
