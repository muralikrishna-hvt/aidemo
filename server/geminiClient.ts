import { log } from "./vite";

// Simulation of the Gemini API with Model Context Protocol (MCP)
export class GeminiClient {
  private apiKey: string;
  private baseUrl: string;
  private contextStore: Map<number, string[]>;
  private maxContextLength: number;

  constructor() {
    this.apiKey = process.env.GEMINI_API_KEY || "demo_key";
    this.baseUrl = "https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent";
    this.contextStore = new Map();
    this.maxContextLength = 10; // Store last 10 messages for context
  }

  // Model Context Protocol implementation
  private getContext(userId: number): string[] {
    if (!this.contextStore.has(userId)) {
      this.contextStore.set(userId, []);
    }
    return this.contextStore.get(userId) || [];
  }

  private addToContext(userId: number, message: string, isUser: boolean = true): void {
    const context = this.getContext(userId);
    const prefix = isUser ? "User: " : "Assistant: ";
    context.push(`${prefix}${message}`);
    
    // Maintain context window size
    if (context.length > this.maxContextLength) {
      context.shift();
    }
    
    this.contextStore.set(userId, context);
  }

  // Generate response using Gemini API
  async generateResponse(userId: number, message: string): Promise<string> {
    try {
      // Add user message to context
      this.addToContext(userId, message, true);
      
      // Get current context
      const context = this.getContext(userId);
      
      // In a real implementation, we would call the Gemini API here
      // For this demo, we'll generate a simple response based on the message
      log(`[GeminiClient] Would call Gemini API with context: ${context.length} messages`, "gemini");
      
      const response = this.generateSimulatedResponse(message);
      
      // Add AI response to context
      this.addToContext(userId, response, false);
      
      return response;
    } catch (error) {
      log(`[GeminiClient] Error generating response: ${error}`, "gemini");
      return "I apologize, but I'm having trouble processing your request right now. Please try again later.";
    }
  }

  // Simulated response generator
  private generateSimulatedResponse(message: string): string {
    // Simplified response logic based on keywords in the message
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes("portfolio") && lowerMessage.includes("performance")) {
      return "Your portfolio has been performing well lately. Over the past month, you've seen a 2.4% increase, outperforming the S&P 500 by 0.8%. Your technology stocks, particularly in the AI sector, have been the main drivers of this growth. Would you like me to prepare a detailed analysis of your portfolio performance?";
    } 
    else if (lowerMessage.includes("market") && (lowerMessage.includes("update") || lowerMessage.includes("news"))) {
      return "Today's market is showing positive trends across major indices. The S&P 500 is up 0.68%, and the NASDAQ has gained 1.02%. Recent Fed statements have hinted at potential rate cuts, which has boosted market sentiment. The technology and healthcare sectors are leading today's gains, while energy stocks are facing some pressure due to falling oil prices.";
    }
    else if (lowerMessage.includes("investment") && (lowerMessage.includes("idea") || lowerMessage.includes("recommendation"))) {
      return "Based on your risk profile and investment goals, I have a few recommendations: 1) Consider increasing your exposure to green energy ETFs, which align with your interest in sustainable investments and have shown strong performance, 2) The AI & Robotics sector continues to show promise and aligns with your technology focus, 3) With potential rate cuts on the horizon, it might be worth looking at high-quality dividend stocks for stable income. Would you like more details on any of these recommendations?";
    }
    else if (lowerMessage.includes("goal") || lowerMessage.includes("saving")) {
      return "You're making good progress on your financial goals. Your children's education fund is 67% complete, which is right on track. However, your vacation home savings could use some attention - you're currently at 35% of your target and might need to increase monthly contributions to meet your timeline. Would you like me to analyze how adjusting your contributions might affect your timeline?";
    }
    else if (lowerMessage.includes("risk") || lowerMessage.includes("allocation")) {
      return "Your current asset allocation (58.4% stocks, 22.1% bonds, 10.3% real estate, 6.4% cash, and 2.8% crypto) puts you in a moderate risk profile. Based on recent market trends and your financial goals, I suggest slightly increasing your bond allocation by 3-5% to hedge against potential market volatility in the coming quarter. This would still maintain your growth trajectory while adding some protection.";
    }
    else if (lowerMessage.includes("tax") || lowerMessage.includes("taxes")) {
      return "Looking at your portfolio, there are several tax optimization opportunities: 1) Consider tax-loss harvesting with your underperforming consumer goods stocks, 2) Maximize your retirement account contributions, which are currently $3,500 below your annual limit, 3) Your dividend-paying stocks in taxable accounts could be more efficiently placed in tax-advantaged accounts. Would you like me to prepare a tax optimization strategy document?";
    }
    else {
      return "Thank you for your message. As your AI wealth advisor, I'm here to help with portfolio analysis, investment recommendations, financial planning, and market insights. Could you please be more specific about what financial information you're looking for today?";
    }
  }
}

// Export singleton instance
export const geminiClient = new GeminiClient();
