import React, { Component, ReactNode } from 'react';
import { TanzaniteMarkMono } from './AkiliLogo';

interface LottieErrorBoundaryState {
  hasError: boolean;
}

interface LottieErrorBoundaryProps {
  children: ReactNode;
  fallbackComponent?: ReactNode;
  className?: string;
}

export class LottieErrorBoundary extends Component<LottieErrorBoundaryProps, LottieErrorBoundaryState> {
  constructor(props: LottieErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): LottieErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.warn('Lottie animation failed to load:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Fallback to SVG logo
      return this.props.fallbackComponent || (
        <TanzaniteMarkMono className={this.props.className} />
      );
    }

    return this.props.children;
  }
}
