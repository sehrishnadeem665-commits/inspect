Test: Update status e2e helper

How to run:

1. Start the dev server: `npm run dev` (server must be accessible at `http://localhost:3000` or set `BASE_URL`).
2. Set test admin credentials in your environment. For quick testing you can set `TEST_ADMIN_EMAIL` and `TEST_ADMIN_PASS` to a valid admin user or use the env-based fallback in `/api/admin/login`.

Example (Linux/macOS):

```bash
export TEST_ADMIN_EMAIL=admin@example.com
export TEST_ADMIN_PASS=SomePass123
npm run test:update-status
```

Windows (PowerShell):

```powershell
$env:TEST_ADMIN_EMAIL = 'admin@example.com'
$env:TEST_ADMIN_PASS = 'SomePass123'
npm run test:update-status
```

What it does:
- Inserts a new order directly into the database
- Logs in via `/api/admin/login` using the test admin credentials
- Calls `PUT /api/admin/orders/{id}/status` to set the report status to `completed`
- Verifies the change in the database

Notes:
- Ensure your DB env vars (DB_HOST, DB_USER, DB_PASSWORD, DB_NAME) are set if not using defaults.
- The script assumes the server is running locally and reachable.