import { 
  users, type User, type InsertUser,
  portfolioAssets, type PortfolioAsset, type InsertPortfolioAsset,
  financialGoals, type FinancialGoal, type InsertFinancialGoal,
  chatMessages, type ChatMessage, type InsertChatMessage,
  marketData, type MarketData, type InsertMarketData
} from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

// Expanded storage interface with all the required CRUD operations
export interface IStorage {
  // Session store
  sessionStore: session.Store;
  
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Portfolio asset operations
  getPortfolioAssets(userId: number): Promise<PortfolioAsset[]>;
  addPortfolioAsset(asset: InsertPortfolioAsset): Promise<PortfolioAsset>;
  updatePortfolioAsset(id: number, asset: Partial<InsertPortfolioAsset>): Promise<PortfolioAsset | undefined>;
  deletePortfolioAsset(id: number): Promise<boolean>;
  
  // Financial goals operations
  getFinancialGoals(userId: number): Promise<FinancialGoal[]>;
  addFinancialGoal(goal: InsertFinancialGoal): Promise<FinancialGoal>;
  updateFinancialGoal(id: number, goal: Partial<InsertFinancialGoal>): Promise<FinancialGoal | undefined>;
  deleteFinancialGoal(id: number): Promise<boolean>;
  
  // Chat message operations
  getChatHistory(userId: number, limit?: number): Promise<ChatMessage[]>;
  addChatMessage(message: InsertChatMessage): Promise<ChatMessage>;
  
  // Market data operations
  getAllMarketData(): Promise<MarketData[]>;
  updateMarketData(id: number, data: Partial<InsertMarketData>): Promise<MarketData | undefined>;
  addMarketData(data: InsertMarketData): Promise<MarketData>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private portfolioAssets: Map<number, PortfolioAsset>;
  private financialGoals: Map<number, FinancialGoal>;
  private chatMessages: Map<number, ChatMessage>;
  private marketData: Map<number, MarketData>;
  
  private userIdCounter: number;
  private portfolioAssetIdCounter: number;
  private financialGoalIdCounter: number;
  private chatMessageIdCounter: number;
  private marketDataIdCounter: number;
  
  public sessionStore: session.Store;

