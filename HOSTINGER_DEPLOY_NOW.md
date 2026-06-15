# 🚀 DEPLOY YOUR SITE TO HOSTINGER NOW

Your project is built and ready! Follow these steps to go live.

---

## ✅ What's Ready

- ✅ Production build compiled successfully
- ✅ `.env.local` configured with database: `u319625572_trueautocheck`
- ✅ All files are production-optimized
- ✅ Database credentials set

---

## 📋 DEPLOYMENT STEPS

### **STEP 1: Upload Project to Hostinger**

#### Option A: Using Git (Recommended - Easiest)

**1a. Create a GitHub Repository**
```bash
# In your project directory
git init
git add .
git commit -m "Deploy to Hostinger"
git remote add origin https://github.com/your-username/your-repo.git
git push -u origin main
```

**1b. Connect Git to Hostinger Control Panel**
1. Log into [Hostinger Control Panel](https://hpanel.hostinger.com/)
2. Go to **Hosting** → Your Website
3. Click **Git** in the left sidebar
4. Click **Connect Git Repository**
5. Select **GitHub** and authorize
6. Select your repository
7. Set these settings:
   - **Branch**: `main`
   - **Production URL**: Leave as default (your domain)
   - **Build command**: `npm run build`
   - **Start command**: `npm start`
8. Click **Connect & Deploy**

**Hostinger will automatically:**
- Download your repo
- Run `npm install`
- Run `npm run build`
- Start your application
- Deploy it to your domain

---

#### Option B: Using FTP/File Manager

**1. Download your project with .next build folder:**
```bash
# Ensure build exists
ls -la .next/
```

**2. Upload via Hostinger File Manager:**
1. Log into Hostinger Control Panel
2. Go to **Hosting** → **File Manager**
3. Navigate to `public_html/` (or your domain folder)
4. Delete everything (if starting fresh)
5. Upload your entire project folder

**3. Upload .env.local via FTP:**
- Use FTP client (FileZilla, WinSCP)
- Upload `.env.local` to the root of your project

---

### **STEP 2: Configure Environment Variables**

#### Option A: Via Hostinger Control Panel (RECOMMENDED)

1. Go to **Hosting** → Your Website → **Node.js**
2. Click your application in the list
3. Click **Edit** → **Environment Variables**
4. Add these variables:

```
NODE_ENV=production
DB_HOST=localhost
DB_PORT=3306
DB_USER=trueautocheck
DB_PASSWORD=Trueautocheck321@
DB_NAME=u319625572_trueautocheck
NEXT_PUBLIC_BASE_URL=https://yourdomain.com
ADMIN_EMAIL=sehrishnadeem39@gmail.com
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=info@vehicleinspectify.com
SMTP_PASS=SehmanJatvoi321@
EMAIL_FROM="Vehicle Reports <info@vehicleinspectify.com>"
RESEND_API_KEY=re_RVpNuQ2S_NuZrfm7nDDpR4fmp21pVYVPc
NEXT_PUBLIC_PAYPAL_CLIENT_ID=your-paypal-id
AUTO_DEV_API_KEY=sk_ad_xVqOSaxxhix_2EKxUfQi4rtZ
```

5. Click **Save**
6. Click **Restart Node.js Application**

#### Option B: Via .env.local File

If using FTP upload, your `.env.local` has these values already set:
```
DB_HOST=localhost
DB_PORT=3306
DB_USER=trueautocheck
DB_PASSWORD=Trueautocheck321@
DB_NAME=u319625572_trueautocheck
```

---

### **STEP 3: Verify Database Tables Exist**

In Hostinger Control Panel → **Databases** → **MySQL**:

1. Go to your database `u319625572_trueautocheck`
2. Run these queries to create tables if they don't exist:

**Create Tables:**
```sql
CREATE TABLE IF NOT EXISTS orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  vin VARCHAR(50) UNIQUE,
  email VARCHAR(255),
  status VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS contact_messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255),
  email VARCHAR(255),
  message TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS reviews (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255),
  rating INT,
  review TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS admin_users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) UNIQUE,
  password VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

### **STEP 4: Test Your Deployment**

After Hostinger finishes deploying and Node.js restarts:

**Test Database Connection:**
```
https://yourdomain.com/api/test-db
```

✅ **Success response:**
```json
{
  "message": "Database connected successfully!",
  "timestamp": "2026-01-19T..."
}
```

**Test Contact Form:**
```
https://yourdomain.com/contact-us
```

**Test Order Creation:**
Visit your homepage, enter a VIN and create a test order

---

### **STEP 5: Configure Your Domain**

In Hostinger Control Panel:

1. Go to **Domains** → Your Domain
2. Point it to your hosting (if not already done)
3. Update **NEXT_PUBLIC_BASE_URL** in Environment Variables to match your actual domain:
   ```
   NEXT_PUBLIC_BASE_URL=https://youractualdomainname.com
   ```
4. Restart Node.js Application

---

## 🔧 Troubleshooting

### ❌ Error: "Cannot find module 'next'"
**Solution:**
- Go to **Node.js** → Your app → Click **Restart Node.js Application**
- Or manually run in terminal: `npm install --legacy-peer-deps && npm run build`

### ❌ Error: "Database connection failed"
**Solutions:**
1. Verify database credentials in Environment Variables
2. Confirm database `u319625572_trueautocheck` exists
3. Check MySQL is running (Hostinger usually auto-runs)
4. Restart Node.js Application
5. View logs: **Node.js** → Your app → **View Logs**

### ❌ Error: "Port already in use"
**Solution:**
- Hostinger automatically assigns a free port
- Go to **Node.js** → Your app → Check **Port** setting
- Restart application

### ❌ Site shows 404 or blank page
**Solutions:**
1. Restart Node.js Application
2. Clear browser cache (Ctrl+Shift+Delete)
3. Check Node.js Logs for errors
4. Verify `npm start` command in settings

### ❌ Emails not sending
**Solutions:**
1. Test SMTP credentials are correct in Environment Variables
2. Verify Gmail account has "Less secure apps" enabled OR use App Password
3. Check Hostinger isn't blocking outbound mail (ask support)
4. View email logs in Node.js Logs

---

## 📊 Monitor Your Site

**In Hostinger Control Panel:**
- **Node.js Logs**: View errors in real-time
- **File Manager**: Update files via FTP
- **Databases**: Manage MySQL data
- **Domain**: Configure DNS/SSL

---

## 🎉 Your Site is Now Live!

Visit: **https://yourdomain.com**

**Next Steps:**
1. Test all forms (contact, checkout, reviews)
2. Create test orders
3. Check admin panel: `/admin`
4. Monitor logs for any issues
5. Share with users!

---

## ⚠️ Important Reminders

- Update `NEXT_PUBLIC_BASE_URL` to your actual domain
- Keep `.env.local` secure (never commit to Git)
- Restart Node.js after any environment changes
- Check logs if anything breaks
- Test payment integration (PayPal/Paddle)

---

**Need Help?**
- Check Hostinger Support: https://support.hostinger.com/
- Check Node.js Logs in Control Panel
- Verify all environment variables are set
