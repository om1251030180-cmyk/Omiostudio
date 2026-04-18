# Apple Siri Animation - Implementation Examples

Here are practical examples to implement in your HTML files for Apple Siri-style animations.

## Hero Section Example

```html
<section class="portfolio-hero">
  <h1 class="animate-fade-in-down">We Don't Just Build</h1>
  <h2 class="animate-fade-in-down">We Create Experiences</h2>
  <p class="fade-in">Smooth, elegant animations that captivate your audience</p>
</section>
```

## Staggered Feature List

```html
<div class="feature-grid stagger-list">
  <div class="feature-item stagger-item">
    <strong>✨ Smooth Animations</strong>
    <p>Apple-inspired transitions and effects</p>
  </div>

  <div class="feature-item stagger-item">
    <strong>⚡ Performance</strong>
    <p>GPU-accelerated for smooth 60fps</p>
  </div>

  <div class="feature-item stagger-item">
    <strong>♿ Accessible</strong>
    <p>Respects prefers-reduced-motion</p>
  </div>
</div>
```

## Cards with Hover Effects

```html
<div class="grid" data-card-container>
  <div class="card hover-lift" data-gloss>
    <h3 class="scale-up">Card Title</h3>
    <p class="fade-in">Description that fades in on scroll</p>
    <button class="link-btn">Learn More</button>
  </div>

  <div class="card hover-lift" data-gloss>
    <h3 class="scale-up">Card Title</h3>
    <p class="fade-in">Description that fades in on scroll</p>
    <button class="link-btn">Learn More</button>
  </div>

  <div class="card hover-lift" data-gloss>
    <h3 class="scale-up">Card Title</h3>
    <p class="fade-in">Description that fades in on scroll</p>
    <button class="link-btn">Learn More</button>
  </div>
</div>
```

## Metrics Section with Counter Animation

```html
<div class="metric-strip">
  <div class="metric hover-lift">
    <strong class="counter" data-count="1250">1250</strong>
    <span>Projects Completed</span>
  </div>

  <div class="metric hover-lift">
    <strong class="counter" data-count="98">98</strong>
    <span>% Client Satisfaction</span>
  </div>

  <div class="metric hover-lift">
    <strong class="counter" data-count="50">50</strong>
    <span>Team Members</span>
  </div>
</div>
```

## Timeline with Staggered Items

```html
<div class="timeline stagger-list">
  <div class="timeline-item stagger-item slide-left">
    <strong>Project Kickoff</strong>
    <span>January 2024</span>
  </div>

  <div class="timeline-item stagger-item slide-left">
    <strong>Alpha Release</strong>
    <span>March 2024</span>
  </div>

  <div class="timeline-item stagger-item slide-left">
    <strong>Public Launch</strong>
    <span>June 2024</span>
  </div>

  <div class="timeline-item stagger-item slide-left">
    <strong>Version 2.0</strong>
    <span>September 2024</span>
  </div>
</div>
```

## Portfolio Case Studies

```html
<div class="portfolio-grid grid">
  <div class="portfolio-case case-featured">
    <div class="case-hero">
      <div class="case-hero-overlay">
        <h2 class="animate-fade-in-up">Featured Project</h2>
        <p class="fade-in">Exceptional design and development</p>
      </div>
    </div>
  </div>

  <div class="portfolio-case">
    <div class="case-hero">
      <div class="case-hero-overlay">
        <h3 class="animate-fade-in-left">Project Name</h3>
        <p class="fade-in">Project description</p>
      </div>
    </div>
  </div>

  <div class="portfolio-case">
    <div class="case-hero">
      <div class="case-hero-overlay">
        <h3 class="animate-fade-in-right">Project Name</h3>
        <p class="fade-in">Project description</p>
      </div>
    </div>
  </div>
</div>
```

## Showcase Section

```html
<div class="showcase-row">
  <div class="showcase-card hover-lift">
    <h4 class="scale-up">Feature Highlight</h4>
    <p class="fade-in">Details about this amazing feature</p>
  </div>

  <div class="showcase-card hover-lift">
    <h4 class="scale-up">Another Feature</h4>
    <p class="fade-in">More information about capabilities</p>
  </div>
</div>
```

## Services Section with Images

