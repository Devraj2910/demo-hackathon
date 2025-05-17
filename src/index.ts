import express, { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import cors from "cors";
import { authRoutes } from "./clean-architecture/modules/login/presentation/routes/authRoutes";
import { cardRoutes } from "./clean-architecture/modules/card/presentation/routes/cardRoutes";
import { userRoutes } from "./clean-architecture/modules/user/presentation/routes/userRoutes";
import { teamRoutes } from "./clean-architecture/modules/team/presentation/routes/teamRoutes";
import { DatabaseService } from "./services/database.service";
import {
  errorHandler,
  notFoundHandler,
} from "./clean-architecture/shared/errors";

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

// Test database connection and start server only if successful
async function startServer() {
  try {
    // Test database connection
    const isConnected = await dbService.testConnection();

    if (!isConnected) {
      console.error(
        "Failed to connect to the database. Server will not start."
      );
      process.exit(1);
    }

    // Start server if database connection is successful
    const server = app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Health check available at: ${process.env.HOST}/health`);
    });

    // Handle graceful shutdown
    process.on("SIGTERM", () => shutdown(server));
    process.on("SIGINT", () => shutdown(server));
  } catch (error) {
    console.error("Error starting server:", error);
    process.exit(1);
  }
}

async function shutdown(server: any) {
  console.log("Shutting down server...");
  server.close(async () => {
    console.log("HTTP server closed.");
    try {
      // Close database connections
      await dbService.disconnect();
      console.log("Database connections closed.");
      process.exit(0);
    } catch (error) {
      console.error("Error during shutdown:", error);
      process.exit(1);
    }
  });
}

// Start the server
startServer();
