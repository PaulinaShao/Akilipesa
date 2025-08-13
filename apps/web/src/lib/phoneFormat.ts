/**
 * Phone number formatting utilities for Tanzania
 * Handles various input formats and normalizes to E164
 */

export function normalizeMsisdn(input: string): string {
  // Remove all whitespace and non-digits
  const cleaned = input.replace(/\D/g, '');
  
  // Handle common Tanzania formats
  if (cleaned.startsWith('0')) {
    // Local format: 0712345678 → 255712345678
    return `255${cleaned.slice(1)}`;
  } else if (cleaned.startsWith('255')) {
    // Already in international format
    return cleaned;
  } else if (cleaned.startsWith('7') || cleaned.startsWith('6') || cleaned.startsWith('8')) {
    // Mobile without prefix: 712345678 → 255712345678
    return `255${cleaned}`;
  }
  
  // Fallback: assume it needs 255 prefix
  return `255${cleaned}`;
}

export function formatAsDisplay(e164: string): string {
  // Format 255712345678 → +255 712 345 678
  if (e164.startsWith('255') && e164.length === 12) {
    const mobile = e164.slice(3);
    return `+255 ${mobile.slice(0, 3)} ${mobile.slice(3, 6)} ${mobile.slice(6)}`;
  }
  return e164;
}

export function isValidTanzaniaNumber(input: string): boolean {
  const normalized = normalizeMsisdn(input);
  
  // Tanzania mobile numbers: 255 + 7/6/8 + 8 digits
  const mobilePattern = /^255[678]\d{8}$/;
  return mobilePattern.test(normalized);
}

export function formatAsUserTypes(input: string): string {
  // Format progressively as user types
  const cleaned = input.replace(/\D/g, '');
  
  if (cleaned.length === 0) return '';
  
  // Handle local format (starting with 0)
  if (cleaned.startsWith('0')) {
    const mobile = cleaned.slice(1);
    if (mobile.length <= 3) return `0${mobile}`;
    if (mobile.length <= 6) return `0${mobile.slice(0, 3)} ${mobile.slice(3)}`;
    return `0${mobile.slice(0, 3)} ${mobile.slice(3, 6)} ${mobile.slice(6, 9)}`;
  }
  
  // Handle 7/6/8 prefix (mobile without country code)
  if (cleaned.match(/^[678]/)) {
    if (cleaned.length <= 3) return cleaned;
    if (cleaned.length <= 6) return `${cleaned.slice(0, 3)} ${cleaned.slice(3)}`;
    return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6, 9)}`;
  }
  
  // Handle international format
  if (cleaned.startsWith('255')) {
    const mobile = cleaned.slice(3);
    if (mobile.length <= 3) return `+255 ${mobile}`;
    if (mobile.length <= 6) return `+255 ${mobile.slice(0, 3)} ${mobile.slice(3)}`;
    return `+255 ${mobile.slice(0, 3)} ${mobile.slice(3, 6)} ${mobile.slice(6, 9)}`;
  }
  
  return input;
}

// Unit tests (can be moved to separate test file)
export const phoneFormatTests = {
  normalizeMsisdn: [
    { input: '0712345678', expected: '255712345678' },
    { input: '+255713123456', expected: '255713123456' },
    { input: '255 714 555 999', expected: '255714555999' },
    { input: '715888777', expected: '255715888777' },
  ],
  
  isValidTanzaniaNumber: [
    { input: '0712345678', expected: true },
    { input: '+255713123456', expected: true },
    { input: '255714555999', expected: true },
    { input: '1234567890', expected: false },
    { input: '+1234567890', expected: false },
  ]
};
