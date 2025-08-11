// Legacy component - use AkiliLogo instead
import AkiliLogo from './AkiliLogo';

interface TanzaniteLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export default function TanzaniteLogo({ className, size = 'md', showText = true }: TanzaniteLogoProps) {
  // Map old sizes to new variant
  return (
    <AkiliLogo
      variant="compact"
      className={className}
      showSparkles={false}
    />
  );
}
