# Analytics Module Implementation - UPDATED

## Overview
This module provides a unified analytics dashboard for the recognition/feedback system via a single API endpoint, focusing on:
- Top 5 card receivers
- Top 5 card creators
- Count of cards created by team
- Total cards created in the specified time range
- Active user metrics (based on Card Creation)
- Card volume metrics

## Key Metrics Definitions

### Active Users
An active user is defined as a user who has created at least one card within the specified time period.

**Implementation**:
- Query the `cards` table with time range filter
- Count distinct users who have created cards (`user_id` field)

### Card Metrics
All card metrics will be calculated only for the exact time range specified in the request:
- No calculation for "previous time periods" or "momentum" between periods
- All metrics are filtered by the start and end dates provided in the request

## Database Structure
Working with the existing schema:
- `cards` table: Contains recognition data with creator, recipient, timestamp
- `users` table: User information
- `teams` table: Team details
- `user_team_assignments`: Tracks team membership with effective dates

## Implementation Steps

### 1. Domain Layer

#### Entities
- Create a single comprehensive analytics report entity that contains all metrics

### 2. Repository Layer

#### Analytics Repository Interface
- Define a single method to fetch all analytics data for a given time range
- No calculation of previous periods or comparison metrics

### 3. Infrastructure Layer

#### PostgreSQL Repository Implementation
- Implement all queries with the same time range parameters
- Optimize for performance with proper indexing
- Use JOIN operations to connect users, teams, and cards

### 4. Application Layer

#### Use Cases
Create a single use case: `GetAnalyticsDashboard` which:
- Takes only startDate and endDate parameters
- Returns a comprehensive dashboard with all metrics
- Does not compare with any "previous period"

### 5. Presentation Layer

#### Controllers
Create a single controller method for the analytics dashboard

#### Routes
Define a single RESTful API route for the analytics dashboard endpoint

## Key SQL Queries

### Top Card Receivers
```sql
SELECT u.id, u.first_name, u.last_name, COUNT(*) as card_count
FROM cards c
JOIN users u ON c.created_for = u.id
WHERE c.created_at BETWEEN $startDate AND $endDate
GROUP BY u.id, u.first_name, u.last_name
ORDER BY card_count DESC
LIMIT 5;
```

### Top Card Creators
```sql
SELECT u.id, u.first_name, u.last_name, COUNT(*) as card_count
FROM cards c
JOIN users u ON c.user_id = u.id
WHERE c.created_at BETWEEN $startDate AND $endDate
GROUP BY u.id, u.first_name, u.last_name
ORDER BY card_count DESC
LIMIT 5;
```

### Team Card Count
```sql
SELECT t.id, t.name, COUNT(*) as card_count
FROM cards c
JOIN teams t ON 
    c.team_id = t.id 
WHERE c.created_at BETWEEN $startDate AND $endDate
GROUP BY t.id, t.name
ORDER BY card_count DESC;
```

### Title Analytics
```sql
SELECT 
  title,
  COUNT(*) as count
FROM cards
WHERE created_at BETWEEN $startDate AND $endDate
GROUP BY title
ORDER BY count DESC
LIMIT 10;
```

### Total Cards
```sql
SELECT COUNT(*) as total_cards
FROM cards
WHERE created_at BETWEEN $startDate AND $endDate;
```

### Active Users
```sql
SELECT COUNT(DISTINCT user_id) as active_users
FROM cards
WHERE created_at BETWEEN $startDate AND $endDate;
```

## Planned API Endpoint

- `GET /api/analytics/dashboard?startDate=X&endDate=Y`

This single endpoint will return all metrics in a comprehensive dashboard format:
```json
{
  "topReceivers": [ ... ],
  "topCreators": [ ... ],
  "teamAnalytics": [ ... ],
  "cardVolume": { "total": 123 },
  "activeUsers": 42
}
```
```

This updated implementation document:

1. Removes all references to previous periods and momentum calculations
2. Consolidates all analytics into a single dashboard API endpoint
3. Simplifies the metrics to only use the exact time range provided in the request
4. Reorganizes the implementation to focus on a unified approach rather than separate APIs