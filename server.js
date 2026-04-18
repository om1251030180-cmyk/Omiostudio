/**
 * ═══════════════════════════════════════════════════════
 *   OMIO STUDIO — BACKEND SERVER
 *   Node.js + Express + MongoDB + JWT + Nodemailer
 * ═══════════════════════════════════════════════════════
 */

require('dotenv').config();
const express    = require('express');
const mongoose   = require('mongoose');
const bcrypt     = require('bcryptjs');
const jwt        = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const multer     = require('multer');
const cors       = require('cors');
const path       = require('path');
const fs         = require('fs');

// Twilio client (if available)
let twilio = null;
try {
  twilio = require('twilio');
} catch (e) {
  console.log('⚠️  Twilio not installed. SMS/WhatsApp features unavailable. Run: npm install twilio');
}

const app  = express();
let PORT = Number(process.env.PORT) || 4000;
const MAX_PORT_ATTEMPTS = 10;

/* ─── MIDDLEWARE ─── */
app.use(cors({ origin: '*', credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.static(path.join(__dirname)));

// Ensure uploads directory exists
if (!fs.existsSync('./uploads')) fs.mkdirSync('./uploads');

/* ─── FILE UPLOAD ─── */
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, './uploads'),
  filename:    (req, file, cb) => cb(null, `${Date.now()}-${file.originalname.replace(/\s/g,'-')}`)
});
const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|gif|pdf|zip|rar|doc|docx|psd|ai|fig/;
    const ok = allowed.test(path.extname(file.originalname).toLowerCase());
    cb(ok ? null : new Error('File type not allowed'), ok);
  }
});

/* ─── MONGODB ─── */
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/omio_studio';

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('✅ MongoDB connected:', MONGO_URI);
    seedAdmin();
  })
  .catch(err => {
    console.log('⚠️  MongoDB not available — running in JSON file mode');
    console.log('   Error:', err.message);
    seedAdminJson();
  });

/* ─── SCHEMAS ─── */
const UserSchema = new mongoose.Schema({
  name:      { type: String, required: true, trim: true },
  email:     { type: String, required: true, unique: true, lowercase: true, trim: true },
  password:  { type: String, required: true, minlength: 6 },
  role:      { type: String, enum: ['client', 'admin'], default: 'client' },
  phone:     { type: String, default: '' },
  company:   { type: String, default: '' },
  avatar:    { type: String, default: '' },
  isActive:  { type: Boolean, default: true },
  resetToken: { type: String, default: null },
  resetTokenExpiry: { type: Date, default: null },
}, { timestamps: true });

const OrderSchema = new mongoose.Schema({
  userId:        { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  userName:      String,
  userEmail:     String,
  serviceType:   { type: String, required: true },
  serviceLabel:  String,
  customService: String,
  managementRequired: { type: Boolean, default: false },
  managementMonths: { type: Number, default: 0 },
  managementMonthlyFee: { type: Number, default: 0 },
  managementAmount: String,
  brief: mongoose.Schema.Types.Mixed,
  clientContactMethod: String,
  clientContactTime: String,
  title:         { type: String, required: true },
  description:   { type: String, required: true },
  budget:        String,
  deadline:      String,
  references:    String,
  files:         [String],
  status:        { type: String, enum: ['pending','in_progress','review','completed','cancelled'], default: 'pending' },
  adminNotes:    { type: String, default: '' },
  assigneeName:  { type: String, default: '' },
  assigneeEmail: { type: String, default: '' },
  teamName:      { type: String, default: '' },
  priority:      { type: String, default: 'medium' },
  slaHours:      { type: Number, default: 0 },
  assignmentNotes: { type: String, default: '' },
  assignmentUpdatedAt: String,
  estimatedPrice:String,
  deliveryFiles: [String],
  workflowStage: { type: String, default: 'awaiting_company_acceptance' },
  workflowRules: [String],
  companyAccepted: { type: Boolean, default: false },
  acceptance: { type: mongoose.Schema.Types.Mixed, default: {} },
  payment: { type: mongoose.Schema.Types.Mixed, default: {} },
  revisionPolicy: { type: mongoose.Schema.Types.Mixed, default: {} },
  tracking: { type: [mongoose.Schema.Types.Mixed], default: [] },
}, { timestamps: true });

const AppSettingSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  value: { type: mongoose.Schema.Types.Mixed, default: {} }
}, { timestamps: true });

const WorkItemSchema = new mongoose.Schema({
  clientId: String,
  clientName: String,
  clientEmail: String,
  clientPhone: String,
  serviceType: String,
  title: String,
  summary: String,
  previewUrl: String,
  isPublic: { type: Boolean, default: false },
  createdBy: String,
}, { timestamps: true });

const MessageSchema = new mongoose.Schema({
  orderId: String,
  clientId: String,
  senderId: String,
  senderName: String,
  senderRole: String,
  type: { type: String, default: 'text' },
  message: String,
  preferredAt: String,
  meetingLink: String,
}, { timestamps: true });

let User, Order, AppSetting, WorkItem, Message;
try {
  User  = mongoose.model('User', UserSchema);
  Order = mongoose.model('Order', OrderSchema);
  AppSetting = mongoose.model('AppSetting', AppSettingSchema);
  WorkItem = mongoose.model('WorkItem', WorkItemSchema);
  Message = mongoose.model('Message', MessageSchema);
} catch(e) {}

/* ─── JSON FALLBACK STORAGE ─── */
const DB_PATH = './db.json';
function getDB() {
  if (!fs.existsSync(DB_PATH)) fs.writeFileSync(DB_PATH, JSON.stringify({ users: [], orders: [], works: [], messages: [], settings: {} }));
  const data = JSON.parse(fs.readFileSync(DB_PATH));
  if (!data.settings || typeof data.settings !== 'object') data.settings = {};
  if (!Array.isArray(data.works)) data.works = [];
  if (!Array.isArray(data.messages)) data.messages = [];
  return data;
}
function saveDB(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}
const isMongoConnected = () => mongoose.connection.readyState === 1;

