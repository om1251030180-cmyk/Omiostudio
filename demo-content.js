// Demo content file - no longer needed
// All demo functionality has been removed
function getDomainSpecificDemoPremium(id, section) {
  return '';
  const item = websiteShowcase.find((entry) => entry.id === id);
  if (!item) return '';

  // ===== REAL ESTATE: LUXORA ESTATES =====
  if (id === 'luxora-estate') {
    if (section === 'home') {
      return `
        <section class="demo-section" style="background: linear-gradient(135deg, rgba(26, 30, 63, 0.8), rgba(111, 99, 255, 0.15)); border-radius: 20px; padding: 40px; margin-bottom: 24px;">
          <h2 style="font-size: 2.4rem; margin-bottom: 8px; font-family: 'DM Serif Display'; letter-spacing: -0.02em;">LUXORA</h2>
          <p style="font-size: 1.1rem; color: rgba(255,255,255,0.85); margin-bottom: 24px;">Premium Real Estate Investment Platform</p>
          <p style="color: rgba(255,255,255,0.7); line-height: 1.7; margin-bottom: 24px;">Handpicked properties in prime locations. Investment-grade assets with expert guidance. Access exclusive luxury real estate opportunities across 15+ cities.</p>
          <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 24px;">
            <div style="background: rgba(255,255,255,0.08); padding: 16px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.1);">
              <div style="font-size: 1.8rem; font-weight: bold; color: #ffd56a;">₹850Cr+</div>
              <div style="font-size: 0.85rem; color: rgba(255,255,255,0.6); margin-top: 4px;">AUM Managed</div>
            </div>
            <div style="background: rgba(255,255,255,0.08); padding: 16px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.1);">
              <div style="font-size: 1.8rem; font-weight: bold; color: #66e0d2;">5,200+</div>
              <div style="font-size: 0.85rem; color: rgba(255,255,255,0.6); margin-top: 4px;">Active Investors</div>
            </div>
            <div style="background: rgba(255,255,255,0.08); padding: 16px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.1);">
              <div style="font-size: 1.8rem; font-weight: bold; color: #ff8a5b;">18.5%</div>
              <div style="font-size: 0.85rem; color: rgba(255,255,255,0.6); margin-top: 4px;">Avg. ROI</div>
            </div>
          </div>
        </section>
        <section style="margin-bottom: 24px;">
          <h3 style="font-size: 1.3rem; margin-bottom: 16px; color: #4ecdc4;">Featured Listings</h3>
          <div style="display: grid; gap: 12px;">
            <div style="background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 16px; display: flex; justify-content: space-between; align-items: center;">
              <div>
                <div style="font-weight: 600; color: #fff; margin-bottom: 4px;">🏡 Sunset Mansion, Bandra</div>
                <div style="font-size: 0.85rem; color: rgba(255,255,255,0.6);">4 BHK • 4,200 sqft • Sea view • Pool • 2025 ready</div>
              </div>
              <div style="text-align: right;">
                <div style="font-size: 1.4rem; font-weight: bold; color: #ffd700;">₹5.2 Cr</div>
                <div style="font-size: 0.75rem; color: #4ecdc4; margin-top: 2px;">Grade A</div>
              </div>
            </div>
            <div style="background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 16px; display: flex; justify-content: space-between; align-items: center;">
              <div>
                <div style="font-weight: 600; color: #fff; margin-bottom: 4px;">🏢 Premium Plaza, BKC</div>
                <div style="font-size: 0.85rem; color: rgba(255,255,255,0.6);">Commercial • 45,000 sqft • Grade A • 100% Occupied</div>
              </div>
              <div style="text-align: right;">
                <div style="font-size: 1.4rem; font-weight: bold; color: #ffd700;">₹2.8 Cr</div>
                <div style="font-size: 0.75rem; color: #4ecdc4; margin-top: 2px;">8% ROI</div>
              </div>
            </div>
          </div>
        </section>
      `;
    }
    if (section === 'services') {
      return `
        <section style="margin-bottom: 24px;">
          <h3 style="font-size: 1.3rem; margin-bottom: 16px; color: #4ecdc4;">Our Services</h3>
          <div style="display: grid; gap: 12px;">
            <div style="background: linear-gradient(135deg, rgba(111, 99, 255, 0.2), rgba(102, 224, 210, 0.1)); border: 1px solid rgba(111, 99, 255, 0.3); border-radius: 12px; padding: 16px;">
              <div style="font-weight: 600; color: #fff; margin-bottom: 4px;">🏠 Property Finder AI</div>
              <div style="font-size: 0.85rem; color: rgba(255,255,255,0.7);">Smart matching • Location trends • Market analysis • 24/7 Updates</div>
            </div>
            <div style="background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 16px;">
              <div style="font-weight: 600; color: #fff; margin-bottom: 4px;">📋 Legal & Compliance</div>
              <div style="font-size: 0.85rem; color: rgba(255,255,255,0.7);">Title check • Document review • Registration • Tax planning</div>
            </div>
            <div style="background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 16px;">
              <div style="font-weight: 600; color: #fff; margin-bottom: 4px;">💳 Financing Solutions</div>
              <div style="font-size: 0.85rem; color: rgba(255,255,255,0.7);">Home loans • Investment planning • Wealth management • Tax guidance</div>
            </div>
            <div style="background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 16px;">
              <div style="font-weight: 600; color: #fff; margin-bottom: 4px;">🔍 Valuation & Inspection</div>
              <div style="font-size: 0.85rem; color: rgba(255,255,255,0.7);">Expert appraisal • 3D virtual tour • Market comp analysis • Negotiation</div>
            </div>
          </div>
        </section>
      `;
    }
    return `
      <section style="background: rgba(76, 205, 196, 0.1); border-left: 4px solid #4ecdc4; padding: 20px; border-radius: 8px; margin-bottom: 24px;">
        <h3 style="color: #4ecdc4; margin-bottom: 8px; font-size: 1.1rem;">Get Premium Consultation</h3>
        <p style="color: rgba(255,255,255,0.8); margin-bottom: 16px; font-size: 0.95rem;">Join 5,200+ investors. Free consultation with certified real estate experts.</p>
        <form onsubmit="submitWebsiteDemoLead(event)" style="display: grid; gap: 12px;">
          <input type="text" placeholder="Full name" required style="background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); padding: 10px 12px; border-radius: 8px; color: #fff;">
          <input type="email" placeholder="Email address" required style="background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); padding: 10px 12px; border-radius: 8px; color: #fff;">
          <input type="tel" placeholder="Contact number" required style="background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); padding: 10px 12px; border-radius: 8px; color: #fff;">
          <button type="submit" style="background: linear-gradient(135deg, #4ecdc4, #66e0d2); border: none; padding: 12px; border-radius: 8px; color: #1a1a2e; font-weight: 600; cursor: pointer;">Get Free Consultation →</button>
        </form>
      </section>
    `;
  }

  // ===== FITNESS: FITMODO GYM =====
  if (id === 'fitmodo-gym') {
    if (section === 'home') {
      return `
        <section class="demo-section" style="background: linear-gradient(135deg, rgba(255, 138, 91, 0.2), rgba(255, 213, 106, 0.15)); border-radius: 20px; padding: 40px; margin-bottom: 24px;">
          <h2 style="font-size: 2.4rem; margin-bottom: 8px; font-family: 'DM Serif Display'; letter-spacing: -0.02em;">FITMODO</h2>
          <p style="font-size: 1.1rem; color: rgba(255,255,255,0.85); margin-bottom: 24px;">Premium Fitness Transformation Platform</p>
          <p style="color: rgba(255,255,255,0.7); line-height: 1.7; margin-bottom: 24px;">State-of-the-art gym facilities. 200+ classes monthly. Certified trainers. Community-first approach. Transform your fitness journey in 90 days.</p>
          <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 24px;">
            <div style="background: rgba(255,255,255,0.08); padding: 16px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.1);">
              <div style="font-size: 1.8rem; font-weight: bold; color: #ffd56a;">12,500+</div>
              <div style="font-size: 0.85rem; color: rgba(255,255,255,0.6); margin-top: 4px;">Active Members</div>
            </div>
            <div style="background: rgba(255,255,255,0.08); padding: 16px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.1);">
              <div style="font-size: 1.8rem; font-weight: bold; color: #66e0d2;">4.8★</div>
              <div style="font-size: 0.85rem; color: rgba(255,255,255,0.6); margin-top: 4px;">Member Rating</div>
            </div>
            <div style="background: rgba(255,255,255,0.08); padding: 16px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.1);">
              <div style="font-size: 1.8rem; font-weight: bold; color: #ff8a5b;">24/7</div>
              <div style="font-size: 0.85rem; color: rgba(255,255,255,0.6); margin-top: 4px;">Open Hours</div>
            </div>
          </div>
        </section>
        <section style="margin-bottom: 24px;">
          <h3 style="font-size: 1.3rem; margin-bottom: 16px; color: #4ecdc4;">Today's Class Schedule</h3>
          <div style="display: grid; gap: 12px;">
            <div style="background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 16px; display: flex; justify-content: space-between;">
              <div>
                <div style="font-weight: 600; color: #fff; margin-bottom: 4px;">💪 Advanced Strength</div>
                <div style="font-size: 0.85rem; color: rgba(255,255,255,0.6);">60 min • Trainer: Alex • 18/20 spots</div>
              </div>
              <div style="text-align: right; color: #4ecdc4; font-weight: 600;">6:00 AM</div>
            </div>
            <div style="background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 16px; display: flex; justify-content: space-between;">
              <div>
                <div style="font-weight: 600; color: #fff; margin-bottom: 4px;">🧘 Morning Yoga Flow</div>
                <div style="font-size: 0.85rem; color: rgba(255,255,255,0.6);">45 min • Trainer: Maya • 22/25 spots</div>
              </div>
              <div style="text-align: right; color: #4ecdc4; font-weight: 600;">7:15 AM</div>
            </div>
            <div style="background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 16px; display: flex; justify-content: space-between;">
              <div>
                <div style="font-weight: 600; color: #fff; margin-bottom: 4px;">🏃 HIIT Cardio Blast</div>
                <div style="font-size: 0.85rem; color: rgba(255,255,255,0.6);">50 min • Trainer: Marcus • 20/20 spots FULL</div>
              </div>
              <div style="text-align: right; color: #ff8a5b; font-weight: 600;">6:00 PM</div>
            </div>
          </div>
        </section>
      `;
    }
    if (section === 'services') {
      return `
        <section style="margin-bottom: 24px;">
          <h3 style="font-size: 1.3rem; margin-bottom: 16px; color: #4ecdc4;">Membership Plans</h3>
          <div style="display: grid; gap: 12px;">
            <div style="background: linear-gradient(135deg, rgba(111, 99, 255, 0.2), rgba(102, 224, 210, 0.1)); border: 2px solid rgba(111, 99, 255, 0.3); border-radius: 12px; padding: 16px;">
              <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 8px;">
                <div>
                  <div style="font-weight: 600; color: #fff; font-size: 1.05rem;">💪 Bronze Starter</div>
                  <div style="font-size: 0.8rem; color: rgba(255,255,255,0.6); margin-top: 2px;">Perfect for beginners</div>
                </div>
                <div style="text-align: right; font-weight: 600; color: #ffd56a;">₹2,999<span style="font-size: 0.7rem; color: rgba(255,255,255,0.6);">/mo</span></div>
              </div>
              <div style="font-size: 0.85rem; color: rgba(255,255,255,0.7);">✓ Gym access • ✓ 4 classes/week • ✓ Locker</div>
            </div>
            <div style="background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 16px;">
              <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 8px;">
                <div>
                  <div style="font-weight: 600; color: #fff; font-size: 1.05rem;">🌟 Silver Pro</div>
                  <div style="font-size: 0.8rem; color: rgba(255,255,255,0.6); margin-top: 2px;">Most popular</div>
                </div>
                <div style="text-align: right; font-weight: 600; color: #ffd56a;">₹4,499<span style="font-size: 0.7rem; color: rgba(255,255,255,0.6);">/mo</span></div>
              </div>
              <div style="font-size: 0.85rem; color: rgba(255,255,255,0.7);">✓ Unlimited classes • ✓ 1 trainer session • ✓ Nutrition app</div>
            </div>
            <div style="background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 16px;">
              <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 8px;">
                <div>
                  <div style="font-weight: 600; color: #fff; font-size: 1.05rem;">👑 Gold Elite</div>
                  <div style="font-size: 0.8rem; color: rgba(255,255,255,0.6); margin-top: 2px;">Premium experience</div>
                </div>
                <div style="text-align: right; font-weight: 600; color: #ffd56a;">₹6,999<span style="font-size: 0.7rem; color: rgba(255,255,255,0.6);">/mo</span></div>
              </div>
              <div style="font-size: 0.85rem; color: rgba(255,255,255,0.7);">✓ Personal trainer • ✓ Nutrition coaching • ✓ Priority booking</div>
            </div>
          </div>
        </section>
      `;
    }
    return `
      <section style="background: rgba(76, 205, 196, 0.1); border-left: 4px solid #4ecdc4; padding: 20px; border-radius: 8px; margin-bottom: 24px;">
        <h3 style="color: #4ecdc4; margin-bottom: 8px; font-size: 1.1rem;">Start Your Transformation</h3>
        <p style="color: rgba(255,255,255,0.8); margin-bottom: 16px; font-size: 0.95rem;">14-day free trial. No credit card needed. Personalized onboarding with fitness assessment.</p>
        <form onsubmit="submitWebsiteDemoLead(event)" style="display: grid; gap: 12px;">
          <input type="text" placeholder="Your name" required style="background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); padding: 10px 12px; border-radius: 8px; color: #fff;">
          <input type="email" placeholder="Email address" required style="background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); padding: 10px 12px; border-radius: 8px; color: #fff;">
          <button type="submit" style="background: linear-gradient(135deg, #ff8a5b, #ffd56a); border: none; padding: 12px; border-radius: 8px; color: #1a1a2e; font-weight: 600; cursor: pointer;">Claim Free Trial →</button>
        </form>
      </section>
    `;
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
