# 🧪 Order, Payment & Dispute Testing Guide

## ✅ SETUP COMPLETE
- ✅ PayPal Mode: **SANDBOX** (اب اصل پیسے نہیں لگیں گے)
- ✅ Admin Panel Ready
- ✅ Database Connected
- ✅ Webhooks Configured

---

## 📋 TEST SCENARIO

### لیول 1: ایک سادہ آرڈر بنائیں

#### Step 1: ہوم پیج سے شروع کریں
```
http://localhost:3000
```

#### Step 2: "Get Vehicle Report" پر کلک کریں
```
- Vehicle Type: Select "Car"
- Identification: Select "VIN"
- VIN: کوئی ٹیسٹ VIN ڈالیں (مثال: 5TDJKRFH4LS123456)
- Package: Select "Basic" ($29.99)
```

#### Step 3: ورتمان ہوگی
- آپ کو checkout page پر لے جایا جائے گا
- Order number بنے گا: `ORD-YYYYMMDD-#####`

---

### لیول 2: PayPal سے Payment کریں

#### Step 1: "Pay with PayPal" بٹن پر کلک کریں
```
یہ PayPal کے sandbox پیج پر لے جائے گا
```

#### Step 2: Sandbox Buyer Account سے لاگ ان کریں
```
Email: sb-xxxxxxx@personal.example.com
(یہ آپ کو PayPal Developer Dashboard میں ملے گا)
```

#### Step 3: Payment Approve کریں
```
"Approve and Continue" بٹن دبائیں
```

#### Step 4: Confirmation Page پر واپس آیں
```
✅ Order مکمل ہو گا
✅ Payment "completed" status حاصل کرے گی
✅ Confirmation email ملے گی
```

---

### لیول 3: Admin Panel میں دیکھیں

#### Step 1: Admin Login کریں
```
URL: http://localhost:3000/admin/login
Email: autorevealed.com@gmail.com
Password: Auto12345@
```

#### Step 2: Dashboard پر جائیں
```
Admin Dashboard میں یہ دیکھیں:

1. 📊 Order Stats Chart
   - آپ کا آج کا order آنا چاہیے
   - Count: 1
   - Total Amount: $29.99

2. 📋 Sales Table
   - فلٹر: "Last 30 days"
   - آپ کا order یہاں نظر آنا چاہیے
   - Status: "completed"
   - Payment Status: "completed"
```

#### Step 3: Order Details دیکھیں
```
Sales table میں اپنے order پر کلک کریں:
- Order Number: ORD-YYYYMMDD-#####
- Customer Email: آپ کی email
- Amount: $29.99
- Payment Status: ✅ completed
- Order Status: ✅ completed (یا processing)
```

---

### لیول 4: Dispute/Refund Test کریں

#### Step 1: PayPal Sandbox میں Refund دیں
```
1. https://sandbox.paypal.com پر جائیں
2. Seller account سے لاگ ان کریں
3. Transactions میں پائیں اپنا payment
4. "Refund" بٹن دبائیں
```

#### Step 2: Webhook سے Admin Panel Update ہوگا
```
⏱️ 2-5 سیکنڈ میں webhook آئے گا

Admin Panel میں:
- Order Status بدلے گی: "refunded"
- یا Database میں record save ہوگی
```

#### Step 3: Dispute File کریں (Advanced)
```
PayPal sandbox میں:
1. Transaction پر کلک کریں
2. "Dispute transaction" بٹن دیکھیں
3. Reason select کریں (Product not received, etc.)
4. Dispute file کریں
```

---

## 📊 Expected Statuses in Admin Panel

### Payment Status Values:
```
pending    → Payment ابھی pending ہے
completed  → ✅ PayPal سے پیسے آ گئے
failed     → ❌ Payment fail ہو گیا
```

### Order Status Values:
```
pending      → Order بنا ہے لیکن payment ہو رہی ہے
processing   → Payment ہو گیا، رپورٹ تیار ہو رہی ہے
completed    → سب کچھ مکمل ہو گیا
refunded     → 💰 Refund دیا جا چکا ہے
dispute      → ⚠️ Dispute filed ہو گیا
cancelled    → ❌ Order منسوخ ہو گیا
```

---

## 🔍 Debugging: Agر Status Update نہ ہو

### Terminal میں Logs دیکھیں:

#### Server-Side Logs:
```
[STATS API] Request received
[STATS API] Token present: true
[STATS API] Fetching stats for 30 days
[DB] getOrdersStats: Query successful, returned X rows
```

#### Client-Side Logs (F12 میں):
```
[CLIENT] loadOrderStats: Fetching with days= 30
[CLIENT] loadOrderStats: Response status: 200
[CLIENT] loadOrderStats: Parsed data: {...}
[CLIENT] loadOrderStats: Setting stats with X records
```

### Webhook Logs:
```
[WEBHOOK] Received PayPal event
[WEBHOOK] Event type: CHECKOUT.ORDER.COMPLETED
[WEBHOOK] Order updated: order_id=123, status=completed
```

---

## 🧪 Test Cases Checklist

- [ ] Order بنا سکتے ہو checkout سے
- [ ] PayPal approve ہو جاتا ہے sandbox میں
- [ ] Payment "completed" دکھاتی ہے
- [ ] Admin panel میں order نظر آتا ہے
- [ ] Admin chart میں amount add ہوتی ہے
- [ ] Sales table میں status "completed" ہے
- [ ] Refund دینے سے status "refunded" ہوتی ہے
- [ ] Dispute file کرنے سے status "dispute" ہوتی ہے
- [ ] Emails آتی ہیں (check spam folder)

---

## 🆘 Common Issues

### Issue 1: "Payment Failed"
```
❌ PayPal connection ہو رہا ہے?
✅ .env.local میں PAYPAL_MODE=sandbox ہے؟
✅ Sandbox credentials صحیح ہیں؟
```

### Issue 2: Admin Panel میں Order نہیں دیخا
```
❌ Admin login ہو گئے ہو؟
✅ Token localStorage میں ہے؟
✅ orders table میں data ہے؟
```

### Issue 3: Status Update نہیں ہو رہی
```
❌ Webhook URL صحیح ہے؟
✅ ngrok running ہے؟
✅ Database connection OK ہے؟
✅ Webhook signature verification off ہے؟
```

---

## 🔗 Important URLs

| Page | URL |
|------|-----|
| Home | http://localhost:3000 |
| Checkout | http://localhost:3000/checkout |
| Admin Login | http://localhost:3000/admin/login |
| Admin Dashboard | http://localhost:3000/admin/dashboard |
| PayPal Sandbox | https://sandbox.paypal.com |
| PayPal Developer | https://developer.paypal.com |

---

## 📝 Test Data Template

```
Customer Email: test@example.com
Vehicle Type: Car
Identification Type: VIN
Identification Value: 5TDJKRFH4LS123456
Package: Basic
Amount: $29.99
Currency: USD
```

---

## 🔐 Sandbox Credentials

### Buyer Account:
```
Email: sb-[unique_id]@personal.example.com
(Check PayPal Developer Dashboard → Accounts)
```

### Seller Account:
```
Email: [your merchant email]@business.example.com
(Check PayPal Developer Dashboard → Accounts)
```

> 💡 تمام sandbox buyers/sellers PayPal Developer Dashboard میں بنائے جاتے ہیں

---

**Happy Testing! 🎉**