function sanitizeText(input, maxLen = 900) {
  return String(input || '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=\s*/gi, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, maxLen);
}

function normalizeUrl(url = '') {
  const text = String(url || '').trim();
  if (!text) return '';
  if (/^https?:\/\//i.test(text)) return text;
  return `https://${text}`;
}

function violatesContentPolicy(text = '') {
  const lowered = String(text || '').toLowerCase();
  const blocked = ['hack', 'exploit', 'pirated', 'leak', 'steal', 'malware', '<script'];
  return blocked.some((term) => lowered.includes(term));
}

function toMoney(value) {
  const raw = Number(String(value || '').replace(/[^0-9.]/g, ''));
  if (!Number.isFinite(raw) || raw < 0) return 0;
  return Math.round(raw * 100) / 100;
}

function nowIso() {
  return new Date().toISOString();
}

function makeTrackingEvent(stage, label, note, actorName = 'Omio System', actorRole = 'system') {
  return {
    stage,
    label,
    note: sanitizeText(note || '', 280),
    actorName: sanitizeText(actorName || 'Omio System', 80),
    actorRole: sanitizeText(actorRole || 'system', 30),
    at: nowIso()
  };
}

function orderPolicyRules() {
  return [
    'Company must accept and quote the project before development starts.',
    'Client must pay 50% advance before the team starts implementation.',
    'Paid revision requests are billed separately and start after revision payment.',
    'Remaining payment is due before final handover and production release.'
  ];
}

function defaultRevisionPolicy() {
  return {
    freeIncluded: 1,
    freeUsed: 0,
    paidRevisionCount: 0,
    totalRevisionCharges: 0,
    requests: []
  };
}

function deriveQuotedTotal(order = {}) {
  const fromEstimate = toMoney(order.estimatedPrice);
  if (fromEstimate > 0) return fromEstimate;
  const fromBudget = toMoney(order.budget);
  if (fromBudget > 0) return fromBudget;
  return 0;
}

function defaultPaymentState(order = {}) {
  const quotedTotal = deriveQuotedTotal(order);
  const advanceRequiredAmount = Math.round(quotedTotal * 0.5 * 100) / 100;
  return {
    currency: 'INR',
    quotedTotal,
    advanceRequiredPercent: 50,
    advanceRequiredAmount,
    advancePaidAmount: 0,
    advancePaidAt: '',
    remainingAmount: quotedTotal,
    remainingPaidAmount: 0,
    remainingPaidAt: '',
    fullyPaid: false,
    transactions: []
  };
}

function ensureOrderWorkflow(order = {}) {
  const safe = { ...order };

  safe.workflowRules = Array.isArray(safe.workflowRules) && safe.workflowRules.length
    ? safe.workflowRules
    : orderPolicyRules();

  safe.workflowStage = safe.workflowStage || 'awaiting_company_acceptance';
  safe.companyAccepted = !!safe.companyAccepted;

  const payment = {
    ...defaultPaymentState(safe),
    ...(safe.payment && typeof safe.payment === 'object' ? safe.payment : {})
  };

  payment.quotedTotal = toMoney(payment.quotedTotal);
  payment.advanceRequiredPercent = 50;
  payment.advanceRequiredAmount = Math.round(payment.quotedTotal * 0.5 * 100) / 100;
  payment.advancePaidAmount = toMoney(payment.advancePaidAmount);
  payment.remainingPaidAmount = toMoney(payment.remainingPaidAmount);
  payment.remainingAmount = Math.max(0, Math.round((payment.quotedTotal - payment.remainingPaidAmount) * 100) / 100);
  payment.transactions = Array.isArray(payment.transactions) ? payment.transactions : [];
  payment.fullyPaid = payment.remainingAmount <= 0;
  safe.payment = payment;

  const revisionPolicy = {
    ...defaultRevisionPolicy(),
    ...(safe.revisionPolicy && typeof safe.revisionPolicy === 'object' ? safe.revisionPolicy : {})
  };
  revisionPolicy.requests = Array.isArray(revisionPolicy.requests) ? revisionPolicy.requests : [];
  safe.revisionPolicy = revisionPolicy;

  safe.acceptance = safe.acceptance && typeof safe.acceptance === 'object' ? safe.acceptance : {};
  safe.tracking = Array.isArray(safe.tracking) ? safe.tracking : [];
  if (!safe.tracking.length) {
    safe.tracking = [
      makeTrackingEvent('order_placed', 'Order Placed', 'Client submitted the project request.', safe.userName || 'Client', 'client'),
      makeTrackingEvent('awaiting_company_acceptance', 'Awaiting Company Acceptance', 'Company team will review and share quotation.', 'Omio System', 'system')
    ];
  }

  return safe;
}

function pushOrderTracking(order = {}, event = null) {
  if (!event) return order;
  const safe = ensureOrderWorkflow(order);
  safe.tracking = [...safe.tracking, event];
  safe.workflowStage = event.stage || safe.workflowStage;
  return safe;
}

function newTxnId() {
  return `TXN-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
}

function newRevisionId() {
  return `REV-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
}

async function getManagementPricingSetting() {
  if (isMongoConnected()) {
    const doc = await AppSetting.findOne({ key: 'managementPricing' });
    return doc?.value && typeof doc.value === 'object' ? doc.value : {};
  }
  const db = getDB();
  const value = db.settings?.managementPricing;
  return value && typeof value === 'object' ? value : {};
}

async function saveManagementPricingSetting(pricing) {
  if (isMongoConnected()) {
    await AppSetting.findOneAndUpdate(
      { key: 'managementPricing' },
      { key: 'managementPricing', value: pricing },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    return;
  }
  const db = getDB();
  db.settings = db.settings || {};
  db.settings.managementPricing = pricing;
  saveDB(db);
}

/* ─── SEED ADMIN ─── */
async function seedAdmin() {
  try {
    const exists = await User.findOne({ email: process.env.ADMIN_EMAIL || 'admin@omio.studio' });
    if (!exists) {
      const hash = await bcrypt.hash(process.env.ADMIN_PASS || 'admin123', 10);
      await User.create({
        name:     'Om (Admin)',
        email:    process.env.ADMIN_EMAIL || 'admin@omio.studio',
        password: hash,
        role:     'admin',
        company:  'Omio Studio'
      });
      console.log('✅ Admin user seeded:', process.env.ADMIN_EMAIL || 'admin@omio.studio');
    }
  } catch(e) { console.log('Admin seed error:', e.message); }
}
function seedAdminJson() {
  const db = getDB();
  if (!db.users.find(u => u.email === 'admin@omio.studio')) {
    db.users.push({ id: 'admin_1', name: 'Om (Admin)', email: 'admin@omio.studio', password: 'admin123', role: 'admin', company: 'Omio Studio', createdAt: new Date().toISOString() });
    saveDB(db);
    console.log('✅ Admin seeded in JSON store');
  }
}

/* ─── NODEMAILER ─── */
let transporter = null;
function getMailer() {
  if (transporter) return transporter;

  // Preferred: custom SMTP provider (Brevo, Mailgun SMTP, SendGrid SMTP, Outlook SMTP, etc.)
  if (process.env.SMTP_HOST && process.env.SMTP_PORT && process.env.SMTP_USER && process.env.SMTP_PASS) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: String(process.env.SMTP_SECURE || '').toLowerCase() === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
    return transporter;
  }

  // Fallback: Gmail app-password based transport.
  if (process.env.GMAIL_USER && process.env.GMAIL_APP_PASS) {
    transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: process.env.GMAIL_USER, pass: process.env.GMAIL_APP_PASS }
    });
    return transporter;
  }

  return null;
}

function getMailerFromAddress() {
  return process.env.MAIL_FROM || process.env.SMTP_FROM || process.env.GMAIL_USER || getCompanyLeaderEmail();
}

function getCompanyLeaderEmail() {
  return process.env.COMPANY_LEADER_EMAIL || process.env.ADMIN_EMAIL || 'omiostudio.digital@gmail.com';
}

/* ─── PASSWORD RESET MESSAGE FUNCTIONS ─── */

async function sendPasswordResetEmail(email, name, token, method) {
  try {
    const mailer = getMailer();
    if (!mailer) {
      console.log('⚠️  Email not configured. Token:', token);
      return { success: false, message: 'Email not configured' };
    }

    const resetLink = `${process.env.FRONTEND_URL || 'http://localhost:4002'}/reset-password.html?token=${token}`;
    const htmlContent = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #000000 0%, #1a1a2e 100%); color: #ffffff; padding: 40px; border-radius: 12px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="margin: 0; font-size: 28px; color: #ff006e;">🔐 Password Reset Request</h1>
        </div>
        
        <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
          Hi ${name || 'there'},
        </p>
        
        <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
          We received a request to reset your Omio Studio account password. Click the button below to create a new password. This link expires in 1 hour.
        </p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetLink}" style="display: inline-block; background: linear-gradient(135deg, #ff006e, #ff1a7f); color: #ffffff; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px;">
            Reset Password
          </a>
        </div>
        
        <p style="font-size: 14px; color: #cccccc; margin-bottom: 10px;">Or use this code: <strong style="font-family: monospace; color: #00d9ff;">${token}</strong></p>
        
        <hr style="border: none; border-top: 1px solid rgba(255, 255, 255, 0.1); margin: 30px 0;">
        
        <p style="font-size: 13px; color: #999999; margin-bottom: 10px;">
          If you didn't request this reset, you can ignore this email or contact support.
        </p>
        
        <p style="font-size: 13px; color: #999999; margin: 0;">
          © 2026 Omio Studio. All rights reserved.
        </p>
      </div>
    `;

    await mailer.sendMail({
      from: getMailerFromAddress(),
      to: email,
      subject: '🔐 Reset Your Omio Studio Password',
      html: htmlContent
    });

    console.log('✅ Password reset email sent to:', email);
    return { success: true, message: 'Reset email sent' };
  } catch (error) {
    console.error('❌ Email sending failed:', error.message);
    return { success: false, message: error.message };
  }
}

async function sendPasswordResetSMS(phone, token) {
  try {
    if (!twilio || !process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN || !process.env.TWILIO_PHONE) {
      console.log('⚠️  Twilio SMS not configured. Token:', token);
      return { success: false, message: 'SMS not configured' };
    }

    const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
    const message = `Your Omio Studio password reset code: ${token}. Valid for 1 hour. Do not share this code.`;

    await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE,
      to: phone
    });

    console.log('✅ Password reset SMS sent to:', phone);
    return { success: true, message: 'SMS sent' };
  } catch (error) {
    console.error('❌ SMS sending failed:', error.message);
    return { success: false, message: error.message };
  }
}

async function sendPasswordResetWhatsApp(phone, token, name) {
  try {
    if (!twilio || !process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN || !process.env.TWILIO_WHATSAPP) {
      console.log('⚠️  Twilio WhatsApp not configured. Token:', token);
      return { success: false, message: 'WhatsApp not configured' };
    }

    const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
    const message = `Hi ${name || 'there'}! 👋\n\nYour Omio Studio password reset code: *${token}*\n\n⏰ Valid for 1 hour\n🔒 Keep this code private\n\nIf you didn't request this, ignore this message.`;

    await client.messages.create({
      body: message,
      from: `whatsapp:${process.env.TWILIO_WHATSAPP}`,
      to: `whatsapp:${phone}`
    });

    console.log('✅ Password reset WhatsApp sent to:', phone);
    return { success: true, message: 'WhatsApp sent' };
  } catch (error) {
    console.error('❌ WhatsApp sending failed:', error.message);
    return { success: false, message: error.message };
  }
}

