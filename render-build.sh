#!/usr/bin/env bash
# Exit on error
set -e

echo "Starting Render.com build process..."

# Install dependencies
npm ci

# Build application
npm run build

# Install Chrome browser for Puppeteer
echo "Installing Chrome for Puppeteer..."
if [[ $RENDER_SERVICE_TYPE == "web" ]]; then
  # We are in a Render.com web service, where we have sudo permissions
  echo "Running in Render web service, using sudo to install Chrome..."
  sudo bash ./render-install-chrome.sh
else
  # We are in a different environment or don't have sudo access
  echo "Using Puppeteer built-in browser installation..."
  npx puppeteer browsers install chrome
fi

# Verify Chrome installation
echo "Chrome installation path:"
if [[ -f "/opt/render/project/chrome/chrome" ]]; then
  echo "Found Chrome at /opt/render/project/chrome/chrome"
  export PUPPETEER_EXECUTABLE_PATH="/opt/render/project/chrome/chrome"
  echo "PUPPETEER_EXECUTABLE_PATH=/opt/render/project/chrome/chrome" >> .env
elif [[ -f "/usr/bin/google-chrome-stable" ]]; then
  echo "Found Chrome at /usr/bin/google-chrome-stable"
  export PUPPETEER_EXECUTABLE_PATH="/usr/bin/google-chrome-stable"
  echo "PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable" >> .env
else
  # Let Puppeteer use its default path
  export PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=false
  CHROME_PATH=$(node -e "console.log(require('puppeteer').executablePath())")
  echo "Using Puppeteer default Chrome at: $CHROME_PATH"
  echo "PUPPETEER_EXECUTABLE_PATH=$CHROME_PATH" >> .env
fi

# Create config file for Chrome detection
cat > src/clean-architecture/modules/weeklyCrown/config/puppeteer-config.json <<EOL
{
  "chromePath": "$PUPPETEER_EXECUTABLE_PATH",
  "installTime": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")"
}
EOL

echo "Build process complete!" 