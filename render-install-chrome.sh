#!/bin/bash
set -e

echo "Installing Chrome for Render.com deployment..."

# Create Chrome directory in the project
CHROME_DIR="/opt/render/project/chrome"
mkdir -p $CHROME_DIR

# Install dependencies
apt-get update
apt-get install -y wget gnupg2 apt-utils

# Add Google Chrome repository
wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add -
echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" > /etc/apt/sources.list.d/google-chrome.list

# Install Chrome
apt-get update
apt-get install -y google-chrome-stable

# Create a symlink to the Chrome executable in our target directory
ln -sf /usr/bin/google-chrome-stable $CHROME_DIR/chrome

# Make it executable
chmod +x $CHROME_DIR/chrome

# Verify installation
echo "Chrome installation complete. Verifying..."
$CHROME_DIR/chrome --version

# Set environment variable
echo "PUPPETEER_EXECUTABLE_PATH=$CHROME_DIR/chrome" >> .env

echo "Chrome installation and configuration complete!" 