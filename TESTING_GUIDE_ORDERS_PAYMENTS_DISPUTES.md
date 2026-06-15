# Order Creation, Payment Processing & Dispute Testing Guide

## ⚠️ CRITICAL SETUP ISSUE: PRODUCTION MODE ENABLED

**Your system is currently running in PayPal PRODUCTION mode**, not sandbox. This means:
- **All test payments will charge REAL money to PayPal accounts**
- **You will incur actual transaction fees**
- **This is NOT recommended for testing**

### Immediate Action Required
Before running ANY tests, change `.env.local`:
```bash
# CURRENT (PRODUCTION - DANGEROUS FOR TESTING):
PAYPAL_MODE=production

# CHANGE TO (SANDBOX - SAFE FOR TESTING):
PAYPAL_MODE=sandbox
```

Then update credentials to use sandbox accounts (see "Setting Up Sandbox" section below).

---

## Table of Contents
1. [Codebase Architecture](#codebase-architecture)
2. [Setting Up Sandbox Testing](#setting-up-sandbox-testing)
3. [How to Create Test Orders](#how-to-create-test-orders)
4. [How to Process Payments](#how-to-process-payments)
5. [Current Dispute Implementation Status](#current-dispute-implementation-status)
6. [Admin Dashboard Status Monitoring](#admin-dashboard-status-monitoring)
7. [Known Issues & Gaps](#known-issues--gaps)
8. [Testing Checklist](#testing-checklist)

---

## Codebase Architecture

### Order Creation Flow
```
┌─ Frontend (Checkout) ──────────────────────────────────────┐
│                                                               │
├─> POST /api/orders/create                                    │
│   └─> insertOrder() → INSERT orders table                    │
│       └─> Returns: orderId, orderNumber                      │
│                                                               │
└─ Database: orders table                                      │
```

**Required Fields for Order Creation:**
- `customer_email` - Customer email address
- `vehicle_type` - "car", "truck", "motorcycle", etc.
- `identification_type` - "vin" or "plate"
- `identification_value` - VIN or plate number
- `package_type` - "basic", "standard", or "premium"
- `currency` - "USD", "EUR", etc.
- `amount` - Price in decimal format
- `country_code` - "US", "CA", etc. (defaults to US)

**Optional Fields:**
- `vin_number` - Full VIN if identification is plate
- `state` - State code for US addresses

---

## Setting Up Sandbox Testing

### Step 1: Get Sandbox Credentials

1. Go to [PayPal Developer Dashboard](https://developer.paypal.com/dashboard/)
2. Login with your PayPal business account
3. Switch to **Sandbox** (top-right corner)
4. Navigate to **Apps & Credentials**
5. Create or select a **Sandbox Merchant Account**
6. Copy the **Client ID** and **Secret** for the sandbox

### Step 2: Update .env.local

```bash
# PayPal Configuration - SANDBOX
PAYPAL_MODE=sandbox
NEXT_PUBLIC_PAYPAL_CLIENT_ID=your-sandbox-client-id
PAYPAL_SECRET_KEY=your-sandbox-secret
PAYPAL_MERCHANT_ID=your-sandbox-merchant-id

# App Base URL (for local testing, use ngrok or localhost)
NEXT_PUBLIC_BASE_URL=http://localhost:3000
# or if using ngrok:
# NEXT_PUBLIC_BASE_URL=https://your-ngrok-url.ngrok-free.dev
```

### Step 3: Create Sandbox Test Accounts

1. In PayPal Sandbox Dashboard, go to **Accounts**
2. Create two test accounts:
   - **Seller Account** (Business)
   - **Buyer Account** (Personal)
3. These virtual accounts have test funds pre-loaded

### Step 4: Restart Development Server

```bash
npm run dev
```

---

## How to Create Test Orders

### Method 1: Using the Checkout UI (Recommended)

1. Go to http://localhost:3000/
2. Click "Report" or "Check Price"
3. Fill in vehicle details:
   - Vehicle Type: "Car"
   - Identification: VIN or Plate number
   - Package: "Basic", "Standard", or "Premium"
4. Click "Checkout"
5. Select "PayPal" as payment method
6. Order is created at this point with status="pending"

### Method 2: Using cURL API

```bash
# 1. Create order first
curl -X POST http://localhost:3000/api/orders/create \
  -H "Content-Type: application/json" \
  -d '{
    "customer_email": "buyer@example.com",
    "vehicle_type": "car",
    "identification_type": "vin",
    "identification_value": "5TDJKRFH4LS123456",
    "package_type": "basic",
    "country_code": "US",
    "currency": "USD",
    "amount": 29.99,
    "paymentProvider": "paypal"
  }'

# Response:
# {
#   "success": true,
#   "orderId": 123,
#   "orderNumber": "ORD-20260502-00123"
# }
```

### Method 3: Database Direct Insert (For Testing Only)

```sql
INSERT INTO orders (
  customer_email,
  vehicle_type,
  identification_type,
  identification_value,
  package_type,
  country_code,
  currency,
  amount,
  payment_status,
  payment_provider,
  status,
  created_at
) VALUES (
  'test@example.com',
  'car',
  'vin',
  '5TDJKRFH4LS123456',
  'basic',
  'US',
  'USD',
  29.99,
  'pending',
  'paypal',
  'pending',
  NOW()
);
```

---

## How to Process Payments

### Step 1: Create PayPal Order

```
Frontend calls: POST /api/paypal/create-order

Request Body:
{
  "packageId": "basic",
  "currency": "USD",
  "customerEmail": "buyer@example.com",
  "vehicleIdentifier": "5TDJKRFH4LS123456",
  "vehicleType": "car",
  "amount": 29.99
}

Response:
{
  "success": true,
  "orderId": "5O190127949133115",      // PayPal Order ID
  "internalOrderId": "ORD-1609459200-abc123def",
  "amount": 29.99,
  "currency": "USD",
  "approvalLink": "https://sandbox.paypal.com/checkoutnow?token=..."
}
```

### Step 2: Approve Payment on PayPal

1. User clicks "Pay with PayPal" button
2. PayPalButtons component redirects to PayPal
3. User logs in with sandbox buyer account
4. User reviews and approves payment
5. Redirects back to checkout with `orderID` in URL

### Step 3: Capture Payment

```
Frontend calls: POST /api/paypal/capture-order

Request Body:
{
  "paypalOrderId": "5O190127949133115",
  "internalOrderId": "ORD-1609459200-abc123def",
  "customerEmail": "buyer@example.com",
  "customerName": "John Doe",
  "amount": 29.99,
  "currency": "USD",
  "packageId": "basic",
  "vehicleIdentifier": "5TDJKRFH4LS123456"
}

Response:
{
  "success": true,
  "message": "Payment captured successfully",
  "orderId": "ORD-1609459200-abc123def",
  "transactionId": "2PG68948RW123456",
  "paymentStatus": "completed"
}
```

### Step 4: Webhook Notification

PayPal sends `POST /api/paypal/webhook` with event:
```json
{
  "event_type": "PAYMENT.CAPTURE.COMPLETED",
  "resource": {
    "id": "2PG68948RW123456",
    "amount": { "value": "29.99", "currency_code": "USD" },
    "status": "COMPLETED",
    "supplementary_data": {
      "related_ids": { "order_id": "ORD-1609459200-abc123def" }
    }
  }
}
```

**Status Flow:**
- Order created: `status: "pending"`, `payment_status: "pending"`
- Payment captured: `status: "pending"`, `payment_status: "completed"`
- Webhook processed: `status: "processing"` (can be updated by webhook handler)

---

## Current Dispute Implementation Status

### ✅ What IS Implemented
1. **Webhook receives dispute events:**
   - `DISPUTE.CREATED` - When customer files dispute
   - `DISPUTE.UPDATED` - When dispute status changes

2. **Webhook event handling:**
   - Extracts `order_id` from webhook payload
   - Sets status to `"dispute"`
   - Attempts to update `payments` table

3. **Webhook also handles refunds:**
   - `PAYMENT.CAPTURE.REFUNDED` → status: "refunded"

### ❌ What IS NOT Implemented

1. **Disputes Table**
   - No database schema for dispute tracking
   - No fields for dispute reason, resolution, evidence
   - Cannot store dispute details from webhook

2. **Dispute Management UI**
   - Admin dashboard cannot view disputes
   - No ability to upload evidence
   - No dispute response/appeal workflow
   - No dispute resolution tracking

3. **Dispute Resolution API**
   - No endpoint to update dispute status
   - No endpoint to upload evidence
   - No endpoint to accept/deny dispute

4. **Refund Management**
   - Can receive webhook, but no tracking UI
   - Cannot initiate refunds from admin
   - No refund reason tracking

---

## Admin Dashboard Status Monitoring

### Current Status Display

**Location:** `/admin/dashboard`

**What's Tracked:**
1. **Order Stats Chart**
   - Endpoint: `GET /api/admin/orders/stats?days=30`
   - Shows: Daily order count, daily revenue
   - Time range: Last 30 days (configurable)
   
2. **Sales Table**
   - Endpoint: `GET /api/admin/sales`
   - Shows: All orders with details
   - Filterable by: date range, status, currency

3. **Order Statuses Displayed:**
   - `pending` - Not yet processed
   - `processing` - Being handled
   - `completed` - Successfully delivered
   - `cancelled` - User cancelled
   - `refunded` - Money returned

**Authentication:** Requires admin token (set via admin login)

### How to Monitor in Dashboard

1. Login to admin: `/admin/login`
   - Email: `autorevealed.com@gmail.com`
   - Password: `Auto12345@`

2. Go to Dashboard: `/admin/dashboard`

3. View order stats chart and sales table

4. Check status for specific orders:
   - `payment_status` - Payment state (pending/completed/failed)
   - `status` - Overall order state

### ⚠️ What's Missing from Dashboard
- Dispute status display
- Dispute count badges
- Dispute management buttons
- Refund status tracking
- Payment failure reasons
- Chargeback tracking

---

## Known Issues & Gaps

### Issue #1: Schema/Implementation Mismatch
**Impact:** Medium
**Status:** Affects payment record creation

When capturing PayPal orders, the code tries to insert fields not in the schema:

```javascript
// Code attempts to insert these fields:
"paypal_order_id", "transaction_id", "customer_email", 
"customer_name", "package_id", "vehicle_identifier", "payment_method"

// But payments table only has:
"order_id", "provider", "provider_payment_id", "amount", 
"currency", "status", "created_at"
```

**Fix Required:**
Update `payments` table schema to include missing fields or update insert query.

### Issue #2: Webhook Signature Verification Disabled
**Impact:** Critical for Production
**Status:** Currently stubbed with "skip verification" comment

```javascript
// Current code in webhook/route.ts:
async function verifyWebhookSignature(...) {
  try {
    // For development, you can skip verification
    console.log('✅ Webhook signature verified')
    return true
  }
}
```

**Fix Required (for production):**
Implement proper PayPal signature verification using certificate validation.

### Issue #3: No Dispute Tracking
**Impact:** High
**Status:** Webhook receives events but cannot store them

Disputes are received but not persisted with details. Would need:
- Disputes table
- Dispute admin UI
- Evidence upload system
- Resolution workflow

### Issue #4: Hardcoded ngrok URL
**Impact:** Medium
**Status:** Dev only, but will break webhooks

Current `.env.local` has:
```
NEXT_PUBLIC_BASE_URL=https://nonglandered-irrefrangibly-caridad.ngrok-free.dev
```

ngrok URLs change when service restarts. Need:
- Dynamic URL configuration
- Or permanent domain setup

---

## Testing Checklist

### Pre-Test Setup
- [ ] Switch PayPal mode to **sandbox** in `.env.local`
- [ ] Add sandbox credentials to `.env.local`
- [ ] Create sandbox buyer and seller test accounts
- [ ] Restart dev server: `npm run dev`
- [ ] Verify database is running and has `orders` table
- [ ] Test admin login works

### Order Creation Tests
- [ ] Create order via UI checkout flow
- [ ] Create order via API curl request
- [ ] Verify order appears in database with correct fields
- [ ] Verify order_number is auto-generated in correct format
- [ ] Verify payment_status is set to "pending"
- [ ] Verify status is set to "pending"

### Payment Processing Tests
- [ ] Click "Pay with PayPal" button
- [ ] PayPal redirect works
- [ ] Sandbox buyer login works
- [ ] Payment approval page displays
- [ ] Approve payment in sandbox
- [ ] Capture request succeeds
- [ ] Verify response contains transaction ID
- [ ] Check database: payment_status changed to "completed"
- [ ] Check webhook: was it received by server?
- [ ] Verify confirmation email was sent (check SMTP logs)

### Status Display Tests
- [ ] Login to admin dashboard
- [ ] Verify order appears in sales table
- [ ] Verify payment status shows "completed"
- [ ] Check order stats chart includes new order
- [ ] Test filtering by date range
- [ ] Test filtering by status
- [ ] Test filtering by currency

### Refund Tests
- [ ] In PayPal sandbox, issue full refund on completed order
- [ ] Verify webhook receives `PAYMENT.CAPTURE.REFUNDED` event
- [ ] Check database: status changed to "refunded"
- [ ] Verify admin dashboard shows refunded status
- [ ] Check refund email was sent

### Dispute/Chargeback Tests
- [ ] In PayPal sandbox, file dispute on transaction
- [ ] Verify webhook receives `DISPUTE.CREATED` event
- [ ] **Expected:** Status updates to "dispute" in database
- [ ] **Actual:** Check what happens (likely incomplete)
- [ ] Try to view dispute in admin dashboard
- [ ] **Expected:** Dispute details and management options
- [ ] **Actual:** Likely not implemented yet

### Error Handling Tests
- [ ] Attempt to process payment with invalid PayPal order
- [ ] Check error response and logging
- [ ] Test with network disconnection during payment
- [ ] Test with malformed webhook event
- [ ] Verify 200 response returned to PayPal even on error

---

## Quick Start for Testing

### 1. Setup Sandbox (5 min)
```bash
# Get credentials from PayPal Dashboard (Sandbox)
# Edit .env.local
PAYPAL_MODE=sandbox
NEXT_PUBLIC_PAYPAL_CLIENT_ID=<your-sandbox-client-id>
PAYPAL_SECRET_KEY=<your-sandbox-secret>

npm run dev
```

### 2. Create Test Order (2 min)
```bash
curl -X POST http://localhost:3000/api/orders/create \
  -H "Content-Type: application/json" \
  -d '{
    "customer_email": "test@example.com",
    "vehicle_type": "car",
    "identification_type": "vin",
    "identification_value": "TESTVIN123456789",
    "package_type": "basic",
    "currency": "USD",
    "amount": 29.99,
    "paymentProvider": "paypal"
  }'
```

### 3. Process Test Payment (5 min)
- Go to http://localhost:3000/checkout
- Fill in vehicle details
- Click "Pay with PayPal"
- Login with sandbox buyer account
- Approve payment

### 4. Monitor Dashboard (2 min)
- Login: http://localhost:3000/admin/login
- View: http://localhost:3000/admin/dashboard
- Check order and payment status

### 5. View Database (1 min)
```sql
SELECT id, order_number, payment_status, status, created_at 
FROM orders 
ORDER BY created_at DESC 
LIMIT 5;
```

---

## Additional Resources

- [PayPal REST API Docs](https://developer.paypal.com/docs/api/overview/)
- [Sandbox Testing Guide](https://developer.paypal.com/docs/development/sandbox/get-started/)
- [Webhook Events Reference](https://developer.paypal.com/docs/api-basics/notifications/webhooks/event-types/)
- [Disputes API](https://developer.paypal.com/docs/api/disputes/v1/)

---

## Next Steps - Recommended Improvements

1. **Immediate (Critical):**
   - [ ] Switch to sandbox mode for testing
   - [ ] Fix database schema/insert mismatch
   - [ ] Implement webhook signature verification

2. **Short-term (Before production):**
   - [ ] Add disputes table to schema
   - [ ] Implement dispute admin UI
   - [ ] Add refund tracking display
   - [ ] Test all webhook events

3. **Medium-term (Production-ready):**
   - [ ] Implement dispute management API
   - [ ] Add evidence upload system
   - [ ] Create dispute resolution workflow
   - [ ] Add comprehensive error handling
   - [ ] Setup permanent domain/ngrok fallback
