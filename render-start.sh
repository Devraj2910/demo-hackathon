#!/usr/bin/env bash
# Exit on error
set -e

# Verify Chrome installation
echo "Chrome installation path:"
node -e "console.log(require('puppeteer').executablePath())"

# Start the application
node dist/index.js 