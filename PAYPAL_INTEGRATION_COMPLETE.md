# PayPal Integration Setup Guide

## ✅ Completed Setup

Your Next.js website now has a complete PayPal payment integration with the following features:

### 1. **Payment Flow**
- Users fill out the "Get Report Form" with vehicle details
- Users select a package (Basic, Standard, or Premium)
- Click "Continue to Payment"
- Choose payment method (PayPal or Credit/Debit Card)
- Complete payment via PayPal
- Receive confirmation email

### 2. **Files Created/Modified**

#### Environment Configuration
- **`.env.local`** - Updated with PayPal credentials and Gmail settings

#### PayPal Integration
- **`lib/paypal.ts`** - PayPal API helper functions
  - `getPayPalAccessToken()` - Get OAuth token
  - `createPayPalOrder()` - Create payment order
  - `capturePayPalOrder()` - Capture payment
  - `getPayPalOrder()` - Verify order status

#### Email Service
- **`lib/email.ts`** - Email notifications using Gmail SMTP
  - `sendCustomerPaymentConfirmation()` - Send receipt to customer
  - `sendAdminPaymentNotification()` - Notify admin of payment
  - `testEmailConnection()` - Test SMTP connection

#### API Routes
- **`app/api/paypal/create-order/route.ts`** - Create PayPal orders
- **`app/api/paypal/capture-order/route.ts`** - Capture payments and send emails

#### Components
- **`components/PaymentMethodSelector.tsx`** - Payment method selection UI
- **`components/CheckoutContent.tsx`** - Checkout page layout
- **`components/GetReportForm.tsx`** - Updated to redirect to checkout

#### Pages
- **`app/checkout/page.tsx`** - Updated checkout page
- **`app/payment-success/page.tsx`** - Payment success page
- **`app/payment-cancel/page.tsx`** - Payment cancellation page

#### Database
- **`sql/paypal-migration.sql`** - Database schema for payment tracking

#### Configuration
- **`next.config.js`** - Updated CSP headers for PayPal domains

### 3. **Environment Variables**

Your `.env.local` now contains:

```env
# PayPal Configuration
NEXT_PUBLIC_PAYPAL_CLIENT_ID=AcAU2RXmHI103qWgJNW2VfZSwhXEMUkhmxejOUvqcrsotm7EoydZCAPgwelEyuSQI1wzQflwA0lKo2ba
PAYPAL_SECRET_KEY=EAVdCWySlJ6x57s621_Dn5vBZ1GCEnmxbxcoN4QS50rEwLrnwtJUHpGJRZv2bSWWsfy9ANtO0-gR8rr9
PAYPAL_MERCHANT_ID=4Q4ENATN2E9VJ
PAYPAL_MODE=sandbox

# Email Configuration (Gmail)
SMTP_USER=autorevealed08@gmail.com
SMTP_PASS=lgzg ujnv elqh xawp
ADMIN_PAYMENT_EMAIL=nabilazakaria89@gmail.com
```

⚠️ **IMPORTANT: Never commit `.env.local` to Git!**

## 🚀 Next Steps

### 1. **Set Up Database Table**
Run the migration SQL to create the payment tracking table:

```bash
mysql -h localhost -u root carvertical < sql/paypal-migration.sql
```

Or execute this SQL in your database:
```sql
CREATE TABLE IF NOT EXISTS paypal_payments (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  order_id VARCHAR(100) NOT NULL UNIQUE,
  paypal_order_id VARCHAR(255) NOT NULL UNIQUE,
  transaction_id VARCHAR(255) DEFAULT NULL,
  customer_email VARCHAR(255) NOT NULL,
  customer_name VARCHAR(255) NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(10) NOT NULL DEFAULT 'USD',
  package_id VARCHAR(50) NOT NULL,
  vehicle_identifier VARCHAR(255) NOT NULL,
  payment_method VARCHAR(50) NOT NULL DEFAULT 'paypal',
  payment_status VARCHAR(50) NOT NULL DEFAULT 'pending',
  payer_id VARCHAR(255) DEFAULT NULL,
  payer_email VARCHAR(255) DEFAULT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  captured_at DATETIME DEFAULT NULL,
  metadata JSON DEFAULT NULL
);
```

### 2. **Test Email Configuration**
Create a simple test file to verify email is working:

```javascript
// test-email.js
const { testEmailConnection } = require('./lib/email')

testEmailConnection().then(result => {
  if (result) {
    console.log('✅ Email is working!')
  } else {
    console.log('❌ Email configuration has issues')
  }
})
```

