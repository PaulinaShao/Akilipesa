// Legacy component - use AkiliLogo instead
import AkiliLogo from './AkiliLogo';

interface TanzaniteLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export default function TanzaniteLogo({ className }: TanzaniteLogoProps) {
  // Legacy component - use AkiliLogo instead
  return (
    <AkiliLogo
      variant="compact"
      className={className}
      showSparkles={false}
    />
  );
}
