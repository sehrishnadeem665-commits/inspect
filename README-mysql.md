# MySQL Setup & phpMyAdmin import

This project has been migrated to use MySQL as the primary database (no Supabase).

Required environment variables (.env):

- DB_HOST - Database host (default: 127.0.0.1)
- DB_PORT - Database port (default: 3306)
- DB_USER - Database user
- DB_PASSWORD - Database password
- DB_NAME - Database name (default: trueautocheck)
- NEXT_PUBLIC_BASE_URL - Public base URL used for server-to-self requests (e.g., http://localhost:3000)
- ADMIN_EMAIL - Email address to receive admin notifications (default: sehrishnadeem39@gmail.com)
- RESEND_API_KEY - (Optional) API key for Resend email service. If not provided, emails are logged to server logs.
- NEXT_PUBLIC_PAYPAL_CLIENT_ID - (Optional) PayPal client id for client-side PayPal buttons
- PAYPAL_CLIENT_ID / PAYPAL_CLIENT_SECRET - (Optional) Server-side PayPal credentials for verification

Importing SQL via phpMyAdmin:

1. Open phpMyAdmin and log in.
2. Create a database (name should match `DB_NAME`).
3. Go to the Import tab for the database and upload `sql/schema-mysql.sql`.
4. Run the import — tables will be created.

Testing:

- Start dev server: `npm install` then `npm run dev`.
- Ensure your `.env` contains the required vars.
- Create a contact form submission, verify it appears in `contact_submissions` table via phpMyAdmin.
- Use the Get Report flow to create an order — confirm `orders` table has the entry and admin email is triggered.
- Complete payment flow (Paddle sandbox) — confirm `payments` and `orders` updated and confirmation email sent to user.

Notes:
- All admin and public forms now insert and read directly from the MySQL database.
- To add an initial admin user, you can either add a row in the `users` table manually in phpMyAdmin or run the provided script:

  ```bash
  node scripts/create-admin.js admin@example.com YourPasswordHere
  ```

  This will insert a user with role `admin` and a bcrypt-hashed password.

