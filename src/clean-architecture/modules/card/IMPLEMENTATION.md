# Card Module Implementation Guide

This document outlines the steps needed to implement the Card module following clean architecture principles. The implementation will provide APIs for getting, adding, and deleting cards with proper authentication.

## Architecture Overview

The Card module is structured according to clean architecture principles with these main layers:
- Domain Layer: Contains business entities and interfaces
- Application Layer: Contains use cases for the operations
- Infrastructure Layer: Implements interfaces defined in the domain layer
- Presentation Layer: Handles HTTP communication and routing

## Implementation Steps

### 1. Domain Layer

#### 1.1. Define Card Entity
- Create card entity in `domain/entities/card.ts`
- Include properties from the database schema: id, title, content, user_id, created_for, creation/update timestamps
- Implement business logic methods like validation

#### 1.2. Define Repository Interfaces
- Create repository interface in `repositories/cardRepository.ts` 
- Define methods for findById, findAll, findByUser, findByCreatedFor, findLatest, save, delete
- Define proper return types with Card entity

#### 1.3. Define Errors
- Create card-specific errors in `domain/errors/cardErrors.ts`
- Include errors like CardNotFoundError, AccessDeniedError, UnauthorizedDeleteError

### 2. Application Layer

#### 2.1. Get Cards Use Case
- Create use case in `application/useCases/getCards/getCards.ts`
- Create DTOs for request/response
- Implement filtering by user, team, date ranges
- All users can view all cards regardless of creator

#### 2.2. Get Latest Cards Use Case
- Create use case in `application/useCases/getLatestCards/getLatestCards.ts`
- Create DTOs for request/response
- Retrieve the 10 most recently created cards
- No filtering by user necessary as all users can see all cards

#### 2.3. Add Card Use Case
- Create use case in `application/useCases/addCard/addCard.ts`
- Create DTOs for request/response
- Implement validation logic
- Use UUID for generating card IDs

#### 2.4. Delete Card Use Case
- Create use case in `application/useCases/deleteCard/deleteCard.ts`
- Create DTOs for request/response
- Implement authorization logic - only admins can delete cards
- Check user role before proceeding with deletion

#### 2.5. Create Factories
- Create factory classes for each use case to handle dependency injection

### 3. Infrastructure Layer

#### 3.1. Implement Repositories
- Create PostgreSQL repository implementation in `infrastructure/repositories/postgresCardRepository.ts`
- Implement all methods defined in the repository interface
- Include findLatest method to get the 10 most recent cards
- Handle data mapping between database and entity

### 4. Presentation Layer

#### 4.1. Create Controllers
- Create controller in `presentation/controllers/cardController.ts`
- Implement methods for getCards, getLatestCards, addCard, deleteCard 
- Handle error mapping to HTTP responses

#### 4.2. Create Routes
- Create routes in `presentation/routes/cardRoutes.ts`
- Define endpoints for GET /cards, GET /cards/latest, POST /cards, DELETE /cards/:id
- Apply authentication middleware from login module
- Use role-based authorization to restrict deletion to admin role

#### 4.3. Create Validation
- Create validation schemas in `presentation/validation/cardValidation.ts`
- Define schemas for card creation and filters 

#### 4.4. Create Middleware
- Create custom middleware if needed in `presentation/middleware/`
- Reuse authentication middleware from login module

### 5. Integration

#### 5.1. Register Routes
- Update the main application to include the new card routes
- Apply proper prefix like `/api/cards`

#### 5.2. Add Database Queries
- Ensure proper database queries are used for the specific filtering requirements
- Implement the team-based filtering using the `user_team_assignments` table
- Use the database view `team_cards` for team-related queries
- Add optimized query for fetching latest 10 cards

## Authentication Requirements

1. All card APIs require authentication
2. Both admin and regular users can access the card APIs when logged in
3. Use the authentication middleware from the login module
4. Apply different authorization rules:
   - All users can see all cards regardless of creator
   - All users can create cards
   - Only admins can delete cards

## Data Considerations

1. When creating a card, capture the current user team for historical tracking
2. When querying cards by team, use the right team as of the card creation date
3. Ensure proper validation of all input data
4. Optimize queries for getting latest cards with proper indexing

## Testing

1. Create unit tests for each use case
2. Create integration tests for the repository implementations
3. Create end-to-end tests for the API endpoints

## Deployment

1. Ensure database migrations are in place for the cards table
2. Update API documentation to include the new endpoints 