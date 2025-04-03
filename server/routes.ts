import express, { type Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { geminiClient } from "./geminiClient";
import { 
  chatCompletionSchema, 
  insertUserSchema, 
  insertChatMessageSchema, 
  insertFinancialGoalSchema,
  User 
} from "@shared/schema";
import { log } from "./vite";
import { setupAuth } from "./auth";

// Extend the Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication system
  setupAuth(app);
  
  // Protected routes middleware
  const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
    if (req.isAuthenticated()) {
      return next();
    }
    return res.status(401).json({ message: "Unauthorized: Please log in" });
  };

  // Portfolio assets routes
  app.get("/api/portfolio", isAuthenticated, async (req: Request, res: Response) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Authentication required" });
      }
      
      const userId = req.user.id;
      const assets = await storage.getPortfolioAssets(userId);
      return res.status(200).json(assets);
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  });
  
  // Financial goals routes
  app.get("/api/goals", isAuthenticated, async (req: Request, res: Response) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Authentication required" });
      }
      
      const userId = req.user.id;
      const goals = await storage.getFinancialGoals(userId);
      return res.status(200).json(goals);
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  });
  
  // Add a new financial goal
  app.post("/api/goals", isAuthenticated, async (req: Request, res: Response) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Authentication required" });
      }
      
      // Validate request body
      const goalData = insertFinancialGoalSchema.parse(req.body);
      
      // Set the correct user ID
      goalData.userId = req.user.id;
      
      // Add the goal
      const goal = await storage.addFinancialGoal(goalData);
      return res.status(201).json(goal);
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  });
  
  // Update a financial goal
  app.patch("/api/goals/:id", isAuthenticated, async (req: Request, res: Response) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Authentication required" });
      }
      
      const goalId = parseInt(req.params.id);
      if (isNaN(goalId)) {
        return res.status(400).json({ message: "Invalid goal ID" });
      }
      
      // Validate request body
      const updateData = insertFinancialGoalSchema.partial().parse(req.body);
      
      // Ensure user can only update their own goals
      updateData.userId = req.user.id;
      
      // Update the goal
      const updatedGoal = await storage.updateFinancialGoal(goalId, updateData);
      
      if (!updatedGoal) {
        return res.status(404).json({ message: "Goal not found or unauthorized" });
      }
      
      return res.status(200).json(updatedGoal);
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  });
  
  // Delete a financial goal
  app.delete("/api/goals/:id", isAuthenticated, async (req: Request, res: Response) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Authentication required" });
      }
      
      const goalId = parseInt(req.params.id);
      if (isNaN(goalId)) {
        return res.status(400).json({ message: "Invalid goal ID" });
      }
      
      // Delete the goal
      const result = await storage.deleteFinancialGoal(goalId);
      
      if (!result) {
        return res.status(404).json({ message: "Goal not found or unauthorized" });
      }
      
      return res.status(200).json({ success: true });
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  });
  
  // Chat history routes
  app.get("/api/chat/history", isAuthenticated, async (req: Request, res: Response) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Authentication required" });
      }
      
      const userId = req.user.id;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
      
      const chatHistory = await storage.getChatHistory(userId, limit);
      return res.status(200).json(chatHistory);
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  });
  
  // Gemini AI chat completion route
  app.post("/api/chat/completion", isAuthenticated, async (req: Request, res: Response) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Authentication required" });
      }
      
      const { message } = req.body;
      const userId = req.user.id;
      
      if (!message) {
        return res.status(400).json({ message: "Message is required" });
      }
      
      // Store user message
      await storage.addChatMessage({
        userId,
        content: message,
        isUserMessage: true,
        timestamp: new Date()
      });
      
      // Generate AI response using Gemini
      const aiResponse = await geminiClient.generateResponse(userId, message);
      
      // Store AI response
      const savedResponse = await storage.addChatMessage({
        userId,
        content: aiResponse,
        isUserMessage: false,
        timestamp: new Date()
      });
      
      return res.status(200).json(savedResponse);
    } catch (error: any) {
      log(`Error in chat completion: ${error.message}`, "api");
      return res.status(400).json({ message: error.message });
    }
  });
  
  // Market data route - no auth required for market data
  app.get("/api/market/data", async (req: Request, res: Response) => {
    try {
      const marketData = await storage.getAllMarketData();
      return res.status(200).json(marketData);
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
