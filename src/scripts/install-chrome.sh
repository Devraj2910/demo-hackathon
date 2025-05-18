#!/bin/bash

# Install latest Chrome
echo "Installing Chrome..."
apt-get update
apt-get install -y wget gnupg2
wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add -
echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list
apt-get update
apt-get install -y google-chrome-stable

# Print Chrome version
google-chrome-stable --version

# Export Chrome path for Puppeteer
echo "PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable" >> .env
echo "Chrome installation complete. Path: /usr/bin/google-chrome-stable" 