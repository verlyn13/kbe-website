# Image Processing Guidelines

This document outlines how to process images for the Homer Enrichment Hub website.

## Directory Structure

- **Raw assets**: `/assets/raw/` - Original, unprocessed files
- **Processed assets**: `/public/` - Optimized files for production

## Image Requirements

### Logo
- **Sizes needed**: 
  - Full logo: 200x60px (desktop navbar)
  - Square icon: 512x512px (PWA/favicon)
  - Email header: 600x150px
- **Format**: SVG preferred, PNG fallback
- **Location**: `/public/images/logo/`

### Hero Images
- **Homepage banner**: 1920x1080px
- **Program headers**: 1920x600px
- **Format**: WebP with JPG fallback
- **Quality**: 80-85%

### User Avatars
- **Sizes**: 40x40px, 80x80px, 160x160px
- **Format**: WebP/JPG
- **Default avatars**: `/public/images/avatars/`

### Program Icons
- **Size**: 64x64px
- **Format**: SVG preferred
- **Style**: Consistent with theme colors

## Processing Tools

### Command Line (Recommended)

```bash
# Install ImageMagick
brew install imagemagick

# Install WebP tools
brew install webp

# Install SVG optimizer
npm install -g svgo
```

### Processing Commands

```bash
# Resize and optimize JPG
convert assets/raw/images/hero.jpg -resize 1920x1080^ -gravity center -extent 1920x1080 -quality 85 public/images/hero.jpg

# Create WebP version
cwebp -q 80 assets/raw/images/hero.jpg -o public/images/hero.webp

# Optimize SVG
svgo assets/raw/icons/logo.svg -o public/icons/logo.svg

# Create multiple sizes
for size in 40 80 160; do
  convert assets/raw/images/avatar.png -resize ${size}x${size} public/images/avatars/default-${size}.png
done

# Create favicon
convert assets/raw/images/logo.png -resize 32x32 public/favicon.ico
```

## Next.js Image Component

Always use Next.js Image component for automatic optimization:

```tsx
import Image from 'next/image';

<Image
  src="/images/hero.webp"
  alt="Homer Enrichment Hub"
  width={1920}
  height={1080}
  priority
  placeholder="blur"
  blurDataURL="..." // Generate with plaiceholder
/>
```

## Color Guidelines

### Brand Colors (from theme)
- Primary: `#008080` (Deep teal - bay waters)
- Secondary: `#B8860B` (Muted gold - Kachemak Gold)
- Background: `#E0EEEE` (Light grayish-teal)

### Image Processing
- Maintain consistent color temperature
- Ensure sufficient contrast for text overlays
- Test in both light and dark themes

## File Naming Convention

```
hero-banner.webp          # Main version
hero-banner.jpg           # Fallback
hero-banner@2x.webp       # Retina version
hero-banner-mobile.webp   # Mobile version
```

## Performance Targets

- **Hero images**: < 200KB
- **Content images**: < 100KB
- **Icons**: < 20KB
- **Total page weight**: < 1MB

## Accessibility

- Always include descriptive alt text
- Ensure 4.5:1 contrast ratio for text overlays
- Provide fallback images for WebP

## Email Images

Special requirements for email templates:
- **Max width**: 600px
- **Format**: JPG/PNG only (no WebP)
- **Hosting**: Use absolute URLs
- **File size**: < 100KB per image

## Checklist

Before adding images:
- [ ] Optimized for web (compressed, right format)
- [ ] Multiple sizes created if needed
- [ ] WebP version created
- [ ] Alt text written
- [ ] Tested on slow connection
- [ ] Looks good in both themes