async function getClientContactById(clientId) {
  const cleanId = String(clientId || '').trim();
  if (!cleanId) return null;

  if (isMongoConnected()) {
    const user = await User.findById(cleanId).select('name email role');
    if (!user || user.role === 'admin') return null;
    return { name: user.name || 'Client', email: String(user.email || '').toLowerCase() };
  }

  const db = getDB();
  const user = (db.users || []).find((u) => String(u.id) === cleanId && u.role !== 'admin');
  if (!user) return null;
  return { name: user.name || 'Client', email: String(user.email || '').toLowerCase() };
}

function messageEmailHtml({ receiverName, senderName, senderRole, type, message, orderId, preferredAt, meetingLink }) {
  const typeLabelMap = {
    text: 'Text Message',
    call_request: 'Call Request',
    video_request: 'Video Request',
    call_scheduled: 'Call Scheduled',
    video_scheduled: 'Video Scheduled',
    system: 'System'
  };
  const typeLabel = typeLabelMap[type] || type;
  return `
    <div style="font-family:sans-serif;max-width:620px;margin:0 auto;background:#0a0a1a;color:#f0eeff;padding:34px;border-radius:14px">
      <h2 style="margin:0 0 8px;color:#7dd3fc">New Message Notification</h2>
      <p style="margin:0 0 20px;color:rgba(240,238,255,0.65)">Hi ${receiverName || 'there'}, you have a new communication from Omio Studio workflow.</p>
      <div style="background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.12);border-radius:12px;padding:16px;margin-bottom:14px">
        <div style="font-size:13px;color:rgba(240,238,255,0.6);margin-bottom:6px">From</div>
        <div style="font-size:15px;font-weight:700">${senderName} (${senderRole})</div>
        <div style="font-size:13px;color:rgba(240,238,255,0.6);margin-top:10px;margin-bottom:6px">Type</div>
        <div style="font-size:15px;font-weight:700">${typeLabel}</div>
        ${orderId ? `<div style="font-size:13px;color:rgba(240,238,255,0.6);margin-top:10px;margin-bottom:6px">Order Context</div><div style="font-family:monospace">${orderId}</div>` : ''}
      </div>
      <div style="background:rgba(255,255,255,0.04);border-radius:12px;padding:16px;margin-bottom:14px">
        <div style="font-size:13px;color:rgba(240,238,255,0.6);margin-bottom:6px">Message</div>
        <div style="line-height:1.65">${message}</div>
      </div>
      ${preferredAt ? `<p style="margin:0 0 8px;color:rgba(240,238,255,0.72)"><strong>Preferred Time:</strong> ${preferredAt}</p>` : ''}
      ${meetingLink ? `<p style="margin:0 0 8px;"><a href="${meetingLink}" style="color:#a78bfa">Join/Review Link</a></p>` : ''}
      <p style="margin-top:22px;font-size:12px;color:rgba(240,238,255,0.35)">Omio Studio · ${getCompanyLeaderEmail()}</p>
    </div>
  `;
}

function simpleNoticeEmailHtml({ title, body, footer }) {
  return `
    <div style="font-family:sans-serif;max-width:620px;margin:0 auto;background:#0a0a1a;color:#f0eeff;padding:34px;border-radius:14px">
      <h2 style="margin:0 0 10px;color:#7dd3fc">${title}</h2>
      <div style="line-height:1.7;color:rgba(240,238,255,0.82)">${body}</div>
      <p style="margin-top:22px;font-size:12px;color:rgba(240,238,255,0.35)">${footer || `Omio Studio · ${getCompanyLeaderEmail()}`}</p>
    </div>
  `;
}

async function sendMail(to, subject, html) {
  const mailer = getMailer();
  if (!mailer) { console.log(`📧 [NO MAILER] To: ${to}\nSubject: ${subject}`); return; }
  try {
    await mailer.sendMail({ from: `"Omio Studio" <${getMailerFromAddress()}>`, to, subject, html });
    console.log(`✅ Email sent to ${to}`);
  } catch(e) { console.log(`⚠️  Email failed: ${e.message}`); }
}

function newOrderEmailHtml(order, user) {
  return `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto;background:#0a0a1a;color:#f0eeff;padding:40px;border-radius:16px">
      <h1 style="color:#a78bfa;font-size:28px;margin-bottom:4px">✦ New Order Received!</h1>
      <p style="color:rgba(240,238,255,0.5);margin-bottom:32px">A client has submitted a project request on Omio Studio</p>
      <div style="background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:12px;padding:24px;margin-bottom:20px">
        <table style="width:100%;border-collapse:collapse">
          <tr><td style="color:rgba(240,238,255,0.5);padding:8px 0;font-size:13px;width:140px">Order ID</td><td style="font-family:monospace;color:#a78bfa;font-weight:600">${order._id||order.id}</td></tr>
          <tr><td style="color:rgba(240,238,255,0.5);padding:8px 0;font-size:13px">Client</td><td style="font-weight:600">${user.name} (${user.email})</td></tr>
          <tr><td style="color:rgba(240,238,255,0.5);padding:8px 0;font-size:13px">Service</td><td>${order.serviceLabel}</td></tr>
          <tr><td style="color:rgba(240,238,255,0.5);padding:8px 0;font-size:13px">Title</td><td style="font-weight:700">${order.title}</td></tr>
          <tr><td style="color:rgba(240,238,255,0.5);padding:8px 0;font-size:13px">Budget</td><td style="color:#a78bfa;font-weight:700">${order.budget||'TBD'}</td></tr>
          <tr><td style="color:rgba(240,238,255,0.5);padding:8px 0;font-size:13px">Deadline</td><td>${order.deadline||'Not specified'}</td></tr>
        </table>
      </div>
      <div style="background:rgba(255,255,255,0.04);border-radius:12px;padding:20px;margin-bottom:20px">
        <div style="font-size:12px;letter-spacing:0.1em;text-transform:uppercase;color:rgba(240,238,255,0.4);margin-bottom:10px">Project Description</div>
        <div style="font-size:14px;line-height:1.7">${order.description}</div>
      </div>
      ${order.references ? `<div style="background:rgba(255,255,255,0.04);border-radius:12px;padding:20px;margin-bottom:20px"><div style="font-size:12px;color:rgba(240,238,255,0.4);margin-bottom:8px">REFERENCES</div><div style="font-size:14px">${order.references}</div></div>` : ''}
      <a href="http://localhost:4000" style="display:inline-block;padding:14px 28px;background:linear-gradient(135deg,#7c3aed,#06b6d4);border-radius:100px;color:#fff;text-decoration:none;font-weight:700;font-size:14px">Open Admin Panel →</a>
      <p style="font-size:12px;color:rgba(240,238,255,0.3);margin-top:32px">Omio Studio · hello@omio.studio · omio.studio</p>
    </div>
  `;
}

