import { Card, CardProps } from "../domain/entities/card";

/**
 * Responsible for transforming team_cards view data
 */
export class TeamCardMapper {
  /**
   * Maps a row from the team_cards view to a Card domain entity
   */
  static toDomain(row: {
    card_id: number;
    title: string;
    content: string;
    card_created_at: Date;
    user_id: string;
    first_name: string;
    last_name: string;
    team_id: number | null;
    team_name: string | null;
    // Assume updated_at is not directly available in the view
  }): Card {
    const cardProps: CardProps = {
      id: row.card_id.toString(),
      title: row.title,
      content: row.content,
      userId: row.user_id,
      // Note: created_for is not directly available in the view
      // It would need to be joined separately or handled differently
      createdFor: '', // This would need to be populated separately
      createdAt: row.card_created_at,
      updatedAt: row.card_created_at // Use created_at as updatedAt since it's not in the view
    };
    
    return Card.create(cardProps);
  }

  /**
   * Additional information about the team context of a card
   */
  static toTeamCardInfo(row: {
    card_id: number;
    team_id: number | null;
    team_name: string | null;
    user_id: string;
    first_name: string;
    last_name: string;
  }): {
    cardId: string;
    teamId: string | null;
    teamName: string | null;
    userInfo: {
      userId: string;
      firstName: string;
      lastName: string;
    }
  } {
    return {
      cardId: row.card_id.toString(),
      teamId: row.team_id ? row.team_id.toString() : null,
      teamName: row.team_name,
      userInfo: {
        userId: row.user_id,
        firstName: row.first_name,
        lastName: row.last_name
      }
    };
  }
} 