#!/usr/bin/env bash
# Exit on error
set -e

# Install dependencies
npm ci

# Build application
npm run build

# Install Chrome browser for Puppeteer
echo "Installing Chrome for Puppeteer..."
npx puppeteer browsers install chrome

# Verify Chrome installation
echo "Chrome installation path:"
node -e "console.log(require('puppeteer').executablePath())"

# Create .env file entry for PUPPETEER_EXECUTABLE_PATH if it doesn't exist
if ! grep -q PUPPETEER_EXECUTABLE_PATH .env 2>/dev/null; then
  CHROME_PATH=$(node -e "console.log(require('puppeteer').executablePath())")
  echo "PUPPETEER_EXECUTABLE_PATH=$CHROME_PATH" >> .env
  echo "Added PUPPETEER_EXECUTABLE_PATH to .env file"
fi 