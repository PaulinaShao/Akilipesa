# AkiliPesa Tanzanite Brand System

A premium brand identity inspired by Tanzania's precious gemstone.

## Color Tokens

### Primary Colors
```css
--tz-night: #0B0B1A      /* Primary background */
--tz-ink: #EDECF7        /* Primary text */
--tz-muted: #B2ACCF      /* Secondary text */
```

### Tanzanite Gem Colors
```css
--tz-gem-500: #6E3CE6    /* Brand primary */
--tz-gem-600: #5A2FD8    /* Darker variant */
--tz-gem-700: #4726C5    /* Darkest variant */
```

### Accent Colors
```css
--tz-ice-400: #6BB6FF    /* Cool highlight */
--tz-royal-500: #2C3CFF  /* Accent for links/badges */
```

### Glass Morphism
```css
--glass-bg: rgba(19, 17, 37, 0.5)    /* Glass panels */
--glass-stroke: rgba(255,255,255,0.08) /* Glass borders */
```

### Gradients
```css
--tz-gradient: linear-gradient(135deg, #6E3CE6 0%, #2C3CFF 45%, #6BB6FF 100%)
--tz-glow: radial-gradient(closest-side, rgba(108,63,240,.55), rgba(2,3,18,0))
```

### Shadows & Effects
```css
--radius-xl: 22px
--shadow-soft: 0 8px 32px rgba(18, 8, 66, .35)
--shadow-glow: 0 0 24px rgba(108,63,240,.35)
```

## Typography

### Fonts
- **Headings**: Inter (700-800 weight)
- **Body**: Inter (400-500 weight)  
- **Numerals**: Tabular numbers preferred for financial data

### Usage
```jsx
<h1 className="text-3xl font-bold text-[var(--tz-ink)]">
<p className="text-[var(--tz-muted)]">
```

## Logo Usage

### Hero Variant (Login/Splash)
```jsx
<AkiliLogo variant="hero" />
```
- Uses the real Tanzanite gemstone photo
- Includes gradient wordmark
- Features sparkle animations
- Recommended size: 96-112px height

### Compact Variant (Navigation)
```jsx
<AkiliLogo variant="compact" />
```
- Uses SVG gemstone icon
- Smaller footprint for navigation
- Still includes subtle sparkles

### Accessibility
- All logos include `alt="AkiliPesa Tanzanite logo"`
- Sparkle animations respect `prefers-reduced-motion`
- High contrast mode support included

## Component Classes

### Glass Cards
```css
.tz-glass-card {
  background: var(--glass-bg);
  backdrop-filter: blur(12px);
  border: 1px solid var(--glass-stroke);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-soft);
}
```

### Buttons
```css
.tz-btn-primary {
  background: var(--tz-gradient);
  border-radius: 12px;
  font-weight: 600;
}
```

### Inputs
```css
.tz-input {
  border-radius: 12px;
  background: var(--glass-bg);
  border: 1px solid var(--glass-stroke);
  color: var(--tz-ink);
}
```

## Animation Guidelines

### Shimmer Effect
- Use on hero logo only
- 2.5s duration, linear timing
- Subtle 18% opacity highlight

### Sparkles
- 3-5 particles maximum
- Varied sizes (4px, 6px, 8px)
- Respect reduced motion preferences
- Soft glow with 45% opacity

### Performance
- All animations include `will-change` optimization
- Backface visibility hidden for 3D transforms
- Graceful degradation for low-end devices

## Usage Guidelines

### ✅ DO
- Use the hero logo on splash screens and login pages
- Apply glass morphism to cards and modals
- Maintain consistent border radius (12px standard, 22px for cards)
- Use tabular numbers for financial displays
- Preserve sparkle animations where appropriate

### ❌ DON'T
- Modify the gemstone colors or gradients
- Use the photo gemstone in small sizes (<64px)
- Mix other brand colors with Tanzanite palette
- Disable animations without respecting user preferences
- Use hard shadows or sharp edges

## Accessibility

### Contrast Requirements
- Text contrast ≥ 4.5:1 against backgrounds
- Interactive elements ≥ 3:1 contrast
- Focus indicators use `--tz-ice-400` at 2px width

### Motion
- All animations respect `prefers-reduced-motion: reduce`
- Essential animations have static fallbacks
- Maximum animation duration: 3.6s

### High Contrast Mode
- Glass effects fallback to solid backgrounds
- Border widths increase to 2px minimum
- Colors maintain semantic meaning

## File Organization

### Assets
- `tanzanite-gems@2x.png` - Hero variant photo
- `tanzanite-gems@1x.png` - Optimized version
- `favicon.svg` - Monochrome mark for favicons

### Stylesheets
- `styles/tanzanite.css` - Complete design system
- `styles/sparkle.css` - Animation definitions
- Component-specific styles included inline

## Browser Support

- Modern browsers with CSS Grid and custom properties
- Backdrop-filter support required for glass effects
- SVG support for vector logos
- WebP support preferred for photo assets

## Performance Notes

- Lazy load hero gemstone image
- Compress PNG assets with tools like TinyPNG
- Use AVIF/WebP for better compression
- Consider CSS containment for animated elements

---

*This brand system ensures AkiliPesa maintains its premium Tanzanite identity while providing excellent user experience across all platforms.*
