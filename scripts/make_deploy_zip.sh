#!/usr/bin/env bash
set -e

# Create a production deploy zip including the Next.js build and minimum required files
# Usage: ./scripts/make_deploy_zip.sh

ROOT_DIR=$(cd "$(dirname "$0")/.." && pwd)
cd "$ROOT_DIR"

echo "Installing production dependencies..."
npm ci --production

echo "Building Next.js app..."
npm run build

ZIP_NAME=deploy.zip
echo "Creating $ZIP_NAME (this may be large)..."
zip -r "$ZIP_NAME" .next package.json public hostinger-start.js ecosystem.config.js .htaccess -x "node_modules/*" "**/.*.swp"

echo "Created $ROOT_DIR/$ZIP_NAME"
