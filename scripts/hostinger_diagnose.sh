#!/usr/bin/env bash
set -e

ROOT_DIR="$PWD"
PUBLIC_HTML="$HOME/public_html"

echo "Running Hostinger diagnostic script"
echo "App root: $ROOT_DIR"
echo "Public HTML: $PUBLIC_HTML"

echo "\n1) Backup existing .htaccess if present"
if [ -f "$PUBLIC_HTML/.htaccess" ]; then
  echo "Backing up .htaccess -> .htaccess.bak"
  mv "$PUBLIC_HTML/.htaccess" "$PUBLIC_HTML/.htaccess.bak"
else
  echo "No .htaccess found to backup"
fi

echo "\n2) Copy safe .htaccess example to public_html"
if [ -f "$ROOT_DIR/.htaccess.example" ]; then
  cp "$ROOT_DIR/.htaccess.example" "$PUBLIC_HTML/.htaccess"
  echo "Copied .htaccess.example to public_html/.htaccess"
else
  echo "No .htaccess.example found in repo root"
fi

echo "\n3) Ensure permissions: dirs 755, files 644 under public_html"
find "$PUBLIC_HTML" -type d -exec chmod 755 {} + || true
find "$PUBLIC_HTML" -type f -exec chmod 644 {} + || true
echo "Permissions set (directories=755, files=644)"

echo "\n4) Check for index files"
if [ -f "$PUBLIC_HTML/index.html" ] || [ -f "$PUBLIC_HTML/index.php" ]; then
  echo "Index file exists"
else
  echo "No index.html/index.php in public_html — your Node app must be running and proxied."
fi

echo "\n5) Show Node processes and listening ports (requires sudo for some commands)"
ps aux | grep node | grep -v grep || true
ss -tulpn 2>/dev/null | grep LISTEN || true

echo "\n6) Show last 200 lines of common logs (if available)"
if [ -f "$PUBLIC_HTML/error_log" ]; then
  echo "\n-- public_html/error_log --"
  tail -n 200 "$PUBLIC_HTML/error_log" || true
fi

if command -v pm2 >/dev/null 2>&1; then
  echo "\nPM2 status:"
  pm2 status || true
  echo "\nPM2 logs (last 200 lines):"
  pm2 logs --lines 200 || true
fi

echo "\n7) HTTP probe (from server):"
curl -I -v https://$(hostname) || true

echo "\nDiagnostic script finished. Paste outputs above when asking for help."
