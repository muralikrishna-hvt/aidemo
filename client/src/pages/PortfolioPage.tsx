import { AssetAllocation } from "@/components/AssetAllocation";
import { FinancialGoals } from "@/components/FinancialGoals";
import { DashboardLayout } from "@/components/DashboardLayout";

export default function PortfolioPage() {
  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Portfolio</h1>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2">
          <AssetAllocation />
          <FinancialGoals />
        </div>
      </div>
    </DashboardLayout>
  );
}