Hostinger deployment instructions — ready-to-upload package

Overview
--------
This repository contains a Next.js app configured to run on Hostinger. The repository includes a safe `.htaccess`, a `hostinger-start.js` starter script that loads a `.env` from parent folders, and a PM2 `ecosystem.config.js`.

Goal
----
Create a deployable zip on your local machine, upload it to Hostinger File Manager, extract into the app root (public_html or configured folder), place `.env` one level above `public_html`, and start the app.

Steps (local machine)
---------------------
1. Clone the repo and install deps locally:

```bash
git clone https://github.com/sehrish64-crew/TrueAutoCheck.git
cd TrueAutoCheck
npm ci
```

2. Build the app:

```bash
npm run build
```

3. Create a deploy zip (includes production build and necessary files):

```bash
zip -r deploy.zip .next package.json public hostinger-start.js ecosystem.config.js .htaccess
```

Upload `deploy.zip` to Hostinger File Manager and extract into your app root.

Hostinger File Manager steps
---------------------------
1. Upload `deploy.zip` to the folder you want as App Root (usually `public_html` or a subfolder).
2. Extract the zip contents so that `package.json` and `hostinger-start.js` are in the App Root.
3. Move your `.env` file to one level above the public root (e.g., `/home/username/.env`) using File Manager.
4. Set file permissions: directories = 755, files = 644, `.env` = 600.
5. Replace `public_html/.htaccess` with the `.htaccess` file included in the zip (this repo’s `.htaccess` is safe).

Node.js App configuration (hPanel)
---------------------------------
1. Open hPanel → Node.js Apps → select your app or create a new one.
2. App root: set to the folder where you extracted the zip (containing `package.json`).
3. Startup script: `node hostinger-start.js`
4. Add environment variables (if you prefer panel vars) or ensure `.env` is present above public_html.
5. Restart the app.

Verification
------------
1. Open https://trueautocheck.com — should load the app.
2. If 503: check Node logs in hPanel → Node.js Apps → App Logs, and paste the last 100 lines here.
3. If 403: ensure `.htaccess` is the safe one and directory permissions are correct.

Security notes
--------------
- Do NOT commit `.env` to Git.
- Rotate any secrets that were previously exposed.
