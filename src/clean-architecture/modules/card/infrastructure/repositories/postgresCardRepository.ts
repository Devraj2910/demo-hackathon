import { DatabaseService } from "../../../../../services/database.service";
import { Card, CardProps } from "../../domain/entities/card";
import { CardRepository } from "../../repositories/cardRepository";

interface CardRow {
  id: number;
  title: string;
  content: string;
  user_id: string;
  created_for: string;
  created_at: Date;
  updated_at: Date;
}

export class PostgresCardRepository implements CardRepository {
  private dbService: DatabaseService;

  constructor() {
    this.dbService = DatabaseService.getInstance();
  }

  async findById(id: string): Promise<Card | null> {
    const query = `
      SELECT * FROM cards 
      WHERE id = $1
      LIMIT 1
    `;
    
    const rows = await this.dbService.query<CardRow>(query, [id]);
    
    if (rows.length === 0) {
      return null;
    }
    
    return this.mapToCard(rows[0]);
  }

  async findAll(filters?: {
    userId?: string;
    createdFor?: string;
    teamId?: string;
    fromDate?: Date;
    toDate?: Date;
  }): Promise<Card[]> {
    let queryParams: any[] = [];
    let conditions: string[] = [];
    let queryStr = `SELECT c.* FROM cards c`;
    
    // Add team join if teamId filter is present
    if (filters?.teamId) {
      queryStr += `
        JOIN users u ON c.user_id = u.id
        JOIN user_team_assignments uta ON 
          u.id = uta.user_id AND 
          c.created_at >= uta.effective_from AND 
          (c.created_at < uta.effective_to OR uta.effective_to IS NULL)
      `;
      conditions.push(`uta.team_id = $${queryParams.length + 1}`);
      queryParams.push(filters.teamId);
    }
    
    // Add other conditions
    if (filters?.userId) {
      conditions.push(`c.user_id = $${queryParams.length + 1}`);
      queryParams.push(filters.userId);
    }
    
    if (filters?.createdFor) {
      conditions.push(`c.created_for = $${queryParams.length + 1}`);
      queryParams.push(filters.createdFor);
    }
    
    if (filters?.fromDate) {
      conditions.push(`c.created_at >= $${queryParams.length + 1}`);
      queryParams.push(filters.fromDate);
    }
    
    if (filters?.toDate) {
      conditions.push(`c.created_at <= $${queryParams.length + 1}`);
      queryParams.push(filters.toDate);
    }
    
    // Add WHERE clause if any conditions exist
    if (conditions.length > 0) {
      queryStr += ` WHERE ${conditions.join(' AND ')}`;
    }
    
    queryStr += ` ORDER BY c.created_at DESC`;
    
    const rows = await this.dbService.query<CardRow>(queryStr, queryParams);
    
    return rows.map(row => this.mapToCard(row));
  }

  async findByUser(userId: string): Promise<Card[]> {
    const query = `
      SELECT * FROM cards 
      WHERE user_id = $1
      ORDER BY created_at DESC
    `;
    
    const rows = await this.dbService.query<CardRow>(query, [userId]);
    
    return rows.map(row => this.mapToCard(row));
  }

  async findByCreatedFor(userId: string): Promise<Card[]> {
    const query = `
      SELECT * FROM cards 
      WHERE created_for = $1
      ORDER BY created_at DESC
    `;
    
    const rows = await this.dbService.query<CardRow>(query, [userId]);
    
    return rows.map(row => this.mapToCard(row));
  }

  async findLatest(limit: number = 10): Promise<Card[]> {
    const query = `
      SELECT * FROM cards 
      ORDER BY created_at DESC
      LIMIT $1
    `;
    
    const rows = await this.dbService.query<CardRow>(query, [limit]);
    
    return rows.map(row => this.mapToCard(row));
  }

  async save(card: Card): Promise<Card> {
    if (card.id) {
      // Update existing card
      const query = `
        UPDATE cards
        SET title = $1, 
            content = $2, 
            updated_at = $3
        WHERE id = $4
        RETURNING *
      `;
      
      const params = [
        card.title,
        card.content,
        card.updatedAt,
        card.id
      ];
      
      const rows = await this.dbService.query<CardRow>(query, params);
      return this.mapToCard(rows[0]);
    } else {
      // Insert new card with auto-increment ID
      const query = `
        INSERT INTO cards (
          title, 
          content, 
          user_id, 
          created_for, 
          created_at, 
          updated_at
        )
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *
      `;
      
      const params = [
        card.title,
        card.content,
        card.userId,
        card.createdFor,
        card.createdAt,
        card.updatedAt
      ];
      
      const rows = await this.dbService.query<CardRow>(query, params);
      return this.mapToCard(rows[0]);
    }
  }

  async delete(id: string): Promise<boolean> {
    const query = `
      DELETE FROM cards 
      WHERE id = $1
      RETURNING id
    `;
    
    const rows = await this.dbService.query<{ id: number }>(query, [id]);
    
    return rows.length > 0;
  }

  private mapToCard(row: CardRow): Card {
    const cardProps: CardProps = {
      id: row.id.toString(),
      title: row.title,
      content: row.content,
      userId: row.user_id,
      createdFor: row.created_for,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    };
    
    return Card.create(cardProps);
  }
} 