# Windows Database Connection Guide

## Problem: ECONNREFUSED Error

When you see this error during development, it means your dev server cannot connect to the database:

```
Error: connect ECONNREFUSED 127.0.0.1:5432
Error: connect ECONNREFUSED 127.0.0.1:3306
```

**Root Cause:** Your local PostgreSQL or MySQL server is not running.

---

## ✅ Quick Fix

### Option 1: Use PowerShell Script (Recommended)

**For PowerShell (Windows 10+):**

```powershell
# Run from project root
powershell -ExecutionPolicy Bypass -File Start-Database.ps1
```

**Features:**
- ✅ Auto-detects PostgreSQL or MySQL
- ✅ Starts service if not running
- ✅ Warns if already running
- ✅ Tests connection automatically
- ✅ Colored output for easy reading

**Examples:**

```powershell
# Auto-detect and start
Start-Database.ps1

# Specify PostgreSQL explicitly
Start-Database.ps1 -DatabaseType PostgreSQL

# Specify MySQL with credentials
Start-Database.ps1 -DatabaseType MySQL -MySQLUser root -MySQLPassword "yourpassword"
```

---

### Option 2: Use Batch Script

**For Command Prompt (CMD):**

```bash
Start-Database.bat
```

**Features:**
- ✅ Works in classic Command Prompt
- ✅ Auto-detects and starts database
- ✅ Tests connection
- ⚠️ Less detailed feedback than PowerShell

**Note:** Run as Administrator if prompted

---

## 🔧 Manual Steps (If Scripts Don't Work)

### PostgreSQL

**Check if running:**
```powershell
Get-Process postgres
```

**Start service:**
```powershell
# Run as Administrator
Start-Service -Name "postgresql-x64-14"  # Replace 14 with your version
```

**Test connection:**
```powershell
psql -h localhost -U postgres -d postgres -c "\dt"
```

**If psql not found:**
- Add PostgreSQL `bin` directory to PATH:
  - Typical path: `C:\Program Files\PostgreSQL\15\bin`
  - Or: `C:\Program Files (x86)\PostgreSQL\15\bin`

---

### MySQL

**Check if running:**
```powershell
Get-Process mysqld
```

**Start service:**
```powershell
# Run as Administrator
Start-Service -Name "MySQL80"  # Or "MySQL57", "MySQL59", etc.
```

**Test connection:**
```powershell
mysql -h localhost -u root -e "SHOW TABLES;"
```

**If mysql not found:**
- Add MySQL `bin` directory to PATH:
  - Typical path: `C:\Program Files\MySQL\MySQL Server 8.0\bin`

---

## 🎯 Setup Instructions by Database

### PostgreSQL Setup

#### 1. Check Installation

```powershell
Get-Service postgresql-x64-*
```

Should show output like:
```
Status   Name                DisplayName
------   ----                -----------
Running  postgresql-x64-15   PostgreSQL Server 15
```

#### 2. Start Service

```powershell
Start-Service -Name "postgresql-x64-15"
```

#### 3. Add to PATH (if needed)

```powershell
# Find PostgreSQL installation
$pgPath = "C:\Program Files\PostgreSQL\15\bin"
$env:PATH += ";$pgPath"

# Add permanently to user PATH
[Environment]::SetEnvironmentVariable(
    "PATH",
    [Environment]::GetEnvironmentVariable("PATH", "User") + ";$pgPath",
    "User"
)
```

#### 4. Verify Connection

```powershell
# Connect as postgres user
psql -h localhost -U postgres -d postgres -c "SELECT version();"
```

---

### MySQL Setup

#### 1. Check Installation

```powershell
Get-Service MySQL*
```

Should show output like:
```
Status   Name           DisplayName
------   ----           -----------
Running  MySQL80        MySQL80
```

#### 2. Start Service

```powershell
Start-Service -Name "MySQL80"
```

#### 3. Add to PATH (if needed)

```powershell
# Find MySQL installation
$mysqlPath = "C:\Program Files\MySQL\MySQL Server 8.0\bin"
$env:PATH += ";$mysqlPath"

# Add permanently to user PATH
[Environment]::SetEnvironmentVariable(
    "PATH",
    [Environment]::GetEnvironmentVariable("PATH", "User") + ";$mysqlPath",
    "User"
)
```

