@echo off
REM PayPal Integration Setup Test Script for Windows
REM This script verifies your PayPal integration setup

echo.
echo 🔍 Checking PayPal Integration Setup...
echo.

REM Check if .env.local exists
if not exist ".env.local" (
    echo ❌ .env.local file not found!
    pause
    exit /b 1
)

echo ✅ .env.local file exists

REM Check for PayPal credentials in .env.local
findstr /C:"NEXT_PUBLIC_PAYPAL_CLIENT_ID=" .env.local >nul
if %errorlevel% equ 0 (
    echo ✅ PayPal Client ID found
) else (
    echo ❌ PayPal Client ID not found in .env.local
)

findstr /C:"PAYPAL_SECRET_KEY=" .env.local >nul
if %errorlevel% equ 0 (
    echo ✅ PayPal Secret Key found
) else (
    echo ❌ PayPal Secret Key not found in .env.local
)

REM Check for Email credentials
findstr /C:"SMTP_USER=" .env.local >nul
if %errorlevel% equ 0 (
    echo ✅ SMTP User found
) else (
    echo ❌ SMTP User not found in .env.local
)

findstr /C:"SMTP_PASS=" .env.local >nul
if %errorlevel% equ 0 (
    echo ✅ SMTP Password found
) else (
    echo ❌ SMTP Password not found in .env.local
)

echo.
echo 🔍 Checking required files...
echo.

setlocal enabledelayedexpansion

set "files[0]=lib\paypal.ts"
set "files[1]=lib\email.ts"
set "files[2]=app\api\paypal\create-order\route.ts"
set "files[3]=app\api\paypal\capture-order\route.ts"
set "files[4]=components\PaymentMethodSelector.tsx"
set "files[5]=components\CheckoutContent.tsx"
set "files[6]=app\checkout\page.tsx"
set "files[7]=app\payment-success\page.tsx"
set "files[8]=app\payment-cancel\page.tsx"

for /l %%i in (0,1,8) do (
    if exist "!files[%%i]!" (
        echo ✅ !files[%%i]!
    ) else (
        echo ❌ !files[%%i]!
    )
)

echo.
echo ✨ Setup verification complete!
echo.
echo 📝 Next steps:
echo 1. Run: npm run dev
echo 2. Test payment flow at http://localhost:3000
echo 3. Check console for any errors
echo 4. Verify emails are being sent
echo.
echo 📚 See PAYPAL_INTEGRATION_COMPLETE.md for full documentation
echo.

pause
