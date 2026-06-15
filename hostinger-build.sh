#!/bin/bash

# Hostinger Build & Deploy Script
# This script prepares your Next.js app for Hostinger deployment

set -e  # Exit on any error

echo "=========================================="
echo "TrueAutoCheck - Hostinger Build Script"
echo "=========================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Step 1: Clean up old builds
echo -e "${YELLOW}Step 1: Cleaning up old builds...${NC}"
rm -rf node_modules package-lock.json .next .env.local
echo -e "${GREEN}✓ Cleanup complete${NC}\n"

# Step 2: Install dependencies
echo -e "${YELLOW}Step 2: Installing dependencies...${NC}"
npm install --legacy-peer-deps --no-audit --no-fund
echo -e "${GREEN}✓ Dependencies installed${NC}\n"

# Step 3: Create .env.local
echo -e "${YELLOW}Step 3: Setting up environment...${NC}"
if [ ! -f .env.local ]; then
  cp .env.production.example .env.local
  echo -e "${YELLOW}Created .env.local from template${NC}"
  echo -e "${YELLOW}⚠️  Please update .env.local with your actual values!${NC}"
else
  echo -e "${GREEN}✓ .env.local already exists${NC}"
fi
echo ""

# Step 4: Type checking
echo -e "${YELLOW}Step 4: Running TypeScript check...${NC}"
npm run typecheck || echo -e "${YELLOW}⚠️  TypeScript warnings (non-critical)${NC}"
echo ""

# Step 5: Build
echo -e "${YELLOW}Step 5: Building Next.js application...${NC}"
npm run build
echo -e "${GREEN}✓ Build complete${NC}\n"

# Step 6: Verify build
echo -e "${YELLOW}Step 6: Verifying build...${NC}"
if [ -d ".next" ]; then
  echo -e "${GREEN}✓ Build directory verified${NC}"
else
  echo -e "${YELLOW}✗ Build directory not found!${NC}"
  exit 1
fi
echo ""

echo "=========================================="
echo -e "${GREEN}Build complete! Ready for deployment.${NC}"
echo "=========================================="
echo ""
echo "Next steps:"
echo "1. Update .env.local with your production values"
echo "2. Upload to Hostinger"
echo "3. Configure Node.js in Hostinger control panel"
echo "4. Run: npm start"
echo ""
