# 🔐 Password Reset System - Integration Guide

## Overview
The password reset system now integrates with **free** email, SMS, and WhatsApp services:
- ✅ **Email**: Gmail SMTP (completely free)
- ✅ **SMS**: Twilio free trial ($15 credit, enough for testing)
- ✅ **WhatsApp**: Twilio free trial
- ✅ **Direct Token**: No external service needed (for testing)

---

## Quick Setup (5 minutes)

### 1. Email Setup (Gmail) - EASIEST ⭐
Gmail is the simplest and completely free option.

**Steps:**
1. Go to your Gmail account: https://myaccount.google.com/security
2. Enable **2-Step Verification** if not already enabled
3. Go to https://myaccount.google.com/apppasswords
4. Select **Mail** and **Windows Computer** (or your device)
5. Google will generate a 16-character app password
6. Copy it (remove spaces) and paste in `.env`:
   ```
   GMAIL_USER=your-email@gmail.com
   GMAIL_APP_PASS=xxxxxxxxxxxxxxxx
   ```
7. Save `.env` and restart server

**Done!** ✅ Email password reset now works.

---

### 2. SMS & WhatsApp Setup (Twilio) - OPTIONAL
For SMS and WhatsApp support, Twilio offers a free trial.

**Free Trial Benefits:**
- $15 credit (enough for ~2000 SMS in US)
- No credit card validation needed immediately
- Works for testing and small-scale use

**Steps:**
1. Sign up at: https://www.twilio.com/console
2. Verify your phone number
3. On Console Dashboard, copy:
   - Account SID
   - Auth Token
4. Get a trial phone number for SMS
5. Request WhatsApp access in "Messaging" section
6. Update `.env`:
   ```
   TWILIO_ACCOUNT_SID=AC...
   TWILIO_AUTH_TOKEN=...
   TWILIO_PHONE=+1...
   TWILIO_WHATSAPP=+1...
   ```
7. **IMPORTANT**: Add verified phone numbers to test with at:
   https://www.twilio.com/console/phone-numbers/verified

**Note:** Trial accounts can ONLY send to verified phone numbers.

---

### 3. Install Optional Dependencies
SMS/WhatsApp support requires Twilio (optional):

```bash
npm install twilio
```

Server will warn if Twilio is not installed, but email will still work.

---

## Environment Variables

Copy `.env.example` to `.env` and fill in your credentials:

```bash
# Copy template
cp .env.example .env

# Edit with your credentials
nano .env
```

**Essential vars:**
- `GMAIL_USER` + `GMAIL_APP_PASS` (for email) ✅
- `TWILIO_*` (for SMS/WhatsApp) - optional

---

## How It Works

### User Flow:
1. User clicks "Forgot Password" on login page
2. Enters email and selects method: **Email, SMS, WhatsApp, or Token**
3. Backend generates 6-character reset code (e.g., "A5B2C1")
4. Code sent via selected method
5. User enters code on verification page
6. Code verified → Password reset form appears
7. New password saved, old reset code invalidated

### Token Expiry:
- Reset codes valid for **1 hour**
- Each request generates a new code
- Users can request new code anytime

---

## Testing the System

### Test Email:
```bash
# Should work immediately after Gmail setup
```

### Test SMS (with Twilio):
1. Add your phone to verified numbers
2. Create test user with your phone number
3. Request SMS reset
4. You'll receive the code

### Test WhatsApp:
1. Add your phone to verified numbers  
2. Message the Twilio WhatsApp number to enable
3. Request WhatsApp reset
4. You'll receive message with code

### Test Token (No setup needed):
1. Select "Token" method
2. Get direct reset link + code
3. Use for testing without external services

---

## Frontend: reset-password.html

The password reset page now has 4 options:

- **✉️ Email** - Receives code via Gmail
- **💬 SMS** - Receives code via Twilio SMS
- **💭 WhatsApp** - Receives code via Twilio WhatsApp  
- **🔗 Token** - Direct code display (dev/testing)

---

## Free Tiers Comparison

| Service | Free Tier | Cost | Setup Time |
|---------|-----------|------|-----------|
| **Gmail SMTP** | Unlimited | FREE | 2 min ✅ |
| **Twilio SMS** | $15 trial credit | $0.0075/SMS | 5 min |
| **Twilio WhatsApp** | $15 trial credit | $0.0015/msg | 5 min |
| **Mailgun** | 100/day | FREE | 3 min |
| **SendGrid** | 100/day | FREE | 3 min |

---

## Backend API Endpoints

### 1. Request Reset
```
POST /api/auth/forgot-password
{
  "email": "user@example.com",
  "method": "email" | "sms" | "whatsapp" | "token"
}
```

Response:
```json
{
  "success": true,
  "message": "Reset code sent via email",
  "token": "A5B2C1",
  "expiresIn": "1 hour",
  "contact": "user@example.com",
  "method": "email"
}
```

### 2. Verify Token
```
POST /api/auth/verify-reset-token
{
  "token": "A5B2C1",
  "email": "user@example.com"
}
```

### 3. Reset Password
```
POST /api/auth/reset-password
{
  "token": "A5B2C1",
  "email": "user@example.com",
  "newPassword": "NewPassword123"
}
```

---

## Troubleshooting

### Email not sending?
- Check `.env` has `GMAIL_USER` and `GMAIL_APP_PASS`
- Verify Gmail 2FA is enabled
- Check browser console for errors

### SMS not received?
- Verify phone number format: `+1234567890`
- Check phone is added to Twilio verified numbers
- Check Twilio has remaining credits

### WhatsApp not sending?
- Check WhatsApp messaging is enabled in Twilio
- Ensure phone is WhatsApp Business verified
- Message Twilio WhatsApp number first to activate

### Server error?
- Run: `npm install twilio` (for SMS/WhatsApp)
- Check `.env` exists and has correct format
- Restart server: `npm start`

---

## Next Steps (Optional)

1. **Verify users on signup**: Send welcome email
2. **Transactional emails**: Order confirmations via email
3. **SMS notifications**: New project alerts via SMS
4. **WhatsApp support**: Customer support via WhatsApp
5. **Production upgrades**: Move to SendGrid/Mailgun for higher volumes

---

## Security Notes

- Reset tokens are unique and time-limited (1 hour)
- Passwords hashed with bcrypt (10 rounds)
- Tokens never exposed in URLs (passed in form)
- Credentials stored in `.env` (never in code)
- `.env` file added to `.gitignore`

---

**Questions?** Check:
- Gmail: https://support.google.com/accounts/answer/185833
- Twilio: https://www.twilio.com/docs
- Nodemailer: https://nodemailer.com/
