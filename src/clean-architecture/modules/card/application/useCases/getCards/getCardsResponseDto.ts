export interface UserDetailsDto {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  fullName: string;
}

export interface CardDto {
  id: string;
  title: string;
  content: string;
  userId: string;
  createdFor: string;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  creator: UserDetailsDto;
  recipient: UserDetailsDto;
}

export interface GetCardsResponseDto {
  cards: CardDto[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
} 