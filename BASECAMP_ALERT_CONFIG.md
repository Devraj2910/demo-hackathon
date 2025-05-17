# Basecamp Chat Integration for Card Notifications

This application integrates with Basecamp's Chat API to send real-time notifications when users create recognition cards.

## Overview

The integration uses Basecamp's Chatbot API to post messages directly to a specified Basecamp chat. When a user creates a recognition card in the app, a formatted notification is automatically sent to the designated Basecamp chat.

## Configuration

### Environment Variables

Add the following to your `.env` file:

```
BASECAMP_ACCOUNT_ID=4767616
BASECAMP_PROJECT_ID=18168890
BASECAMP_ACCESS_TOKEN=4VKWvFaE6NDLrhSMQXSXkWY1
BASECAMP_CHAT_ID=2894341437
```

### What Each Variable Means

- **BASECAMP_ACCOUNT_ID**: Your Basecamp account identifier (found in your Basecamp URL)
- **BASECAMP_PROJECT_ID**: The ID of your Basecamp project (found in the project URL)
- **BASECAMP_ACCESS_TOKEN**: The integration token provided by Basecamp
- **BASECAMP_CHAT_ID**: The ID of the specific chat where notifications should be sent

## Testing the Integration

To test your Basecamp Chat integration:

```
npm run test:basecamp-alert
```

This will:
1. Verify your Basecamp credentials by sending a test message
2. Send a test recognition card notification with sample data

## How It Works

The integration uses a dedicated `BaseCampAlert` service that:

1. Creates a well-formatted HTML message for each card creation
2. Posts the message to Basecamp using their API
3. Handles any errors gracefully (without disrupting the main application flow)

## Integration with Card Creation

The alert service is integrated with the card creation use case. When a user creates a new recognition card:

1. The card is saved to the database
2. User details for both the sender and recipient are retrieved
3. A formatted notification is sent to Basecamp
4. Any errors in the notification process are logged but don't prevent card creation

## Message Format

Each notification includes:
- A header announcing the new card
- The names of both the sender and recipient
- The card title and content formatted for easy reading
- A reference ID linking back to the original card

## Troubleshooting

If notifications aren't appearing in Basecamp:

1. Verify your environment variables are set correctly
2. Run the test script to check connectivity
3. Check the application logs for any error messages
4. Ensure your Basecamp integration token has proper permissions
5. Confirm the chat ID is for an active, accessible chat

For more detailed diagnostics, check the application logs after card creation attempts. 