import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

interface CardAlertInfo {
  cardId: string;
  title: string;
  content: string;
  createdBy: {
    firstName: string;
    lastName: string;
  };
  createdFor: {
    firstName: string;
    lastName: string;
  };
}

export class BaseCampAlert {
  private static instance: BaseCampAlert;
  private readonly baseUrl: string;
  
  private constructor() {
    const accountId = process.env.BASECAMP_ACCOUNT_ID || '4767616';
    const integrationToken = process.env.BASECAMP_ACCESS_TOKEN || '4VKWvFaE6NDLrhSMQXSXkWY1';
    const bucketId = process.env.BASECAMP_PROJECT_ID || '18168890';
    const chatId = process.env.BASECAMP_CHAT_ID || '2894341437';
    
    this.baseUrl = `https://3.basecamp.com/${accountId}/integrations/${integrationToken}/buckets/${bucketId}/chats/${chatId}/lines`;
  }
  
  public static getInstance(): BaseCampAlert {
    if (!BaseCampAlert.instance) {
      BaseCampAlert.instance = new BaseCampAlert();
    }
    return BaseCampAlert.instance;
  }
  
  /**
   * Send a card creation alert to Basecamp chat
   * @param cardInfo Information about the created card
   * @returns Promise resolving when the alert is sent
   */
  public async sendCardCreationAlert(cardInfo: CardAlertInfo): Promise<void> {
    const senderName = `${cardInfo.createdBy.firstName} ${cardInfo.createdBy.lastName}`;
    const recipientName = `${cardInfo.createdFor.firstName} ${cardInfo.createdFor.lastName}`;
    
    const message = `
      <h2>🎉 New Kudos Card Created!</h2>
      <p><strong>${senderName}</strong> just appreciated <strong>${recipientName}</strong> for their excellent work.</p>
      <div style="padding: 15px; border-left: 4px ; margin: 10px 0;">
        <h3><strong>Category: </strong> ${cardInfo.title}</h3>
        <p><strong>Message: </strong> ${cardInfo.content}</p>
      </div>
      <p><em>Great job celebrating team excellence! Let's keep recognizing each other's contributions.</em></p> `;
    
    try {
      const formData = new URLSearchParams();
      formData.append('content', message);
      
      await axios.post(this.baseUrl, formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });
      
      console.log(`Card creation alert sent to Basecamp for card ID: ${cardInfo.cardId}`);
    } catch (error) {
      console.error('Failed to send Basecamp card alert:', error);
    }
  }
  
  /**
   * Send a test message to verify Basecamp integration
   * @returns Promise resolving when the test message is sent
   */
  public async sendTestMessage(): Promise<void> {
    const message = `
      <h2>🧪 Test Message</h2>
      <p>This is a test message from the Recognition App.</p>
      <p>If you're seeing this, the Basecamp integration is working correctly!</p>
      <p><em>Sent at: ${new Date().toISOString()}</em></p>
    `;
    
    try {
      const formData = new URLSearchParams();
      formData.append('content', message);
      
      await axios.post(this.baseUrl, formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });
      
      console.log('Test message sent to Basecamp successfully');
    } catch (error) {
      console.error('Failed to send Basecamp test message:', error);
    }
  }
} 