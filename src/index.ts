import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import { databaseRoutes } from './clean-architecture/modules/database/presentation/routes/databaseRoutes';
import { authRoutes } from './clean-architecture/modules/login/presentation/routes/authRoutes';
import { DatabaseService } from './services/database.service';
import { errorHandler, notFoundHandler } from './clean-architecture/shared/errors';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize services
const dbService = DatabaseService.getInstance();

// Middleware
app.use(express.json());

// Routes
app.use('/api/database', databaseRoutes);
app.use('/api/auth', authRoutes);

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'OK' });
});

// 404 handler for non-existent routes
app.use(notFoundHandler);

// Global error handling middleware
app.use(errorHandler);

// Start server
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Handle graceful shutdown
process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

async function shutdown() {
  console.log('Shutting down server...');
  server.close(async () => {
    console.log('HTTP server closed.');
    try {
      // Close database connections
      await dbService.disconnect();
      console.log('Database connections closed.');
      process.exit(0);
    } catch (error) {
      console.error('Error during shutdown:', error);
      process.exit(1);
    }
  });
} 