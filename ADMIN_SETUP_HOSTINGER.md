# Admin Panel Setup for Hostinger Live Server

## ✅ Complete Setup Guide

Follow these steps to get your admin panel working on Hostinger.

---

## **Step 1: Database Setup on Hostinger**

### 1.1 Access Hostinger Control Panel
1. Log in to **Hostinger Control Panel**
2. Go to **Databases** → **MySQL Databases**
3. Find your database: `u319625572_trueautocheck`
4. Note the **Host** (usually like `mysql.u319625572.hostinger.com`)

### 1.2 Import Database Schema
1. Go to **phpMyAdmin** in Hostinger
2. Select your database `u319625572_trueautocheck`
3. Click **Import** tab
4. Upload `sql/schema-mysql.sql` from your project
5. Click **Import**

**Alternative (via SSH):**
```bash
ssh user@hostinger
mysql -h DB_HOST -u DB_USER -p DB_NAME < sql/schema-mysql.sql
```

### 1.3 Verify Tables Created
```sql
USE u319625572_trueautocheck;
SHOW TABLES;
-- Should show: users, orders, reviews, contact_submissions, etc.
```

---

## **Step 2: Environment Variables on Hostinger**

### 2.1 Create `.env.production` file

In your Hostinger application directory, create `.env.production`:

```env
# Database Configuration
DB_HOST=mysql.u319625572.hostinger.com
DB_PORT=3306
DB_USER=u319625572_trueautocheck
DB_PASSWORD=Trueautocheck321@
DB_NAME=u319625572_trueautocheck

# Admin Login Credentials (Test Mode)
TEST_ADMIN_EMAIL=admin@trueautocheck.com
TEST_ADMIN_PASS=Admin123@Secure

# Admin notification
ADMIN_EMAIL=sehrishnadeem39@gmail.com

# SMTP Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=info@vehicleinspectify.com
SMTP_PASS=SehmanJatvoi321@
EMAIL_FROM="Vehicle Reports <info@vehicleinspectify.com>"

# API Keys
RESEND_API_KEY=re_RVpNuQ2S_NuZrfm7nDDpR4fmp21pVYVPc
AUTO_DEV_API_KEY=sk_ad_xVqOSaxxhix_2EKxUfQi4rtZ

# Site Configuration
NEXT_PUBLIC_BASE_URL=https://yourdomain.com
```

**Replace `mysql.u319625572.hostinger.com` with your actual Hostinger MySQL host!**

---

## **Step 3: Deploy Application**

### 3.1 Push Code to Hostinger
```bash
git add .
git commit -m "Update admin setup for Hostinger"
git push
```

### 3.2 Build and Start on Hostinger
1. Go to **Node.js Apps** in Hostinger Control Panel
2. Click **Manage**
3. Click **Install Dependencies** (npm install)
4. Set **Startup Command**: `npm run start`
5. Click **Deploy**

---

## **Step 4: Test Admin Login**

### 4.1 Access Admin Panel
```
https://yourdomain.com/admin/login
```

### 4.2 Test Login Credentials
- **Username:** `admin@trueautocheck.com`
- **Password:** `Admin123@Secure`

These are **environment variable test credentials** - no database needed!

### 4.3 Check Logs
If login fails:
1. Go to **Node.js Apps** → **Manage** → **Logs**
2. Look for messages starting with 🔐, ✅, or ❌
3. Share the error message if it fails

---

## **Step 5: Create Database Admin User (Optional)**

If you want database-based login instead of test credentials:

### 5.1 Via phpMyAdmin
1. Open **phpMyAdmin** in Hostinger
2. Select your database
3. Click **SQL** tab
4. Paste this:

```sql
INSERT INTO users (email, name, password_hash, role, created_at) 
VALUES (
  'your-email@example.com',
  'Admin User',
  '$2y$10$salt.hash.here',
  'admin',
  NOW()
);
```

### 5.2 Via Script (Better Way)
Create `scripts/create-admin.js`:

```javascript
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function createAdmin() {
  const email = await question('Admin email: ');
  const password = await question('Admin password: ');

  const pool = mysql.createPool({
    host: process.env.DB_HOST || 'mysql.u319625572.hostinger.com',
    user: process.env.DB_USER || 'u319625572_trueautocheck',
    password: process.env.DB_PASSWORD || 'Trueautocheck321@',
    database: process.env.DB_NAME || 'u319625572_trueautocheck',
  });

  try {
    const hash = bcrypt.hashSync(password, 10);
    const conn = await pool.getConnection();
    await conn.execute(
      'INSERT INTO users (email, password_hash, role, created_at) VALUES (?, ?, ?, NOW())',
      [email, hash, 'admin']
    );
    console.log('✅ Admin user created:', email);
    await conn.end();
  } catch (err) {
    console.error('❌ Error:', err.message);
  } finally {
    rl.close();
  }
}

function question(prompt) {
  return new Promise(resolve => rl.question(prompt, resolve));
}

createAdmin();
```

Run locally:
```bash
DB_HOST=mysql.u319625572.hostinger.com \
DB_USER=u319625572_trueautocheck \
DB_PASSWORD=Trueautocheck321@ \
DB_NAME=u319625572_trueautocheck \
node scripts/create-admin.js
```

---

## **Troubleshooting**

### Login Shows "Invalid credentials"
✓ Check that `TEST_ADMIN_EMAIL` and `TEST_ADMIN_PASS` are in `.env.production`
✓ Verify you're using exactly: `admin@trueautocheck.com` / `Admin123@Secure`

### "Failed to fetch stats" Error
✓ Database connection issue
✓ Check that `.env.production` has correct DB_HOST (from Hostinger Control Panel)
✓ Verify database tables exist (run schema import)

### Can't Connect to Database
✓ Wrong DB_HOST - must be Hostinger's MySQL host, not localhost
✓ Wrong credentials - verify in Hostinger Control Panel
✓ Database firewall - check Hostinger allows remote connections

### Check Hostinger Logs
```bash
ssh user@hostinger
tail -f logs/app.log
```

---

## **Quick Checklist**

- [ ] Database created: `u319625572_trueautocheck`
- [ ] Schema imported (all tables created)
- [ ] `.env.production` file updated with correct DB_HOST
- [ ] Application deployed to Hostinger
- [ ] Test login works: `admin@trueautocheck.com` / `Admin123@Secure`
- [ ] Admin panel accessible at `https://yourdomain.com/admin/dashboard`

---

## **Need Help?**

If still failing, provide:
1. **Exact URL** you're visiting
2. **Error message** from browser console (F12 → Console)
3. **Server log** output (from Hostinger Control Panel)
4. **DB_HOST** from your Hostinger MySQL settings
