#!/bin/bash

# Hostinger Post-Install Script
# Run this on Hostinger after npm install completes

echo "Running post-install setup..."

# Ensure build directory exists
if [ ! -d ".next" ]; then
  echo "Building Next.js application..."
  npm run build
fi

# Check environment variables
if [ ! -f ".env.local" ]; then
  echo "⚠️  Warning: .env.local not found"
  echo "Creating template from .env.production.example..."
  cp .env.production.example .env.local
  echo "Please update .env.local with your actual values"
fi

echo "✓ Post-install complete"
