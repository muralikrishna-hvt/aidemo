import { DashboardLayout } from "@/components/DashboardLayout";
import { UserProfile } from "@/components/UserProfile";
import { AssetAllocation } from "@/components/AssetAllocation";
import { FinancialGoals } from "@/components/FinancialGoals";
import { ChatInterface } from "@/components/ChatInterface";
import { MarketInsights } from "@/components/MarketInsights";
import { SalesforceIntegration } from "@/components/SalesforceIntegration";
import { EducationResources } from "@/components/EducationResources";

export default function Dashboard() {
  return (
    <DashboardLayout>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left sidebar - User profile and financial info */}
        <div className="lg:col-span-1 space-y-6">
          <UserProfile />
          <AssetAllocation />
          <FinancialGoals />
        </div>
        
        {/* Main content area */}
        <div className="lg:col-span-2 space-y-6">
          <ChatInterface />
          <MarketInsights />
          <SalesforceIntegration />
          <EducationResources />
        </div>
      </div>
    </DashboardLayout>
  );
}