function orderConfirmHtml(order) {
  return `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto;background:#0a0a1a;color:#f0eeff;padding:40px;border-radius:16px">
      <h1 style="color:#10b981;font-size:28px;margin-bottom:4px">✅ Order Received!</h1>
      <p style="color:rgba(240,238,255,0.5);margin-bottom:24px">Thank you for choosing Omio Studio. We've received your project request.</p>
      <div style="background:rgba(124,58,237,0.1);border:1px solid rgba(124,58,237,0.25);border-radius:12px;padding:24px;margin-bottom:24px">
        <div style="font-size:13px;color:rgba(240,238,255,0.5);margin-bottom:4px">Order ID</div>
        <div style="font-family:monospace;font-size:18px;font-weight:700;color:#a78bfa">${order._id||order.id}</div>
      </div>
      <p style="font-size:15px;line-height:1.75;color:rgba(240,238,255,0.7)">Our team will review your request and get back to you within <strong style="color:#f0eeff">24 hours</strong> with a detailed proposal and timeline.</p>
      <p style="font-size:14px;color:rgba(240,238,255,0.5);margin-top:24px">Have questions? Reply to this email or reach us at <a href="mailto:hello@omio.studio" style="color:#a78bfa">hello@omio.studio</a></p>
      <p style="font-size:12px;color:rgba(240,238,255,0.3);margin-top:40px">Omio Studio — We Don't Just Build, We Create Experiences</p>
    </div>
  `;
}

/* ─── AUTH MIDDLEWARE ─── */
const auth = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET || 'omio_secret_2024');

    if (req.user.role !== 'admin') {
      if (isMongoConnected()) {
        const dbUser = await User.findById(req.user.id).select('role isActive');
        if (dbUser && dbUser.role !== 'admin' && dbUser.isActive === false) {
          return res.status(403).json({ error: 'Account is inactive. Contact studio admin.' });
        }
      } else {
        const db = getDB();
        const dbUser = (db.users || []).find((u) => u.id === req.user.id);
        if (dbUser && dbUser.role !== 'admin' && dbUser.isActive === false) {
          return res.status(403).json({ error: 'Account is inactive. Contact studio admin.' });
        }
      }
    }

    next();
  } catch(e) { res.status(401).json({ error: 'Invalid token' }); }
};

const adminAuth = (req, res, next) => {
  auth(req, res, () => {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin access required' });
    next();
  });
};

/* ══════════════════════════════════════════════════
   ROUTES
══════════════════════════════════════════════════ */

/* ─── HEALTH ─── */
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', db: isMongoConnected() ? 'mongodb' : 'json', timestamp: new Date() });
});

