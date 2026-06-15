# Fix Internal Server Error - Local & Live

## 🔧 Quick Fixes

### **For LOCAL Server**

1. **Make sure MySQL is running:**
   ```bash
   # Linux/WSL
   sudo service mysql start
   
   # Mac (with Homebrew)
   brew services start mysql
   
   # Windows - Start MySQL from Services
   ```

2. **Create the database:**
   ```bash
   mysql -u root -p
   # Then type your password (press Enter if no password)
   
   # In MySQL:
   CREATE DATABASE u319625572_trueautocheck;
   EXIT;
   ```

3. **Import the schema:**
   ```bash
   mysql -u root -p u319625572_trueautocheck < sql/schema-mysql.sql
   # Type your password when prompted
   ```

4. **Verify the setup:**
   ```bash
   mysql -u root -p u319625572_trueautocheck -e "SHOW TABLES;"
   # Should see: users, orders, reviews, contact_submissions, etc.
   ```

5. **Update `.env.local`:**
   ```env
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=root
   DB_PASSWORD=
   DB_NAME=u319625572_trueautocheck
   ```
   (Leave DB_PASSWORD empty if you have no password)

6. **Restart the dev server:**
   ```bash
   npm run dev
   # Then visit http://localhost:3000/admin/login
   ```

---

### **For HOSTINGER LIVE Server**

1. **Get your Hostinger MySQL host:**
   - Log in to Hostinger Control Panel
   - Go to **Hosting** → **Databases** → **MySQL**
   - Copy the **Host** (example: `mysql.u319625572.hostinger.com`)

2. **Update `.env.production`:**
   ```env
   DB_HOST=mysql.u319625572.hostinger.com
   DB_PORT=3306
   DB_USER=u319625572_trueautocheck
   DB_PASSWORD=Trueautocheck321@
   DB_NAME=u319625572_trueautocheck
   ```
   ⚠️ Replace `mysql.u319625572.hostinger.com` with YOUR actual host!

3. **Import database schema via phpMyAdmin:**
   - In Hostinger Control Panel
   - Go to **Databases** → **phpMyAdmin**
   - Select your database: `u319625572_trueautocheck`
   - Click **Import** tab
   - Upload: `sql/schema-mysql.sql`
   - Click **Import**

4. **Verify tables were created:**
   - In phpMyAdmin
   - Select database
   - You should see tables: users, orders, reviews, etc.

5. **Deploy and restart:**
   ```bash
   git add .
   git commit -m "Fix database configuration"
   git push
   # Then redeploy in Hostinger Control Panel
   ```

---

## ✅ Testing

### **Test Login (Both Local & Live)**

1. Visit: `http://localhost:3000/admin/login` (local) or `https://yourdomain.com/admin/login` (live)
2. Use test credentials:
   - **Email:** `admin@trueautocheck.com`
   - **Password:** `Admin123@Secure`
3. If it works, you'll be redirected to the dashboard

---

## 🐛 Troubleshooting

### **Error: "Internal Server Error" on Local**
```
Check:
1. Is MySQL running? (ps aux | grep mysql)
2. Does database exist? (mysql -u root -e "SHOW DATABASES;")
3. Are env variables correct? (Check .env.local)
4. Check server logs: npm run dev console output
```

### **Error: "Unknown database 'u319625572_trueautocheck'"**
```
Solution:
1. Create database: CREATE DATABASE u319625572_trueautocheck;
2. Import schema: mysql -u root -p u319625572_trueautocheck < sql/schema-mysql.sql
3. Restart server: npm run dev
```

### **Error: "Access denied for user"**
```
Check:
1. DB_USER is correct (default: root for local)
2. DB_PASSWORD is correct (empty string for local if no password)
3. User has proper privileges (GRANT ALL ON * TO 'root'@'localhost';)
```

### **Error on Hostinger: "Can't connect to server"**
```
Solutions:
1. Check DB_HOST is correct (get from Hostinger Control Panel)
2. Verify database exists on Hostinger
3. Check phpMyAdmin can connect (test in Control Panel)
4. Ensure schema was imported
5. Check Hostinger logs for specific errors
```

### **View Server Logs**

**Local:**
```bash
npm run dev
# Logs appear in terminal
```

**Hostinger:**
1. Control Panel → **Node.js Apps** → **Manage**
2. Scroll down to **Logs**
3. Look for errors starting with ❌

---

## 📋 Database Verification

**On Local (after setup):**
```bash
mysql -u root -p u319625572_trueautocheck
SHOW TABLES;
DESCRIBE users;
EXIT;
```

**On Hostinger (via phpMyAdmin):**
1. Select database → Click **SQL** tab
2. Run: `SHOW TABLES;`
3. Should see all tables created

---

## 🚀 Complete Checklist

### Local Setup
- [ ] MySQL installed and running
- [ ] Database created: `u319625572_trueautocheck`
- [ ] Schema imported (sql/schema-mysql.sql)
- [ ] `.env.local` configured with `DB_HOST=localhost`
- [ ] `npm run dev` shows "✅ Database connection successful"
- [ ] Login works at `http://localhost:3000/admin/login`

### Hostinger Setup
- [ ] Hostinger MySQL host copied
- [ ] `.env.production` updated with correct DB_HOST
- [ ] Database created on Hostinger
- [ ] Schema imported via phpMyAdmin
- [ ] Code deployed to Hostinger
- [ ] App restarted/redeployed
- [ ] Login works at `https://yourdomain.com/admin/login`

---

## ❓ Still Having Issues?

Provide:
1. **Exact error message** (from browser console or logs)
2. **Which server** (local or Hostinger?)
3. **Your DB_HOST value** (for Hostinger)
4. **Output of:** `npm run dev` (local) or Hostinger logs
