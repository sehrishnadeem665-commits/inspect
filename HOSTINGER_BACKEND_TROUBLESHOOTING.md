# Hostinger Backend Troubleshooting Guide

## ⚠️ Internal Server Error - Diagnosis & Solutions

Your backend is showing "Internal Server Error" because environment variables aren't set on Hostinger. Here's how to fix it:

---

## 🔧 Step 1: Check Environment Variables on Hostinger

**Location:** Hostinger Control Panel → Node.js → Environment Variables

### Required Variables (CRITICAL):
```env
# Database
DB_HOST=your-database-host
DB_USER=your-database-username
DB_PASSWORD=your-database-password
DB_NAME=your-database-name
DB_PORT=3306

# Base URL
NEXT_PUBLIC_BASE_URL=https://yourdomain.com

# Email (Optional but recommended)
ADMIN_EMAIL=your-email@gmail.com
RESEND_API_KEY=your-resend-api-key (optional)
```

### Steps:
1. Go to **Hostinger Control Panel**
2. Click **Node.js** (or **Application** section)
3. Find your Node.js application
4. Click **Edit** → **Environment Variables**
5. Add all required variables above
6. **Save** and **Restart Application**

---

## 🧪 Step 2: Test Database Connection

Visit this URL to test if database is connected:
```
https://yourdomain.com/api/test-db
```

**Expected Response (Success):**
```json
{
  "message": "Database connected successfully!",
  "result": [{ "result": 2 }],
  "timestamp": "2026-01-16T..."
}
```

**Error Response (Problem):**
```json
{
  "message": "Database connection failed",
  "error": "Access denied for user 'username'@'host'",
  "timestamp": "2026-01-16T..."
}
```

---

## 🐛 Common Backend Errors & Fixes

### Error 1: "Database connection failed - Access denied"
**Cause:** Wrong DB_USER or DB_PASSWORD
**Fix:**
1. Verify credentials in Hostinger → Database section
2. Copy exact username and password
3. Update Environment Variables
4. Restart application

### Error 2: "Error: getaddrinfo ENOTFOUND"
**Cause:** Wrong DB_HOST or database not accessible
**Fix:**
1. Check Hostinger → Databases → Your DB
2. Find correct host (usually: `yourusername_dbname.mysql.db`)
3. Ensure "Remote MySQL Servers" is enabled if needed

### Error 3: "connect ECONNREFUSED 127.0.0.1:3306"
**Cause:** Database port wrong or database offline
**Fix:**
1. Verify DB_PORT=3306 (default)
2. Restart MySQL in Hostinger Control Panel
3. Check if database service is running

### Error 4: "Internal Server Error" on /api/contact or other routes
**Cause:** Missing environment variables or API misconfiguration
**Fix:**
1. Test database first: `/api/test-db`
2. Check Application logs in Hostinger
3. Verify all required ENV variables are set
4. Restart Node.js application

---

## 📋 Checklist Before Going Live

- [ ] Environment variables set on Hostinger
- [ ] `/api/test-db` returns success
- [ ] Database credentials are correct
- [ ] Application restarted after ENV changes
- [ ] NEXT_PUBLIC_BASE_URL matches your domain
- [ ] Database tables are created (contact, orders, reviews, etc.)
- [ ] File permissions correct (755 for folders, 644 for files)

---

## 🔍 How to Check Hostinger Application Logs

1. **Hostinger Control Panel** → **Node.js** → Your app
2. Click **View Logs** or **Logs** tab
3. Look for error messages about:
   - Database connections
   - Missing environment variables
   - File not found errors

---

## 🚀 Step 3: Verify Application is Running

```bash
# SSH into your Hostinger server and check:
pm2 status
pm2 logs

# Or check via Node.js panel in Hostinger Control Panel
# Should show: "Running" (green status)
```

---

## 🔌 Database Connection Test Endpoints

### Test Database
```
GET https://yourdomain.com/api/test-db
```

### Test Orders API
```
GET https://yourdomain.com/api/admin/orders
```

### Test Contact Form
```
POST https://yourdomain.com/api/contact
Body: { "name": "Test", "email": "test@test.com", "subject": "Test", "message": "Test" }
```

---

## 📝 Database Tables Required

Ensure these tables exist in your Hostinger database:
- `contact_messages`
- `orders`
- `reviews`
- `email_failures` (optional, for logging)
- `admin_users`
- `settings`

If missing, run the SQL schema:
```sql
-- File location: sql/schema-mysql.sql
-- In Hostinger: Go to Database → phpMyAdmin → Run SQL file
```

---

## ✅ Success Indicators

Once fixed, you should see:
1. ✅ `/api/test-db` returns success
2. ✅ Contact form works
3. ✅ Orders are created
4. ✅ No "Internal Server Error"
5. ✅ Emails send (if SMTP configured)

---

## 🆘 Still Not Working?

1. **Check logs:** Hostinger → Logs
2. **Verify ENV vars:** All 5 required variables present
3. **Test database:** `/api/test-db` endpoint
4. **Restart app:** Hostinger → Node.js → Restart
5. **Clear cache:** Delete `.next` folder if needed
6. **Check file permissions:** SSH into server, run `chmod -R 755 app lib`

---

## 📞 Need Help?

Document these when asking for support:
- `/api/test-db` response
- Hostinger application logs (last 50 lines)
- Database credentials (masked password)
- NEXT_PUBLIC_BASE_URL value
- Application status (running/stopped)