#### 4. Verify Connection

```powershell
# Connect as root user
mysql -h localhost -u root -e "SELECT VERSION();"
```

---

## 🚀 Automate on Startup

### Windows Services (Automatic)

1. Press `Win + R`, type `services.msc`, and press Enter
2. Find your database service (PostgreSQL or MySQL)
3. Double-click it
4. Set "Startup type" to **Automatic**
5. Click OK

Now the database starts automatically when Windows boots.

---

### Add to Project startup

**Option A: Add to `package.json` scripts**

```json
{
  "scripts": {
    "db:start": "powershell -ExecutionPolicy Bypass -File Start-Database.ps1",
    "dev": "npm run db:start && next dev",
    "start": "npm run db:start && next start"
  }
}
```

Then run:
```bash
npm run dev
```

**Option B: Create `.env.local` check**

Add to your `.env.local`:
```
DATABASE_URL=postgresql://postgres:password@localhost:5432/mydb
# or
DATABASE_URL=mysql://root:password@localhost:3306/mydb
```

---

## 🔍 Troubleshooting

### "Service not found"

```powershell
# List all services
Get-Service | Where-Object {$_.Name -like "*postgres*" -or $_.Name -like "*mysql*"}
```

If nothing shows, you may need to:
1. Reinstall PostgreSQL/MySQL
2. Choose "Install as Service" during installation
3. Run installer as Administrator

---

### "Access Denied" (Permission Error)

**Solution:** Run PowerShell as Administrator

```powershell
# Press Win + X, select "Windows PowerShell (Admin)"
Start-Service -Name "postgresql-x64-15"
```

---

### Connection Refused (Service Running but Can't Connect)

1. **Verify service is actually running:**
   ```powershell
   Get-Process postgres  # or mysqld
   ```

2. **Check if listening on localhost:**
   ```powershell
   netstat -ano | findstr :5432  # PostgreSQL
   netstat -ano | findstr :3306  # MySQL
   ```

3. **Verify credentials in your connection string:**
   - PostgreSQL: User `postgres` with correct password
   - MySQL: User `root` with correct password

4. **Check firewall:**
   - Windows Defender Firewall should not block localhost connections
   - If issues persist, add exception for PostgreSQL/MySQL ports

---

### Client Not Found (psql or mysql not in PATH)

**For PostgreSQL:**
```powershell
# Add to PATH temporarily
$env:PATH += ";C:\Program Files\PostgreSQL\15\bin"

# Test
psql --version
```

**For MySQL:**
```powershell
# Add to PATH temporarily
$env:PATH += ";C:\Program Files\MySQL\MySQL Server 8.0\bin"

# Test
mysql --version
```

To make permanent, see "Add to PATH" sections above.

---

## 📋 Quick Checklist

Before running your dev server:

- [ ] Database service installed and registered as Windows service
- [ ] Service is running (`Get-Service postgresql-x64-*` or `Get-Service MySQL*`)
- [ ] Client tools in PATH (`psql --version` or `mysql --version`)
- [ ] Connection test passes (`psql -h localhost ...` or `mysql -h localhost ...`)
- [ ] `.env.local` has correct `DATABASE_URL`
- [ ] No firewall blocking localhost connections

---

## 🎯 Next Steps

1. **Run the startup script:**
   ```powershell
   powershell -ExecutionPolicy Bypass -File Start-Database.ps1
   ```

2. **Verify connection:**
   - For PostgreSQL: `psql -h localhost -U postgres -c "\dt"`
   - For MySQL: `mysql -h localhost -u root -e "SHOW DATABASES;"`

3. **Start dev server:**
   ```bash
   npm run dev
   ```

4. **Check no ECONNREFUSED errors in console**

✨ **All set!** Your database should now be running and connected.

---

## 📚 Additional Resources

- [PostgreSQL Windows Download](https://www.postgresql.org/download/windows/)
- [MySQL Windows Download](https://dev.mysql.com/downloads/mysql/)
- [PostgreSQL psql Documentation](https://www.postgresql.org/docs/current/app-psql.html)
- [MySQL Command Line Client](https://dev.mysql.com/doc/refman/8.0/en/mysql.html)
