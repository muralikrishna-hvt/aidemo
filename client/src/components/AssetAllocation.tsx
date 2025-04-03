import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { assetAllocation } from "@/lib/dummyData";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { useState, useEffect } from "react";

export function AssetAllocation() {
  const [chartData, setChartData] = useState(assetAllocation.map(asset => ({
    name: asset.assetClass,
    value: asset.percentage,
    color: asset.color
  })));

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
          </div>
          
          {/* Asset breakdown list */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
            {assetAllocation.map((asset, index) => (
              <div key={index} className="flex items-center text-sm">
                <div className={`w-2.5 h-2.5 rounded-full ${asset.color} mr-2`}></div>
                <span className="text-gray-700 flex-1 truncate">{asset.assetClass}</span>
                <span className="font-mono text-xs ml-1">{asset.percentage}%</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
