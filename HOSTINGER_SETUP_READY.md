# Hostinger Backend Configuration - READY TO DEPLOY

## Your Database Credentials (Configured):
```
DB_HOST=localhost
DB_USER=trueautocheck
DB_PASSWORD=Trueautocheck321@
DB_NAME=u319625572_trueautocheck
DB_PORT=3306
```

## ✅ NEXT STEPS - CRITICAL FOR BACKEND TO WORK:

### Option 1: Set Environment Variables via Hostinger Control Panel (RECOMMENDED)
1. Log into **Hostinger Control Panel**
2. Go to **Node.js** → Your Application
3. Click **Edit** → **Environment Variables** 
4. Add these variables:

```
DB_HOST=localhost
DB_USER=trueautocheck
DB_PASSWORD=Trueautocheck321@
DB_NAME=u319625572_trueautocheck
DB_PORT=3306
NEXT_PUBLIC_BASE_URL=https://yourdomain.com
ADMIN_EMAIL=sehrishnadeem39@gmail.com
```

5. Click **Save**
6. **Restart Node.js Application** (Important!)

### Option 2: Upload .env.local via FTP/File Manager
1. Go to **Hostinger File Manager** or use FTP
2. Navigate to your project root directory
3. Upload this file as `.env.local`:

```
DB_HOST=localhost
DB_USER=trueautocheck
DB_PASSWORD=Trueautocheck321@
DB_NAME=u319625572_trueautocheck
DB_PORT=3306
NEXT_PUBLIC_BASE_URL=https://yourdomain.com
ADMIN_EMAIL=sehrishnadeem39@gmail.com
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=info@vehicleinspectify.com
SMTP_PASS=SehmanJatvoi321@
EMAIL_FROM="Vehicle Reports <info@vehicleinspectify.com>"
RESEND_API_KEY=re_RVpNuQ2S_NuZrfm7nDDpR4fmp21pVYVPc
```

4. Restart Node.js Application

---

## 🧪 Test If Backend is Fixed:

Visit this URL (replace with your actual domain):
```
https://yourdomain.com/api/test-db
```

### ✅ Success Response:
```json
{
  "message": "Database connected successfully!",
  "result": [{"result": 2}],
  "timestamp": "2026-01-16T..."
}
```

### ❌ If Still Showing Error:
1. Check **Node.js Logs** in Hostinger
2. Verify credentials are exactly correct
3. Restart application again
4. Clear browser cache and retry

---

## All API Endpoints Now Available:

After database connects, test these endpoints:
- `GET /api/test-db` - Database test
- `POST /api/contact` - Contact form
- `GET /api/admin/orders` - View orders
- `POST /api/reviews` - Submit reviews

---

## Database Tables

Ensure these tables exist in Hostinger MySQL (u319625572_trueautocheck):
- `contact_messages`
- `orders`
- `reviews`
- `admin_users`

If missing, run the SQL file: `sql/schema-mysql.sql` in phpMyAdmin

