# Hostinger Deployment Guide

## Error 113 - Dependencies Installation Failed

Error 113 on Hostinger typically means the npm install process failed. This is usually caused by:

1. **Native modules** (like `better-sqlite3`) - can't compile on shared hosting
2. **Peer dependency conflicts** - strict checking causing failures
3. **Network timeouts** - slow downloads on Hostinger
4. **Netlify plugin** - not needed on Hostinger

## ✅ Changes Made

### 1. **Removed Problematic Dependencies**
- ❌ Removed `better-sqlite3` (native module - won't work on Hostinger)
- ❌ Removed `@netlify/plugin-nextjs` (Netlify-specific)

### 2. **Created `.npmrc` File**
- Enables legacy peer deps (skips strict peer dependency checking)
- Increases timeout values for slow connections
- Sets proper npm registry

### 3. **Updated `package.json`**
- Added Node version requirements (18.x or 20.x)
- Added npm version requirements
- Removed problematic packages

### 4. **Database Alternative**
Since `better-sqlite3` won't work on Hostinger, use one of these instead:

**Option A: Use MySQL (Recommended)**
```javascript
// Already have mysql2 installed
// Use your existing MySQL connection
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});
```

**Option B: Use Supabase/PostgreSQL**
```bash
npm install @supabase/supabase-js
```

**Option C: Disable Local Database Features**
If you only need local DB for development, wrap it:

```typescript
// lib/database.ts
const isDevelopment = process.env.NODE_ENV === 'development';

export async function getLocalDB() {
  if (!isDevelopment) {
    // Use MySQL instead on production
    return getMySQLConnection();
  }
  // Use better-sqlite3 for local dev
  const Database = require('better-sqlite3');
  return new Database('data.db');
}
```

## 📋 Deployment Steps for Hostinger

### 1. **Prepare Your Project Locally**
```bash
# Install dependencies
npm install --legacy-peer-deps

# Build the project
npm run build

# Test production build locally
npm run start
```

### 2. **Update Environment Variables**
Create `.env.production.local` on Hostinger with:
```
NEXT_PUBLIC_BASE_URL=https://yourdomain.com
NODE_ENV=production
# Add your database credentials if using MySQL
DB_HOST=your-db-host
DB_USER=your-db-user
DB_PASSWORD=your-db-password
DB_NAME=your-db-name
```

### 3. **Upload to Hostinger**

**Option A: Via Hostinger File Manager**
1. Delete `node_modules` folder locally
2. Delete `.next` folder locally
3. Zip the project
4. Upload to Hostinger public_html or a subdirectory
5. Extract the files

**Option B: Via Git (Recommended)**
1. Push to GitHub
2. In Hostinger, use Git deployment:
   - Enter Git repository URL
   - Hostinger will auto-install and build

**Option C: Via SSH**
```bash
# Connect via SSH
ssh user@your-hostinger-domain.com

# Navigate to project
cd public_html

# Install dependencies
npm install --legacy-peer-deps --production

# Build
npm run build

# Start the app
npm start
```

### 4. **Configure Node.js on Hostinger**
1. Go to Hostinger Control Panel
2. Find "Node.js" section
3. Select your Node version (18 or 20)
4. Set Application Entry Point: `node_modules/.bin/next start`
5. Set Application Root: your project folder
6. Set Node Environment: production

### 5. **Fix Port Configuration**
Hostinger uses specific ports. Update your startup:

Create a `server.js` in root:
```javascript
const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();
const PORT = process.env.PORT || 3000;

app.prepare().then(() => {
  createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  }).listen(PORT, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${PORT}`);
  });
});
```

Update `package.json` start script:
```json
"start": "node server.js"
```

## ✅ Quick Troubleshooting

| Error | Solution |
|-------|----------|
| "better-sqlite3 not found" | Use MySQL instead - already configured |
| "npm: command not found" | Ensure Node.js is installed on Hostinger |
| "Cannot find module" | Run `npm install --legacy-peer-deps` on server |
| "Timeout installing" | Increase timeout in `.npmrc` (already done) |
| "Permission denied" | Check file permissions with `chmod 755` |
| "Port already in use" | Check Hostinger's port requirements |

## 🔍 Verify Installation

After deployment, check:

1. **Health Check**
   ```
   curl https://yourdomain.com
   ```

2. **Check Logs**
   - Hostinger Control Panel > Error Logs
   - Check for dependency errors

3. **Verify Build**
   ```bash
   ls -la .next/  # Should exist
   npm list       # Check installed packages
   ```

## 📞 If Issues Persist

1. **Check Hostinger logs** for specific error messages
2. **Verify Node version** matches requirements
3. **Check disk space** - large node_modules need space
4. **Try manual npm install**:
   ```bash
   npm cache clean --force
   npm install --legacy-peer-deps --no-audit
   ```

5. **Contact Hostinger support** - provide:
   - Error 113 screenshot
   - Node version info
   - Package list output

## Files Modified

- ✅ `package.json` - Removed problematic packages
- ✅ `.npmrc` - Created with Hostinger settings
- ✅ `deploy.sh` - Deployment helper script
- ✅ `HOSTINGER_DEPLOYMENT.md` - This guide
