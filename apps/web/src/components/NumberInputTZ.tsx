import { useState, forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface NumberInputTZProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  error?: string;
  disabled?: boolean;
}

const NumberInputTZ = forwardRef<HTMLInputElement, NumberInputTZProps>(
  ({ value, onChange, placeholder = '7XX XXX XXX', className, error, disabled }, ref) => {

    const handleInput = (e: React.FormEvent<HTMLInputElement>) => {
      const inputValue = e.currentTarget.value.replace(/\D/g, ''); // Remove non-digits
      
      // Normalize to Tanzania format
      let normalized = inputValue;
      if (normalized.startsWith('255')) {
        normalized = normalized;
      } else if (normalized.startsWith('0')) {
        normalized = '255' + normalized.slice(1);
      } else if (normalized.startsWith('7') || normalized.startsWith('6')) {
        normalized = '255' + normalized;
      } else if (normalized.length && !normalized.startsWith('255')) {
        normalized = '255' + normalized;
      }
      
      // Limit to 12 digits total (255 + 9 digits)
      normalized = normalized.slice(0, 12);
      
      // Store the E.164 format
      const e164 = normalized.length === 12 ? '+' + normalized : '';
      e.currentTarget.dataset.e164 = e164;
      
      onChange(normalized);
    };

    const getDisplayValue = () => {
      if (!value) return '';
      // Show only the part after 255
      return value.startsWith('255') ? value.slice(3) : value;
    };

    const isValid = () => {
      return /^2557\d{8}$/.test(value);
    };

    return (
      <div className="relative">
        {/* +255 Prefix */}
        <span className={cn(
          "absolute left-3 top-1/2 -translate-y-1/2",
          "h-7 px-2 rounded-md flex items-center",
          "bg-white/8 text-[#BBD0FF] font-semibold text-sm tracking-wide select-none",
          "pointer-events-none z-10"
        )}>
          +255
        </span>
        
        {/* Input Field */}
        <input
          ref={ref}
          type="tel"
          inputMode="numeric"
          autoComplete="tel"
          aria-label="Tanzania phone number"
          value={getDisplayValue()}
          onInput={handleInput}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={placeholder}
          disabled={disabled}
          className={cn(
            "w-full h-12 rounded-xl pl-[68px] pr-12",
            "bg-white/4 border border-white/12",
            "text-white/90 placeholder:text-white/40",
            "focus:outline-none focus:ring-4 focus:ring-[#7C6BFF]/35 focus:border-[#7C6BFF]",
            "transition-all duration-200",
            error && "border-red-500 focus:ring-red-500/35",
            disabled && "opacity-50 cursor-not-allowed",
            className
          )}
        />
        
        {/* Validity Indicator */}
        {value && (
          <span className={cn(
            "absolute right-3 top-1/2 -translate-y-1/2",
            "text-xs px-2 py-1 rounded-md bg-white/10",
            isValid() ? "text-green-400" : "text-red-400"
          )}>
            {isValid() ? "✅ Valid" : "❌ Invalid"}
          </span>
        )}
        
        {/* Error Message */}
        {error && (
          <p className="mt-2 text-sm text-red-400">
            {error}
          </p>
        )}
        
        {/* Helper Text */}
        {!error && (
          <p className="mt-1.5 text-xs text-white/65">
            Format: 7XX XXX XXX (no country code)
          </p>
        )}
      </div>
    );
  }
);

NumberInputTZ.displayName = 'NumberInputTZ';

export default NumberInputTZ;
