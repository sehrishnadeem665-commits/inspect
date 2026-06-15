# VIN API Configuration for Hostinger Live Server

## Issue
The VIN banner/checker functionality is not working on the live server (trueautocheck.com) but works perfectly on localhost.

## Root Cause
The `AUTO_DEV_API_KEY` environment variable is defined in `.env.local`, which is only used for local development. When the code is deployed to Hostinger, this file is ignored by Next.js, so the VIN API key is not available on the live server.

## Solution: Set Environment Variables on Hostinger

### Method 1: Using Hostinger Control Panel (Recommended)

1. **Log in to Hostinger Control Panel**
   - Go to https://hpanel.hostinger.com

2. **Navigate to Environment Variables**
   - Go to: Hosting → Your Domain → Application → Environment Variables
   - Or: Hosting → Web Development Tools → Environment Variables

3. **Add the Following Variables:**
   ```
   NODE_ENV = production
   AUTO_DEV_API_KEY = sk_ad_xVqOSaxxhix_2EKxUfQi4rtZ
   ADMIN_EMAIL = sehrishnadeem39@gmail.com
   TEST_ADMIN_EMAIL = admin@trueautocheck.com
   TEST_ADMIN_PASS = Admin123@Secure
   SMTP_HOST = smtp.gmail.com
   SMTP_PORT = 465
   SMTP_SECURE = true
   SMTP_USER = info@vehicleinspectify.com
   SMTP_PASS = SehmanJatvoi321@
   EMAIL_FROM = Vehicle Reports <info@vehicleinspectify.com>
   RESEND_API_KEY = re_RVpNuQ2S_NuZrfm7nDDpR4fmp21pVYVPc
   NEXT_PUBLIC_BASE_URL = https://trueautocheck.com
   DATABASE_URL = mysql://u319625572_trueautocheck:Trueautocheck321@mysql.u319625572.hostinger.com:3306/u319625572_trueautocheck
   ```

4. **Restart the Application**
   - Click "Restart" or "Rebuild" the Node.js application
   - Wait 2-3 minutes for changes to take effect

### Method 2: Using .env.production File (Alternative)

If environment variables are not available in your Hostinger control panel, you can create an `.env.production` file:

1. **Create `.env.production` file in root directory**
2. **Add the same environment variables as above**
3. **Push to Git and redeploy**

**Note:** `.env.production` should be in `.gitignore` to keep secrets safe.

### Method 3: Command Line (SSH Access)

If you have SSH access to Hostinger:

```bash
# SSH into your server
ssh user@your-hostinger-domain.com

# Create environment file
nano ~/.env.production

# Add variables and save (Ctrl+X, Y, Enter)

# Restart application
pm2 restart all
```

## Verification

### Check Configuration Status
Visit: `https://trueautocheck.com/api/vin/diagnostics`

**Expected Response:**
```json
{
  "timestamp": "2026-01-19T...",
  "environment": {
    "nodeEnv": "production",
    "autoDevApiKeyConfigured": true,
    "autoDevApiKeyPreview": "sk_ad...ZrZ",
    "apiEndpoint": "https://api.auto.dev/vin"
  },
  "status": "READY"
}
```

**If Status is MISSING_API_KEY:**
- Environment variable is not set on Hostinger
- Follow the setup steps above again

### Test VIN API

**Using Postman or curl:**
```bash
curl -X POST https://trueautocheck.com/api/vin \
  -H "Content-Type: application/json" \
  -d '{"vin": "1C4JJXSJ0NW129781"}'
```

**Expected Response:**
```json
{
  "success": true,
  "vin": "1C4JJXSJ0NW129781",
  "vehicle": {
    "make": "Jeep",
    "model": "Wrangler Unlimited",
    "year": 2022,
    ...
  }
}
```

## Troubleshooting

### Issue: "autoDevApiKeyConfigured": false

**Solution:** Set the `AUTO_DEV_API_KEY` environment variable in Hostinger control panel

### Issue: API Returns 503 Service Unavailable

**Possible Causes:**
1. Hostinger firewall blocks outbound requests to `api.auto.dev`
2. Network connectivity issue

**Solution:**
- Contact Hostinger support to whitelist `api.auto.dev`
- Check if outbound requests are restricted

### Issue: API Returns 504 Gateway Timeout

**Solution:**
- The auto.dev API is responding slowly
- This is handled gracefully - Banner falls back to "Get Your Report" form
- User can still order the report

### Issue: Still not working after setting variables

**Solution:**
1. Wait 5 minutes for changes to propagate
2. Manually restart the application in Hostinger control panel
3. Clear browser cache (Ctrl+Shift+Delete)
4. Visit `/api/vin/diagnostics` to confirm variables are loaded

## Environment Variables Reference

| Variable | Purpose | Type |
|----------|---------|------|
| `AUTO_DEV_API_KEY` | VIN decoder API key | Secret |
| `NODE_ENV` | Application environment | production/development |
| `NEXT_PUBLIC_BASE_URL` | Public site URL | https://trueautocheck.com |
| `ADMIN_EMAIL` | Admin notification email | email |
| `TEST_ADMIN_EMAIL` | Admin login email | email |
| `TEST_ADMIN_PASS` | Admin login password | Secret |
| `SMTP_HOST` | Email server host | smtp.gmail.com |
| `SMTP_PORT` | Email server port | 465 |
| `SMTP_USER` | Email sender address | email |
| `SMTP_PASS` | Email password | Secret |
| `RESEND_API_KEY` | Alternative email service | Secret |
| `DATABASE_URL` | Full database connection string | URL |

## Notes

- `.env.local` is for development only and is ignored in production
- Environment variables set on Hostinger override `.env.*` files
- Always use the Hostinger control panel for production secrets
- Never commit secrets to Git (even in .env files)
- The diagnostics endpoint `/api/vin/diagnostics` helps verify configuration

## Support

If the VIN API is still not working after following these steps:

1. Check Hostinger server logs
2. Verify firewall settings allow outbound HTTPS connections
3. Contact Hostinger support if API key is set but still failing
4. Check if `api.auto.dev` service is operational: https://status.auto.dev

---

**Last Updated:** January 19, 2026
