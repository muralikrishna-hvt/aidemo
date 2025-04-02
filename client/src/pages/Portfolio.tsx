import { DashboardLayout } from "@/components/DashboardLayout";
import { AssetAllocation } from "@/components/AssetAllocation";
import { FinancialGoals } from "@/components/FinancialGoals";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { assetAllocation } from "@/lib/dummyData";
import { Button } from "@/components/ui/button";

export default function Portfolio() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Portfolio Management</h1>
          <p className="text-gray-600 mt-1">Track, analyze, and optimize your investment portfolio</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Total Value</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">$248,750.35</div>
              <div className="flex items-center text-green-600 mt-1">
                <span className="material-icons text-sm">arrow_upward</span>
                <span className="text-sm">+5.32% ($12,580.12)</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Year-to-Date Return</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">+14.8%</div>
              <div className="text-gray-500 mt-1 text-sm">
                vs. S&P 500: +10.2%
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Risk Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">Moderate</div>
              <div className="text-gray-500 mt-1 text-sm">
                Volatility: 0.85 Beta
              </div>
            </CardContent>
          </Card>
        </div>
        
        <AssetAllocation />
        
        <Card>
          <CardHeader>
            <CardTitle>Investment Holdings</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all">
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="stocks">Stocks</TabsTrigger>
                <TabsTrigger value="bonds">Bonds</TabsTrigger>
                <TabsTrigger value="crypto">Crypto</TabsTrigger>
                <TabsTrigger value="alternatives">Alternatives</TabsTrigger>
              </TabsList>
              
              <TabsContent value="all" className="mt-4">
                <div className="overflow-x-auto">
                  <table className="w-full table-auto">
                    <thead>
                      <tr className="bg-gray-50 text-left">
                        <th className="px-4 py-2 text-gray-600 font-medium">Asset</th>
                        <th className="px-4 py-2 text-gray-600 font-medium">Type</th>
                        <th className="px-4 py-2 text-gray-600 font-medium">Current Value</th>
                        <th className="px-4 py-2 text-gray-600 font-medium">Allocation</th>
                        <th className="px-4 py-2 text-gray-600 font-medium">Return</th>
                        <th className="px-4 py-2 text-gray-600 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {assetAllocation.map((asset, index) => (
                        <tr key={index} className="border-b border-gray-100">
                          <td className="px-4 py-3">
                            <div className="font-medium">{asset.name}</div>
                            <div className="text-gray-500 text-sm">{asset.ticker}</div>
                          </td>
                          <td className="px-4 py-3">{asset.category}</td>
                          <td className="px-4 py-3 font-medium">${asset.value.toLocaleString()}</td>
                          <td className="px-4 py-3">{asset.percentage}%</td>
                          <td className={`px-4 py-3 font-medium ${asset.returnValue > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {asset.returnValue > 0 ? '+' : ''}{asset.returnValue}%
                          </td>
                          <td className="px-4 py-3">
                            <Button variant="ghost" size="sm">
                              <span className="material-icons text-sm">more_vert</span>
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </TabsContent>
              
              <TabsContent value="stocks" className="mt-4">
                <div className="text-center py-8 text-gray-500">
                  Specific stocks section would go here
                </div>
              </TabsContent>
              
              <TabsContent value="bonds" className="mt-4">
                <div className="text-center py-8 text-gray-500">
                  Specific bonds section would go here
                </div>
              </TabsContent>
              
              <TabsContent value="crypto" className="mt-4">
                <div className="text-center py-8 text-gray-500">
                  Specific crypto section would go here
                </div>
              </TabsContent>
              
              <TabsContent value="alternatives" className="mt-4">
                <div className="text-center py-8 text-gray-500">
                  Specific alternatives section would go here
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        
        <FinancialGoals />
        
        <div className="flex justify-end">
          <Button className="bg-primary">
            <span className="material-icons mr-2">add</span>
            Add New Asset
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}