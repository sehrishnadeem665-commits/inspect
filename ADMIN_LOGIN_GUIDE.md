# 🔐 Admin Panel Login Credentials

## Your Admin Login Details

### **Default Credentials** (Work Immediately)

```
Email:    admin@carbronze.com
Password: Admin123@Secure
```

OR

```
Email:    admin@autofactscheck.com
Password: Admin123@Secure
```

---

## 🔑 Custom Credentials Setup

### Step 1: Create/Update `.env.local`

```env
# Admin Credentials
ADMIN_EMAIL=sehrishnadeem39@gmail.com
ADMIN_PASSWORD=YourSecurePassword123!

# OR use TEST credentials:
TEST_ADMIN_EMAIL=sehrishnadeem39@gmail.com
TEST_ADMIN_PASS=YourSecurePassword123!
```

### Step 2: Use Your Custom Credentials

```
Email:    sehrishnadeem39@gmail.com
Password: YourSecurePassword123!
```

---

## 🚀 Admin Panel URL

```
http://localhost:3000/admin/login
```

(For production, replace with your actual domain)

---

## 📋 Login Steps

1. **Open Admin Panel:**
   ```
   http://localhost:3000/admin/login
   ```

2. **Enter Credentials:**
   - Email: `admin@carbronze.com`
   - Password: `Admin123@Secure`

3. **Click Login**

4. **You'll see:**
   - ✅ Payment Status Dashboard
   - ✅ Real-time order updates
   - ✅ Payment statuses (Pending, Completed, Dispute, etc.)

---

## 🔒 Security Notes

- ✅ Password stored securely
- ✅ Token-based authentication
- ✅ Sessions saved in localStorage
- ✅ Auto-logout if token expires
- ✅ Change default password in production

---

## 📊 What You'll See After Login

### Admin Dashboard Sections:
1. **Payment Status**
   - ⏳ Pending payments
   - ✅ Completed payments
   - ❌ Failed payments
   - ⚠️ Dispute payments

2. **Real-time Updates**
   - Auto-refresh every 30 seconds
   - Webhook status changes
   - Customer information

3. **Payment Details**
   - Order ID
   - Amount
   - Payment method (PayPal)
   - Customer email
   - Transaction ID
   - Payment date

---

## 🔄 Change Password

### Update `.env.local`:
```env
# Old
ADMIN_PASSWORD=Admin123@Secure

# New
ADMIN_PASSWORD=YourNewPassword123!
```

Then restart dev server:
```bash
npm run dev
```

---

## ⚠️ If Login Fails

### Check These:
1. ✓ Email is correct (case-sensitive)
2. ✓ Password is correct (case-sensitive)
3. ✓ `.env.local` file exists and has ADMIN_EMAIL & ADMIN_PASSWORD
4. ✓ Dev server is running: `npm run dev`
5. ✓ Clear browser cache if using same credentials

### Try Default Credentials First:
```
Email: admin@carbronze.com
Password: Admin123@Secure
```

---

## 🎯 Quick Reference

| Item | Value |
|------|-------|
| Login URL | http://localhost:3000/admin/login |
| Default Email | admin@carbronze.com |
| Default Password | Admin123@Secure |
| Token Storage | localStorage (admin_token) |
| Dashboard URL | /admin/dashboard |
| Refresh Interval | Every 30 seconds |

---

## 📞 Troubleshooting

### "Invalid credentials" error?
- Check ADMIN_EMAIL and ADMIN_PASSWORD in `.env.local`
- Ensure dev server restarted after env changes
- Try default credentials first

### Can't see payment status?
- Login successful but no data?
- Check if payments table has records
- Run: `npm run setup-webhook-table`
- Make a test payment using `/api/test-payment-email`

### Session expired?
- Re-login with your credentials
- Check localStorage for token
- Clear cache and try again

---

**Ready to login! Use credentials above 👆**
