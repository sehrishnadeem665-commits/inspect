# Fix "Internal Server Error" on Order Creation

## 🔍 What's Happening

When you try to create an order (submit the "Get Report Form"), the server is returning a 500 error but not showing what caused it.

---

## ✅ Quick Fixes

### **1. Check Database Connection**

The most common cause is the database connection failing.

**Check your logs:**
```bash
npm run dev
# Look for this message when starting:
✅ Database connection successful
# or
❌ Database connection failed: Error message here
```

**If you see ❌, fix your database:**

**For Local:**
```bash
# Make sure MySQL is running
sudo service mysql start

# Verify database exists
mysql -u root -p -e "SHOW DATABASES;"

# If u319625572_trueautocheck doesn't exist:
mysql -u root -p
CREATE DATABASE u319625572_trueautocheck;
EXIT;

# Import schema
mysql -u root -p u319625572_trueautocheck < sql/schema-mysql.sql

# Restart dev server
npm run dev
```

**For Hostinger Live:**
1. Check `.env.production` has correct DB_HOST
2. Verify database exists on Hostinger (phpMyAdmin)
3. Verify schema was imported

---

### **2. Check API Response in Browser**

1. Open **Developer Tools** (F12)
2. Go to **Network** tab
3. Click **Get Report** button to submit form
4. Look for `/api/orders/create` request
5. Click on it and check **Response** tab
6. You should see the actual error message now

---

### **3. Check Server Logs**

The improved error handling will now show what's failing:

**Look for messages like:**
```
📝 Creating order with data: { customer_email, vehicle_type, ... }
✓ All required fields present, inserting order...
✅ Order created successfully: { orderId, orderNumber }
```

**Or if it fails:**
```
❌ Missing required fields: { ... }
❌ Error creating order: [specific error message]
```

---

## 🐛 Common Issues & Solutions

### **Error: "Access denied for user 'root'@'localhost'"**
```
Cause: Database credentials mismatch
Fix: Update .env.local
  DB_USER=root (or your actual MySQL user)
  DB_PASSWORD= (your actual password)
```

### **Error: "Unknown database 'u319625572_trueautocheck'"**
```
Cause: Database doesn't exist
Fix: 
  mysql -u root -p
  CREATE DATABASE u319625572_trueautocheck;
  EXIT;
  mysql -u root -p u319625572_trueautocheck < sql/schema-mysql.sql
```

### **Error: "Table 'u319625572_trueautocheck.orders' doesn't exist"**
```
Cause: Schema wasn't imported
Fix:
  mysql -u root -p u319625572_trueautocheck < sql/schema-mysql.sql
```

### **Error: "NEXT_PUBLIC_BASE_URL is required"**
```
Cause: Email sending needs the base URL
Fix: In .env.local or .env.production
  NEXT_PUBLIC_BASE_URL=http://localhost:3000 (local)
  NEXT_PUBLIC_BASE_URL=https://yourdomain.com (live)
```

---

## 📋 Verification Checklist

- [ ] MySQL is running
- [ ] Database `u319625572_trueautocheck` exists
- [ ] Schema is imported (has `orders` table)
- [ ] `.env.local` has correct `DB_HOST`, `DB_USER`, `DB_PASSWORD`
- [ ] Server logs show "✅ Database connection successful"
- [ ] Test form submission and check Network tab for `/api/orders/create` response
- [ ] Error message is clear and specific

---

## 🔧 Testing Locally

1. **Fill out the form:**
   - Email: test@example.com
   - Vehicle Type: Car
   - VIN or Plate Number
   - Select Package & Country
   - Click "Get Report"

2. **Check the console output** (where you ran `npm run dev`):
   - Should see: `📝 Creating order with data: { ... }`
   - Should see: `✅ Order created successfully: { orderId, orderNumber }`

3. **Check browser Network tab:**
   - Find `/api/orders/create` request
   - Status should be `200`
   - Response should show: `{ success: true, orderId, orderNumber }`

---

## 🚀 If Everything Looks Good

The form should:
1. ✅ Create the order in the database
2. ✅ Send confirmation emails
3. ✅ Redirect to checkout page: `/checkout/{orderId}`

---

## ❓ Still Failing?

Provide:
1. **Exact error message** from browser Network tab (Response section)
2. **Server logs output** (from where you ran `npm run dev`)
3. **Your environment** (local or Hostinger?)
4. **Database verification:**
   ```bash
   mysql -u root -p u319625572_trueautocheck -e "SHOW TABLES;"
   ```
