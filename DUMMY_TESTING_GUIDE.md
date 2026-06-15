# 🧪 Dummy Testing Guide - No PayPal Needed!

## ✅ Setup

آپ کے پاس اب یہ scripts ہیں:

```bash
scripts/insert-dummy-orders.js    # 5 fake orders insert کرتا ہے
scripts/clear-dummy-orders.js     # تمام orders delete کرتا ہے
```

---

## 🚀 STEP 1: Dummy Orders Insert کریں

Terminal میں یہ کمانڈ چلائیں:

```bash
node scripts/insert-dummy-orders.js
```

**Output ملے گی:**

```
✅ Database connected

📝 Inserting dummy orders...

✅ Inserted: ORD-1234567890001
   Email: test1@example.com
   Amount: $29.99
   Status: completed
   Payment: completed

✅ Inserted: ORD-1234567890002
   Email: test2@example.com
   Amount: $49.99
   Status: processing
   Payment: completed

[... more orders ...]

📊 Verification - All Orders:
=====================================
Order: ORD-1234567890005
  Email: test5@example.com
  Amount: $49.99
  Status: pending
  Payment: pending

📈 Order Statistics:
=====================================
Total Orders: 5
Completed: 3
Refunded: 1
Pending: 1
Processing: 1
Total Revenue: $258.95

✅ Dummy orders inserted successfully!
```

---

## 🎯 STEP 2: Dev Server چلائیں

```bash
npm run dev
```

---

## 👨‍💼 STEP 3: Admin Panel میں Verify کریں

### Login کریں:

```
URL: http://localhost:3000/admin/login

Email: vehiclehealthanalysis@gmail.com
Password: Auto12345@
```

### Dashboard دیکھیں:

**Chart دیکھے گا:**
```
📊 Orders Chart
- Order Count: 5
- Total Revenue: $258.95
```

**Sales Table میں:**
```
| Order Number          | Email              | Amount | Status    | Payment    |
|----------------------|-------------------|--------|-----------|------------|
| ORD-1234567890001    | test1@example.com | $29.99 | completed | completed  |
| ORD-1234567890002    | test2@example.com | $49.99 | processing| completed  |
| ORD-1234567890003    | test3@example.com | $99.99 | completed | completed  |
| ORD-1234567890004    | test4@example.com | $29.99 | refunded  | completed  |
| ORD-1234567890005    | test5@example.com | $49.99 | pending   | pending    |
```

---

## 🔧 STEP 4: Filtering Test کریں

Admin Sales Table میں یہ filters test کریں:

### ✅ Status Filter:
```
- Select "completed" → صرف 2 orders (1 and 3)
- Select "refunded" → صرف 1 order (4)
- Select "pending" → صرف 1 order (5)
- Select "processing" → صرف 1 order (2)
```

### ✅ Currency Filter:
```
- All are USD, so "USD" select کریں → 5 orders
```

### ✅ Date Range Filter:
```
- "Last 7 days" → 5 orders (سب آج کے ہیں)
```

---

## 🗑️ STEP 5: Test Data صاف کریں

جب testing ختم کریں:

```bash
node scripts/clear-dummy-orders.js
```

**Output:**

```
✅ Database connected

📊 Orders before deletion: 5

🗑️ Deleted 5 orders from database
🗑️ Deleted 2 payment records

✅ Orders remaining: 0

✅ Database cleaned successfully!
```

---

## 🧪 Complete Testing Workflow

```bash
# 1. Orders insert کریں
node scripts/insert-dummy-orders.js

# 2. Dev server start کریں
npm run dev

# 3. Admin login کریں
# http://localhost:3000/admin/login

# 4. Dashboard میں verify کریں
# Check chart, stats, sales table

# 5. Filters test کریں
# Status, currency, date range

# 6. Testing ختم کریں تو clean کریں
node scripts/clear-dummy-orders.js
```

---

## 📊 Dummy Orders Details

| # | Email | Vehicle | Amount | Status | Payment |
|---|-------|---------|--------|--------|---------|
| 1 | test1@example.com | car | $29.99 | completed | completed |
| 2 | test2@example.com | truck | $49.99 | processing | completed |
| 3 | test3@example.com | car | $99.99 | completed | completed |
| 4 | test4@example.com | car | $29.99 | refunded | completed |
| 5 | test5@example.com | suv | $49.99 | pending | pending |

---

## 🎯 What You Can Test

- ✅ Admin Panel UI
- ✅ Status Filtering
- ✅ Currency Display
- ✅ Date Range Filtering
- ✅ Chart Data Loading
- ✅ Sales Table Sorting
- ✅ Order Details View
- ✅ Revenue Calculations
- ✅ Multiple Status Types

---

## 💡 Tips

**Multiple Test Runs:**

```bash
# Insert
node scripts/insert-dummy-orders.js

# Test

# Clear
node scripts/clear-dummy-orders.js

# Insert again (different data)
node scripts/insert-dummy-orders.js
```

**Each run creates NEW orders with unique timestamps!**

---

## 🆘 Troubleshooting

### Error: "Connection refused"
```
✅ MySQL چل رہا ہے؟
✅ Database "carvertical" موجود ہے؟
✅ .env میں DB credentials صحیح ہیں؟
```

### Error: "Table 'orders' doesn't exist"
```
✅ پہلے یہ run کریں:
mysql -u root carvertical < sql/schema-mysql.sql
```

### No data showing in Admin
```
✅ Admin login ہو گئے ہو؟
✅ Token localStorage میں ہے؟
✅ Orders chart loading ہو رہی ہے? (F12 میں check کریں)
```

---

**Ready to test? Let's go! 🚀**
