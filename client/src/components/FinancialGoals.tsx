import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { FinancialGoal } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";

// Icon mappings for different goal types
const goalIcons: Record<string, { icon: React.ReactNode, color: string }> = {
  "Vacation": { 
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h19.5"></path><path d="m21.5 3-1.293 1.293a3.5 3.5 0 0 0-1.414 2.828V20l-2.8-2-2.8 2-2.8-2-2.8 2"></path></svg>, 
    color: "text-blue-500"
  },
  "Education": { 
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"></path><path d="M6 12v5c3 3 9 3 12 0v-5"></path></svg>, 
    color: "text-primary-500"
  },
  "Retirement": { 
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M8 14s1.5 2 4 2 4-2 4-2"></path><line x1="9" y1="9" x2="9.01" y2="9"></line><line x1="15" y1="9" x2="15.01" y2="9"></line></svg>, 
    color: "text-green-500"
  },
  "Home": { 
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>, 
    color: "text-secondary-500"
  },
  "Travel": { 
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>, 
    color: "text-accent-500"
  },
  "Default": { 
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"></circle><path d="m15 9-6 6"></path><path d="m9 9 6 6"></path></svg>, 
    color: "text-gray-500"
  }
};

// Helper to find the appropriate icon for a goal
const getGoalIcon = (goalName: string) => {
  for (const [key, value] of Object.entries(goalIcons)) {
    if (goalName.toLowerCase().includes(key.toLowerCase())) {
      return value;
    }
  }
  return goalIcons.Default;
};

// Calculate percentage complete
const calculatePercentComplete = (currentAmount: number, targetAmount: number) => {
  if (targetAmount <= 0) return 0;
  const percent = Math.round((currentAmount / targetAmount) * 100);
  return Math.min(percent, 100); // Cap at 100%
};

export function FinancialGoals() {
  const { user } = useAuth();
  
  const { data: goals, isLoading } = useQuery<FinancialGoal[]>({
    queryKey: ['/api/goals'],
    enabled: !!user
  });
  
  if (isLoading) {
    return (
      <Card className="shadow-sm border border-gray-200 h-full">
        <CardHeader className="p-4 pb-0">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg font-semibold">Financial Goals</CardTitle>
            <Skeleton className="h-4 w-24" />
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-24 w-full rounded-lg" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-sm border border-gray-200 h-full">
      <CardHeader className="p-4 pb-0">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-semibold">Financial Goals</CardTitle>
          <Button variant="link" className="text-primary text-sm font-medium p-0">
            Manage Goals
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        {!goals || goals.length === 0 ? (
          <div className="flex items-center justify-center h-24 text-gray-500 text-sm">
            No financial goals set
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {goals.map((goal) => {
              const currentAmount = Number(goal.currentAmount);
              const targetAmount = Number(goal.targetAmount);
              const percentComplete = calculatePercentComplete(currentAmount, targetAmount);
              const { icon, color } = getGoalIcon(goal.name);
              
              return (
                <div key={goal.id} className="space-y-2 bg-gray-50 p-3 rounded-lg">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div className={`mr-2 ${color}`}>{icon}</div>
                      <h3 className="font-medium text-sm">{goal.name}</h3>
                    </div>
                    <span className="text-xs text-gray-500 font-medium">
                      ${targetAmount.toLocaleString('en-US')}
                    </span>
                  </div>
                  <Progress value={percentComplete} className="h-1.5" />
                  <div className="flex justify-between items-center text-xs text-gray-500">
                    <span>${currentAmount.toLocaleString('en-US')} saved</span>
                    <span>{percentComplete}% complete</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
