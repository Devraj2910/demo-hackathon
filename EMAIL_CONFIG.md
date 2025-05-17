# Email Configuration for Registration Approval

This system implements an email-based approval process for new user registrations. When a new user registers, an email is sent to the administrator for approval. Once approved, the user receives a welcome email with login instructions.

## Email Service Setup

### Using Mailjet

This application uses Mailjet for sending emails. To set up Mailjet:

1. Create an account at [Mailjet](https://www.mailjet.com/)
2. Get your API Key and Secret Key from: https://app.mailjet.com/account/api_keys
3. Run the setup script to configure your environment:
   ```
   npm run setup:mailjet
   ```
4. Or manually add the following to your `.env` file:
   ```
   # Mailjet Email Configuration
   MAILJET_API_KEY=your_api_key_here
   MAILJET_SECRET_KEY=your_secret_key_here
   EMAIL_FROM_ADDRESS=your_verified_sender_email@example.com
   EMAIL_FROM_NAME=Recognition App
   FRONTEND_URL=http://localhost:3000
   ```

**Important Notes:**
- In Mailjet, you need to verify your sender domain or email address before you can send emails.
- For testing, you can use Mailjet's sandbox mode, but emails will only be delivered to verified recipients.

## Testing the Email Service

To test your Mailjet configuration:

```
npm run test:mailjet
```

This will attempt to send a test email and show the response.

## Implementation Details

The email service is implemented in `src/services/email.service.ts` and provides the following functionality:

1. **Registration Email**: When a user registers, an email is sent to `devraj.rajput@avestatechnologies.com` with details about the new user and a "Grant Access" button.

2. **Welcome Email**: When admin approves a user's access by clicking the "Grant Access" button, a welcome email is automatically sent to the user with login instructions.

## Testing the Email Flow

To test the full registration and approval flow:

1. Set up the environment variables
2. Register a new user
3. Check the admin email for the approval request
4. Click the "Grant Access" button
5. The user should receive a welcome email, and the browser should redirect to the login page

## Security Considerations

- The grant access link contains a user ID which is used to identify the user to approve
- The link is one-time use and becomes invalid after it's used
- Admin authentication is required to access the grant-access endpoint in a production environment 