# Theme Images Documentation

## Overview

Theme-specific images have been processed and integrated into the Homer Enrichment Hub application to enhance the visual experience for each theme.

## Processed Images

### 1. Fireweed Theme
- **Original**: `/assets/raw/images/fireweed.svg` (37KB)
- **Processed**:
  - `/public/images/themes/fireweed.svg` (30KB) - Optimized SVG
  - `/public/images/themes/fireweed.png` (35KB) - PNG fallback (400x344)
  - `/public/images/themes/fireweed.webp` (7KB) - WebP for performance

### 2. Compass Peak Theme  
- **Original**: `/assets/raw/images/homerspit.svg` (202KB)
- **Processed**:
  - `/public/images/themes/compass-peak.svg` (145KB) - Optimized SVG
  - `/public/images/themes/compass-peak.png` (63KB) - PNG fallback (400x391)
  - `/public/images/themes/compass-peak.webp` (6KB) - WebP for performance

## Implementation

### Components Created

1. **ThemeImage Component** (`/src/components/theme-image.tsx`)
   - Displays theme-specific images with automatic format selection
   - Uses Next.js Image component for optimization
   - Supports WebP with PNG fallback

2. **ThemeBackgroundImage Component**
   - Provides subtle background decoration
   - Uses SVG for scalability
   - 5% opacity for non-intrusive design

### Theme Showcase Page

Created `/app/theme-showcase` to demonstrate theme switching and visual elements.

## Usage

```tsx
import { ThemeImage, ThemeBackgroundImage } from '@/components/theme-image';

// Display theme image
<ThemeImage width={300} height={300} />

// Add subtle background
<ThemeBackgroundImage />
```

## Performance

All images meet the performance targets:
- Fireweed WebP: 7KB (< 20KB target)
- Compass Peak WebP: 6.1KB (< 20KB target)
- SVG files optimized with 19-27% size reduction

## Next Steps

1. Consider adding theme images to:
   - Login page background
   - Dashboard headers
   - Email templates (PNG versions only)

2. Create seasonal variations for special events

3. Add animation/transition effects when switching themes