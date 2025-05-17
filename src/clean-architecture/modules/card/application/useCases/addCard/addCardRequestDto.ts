export interface AddCardRequestDto {
  title: string;
  content: string;
  createdFor: string; // User ID for whom the card is created
  userId: string; // User ID of the creator (from authentication)
} 