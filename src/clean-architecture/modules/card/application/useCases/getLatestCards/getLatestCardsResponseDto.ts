export interface CardDto {
  id: string;
  title: string;
  content: string;
  userId: string;
  createdFor: string;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

export interface GetLatestCardsResponseDto {
  cards: CardDto[];
} 