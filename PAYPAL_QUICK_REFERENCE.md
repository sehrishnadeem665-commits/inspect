# PayPal Integration - Quick Reference Guide

## 🚀 Quick Start (5 Minutes)

### 1. Verify Setup
**Windows:**
```bash
verify-paypal-setup.bat
```

**Mac/Linux:**
```bash
bash verify-paypal-setup.sh
```

### 2. Start Development Server
```bash
npm run dev
```

Visit: http://localhost:3000

### 3. Test Payment Flow
1. Click "Get Report" button
2. Fill form:
   - Search Type: VIN
   - VIN: `5TDJKRFH9LS123456`
   - Vehicle Type: Car
   - Email: `your.email@example.com`
   - Country: United States
   - Package: Select any (e.g., Basic)
3. Click "Continue to Payment"
4. Select "PayPal"
5. Complete PayPal sandbox payment

## 📧 Email Testing

### Test Email Connection
Create `test-email.js`:
```javascript
const { testEmailConnection } = require('./lib/email.ts')

async function test() {
  const result = await testEmailConnection()
  console.log(result ? '✅ Email works!' : '❌ Email failed!')
  process.exit(0)
}

test().catch(err => {
  console.error('Email test error:', err)
  process.exit(1)
})
```

Run:
```bash
node test-email.js
```

## 🔧 Common Issues & Fixes

### Issue: "Payment system is currently unavailable"
**Fix:** Make sure you're using the updated `GetReportForm.tsx`
```bash
npm run dev
# Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
```

### Issue: PayPal button not showing
**Fix:** Check your `.env.local` has `NEXT_PUBLIC_PAYPAL_CLIENT_ID`
```bash
grep "NEXT_PUBLIC_PAYPAL_CLIENT_ID" .env.local
```

### Issue: "No payment information found"
**Fix:** Don't close the browser tab between checkout and payment
1. Complete form
2. Stay on same tab
3. Don't refresh

### Issue: Emails not sending

**Check 1: Credentials**
```bash
# Verify SMTP settings in .env.local
cat .env.local | grep SMTP
```

**Check 2: Gmail Settings**
- Log in to: https://myaccount.google.com/apppasswords
- Ensure app password is 16 characters
- Remove spaces: lgzgjnvhelqhxawp (not: lgzg ujnv elqh xawp)

**Check 3: Test Connection**
```javascript
// Create test-smtp.js
const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: 'autorevealed08@gmail.com',
    pass: 'lgzgjnvhelqhxawp' // WITHOUT SPACES
  }
})

transporter.verify((error, success) => {
  if (error) {
    console.log('❌ Error:', error)
  } else {
    console.log('✅ Ready to send emails!')
  }
})
```

Run: `node test-smtp.js`

### Issue: PayPal order creation fails
**Fix:** Check server logs
```bash
# In terminal running: npm run dev
# Look for error messages like:
# ❌ Error creating PayPal order: ...
```

## 📊 Testing Checklist

- [ ] Verified all files created
- [ ] `.env.local` has all credentials
- [ ] `npm run dev` starts without errors
- [ ] "Get Report" form loads
- [ ] Can select form options
- [ ] "Continue to Payment" works
- [ ] Redirected to checkout
- [ ] PayPal button shows
- [ ] Can complete PayPal payment
- [ ] Success page shows
- [ ] Customer receives email
- [ ] Admin receives email
- [ ] Payment logged to database (optional)

## 🔑 Credentials Reference

**PayPal Sandbox:**
- Client ID: `AcAU2RXmHI103qWgJNW2VfZSwhXEMUkhmxejOUvqcrsotm7EoydZCAPgwelEyuSQI1wzQflwA0lKo2ba`
- Merchant ID: `4Q4ENATN2E9VJ`
- Mode: `sandbox`

**Email (Gmail):**
- User: `autorevealed08@gmail.com`
- Password: `lgzgjnvhelqhxawp` (with spaces removed)
- Admin Email: `nabilazakaria89@gmail.com`

## 🌐 Important URLs

- PayPal Sandbox: https://sandbox.paypal.com
- Gmail App Passwords: https://myaccount.google.com/apppasswords
- Local Dev: http://localhost:3000
- PayPal Docs: https://developer.paypal.com/docs

## 📱 Testing on Different Devices

**Mobile:**
- Test on phone/tablet browser
- Check PayPal app integration works
- Verify success page responsive

**Desktop:**
- Chrome, Firefox, Safari
- Check console for errors
- Verify all buttons clickable

## 🗄️ Database Setup (Optional)

If you want to track payments in database:

```bash
mysql -u root -p carvertical < sql/paypal-migration.sql
```

Then verify table created:
```sql
SHOW TABLES;
SELECT * FROM paypal_payments;
```

## 🔐 Security Reminders

⚠️ **NEVER commit `.env.local` to Git!**

Check `.gitignore` has:
```
.env.local
.env*.local
```

Verify secrets aren't exposed:
```bash
# Check git history (should be empty for secrets)
git log -p -- .env.local
```

## 📞 Support Resources

**PayPal Sandbox Issues:**
- Docs: https://developer.paypal.com/
- Dashboard: https://sandbox.paypal.com
- Live Chat: Available in PayPal Developer Center

**Gmail SMTP Issues:**
- App Passwords: https://myaccount.google.com/apppasswords
- Less Secure: https://myaccount.google.com/lesssecureapps
- Gmail Troubleshooting: https://support.google.com/mail

**Next.js Issues:**
- Docs: https://nextjs.org/docs
- Community: https://github.com/vercel/next.js/discussions

## 🎯 Next Steps After Testing

1. **Create Account for Production**
   - Go to https://www.paypal.com/business
   - Create production account
   - Get production credentials

2. **Update Credentials**
   - Update `.env.local` with production keys
   - Change `PAYPAL_MODE=production`

3. **SSL Certificate**
   - Ensure your domain has HTTPS
   - PayPal requires HTTPS for production

4. **Deploy**
   - Set environment variables on hosting
   - Test payment flow on live site
   - Monitor for issues

## 📝 Useful Commands

```bash
# Start development
npm run dev

# Build for production
npm build

# Run production build
npm start

# Check for TypeScript errors
npm run typecheck

# Run linter
npm run lint

# Verify setup (Windows)
verify-paypal-setup.bat

# Verify setup (Mac/Linux)
bash verify-paypal-setup.sh
```

## 🎓 Understanding the Flow

```
User Form (GetReportForm)
    ↓
sessionStorage saves data
    ↓
Redirects to /checkout
    ↓
CheckoutContent loads data
    ↓
User selects PayPal
    ↓
/api/paypal/create-order called
    ↓
PayPal order created
    ↓
PayPal approval window
    ↓
User approves payment
    ↓
/api/paypal/capture-order called
    ↓
Payment captured
    ↓
Emails sent (customer + admin)
    ↓
Redirect to /payment-success
```

## ✨ You're All Set!

Your PayPal integration is complete and ready to test. Follow the Quick Start guide above to verify everything works.

**Happy selling! 🎉**
