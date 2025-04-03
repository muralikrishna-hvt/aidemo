import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { PortfolioAsset } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";

// Colors for different asset classes
const assetColors = {
  "Stocks": "bg-primary-500",
  "Bonds": "bg-secondary-500",
  "Real Estate": "bg-accent-500",
  "Cash": "bg-gray-400",
  "Crypto": "bg-purple-500",
  "Commodities": "bg-amber-500",
  "Alternative": "bg-rose-500",
  "Other": "bg-slate-500"
};

export function AssetAllocation() {
  const { user } = useAuth();
  
  const { data: portfolioAssets, isLoading } = useQuery<PortfolioAsset[]>({
    queryKey: ['/api/portfolio'],
    enabled: !!user
  });
  
  const [chartData, setChartData] = useState<Array<{
    name: string;
    value: number;
    color: string;
  }>>([]);
  
  useEffect(() => {
    if (portfolioAssets && portfolioAssets.length > 0) {
      const processedData = portfolioAssets.map(asset => ({
        name: asset.assetClass,
        value: Number(asset.percentage),
        color: assetColors[asset.assetClass as keyof typeof assetColors] || "bg-gray-500"
      }));
      setChartData(processedData);
    }
  }, [portfolioAssets]);

  if (isLoading) {
    return (
      <Card className="shadow-sm border border-gray-200 h-full">
        <CardHeader className="p-4 pb-0">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg font-semibold">Asset Allocation</CardTitle>
            <Skeleton className="h-4 w-24" />
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <div className="space-y-3">
            <Skeleton className="h-40 md:h-44 w-full rounded-lg" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-5 w-full" />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-sm border border-gray-200 h-full">
      <CardHeader className="p-4 pb-0">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-semibold">Asset Allocation</CardTitle>
          <Button variant="link" className="text-primary text-sm font-medium p-0">
            View Details
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Asset allocation chart */}
          <div className="h-40 md:h-44 rounded-lg flex items-center justify-center">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={2}
                    dataKey="value"
                    labelLine={false}
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={`hsl(var(--${entry.color.split('-')[1]}))`} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number) => [`${value}%`, 'Allocation']}
                    contentStyle={{ borderRadius: '0.375rem', border: '1px solid #e2e8f0' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center w-full h-full text-gray-500 text-sm">
                No asset allocation data available
              </div>
            )}
          </div>
          
          {/* Asset breakdown list */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
            {chartData.map((asset, index) => (
              <div key={index} className="flex items-center text-sm">
                <div className={`w-2.5 h-2.5 rounded-full ${asset.color} mr-2`}></div>
                <span className="text-gray-700 flex-1 truncate">{asset.name}</span>
                <span className="font-mono text-xs ml-1">{asset.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
