import { forwardRef } from 'react';
import PhoneInput from 'react-phone-number-input';
import { isValidPhoneNumber } from 'react-phone-number-input';
import { cn } from '@/lib/utils';
import 'react-phone-number-input/style.css';

interface PhoneInputTZProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  error?: string;
  disabled?: boolean;
}

const PhoneInputTZ = forwardRef<HTMLInputElement, PhoneInputTZProps>(
  ({ value, onChange, placeholder = '7XX XXX XXX', className, error, disabled }, _ref) => {
    
    // Normalize input to E.164 format
    const handleChange = (newValue: string | undefined) => {
      if (!newValue) {
        onChange('');
        return;
      }

      // Handle various Tanzania formats
      let normalized = newValue;
      
      // Remove any non-digit characters except +
      const digits = newValue.replace(/[^\d+]/g, '');
      
      // Normalize different Tanzania formats to E.164
      if (digits.startsWith('0')) {
        // 0xxxxxxx → +2557xxxxxxx
        normalized = '+255' + digits.slice(1);
      } else if (digits.startsWith('255')) {
        // 255xxxxxxx → +255xxxxxxx
        normalized = '+' + digits;
      } else if (digits.startsWith('+255')) {
        // +255xxxxxxx → keep as is
        normalized = digits;
      } else if (digits.match(/^[67]/)) {
        // 7xxxxxxx or 6xxxxxxx → +2557xxxxxxx
        normalized = '+255' + digits;
      } else if (!digits.startsWith('+')) {
        // Any other format, assume Tanzania mobile
        normalized = '+255' + digits;
      }

      // Validate it's a proper Tanzania number
      if (normalized.length <= 13 && normalized.startsWith('+255')) {
        onChange(normalized);
      }
    };

    const isValid = () => {
      if (!value) return false;
      return isValidPhoneNumber(value, 'TZ');
    };

    return (
      <div className="relative">
        <div className="phone-input-wrapper">
          <PhoneInput
            ref={ref}
            country="TZ"
            defaultCountry="TZ"
            value={value}
            onChange={handleChange}
            placeholder={placeholder}
            disabled={disabled}
            international={false}
            withCountryCallingCode={false}
            countrySelectProps={{
              disabled: true,
              style: { display: 'none' }
            }}
            numberInputProps={{
              className: cn(
                "w-full h-12 rounded-xl pl-[68px] pr-12",
                "bg-white/4 border border-white/12",
                "text-white/90 placeholder:text-white/40",
                "focus:outline-none focus:ring-4 focus:ring-[#7C6BFF]/35 focus:border-[#7C6BFF]",
                "transition-all duration-200",
                error && "border-red-500 focus:ring-red-500/35",
                disabled && "opacity-50 cursor-not-allowed"
              ),
              'aria-label': 'Tanzania phone number'
            }}
            className={cn("relative", className)}
          />
        </div>
        
        {/* +255 Prefix Overlay */}
        <span className={cn(
          "absolute left-3 top-1/2 -translate-y-1/2",
          "h-7 px-2 rounded-md flex items-center",
          "bg-white/8 text-[#BBD0FF] font-semibold text-sm tracking-wide select-none",
          "pointer-events-none z-10"
        )}>
          +255
        </span>
        
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
            Accepts: 0xxxxxxx, 255xxxxxxx, +255xxxxxxx, 7xxxxxxx
          </p>
        )}

        <style jsx>{`
          .phone-input-wrapper :global(.PhoneInputCountry) {
            display: none !important;
          }
          .phone-input-wrapper :global(.PhoneInputInput) {
            padding-left: 68px !important;
            background: rgba(255, 255, 255, 0.04) !important;
            border: 1px solid rgba(255, 255, 255, 0.12) !important;
            border-radius: 0.75rem !important;
            height: 3rem !important;
            color: rgba(255, 255, 255, 0.9) !important;
          }
          .phone-input-wrapper :global(.PhoneInputInput::placeholder) {
            color: rgba(255, 255, 255, 0.4) !important;
          }
          .phone-input-wrapper :global(.PhoneInputInput:focus) {
            outline: none !important;
            border-color: #7C6BFF !important;
            box-shadow: 0 0 0 4px rgba(124, 107, 255, 0.35) !important;
          }
        `}</style>
      </div>
    );
  }
);

PhoneInputTZ.displayName = 'PhoneInputTZ';

export default PhoneInputTZ;
