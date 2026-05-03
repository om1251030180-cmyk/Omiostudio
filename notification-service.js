/**
 * ═══════════════════════════════════════════════════════
 *   NOTIFICATION SERVICE
 *   Email + SMS + WhatsApp (Free Services)
 * ═══════════════════════════════════════════════════════
 */

const nodemailer = require('nodemailer');
let twilio = null;
try {
  twilio = require('twilio');
} catch (e) {
  console.log('⚠️  Twilio not installed for SMS/WhatsApp notifications');
}

/* ─── EMAIL TRANSPORTER ─── */
let emailTransporter = null;

function initEmailTransporter() {
  if (emailTransporter) return emailTransporter;

  // Use Gmail SMTP (Free)
  const gmailUser = process.env.GMAIL_USER;
  const gmailPass = process.env.GMAIL_APP_PASS;

  if (gmailUser && gmailPass) {
    emailTransporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: gmailUser,
        pass: gmailPass  // Use App Password, not regular password
      }
    });
    console.log('✅ Gmail SMTP configured for email notifications');
  } else {
    console.log('⚠️  Gmail SMTP not configured. Set GMAIL_USER and GMAIL_APP_PASS in .env');
    emailTransporter = null;
  }
  
  return emailTransporter;
}

/* ─── TWILIO CLIENT ─── */
function getTwilioClient() {
  if (!twilio) return null;
  if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN) {
    console.log('⚠️  Twilio credentials not configured');
    return null;
  }
  return twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
}

/* ─── SEND EMAIL NOTIFICATION ─── */
async function sendEmailNotification(to, subject, htmlContent) {
  try {
    const transporter = initEmailTransporter();
    if (!transporter) {
      console.log('⚠️  Email transporter not available');
      return { success: false, error: 'Email not configured' };
    }

    await transporter.sendMail({
      from: process.env.GMAIL_USER || 'noreply@omiostudio.com',
      to,
      subject,
      html: htmlContent,
      replyTo: process.env.COMPANY_LEADER_EMAIL || 'admin@omio.studio'
    });

    console.log(`📧 Email sent to ${to}: ${subject}`);
    return { success: true };
  } catch (error) {
    console.error(`❌ Email failed for ${to}:`, error.message);
    return { success: false, error: error.message };
  }
}

/* ─── SEND SMS NOTIFICATION (Twilio) ─── */
async function sendSmsNotification(phoneNumber, message) {
  try {
    const client = getTwilioClient();
    if (!client) {
      console.log('⚠️  Twilio SMS not available');
      return { success: false, error: 'Twilio not configured' };
    }

    const formattedPhone = phoneNumber.startsWith('+') ? phoneNumber : `+${phoneNumber}`;
    
    await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE,
      to: formattedPhone
    });

    console.log(`📱 SMS sent to ${formattedPhone}`);
    return { success: true };
  } catch (error) {
    console.error(`❌ SMS failed:`, error.message);
    return { success: false, error: error.message };
  }
}

/* ─── SEND WHATSAPP NOTIFICATION (Twilio - Free Sandbox) ─── */
async function sendWhatsAppNotification(phoneNumber, message) {
  try {
    const client = getTwilioClient();
    if (!client) {
      console.log('⚠️  Twilio WhatsApp not available');
      return { success: false, error: 'Twilio not configured' };
    }

    const formattedPhone = phoneNumber.startsWith('+') ? phoneNumber : `+${phoneNumber}`;
    
    await client.messages.create({
      body: message,
      from: `whatsapp:${process.env.TWILIO_WHATSAPP}`,
      to: `whatsapp:${formattedPhone}`
    });

    console.log(`💬 WhatsApp sent to ${formattedPhone}`);
    return { success: true };
  } catch (error) {
    console.error(`❌ WhatsApp failed:`, error.message);
    return { success: false, error: error.message };
  }
}