```html
<section class="services-section">
  <h2 class="animate-fade-in-down">Our Services</h2>
  <p class="fade-in text-center">Everything you need for digital success</p>

  <div class="grid">
    <div class="card hover-lift">
      <img class="image-reveal" src="service1.jpg" alt="Service" />
      <h3 class="scale-up">Web Design</h3>
      <p class="fade-in">Beautiful, modern interfaces</p>
    </div>

    <div class="card hover-lift">
      <img class="image-reveal" src="service2.jpg" alt="Service" />
      <h3 class="scale-up">Development</h3>
      <p class="fade-in">Robust, scalable solutions</p>
    </div>

    <div class="card hover-lift">
      <img class="image-reveal" src="service3.jpg" alt="Service" />
      <h3 class="scale-up">Consulting</h3>
      <p class="fade-in">Strategic guidance for growth</p>
    </div>
  </div>
</section>
```

## Testimonials Section

```html
<section class="testimonials">
  <h2 class="animate-fade-in-up">What Our Clients Say</h2>

  <div class="grid stagger-list">
    <div class="card stagger-item hover-lift" data-gloss>
      <p class="fade-in">
        "Exceptional work and attention to detail. Highly recommended!"
      </p>
      <strong class="text-reveal">- Client Name</strong>
      <span class="badge-glow">★★★★★</span>
    </div>

    <div class="card stagger-item hover-lift" data-gloss>
      <p class="fade-in">"The team delivered beyond our expectations."</p>
      <strong class="text-reveal">- Client Name</strong>
      <span class="badge-glow">★★★★★</span>
    </div>

    <div class="card stagger-item hover-lift" data-gloss>
      <p class="fade-in">"Professional, creative, and results-driven."</p>
      <strong class="text-reveal">- Client Name</strong>
      <span class="badge-glow">★★★★★</span>
    </div>
  </div>
</section>
```

## Pricing Table

```html
<section class="pricing">
  <h2 class="animate-fade-in-down">Simple, Transparent Pricing</h2>

  <div class="pricing-grid grid stagger-list">
    <div class="pricing-card stagger-item hover-lift" data-gloss>
      <h3 class="scale-up">Starter</h3>
      <div class="price">
        <span class="amount">$99</span>
        <span class="period">/month</span>
      </div>
      <ul class="fade-in">
        <li>✓ Feature 1</li>
        <li>✓ Feature 2</li>
        <li>✓ Feature 3</li>
      </ul>
      <button class="link-btn">Get Started</button>
    </div>

    <div class="pricing-card stagger-item hover-lift" data-gloss>
      <h3 class="scale-up">Professional</h3>
      <div class="price">
        <span class="amount">$299</span>
        <span class="period">/month</span>
      </div>
      <ul class="fade-in">
        <li>✓ All Starter features</li>
        <li>✓ Feature 4</li>
        <li>✓ Feature 5</li>
      </ul>
      <button class="link-btn">Get Started</button>
    </div>

    <div class="pricing-card stagger-item hover-lift" data-gloss>
      <h3 class="scale-up">Enterprise</h3>
      <div class="price">
        <span class="amount">Custom</span>
        <span class="period">pricing</span>
      </div>
      <ul class="fade-in">
        <li>✓ All Professional features</li>
        <li>✓ Feature 6</li>
        <li>✓ Dedicated support</li>
      </ul>
      <button class="link-btn">Contact Us</button>
    </div>
  </div>
</section>
```

## CTA Section

```html
<section class="cta-section fade-in">
  <div class="cta-content">
    <h2 class="animate-fade-in-up">
      Ready to Transform Your Digital Presence?
    </h2>
    <p class="fade-in">Let's create something amazing together</p>
    <button class="link-btn animate-fade-in-up hover-lift">
      Get Started Today
    </button>
  </div>
</section>
```

## Tips for Best Results

1. **Hierarchy**: Use faster animations for important content, slower for secondary content
2. **Consistency**: Keep animation timing consistent throughout the page (0.6-0.9s range)
3. **Combinations**: Mix different animation types for visual interest
4. **Performance**: Don't animate too many elements simultaneously
5. **Testing**: Test on various devices to ensure smooth performance

## Animation Combination Examples

```html
<!-- Text reveals with stagger + images that scale -->
<div class="stagger-list">
  <h3 class="stagger-item animate-fade-in-left">Title</h3>
  <img class="stagger-item image-reveal" src="image.jpg" />
  <p class="stagger-item fade-in">Description</p>
</div>

<!-- Cards that slide in and lift on hover -->
<div class="card slide-left hover-lift" data-gloss>Content</div>

<!-- Metrics that scale and pulse -->
<div class="metric scale-up shadow-pulse">
  <strong>1,234</strong>
  <span>Count</span>
</div>
```

These examples should help you implement Apple Siri-style animations throughout your website!
