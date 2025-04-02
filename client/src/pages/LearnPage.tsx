import { EducationResources } from "@/components/EducationResources";
import { DashboardLayout } from "@/components/DashboardLayout";

export default function LearnPage() {
  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Learn</h1>
        </div>
        
        <div className="grid gap-6">
          <EducationResources />
        </div>
      </div>
    </DashboardLayout>
  );
}