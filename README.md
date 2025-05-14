# PostgreSQL API with Clean Architecture

This API provides endpoints to interact with a PostgreSQL database, built using Clean Architecture principles.

## Features

- List all databases
- Execute custom SQL queries

## Prerequisites

- Node.js (>= 14.x)
- PostgreSQL installed and running

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=postgres
```

## Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Start the server:
   ```
   npm run dev
   ```

## API Endpoints

### List Databases

```
GET /api/databases
```

Returns a list of all databases in the PostgreSQL server.

### Execute Query

```
POST /api/query
```

Body:
```json
{
  "query": "SELECT * FROM pg_database"
}
```

Executes the provided SQL query and returns the results.

## Clean Architecture Structure

This project follows Clean Architecture principles with the following structure:

```
/src/clean-architecture/
    /modules/
        /database/
            /domain/
                /entities/       # Core business entities
            /application/
                /useCases/       # Application use cases
            /infrastructure/
                /repositories/   # Repository implementations
            /presentation/
                /controllers/    # HTTP controllers
                /routes/         # API routes
            /repositories/       # Repository interfaces
``` 