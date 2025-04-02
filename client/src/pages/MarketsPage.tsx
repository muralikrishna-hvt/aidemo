import { MarketInsights } from "@/components/MarketInsights";
import { DashboardLayout } from "@/components/DashboardLayout";

export default function MarketsPage() {
  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Markets</h1>
        </div>
        
        <div className="grid gap-6">
          <MarketInsights />
        </div>
      </div>
    </DashboardLayout>
  );
}