# Email Flow Configuration - May 2026

## Complete Email Sequence

### 1️⃣ **Step 1: User Fills Get Report Form**
   - **Trigger:** User selects package and enters vehicle/email info
   - **Form Location:** `/pricing` → GetReportForm modal
   - **What Happens:** 
     - Form data is submitted to `/api/report-form-submission`
     - ✉️ **Email sent to:** `vehiclehealthanalysis@gmail.com`
     - **Email content:** Full form data (vehicle type, VIN/plate, package, amount)

---

### 2️⃣ **Step 2: User Proceeds to Payment**
   - **Action:** After form submission, user is redirected to `/checkout`
   - **What Happens:**
     - Form data is stored in `sessionStorage`
     - User sees payment methods (PayPal, Card)
     - User selects PayPal

---

### 3️⃣ **Step 3: User Completes Payment**
   - **Trigger:** User approves payment on PayPal
   - **Backend Process:**
     - PayPal order is captured
     - Payment record is saved to database
     - Two confirmation emails are sent:

#### 📧 **Email #1 - Customer Order Confirmation**
   - **Sent to:** `vehiclehealthanalysis@gmail.com` (customer's email)
   - **From:** `vehiclehealthanalysis@gmail.com`
   - **Content:**
     - Order ID
     - Amount paid
     - Package details
     - Vehicle info
     - Payment method
   - **Function:** `sendCustomerPaymentConfirmation()`

#### 📧 **Email #2 - Admin Payment Notification**
   - **Sent to:** `vehiclehealthanalysis@gmail.com` (admin)
   - **From:** `vehiclehealthanalysis@gmail.com`
   - **Content:**
     - Customer email
     - Order details
     - Transaction ID
     - Payment status
     - Instructions for next steps
   - **Function:** `sendAdminPaymentNotification()`

---

## Email Configuration

| Setting | Value |
|---------|-------|
| **SMTP Server** | `smtp.gmail.com` |
| **SMTP Port** | `587` |
| **SMTP User** | `vehiclehealthanalysis@gmail.com` |
| **Email From** | `True Inspectify <vehiclehealthanalysis@gmail.com>` |
| **Admin Email** | `vehiclehealthanalysis@gmail.com` |
| **App Password** | `lgzg ujnv elqh xawp` |

---

## Files Modified

1. ✅ **New:** `/app/api/report-form-submission/route.ts`
   - Handles form submission
   - Sends email to admin with form data
   - Optionally saves to database

2. ✅ **Modified:** `/components/GetReportForm.tsx`
   - Calls report submission API before redirecting to checkout

3. ✅ **Existing:** `/app/api/paypal/capture-order/route.ts`
   - Sends payment confirmation emails (no changes needed)

4. ✅ **Existing:** `/lib/email.ts`
   - `sendCustomerPaymentConfirmation()`
   - `sendAdminPaymentNotification()`

---

## Email Timing

```
User submits form
    ↓
1️⃣ Form data email sent to admin
    ↓
User redirected to checkout
    ↓
User pays
    ↓
2️⃣ Payment confirmation email sent to customer
    ↓
3️⃣ Payment notification email sent to admin
```

---

## Testing

To verify the email flow:

1. Go to `/pricing`
2. Select a package (e.g., "Basic Report")
3. Fill in the form:
   - Vehicle type: Car
   - VIN: 1234567890123456
   - Email: test@example.com
4. Click "Continue to Payment"
5. ✅ Check if you received the form submission email at `vehiclehealthanalysis@gmail.com`
6. Complete payment via PayPal
7. ✅ Check if you received payment confirmation emails

---

## Troubleshooting

If emails are not being sent:

1. Check SMTP credentials in `.env.local`
2. Verify Gmail app password is correct
3. Check console logs for errors:
   - `npm run dev` and look for email sending logs
   - Each email shows `✅` or `❌` in console

4. Run diagnostic:
   ```bash
   node scripts/test-smtp.js
   ```

---

## What You'll Receive

### 📧 Email #1 - Report Submission (from GetReportForm)
```
To: autorevealed.com@gmail.com
Subject: New Entry - Basic Report

Customer Email: user@example.com
Vehicle Type: Car
VIN / License Plate: 1234567890123456
Package: Basic Report
Amount: USD 29.99
Submitted At: [timestamp]
```

### 📧 Email #2 - Order Confirmation (from Payment)
```
To: user@example.com
Subject: Payment Confirmed - True Inspectify Order #ORD-123456

Order ID: ORD-123456
Amount: USD 29.99
Package: Basic Report
Vehicle: 1234567890123456
Status: Payment completed
```

### 📧 Email #3 - Admin Payment Notification (from Payment)
```
To: autorevealed.com@gmail.com
Subject: Payment Notification - Order #ORD-123456

Customer: user@example.com
Amount: USD 29.99
Package: Basic Report
Transaction ID: [PayPal ID]
Status: COMPLETED
```
