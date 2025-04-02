import { ChatInterface } from "@/components/ChatInterface";
import { DashboardLayout } from "@/components/DashboardLayout";

export default function AIAdvisorPage() {
  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6 h-[calc(100vh-8rem)]">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">AI Advisor</h1>
        </div>
        
        <div className="grid gap-6 h-full">
          <ChatInterface />
        </div>
      </div>
    </DashboardLayout>
  );
}