/**
 * Enhanced phone validation and formatting for Tanzania
 */

export interface PhoneValidationResult {
  isValid: boolean;
  formatted: string;
  e164: string;
  message?: string;
}

/**
 * Normalize and validate Tanzania phone number
 */
export function validateTZPhone(input: string): PhoneValidationResult {
  // Remove all non-digit characters except +
  let cleaned = input.replace(/[^\d+]/g, '');
  
  // Handle different input formats
  if (cleaned.startsWith('+255')) {
    cleaned = cleaned.slice(4);
  } else if (cleaned.startsWith('255')) {
    cleaned = cleaned.slice(3);
  } else if (cleaned.startsWith('0')) {
    cleaned = cleaned.slice(1);
  }
  
  // Limit to 9 digits max
  cleaned = cleaned.slice(0, 9);
  
  const result: PhoneValidationResult = {
    isValid: false,
    formatted: '',
    e164: '',
  };
  
  // Check if empty
  if (!cleaned) {
    result.message = 'Phone number is required';
    return result;
  }
  
  // Check length
  if (cleaned.length < 9) {
    result.message = 'Phone number must be 9 digits';
    result.formatted = formatTZPhoneDisplay(cleaned);
    return result;
  }
  
  // Check if starts with valid mobile prefix (6, 7)
  if (!/^[67]/.test(cleaned)) {
    result.message = 'Phone number must start with 6 or 7';
    result.formatted = formatTZPhoneDisplay(cleaned);
    return result;
  }
  
  // Valid phone number
  result.isValid = true;
  result.formatted = formatTZPhoneDisplay(cleaned);
  result.e164 = `+255${cleaned}`;
  
  return result;
}

/**
 * Format phone number for display (7XX XXX XXX)
 */
export function formatTZPhoneDisplay(digits: string): string {
  if (!digits) return '';
  
  const padded = digits.padEnd(9, ' ');
  return `${padded.slice(0, 3)} ${padded.slice(3, 6)} ${padded.slice(6, 9)}`.trim();
}

/**
 * Format input as user types with debouncing
 */
export function formatAsUserTypes(value: string): string {
  const digits = value.replace(/[^\d]/g, '');
  
  if (digits.length <= 3) {
    return digits;
  } else if (digits.length <= 6) {
    return `${digits.slice(0, 3)} ${digits.slice(3)}`;
  } else {
    return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6, 9)}`;
  }
}

/**
 * Debounced phone validation hook
 */
export function createPhoneDebouncer(delay: number = 300) {
  let timeoutId: NodeJS.Timeout;
  
  return (value: string, callback: (result: PhoneValidationResult) => void) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      const result = validateTZPhone(value);
      callback(result);
    }, delay);
  };
}
