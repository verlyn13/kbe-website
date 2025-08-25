'use client';

import Image from 'next/image';
import * as React from 'react';
import { useTheme } from '@/providers/theme-provider';

interface ThemeImageProps {
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
}

export function ThemeImage({
  className = '',
  width = 200,
  height = 200,
  priority = false,
}: ThemeImageProps) {
  const { theme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const images = {
    default: null,
    'compass-peak': {
      src: '/images/themes/compass-peak',
      alt: 'Compass Peak - Mountain and glacier landscape',
    },
    'fireweed-path': {
      src: '/images/themes/fireweed',
      alt: 'Fireweed Path - Alaska wildflowers',
    },
  };

  const imageConfig = images[theme];

  if (!imageConfig) {
    return null;
  }

  return (
    <picture>
      <source srcSet={`${imageConfig.src}.webp`} type="image/webp" />
      <source srcSet={`${imageConfig.src}.png`} type="image/png" />
      <Image
        src={`${imageConfig.src}.png`}
        alt={imageConfig.alt}
        width={width}
        height={height}
        className={className}
        priority={priority}
      />
    </picture>
  );
}

export function ThemeBackgroundImage({ className = '' }: { className?: string }) {
  const { theme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || theme === 'default') {
    return null;
  }

  const images = {
    'compass-peak': '/images/themes/compass-peak.svg',
    'fireweed-path': '/images/themes/fireweed.svg',
  };

  const imageSrc = images[theme];

  if (!imageSrc) {
    return null;
  }

  return (
    <div
      className={`pointer-events-none fixed inset-0 ${className}`}
      style={{
        backgroundImage: `url(${imageSrc})`,
        backgroundPosition: 'bottom right',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'clamp(300px, 25vw, 400px)',
        opacity: 0.03,
        zIndex: 0,
        transform: 'translate(10%, 10%)',
      }}
      aria-hidden="true"
    />
  );
}
