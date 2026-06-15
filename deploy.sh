#!/bin/bash
# Hostinger deployment script
# This script helps with dependencies installation

echo "Installing dependencies for Hostinger..."

# Clear npm cache
npm cache clean --force

# Remove old node_modules
rm -rf node_modules package-lock.json

# Install with proper settings
npm install --legacy-peer-deps --no-audit --no-fund

# Build the Next.js app
npm run build

echo "Deployment setup complete!"
