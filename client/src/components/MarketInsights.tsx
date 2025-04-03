import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { MarketData } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/use-auth";
import { marketNews, investmentOpportunities } from "@/lib/dummyData";

export function MarketInsights() {
  const { user } = useAuth();
  
  const { data: marketData, isLoading } = useQuery<MarketData[]>({
    queryKey: ['/api/market/data']
  });
  
  const getFormattedTime = () => {
    const now = new Date();
    return now.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
      timeZoneName: 'short'
    });
  };

  if (isLoading) {
    return (
      <Card className="shadow-sm border border-gray-200 h-full">
        <CardHeader className="p-4 pb-0">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg font-semibold">Market Insights</CardTitle>
            <Skeleton className="h-4 w-24" />
          </div>
        </CardHeader>
        <CardContent className="p-4 overflow-y-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-20 w-full rounded-lg" />
            ))}
          </div>
          <Skeleton className="h-4 w-40 mb-2" />
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <Skeleton key={i} className="h-16 w-full rounded-lg" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-sm border border-gray-200 h-full">
      <CardHeader className="p-4 pb-0">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-semibold">Market Insights</CardTitle>
          <div className="text-xs text-gray-500">Last updated: {getFormattedTime()}</div>
        </div>
      </CardHeader>
      <CardContent className="p-4 overflow-y-auto">
        {!marketData || marketData.length === 0 ? (
          <div className="flex items-center justify-center h-20 text-gray-500 text-sm">
            No market data available
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
            {marketData.map((item) => {
              const value = Number(item.value);
              const change = Number(item.change);
              const percentChange = Number(item.percentChange);
              
              return (
                <div key={item.id} className="bg-gray-50 p-3 rounded-lg">
                  <div className="text-xs text-gray-500 mb-1">{item.name}</div>
                  <div className="font-medium text-base font-mono">{value.toLocaleString('en-US', { 
                    minimumFractionDigits: item.name.includes('TREASURY') ? 2 : 2,
                    maximumFractionDigits: item.name.includes('TREASURY') ? 2 : 2
                  })}{item.name.includes('TREASURY') ? '%' : ''}</div>
                  <div className={`${percentChange >= 0 ? 'text-green-600' : 'text-red-600'} text-xs font-mono flex items-center`}>
                    {percentChange >= 0 ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M12 7a1 1 0 01-1 1H5a1 1 0 01-1-1V3a1 1 0 011-1h2a1 1 0 010 2H6v2h5a1 1 0 011 1z" clipRule="evenodd" />
                        <path fillRule="evenodd" d="M3 13a1 1 0 011-1h2a1 1 0 010 2H4v2h5a1 1 0 001 1h2a1 1 0 001-1v-4a1 1 0 00-1-1H3z" clipRule="evenodd" transform="rotate(180 10 10)" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M12 13a1 1 0 01-1 1H5a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 010 2H6v2h5a1 1 0 011 1z" clipRule="evenodd" />
                        <path fillRule="evenodd" d="M3 7a1 1 0 011-1h2a1 1 0 010 2H4v2h5a1 1 0 001 1h2a1 1 0 001-1V7a1 1 0 00-1-1H3z" clipRule="evenodd" transform="rotate(180 10 10)" />
                      </svg>
                    )}
                    {percentChange >= 0 ? '+' : ''}{percentChange.toFixed(2)}% 
                    {!item.name.includes('TREASURY') && ` (${change >= 0 ? '+' : ''}${change.toFixed(2)})`}
                  </div>
                </div>
              );
            })}
          </div>
        )}
        
        <div className="mb-4">
          <h3 className="font-medium text-gray-700 text-sm mb-2">Market News & Analysis</h3>
          <div className="space-y-3">
            {marketNews.slice(0, 2).map((news) => (
              <div key={news.id} className="flex space-x-2 pb-2 border-b border-gray-100">
                <div className={`w-2 h-2 ${news.dotColor} rounded-full mt-1.5 flex-shrink-0`}></div>
                <div>
                  <h4 className="font-medium text-gray-800 text-sm">{news.title}</h4>
                  <p className="text-gray-600 text-xs mt-0.5">{news.content}</p>
                  <div className="flex items-center mt-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-3 w-3 ${news.iconColor} mr-1`} viewBox="0 0 20 20" fill="currentColor">
                      <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.34.208-.646.477-.859a4 4 0 10-4.954 0c.27.213.462.519.476.859h4.002z" />
                    </svg>
                    <span className="text-[10px] text-gray-500">{news.impact}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <h3 className="font-medium text-gray-700 text-sm mb-2">AI-Generated Investment Opportunities</h3>
          <div className="grid grid-cols-1 gap-3">
            {investmentOpportunities.slice(0, 1).map((opportunity) => (
              <div 
                key={opportunity.id} 
                className="border border-gray-200 rounded-lg p-3 hover:border-primary-300 hover:bg-primary-50 transition-colors cursor-pointer"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1 pr-2">
                    <h4 className="font-medium text-gray-800 text-sm">{opportunity.title}</h4>
                    <p className="text-gray-600 text-xs mt-0.5">{opportunity.description}</p>
                  </div>
                  <div className="text-green-600 font-medium font-mono text-xs whitespace-nowrap">{opportunity.performance}</div>
                </div>
                <div className="mt-2 flex items-center text-[10px] text-gray-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-primary mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                  </svg>
                  <span>{opportunity.insight}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
