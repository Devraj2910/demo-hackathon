# Render.com Deployment Guide

This guide explains how to deploy your Node.js application with Puppeteer to Render.com, focusing specifically on making the WeeklyCrown module's PDF generation work correctly.

## The Chrome/Puppeteer Issue

Puppeteer requires Chrome to generate PDFs. On Render.com, there are specific paths and permissions required to make this work properly. The error you're seeing:

```
Failed to generate weekly report: Could not find Chrome (ver. 136.0.7103.92). This can occur if either
1. you did not perform an installation before running the script (e.g. `npx puppeteer browsers install chrome`) or
2. your cache path is incorrectly configured (which is: /opt/render/.cache/puppeteer).
```

indicates that Puppeteer can't find Chrome in the expected location.

## Solution Overview

We've implemented a multi-layered approach to fix this issue:

1. **Enhanced ReportGeneratorService**: Now tries multiple Chrome paths and falls back to HTML if PDF generation fails
2. **Custom Installation Scripts**: Properly installs Chrome on Render.com
3. **Environment Variable Configuration**: Ensures Puppeteer can find Chrome
4. **Graceful Fallback**: If PDF generation still fails, the system will send an HTML report instead

## Deployment Steps

### 1. Configure Render.com Web Service

In your Render.com dashboard:

1. **Build Command**: Set to `./render-build.sh`
2. **Start Command**: Set to `./render-start.sh`
3. **Environment Variables**:
   - `NODE_ENV=production`
   - `RENDER=true`

### 2. Using Docker (Alternative Approach)

If you prefer to use Docker, create a Dockerfile with Chrome pre-installed:

```dockerfile
FROM node:16

# Install Chrome
RUN apt-get update \
    && apt-get install -y wget gnupg \
    && wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
    && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
    && apt-get update \
    && apt-get install -y google-chrome-stable \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable

CMD ["node", "dist/index.js"]
```

### 3. Troubleshooting

If you continue to experience issues:

#### Check Render.com Logs

Look for these specific log entries:
- "Checking if Chrome needs to be installed..."
- "Attempting to locate Chrome with possible paths:"
- "Successfully launched Chrome using: [path]"

#### Manually Install Chrome

SSH into your Render instance and run:

```
# Check if Chrome is already installed
which google-chrome-stable

# Install Chrome manually if needed
curl -o chrome.deb https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
apt install -y ./chrome.deb
```

#### Update Environment Variables

Add `PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable` to your environment variables.

#### Test PDF Generation Locally

Run `npm run test:weekly-report` to check if PDF generation works locally.

## Understanding the Implementation

### 1. Enhanced Report Generator

The `ReportGeneratorService` now:
- Tries multiple Chrome executable paths
- Provides detailed logging
- Includes an HTML fallback mechanism

### 2. Custom Installation Scripts

- `render-build.sh`: Handles dependencies and Chrome installation
- `render-install-chrome.sh`: Specifically installs Chrome
- `render-start.sh`: Verifies Chrome is available before starting the app

### 3. Environment Variables

We're detecting Render.com's environment using:
- `process.env.RENDER` 
- `process.env.RENDER_INSTANCE_ID`
- `process.env.RENDER_SERVICE_ID`

### 4. HTML Fallback System

If PDF generation fails:
1. An HTML version of the report is generated
2. The email subject indicates it's an HTML version
3. Users still receive all the content, just in HTML format instead of PDF

## Next Steps

After deployment:

1. Monitor logs to ensure Chrome is being found
2. Test the report generation manually
3. Check that emails are being sent properly
4. Verify PDF or HTML fallback reports are received as expected

If you continue to have issues, please check the Render.com documentation or consider using a specialized PDF generation service API instead. 