import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { marketData, marketNews, investmentOpportunities } from "@/lib/dummyData";

export function MarketInsights() {
  const getFormattedTime = () => {
    const now = new Date();
    return now.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
      timeZoneName: 'short'
    });
  };

  return (
    <Card className="shadow-sm border border-gray-200 h-full">
      <CardHeader className="p-4 pb-0">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-semibold">Market Insights</CardTitle>
          <div className="text-xs text-gray-500">Last updated: {getFormattedTime()}</div>
        </div>
      </CardHeader>
      <CardContent className="p-4 overflow-y-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
          {marketData.map((item) => (
            <div key={item.id} className="bg-gray-50 p-3 rounded-lg">
              <div className="text-xs text-gray-500 mb-1">{item.name}</div>
              <div className="font-medium text-base font-mono">{item.value.toLocaleString('en-US', { 
                minimumFractionDigits: item.name.includes('TREASURY') ? 2 : 2,
                maximumFractionDigits: item.name.includes('TREASURY') ? 2 : 2
              })}{item.name.includes('TREASURY') ? '%' : ''}</div>
              <div className={`${item.percentChange >= 0 ? 'text-success' : 'text-danger'} text-xs font-mono flex items-center`}>
                <span className="material-icons text-[10px] mr-1">
                  {item.percentChange >= 0 ? 'arrow_upward' : 'arrow_downward'}
                </span>
                {item.percentChange >= 0 ? '+' : ''}{item.percentChange}% 
                {!item.name.includes('TREASURY') && ` (${item.change >= 0 ? '+' : ''}${item.change})`}
              </div>
            </div>
          ))}
        </div>
        
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
                    <span className={`material-icons text-[10px] ${news.iconColor} mr-1`}>{news.icon}</span>
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
                  <div className="text-success font-medium font-mono text-xs whitespace-nowrap">{opportunity.performance}</div>
                </div>
                <div className="mt-2 flex items-center text-[10px] text-gray-500">
                  <span className="material-icons text-[10px] text-primary mr-1">insights</span>
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
