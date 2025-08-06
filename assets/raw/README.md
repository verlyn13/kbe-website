# Raw Assets Directory

This directory contains raw, unprocessed assets that are used to create the optimized versions in `/public/`.

## Directory Structure

```
/assets/raw/
├── images/          # Original images (PSD, AI, high-res PNG/JPG)
├── icons/           # Icon source files (SVG, AI, Sketch)
├── documents/       # Source documents (InDesign, Word templates)
├── videos/          # Raw video files
└── audio/           # Raw audio files
```

## Processing Guidelines

### Images
- **Source formats**: PSD, AI, PNG, JPG, TIFF
- **Target formats**: WebP, optimized PNG/JPG
- **Target location**: `/public/images/`
- **Optimization**: 
  - Resize to required dimensions
  - Compress without visible quality loss
  - Convert to WebP for better performance

### Icons
- **Source formats**: SVG, AI, Sketch
- **Target formats**: SVG (optimized), PNG (for fallback)
- **Target location**: `/public/icons/`
- **Optimization**:
  - Clean up SVG code
  - Create multiple sizes if needed
  - Generate favicon formats

### Example Processing Commands

```bash
# Convert and optimize images using ImageMagick
convert assets/raw/images/hero-banner.png -resize 1920x1080 -quality 85 public/images/hero-banner.jpg

# Convert to WebP
cwebp -q 80 assets/raw/images/hero-banner.png -o public/images/hero-banner.webp

# Optimize SVG
svgo assets/raw/icons/logo.svg -o public/icons/logo.svg
```

## Storage Notes

Large raw files (PSD, video) should be stored in cloud storage (Google Drive, Dropbox) rather than Git.
Only commit small, essential raw assets that team members might need to edit.

## Current Assets Needed

- [ ] Homer Enrichment Hub logo (various sizes)
- [ ] Hero banner for landing page
- [ ] Program icons (MathCounts, Science, Writing)
- [ ] Student/teacher placeholder avatars
- [ ] Email header/footer graphics
- [ ] Social media templates