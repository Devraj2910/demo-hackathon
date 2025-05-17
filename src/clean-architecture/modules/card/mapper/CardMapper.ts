import { Card, CardProps } from "../domain/entities/card";
import { User } from "../../user/domain/entities/User";
import { CardWithUsers } from "../repositories/cardRepository";

/**
 * Responsible for transforming card data between different formats
 */
export class CardMapper {
  /**
   * Maps database row to Card domain entity
   */
  static toDomain(row: {
    id: number;
    title: string;
    content: string;
    user_id: string;
    created_for: string;
    team_id?: string | null;
    created_at: Date;
    updated_at: Date;
  }): Card {
    const cardProps: CardProps = {
      id: row.id.toString(),
      title: row.title,
      content: row.content,
      userId: row.user_id,
      createdFor: row.created_for,
      teamId: row.team_id || null,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    };
    
    return Card.create(cardProps);
  }

  /**
   * Maps Card domain entity to database structure
   */
  static toPersistence(card: Card): {
    id?: number;
    title: string;
    content: string;
    user_id: string;
    created_for: string;
    team_id?: string | null;
    created_at: Date;
    updated_at: Date;
  } {
    return {
      id: card.id ? parseInt(card.id) : undefined,
      title: card.title,
      content: card.content,
      user_id: card.userId,
      created_for: card.createdFor,
      team_id: card.teamId || null,
      created_at: card.createdAt,
      updated_at: card.updatedAt
    };
  }

  /**
   * Creates CardWithUsers object from Card and User entities
   */
  static toCardWithUsers(card: Card, creator: User | null, recipient: User | null): CardWithUsers {
    return {
      card,
      creator,
      recipient
    };
  }
} 