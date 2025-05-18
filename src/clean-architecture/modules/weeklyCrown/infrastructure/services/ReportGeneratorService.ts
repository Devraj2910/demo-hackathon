import { GetAnalyticsDashboardResponseDto, TeamAnalyticsDto, TitleAnalyticsDto, TopUserDto } from '../../../analytics/application/useCases/getAnalyticsDashboard/GetAnalyticsDashboardResponseDto';
import puppeteer from 'puppeteer';
import { promises as fs } from 'fs';
import * as path from 'path';
import * as os from 'os';
import dotenv from 'dotenv';
import * as crypto from 'crypto';

// Load environment variables
dotenv.config();

export class ReportGeneratorService {
  private static instance: ReportGeneratorService;

  private constructor() {}

  public static getInstance(): ReportGeneratorService {
    if (!ReportGeneratorService.instance) {
      ReportGeneratorService.instance = new ReportGeneratorService();
    }
    return ReportGeneratorService.instance;
  }

  /**
   * Generate an HTML report from analytics dashboard data
   * @param data The dashboard data
   * @param startDate Start date of the report period
   * @param endDate End date of the report period
   * @returns HTML content for the report
   */
  public generateHtmlReport(
    data: GetAnalyticsDashboardResponseDto,
    startDate: string,
    endDate: string
  ): string {
    const formattedStartDate = new Date(startDate).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    const formattedEndDate = new Date(endDate).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    // Generate HTML for top receivers table
    const topReceiversHtml = this.generateTopUsersTable(data.topReceivers, 'Top Receivers');
    
    // Generate HTML for top creators table
    const topCreatorsHtml = this.generateTopUsersTable(data.topCreators, 'Top Creators');
    
    // Generate HTML for team analytics
    const teamAnalyticsHtml = this.generateTeamAnalyticsTable(data.teamAnalytics);
    
    // Generate HTML for title analytics
    const titleAnalyticsHtml = this.generateTitleAnalyticsTable(data.titleAnalytics);
    
    // Generate monthly analytics chart data
    const monthlyChartData = JSON.stringify(data.monthlyAnalytics);

    // Build the full HTML report
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Weekly Recognition Report: ${formattedStartDate} - ${formattedEndDate}</title>
        <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
          }
          .container {
            padding: 20px;
            border: 1px solid #ddd;
            border-radius: 5px;
            background-color: #fff;
          }
          .header {
            background-color: #f5f5f5;
            padding: 15px;
            text-align: center;
            border-bottom: 1px solid #ddd;
            margin-bottom: 20px;
          }
          .section {
            margin-bottom: 30px;
            padding: 15px;
            background-color: #f9f9f9;
            border-radius: 5px;
          }
          h1, h2, h3 {
            color: #2c3e50;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
          }
          th, td {
            padding: 10px;
            border: 1px solid #ddd;
            text-align: left;
          }
          th {
            background-color: #f2f2f2;
            font-weight: bold;
          }
          tr:nth-child(even) {
            background-color: #f9f9f9;
          }
          .summary-box {
            display: flex;
            justify-content: space-around;
            margin-bottom: 20px;
          }
          .summary-item {
            flex: 1;
            padding: 15px;
            background-color: #e3f2fd;
            border-radius: 5px;
            margin: 0 10px;
            text-align: center;
          }
          .summary-item h3 {
            margin-top: 0;
          }
          .chart-container {
            height: 300px;
            margin-bottom: 30px;
          }
          .footer {
            text-align: center;
            color: #777;
            font-size: 12px;
            margin-top: 30px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Weekly Recognition Report</h1>
            <h2>${formattedStartDate} - ${formattedEndDate}</h2>
          </div>
          
          <div class="summary-box">
            <div class="summary-item">
              <h3>Total Cards</h3>
              <p style="font-size: 24px; font-weight: bold;">${data.cardVolume.total}</p>
            </div>
            <div class="summary-item">
              <h3>Active Users</h3>
              <p style="font-size: 24px; font-weight: bold;">${data.activeUsers.activeUsers}</p>
            </div>
          </div>
          
          <div class="section">
            <h2>Monthly Activity</h2>
            <div class="chart-container">
              <canvas id="monthlyChart"></canvas>
            </div>
          </div>
          
          <div class="section">
            <h2>Team Performance</h2>
            <div class="chart-container">
              <canvas id="teamChart"></canvas>
            </div>
            ${teamAnalyticsHtml}
          </div>
          
          <div class="section">
            <h2>Top Users</h2>
            <div style="display: flex; justify-content: space-between;">
              <div style="width: 48%;">
                ${topCreatorsHtml}
              </div>
              <div style="width: 48%;">
                ${topReceiversHtml}
              </div>
            </div>
          </div>
          
          <div class="section">
            <h2>Recognition by Title</h2>
            <div class="chart-container">
              <canvas id="titleChart"></canvas>
            </div>
            ${titleAnalyticsHtml}
          </div>
          
          <div class="footer">
            <p>This is an automatically generated report. © ${new Date().getFullYear()} Recognition App</p>
          </div>
        </div>
        
        <script>
          // Monthly activity chart
          const monthlyData = ${monthlyChartData};
          const months = monthlyData.map(item => item.month);
          const activeUsers = monthlyData.map(item => item.activeUsers);
          const cardsCreated = monthlyData.map(item => item.cardsCreated);
          
          new Chart(document.getElementById('monthlyChart'), {
            type: 'line',
            data: {
              labels: months,
              datasets: [
                {
                  label: 'Active Users',
                  data: activeUsers,
                  borderColor: '#4285F4',
                  backgroundColor: 'rgba(66, 133, 244, 0.1)',
                  fill: true,
                  tension: 0.3
                },
                {
                  label: 'Cards Created',
                  data: cardsCreated,
                  borderColor: '#EA4335',
                  backgroundColor: 'rgba(234, 67, 53, 0.1)',
                  fill: true,
                  tension: 0.3
                }
              ]
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                title: {
                  display: true,
                  text: 'Monthly Activity Trends'
                }
              }
            }
          });
          
