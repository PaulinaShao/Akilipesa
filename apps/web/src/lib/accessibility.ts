import React from 'react';

export function announceToScreenReader(message: string): void {
  const announcement = document.createElement('div');
  announcement.setAttribute('aria-live', 'polite');
  announcement.setAttribute('aria-atomic', 'true');
  announcement.style.position = 'absolute';
  announcement.style.left = '-10000px';
  announcement.style.width = '1px';
  announcement.style.height = '1px';
  announcement.style.overflow = 'hidden';
  
  document.body.appendChild(announcement);
  announcement.textContent = message;
  
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
}

export function focusElement(selector: string, timeout = 100): void {
  setTimeout(() => {
    const element = document.querySelector(selector) as HTMLElement;
    if (element) {
      element.focus();
    }
  }, timeout);
}

export function trapFocus(element: HTMLElement): () => void {
  const focusableElements = element.querySelectorAll(
    'a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select'
  ) as NodeListOf<HTMLElement>;
  
  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  const handleTabKey = (e: KeyboardEvent) => {
    if (e.key === 'Tab') {
      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement.focus();
          e.preventDefault();
        }
      }
    }
  };

  element.addEventListener('keydown', handleTabKey);
  
  // Focus first element
  firstElement?.focus();

  return () => {
    element.removeEventListener('keydown', handleTabKey);
  };
}

export function useKeyboardShortcut(
  key: string,
  callback: () => void,
  deps: React.DependencyList = []
): void {
  React.useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === key) {
        event.preventDefault();
        callback();
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, deps);
}

export function getAriaLabel(element: string, action?: string): string {
  if (action) {
    return `${action} ${element}`;
  }
  return element;
}

export function formatCurrencyForScreenReader(amount: number, currency = 'TSH'): string {
  return `${amount} ${currency === 'TSH' ? 'Tanzanian Shillings' : currency}`;
}
