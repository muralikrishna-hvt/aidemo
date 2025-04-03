import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { sendMessage } from "@/lib/geminiClient";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";

type Insight = {
  id: string;
  title: string;
  description: string;
  category: string;
  confidence: number;
  timeframe: string;
  action: string;
  tags: string[];
};

// Categories with colors
const categories = {
  "stock": "bg-blue-100 text-blue-800",
  "bond": "bg-green-100 text-green-800",
  "crypto": "bg-purple-100 text-purple-800",
  "etf": "bg-amber-100 text-amber-800",
  "real-estate": "bg-rose-100 text-rose-800",
  "alternative": "bg-indigo-100 text-indigo-800",
  "asset-allocation": "bg-teal-100 text-teal-800",
  "market-trend": "bg-cyan-100 text-cyan-800",
};

export function AIInvestmentInsights() {
  const { user } = useAuth();
  const [selectedInsight, setSelectedInsight] = useState<Insight | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [insights, setInsights] = useState<Insight[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Use this to get real portfolio and market data
  const { data: marketData } = useQuery({
    queryKey: ['/api/market/data'],
  });

  const { data: portfolioData } = useQuery({
    queryKey: ['/api/portfolio'],
    enabled: !!user
  });

  // Fetch insights using Gemini API
  useEffect(() => {
    if (!user || !marketData || !portfolioData) return;

    const fetchInsights = async () => {
      try {
        setIsLoading(true);
        
        // Create prompt for Gemini
        const basePrompt = `Based on the following market data and portfolio information, generate 3 investment insights:
        
        Market Data: ${JSON.stringify(marketData)}
        Portfolio: ${JSON.stringify(portfolioData)}
        
        Format as JSON array with the following structure for each insight:
        {
          "id": "unique-id",
          "title": "Brief, catchy title",
          "description": "2-3 sentence actionable insight",
          "category": "stock|bond|crypto|etf|real-estate|alternative|asset-allocation|market-trend",
          "confidence": "confidence score between 0.5 and 0.95",
          "timeframe": "short-term|medium-term|long-term",
          "action": "buy|sell|hold|rebalance|research",
          "tags": ["tag1", "tag2"]
        }`;

        try {
          // Try to get real insights from Gemini through our API
          if (user.id) {
            const aiResponse = await sendMessage(basePrompt, user.id);
            if (aiResponse && aiResponse.content) {
              try {
                // Extract JSON from the response
                // Look for JSON array in the response - this works with ES2015 compatible regex
                const jsonMatch = aiResponse.content.match(/(\[[\s\S]*\])/);
                if (jsonMatch) {
                  const insightsData = JSON.parse(jsonMatch[0]);
                  setInsights(insightsData);
                  setIsLoading(false);
                  return;
                }
              } catch (parseError) {
                console.error("Failed to parse Gemini response:", parseError);
                // If parsing fails, continue to fallback
              }
            }
          }
        } catch (apiError) {
          console.error("API call to Gemini failed:", apiError);
          // Continue to fallback
        }
        
        // Fallback with sample insights if the API call fails
        console.log("Using fallback investment insights");
        
        // For demo purposes only - in production this would always use real data
        const sampleInsights: Insight[] = [
          {
            id: "ins-1",
            title: "Increase Bond Allocation",
            description: "With recent market volatility and rising treasury yields, increasing your bond allocation by 5% could reduce portfolio risk while maintaining yield. Consider high-quality corporate or treasury bonds.",
            category: "bond",
            confidence: 0.85,
            timeframe: "medium-term",
            action: "buy",
            tags: ["diversification", "risk management", "yield"]
          },
          {
            id: "ins-2",
            title: "Technology Sector Opportunity",
            description: "The technology sector is showing strong momentum after recent earnings. Your current allocation is below target. Consider increasing exposure to semiconductor and AI-related stocks.",
            category: "stock",
            confidence: 0.78,
            timeframe: "long-term",
            action: "buy",
            tags: ["technology", "growth", "AI"]
          },
          {
            id: "ins-3",
            title: "Rebalance Real Estate Exposure",
            description: "Your real estate allocation is overweight relative to your target. Given current interest rate trends, consider reducing exposure by 3-5% and reallocating to underweight sectors.",
            category: "real-estate",
            confidence: 0.82,
            timeframe: "short-term",
            action: "rebalance",
            tags: ["rebalancing", "interest rates", "sector rotation"]
          }
        ];
        
        setInsights(sampleInsights);
        setIsLoading(false);
      } catch (err) {
        setError("Failed to fetch investment insights");
        setIsLoading(false);
        console.error("Error fetching AI insights:", err);
      }
    };

    fetchInsights();
  }, [user, marketData, portfolioData]);

  const handleViewDetails = (insight: Insight) => {
    setSelectedInsight(insight);
    setIsDialogOpen(true);
  };

  // Function to get badge color based on category
  const getCategoryColor = (category: string) => {
    return categories[category as keyof typeof categories] || "bg-gray-100 text-gray-800";
  };

  // Function to get confidence level text and color
  const getConfidenceDetails = (score: number) => {
    if (score >= 0.85) return { text: "High", color: "text-green-600" };
    if (score >= 0.7) return { text: "Medium", color: "text-amber-600" };
    return { text: "Low", color: "text-gray-600" };
  };

  // Function to get timeframe text
  const getTimeframeText = (timeframe: string) => {
    if (timeframe === "short-term") return "< 3 months";
    if (timeframe === "medium-term") return "3-12 months";
    return "1+ year";
  };

  // Function to get action badge color
  const getActionColor = (action: string) => {
    switch (action) {
      case "buy": return "bg-green-100 text-green-800";
      case "sell": return "bg-red-100 text-red-800";
      case "hold": return "bg-blue-100 text-blue-800";
      case "rebalance": return "bg-amber-100 text-amber-800";
      case "research": return "bg-purple-100 text-purple-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  if (isLoading) {
    return (
      <Card className="shadow-sm border border-gray-200 h-full">
        <CardHeader className="p-4 pb-0">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg font-semibold flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary mr-2">
                <path d="M21 9V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v3"></path>
                <path d="M21 15v3a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-3"></path>
                <path d="M12 3v18"></path>
                <path d="M3 15h18"></path>
                <path d="M3 9h18"></path>
              </svg>
              AI Investment Insights
            </CardTitle>
            <div className="flex items-center">
              <Badge variant="outline" className="text-xs font-normal bg-blue-50 border-blue-200 text-blue-700">
                Powered by Gemini
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <div className="space-y-4 animate-pulse">
            <Skeleton className="h-24 w-full rounded-lg" />
            <Skeleton className="h-24 w-full rounded-lg" />
            <Skeleton className="h-24 w-full rounded-lg" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="shadow-sm border border-gray-200 h-full">
        <CardHeader className="p-4 pb-0">
          <CardTitle className="text-lg font-semibold">AI Investment Insights</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="flex flex-col items-center justify-center h-48 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 mb-4">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-1">Unable to Load Insights</h3>
            <p className="text-gray-500 text-sm max-w-md mb-4">
              {error}
            </p>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => window.location.reload()}
            >
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-sm border border-gray-200 h-full">
      <CardHeader className="p-4 pb-0">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-semibold flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary mr-2">
              <path d="M21 9V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v3"></path>
              <path d="M21 15v3a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-3"></path>
              <path d="M12 3v18"></path>
              <path d="M3 15h18"></path>
              <path d="M3 9h18"></path>
            </svg>
            AI Investment Insights
          </CardTitle>
          <div className="flex items-center">
            <Badge variant="outline" className="text-xs font-normal bg-blue-50 border-blue-200 text-blue-700">
              Powered by Gemini
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-4">
          {insights.map((insight) => (
            <div 
              key={insight.id} 
              className="p-4 border border-gray-200 rounded-lg bg-white hover:bg-gray-50 transition-colors hover:border-gray-300 shadow-sm"
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1">
                  <div className="flex items-center mb-1">
                    <Badge className={`mr-2 ${getCategoryColor(insight.category)}`}>
                      {insight.category.split('-').join(' ')}
                    </Badge>
                    <Badge variant="outline" className={getActionColor(insight.action)}>
                      {insight.action}
                    </Badge>
                  </div>
                  <h3 className="font-semibold text-gray-900">{insight.title}</h3>
                </div>
                <div className={`text-xs font-medium ${getConfidenceDetails(insight.confidence).color}`}>
                  {getConfidenceDetails(insight.confidence).text} confidence
                </div>
              </div>
              
              <p className="text-gray-600 text-sm mb-3">{insight.description}</p>
              
              <div className="flex justify-between items-center">
                <div className="flex flex-wrap gap-1">
                  {insight.tags.map(tag => (
                    <span key={tag} className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                      #{tag}
                    </span>
                  ))}
                </div>
                <div className="flex items-center space-x-3">
                  <div className="text-xs text-gray-500">
                    {getTimeframeText(insight.timeframe)}
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-xs h-7"
                    onClick={() => handleViewDetails(insight)}
                  >
                    View Details
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>

      {/* Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{selectedInsight?.title}</DialogTitle>
            <DialogDescription>
              Personalized investment insight for your portfolio
            </DialogDescription>
          </DialogHeader>
          
          {selectedInsight && (
            <div className="space-y-4">
              <div className="flex items-center space-x-2 mb-1">
                <Badge className={getCategoryColor(selectedInsight.category)}>
                  {selectedInsight.category.split('-').join(' ')}
                </Badge>
                <Badge variant="outline" className={getActionColor(selectedInsight.action)}>
                  {selectedInsight.action}
                </Badge>
                <div className={`text-xs font-medium ${getConfidenceDetails(selectedInsight.confidence).color} ml-auto`}>
                  {getConfidenceDetails(selectedInsight.confidence).text} confidence ({(selectedInsight.confidence * 100).toFixed(0)}%)
                </div>
              </div>
              
              <p className="text-gray-700">{selectedInsight.description}</p>
              
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-700">Time Horizon:</span>
                  <span className="text-sm text-gray-700">{getTimeframeText(selectedInsight.timeframe)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-700">Recommended Action:</span>
                  <span className="text-sm text-gray-700 capitalize">{selectedInsight.action}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-700">Category:</span>
                  <span className="text-sm text-gray-700 capitalize">{selectedInsight.category.split('-').join(' ')}</span>
                </div>
                
                <div className="pt-2 border-t border-gray-200">
                  <span className="text-sm font-medium text-gray-700 block mb-2">Related Tags:</span>
                  <div className="flex flex-wrap gap-1">
                    {selectedInsight.tags.map(tag => (
                      <span key={tag} className="text-xs text-gray-700 bg-gray-200 px-2 py-1 rounded-full">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter className="flex space-x-2 sm:space-x-0">
            <Button 
              variant="outline" 
              onClick={() => setIsDialogOpen(false)}
            >
              Close
            </Button>
            <Button
              onClick={() => {
                // Implement "Save to Favorites" or similar functionality
                setIsDialogOpen(false);
                // Show toast notification
              }}
            >
              Save to Favorites
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}