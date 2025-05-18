import express, { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import cors from "cors";
import { authRoutes } from "./clean-architecture/modules/login/presentation/routes/authRoutes";
import { cardRoutes } from "./clean-architecture/modules/card/presentation/routes/cardRoutes";
import { userRoutes } from "./clean-architecture/modules/user/presentation/routes/userRoutes";
import { teamRoutes } from "./clean-architecture/modules/team/presentation/routes/teamRoutes";
import { analyticsRoutes } from "./clean-architecture/modules/analytics/presentation/routes/analyticsRoutes";
import adminRoutes from "./clean-architecture/modules/admin/presentation/routes/adminRoutes";
import { DatabaseService } from "./services/database.service";
import {
  errorHandler,
  notFoundHandler,
} from "./clean-architecture/shared/errors";
import weeklyCrownRoutes from './clean-architecture/modules/weeklyCrown/presentation/routes/weeklyCrownRoutes';
import { SchedulerService } from './clean-architecture/modules/weeklyCrown/infrastructure/services/SchedulerService';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize services
const dbService = DatabaseService.getInstance();

// Define allowed origins
const allowedOrigins = [
  "http://localhost:3000",
  "https://demo-frontend-pzjg.onrender.com",
];

// CORS Configuration
const corsOptions = {
  origin: allowedOrigins,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  credentials: true,
  maxAge: 86400, // 24 hours
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/cards", cardRoutes);
app.use("/api/users", userRoutes);
app.use("/api/teams", teamRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/weeklycrown", weeklyCrownRoutes);

// Health check endpoint
app.use("/api/health", async (req: Request, res: Response) => {
  // Check database connectivity for health check
  const dbConnected = await dbService.testConnection();

  res.status(200).json({
    status: "OK",
    database: dbConnected ? "connected" : "disconnected",
  });
});

// 404 handler for non-existent routes
app.use(notFoundHandler);

// Global error handling middleware
app.use(errorHandler);

// Initialize the WeeklyCrown scheduler when the app starts
const initializeSchedulers = () => {
  try {
    const scheduler = SchedulerService.getInstance();
    scheduler.startScheduler();
    console.log('🔄 WeeklyCrown scheduler initialized');
  } catch (error) {
    console.error('❌ Failed to initialize WeeklyCrown scheduler:', error);
  }
};

// Setup server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  initializeSchedulers();
});
