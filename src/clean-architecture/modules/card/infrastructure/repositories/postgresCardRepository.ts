import { DatabaseService } from "../../../../../services/database.service";
import { Card, CardProps } from "../../domain/entities/card";
import { CardRepository, PaginatedResult, CardWithUsers, PaginatedCardWithUsers } from "../../repositories/cardRepository";
import { User } from "../../../user/domain/entities/User";
import { UserRepositoryImpl } from "../../../user/infrastructure/repositories/UserRepositoryImpl";
import { CardMapper } from "../../mapper/CardMapper";

interface CardRow {
  id: number;
  title: string;
  content: string;
  user_id: string;
  created_for: string;
  team_id: string | null;
  created_at: Date;
  updated_at: Date;
}

export class PostgresCardRepository implements CardRepository {
  private dbService: DatabaseService;
  private userRepository: UserRepositoryImpl;

  constructor() {
    this.dbService = DatabaseService.getInstance();
    this.userRepository = new UserRepositoryImpl(this.dbService.getPool());
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
    page?: number;
    limit?: number;
  }): Promise<PaginatedResult<Card>> {
    let queryParams: any[] = [];
    let conditions: string[] = [];
    
    // Use direct filtering on cards table now that team_id is a column
    const baseQueryStr = `SELECT * FROM cards`;
    
    // Add all filter conditions
    if (filters?.teamId) {
      conditions.push(`team_id = $${queryParams.length + 1}`);
      queryParams.push(filters.teamId);
    }
    
    if (filters?.userId) {
      conditions.push(`user_id = $${queryParams.length + 1}`);
      queryParams.push(filters.userId);
    }
    
    if (filters?.createdFor) {
      conditions.push(`created_for = $${queryParams.length + 1}`);
      queryParams.push(filters.createdFor);
    }
    
    if (filters?.fromDate) {
      conditions.push(`created_at >= $${queryParams.length + 1}`);
      queryParams.push(filters.fromDate);
    }
    
    if (filters?.toDate) {
      conditions.push(`created_at <= $${queryParams.length + 1}`);
      queryParams.push(filters.toDate);
    }
    
    // Create WHERE clause if any conditions exist
    const whereClause = conditions.length > 0 
      ? ` WHERE ${conditions.join(' AND ')}` 
      : '';
    
    // Count total records - simplified now with direct filtering
    const countQuery = `SELECT * FROM cards${whereClause}`;
    const countResult = await this.dbService.query<{ total: string }>(countQuery, queryParams);
    const total = parseInt(countResult[0]?.total || '0', 10);
    
    // Setup pagination parameters
    const page = filters?.page || 1;
    const limit = filters?.limit || 10;
    const offset = (page - 1) * limit;
    const totalPages = Math.ceil(total / limit);
    
    // Build the final query with pagination
    const paginatedQuery = `${baseQueryStr}${whereClause} ORDER BY created_at DESC LIMIT $${queryParams.length + 1} OFFSET $${queryParams.length + 2}`;
    queryParams.push(limit, offset);
    
    // Execute the query
    const rows = await this.dbService.query<CardRow>(paginatedQuery, queryParams);
    
    // Map to domain entities
    const cards = rows.map(row => this.mapToCard(row));
    
    // Return paginated result
    return {
      data: cards,
      total,
      page,
      limit,
      totalPages
    };
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

  async findLatest(limit: number = 10, teamId?: string): Promise<Card[]> {
    let queryStr: string;
    let queryParams: any[] = [];
    
    if (teamId) {
      // Direct filtering by team_id column
      queryStr = `
        SELECT * FROM cards
        WHERE team_id = $1
        ORDER BY created_at DESC
        LIMIT $2
      `;
      queryParams = [teamId, limit];
    } else {
      // If not filtering by team, use the simpler query
      queryStr = `
        SELECT * FROM cards 
        ORDER BY created_at DESC
        LIMIT $1
      `;
      queryParams = [limit];
    }
    
    const rows = await this.dbService.query<CardRow>(queryStr, queryParams);
    
    return rows.map(row => this.mapToCard(row));
  }

  async save(card: Card): Promise<Card> {
    if (card.id) {
      // Update existing card
      const query = `
        UPDATE cards
        SET title = $1, 
            content = $2, 
            team_id = $3,
            updated_at = $4
        WHERE id = $5
        RETURNING *
      `;
      
      const params = [
        card.title,
        card.content,
        card.teamId,
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
          team_id,
          created_at, 
          updated_at
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *
      `;
      
      const params = [
        card.title,
        card.content,
        card.userId,
        card.createdFor,
        card.teamId,
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
    return CardMapper.toDomain(row);
  }

  async findAllWithUsers(filters?: {
    userId?: string;
    createdFor?: string;
    teamId?: string;
    fromDate?: Date;
    toDate?: Date;
    page?: number;
    limit?: number;
  }): Promise<PaginatedCardWithUsers> {
    // First get paginated cards
    const paginatedCards = await this.findAll(filters);
    
    // Then fetch user details for each card
    const cardsWithUsers = await this.addUserDetails(paginatedCards.data);
    
    return {
      data: cardsWithUsers,
      total: paginatedCards.total,
      page: paginatedCards.page,
      limit: paginatedCards.limit,
      totalPages: paginatedCards.totalPages
    };
  }

  async findLatestWithUsers(limit: number = 10, teamId?: string): Promise<CardWithUsers[]> {
    // First get the latest cards
    const cards = await this.findLatest(limit, teamId);
    
    // Then fetch user details for each card
    return this.addUserDetails(cards);
  }

  // Helper method to add user details to cards
  private async addUserDetails(cards: Card[]): Promise<CardWithUsers[]> {
    // Collect all user IDs
    const userIds = new Set<string>();
    cards.forEach(card => {
      userIds.add(card.userId);
      userIds.add(card.createdFor);
    });
    
    // Fetch all users at once
    const users = new Map<string, User>();
    for (const userId of userIds) {
      const user = await this.userRepository.findById(userId);
      if (user) {
        users.set(userId, user);
      }
    }
    
    // Add user details to each card
    return cards.map(card => CardMapper.toCardWithUsers(
      card,
      users.get(card.userId) || null,
      users.get(card.createdFor) || null
    ));
  }
} 