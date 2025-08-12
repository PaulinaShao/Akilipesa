import React from 'react';
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
  showWordmark = true,
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
        src="/src/assets/brand/akilipesa-logo.svg"
        alt="AkiliPesa tanzanite logo"
        className="brand-logo"
        width="0" 
        height="0" // Let CSS control size
      />
      
      {/* Wordmark */}
      {showWordmark && (
        <div className="brand-wordmark">
          AkiliPesa
        </div>
      )}
    </div>
  );
}
