# Apple Siri-Style Animations Guide

This guide explains how to use the new animation system inspired by Apple's Siri website design.

## Scroll-Triggered Animations

Add these classes to elements you want to animate as they come into view:

### Basic Animations

```html
<!-- Fade up (default scroll animation) -->
<div class="fade-up">Content appears with fade-up animation</div>

<!-- Fade in only -->
<div class="fade-in">Simple fade in</div>

<!-- Scale up from small -->
<div class="scale-up">Scales up from 92% to 100%</div>

<!-- Slide from left -->
<div class="slide-left">Slides in from left</div>

<!-- Slide from right -->
<div class="slide-right">Slides in from right</div>
```

## Staggered Animations

Automatically stagger child elements for cascading effect:

```html
<div class="stagger-list">
  <div class="stagger-item">First item</div>
  <div class="stagger-item">Second item (100ms delay)</div>
  <div class="stagger-item">Third item (200ms delay)</div>
</div>
```

## Interactive Hover Effects

```html
<!-- Lift effect on hover -->
<div class="hover-lift">Lifts up on hover</div>

<!-- Enhanced card -->
<div class="card hover-lift">Premium card with lift effect</div>

<!-- Showcase card -->
<div class="showcase-card">Lifts on hover with shadow</div>
```

## Text Animations

Headings automatically get character reveal animation:

```html
<h1>This text reveals word by word</h1>
<h2>Each word animates in sequence</h2>

<!-- Disable animation if needed -->
<h1 class="no-animate">This heading won't animate</h1>
```

## Counter/Number Animations

```html
<!-- Animate counter to target number -->
<span class="counter" data-count="1000">0</span>

<!-- Or use -->
<span data-count="500">0</span>
```

## Image Reveal

```html
<img class="image-reveal" src="image.jpg" alt="Description" />
```

## Direct Animation Classes

Apply these directly without waiting for scroll:

```html
<!-- Fade in from left -->
<div class="animate-fade-in-left">Fades in from left</div>

<!-- Fade in from right -->
<div class="animate-fade-in-right">Fades in from right</div>

<!-- Fade in from up -->
<div class="animate-fade-in-up">Fades in from top</div>

<!-- Fade in from down -->
<div class="animate-fade-in-down">Fades in from bottom</div>

<!-- Zoom in -->
<div class="zoom-in">Zooms in from small</div>

<!-- Zoom out -->
<div class="zoom-out">Zooms out to small</div>

<!-- Rotate in -->
<div class="rotate-in">Rotates in with scale</div>

<!-- Flip in -->
<div class="flip-in-x">Flips in on X axis</div>

<!-- Pulse -->
<div class="pulse">Pulses continuously</div>

<!-- Bounce -->
<div class="bounce">Bounces up and down</div>

<!-- Gradient animation -->
<div
  class="gradient-animate"
  style="background: linear-gradient(90deg, #ff006e, #00d9ff, #ff006e);"
>
  Animated gradient
</div>

<!-- Shadow pulse -->
<div class="shadow-pulse">Pulsing shadow effect</div>
```

## Component-Specific Animations

### Cards

```html
<!-- Enhanced card with hover lift -->
<div class="card hover-lift" data-gloss>
  Card with gloss effect on mouse move
</div>

<!-- Card container with staggered reveals -->
<div class="grid" data-card-container>
  <div class="card">First card</div>
  <div class="card">Second card (100ms delay)</div>
  <div class="card">Third card (200ms delay)</div>
</div>
```

### Buttons

```html
<!-- Button with ripple effect -->
<button class="link-btn">Button with smooth ripple on hover</button>

<!-- Navigation button -->
<button class="rail-btn">Nav button with animation</button>
```

### Metrics

```html
<!-- Metric that lifts on hover -->
<div class="metric">
  <strong>1,234</strong>
  <span>Total Views</span>
</div>
```

### Timeline

```html
<!-- Timeline item with slide animation -->
<div class="timeline-item">
  <strong>Event Name</strong>
  <span>2024</span>
</div>
```

### Feature Items

```html
<!-- Feature item with hover lift -->
<div class="feature-item">
  <strong>Feature Name</strong>
  <p>Description of the feature</p>
</div>
```

## Parallax Effects

Add parallax scrolling to elements:

```html
<!-- Element that parallaxes on scroll -->
<div data-parallax>This element moves at different speed during scroll</div>
```

## Advanced Techniques

### Custom Animation Delays

```html
<!-- Stagger items with custom timing -->
<style>
  .custom-delay-1 {
    animation-delay: 0s;
  }
  .custom-delay-2 {
    animation-delay: 0.15s;
  }
  .custom-delay-3 {
    animation-delay: 0.3s;
  }
</style>

<div class="animate-fade-in-up custom-delay-1">Item 1</div>
<div class="animate-fade-in-up custom-delay-2">Item 2</div>
<div class="animate-fade-in-up custom-delay-3">Item 3</div>
```

### Conditional Animations

Animations respect `prefers-reduced-motion` for accessibility. Users who prefer reduced motion will see instant transitions instead.

## Performance Tips

1. **Use GPU-accelerated properties**: The animations use `transform` and `opacity` for best performance
2. **Lazy load**: Animations only trigger when elements come into view
3. **Stagger animations**: Use staggered animations instead of animating too many elements at once
4. **Test on devices**: Some animations may need adjustment on mobile devices

## Browser Support

All animations use modern CSS and JavaScript:

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Customization

Edit these CSS variables in `multi-pages.css` to adjust animation timing:

```css
:root {
  --ease: 0.4s cubic-bezier(0.22, 1, 0.36, 1); /* Change this easing */
}
```

Animation durations are hardcoded in CSS (0.6s, 0.7s, 0.8s, 0.9s) but can be modified as needed.

## Disabling Animations

To disable animations for a specific section:

```html
<div class="no-animate">Content inside won't animate</div>
```

Or in CSS:

```css
.no-animate,
.no-animate * {
  animation: none !important;
  transition: none !important;
}
```
