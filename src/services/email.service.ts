import Mailjet from 'node-mailjet';
import dotenv from 'dotenv';

dotenv.config();

interface Attachment {
  filename: string;
  content: Buffer | string;
  contentType: string;
}

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  attachments?: Attachment[];
}

export class EmailService {
  private static instance: EmailService;
  private mailjet: Mailjet;

  private constructor() {
    // Initialize Mailjet client
    this.mailjet = Mailjet.apiConnect(
      "33fb87c3bdaa970f4b81081f746a9c89",
      "04bacb1393ff94f9cbd2f40172d649a2"
    );
  }

  public static getInstance(): EmailService {
    if (!EmailService.instance) {
      EmailService.instance = new EmailService();
    }
    return EmailService.instance;
  }

  /**
   * Send an email
   * @param options Email options
   * @returns Promise resolving to the information about the sent email
   */
  public async sendEmail(options: EmailOptions): Promise<any> {
    const fromEmail = process.env.EMAIL_FROM_ADDRESS || 'devraj.rajput@avestatechnologies.com';
    const fromName = process.env.EMAIL_FROM_NAME || 'Recognition App';

    try {
      const message: any = {
        From: {
          Email: fromEmail,
          Name: fromName
        },
        To: [
          {
            Email: options.to,
            Name: options.to.split('@')[0] // Use part before @ as name
          }
        ],
        Subject: options.subject,
        HTMLPart: options.html
      };

      // Add attachments if provided
      if (options.attachments && options.attachments.length > 0) {
        message.Attachments = options.attachments.map(attachment => {
          // Convert Buffer to Base64 if needed
          const content = Buffer.isBuffer(attachment.content)
            ? attachment.content.toString('base64')
            : attachment.content;
            
          return {
            ContentType: attachment.contentType,
            Filename: attachment.filename,
            Base64Content: content
          };
        });
      }

      const request = this.mailjet.post('send', { version: 'v3.1' }).request({
        Messages: [message]
      });

      const result = await request;
      return result.body;
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  }

  /**
   * Send an access grant email when a new user registers
   * @param newUserEmail Email of the newly registered user
   * @param newUserName Name of the newly registered user
   * @param userId ID of the newly registered user
   * @param baseUrl Base URL of the application for constructing links
   * @returns Promise resolving to the information about the sent email
   */
  public async sendAccessGrantEmail(
    newUserEmail: string,
    newUserName: string,
    userId: string,
    baseUrl: string
  ): Promise<any> {
    const adminEmail = process.env.WEEKLY_REPORT_RECIPIENT || 'devraj.rajput@avestatechnologies.com';
    const loginUrl = `${baseUrl}`;
    const grantAccessUrl = `${baseUrl}/admin`;
    // Admin dashboard URL
    const adminDashboardUrl = `${baseUrl}/kudowall`;

    const emailTemplate = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>⚠️ ACTION REQUIRED: New User Registration</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
          }
          .container {
            padding: 20px;
            border: 1px solid #ddd;
            border-radius: 5px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
          }
          .header {
            background-color: #0056b3;
            padding: 15px;
            text-align: center;
            border-radius: 5px 5px 0 0;
            color: white;
            margin-bottom: 0;
          }
          .content {
            padding: 25px;
            background-color: #f9f9f9;
          }
          .user-info {
            background-color: white;
            border-left: 4px solid #0056b3;
            padding: 15px;
            margin: 15px 0;
          }
          .action-needed {
            background-color: #ffebee;
            border-left: 4px solid #e53935;
            padding: 15px;
            margin: 20px 0;
            font-weight: bold;
          }
          .button-container {
            text-align: center;
            margin: 25px 0;
          }
          .primary-button {
            display: inline-block;
            padding: 12px 24px;
            background-color: #4CAF50;
            color: white;
            text-decoration: none;
            border-radius: 4px;
            font-weight: bold;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
          }
          .secondary-button {
            display: inline-block;
            padding: 12px 24px;
            background-color: #2196F3;
            color: white;
            text-decoration: none;
            border-radius: 4px;
            font-weight: bold;
            margin-top: 15px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
          }
          .footer {
            margin-top: 30px;
            text-align: center;
            font-size: 12px;
            color: #777;
            border-top: 1px solid #ddd;
            padding-top: 20px;
          }
          .timestamp {
            font-size: 12px;
            color: #999;
            margin-top: 10px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>⚠️ New User Registration - Action Required</h2>
          </div>
          <div class="content">
            <p>Hello Admin,</p>
            
            <div class="action-needed">
              A new user is awaiting your approval to access the platform.
            </div>
            
            <div class="user-info">
              <h3>User Details:</h3>
              <ul>
                <li><strong>Name:</strong> ${newUserName}</li>
                <li><strong>Email:</strong> ${newUserEmail}</li>
                <li><strong>User ID:</strong> ${userId}</li>
                <li><strong>Registration Date:</strong> ${new Date().toLocaleString()}</li>
              </ul>
            </div>
            
            <p>Please review this registration request and grant access if appropriate.</p>
            
            <div class="button-container">
              <a href="${grantAccessUrl}" class="primary-button">Grant Access Now</a>
              <div style="margin-top: 15px;">or</div>
              <a href="${adminDashboardUrl}" class="secondary-button">Go to Admin Dashboard</a>
            </div>
            
            <p>After approving, the user will be notified that they can log in at <a href="${loginUrl}">${loginUrl}</a>.</p>
            
            <div class="timestamp">
              This request was received on ${new Date().toLocaleString()}.
            </div>
          </div>
          <div class="footer">
            <p>This is an automated message from the Recognition App system. Please do not reply.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    return this.sendEmail({
      to: adminEmail,
      subject: '⚠️ ACTION REQUIRED: New User Registration Awaiting Approval',
      html: emailTemplate,
    });
  }

  /**
   * Send a welcome email to a user after their access has been granted
   * @param userEmail Email of the user
   * @param userName Name of the user
   * @param baseUrl Base URL of the application for constructing links
   * @returns Promise resolving to the information about the sent email
   */
  public async sendWelcomeEmail(
    userEmail: string,
    userName: string,
    baseUrl: string
  ): Promise<any> {
    const loginUrl = `${baseUrl}/login`;

    const emailTemplate = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Welcome to Our Platform</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
          }
          .container {
            padding: 20px;
            border: 1px solid #ddd;
            border-radius: 5px;
          }
          .header {
            background-color: #f5f5f5;
            padding: 10px;
            text-align: center;
            border-bottom: 1px solid #ddd;
          }
          .content {
            padding: 20px;
          }
          .button {
            display: inline-block;
            padding: 10px 20px;
            background-color: #4CAF50;
            color: white;
            text-decoration: none;
            border-radius: 4px;
            margin-top: 20px;
          }
          .footer {
            margin-top: 20px;
            text-align: center;
            font-size: 12px;
            color: #777;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>Welcome to Our Platform!</h2>
          </div>
          <div class="content">
            <p>Hello ${userName},</p>
            <p>Your account has been approved and you now have full access to our platform.</p>
            <p>You can log in using your registered email and password.</p>
            <a href="${loginUrl}" class="button">Login Now</a>
            <p>If you have any questions or need assistance, please contact our support team.</p>
          </div>
          <div class="footer">
            <p>Thank you for joining us!</p>
          </div>
        </div>
      </body>
      </html>
    `;

    return this.sendEmail({
      to: userEmail,
      subject: 'Welcome - Your Account Has Been Approved',
      html: emailTemplate,
    });
  }
} 