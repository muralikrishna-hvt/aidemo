import { ChatInterface } from "@/components/ChatInterface";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";

export default function AIAdvisorPage() {
  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6 max-h-[calc(100vh-8rem)]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900">AI Wealth Advisor</h1>
            <p className="text-sm md:text-base text-gray-600 mt-1">
              Your personal financial assistant powered by Gemini with Model Context Protocol
            </p>
          </div>
          
          <div className="flex items-center space-x-2 bg-blue-50 text-blue-700 px-3 py-2 rounded-lg text-sm">
            <span className="material-icons text-blue-600">lightbulb</span>
            <span>Ask about investments, savings goals, or market insights</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 h-full">
          <div className="xl:col-span-3">
            <ChatInterface />
          </div>
          
          <div className="hidden xl:block">
            <Card className="h-full border border-gray-200 shadow-sm">
              <CardContent className="p-5">
                <h3 className="text-lg font-semibold mb-4 text-gray-900">Conversation Topics</h3>
                
                <div className="space-y-4">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <h4 className="font-medium text-gray-800 mb-1">Investment Strategies</h4>
                    <p className="text-sm text-gray-600">Ask about asset allocation, diversification, or tax-efficient investing</p>
                  </div>
                  
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <h4 className="font-medium text-gray-800 mb-1">Financial Planning</h4>
                    <p className="text-sm text-gray-600">Discuss retirement planning, education savings, or emergency funds</p>
                  </div>
                  
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <h4 className="font-medium text-gray-800 mb-1">Market Analysis</h4>
                    <p className="text-sm text-gray-600">Get insights on market trends, sector performance, or economic indicators</p>
                  </div>
                  
                  <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                    <h4 className="font-medium text-blue-800 mb-1 flex items-center">
                      <span className="material-icons text-blue-600 mr-1 text-sm">psychology</span>
                      Powered by Gemini MCP
                    </h4>
                    <p className="text-sm text-blue-700">Our AI remembers context from previous conversations to provide more relevant advice</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}