          // Team performance chart
          const teamData = ${JSON.stringify(data.teamAnalytics)};
          new Chart(document.getElementById('teamChart'), {
            type: 'bar',
            data: {
              labels: teamData.map(item => item.name),
              datasets: [{
                label: 'Cards Count',
                data: teamData.map(item => item.cardCount),
                backgroundColor: 'rgba(75, 192, 192, 0.7)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
              }]
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                title: {
                  display: true,
                  text: 'Recognition Cards by Team'
                }
              },
              scales: {
                y: {
                  beginAtZero: true
                }
              }
            }
          });
          
          // Title analytics chart
          const titleData = ${JSON.stringify(data.titleAnalytics)};
          new Chart(document.getElementById('titleChart'), {
            type: 'doughnut',
            data: {
              labels: titleData.map(item => item.title),
              datasets: [{
                data: titleData.map(item => item.count),
                backgroundColor: [
                  'rgba(255, 99, 132, 0.7)',
                  'rgba(54, 162, 235, 0.7)',
                  'rgba(255, 206, 86, 0.7)',
                  'rgba(75, 192, 192, 0.7)',
                  'rgba(153, 102, 255, 0.7)',
                  'rgba(255, 159, 64, 0.7)',
                  'rgba(199, 199, 199, 0.7)'
                ]
              }]
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                title: {
                  display: true,
                  text: 'Recognition by Title'
                }
              }
            }
          });
        </script>
      </body>
      </html>
    `;
  }

  private generateTopUsersTable(users: TopUserDto[], title: string): string {
    return `
      <h3>${title}</h3>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Cards</th>
          </tr>
        </thead>
        <tbody>
          ${users.map(user => `
            <tr>
              <td>${user.firstName || ''} ${user.lastName || ''}</td>
              <td>${user.cardCount}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
  }

  private generateTeamAnalyticsTable(teams: TeamAnalyticsDto[]): string {
    return `
      <table>
        <thead>
          <tr>
            <th>Team</th>
            <th>Cards</th>
          </tr>
        </thead>
        <tbody>
          ${teams.map(team => `
            <tr>
              <td>${team.name}</td>
              <td>${team.cardCount}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
  }

  private generateTitleAnalyticsTable(titles: TitleAnalyticsDto[]): string {
    return `
      <table>
        <thead>
          <tr>
            <th>Recognition Title</th>
            <th>Count</th>
          </tr>
        </thead>
        <tbody>
          ${titles.map(title => `
            <tr>
              <td>${title.title}</td>
              <td>${title.count}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
  }

  /**
   * Generate a PDF report from the HTML report
   */
  public async generatePdfReport(
    data: GetAnalyticsDashboardResponseDto,
    startDate: string,
    endDate: string
  ): Promise<Buffer> {
    // First generate HTML
    const htmlContent = this.generateHtmlReport(data, startDate, endDate);
    
    // Create a temporary file to store HTML
    const tempDir = os.tmpdir();
    const tempFilePath = path.join(tempDir, `report-${Date.now()}.html`);
    
    try {
      // Write HTML to temp file
      await fs.writeFile(tempFilePath, htmlContent);

      // Try to install Chrome browser if needed (Render.com specific)
      try {
        console.log('Checking if Chrome needs to be installed...');
        await this.ensureChromium();
      } catch (installError) {
        console.error('Error during Chrome installation check:', installError);
        // Continue anyway, as we'll check executable paths below
      }

      try {
        // Get possible Chrome paths
        const possibleChromePaths = [
          // Explicitly provided path
          process.env.PUPPETEER_EXECUTABLE_PATH,
          // Standard Linux Chrome path
          '/usr/bin/google-chrome-stable',
          // Standard Render path 
          '/opt/render/project/chrome/chrome',
          // Puppeteer's bundled browser path (let it find automatically)
          undefined
        ];

        // Log for debugging
        console.log('Attempting to locate Chrome with possible paths:', possibleChromePaths.filter(Boolean));

        // Try each Chrome path until one works
        let browser;
        let usedPath;
        let error;

        for (const executablePath of possibleChromePaths) {
          if (!executablePath && browser) continue; // Skip undefined if we already have a browser

          const launchOptions: any = {
            args: [
              '--no-sandbox',
              '--disable-setuid-sandbox',
              '--disable-dev-shm-usage',
              '--disable-gpu',
              '--disable-features=site-per-process',
              '--disable-extensions'
            ],
            headless: true
          };

          if (executablePath) {
            console.log(`Trying Chrome at: ${executablePath}`);
            launchOptions.executablePath = executablePath;
          } else {
            console.log('Trying Puppeteer default browser location');
          }

          try {
            browser = await puppeteer.launch(launchOptions);
            usedPath = executablePath || 'default puppeteer path';
            console.log(`Successfully launched Chrome using: ${usedPath}`);
            break;
          } catch (err: any) {
            error = err;
            console.log(`Failed to launch with path ${executablePath || 'default'}: ${err.message}`);
          }
        }

        if (!browser) {
          throw new Error(`Failed to launch Chrome with any available path: ${error?.message || 'unknown error'}`);
        }

        // Browser launched successfully, continue with page creation
        const page = await browser.newPage();
        
        // Load HTML file
        await page.goto(`file://${tempFilePath}`, {
          waitUntil: 'networkidle0',
        });
        
        // Wait for charts to render
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Generate PDF
        const pdfBuffer = await page.pdf({
          format: 'A4',
          printBackground: true,
          margin: {
            top: '20px',
            right: '20px',
            bottom: '20px',
            left: '20px',
          },
        });
        
        await browser.close();
        
        // Convert Uint8Array to Buffer
        return Buffer.from(pdfBuffer);
      } catch (puppeteerError) {
        console.error('Puppeteer PDF generation failed, falling back to HTML:', puppeteerError);
        
        // Fall back to HTML if Puppeteer fails
        return this.generateHtmlFallback(data, startDate, endDate);
      }
    } catch (error) {
      console.error('Error generating PDF:', error);
      throw error;
    } finally {
      // Clean up temp file
      try {
        await fs.unlink(tempFilePath);
      } catch (error) {
        console.error('Error deleting temp file:', error);
      }
    }
  }

  /**
   * Generate an HTML fallback when PDF generation fails
   * This allows the report to still be sent, even if as HTML instead of PDF
   */
  private async generateHtmlFallback(
    data: GetAnalyticsDashboardResponseDto,
    startDate: string,
    endDate: string
  ): Promise<Buffer> {
    console.log('Generating HTML fallback instead of PDF');
    
    // Get the HTML report content
    const htmlContent = this.generateHtmlReport(data, startDate, endDate);
    
    // Create a fallback message at the top
    const fallbackMessage = `
      <div style="background-color: #ffebee; padding: 15px; margin-bottom: 20px; border-left: 4px solid #f44336; font-family: Arial, sans-serif;">
        <h3 style="color: #d32f2f; margin-top: 0;">PDF Generation Failed</h3>
        <p>We encountered an issue generating your report as a PDF. The HTML version is provided below instead.</p>
        <p>Our team has been notified and is working to resolve this issue.</p>
      </div>
    `;
    
    // Insert the fallback message after the opening body tag
    const htmlWithFallback = htmlContent.replace('<body>', '<body>' + fallbackMessage);
    
    // Convert HTML to Buffer and return
    return Buffer.from(htmlWithFallback);
  }

  /**
   * Ensure Chromium is installed for Puppeteer to use
   * This is specifically for Render.com deployments
   */
  private async ensureChromium(): Promise<void> {
    // Check if we're in Render environment
    const isRenderEnvironment = process.env.RENDER === 'true' || 
                              !!process.env.RENDER_INSTANCE_ID ||
                              !!process.env.RENDER_SERVICE_ID;
    
    if (!isRenderEnvironment) {
      console.log('Not running in Render environment, skipping Chrome installation check');
      return;
    }

    console.log('Running in Render environment, checking for Chrome installation');
    
    try {
      // Try to get the executable path to see if it's already installed
      const defaultExecutablePath = process.env.PUPPETEER_EXECUTABLE_PATH;
      if (defaultExecutablePath && await this.fileExists(defaultExecutablePath)) {
        console.log(`Chrome already installed at: ${defaultExecutablePath}`);
        return;
      }
      
      // Try standard Linux Chrome location
      if (await this.fileExists('/usr/bin/google-chrome-stable')) {
        console.log('Chrome found at /usr/bin/google-chrome-stable');
        process.env.PUPPETEER_EXECUTABLE_PATH = '/usr/bin/google-chrome-stable';
        return;
      }

      // If Chrome is not found, try to install it
      console.log('Chrome not found, attempting to install...');
      
      // Run the installer script
      const { execSync } = require('child_process');
      execSync('npx puppeteer browsers install chrome', {
        stdio: 'inherit'
      });
      
      console.log('Chrome installation completed');
      
      // Check if the installation was successful
      // Update the PUPPETEER_EXECUTABLE_PATH
      const installedPath = require('puppeteer').executablePath();
      console.log(`Installed Chrome path: ${installedPath}`);
      process.env.PUPPETEER_EXECUTABLE_PATH = installedPath;
    } catch (error) {
      console.error('Error installing Chrome:', error);
      throw error;
    }
  }

  /**
   * Check if a file exists
   */
  private async fileExists(filePath: string): Promise<boolean> {
    try {
      await fs.access(filePath);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Generate a simple HTML preview for email body
   */
  public generateEmailPreview(
    data: GetAnalyticsDashboardResponseDto,
    startDate: string,
    endDate: string
  ): string {
    const formattedStartDate = new Date(startDate).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    const formattedEndDate = new Date(endDate).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background-color: #f5f5f5; padding: 15px; text-align: center; border-bottom: 1px solid #ddd; margin-bottom: 20px;">
          <h1 style="color: #2c3e50; margin: 0;">Weekly Recognition Report</h1>
          <h2 style="color: #2c3e50; margin-top: 10px;">${formattedStartDate} - ${formattedEndDate}</h2>
        </div>
        
        <div style="display: flex; justify-content: space-around; margin-bottom: 20px;">
          <div style="flex: 1; padding: 15px; background-color: #e3f2fd; border-radius: 5px; margin: 0 10px; text-align: center;">
            <h3 style="margin-top: 0;">Total Cards</h3>
            <p style="font-size: 24px; font-weight: bold;">${data.cardVolume.total}</p>
          </div>
          <div style="flex: 1; padding: 15px; background-color: #e3f2fd; border-radius: 5px; margin: 0 10px; text-align: center;">
            <h3 style="margin-top: 0;">Active Users</h3>
            <p style="font-size: 24px; font-weight: bold;">${data.activeUsers.activeUsers}</p>
          </div>
        </div>
        
        <p style="margin: 20px 0; font-size: 16px;">
          Your weekly recognition report is attached as a PDF. This report includes detailed analytics with interactive charts showing:
        </p>
        
        <ul style="margin-bottom: 20px; padding-left: 20px;">
          <li>Monthly activity trends</li>
          <li>Team performance comparisons</li>
          <li>Top creators and receivers</li>
          <li>Recognition by title breakdown</li>
        </ul>
        
        <p style="margin: 20px 0; font-size: 16px;">
          Please open the attached PDF to view the complete report with all visualizations and data.
        </p>
        
        <div style="text-align: center; color: #777; font-size: 12px; margin-top: 30px; border-top: 1px solid #ddd; padding-top: 20px;">
          <p>This is an automatically generated report. © ${new Date().getFullYear()} Recognition App</p>
        </div>
      </div>
    `;
  }
} 