/* ─── ORDER NOTIFICATION ─── */
async function notifyOrderPlaced(order, user, adminPhone, clientPhone, adminWhatsApp, clientWhatsApp) {
  try {
    const orderId = order._id || order.id;
    const orderUrl = `${process.env.BASE_URL || 'http://localhost:4000'}/order.html`;

    // Email to Admin
    const adminEmailSubject = `🚀 NEW ORDER: ${order.title}`;
    const adminEmailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f5f5f5; padding: 20px; border-radius: 10px;">
        <h2 style="color: #2c3e50;">📦 New Order Received</h2>
        
        <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #3498db;">Order Details</h3>
          <p><strong>Order ID:</strong> ${orderId}</p>
          <p><strong>Title:</strong> ${order.title}</p>
          <p><strong>Service:</strong> ${order.serviceType || 'Custom'}</p>
          <p><strong>Budget:</strong> ₹${order.budget || 'TBD'}</p>
          <p><strong>Priority:</strong> ${order.priority || 'Medium'}</p>
          <p><strong>Deadline:</strong> ${order.deadline ? new Date(order.deadline).toLocaleDateString() : 'TBD'}</p>
          
          <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
          
          <h4>Client Information</h4>
          <p><strong>Name:</strong> ${order.userName}</p>
          <p><strong>Email:</strong> ${order.userEmail}</p>
          <p><strong>Phone:</strong> ${order.userPhone || 'N/A'}</p>
          <p><strong>Company:</strong> ${order.userCompany || 'N/A'}</p>
          
          <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
          
          <p><strong>Description:</strong></p>
          <p>${order.description}</p>
        </div>
        
        <a href="${orderUrl}" style="display: inline-block; background: #3498db; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0;">View Order Details</a>
        
        <p style="color: #7f8c8d; font-size: 12px; margin-top: 30px;">
          This is an automated notification from Omio Studio. Do not reply to this email.
        </p>
      </div>
    `;
    
    // Email to Client
    const clientEmailSubject = `✅ Order Submitted: ${order.title}`;
    const clientEmailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f5f5f5; padding: 20px; border-radius: 10px;">
        <h2 style="color: #27ae60;">✅ Your Order is Confirmed!</h2>
        
        <p>Hi ${order.userName},</p>
        
        <p>Thank you for placing your order with Omio Studio. We have received your request and our team will review it shortly.</p>
        
        <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #3498db;">Order Summary</h3>
          <p><strong>Order ID:</strong> ${orderId}</p>
          <p><strong>Service:</strong> ${order.title}</p>
          <p><strong>Requested Budget:</strong> ₹${order.budget || 'TBD'}</p>
          <p><strong>Deadline:</strong> ${order.deadline ? new Date(order.deadline).toLocaleDateString() : 'TBD'}</p>
        </div>
        
        <p><strong>What's Next?</strong></p>
        <ul>
          <li>Our team will review your requirements within 24 hours</li>
          <li>You'll receive a detailed quote and project timeline</li>
          <li>Once you approve, work will begin immediately</li>
        </ul>
        
        <p style="color: #7f8c8d;">Questions? Contact us at admin@omio.studio</p>
      </div>
    `;
    
    // SMS to Admin
    const adminSmsMessage = `🚀 NEW ORDER: "${order.title}" from ${order.userName}. Budget: ₹${order.budget || 'TBD'}. ID: ${orderId}. Check: admin.html`;
    
    // SMS to Client
    const clientSmsMessage = `✅ Your order "${order.title}" has been received! Order ID: ${orderId}. Our team will contact you within 24 hours. - Omio Studio`;
    
    // WhatsApp to Admin
    const adminWhatsAppMessage = `🚀 *NEW ORDER ALERT*\n\n📌 Title: ${order.title}\n👤 Client: ${order.userName}\n💰 Budget: ₹${order.budget || 'TBD'}\n📅 Deadline: ${order.deadline ? new Date(order.deadline).toLocaleDateString() : 'TBD'}\n\n🔗 Order ID: ${orderId}\n\n⏰ Please review ASAP!`;
    
    // WhatsApp to Client
    const clientWhatsAppMessage = `✅ *Order Confirmed!*\n\nHi ${order.userName}, 👋\n\nYour order "*${order.title}*" has been successfully submitted!\n\n📦 Order ID: ${orderId}\n💰 Budget: ₹${order.budget || 'TBD'}\n\n✨ Our team will review and contact you within 24 hours.\n\n📞 Questions? Message us!`;

    // Send all notifications in parallel
    const results = {
      adminEmail: await sendEmailNotification(
        process.env.COMPANY_LEADER_EMAIL || 'admin@omio.studio',
        adminEmailSubject,
        adminEmailHtml
      ),
      clientEmail: await sendEmailNotification(order.userEmail, clientEmailSubject, clientEmailHtml)
    };

    // Send SMS if phone numbers provided
    if (adminPhone) {
      results.adminSms = await sendSmsNotification(adminPhone, adminSmsMessage);
    }
    if (clientPhone) {
      results.clientSms = await sendSmsNotification(clientPhone, clientSmsMessage);
    }

    // Send WhatsApp if phone numbers provided
    if (adminWhatsApp) {
      results.adminWhatsApp = await sendWhatsAppNotification(adminWhatsApp, adminWhatsAppMessage);
    }
    if (clientWhatsApp) {
      results.clientWhatsApp = await sendWhatsAppNotification(clientWhatsApp, clientWhatsAppMessage);
    }

    return results;
  } catch (error) {
    console.error('❌ Order notification failed:', error);
    return { error: error.message };
  }
}

