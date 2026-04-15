// Premium Full-Featured Website Demo Content
function getDomainSpecificDemoPremium(id, section) {
  const item = websiteShowcase.find((entry) => entry.id === id);
  if (!item) return '';

  // ===== REAL ESTATE: LUXORA ESTATES =====
  if (id === 'luxora-estate') {
    if (section === 'home') {
      return `
        <div class="miniature-hero">
          <strong>LUXORA: Premium Real Estate</strong>
          <span>Handpicked properties in prime locations. Investment-grade assets. Expert guidance.</span>
        </div>
        <div class="miniature-note" style="margin:8px 0 6px 0;"><strong>Latest Listings</strong></div>
        <div class="miniature-demo-item">
          <div class="demo-property-card">
            <div class="demo-property-image">🏡</div>
            <div class="demo-property-title">Sunset Mansion, Bandra</div>
            <div class="demo-property-meta"><span>4 BHK • 4,200 sqft</span><span>₹5.2Cr</span></div>
            <small style="color:#999; font-size:0.6rem;">Sea view • Pool • Smart home • 2025 ready</small>
          </div>
          <div class="demo-property-card">
            <div class="demo-property-image">🏢</div>
            <div class="demo-property-title">Premium Plaza, BKC</div>
            <div class="demo-property-meta"><span>Commercial • 45,000 sqft</span><span>₹2.8Cr</span></div>
            <small style="color:#999; font-size:0.6rem;">Grade A • 8% ROI • Lease-ready • 100% occupied</small>
          </div>
        </div>
        <button class="demo-booking-button">📅 Schedule Virtual 3D Tour</button>
      `;
    }
    if (section === 'services') {
      return `
        <div class="miniature-note" style="margin-bottom:8px;"><strong>✓ Real Estate Solutions</strong></div>
        <div class="miniature-list">
          <button class="active"><strong>🏠 Property Finder AI</strong><span>Smart matching • Location trends • Market analysis</span></button>
          <button><strong>📋 Legal & Compliance</strong><span>Title check • Document review • Registration</span></button>
          <button><strong>💳 Financing Solutions</strong><span>Home loans • Investment planning • Tax guidance</span></button>
          <button><strong>🔍 Valuation & Inspection</strong><span>Expert appraisal • 3D virtual tour • Price negotiation</span></button>
        </div>
      `;
    }
    return `
      <div class="miniature-note" style="margin-bottom:8px;"><strong>Find Your Investment Property</strong><br>Join 100K+ investors. Free consultation with certified property experts.</div>
      <form class="miniature-form" onsubmit="submitWebsiteDemoLead(event)">
        <input type="text" placeholder="Full name" required>
        <input type="email" placeholder="Email address" required>
        <input type="tel" placeholder="Contact number" required>
        <select required><option>Looking for</option><option>Residential</option><option>Commercial</option><option>Investment</option></select>
        <button type="submit">Get Free Consultation</button>
      </form>
    `;
  }

  // ===== FITNESS: FITMODO GYM =====
  if (id === 'fitmodo-gym') {
    if (section === 'home') {
      return `
        <div class="miniature-hero">
          <strong>FITMODO: Transform Your Fitness</strong>
          <span>State-of-the-art gym • 200+ classes monthly • Certified trainers • Community-first</span>
        </div>
        <div class="miniature-note" style="margin:8px 0 6px 0;"><strong>Today's Class Schedule</strong></div>
        <div class="miniature-demo-item">
          <div class="demo-class-slot">
            <div class="demo-class-title">💪 Advanced Strength</div>
            <div class="demo-class-time">06:00 AM • 60 min • Trainer: Alex</div>
          </div>
          <div class="demo-class-slot">
            <div class="demo-class-title">🧘 Morning Yoga Flow</div>
            <div class="demo-class-time">07:15 AM • 45 min • Trainer: Maya</div>
          </div>
          <div class="demo-class-slot">
            <div class="demo-class-title">🏃 HIIT Cardio Blast</div>
            <div class="demo-class-time">06:00 PM • 50 min • Trainer: Marcus</div>
          </div>
        </div>
        <small style="color:#999; font-size:0.6rem;\">⭐ 4.8/5 • 12,500+ Members • Open 24/7</small>
        <button class="demo-booking-button" style="margin-top:8px;\">📅 Book Class Now</button>
      `;
    }
    if (section === 'services') {
      return `
        <div class="miniature-note" style="margin-bottom:8px;\"><strong>✓ Membership & Training</strong></div>
        <div class="miniature-list">
          <button class="active"><strong>💪 Bronze Starter</strong><span>₹2,999/mo • Gym access • 4 classes/week</span></button>
          <button><strong>🌟 Silver Pro</strong><span>₹4,499/mo • Unlimited classes • 1 trainer session</span></button>
          <button><strong>👑 Gold Elite</strong><span>₹6,999/mo • Personal trainer • Nutrition coaching</span></button>
          <button><strong>🏆 Platinum VIP</strong><span>₹9,999/mo • Full service • Premium lounge access</span></button>
        </div>
      `;
    }
    return `
      <div class="miniature-note" style="margin-bottom:8px;\"><strong>Start Your Transformation</strong><br>14-day free trial. No credit card needed. Personalized onboarding included.</div>
      <form class="miniature-form" onsubmit="submitWebsiteDemoLead(event)">
        <input type="text" placeholder="Your name" required>
        <input type="email" placeholder="Email address" required>
        <select required><option>Fitness goal</option><option>Weight loss</option><option>Muscle gain</option><option>Cardio fitness</option><option>Flexibility</option></select>
        <button type="submit">Claim Free Trial</button>
      </form>
    `;
  }

  // ===== RESTAURANT: ZENBITE CAFE =====
  if (id === 'zenbite-cafe') {
    if (section === 'home') {
      return `
        <div class="miniature-hero">
          <strong>ZENBITE: Artisanal Café & Restaurant</strong>
          <span>Farm-to-table cuisine • Single-origin coffee • Curated ambiance • Perfect for work & dining</span>
        </div>
        <div class="miniature-note" style="margin:8px 0 6px 0;\"><strong>Chef's Special Today</strong></div>
        <div class="miniature-demo-item">
          <div class="demo-menu-item">
            <div class="demo-menu-name">☕ Signature Cold Brew Duo</div>
            <div class="demo-menu-price">₹249</div>
            <small style="color:#999; font-size:0.6rem;\">Ethiopian + Brazilian blend • Pastry included</small>
          </div>
          <div class="demo-menu-item">
            <div class="demo-menu-name">🥗 Organic Harvest Salad</div>
            <div class="demo-menu-price">₹329</div>
            <small style="color:#999; font-size:0.6rem;\">Seasonal vegetables • House vinaigrette • Protein choice</small>
          </div>
          <div class="demo-menu-item">
            <div class="demo-menu-name">🍰 Vegan Brownies & Latte</div>
            <div class="demo-menu-price">₹199</div>
            <small style="color:#999; font-size:0.6rem;\">Gluten-free • Fair-trade chocolate • Fresh milk</small>
          </div>
        </div>
        <small style="color:#999; font-size:0.6rem;\">⭐ 4.9/5 • 8K+ Reviews • Michelin Guide Listed</small>
        <button class="demo-booking-button" style="margin-top:8px;\">🚴 Order Delivery Now</button>
      `;
    }
    if (section === 'services') {
      return `
        <div class="miniature-list">
          <button class="active"><strong>📍 Dine In</strong><span>Reserve table • Full menu • Cozy ambiance • WiFi</span></button>
          <button><strong>🏃 Takeout</strong><span>Quick pickup • 10-15 min • Hot & fresh</span></button>
          <button><strong>🚴 Delivery</strong><span>Door delivery • 30-45 min • Free for 300+</span></button>
          <button><strong>🎉 Events & Catering</strong><span>Private bookings • Custom menu • Team lunch</span></button>
        </div>
        <button class="demo-booking-button" style="margin-top:8px;\">Reserve Your Table</button>
      `;
    }
    return `
      <div class="miniature-note" style="margin-bottom:8px;\"><strong>Book Your Table</strong><br>Reservation for 2+ guests. Prime timing guaranteed. Dietary preferences noted.</div>
      <form class="miniature-form" onsubmit="submitWebsiteDemoLead(event)">
        <input type="text" placeholder="Your name" required>
        <input type="email" placeholder="Email" required>
        <select required><option>Date preference</option><option>Today</option><option>Tomorrow</option><option>This weekend</option></select>
        <button type="submit">Confirm Reservation</button>
      </form>
    `;
  }

  // ===== HEALTHCARE: MEDIVANCE CLINIC =====
  if (id === 'medivance-care') {
    if (section === 'home') {
      return `
        <div class="miniature-hero">
          <strong>MEDIVANCE: Comprehensive Healthcare</strong>
          <span>Board-certified doctors • Advanced diagnostics • Emergency 24/7 • Telemedicine available</span>
        </div>
        <div class="miniature-note" style="margin:8px 0 6px 0;\"><strong>Book Your Appointment</strong></div>
        <div class="miniature-demo-item">
          <div class="demo-appointment-slot">Today • 10:30 AM</div>
          <div class="demo-appointment-slot">Today • 02:00 PM</div>
          <div class="demo-appointment-slot">Tomorrow • 09:00 AM</div>
        </div>
        <small style="color:#999; font-size:0.6rem;\">✓ 15+ Specialists • 500+ 5-star reviews • NABH certified</small>
        <button class="demo-booking-button" style="margin-top:8px;\">📅 Book Appointment</button>
      `;
    }
    if (section === 'services') {
      return `
        <div class="miniature-note" style="margin-bottom:8px;\"><strong>✓ Our Medical Services</strong></div>
        <div class="miniature-list">
          <button class="active"><strong>🩺 General Checkup</strong><span>₹500 • 30 min • Dr. Sharma available</span></button>
          <button><strong>🧬 Blood Tests & Diagnostics</strong><span>Home collection • Next-day results • Lab approved</span></button>
          <button><strong>💊 Chronic Care Management</strong><span>Diabetes • Hypertension • Heart • Monitoring plan</span></button>
          <button><strong>🚑 Emergency Care 24/7</strong><span>Ambulance • ICU • Trauma care • Always open</span></button>
        </div>
      `;
    }
    return `
      <div class="miniature-note" style="margin-bottom:8px;\"><strong>Schedule Your Health Checkup</strong><br>Comprehensive screening • Doctor consultation • Follow-up care included.</div>
      <form class="miniature-form" onsubmit="submitWebsiteDemoLead(event)">
        <input type="text" placeholder="Patient name" required>
        <input type="email" placeholder="Email" required>
        <select required><option>Service type</option><option>General Checkup</option><option>Specialist visit</option><option>Lab tests</option></select>
        <button type="submit">Book Appointment</button>
      </form>
    `;
  }

  // ===== SAAS: NEXORA PLATFORM =====
  if (id === 'nexora-saas') {
    if (section === 'home') {
      return `
        <div class="miniature-hero">
          <strong>NEXORA: Workflow Intelligence Platform</strong>
          <span>Automate operations • Real-time analytics • Team collaboration • Enterprise SLA</span>
        </div>
        <div class="miniature-demo-item">
          <div class="demo-feature-bullet">
            <span>✓</span>
            <div><strong>Unified Dashboard</strong> - Real-time metrics, team activity, project status in one view</div>
          </div>
          <div class="demo-feature-bullet">
            <span>✓</span>
            <div><strong>AI-Powered Workflows</strong> - Automation rules, smart alerts, predictive insights</div>
          </div>
          <div class="demo-feature-bullet">
            <span>✓</span>
            <div><strong>99.9% Uptime SLA</strong> - Enterprise-grade infrastructure, data security, compliance</div>
          </div>
        </div>
        <small style="color:#999; font-size:0.6rem;\">⭐ Rated #1 by G2 • 5000+ Teams • $100M+ Managed</small>
        <button class="demo-booking-button" style="margin-top:8px;\">🚀 Start 14-Day Free Trial</button>
      `;
    }
    if (section === 'services') {
      return `
        <div class="miniature-demo-item">
          <div class="demo-pricing-tier">
            <div class="demo-pricing-name">Starter</div>
            <div class="demo-pricing-value">$49/mo</div>
            <small style="color:#999; font-size:0.6rem;\">Up to 10 team members • Basic automation</small>
          </div>
          <div class="demo-pricing-tier">
            <div class="demo-pricing-name">Pro ⭐ Most Popular</div>
            <div class="demo-pricing-value">$149/mo</div>
            <small style="color:#999; font-size:0.6rem;\">Unlimited users • Advanced analytics • Priority support</small>
          </div>
          <div class="demo-pricing-tier">
            <div class="demo-pricing-name">Enterprise</div>
            <div class="demo-pricing-value">Custom Pricing</div>
            <small style="color:#999; font-size:0.6rem;\">Dedicated account • Custom integration • SLA</small>
          </div>
        </div>
      `;
    }
    return `
      <div class="miniature-note" style="margin-bottom:8px;\"><strong>Join 5000+ Teams</strong><br>Streamline operations, save 10+ hours/week, boost productivity 40%+ on average.</div>
      <form class="miniature-form" onsubmit="submitWebsiteDemoLead(event)">
        <input type="text" placeholder="Company name" required>
        <input type="email" placeholder="Work email" required>
        <select required><option>Company size</option><option>Startup (1-10)</option><option>Small (11-50)</option><option>Mid-market (51-500)</option><option>Enterprise (500+)</option></select>
        <button type="submit">Get Free Demo Access</button>
      </form>
    `;
  }

  // ===== FASHION: ATELIER BLOOM =====
  if (id === 'atelier-bloom') {
    if (section === 'home') {
      return `
        <div class="miniature-hero">
          <strong>ATELIER BLOOM: Luxury Fashion</strong>
          <span>Handcrafted collections • Emerging designers • Sustainability focus • Exclusivity guaranteed</span>
        </div>
        <div class="miniature-note" style="margin:8px 0 6px 0;\"><strong>Spring Collection 2026 - Now Live</strong></div>
        <div class="miniature-demo-item">
          <div class="demo-product-showcase">👗</div>
          <div class="demo-product-showcase">👜</div>
          <div class="demo-product-showcase">✨</div>
        </div>
        <small style="color:#999; font-size:0.6rem;\">⭐ 500+ Reviews • Eco-certified • Artist-owned • Est. 2018</small>
        <button class="demo-booking-button" style="margin-top:8px;\">🛍️ Shop Spring Collection</button>
      `;
    }
    if (section === 'services') {
      return `
        <div class="miniature-note" style="margin-bottom:8px;\"><strong>✓ Collections & Services</strong></div>
        <div class="miniature-list">
          <button class="active"><strong>👗 Spring 2026 Collection</strong><span>12 pieces • Limited quantities • Pre-order open</span></button>
          <button><strong>👜 Designer Accessories</strong><span>Artisan-made • Handpicked • Ethical sourcing</span></button>
          <button><strong>💎 VIP Capsule Series</strong><span>3-5 pieces per design • Members exclusive • Pre-launch access</span></button>
          <button><strong>🎨 Custom Design Commission</strong><span>Bespoke creation • 8-week turnaround • Premium pricing</span></button>
        </div>
      `;
    }
    return `
      <div class="miniature-note" style="margin-bottom:8px;\"><strong>Join the Bloom VIP Circle</strong><br>15% member discount, early collection access, exclusive events, personal styling.</div>
      <form class="miniature-form" onsubmit="submitWebsiteDemoLead(event)">
        <input type="text" placeholder="Your name" required>
        <input type="email" placeholder="Email address" required>
        <select required><option>Style preference</option><option>Contemporary</option><option>Classic</option><option>Avant Garde</option><option>Minimalist</option></select>
        <button type="submit">Request VIP Membership</button>
      </form>
    `;
  }

  return '';
}
