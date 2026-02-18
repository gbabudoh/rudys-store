import Image from 'next/image';

interface ProductImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  quality?: number;
  fill?: boolean;
  sizes?: string;
}

export default function ProductImage({
  src,
  alt,
  width = 800,
  height = 800,
  className = '',
  priority = false,
  quality = 80,
  fill = false,
  sizes,
}: ProductImageProps) {
  // Handle error fallback
  const handleError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.target as HTMLImageElement;
    target.src = '/placeholder-image.svg';
  };

  if (fill) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        className={className}
        priority={priority}
        sizes={sizes || '100vw'}
        quality={75}
        onError={handleError}
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      priority={priority}
      quality={75}
      loading={priority ? undefined : 'lazy'}
      onError={handleError}
    />
  );
}
