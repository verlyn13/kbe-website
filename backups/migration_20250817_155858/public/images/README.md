# Public Images Directory

This directory contains optimized images ready for production use.

## Directory Structure

```
/public/images/
├── logo/          # Logo variations
├── avatars/       # User avatar images and defaults
├── heroes/        # Hero banner images
├── programs/      # Program-specific images
└── email/         # Images for email templates
```

## Usage in Code

```tsx
// Next.js Image component (recommended)
import Image from 'next/image';

<Image 
  src="/images/logo/heh-logo.svg" 
  alt="Homer Enrichment Hub"
  width={200}
  height={60}
/>

// Direct img tag (only when necessary)
<img 
  src="/images/avatars/default-avatar.png" 
  alt="User avatar"
/>
```

## Important Notes

- All images here should be optimized for web
- Use WebP format with fallbacks when possible
- Follow naming conventions from `/docs/image-processing.md`
- Keep file sizes minimal for performance

## Current Assets Needed

- [ ] HEH logo (SVG + PNG versions)
- [ ] Default user avatar
- [ ] Homepage hero banner
- [ ] MathCounts program icon
- [ ] Email header/footer graphics