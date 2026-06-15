#!/bin/bash

# PayPal Integration Setup Test Script
# This script verifies your PayPal integration setup

echo "🔍 Checking PayPal Integration Setup..."
echo ""

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "❌ .env.local file not found!"
    exit 1
fi

echo "✅ .env.local file exists"

# Check for PayPal credentials
if grep -q "NEXT_PUBLIC_PAYPAL_CLIENT_ID=" .env.local; then
    echo "✅ PayPal Client ID found"
else
    echo "❌ PayPal Client ID not found in .env.local"
fi

if grep -q "PAYPAL_SECRET_KEY=" .env.local; then
    echo "✅ PayPal Secret Key found"
else
    echo "❌ PayPal Secret Key not found in .env.local"
fi

# Check for Email credentials
if grep -q "SMTP_USER=" .env.local; then
    echo "✅ SMTP User found"
else
    echo "❌ SMTP User not found in .env.local"
fi

if grep -q "SMTP_PASS=" .env.local; then
    echo "✅ SMTP Password found"
else
    echo "❌ SMTP Password not found in .env.local"
fi

# Check if required files exist
echo ""
echo "🔍 Checking required files..."
echo ""

files=(
    "lib/paypal.ts"
    "lib/email.ts"
    "app/api/paypal/create-order/route.ts"
    "app/api/paypal/capture-order/route.ts"
    "components/PaymentMethodSelector.tsx"
    "components/CheckoutContent.tsx"
    "app/checkout/page.tsx"
    "app/payment-success/page.tsx"
    "app/payment-cancel/page.tsx"
)

for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file"
    else
        echo "❌ $file"
    fi
done

echo ""
echo "🔍 Checking dependencies..."
echo ""

if grep -q '"nodemailer"' package.json; then
    echo "✅ nodemailer is installed"
else
    echo "⚠️  nodemailer not found, installing..."
    npm install nodemailer
fi

if grep -q '"@paypal/react-paypal-js"' package.json; then
    echo "✅ @paypal/react-paypal-js is installed"
else
    echo "⚠️  @paypal/react-paypal-js not found, installing..."
    npm install @paypal/react-paypal-js
fi

echo ""
echo "✨ Setup verification complete!"
echo ""
echo "📝 Next steps:"
echo "1. Run: npm run dev"
echo "2. Test payment flow at http://localhost:3000"
echo "3. Check console for any errors"
echo "4. Verify emails are being sent"
echo ""
echo "📚 See PAYPAL_INTEGRATION_COMPLETE.md for full documentation"
