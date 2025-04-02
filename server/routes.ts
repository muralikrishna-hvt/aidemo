import express, { type Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { geminiClient } from "./geminiClient";
import { chatCompletionSchema, insertUserSchema, insertChatMessageSchema } from "@shared/schema";
import { log } from "./vite";

export async function registerRoutes(app: Express): Promise<Server> {
  // User authentication routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const userInput = insertUserSchema.parse(req.body);
      const existingUser = await storage.getUserByUsername(userInput.username);
      
      if (existingUser) {
        return res.status(409).json({ message: "Username already exists" });
      }
      
      const user = await storage.createUser(userInput);
      // Don't return password in response
      const { password, ...userWithoutPassword } = user;
      
      return res.status(201).json(userWithoutPassword);
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  });
  
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
      }
      
      const user = await storage.getUserByUsername(username);
      
      if (!user || user.password !== password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      // Don't return password in response
      const { password: _, ...userWithoutPassword } = user;
      
      return res.status(200).json(userWithoutPassword);
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  });
  
  // Portfolio assets routes
  app.get("/api/portfolio/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
      
      const assets = await storage.getPortfolioAssets(userId);
      return res.status(200).json(assets);
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  });
  
  // Financial goals routes
  app.get("/api/goals/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
      
      const goals = await storage.getFinancialGoals(userId);
      return res.status(200).json(goals);
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  });
  
  // Chat history routes
  app.get("/api/chat/history/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
      
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
      
      const chatHistory = await storage.getChatHistory(userId, limit);
      return res.status(200).json(chatHistory);
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  });
  
  // Gemini AI chat completion route
  app.post("/api/chat/completion", async (req, res) => {
    try {
      const { message, userId } = chatCompletionSchema.parse(req.body);
      
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
  
  // Market data route
  app.get("/api/market/data", async (req, res) => {
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
