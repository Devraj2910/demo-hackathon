# Health Check Service

A simple TypeScript project with a health check endpoint built using Clean Architecture principles.

## Project Structure

The project follows Clean Architecture with the following layers:
- Domain: Core business entities and logic
- Application: Use cases orchestrating the domain
- Infrastructure: Implementation of repositories and external services
- Presentation: Controllers and routes for handling HTTP requests

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm

### Installation

1. Clone the repository
2. Install dependencies:
```
npm install
```

### Running the Application

Development mode:
```
npm run dev
```

Production mode:
```
npm run build
npm start
```

## API Endpoints

### Health Check
```
GET /health
```

Response:
```json
{
  "success": true,
  "data": {
    "status": "OK",
    "timestamp": "2023-11-08T10:30:00.000Z",
    "version": "1.0.0",
    "uptime": 123
  }
}
``` 