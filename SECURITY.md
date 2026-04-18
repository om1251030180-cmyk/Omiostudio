# 🔐 Security Best Practices Guide

## Overview
This document outlines security practices for handling sensitive data (API keys, tokens, credentials) in the Omio Studio project.

---

## ✅ Current Security Implementation

### 1. **Environment Variables (.env)**
- ✅ `.env` file is in `.gitignore` (NOT committed to GitHub)
- ✅ Using `dotenv` package to load `.env` at startup
- ✅ `.env.example` template committed (safe for documentation)

### 2. **Protected Secrets**
- Twilio credentials (Account SID, Auth Token)
- Gmail SMTP credentials (App Password)
- MongoDB connection string
- JWT Secret
- Admin credentials

### 3. **Code Practices**
- ✅ No hardcoded secrets in source code
- ✅ All credentials loaded from `process.env`
- ✅ `.env` file never committed

---

## 📋 Setup Instructions

### Step 1: Copy Template to `.env`
```bash
# Copy the example template
cp .env.example .env

# Now edit .env with YOUR real credentials
# DO NOT commit this file!
```

### Step 2: Fill in Your Secrets
Edit `.env` and add real values:
```env
# Example
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_actual_token_here
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASS=xxxx xxxx xxxx xxxx
JWT_SECRET=generated_random_string_here
```

### Step 3: Generate Strong Secrets
Generate a secure JWT secret:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Step 4: Start Server
```bash
npm start
# Server reads from .env automatically
```

---

## ⚠️ Security Checklist

### Before First Commit:
- [ ] Create `.env` file locally (DO NOT commit)
- [ ] Add all sensitive values to `.env`
- [ ] Verify `.env` is in `.gitignore`
- [ ] Run: `git check-ignore .env` (should return `.env`)
- [ ] Never commit `.env` to GitHub

### Before Deployment:
- [ ] Generate strong random JWT_SECRET (NOT "test123")
- [ ] Use production Twilio credentials (not trial)
- [ ] Verify all API keys are valid and active
- [ ] Change default ADMIN_PASS from "admin123"
- [ ] Set NODE_ENV=production
- [ ] Use HTTPS for FRONTEND_URL

### Ongoing:
- [ ] Rotate credentials every 90 days
- [ ] Use separate credentials for dev/staging/production
- [ ] Never push `.env` to GitHub
- [ ] Audit access logs regularly
- [ ] Keep dependencies updated: `npm audit fix`

---

## 🚨 What If You Accidentally Committed Secrets?

### **IMMEDIATE ACTION REQUIRED:**

1. **Stop using those credentials immediately**
2. **Revoke/rotate the compromised credentials:**
   - Twilio: Delete account/generate new token
   - Gmail: Revoke App Password
   - Any API keys: Regenerate them

3. **Remove from Git history:**
```bash
# Remove .env from tracking (without deleting locally)
git rm --cached .env

# Commit the removal
git commit -m "Remove .env from tracking - was accidentally committed"

# Push
git push origin main

# Force push history cleanup (if secrets are exposed)
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch .env" \
  --prune-empty --tag-name-filter cat -- --all

git push origin --force --all
```

4. **Alert your team** - anyone who pulled the code has access to those secrets

---

## 📂 File Structure - Secrets Policy

```
Omio Studio/
├── .env                    ❌ NEVER commit (in .gitignore)
├── .env.example            ✅ Safe to commit (template only)
├── .env.production         ❌ NEVER commit (in .gitignore)
├── db.json                 ❌ NEVER commit (in .gitignore)
├── .gitignore              ✅ Safe to commit (lists above files)
├── server.js               ✅ Safe to commit (no hardcoded secrets)
├── SECURITY.md             ✅ Safe to commit (this file)
└── README.md               ✅ Safe to commit (public documentation)
```

---

## 🔑 How To Get Each Credential

### **Twilio (SMS/WhatsApp)**
1. Go to [twilio.com/try-twilio](https://www.twilio.com/try-twilio)
2. Sign up with email/phone
3. Dashboard → Settings → Account SID + Auth Token
4. Verify phone number for SMS testing
5. Add values to `.env`

### **Gmail (Email Notifications)**
1. Go to [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
2. Select "Mail" and "Windows Computer"
3. Copy 16-character password
4. Add to `.env`: `GMAIL_APP_PASSWORD=xxxx xxxx xxxx xxxx`

### **JWT Secret**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
# Copy output to .env as JWT_SECRET
```

---

## 🛡️ Environment-Specific Configuration

### Development (.env)
```env
NODE_ENV=development
ADMIN_PASS=admin123  # Simple password for testing
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx  # Trial
```

### Production (.env.production)
```env
NODE_ENV=production
ADMIN_PASS=GenerateStrongPassword123!@#  # Strong password
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx  # Live account
JWT_SECRET=GeneratedSecureString...  # Strong random
```

**NEVER commit `.env.production` - keep it on production server only**

---

## 🔍 Verification

### Check That .env Is Protected:
```bash
git status
# Should show: .env (not listed, which means it's ignored)

git check-ignore .env
# Should output: .env

git ls-files | grep -i "\.env$"
# Should return nothing (no .env files tracked)
```

### List All Tracked Files:
```bash
git ls-files
# Verify NO .env, db.json, or other secrets files appear
```

---

## 📚 Additional Resources

- [OWASP Environment Variables](https://owasp.org/www-community/attacks/Path_Traversal)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)
- [Dotenv Documentation](https://github.com/motdotla/dotenv)
- [Twilio Security](https://www.twilio.com/docs/general/security)
- [Gmail App Passwords](https://support.google.com/accounts/answer/185833)

---

## ✨ Summary

✅ **DO:**
- Store all secrets in `.env`
- Use strong random values for JWT_SECRET
- Include `.env` in `.gitignore`
- Commit `.env.example` (template only)
- Rotate credentials periodically
- Use different credentials per environment

❌ **DON'T:**
- Commit `.env` to GitHub
- Hardcode secrets in source files
- Share credentials via email/chat
- Use weak/simple passwords
- Log sensitive data to console
- Reuse credentials across environments

---

**Last Updated:** April 18, 2026  
**Status:** ✅ Production Ready