app.get('/api/management-pricing', async (req, res) => {
  try {
    const pricing = await getManagementPricingSetting();
    res.json(pricing || {});
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.put('/api/admin/management-pricing', adminAuth, async (req, res) => {
  try {
    const input = req.body && typeof req.body === 'object' ? req.body : {};
    const normalized = {};
    Object.keys(input).forEach((k) => {
      const n = Number(input[k]);
      normalized[k] = Number.isFinite(n) && n >= 0 ? n : 0;
    });
    await saveManagementPricingSetting(normalized);
    res.json({ success: true, pricing: normalized });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get('/api/portfolio/works', async (req, res) => {
  try {
    if (isMongoConnected()) {
      const works = await WorkItem.find({ isPublic: true }).sort({ createdAt: -1 }).limit(60);
      return res.json(works);
    }
    const db = getDB();
    res.json((db.works || []).filter((w) => !!w.isPublic).reverse());
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

/* ─── AUTH ROUTES ─── */

// Register
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, phone, company } = req.body;
    if (!name || !email || !password) return res.status(400).json({ error: 'Name, email, and password are required' });
    if (password.length < 6) return res.status(400).json({ error: 'Password must be at least 6 characters' });

    if (isMongoConnected()) {
      const existing = await User.findOne({ email: email.toLowerCase() });
      if (existing) return res.status(400).json({ error: 'Email already registered' });
      const hash = await bcrypt.hash(password, 10);
      const user = await User.create({ name, email: email.toLowerCase(), password: hash, phone: phone||'', company: company||'' });
      const token = jwt.sign({ id: user._id, email: user.email, role: user.role, name: user.name }, process.env.JWT_SECRET || 'omio_secret_2024', { expiresIn: '7d' });
      
      // Send emails
      await sendMail(getCompanyLeaderEmail(), `🎉 New Client Registered: ${name}`,
        `<div style="font-family:sans-serif;padding:24px;background:#0a0a1a;color:#f0eeff;border-radius:12px"><h2 style="color:#a78bfa">New Client Registered!</h2><p><strong>${name}</strong> (${email}) just registered on Omio Studio.</p></div>`);
      await sendMail(email, 'Welcome to Omio Studio! ✦',
        `<div style="font-family:sans-serif;padding:40px;background:#0a0a1a;color:#f0eeff;border-radius:16px"><h1 style="color:#a78bfa">Welcome, ${name}! ✦</h1><p style="color:rgba(240,238,255,0.7)">Your Omio Studio account is ready. Start your first project today!</p></div>`);

      return res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
    }

    // JSON fallback
    const db = getDB();
    if (db.users.find(u => u.email === email.toLowerCase())) return res.status(400).json({ error: 'Email already registered' });
    const newUser = { id: `user_${Date.now()}`, name, email: email.toLowerCase(), password, phone: phone||'', company: company||'', role: 'client', isActive: true, createdAt: new Date().toISOString() };
    db.users.push(newUser);
    saveDB(db);
    const token = jwt.sign({ id: newUser.id, email: newUser.email, role: newUser.role, name: newUser.name }, process.env.JWT_SECRET || 'omio_secret_2024', { expiresIn: '7d' });
    res.json({ token, user: { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role } });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

    if (isMongoConnected()) {
      const user = await User.findOne({ email: email.toLowerCase() });
      if (!user) return res.status(401).json({ error: 'Invalid credentials' });
      if (user.role !== 'admin' && user.isActive === false) return res.status(403).json({ error: 'Account is inactive. Contact studio admin.' });
      const valid = await bcrypt.compare(password, user.password);
      if (!valid) return res.status(401).json({ error: 'Invalid credentials' });
      const token = jwt.sign({ id: user._id, email: user.email, role: user.role, name: user.name }, process.env.JWT_SECRET || 'omio_secret_2024', { expiresIn: '7d' });
      return res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role, phone: user.phone, company: user.company } });
    }

    // JSON fallback
    const db = getDB();
    const user = db.users.find(u => u.email === email.toLowerCase() && u.password === password);
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    if (user.role !== 'admin' && user.isActive === false) return res.status(403).json({ error: 'Account is inactive. Contact studio admin.' });
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role, name: user.name }, process.env.JWT_SECRET || 'omio_secret_2024', { expiresIn: '7d' });
    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// Get me
app.get('/api/auth/me', auth, async (req, res) => {
  try {
    if (isMongoConnected()) {
      const user = await User.findById(req.user.id).select('-password');
      return res.json(user);
    }
    const db = getDB();
    const user = db.users.find(u => u.id === req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    const { password: _, ...safe } = user;
    res.json(safe);
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// Update profile
app.put('/api/auth/profile', auth, async (req, res) => {
  try {
    const { name, phone, company } = req.body;
    if (isMongoConnected()) {
      const user = await User.findByIdAndUpdate(req.user.id, { name, phone, company }, { new: true }).select('-password');
      return res.json(user);
    }
    const db = getDB();
    const idx = db.users.findIndex(u => u.id === req.user.id);
    if (idx > -1) { db.users[idx] = { ...db.users[idx], name, phone, company }; saveDB(db); }
    res.json({ success: true });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// Forgot Password - Request reset link
app.post('/api/auth/forgot-password', async (req, res) => {
  try {
    console.log('📧 Forgot-password request received:', { email: req.body.email, method: req.body.method });
    
    const { email, method } = req.body;
    if (!email || !method) {
      console.log('❌ Missing email or method');
      return res.status(400).json({ error: 'Email and method are required' });
    }
    if (!['email', 'sms', 'whatsapp', 'token'].includes(method)) {
      console.log('❌ Invalid method:', method);
      return res.status(400).json({ error: 'Invalid method' });
    }

    let user;
    if (isMongoConnected()) {
      user = await User.findOne({ email });
    } else {
      const db = getDB();
      user = db.users.find(u => u.email === email);
    }

    if (!user) {
      console.log('❌ User not found:', email);
      return res.status(404).json({ error: 'User not found' });
    }

    // Generate reset token (6 character alphanumeric)
    const resetToken = Math.random().toString(36).substring(2, 8).toUpperCase();
    const resetTokenExpiry = Date.now() + (3600 * 1000); // 1 hour expiry

    if (isMongoConnected()) {
      await User.findByIdAndUpdate(user._id, { resetToken, resetTokenExpiry });
    } else {
      const db = getDB();
      const idx = db.users.findIndex(u => u.email === email);
      if (idx > -1) {
        db.users[idx].resetToken = resetToken;
        db.users[idx].resetTokenExpiry = resetTokenExpiry;
        saveDB(db);
      }
    }

    // Send via selected method
    let sendResult = { success: false };
    const resetLink = `${process.env.FRONTEND_URL || 'http://localhost:4002'}/reset-password.html?token=${resetToken}`;
    
    console.log(`📤 Sending reset via ${method}...`);
    
    if (method === 'email') {
      sendResult = await sendPasswordResetEmail(email, user.name, resetToken, method);
    } else if (method === 'sms') {
      if (!user.phone) {
        console.log('❌ User has no phone number');
        return res.status(400).json({ error: 'User has no phone number on file' });
      }
      sendResult = await sendPasswordResetSMS(user.phone, resetToken);
    } else if (method === 'whatsapp') {
      if (!user.phone) {
        console.log('❌ User has no phone number');
        return res.status(400).json({ error: 'User has no phone number on file' });
      }
      sendResult = await sendPasswordResetWhatsApp(user.phone, resetToken, user.name);
    } else if (method === 'token') {
      sendResult = { success: true, message: 'Token generated' };
    }
    
    const responseBody = {
      success: sendResult.success || method === 'token',
      message: sendResult.message || `Reset code sent via ${method}`,
      token: resetToken,
      link: resetLink,
      expiresIn: '1 hour',
      contact: method === 'sms' || method === 'whatsapp' ? user.phone : user.email,
      method: method,
      instruction: method === 'token' ? 'Use the token above. Direct URL: ' + resetLink : null
    };
    
    console.log('✅ Sending response:', responseBody.success ? 'Success' : 'Warning - Send failed');
    res.json(responseBody);
  } catch(e) {
    console.error('💥 Error in forgot-password endpoint:', e);
    res.status(500).json({ error: e.message || 'Internal server error' });
  }
});

// Verify Reset Token
app.post('/api/auth/verify-reset-token', async (req, res) => {
  try {
    const { token, email } = req.body;
    if (!token || !email) return res.status(400).json({ error: 'Token and email are required' });

    let user;
    if (isMongoConnected()) {
      user = await User.findOne({ email });
    } else {
      const db = getDB();
      user = db.users.find(u => u.email === email);
    }

    if (!user) return res.status(404).json({ error: 'User not found' });
    if (user.resetToken !== token) return res.status(400).json({ error: 'Invalid token' });
    if (Date.now() > user.resetTokenExpiry) return res.status(400).json({ error: 'Token expired' });

    res.json({ success: true, message: 'Token valid', email });
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
});

// Reset Password with Token
app.post('/api/auth/reset-password', async (req, res) => {
  try {
    const { token, email, newPassword } = req.body;
    if (!token || !email || !newPassword) return res.status(400).json({ error: 'Token, email, and new password are required' });
    if (newPassword.length < 8) return res.status(400).json({ error: 'Password must be at least 8 characters' });

    let user;
    if (isMongoConnected()) {
      user = await User.findOne({ email });
    } else {
      const db = getDB();
      user = db.users.find(u => u.email === email);
    }

    if (!user) return res.status(404).json({ error: 'User not found' });
    if (user.resetToken !== token) return res.status(400).json({ error: 'Invalid token' });
    if (Date.now() > user.resetTokenExpiry) return res.status(400).json({ error: 'Token expired' });

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    if (isMongoConnected()) {
      await User.findByIdAndUpdate(user._id, {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null
      });
    } else {
      const db = getDB();
      const idx = db.users.findIndex(u => u.email === email);
      if (idx > -1) {
        db.users[idx].password = hashedPassword;
        db.users[idx].resetToken = null;
        db.users[idx].resetTokenExpiry = null;
        saveDB(db);
      }
    }

    res.json({ success: true, message: 'Password reset successfully' });
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
});

/* ─── ORDER ROUTES ─── */

// Create order
app.post('/api/orders', auth, upload.array('files', 10), async (req, res) => {
  try {
    const {
      serviceType,
      serviceLabel,
      customService,
      managementRequired,
      managementMonths,
      managementMonthlyFee,
      managementAmount,
      brief,
      clientContactMethod,
      clientContactTime,
      title,
      description,
      budget,
      deadline,
      references,
      estimatedPrice
    } = req.body;
    if (!serviceType || !title || !description) return res.status(400).json({ error: 'Service, title, and description are required' });

    const files = req.files ? req.files.map(f => f.filename) : [];

    const baseOrderData = {
      userId:      req.user.id,
      userName:    req.user.name,
      userEmail:   req.user.email,
      serviceType,
      serviceLabel,
      customService,
      managementRequired: String(managementRequired).toLowerCase() === 'true',
      managementMonths: Number(managementMonths || 0),
      managementMonthlyFee: Number(managementMonthlyFee || 0),
      managementAmount,
      brief: (() => {
        if (!brief) return null;
        if (typeof brief === 'object') return brief;
        try {
          return JSON.parse(String(brief));
        } catch {
          return { raw: sanitizeText(String(brief), 2000) };
        }
      })(),
      clientContactMethod: sanitizeText(clientContactMethod, 40),
      clientContactTime: sanitizeText(clientContactTime, 120),
      title,
      description,
      budget, deadline, references,
      files, estimatedPrice,
      status:      'pending',
    };
    const orderData = ensureOrderWorkflow(baseOrderData);

    let savedOrder;
    if (isMongoConnected()) {
      savedOrder = await Order.create(orderData);
    } else {
      const db = getDB();
      savedOrder = { ...orderData, id: `ORD-${Date.now()}`, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
      db.orders.push(savedOrder);
      saveDB(db);
    }

    // Email notifications
    const adminEmail = getCompanyLeaderEmail();
    await sendMail(adminEmail, `🚀 New Order: ${title} from ${req.user.name}`, newOrderEmailHtml(savedOrder, req.user));
    await sendMail(req.user.email, `✅ Order Confirmed — ${title}`, orderConfirmHtml(savedOrder));

    res.status(201).json({ success: true, order: savedOrder, message: 'Order submitted! You will receive a confirmation email shortly.' });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// Get my orders
app.get('/api/orders/my', auth, async (req, res) => {
  try {
    if (isMongoConnected()) {
      const orders = await Order.find({ userId: req.user.id }).sort({ createdAt: -1 });
      return res.json(orders.map((o) => ensureOrderWorkflow(o.toObject ? o.toObject() : o)));
    }
    const db = getDB();
    const orders = db.orders.filter(o => o.userId === req.user.id).map((o) => ensureOrderWorkflow(o)).reverse();
    res.json(orders);
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// Get single order
app.get('/api/orders/:id', auth, async (req, res) => {
  try {
    if (isMongoConnected()) {
      const order = await Order.findById(req.params.id);
      if (!order) return res.status(404).json({ error: 'Order not found' });
      if (order.userId.toString() !== req.user.id && req.user.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
      return res.json(ensureOrderWorkflow(order.toObject ? order.toObject() : order));
    }
    const db = getDB();
    const order = db.orders.find(o => o.id === req.params.id);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    if (order.userId !== req.user.id && req.user.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
    res.json(ensureOrderWorkflow(order));
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// Delete my order
app.delete('/api/orders/:id', auth, async (req, res) => {
  try {
    if (isMongoConnected()) {
      const order = await Order.findById(req.params.id);
      if (!order) return res.status(404).json({ error: 'Order not found' });
      if (order.userId.toString() !== req.user.id && req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Forbidden' });
      }
      await Order.findByIdAndDelete(req.params.id);
      return res.json({ success: true });
    }

    const db = getDB();
    const idx = db.orders.findIndex(o => o.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Order not found' });
    const order = db.orders[idx];
    if (order.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden' });
    }
    db.orders.splice(idx, 1);
    saveDB(db);
    res.json({ success: true });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

/* ─── CLIENT WORK ROUTES ─── */
app.get('/api/client/works', auth, async (req, res) => {
  try {
    if (req.user.role === 'admin') {
      if (isMongoConnected()) return res.json(await WorkItem.find({}).sort({ createdAt: -1 }));
      const db = getDB();
      return res.json((db.works || []).reverse());
    }

    const email = String(req.user.email || '').toLowerCase();
    if (isMongoConnected()) {
      const works = await WorkItem.find({
        $or: [{ clientId: req.user.id }, { clientEmail: email }, { isPublic: true }]
      }).sort({ createdAt: -1 });
      return res.json(works);
    }

    const db = getDB();
    const works = (db.works || []).filter((w) => (w.clientId === req.user.id) || String(w.clientEmail || '').toLowerCase() === email || !!w.isPublic).reverse();
    res.json(works);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get('/api/admin/works', adminAuth, async (req, res) => {
  try {
    if (isMongoConnected()) return res.json(await WorkItem.find({}).sort({ createdAt: -1 }));
    const db = getDB();
    res.json((db.works || []).reverse());
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post('/api/admin/works', adminAuth, async (req, res) => {
  try {
    const clientEmail = sanitizeText(req.body.clientEmail, 120).toLowerCase();
    const clientPhone = sanitizeText(req.body.clientPhone, 40);
    const clientName = sanitizeText(req.body.clientName, 80);
    const serviceType = sanitizeText(req.body.serviceType, 60);
    const title = sanitizeText(req.body.title, 120);
    const summary = sanitizeText(req.body.summary, 900);
    const previewUrl = normalizeUrl(req.body.previewUrl || '');
    const isPublic = !!req.body.isPublic;

    if (!clientEmail || !clientName || !serviceType || !title || !summary) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    if (violatesContentPolicy(`${title} ${summary} ${clientName} ${serviceType}`)) {
      return res.status(400).json({ error: 'Content policy violation' });
    }

    const payload = {
      clientId: '',
      clientName,
      clientEmail,
      clientPhone,
      serviceType,
      title,
      summary,
      previewUrl,
      isPublic,
      createdBy: req.user.id
    };

    let saved;
    if (isMongoConnected()) {
      saved = await WorkItem.create(payload);
    } else {
      const db = getDB();
      saved = { ...payload, id: `WORK-${Date.now()}`, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
      db.works.push(saved);
      saveDB(db);
    }

    await sendMail(
      clientEmail,
      `🎁 New Delivered Work — ${title}`,
      simpleNoticeEmailHtml({
        title: 'Your Work Has Been Delivered',
        body: `
          <p>Hi ${clientName},</p>
          <p>Omio Studio has published a new delivery for your project.</p>
          <ul>
            <li><strong>Service:</strong> ${serviceType}</li>
            <li><strong>Title:</strong> ${title}</li>
            <li><strong>Visibility:</strong> ${isPublic ? 'Public Portfolio + Client' : 'Private (Client only)'}</li>
          </ul>
          <p>${summary}</p>
          ${previewUrl ? `<p><a href="${previewUrl}" style="color:#a78bfa">Open Preview</a></p>` : ''}
        `
      })
    );

    await sendMail(
      getCompanyLeaderEmail(),
      `📦 Work Delivery Published for ${clientName}`,
      simpleNoticeEmailHtml({
        title: 'Work Delivery Logged',
        body: `<p>Admin <strong>${req.user.name}</strong> published a work delivery for <strong>${clientName}</strong> (${clientEmail}).</p><p><strong>${title}</strong> · ${serviceType}</p>`
      })
    );

    res.status(201).json({ success: true, item: saved });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

/* ─── MESSAGING ROUTES ─── */
app.get('/api/messages', auth, async (req, res) => {
  try {
    if (isMongoConnected()) {
      if (req.user.role === 'admin') return res.json(await Message.find({}).sort({ createdAt: -1 }).limit(200));
      return res.json(await Message.find({ $or: [{ clientId: req.user.id }, { senderId: req.user.id }] }).sort({ createdAt: -1 }).limit(200));
    }

    const db = getDB();
    const list = db.messages || [];
    if (req.user.role === 'admin') return res.json([...list].reverse());
    res.json(list.filter((m) => m.clientId === req.user.id || m.senderId === req.user.id).reverse());
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post('/api/messages', auth, async (req, res) => {
  try {
    const orderId = sanitizeText(req.body.orderId, 60);
    const allowedTypes = ['text', 'call_request', 'video_request', 'call_scheduled', 'video_scheduled', 'system'];
    const type = allowedTypes.includes(req.body.type) ? req.body.type : 'text';
    const message = sanitizeText(req.body.message, 900);
    const preferredAt = sanitizeText(req.body.preferredAt, 60);
    const meetingLink = normalizeUrl(req.body.meetingLink || '');

    if (!message) return res.status(400).json({ error: 'Message required' });
    if (violatesContentPolicy(message)) return res.status(400).json({ error: 'Content policy violation' });

    const payload = {
      orderId,
      clientId: req.user.role === 'admin' ? sanitizeText(req.body.clientId, 80) : req.user.id,
      senderId: req.user.id,
      senderName: sanitizeText(req.user.name, 80),
      senderRole: req.user.role,
      type,
      message,
      preferredAt,
      meetingLink,
    };

    if (req.user.role === 'admin' && !payload.clientId) {
      return res.status(400).json({ error: 'clientId is required for admin messages' });
    }

    let saved;
    if (isMongoConnected()) {
      saved = await Message.create(payload);
    } else {
      const db = getDB();
      saved = { ...payload, id: `MSG-${Date.now()}`, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
      db.messages.push(saved);
      saveDB(db);
    }

    const leaderEmail = getCompanyLeaderEmail();
    if (req.user.role === 'admin') {
      const targetClient = await getClientContactById(payload.clientId);
      if (targetClient?.email) {
        await sendMail(
          targetClient.email,
          `📩 Message from Omio Studio — ${payload.type}`,
          messageEmailHtml({
            receiverName: targetClient.name,
            senderName: req.user.name,
            senderRole: 'admin',
            type: payload.type,
            message: payload.message,
            orderId: payload.orderId,
            preferredAt: payload.preferredAt,
            meetingLink: payload.meetingLink
          })
        );
      }
      await sendMail(
        leaderEmail,
        `📤 Admin sent message to client (${payload.type})`,
        messageEmailHtml({
          receiverName: 'Company Leader',
          senderName: req.user.name,
          senderRole: 'admin',
          type: payload.type,
          message: payload.message,
          orderId: payload.orderId,
          preferredAt: payload.preferredAt,
          meetingLink: payload.meetingLink
        })
      );
    } else {
      await sendMail(
        leaderEmail,
        `📥 Client message from ${req.user.name} (${payload.type})`,
        messageEmailHtml({
          receiverName: 'Company Leader',
          senderName: req.user.name,
          senderRole: 'client',
          type: payload.type,
          message: payload.message,
          orderId: payload.orderId,
          preferredAt: payload.preferredAt,
          meetingLink: payload.meetingLink
        })
      );
      await sendMail(
        req.user.email,
        '✅ We received your message',
        messageEmailHtml({
          receiverName: req.user.name,
          senderName: 'Omio Studio System',
          senderRole: 'system',
          type: payload.type,
          message: 'Your message has been delivered to our company team. We will respond shortly.',
          orderId: payload.orderId,
          preferredAt: payload.preferredAt,
          meetingLink: payload.meetingLink
        })
      );
    }

    res.status(201).json({ success: true, message: saved });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

/* ─── ADMIN ROUTES ─── */

// Get all orders
app.get('/api/admin/orders', adminAuth, async (req, res) => {
  try {
    const { status } = req.query;
    if (isMongoConnected()) {
      const filter = status && status !== 'all' ? { status } : {};
      const orders = await Order.find(filter).sort({ createdAt: -1 });
      return res.json(orders.map((o) => ensureOrderWorkflow(o.toObject ? o.toObject() : o)));
    }
    const db = getDB();
    let orders = db.orders.map((o) => ensureOrderWorkflow(o)).reverse();
    if (status && status !== 'all') orders = orders.filter(o => o.status === status);
    res.json(orders);
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// Update order status
app.put('/api/admin/orders/:id', adminAuth, async (req, res) => {
  try {
    const { status, adminNotes, estimatedPrice } = req.body;
    let updatedOrder = null;
    const statusLabels = { pending:'Pending',in_progress:'In Progress',review:'Under Review',completed:'Completed',cancelled:'Cancelled' };

    if (isMongoConnected()) {
      const orderDoc = await Order.findById(req.params.id);
      if (!orderDoc) return res.status(404).json({ error: 'Order not found' });

      let safe = ensureOrderWorkflow(orderDoc.toObject());
      const nextStatus = status || safe.status;
      if (nextStatus === 'in_progress' && safe.payment.advancePaidAmount < safe.payment.advanceRequiredAmount) {
        return res.status(400).json({ error: 'Cannot start work before 50% advance payment is received.' });
      }

      safe.status = nextStatus;
      safe.adminNotes = sanitizeText(adminNotes || safe.adminNotes || '', 900);
      safe.estimatedPrice = estimatedPrice || safe.estimatedPrice;
      const quoted = deriveQuotedTotal({ ...safe, estimatedPrice: safe.estimatedPrice });
      safe.payment.quotedTotal = quoted;
      safe.payment.advanceRequiredAmount = Math.round(quoted * 0.5 * 100) / 100;
      safe.payment.remainingAmount = Math.max(0, Math.round((quoted - safe.payment.remainingPaidAmount) * 100) / 100);

      safe = pushOrderTracking(safe, makeTrackingEvent(
        `status_${nextStatus}`,
        `Status Changed: ${statusLabels[nextStatus] || nextStatus}`,
        safe.adminNotes || 'Status updated by company team.',
        req.user.name,
        'admin'
      ));

      orderDoc.set({
        status: safe.status,
        adminNotes: safe.adminNotes,
        estimatedPrice: safe.estimatedPrice,
        workflowStage: safe.workflowStage,
        workflowRules: safe.workflowRules,
        companyAccepted: safe.companyAccepted,
        acceptance: safe.acceptance,
        payment: safe.payment,
        revisionPolicy: safe.revisionPolicy,
        tracking: safe.tracking,
        updatedAt: nowIso()
      });
      orderDoc.markModified('payment');
      orderDoc.markModified('acceptance');
      orderDoc.markModified('revisionPolicy');
      orderDoc.markModified('tracking');
      await orderDoc.save();
      updatedOrder = orderDoc.toObject();
    } else {
      const db = getDB();
      const idx = db.orders.findIndex(o => o.id === req.params.id);
      if (idx > -1) {
        let safe = ensureOrderWorkflow(db.orders[idx]);
        const nextStatus = status || safe.status;
        if (nextStatus === 'in_progress' && safe.payment.advancePaidAmount < safe.payment.advanceRequiredAmount) {
          return res.status(400).json({ error: 'Cannot start work before 50% advance payment is received.' });
        }

        safe.status = nextStatus;
        safe.adminNotes = sanitizeText(adminNotes || safe.adminNotes || '', 900);
        safe.estimatedPrice = estimatedPrice || safe.estimatedPrice;
        const quoted = deriveQuotedTotal({ ...safe, estimatedPrice: safe.estimatedPrice });
        safe.payment.quotedTotal = quoted;
        safe.payment.advanceRequiredAmount = Math.round(quoted * 0.5 * 100) / 100;
        safe.payment.remainingAmount = Math.max(0, Math.round((quoted - safe.payment.remainingPaidAmount) * 100) / 100);
        safe = pushOrderTracking(safe, makeTrackingEvent(
          `status_${nextStatus}`,
          `Status Changed: ${statusLabels[nextStatus] || nextStatus}`,
          safe.adminNotes || 'Status updated by company team.',
          req.user.name,
          'admin'
        ));
        safe.updatedAt = nowIso();
        db.orders[idx] = safe;
        saveDB(db);
        updatedOrder = safe;
      }
    }

    if (updatedOrder) {
      await sendMail(updatedOrder.userEmail, `📬 Order Update — ${statusLabels[status]||status}`,
        `<div style="font-family:sans-serif;padding:40px;background:#0a0a1a;color:#f0eeff;border-radius:16px">
          <h1 style="color:#a78bfa">Order Status Updated</h1>
          <p>Your order "<strong>${updatedOrder.title}</strong>" has been updated.</p>
          <div style="background:rgba(124,58,237,0.15);border-radius:12px;padding:20px;margin:20px 0">
            <div style="font-size:13px;color:rgba(240,238,255,0.5);margin-bottom:6px">New Status</div>
            <div style="font-size:20px;font-weight:700">${statusLabels[status]||status}</div>
          </div>
          ${adminNotes ? `<div style="background:rgba(255,255,255,0.04);border-radius:12px;padding:20px"><div style="font-size:12px;color:rgba(240,238,255,0.4);margin-bottom:8px">MESSAGE FROM STUDIO</div><p>${adminNotes}</p></div>` : ''}
          <p style="font-size:12px;color:rgba(240,238,255,0.3);margin-top:32px">Omio Studio — hello@omio.studio</p>
        </div>`
      );
    }

    res.json({ success: true, order: updatedOrder });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

app.put('/api/admin/orders/:id/assignment', adminAuth, async (req, res) => {
  try {
    const payload = {
      assigneeName: sanitizeText(req.body.assigneeName, 80),
      assigneeEmail: sanitizeText(req.body.assigneeEmail, 120).toLowerCase(),
      teamName: sanitizeText(req.body.teamName, 80),
      priority: ['low', 'medium', 'high', 'urgent'].includes(req.body.priority) ? req.body.priority : 'medium',
      slaHours: Math.max(0, Number(req.body.slaHours || 0)),
      assignmentNotes: sanitizeText(req.body.assignmentNotes, 500),
      assignmentUpdatedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    let updatedOrder = null;
    if (isMongoConnected()) {
      updatedOrder = await Order.findByIdAndUpdate(req.params.id, payload, { new: true });
    } else {
      const db = getDB();
      const idx = db.orders.findIndex((o) => o.id === req.params.id);
      if (idx > -1) {
        db.orders[idx] = { ...db.orders[idx], ...payload };
        updatedOrder = db.orders[idx];
        saveDB(db);
      }
    }

    if (!updatedOrder) return res.status(404).json({ error: 'Order not found' });

    if (updatedOrder.userEmail) {
      await sendMail(
        updatedOrder.userEmail,
        `🧭 Assignment & SLA Updated — ${updatedOrder.title || 'Your Project'}`,
        simpleNoticeEmailHtml({
          title: 'Project Assignment Updated',
          body: `
            <p>Your project assignment details were updated by Omio Studio.</p>
            <ul>
              <li><strong>Project:</strong> ${updatedOrder.title || '-'}</li>
              <li><strong>Team:</strong> ${payload.teamName || '-'}</li>
              <li><strong>Owner:</strong> ${payload.assigneeName || '-'} ${payload.assigneeEmail ? `(${payload.assigneeEmail})` : ''}</li>
              <li><strong>Priority:</strong> ${payload.priority}</li>
              <li><strong>SLA:</strong> ${payload.slaHours} hour(s)</li>
            </ul>
            ${payload.assignmentNotes ? `<p><strong>Studio Note:</strong> ${payload.assignmentNotes}</p>` : ''}
          `
        })
      );
    }

    await sendMail(
      getCompanyLeaderEmail(),
      `🗂 Assignment Updated for ${updatedOrder.title || updatedOrder._id || updatedOrder.id}`,
      simpleNoticeEmailHtml({
        title: 'Assignment Change Logged',
        body: `<p>Admin <strong>${req.user.name}</strong> updated assignment/SLA for order <strong>${updatedOrder._id || updatedOrder.id}</strong>.</p>`
      })
    );

    res.json({ success: true, order: updatedOrder });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Delete order
app.delete('/api/admin/orders/:id', adminAuth, async (req, res) => {
  try {
    if (isMongoConnected()) {
      await Order.findByIdAndDelete(req.params.id);
    } else {
      const db = getDB();
      db.orders = db.orders.filter(o => o.id !== req.params.id);
      saveDB(db);
    }
    res.json({ success: true });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// Get all users
app.get('/api/admin/users', adminAuth, async (req, res) => {
  try {
    if (isMongoConnected()) {
      const users = await User.find({ role: 'client' }).select('-password').sort({ createdAt: -1 });
      return res.json(users);
    }
    const db = getDB();
    const users = db.users.filter(u => u.role !== 'admin').map(({ password, ...u }) => ({ isActive: true, ...u }));
    res.json(users);
  } catch(e) { res.status(500).json({ error: e.message }); }
});

app.put('/api/admin/users/:id/status', adminAuth, async (req, res) => {
  try {
    const isActive = !!req.body?.isActive;
    if (isMongoConnected()) {
      const user = await User.findById(req.params.id).select('-password');
      if (!user) return res.status(404).json({ error: 'User not found' });
      if (user.role === 'admin') return res.status(400).json({ error: 'Cannot modify admin account status' });
      user.isActive = isActive;
      await user.save();

      await sendMail(
        user.email,
        isActive ? '✅ Your Omio Studio account is active' : '⚠️ Your Omio Studio account is inactive',
        simpleNoticeEmailHtml({
          title: isActive ? 'Account Reactivated' : 'Account Status Changed',
          body: isActive
            ? '<p>Your client account has been reactivated by Omio Studio. You can continue using dashboard features.</p>'
            : '<p>Your client account has been marked inactive by Omio Studio. Please contact support for clarification.</p>'
        })
      );

      await sendMail(
        getCompanyLeaderEmail(),
        `👤 Client ${isActive ? 'Unbanned' : 'Banned'} — ${user.name}`,
        simpleNoticeEmailHtml({
          title: 'Client Status Updated',
          body: `<p>Admin <strong>${req.user.name}</strong> set <strong>${user.name}</strong> (${user.email}) to <strong>${isActive ? 'active' : 'inactive'}</strong>.</p>`
        })
      );

      return res.json({ success: true, user });
    }

    const db = getDB();
    const idx = db.users.findIndex((u) => u.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'User not found' });
    if (db.users[idx].role === 'admin') return res.status(400).json({ error: 'Cannot modify admin account status' });
    db.users[idx].isActive = isActive;
    saveDB(db);
    const { password, ...safe } = db.users[idx];

    if (safe.email) {
      await sendMail(
        safe.email,
        isActive ? '✅ Your Omio Studio account is active' : '⚠️ Your Omio Studio account is inactive',
        simpleNoticeEmailHtml({
          title: isActive ? 'Account Reactivated' : 'Account Status Changed',
          body: isActive
            ? '<p>Your client account has been reactivated by Omio Studio. You can continue using dashboard features.</p>'
            : '<p>Your client account has been marked inactive by Omio Studio. Please contact support for clarification.</p>'
        })
      );
    }

    await sendMail(
      getCompanyLeaderEmail(),
      `👤 Client ${isActive ? 'Unbanned' : 'Banned'} — ${safe.name || safe.id}`,
      simpleNoticeEmailHtml({
        title: 'Client Status Updated',
        body: `<p>Admin <strong>${req.user.name}</strong> set <strong>${safe.name || safe.id}</strong> (${safe.email || 'no-email'}) to <strong>${isActive ? 'active' : 'inactive'}</strong>.</p>`
      })
    );

    res.json({ success: true, user: safe });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Admin upload file for order
app.post('/api/admin/orders/:id/upload', adminAuth, upload.array('deliveryFiles', 20), async (req, res) => {
  try {
    const files = req.files.map(f => f.filename);
    if (isMongoConnected()) {
      await Order.findByIdAndUpdate(req.params.id, { $push: { deliveryFiles: { $each: files } } });
    } else {
      const db = getDB();
      const idx = db.orders.findIndex(o => o.id === req.params.id);
      if (idx > -1) { db.orders[idx].deliveryFiles = [...(db.orders[idx].deliveryFiles||[]), ...files]; saveDB(db); }
    }
    res.json({ success: true, files });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// Stats for admin
app.get('/api/admin/stats', adminAuth, async (req, res) => {
  try {
    if (isMongoConnected()) {
      const [totalOrders, pending, inProgress, completed, totalUsers] = await Promise.all([
        Order.countDocuments(),
        Order.countDocuments({ status: 'pending' }),
        Order.countDocuments({ status: 'in_progress' }),
        Order.countDocuments({ status: 'completed' }),
        User.countDocuments({ role: 'client' }),
      ]);
      return res.json({ totalOrders, pending, inProgress, completed, totalUsers });
    }
    const db = getDB();
    res.json({
      totalOrders: db.orders.length,
      pending:     db.orders.filter(o => o.status === 'pending').length,
      inProgress:  db.orders.filter(o => o.status === 'in_progress').length,
      completed:   db.orders.filter(o => o.status === 'completed').length,
      totalUsers:  db.users.filter(u => u.role !== 'admin').length,
    });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

/* ─── SERVE FRONTEND ─── */
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

/* ─── START ─── */
const printStartupInfo = (activePort) => {
  console.log('\n✦ ════════════════════════════════════ ✦');
  console.log('  OMIO STUDIO SERVER STARTED');
  console.log(`  URL:      http://localhost:${activePort}`);
  console.log(`  API:      http://localhost:${activePort}/api`);
  console.log(`  Database: ${MONGO_URI}`);
  console.log(`  Mode:     ${process.env.NODE_ENV || 'development'}`);
  console.log('✦ ════════════════════════════════════ ✦\n');
  console.log('  Admin Login:');
  console.log(`  Email:    ${process.env.ADMIN_EMAIL || 'admin@omio.studio'}`);
  console.log(`  Password: ${process.env.ADMIN_PASS || 'admin123'}`);
  const smtpReady = !!(process.env.SMTP_HOST && process.env.SMTP_PORT && process.env.SMTP_USER && process.env.SMTP_PASS);
  const gmailReady = !!(process.env.GMAIL_USER && process.env.GMAIL_APP_PASS);
  console.log(`\n  Mailer:   ${(smtpReady || gmailReady) ? 'Configured' : 'Not configured'}`);
  console.log(`  Mode:     ${smtpReady ? 'SMTP' : (gmailReady ? 'Gmail' : 'None')}`);
  console.log(`  From:     ${getMailerFromAddress()}`);
  console.log(`  Leader:   ${getCompanyLeaderEmail()}`);
  console.log('  ⚡ Tip: Fill in .env for email notifications\n');
};

const startServer = (attempt = 0) => {
  const server = app.listen(PORT, () => {
    printStartupInfo(PORT);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE' && attempt < MAX_PORT_ATTEMPTS) {
      console.warn(`⚠ Port ${PORT} is busy. Retrying on port ${PORT + 1}...`);
      PORT += 1;
      return startServer(attempt + 1);
    }

    console.error('❌ Failed to start server:', err.message);
    process.exit(1);
  });
};

startServer();
