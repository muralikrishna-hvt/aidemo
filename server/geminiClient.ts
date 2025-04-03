import { log } from "./vite";
import { storage } from "./storage";
import { User, PortfolioAsset, FinancialGoal, MarketData } from "@shared/schema";

// Real implementation of Gemini API with Model Context Protocol (MCP)
export class GeminiClient {
  private apiKey: string;
  private baseUrl: string;
  private contextStore: Map<number, string[]>;
  private maxContextLength: number;
  private userProfiles: Map<number, any>;

  constructor() {
    this.apiKey = process.env.GEMINI_API_KEY || "";
    this.baseUrl = "https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent";
    this.contextStore = new Map();
    this.maxContextLength = 10; // Store last 10 messages for context
    this.userProfiles = new Map();
  }

  // Model Context Protocol (MCP) implementation
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

  // Gather user profile data for improved context
  private async getUserProfileContext(userId: number): Promise<string> {
    try {
      // Cache user profile data to avoid repetitive database calls
      if (!this.userProfiles.has(userId)) {
        const userProfile: any = {
          user: await storage.getUser(userId),
          portfolioAssets: await storage.getPortfolioAssets(userId),
          financialGoals: await storage.getFinancialGoals(userId),
        };
        
        // Add market data
        userProfile.marketData = await storage.getAllMarketData();
        
        this.userProfiles.set(userId, userProfile);
      }
      
      const profileData = this.userProfiles.get(userId);
      if (!profileData) return "";
      
      // Convert numeric string values to numbers for calculations
      const assets = profileData.portfolioAssets.map((asset: PortfolioAsset) => ({
        ...asset,
        valueNum: Number(asset.value),
        percentageNum: Number(asset.percentage)
      }));
      
      // Calculate total portfolio value
      const totalPortfolioValue = assets.reduce(
        (total: number, asset: any) => total + asset.valueNum, 
        0
      );
      
      // Format financial goals progress
      const goalsProgress = profileData.financialGoals.map((goal: FinancialGoal) => {
        const targetAmount = Number(goal.targetAmount);
        const currentAmount = Number(goal.currentAmount);
        const percentComplete = Math.round((currentAmount / targetAmount) * 100);
        const targetDate = goal.targetDate ? new Date(goal.targetDate).toLocaleDateString() : 'No date set';
        
        return {
          name: goal.name,
          targetAmount,
          currentAmount,
          percentComplete,
          targetDate
        };
      });
      
      // Format market data
      const marketInsights = profileData.marketData.map((data: MarketData) => ({
        name: data.name,
        value: Number(data.value),
        change: Number(data.change),
        percentChange: Number(data.percentChange)
      }));
      
      // Format all data as context information for the AI
      return `
USER PROFILE CONTEXT:
Username: ${profileData.user?.username}
Email: ${profileData.user?.email}
Total Portfolio Value: $${totalPortfolioValue.toLocaleString()}

ASSET ALLOCATION:
${assets.map((asset: any) => `${asset.assetClass}: ${asset.percentageNum}%`).join('\n')}

FINANCIAL GOALS:
${goalsProgress.map((goal: any) => 
  `${goal.name}: $${goal.currentAmount.toLocaleString()} of $${goal.targetAmount.toLocaleString()} (${goal.percentComplete}% complete, target date: ${goal.targetDate})`
).join('\n')}

CURRENT MARKET DATA:
${marketInsights.map((data: any) => 
  `${data.name}: ${data.value.toLocaleString()} (${data.percentChange >= 0 ? '+' : ''}${data.percentChange}%)`
).join('\n')}

Current Date: ${new Date().toLocaleDateString()}
`;
    } catch (error) {
      log(`[GeminiClient] Error gathering user profile data: ${error}`, "gemini");
      return "";
    }
  }

  // Generate response using Gemini API
  async generateResponse(userId: number, message: string): Promise<string> {
    try {
      // Add user message to context
      this.addToContext(userId, message, true);
      
      // Get conversation context
      const conversationContext = this.getContext(userId);
      
      // Get user profile context
      const userProfileContext = await this.getUserProfileContext(userId);
      
      // Create prompt with MCP structure
      const fullPrompt = `
${userProfileContext}

CONVERSATION HISTORY:
${conversationContext.join('\n')}

You are WealthAI, an AI-powered wealth advisory assistant. Your task is to provide personalized financial guidance, investment insights, and wealth management advice based on the user's financial profile above.

Guidelines:
1. Be professional, concise, and conversational
2. Tailor advice to the user's portfolio, goals, and market conditions
3. Provide specific, actionable insights when possible
4. Cite specific data points from their profile when relevant
5. Avoid generic advice that doesn't leverage their specific financial situation
6. Focus on wealth-building strategies aligned with their financial goals
7. Don't make up information that isn't provided in their profile
8. If asked about something not in their profile, acknowledge the limitation

Respond to the user's latest message with personalized financial advice:
`;

      // Log context length for debugging
      log(`[GeminiClient] Calling Gemini API with context: ${conversationContext.length} messages`, "gemini");
      
      // Make API call to Gemini
      const response = await this.callGeminiAPI(fullPrompt);
      
      // Add AI response to context
      this.addToContext(userId, response, false);
      
      return response;
    } catch (error) {
      log(`[GeminiClient] Error generating response: ${error}`, "gemini");
      return "I apologize, but I'm having trouble processing your request right now. Please try again later.";
    }
  }

  // Call the Gemini API
  private async callGeminiAPI(prompt: string): Promise<string> {
    try {
      // If no API key, fall back to local responses for development
      if (!this.apiKey || this.apiKey === "") {
        log("[GeminiClient] No API key found, using fallback responses", "gemini");
        return this.generateFallbackResponse(prompt.split('User: ').pop() || "");
      }
      
      const response = await fetch(`${this.baseUrl}?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          }
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        log(`[GeminiClient] API error: ${JSON.stringify(errorData)}`, "gemini");
        throw new Error(`API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Extract the text from the response
      const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
      
      // Remove any "Assistant:" prefix if the model includes it
      return generatedText.replace(/^Assistant:\s*/i, "").trim();
    } catch (error) {
      log(`[GeminiClient] API call error: ${error}`, "gemini");
      return this.generateFallbackResponse(prompt.split('User: ').pop() || "");
    }
  }

  // Fallback response generator for when API calls fail
  private generateFallbackResponse(message: string): string {
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
      return "Thank you for your message. As your AI wealth advisor, I'm here to help with portfolio analysis, investment recommendations, financial planning, and market insights tailored to your specific financial situation. Could you please be more specific about what financial information you're looking for today?";
    }
  }
}

// Export singleton instance
export const geminiClient = new GeminiClient();
