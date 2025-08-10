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
  ({ value, onChange, placeholder = 'Enter your phone number', className, error, disabled }, ref) => {
    const [focused, setFocused] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      let inputValue = e.target.value.replace(/\D/g, ''); // Remove non-digits
      
      // Handle different input patterns
      if (inputValue.startsWith('255')) {
        // Already has country code
        onChange(inputValue);
      } else if (inputValue.startsWith('0')) {
        // Remove leading 0 and add 255
        onChange('255' + inputValue.slice(1));
      } else if (inputValue.length > 0) {
        // Add 255 prefix
        onChange('255' + inputValue);
      } else {
        onChange('');
      }
    };

    const formatDisplayValue = (val: string) => {
      if (!val) return '';
      
      // Remove country code for display if present
      let displayValue = val;
      if (val.startsWith('255')) {
        displayValue = val.slice(3);
      }
      
      // Format as XXX XXX XXX
      displayValue = displayValue.replace(/(\d{3})(\d{3})(\d{3})/, '$1 $2 $3');
      
      return displayValue;
    };

    const displayValue = formatDisplayValue(value);

    return (
      <div className="relative">
        <div className="relative">
          {/* Country Code Display */}
          <div className="absolute left-0 top-0 h-full flex items-center pl-4 text-slate-600 bg-slate-50 border-r border-slate-300 rounded-l-tanzanite">
            <span className="text-sm font-medium">+255</span>
          </div>
          
          {/* Input Field */}
          <input
            ref={ref}
            type="tel"
            value={displayValue}
            onChange={handleChange}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder={placeholder}
            disabled={disabled}
            className={cn(
              'input pl-16 pr-4',
              focused && 'ring-2 ring-primary-500/20 border-primary-500',
              error && 'border-danger ring-2 ring-danger/20',
              disabled && 'opacity-50 cursor-not-allowed',
              className
            )}
          />
        </div>
        
        {/* Error Message */}
        {error && (
          <p className="mt-2 text-sm text-danger">
            {error}
          </p>
        )}
        
        {/* Helper Text */}
        {!error && (
          <p className="mt-2 text-xs text-slate-500">
            Format: XXX XXX XXX (without country code)
          </p>
        )}
      </div>
    );
  }
);

NumberInputTZ.displayName = 'NumberInputTZ';

export default NumberInputTZ;