  constructor() {
    this.users = new Map();
    this.portfolioAssets = new Map();
    this.financialGoals = new Map();
    this.chatMessages = new Map();
    this.marketData = new Map();
    
    this.userIdCounter = 1;
    this.portfolioAssetIdCounter = 1;
    this.financialGoalIdCounter = 1;
    this.chatMessageIdCounter = 1;
    this.marketDataIdCounter = 1;
    
    // Initialize session store
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000, // prune expired entries every 24h
    });
    
    // Initialize with sample market data
    this.initializeSampleMarketData();
  }
  
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const now = new Date();
    // Ensure required fields have default values if they're not provided
    const user: User = { 
      ...insertUser, 
      id, 
      createdAt: now,
      riskProfile: insertUser.riskProfile || "Moderate",
      investmentStyle: insertUser.investmentStyle || "Growth"
    };
    this.users.set(id, user);
    return user;
  }
  
  // Portfolio asset operations
  async getPortfolioAssets(userId: number): Promise<PortfolioAsset[]> {
    return Array.from(this.portfolioAssets.values()).filter(
      (asset) => asset.userId === userId,
    );
  }
  
  async addPortfolioAsset(asset: InsertPortfolioAsset): Promise<PortfolioAsset> {
    const id = this.portfolioAssetIdCounter++;
    const now = new Date();
    const portfolioAsset: PortfolioAsset = { 
      ...asset, 
      id, 
      lastUpdated: now,
      ticker: asset.ticker || null
    };
    this.portfolioAssets.set(id, portfolioAsset);
    return portfolioAsset;
  }
  
  async updatePortfolioAsset(id: number, asset: Partial<InsertPortfolioAsset>): Promise<PortfolioAsset | undefined> {
    const existingAsset = this.portfolioAssets.get(id);
    if (!existingAsset) return undefined;
    
    const now = new Date();
    const updatedAsset: PortfolioAsset = { ...existingAsset, ...asset, lastUpdated: now };
    this.portfolioAssets.set(id, updatedAsset);
    return updatedAsset;
  }
  
  async deletePortfolioAsset(id: number): Promise<boolean> {
    return this.portfolioAssets.delete(id);
  }
  
  // Financial goals operations
  async getFinancialGoals(userId: number): Promise<FinancialGoal[]> {
    return Array.from(this.financialGoals.values()).filter(
      (goal) => goal.userId === userId,
    );
  }
  
  async addFinancialGoal(goal: InsertFinancialGoal): Promise<FinancialGoal> {
    const id = this.financialGoalIdCounter++;
    const now = new Date();
    const financialGoal: FinancialGoal = { 
      ...goal, 
      id, 
      createdAt: now,
      targetDate: goal.targetDate || null
    };
    this.financialGoals.set(id, financialGoal);
    return financialGoal;
  }
  
  async updateFinancialGoal(id: number, goal: Partial<InsertFinancialGoal>): Promise<FinancialGoal | undefined> {
    const existingGoal = this.financialGoals.get(id);
    if (!existingGoal) return undefined;
    
    const updatedGoal: FinancialGoal = { ...existingGoal, ...goal };
    this.financialGoals.set(id, updatedGoal);
    return updatedGoal;
  }
  
  async deleteFinancialGoal(id: number): Promise<boolean> {
    return this.financialGoals.delete(id);
  }
  
  // Chat message operations
  async getChatHistory(userId: number, limit?: number): Promise<ChatMessage[]> {
    const userMessages = Array.from(this.chatMessages.values())
      .filter((msg) => msg.userId === userId)
      .sort((a, b) => {
        // Safely handle null timestamps, defaulting to current time
        const timeA = a.timestamp ? a.timestamp.getTime() : Date.now();
        const timeB = b.timestamp ? b.timestamp.getTime() : Date.now();
        return timeA - timeB;
      });
    
    if (limit) {
      return userMessages.slice(-limit);
    }
    
    return userMessages;
  }
  
  async addChatMessage(message: InsertChatMessage): Promise<ChatMessage> {
    const id = this.chatMessageIdCounter++;
    const now = new Date();
    const chatMessage: ChatMessage = { ...message, id, timestamp: now };
    this.chatMessages.set(id, chatMessage);
    return chatMessage;
  }
  
  // Market data operations
  async getAllMarketData(): Promise<MarketData[]> {
    return Array.from(this.marketData.values());
  }
  
  async updateMarketData(id: number, data: Partial<InsertMarketData>): Promise<MarketData | undefined> {
    const existingData = this.marketData.get(id);
    if (!existingData) return undefined;
    
    const now = new Date();
    const updatedData: MarketData = { ...existingData, ...data, lastUpdated: now };
    this.marketData.set(id, updatedData);
    return updatedData;
  }
  
  async addMarketData(data: InsertMarketData): Promise<MarketData> {
    const id = this.marketDataIdCounter++;
    const now = new Date();
    const marketDataItem: MarketData = { ...data, id, lastUpdated: now };
    this.marketData.set(id, marketDataItem);
    return marketDataItem;
  }
  
  // Initialize sample market data
  private initializeSampleMarketData() {
    const now = new Date();
    const initialMarketData: MarketData[] = [
      {
        id: this.marketDataIdCounter++,
        name: "S&P 500",
        value: "4782.45",
        change: "32.21",
        percentChange: "0.68",
        lastUpdated: now
      },
      {
        id: this.marketDataIdCounter++,
        name: "NASDAQ",
        value: "15943.12",
        change: "161.23",
        percentChange: "1.02",
        lastUpdated: now
      },
      {
        id: this.marketDataIdCounter++,
        name: "10-YR TREASURY",
        value: "3.47",
        change: "-0.05",
        percentChange: "-1.42",
        lastUpdated: now
      }
    ];
    
    initialMarketData.forEach(data => {
      this.marketData.set(data.id, data);
    });
  }
}

export const storage = new MemStorage();
