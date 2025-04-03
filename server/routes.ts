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
import { salesforceService, ContactFilter, OpportunityFilter, TaskFilter } from "./salesforceService";

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

  // Salesforce CRM Integration Routes
  
  // Get Salesforce contacts
  app.get("/api/salesforce/contacts", isAuthenticated, async (req: Request, res: Response) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Authentication required" });
      }
      
      const userId = req.user.id;
      const filter: ContactFilter = {};
      
      // Parse query parameters
      if (req.query.search) filter.search = req.query.search as string;
      if (req.query.status) filter.status = req.query.status as any;
      if (req.query.sentiment) filter.sentiment = req.query.sentiment as any;
      if (req.query.tags) filter.tags = (req.query.tags as string).split(',');
      
      const contacts = await salesforceService.getContactsForUser(userId, filter);
      return res.status(200).json(contacts);
    } catch (error: any) {
      log(`Error fetching Salesforce contacts: ${error.message}`, "api");
      return res.status(400).json({ message: error.message });
    }
  });

  // Get Salesforce opportunities
  app.get("/api/salesforce/opportunities", isAuthenticated, async (req: Request, res: Response) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Authentication required" });
      }
      
      const userId = req.user.id;
      const filter: OpportunityFilter = {};
      
      // Parse query parameters
      if (req.query.search) filter.search = req.query.search as string;
      if (req.query.stage) filter.stage = req.query.stage as string;
      if (req.query.minAmount) filter.minAmount = parseFloat(req.query.minAmount as string);
      if (req.query.maxAmount) filter.maxAmount = parseFloat(req.query.maxAmount as string);
      if (req.query.probability) filter.probability = parseFloat(req.query.probability as string);
      
      const opportunities = await salesforceService.getOpportunitiesForUser(userId, filter);
      return res.status(200).json(opportunities);
    } catch (error: any) {
      log(`Error fetching Salesforce opportunities: ${error.message}`, "api");
      return res.status(400).json({ message: error.message });
    }
  });

  // Get Salesforce tasks
  app.get("/api/salesforce/tasks", isAuthenticated, async (req: Request, res: Response) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Authentication required" });
      }
      
      const userId = req.user.id;
      const filter: TaskFilter = {};
      
      // Parse query parameters
      if (req.query.search) filter.search = req.query.search as string;
      if (req.query.status) filter.status = req.query.status as any;
      if (req.query.priority) filter.priority = req.query.priority as any;
      if (req.query.dueDate) filter.dueDate = req.query.dueDate as any;
      
      const tasks = await salesforceService.getTasksForUser(userId, filter);
      return res.status(200).json(tasks);
    } catch (error: any) {
      log(`Error fetching Salesforce tasks: ${error.message}`, "api");
      return res.status(400).json({ message: error.message });
    }
  });

  // Create new Salesforce task
  app.post("/api/salesforce/tasks", isAuthenticated, async (req: Request, res: Response) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Authentication required" });
      }
      
      const newTask = req.body;
      const task = await salesforceService.createTask(newTask);
      return res.status(201).json(task);
    } catch (error: any) {
      log(`Error creating Salesforce task: ${error.message}`, "api");
      return res.status(400).json({ message: error.message });
    }
  });

  // Update Salesforce task status
  app.patch("/api/salesforce/tasks/:id", isAuthenticated, async (req: Request, res: Response) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Authentication required" });
      }
      
      const taskId = req.params.id;
      const { status } = req.body;
      
      if (!status) {
        return res.status(400).json({ message: "Status is required" });
      }
      
      const success = await salesforceService.updateTaskStatus(taskId, status);
      
      if (!success) {
        return res.status(404).json({ message: "Task not found" });
      }
      
      return res.status(200).json({ success: true });
    } catch (error: any) {
      log(`Error updating Salesforce task: ${error.message}`, "api");
      return res.status(400).json({ message: error.message });
    }
  });

  // Get Salesforce statistics
  app.get("/api/salesforce/stats", isAuthenticated, async (req: Request, res: Response) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Authentication required" });
      }
      
      const userId = req.user.id;
      const stats = await salesforceService.getStatsForUser(userId);
      return res.status(200).json(stats);
    } catch (error: any) {
      log(`Error fetching Salesforce stats: ${error.message}`, "api");
      return res.status(400).json({ message: error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
