import { DashboardLayout } from "@/components/DashboardLayout";
import { MarketInsights } from "@/components/MarketInsights";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { marketData, marketNews } from "@/lib/dummyData";
import { useQuery } from "@tanstack/react-query";
import { MarketData } from "@shared/schema";

export default function Markets() {
  // Use real market data from API when available
  const { data: liveMarketData } = useQuery<MarketData[]>({
    queryKey: ["/api/market/data"],
    enabled: true
  });
  
  // If no live data, use the dummy data
  const marketItems = liveMarketData || marketData;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Market Insights</h1>
          <p className="text-gray-600 mt-1">Stay updated with the latest market trends and financial news</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {marketItems.map(item => (
            <Card key={item.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-lg">{item.name}</CardTitle>
                    <CardDescription>{item.symbol}</CardDescription>
                  </div>
                  <div className={`text-right ${Number(item.percentChange) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    <div className="text-xl font-bold">${Number(item.currentPrice).toFixed(2)}</div>
                    <div className="flex items-center text-sm">
                      <span className="material-icons text-sm mr-1">
                        {Number(item.percentChange) >= 0 ? 'arrow_upward' : 'arrow_downward'}
                      </span>
                      <span>{Math.abs(Number(item.percentChange)).toFixed(2)}%</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="w-full h-24 bg-gray-100 rounded-md flex items-center justify-center">
                  {/* Chart visualization would go here */}
                  <span className="text-gray-500">Price Chart</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <MarketInsights />
        
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Financial News</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {marketNews.map((news, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <div>
                    <div className="flex items-center">
                      <div className="bg-primary/10 text-primary font-medium px-2 py-1 rounded text-xs">
                        {news.category}
                      </div>
                      <div className="ml-2 text-gray-500 text-xs">{news.date}</div>
                    </div>
                    <CardTitle className="mt-2">{news.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{news.summary}</p>
                  <div className="mt-4">
                    <a href="#" className="text-primary font-medium text-sm flex items-center">
                      Read More
                      <span className="material-icons text-sm ml-1">arrow_forward</span>
                    </a>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}