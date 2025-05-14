import express from 'express';
import dotenv from 'dotenv';
import { healthRoutes } from './clean-architecture/modules/health/presentation/routes/healthRoutes';

// Configure environment variables
dotenv.config();

// Create Express app
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Routes
app.use('/health', healthRoutes);

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
}); 