import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { financialGoals } from "@/lib/dummyData";

export function FinancialGoals() {
  return (
    <Card className="shadow-sm border border-gray-200">
      <CardHeader className="p-5 pb-0">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-semibold">Financial Goals</CardTitle>
          <Button variant="link" className="text-primary text-sm font-medium p-0">
            Manage Goals
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-5">
        <div className="space-y-6">
          {financialGoals.map((goal) => (
            <div key={goal.id} className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <span className={`material-icons ${goal.iconColor} mr-2`}>{goal.icon}</span>
                  <h3 className="font-medium">{goal.name}</h3>
                </div>
                <span className="text-sm text-gray-500">
                  ${goal.targetAmount.toLocaleString('en-US')}
                </span>
              </div>
              <Progress value={goal.percentComplete} className="h-2" />
              <div className="flex justify-between items-center text-xs text-gray-500">
                <span>${goal.currentAmount.toLocaleString('en-US')} saved</span>
                <span>{goal.percentComplete}% complete</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
