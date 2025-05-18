# Puppeteer Configuration for Render.com

This document explains how to configure Puppeteer to work correctly on Render.com for PDF generation in the WeeklyCrown module.

## Issue

When deploying to Render.com, you may encounter the following error:

```
Failed to generate weekly report: Could not find Chrome (ver. 136.0.7103.92). 
This can occur if either
1. you did not perform an installation before running the script (e.g. `npx puppeteer browsers install chrome`) or
2. your cache path is incorrectly configured (which is: /opt/render/.cache/puppeteer).
```

## Solution

We've implemented several changes to fix this issue:

1. Added a `postinstall` script in `package.json` to automatically install Chrome during deployment
2. Created Render.com specific build and start scripts
3. Modified the `ReportGeneratorService` to look for Chrome in the right locations
4. Added proper error handling and logging for Puppeteer

## Render.com Configuration

### 1. Build Command

In your Render.com service configuration, set the build command to:

```
./render-build.sh
```

### 2. Start Command

Set the start command to:

```
./render-start.sh
```

### 3. Environment Variables

Add these environment variables:

```
NODE_ENV=production
```

### 4. Pre-existing Chrome (Alternative Approach)

If the automatic installation doesn't work, you can configure Render.com to use a pre-installed version of Chrome:

1. Use a Docker image that includes Chrome
2. Set `PUPPETEER_EXECUTABLE_PATH` to the Chrome binary path on the server (typically `/usr/bin/google-chrome-stable`)

## Verifying Installation

To verify that Chrome is correctly installed and accessible by Puppeteer:

1. Access the logs in your Render.com dashboard
2. Look for "Chrome installation path:" in the build logs
3. Check for successful PDF generation in the application logs

## Troubleshooting

If you still encounter issues:

1. Check if Chrome is installed:
   ```
   which google-chrome-stable
   ```

2. Try installing Chrome manually:
   ```
   npx puppeteer browsers install chrome
   ```

3. Verify the Puppeteer cache directory:
   ```
   ls -la /opt/render/.cache/puppeteer
   ```

4. Test Puppeteer directly:
   ```
   node -e "require('puppeteer').launch().then(browser => { console.log('Puppeteer works!'); browser.close(); })"
   ```

## Reverting to Alternative PDF Generation (If Needed)

If you can't get Puppeteer working, you could fallback to other PDF generation methods:

1. Use a PDF generation API service
2. Use serverless functions specifically for PDF generation
3. Consider libraries with fewer dependencies like PDFKit 