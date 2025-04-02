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
    <Card className="shadow-sm border border-gray-200">
      <CardHeader className="p-5 pb-0">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-semibold">Asset Allocation</CardTitle>
          <Button variant="link" className="text-primary text-sm font-medium p-0">
            View Details
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-5">
        <div className="space-y-4">
          {/* Asset allocation chart */}
          <div className="h-48 rounded-lg flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(1)}%`}
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
          <div className="space-y-3 mt-4">
            {assetAllocation.map((asset, index) => (
              <div key={index} className="flex items-center">
                <div className={`w-3 h-3 rounded-full ${asset.color} mr-3`}></div>
                <span className="text-gray-700 flex-1">{asset.assetClass}</span>
                <span className="font-mono">{asset.percentage}%</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
