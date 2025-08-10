import { Shield } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RecaptchaBadgeProps {
  className?: string;
  variant?: 'default' | 'compact';
}

export default function RecaptchaBadge({ className, variant = 'default' }: RecaptchaBadgeProps) {
  if (variant === 'compact') {
    return (
      <div className={cn('flex items-center space-x-1 text-xs text-slate-500', className)}>
        <Shield className="w-3 h-3" />
        <span>Protected by reCAPTCHA</span>
      </div>
    );
  }

  return (
    <div className={cn('flex items-center space-x-2 text-sm text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-200', className)}>
      <Shield className="w-4 h-4 text-primary-500" />
      <div>
        <span className="font-medium">Protected by reCAPTCHA Enterprise</span>
        <div className="text-xs text-slate-500 mt-1">
          This site is protected by reCAPTCHA Enterprise and the Google{' '}
          <a
            href="https://policies.google.com/privacy"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary-600 hover:underline"
          >
            Privacy Policy
          </a>{' '}
          and{' '}
          <a
            href="https://policies.google.com/terms"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary-600 hover:underline"
          >
            Terms of Service
          </a>{' '}
          apply.
        </div>
      </div>
    </div>
  );
}
