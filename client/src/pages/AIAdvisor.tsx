import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { ChatInterface } from "@/components/ChatInterface";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { quickReplyOptions } from "@/lib/dummyData";
import { useAuth } from "@/hooks/use-auth";

export default function AIAdvisor() {
  const { user } = useAuth();
  const [selectedContext, setSelectedContext] = useState<string>("general");
  
  const contextMap = {
    general: "General financial advice",
    investing: "Investment strategy recommendations",
    retirement: "Retirement planning",
    taxes: "Tax optimization strategies",
    estate: "Estate planning guidance"
  };
  
  return (
    <DashboardLayout>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left sidebar */}
        <div className="md:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>AI Advisor Context</CardTitle>
              <CardDescription>Select the context for your conversation</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {Object.entries(contextMap).map(([key, value]) => (
                  <Button 
                    key={key}
                    variant={selectedContext === key ? "default" : "outline"}
                    className="w-full justify-start text-left"
                    onClick={() => setSelectedContext(key)}
                  >
                    <div className="flex items-center">
                      <span className="material-icons mr-2">
                        {key === "general" ? "stars" : 
                         key === "investing" ? "trending_up" :
                         key === "retirement" ? "account_balance" :
                         key === "taxes" ? "receipt" : "description"}
                      </span>
                      <div>
                        <div className="font-medium">{value}</div>
                      </div>
                    </div>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Quick Questions</CardTitle>
              <CardDescription>Suggested topics for your advisor</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {quickReplyOptions.map((option, index) => (
                  <Button key={index} variant="outline" className="w-full justify-start text-left">
                    <span className="material-icons mr-2">help_outline</span>
                    <span>{option}</span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Your Financial Profile</CardTitle>
              <CardDescription>Information shared with AI Advisor</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <div className="text-sm text-gray-500">Risk Tolerance</div>
                  <div className="font-medium">{user?.riskProfile || "Moderate"}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Investment Horizon</div>
                  <div className="font-medium">{"Long-term (10+ years)"}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Financial Goals</div>
                  <div className="font-medium">{"Retirement, Education"}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Income Bracket</div>
                  <div className="font-medium">{"$100,000 - $150,000"}</div>
                </div>
                <div className="pt-2">
                  <Button variant="outline" size="sm" className="w-full">
                    <span className="material-icons mr-2 text-sm">edit</span>
                    Update Profile
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Main chat area */}
        <div className="md:col-span-2">
          <Card className="h-full">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>AI Wealth Advisor</CardTitle>
                  <CardDescription>
                    Currently discussing: <span className="font-medium">{contextMap[selectedContext as keyof typeof contextMap]}</span>
                  </CardDescription>
                </div>
                <Tabs defaultValue="chat">
                  <TabsList>
                    <TabsTrigger value="chat">Chat</TabsTrigger>
                    <TabsTrigger value="history">History</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="h-[calc(100vh-12rem)]">
                <ChatInterface />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}