/* ─── ORDER STATUS UPDATE NOTIFICATION ─── */
async function notifyOrderStatusUpdate(order, newStatus, clientEmail, clientPhone, clientWhatsApp) {
  try {
    const statusEmojis = {
      'pending': '⏳',
      'in_progress': '⚙️',
      'review': '👀',
      'completed': '✅',
      'cancelled': '❌'
    };

    const statusMessages = {
      'pending': 'Your order is pending review',
      'in_progress': 'We have started working on your order!',
      'review': 'Your order is in review stage',
      'completed': 'Your order has been completed!',
      'cancelled': 'Your order has been cancelled'
    };

    const emoji = statusEmojis[newStatus] || '📌';
    const message = statusMessages[newStatus] || 'Status updated';

    // Email
    const emailSubject = `${emoji} Order Update: ${message} - ${order.title}`;
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f5f5f5; padding: 20px; border-radius: 10px;">
        <h2 style="color: #2c3e50;">${emoji} Order Status Update</h2>
        <p>Hi ${order.userName},</p>
        <p><strong>${message}</strong></p>
        <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Order:</strong> ${order.title}</p>
          <p><strong>Status:</strong> ${newStatus.toUpperCase()}</p>
          <p><strong>Updated:</strong> ${new Date().toLocaleString()}</p>
        </div>
      </div>
    `;

    // SMS
    const smsMessage = `${emoji} Order Update: ${message}. Order: ${order.title}. Check your email for details.`;

    // WhatsApp
    const whatsAppMessage = `${emoji} *Order Status Update*\n\n${message}\n\n📌 Order: ${order.title}\n⏰ Updated: ${new Date().toLocaleTimeString()}`;

    const results = {
      email: await sendEmailNotification(clientEmail, emailSubject, emailHtml)
    };

    if (clientPhone) {
      results.sms = await sendSmsNotification(clientPhone, smsMessage);
    }

    if (clientWhatsApp) {
      results.whatsApp = await sendWhatsAppNotification(clientWhatsApp, whatsAppMessage);
    }

    return results;
  } catch (error) {
    console.error('❌ Status update notification failed:', error);
    return { error: error.message };
  }
}

module.exports = {
  initEmailTransporter,
  getTwilioClient,
  sendEmailNotification,
  sendSmsNotification,
  sendWhatsAppNotification,
  notifyOrderPlaced,
  notifyOrderStatusUpdate
};
