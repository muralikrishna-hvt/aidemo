import { AssetAllocation } from "@/components/AssetAllocation";
import { FinancialGoals } from "@/components/FinancialGoals";
import { MarketInsights } from "@/components/MarketInsights";
import { UserProfile } from "@/components/UserProfile";
import { DashboardLayout } from "@/components/DashboardLayout";

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="flex flex-col gap-4 md:gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Dashboard</h1>
        </div>
        
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 xl:grid-cols-4">
          <div className="md:col-span-2 xl:col-span-2">
            <UserProfile />
          </div>
          <div className="md:col-span-2 xl:col-span-2">
            <MarketInsights />
          </div>
          <div className="md:col-span-1 xl:col-span-1">
            <AssetAllocation />
          </div>
          <div className="md:col-span-1 xl:col-span-3">
            <FinancialGoals />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}