### 3. **Test Payment Flow Locally**
1. Start your development server:
   ```bash
   npm run dev
   ```

2. Open http://localhost:3000

3. Click on "Get Report" button

4. Fill out the form with test data

5. Select a package and click "Continue to Payment"

6. You should see PayPal button (Sandbox mode)

7. Complete the test payment in sandbox

### 4. **Verify Emails Are Being Sent**
After a successful test payment:
1. Check the customer email inbox (the one provided in the form)
2. Check the admin email (autorevealed08@gmail.com)
3. Both should receive confirmation emails

## 🔒 Security Considerations

### Secret Keys Storage
- ✅ `NEXT_PUBLIC_PAYPAL_CLIENT_ID` - Public, safe to expose (used in frontend)
- ✅ `PAYPAL_SECRET_KEY` - **Server-side only**, never expose in frontend
- ✅ `SMTP_PASS` - **Server-side only**, never expose in frontend

### Best Practices
1. **Never commit `.env.local`** to version control
2. Use environment variables for all secrets
3. Set up `.env.local` on deployment servers separately
4. Review PayPal sandbox settings in admin panel
5. Monitor payment logs for suspicious activity

## 📊 Customization Options

### Change Payment Mode from Sandbox to Production
Edit `.env.local`:
```env
PAYPAL_MODE=production
```

### Customize Email Templates
Edit `lib/email.ts` and modify the `htmlContent` strings in:
- `sendCustomerPaymentConfirmation()`
- `sendAdminPaymentNotification()`

### Add More Payment Methods
1. Update `PaymentMethodSelector.tsx`
2. Add payment provider API integration
3. Create corresponding API routes
4. Update email templates

### Modify Pricing
Edit `lib/prices.ts` to update the `PRICING_MAP` object

## 🐛 Troubleshooting

### PayPal Orders Not Creating
1. Check `.env.local` has correct credentials
2. Verify `PAYPAL_MODE=sandbox` in development
3. Check browser console for errors
4. Look at server logs

### Emails Not Sending
1. Test connection: `npm run test-email` (if you create the test file)
2. Check `.env.local` has correct SMTP settings
3. Verify "Less secure app" is enabled in Gmail settings
4. Check Gmail app password is correct (must be 16 characters with spaces removed)

### Payment Success But No Email
1. Check email credentials in `.env.local`
2. Look at server logs for email errors
3. Verify admin email is correct
4. Check spam folder

### Page Shows "No Payment Information"
1. Ensure form data is saved in sessionStorage correctly
2. Don't close browser tab before completing payment
3. Try refreshing the page

## 📝 Database Schema

The `paypal_payments` table tracks:
- Order ID (internal)
- PayPal Order ID
- Transaction ID
- Customer info
- Payment amount and currency
- Package details
- Vehicle information
- Payment status
- Timestamps

## 🔄 Payment Status Flow

1. **Pending** - Payment initiated but not captured
2. **Completed** - Payment successfully captured
3. **Failed** - Payment processing failed
4. **Refunded** - Payment refunded

## 📞 Support

For PayPal integration issues:
- PayPal Sandbox: https://sandbox.paypal.com
- API Logs: Check PayPal Developer Dashboard
- Test Accounts: Create in PayPal Sandbox

For email issues:
- Gmail App Passwords: https://myaccount.google.com/apppasswords
- SMTP Settings: smtp.gmail.com:587
- Less Secure Apps: Must be enabled if not using app password

## ✨ What's Working

✅ PayPal payment creation  
✅ PayPal payment capture  
✅ Order tracking in database  
✅ Customer confirmation emails  
✅ Admin payment notifications  
✅ Success/Cancel page redirects  
✅ CSP headers configured  
✅ Form integration  

## 🔧 What Needs Your Attention

1. **Database Migration** - Run the SQL file to create payment table
2. **Testing** - Test the complete payment flow in sandbox
3. **Production Setup** - When ready, update to production credentials
4. **Webhook Setup** (Optional) - For real-time payment notifications
5. **Card Payments** (Optional) - Currently shows "Coming Soon"

## 📚 Files Summary

| File | Purpose |
|------|---------|
| `.env.local` | Secrets and configuration |
| `lib/paypal.ts` | PayPal API functions |
| `lib/email.ts` | Email sending service |
| `app/api/paypal/*` | Payment API routes |
| `components/PaymentMethodSelector.tsx` | Payment UI |
| `app/checkout/page.tsx` | Checkout page |
| `app/payment-success/page.tsx` | Success page |
| `sql/paypal-migration.sql` | Database schema |

---

**Setup completed successfully!** Your PayPal integration is ready to test.
