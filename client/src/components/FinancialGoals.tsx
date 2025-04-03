import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/hooks/use-auth";
import { useQuery, useMutation } from "@tanstack/react-query";
import { FinancialGoal, insertFinancialGoalSchema } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter 
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { queryClient, apiRequest } from "@/lib/queryClient";

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

// Form validation schema for financial goals
const goalFormSchema = insertFinancialGoalSchema.extend({
  name: z.string().min(1, "Name is required"),
  targetAmount: z.string().min(1, "Target amount is required").refine(
    (val) => !isNaN(Number(val)) && Number(val) > 0,
    "Must be a valid positive number"
  ),
  currentAmount: z.string().refine(
    (val) => !isNaN(Number(val)) && Number(val) >= 0,
    "Must be a valid non-negative number"
  ),
  targetDate: z.string().min(1, "Target date is required"),
  icon: z.string().optional().default("default") // This field is optional in the form as we'll determine it based on the name
});

type GoalFormValues = z.infer<typeof goalFormSchema>;

export function FinancialGoals() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isManageDialogOpen, setIsManageDialogOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<FinancialGoal | null>(null);
  
  // Query to fetch goals
  const { data: goals, isLoading } = useQuery<FinancialGoal[]>({
    queryKey: ['/api/goals'],
    enabled: !!user
  });
  
  // Form for adding new goals
  const form = useForm<GoalFormValues>({
    resolver: zodResolver(goalFormSchema),
    defaultValues: {
      name: "",
      targetAmount: "",
      currentAmount: "0",
      targetDate: new Date().toISOString().split('T')[0],
      userId: user?.id
    }
  });
  
  // Form for editing goals
  const editForm = useForm<GoalFormValues>({
    resolver: zodResolver(goalFormSchema),
    defaultValues: {
      name: "",
      targetAmount: "",
      currentAmount: "",
      targetDate: "",
      userId: user?.id
    }
  });
  
  // Mutation to add a new goal
  const addGoalMutation = useMutation({
    mutationFn: async (data: GoalFormValues) => {
      const res = await apiRequest('POST', '/api/goals', data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/goals'] });
      setIsAddDialogOpen(false);
      form.reset();
      toast({
        title: "Goal added",
        description: "Your financial goal has been added successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error adding goal",
        description: error.message,
        variant: "destructive",
      });
    }
  });
  
  // Mutation to update a goal
  const updateGoalMutation = useMutation({
    mutationFn: async (data: GoalFormValues & { id: number }) => {
      const { id, ...goalData } = data;
      const res = await apiRequest('PATCH', `/api/goals/${id}`, goalData);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/goals'] });
      setIsManageDialogOpen(false);
      setSelectedGoal(null);
      toast({
        title: "Goal updated",
        description: "Your financial goal has been updated successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error updating goal",
        description: error.message,
        variant: "destructive",
      });
    }
  });
  
  // Mutation to delete a goal
  const deleteGoalMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await apiRequest('DELETE', `/api/goals/${id}`);
      return res.ok;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/goals'] });
      setIsManageDialogOpen(false);
      setSelectedGoal(null);
      toast({
        title: "Goal deleted",
        description: "Your financial goal has been deleted successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error deleting goal",
        description: error.message,
        variant: "destructive",
      });
    }
  });
  
  // Handle opening the edit dialog for a specific goal
  const handleEditGoal = (goal: FinancialGoal) => {
    setSelectedGoal(goal);
    
    // Format the date properly, using current date as fallback
    let formattedDate = new Date().toISOString().split('T')[0];
    if (goal.targetDate) {
      try {
        formattedDate = new Date(goal.targetDate).toISOString().split('T')[0];
      } catch (e) {
        console.error("Invalid date format", e);
      }
    }
    
    editForm.reset({
      name: goal.name,
      targetAmount: goal.targetAmount.toString(),
      currentAmount: goal.currentAmount.toString(),
      targetDate: formattedDate,
      userId: user?.id
    });
    setIsManageDialogOpen(true);
  };
  
  // Handle deletion of a goal
  const handleDeleteGoal = (id: number) => {
    if (window.confirm("Are you sure you want to delete this goal?")) {
      deleteGoalMutation.mutate(id);
    }
  };
  
  // Submit handler for adding a new goal
  const onSubmitAddGoal = (data: GoalFormValues) => {
    // Set the icon based on the goal name
    // Find the matching key from goalIcons
    let iconKey = "Default";
    for (const key of Object.keys(goalIcons)) {
      if (data.name.toLowerCase().includes(key.toLowerCase())) {
        iconKey = key;
        break;
      }
    }
    
    const goalWithIcon = {
      ...data,
      icon: iconKey
    };
    addGoalMutation.mutate(goalWithIcon);
  };
  
  // Submit handler for updating a goal
  const onSubmitUpdateGoal = (data: GoalFormValues) => {
    if (selectedGoal) {
      // Set the icon based on the goal name
      // Find the matching key from goalIcons
      let iconKey = "Default";
      for (const key of Object.keys(goalIcons)) {
        if (data.name.toLowerCase().includes(key.toLowerCase())) {
          iconKey = key;
          break;
        }
      }
      
      const goalWithIcon = {
        ...data,
        id: selectedGoal.id,
        icon: iconKey
      };
      updateGoalMutation.mutate(goalWithIcon);
    }
  };
  
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
          <div className="flex space-x-2">
            <Button 
              variant="link" 
              className="text-primary text-sm font-medium p-0" 
              onClick={() => setIsAddDialogOpen(true)}
            >
              Add Goal
            </Button>
            <span className="text-gray-300">|</span>
            <Button 
              variant="link" 
              className="text-primary text-sm font-medium p-0"
              onClick={() => setIsManageDialogOpen(true)}
            >
              Manage Goals
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        {!goals || goals.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-24 text-gray-500 text-sm">
            <p className="mb-2">No financial goals set</p>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setIsAddDialogOpen(true)}
            >
              Add Your First Goal
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {goals.map((goal) => {
              const currentAmount = Number(goal.currentAmount);
              const targetAmount = Number(goal.targetAmount);
              const percentComplete = calculatePercentComplete(currentAmount, targetAmount);
              const { icon, color } = getGoalIcon(goal.name);
              
              return (
                <div 
                  key={goal.id} 
                  className="space-y-2 bg-gray-50 p-3 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                  onClick={() => handleEditGoal(goal)}
                >
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
      
      {/* Add Goal Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-md bg-white">
          <DialogHeader>
            <DialogTitle>Add Financial Goal</DialogTitle>
            <DialogDescription>
              Create a new financial goal to track your savings progress.
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmitAddGoal)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Goal Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Retirement, Vacation, New Car" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="targetAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Target Amount ($)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 10000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="currentAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Amount ($)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 1000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="targetDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Target Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <input type="hidden" {...form.register("userId")} value={user?.id} />
              
              <DialogFooter className="gap-2 sm:gap-0">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsAddDialogOpen(false);
                    form.reset();
                  }}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  disabled={addGoalMutation.isPending}
                >
                  {addGoalMutation.isPending ? "Adding..." : "Add Goal"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      {/* Manage Goals Dialog */}
      <Dialog open={isManageDialogOpen} onOpenChange={setIsManageDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {selectedGoal ? `Manage Goal: ${selectedGoal.name}` : 'Manage Financial Goals'}
            </DialogTitle>
            <DialogDescription>
              {selectedGoal 
                ? 'Update your progress or modify your financial goal details.'
                : 'Select a goal to edit or delete from your financial plan.'}
            </DialogDescription>
          </DialogHeader>
          
          {selectedGoal ? (
            <Form {...editForm}>
              <form onSubmit={editForm.handleSubmit(onSubmitUpdateGoal)} className="space-y-4">
                <FormField
                  control={editForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Goal Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={editForm.control}
                  name="targetAmount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Target Amount ($)</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={editForm.control}
                  name="currentAmount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current Amount ($)</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={editForm.control}
                  name="targetDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Target Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <input type="hidden" {...editForm.register("userId")} value={user?.id} />
                
                <DialogFooter className="gap-2 sm:gap-0 flex flex-col sm:flex-row items-center justify-between">
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => handleDeleteGoal(selectedGoal.id)}
                    disabled={deleteGoalMutation.isPending}
                    className="w-full sm:w-auto"
                  >
                    {deleteGoalMutation.isPending ? "Deleting..." : "Delete Goal"}
                  </Button>
                  <div className="flex gap-2 w-full sm:w-auto">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setSelectedGoal(null);
                        setIsManageDialogOpen(false);
                      }}
                      className="flex-1 sm:flex-initial"
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit"
                      disabled={updateGoalMutation.isPending}
                      className="flex-1 sm:flex-initial"
                    >
                      {updateGoalMutation.isPending ? "Saving..." : "Save Changes"}
                    </Button>
                  </div>
                </DialogFooter>
              </form>
            </Form>
          ) : (
            <div className="py-2">
              {goals && goals.length > 0 ? (
                <div className="space-y-2">
                  {goals.map((goal) => (
                    <div 
                      key={goal.id}
                      className="flex items-center justify-between p-3 rounded-md bg-gray-50 hover:bg-gray-100 cursor-pointer"
                      onClick={() => handleEditGoal(goal)}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`${getGoalIcon(goal.name).color}`}>
                          {getGoalIcon(goal.name).icon}
                        </div>
                        <div>
                          <h4 className="font-medium text-sm">{goal.name}</h4>
                          <p className="text-xs text-gray-500">
                            ${Number(goal.currentAmount).toLocaleString('en-US')} of ${Number(goal.targetAmount).toLocaleString('en-US')}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="h-7 text-xs"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditGoal(goal);
                          }}
                        >
                          Edit
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="h-7 text-xs text-destructive hover:text-destructive"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteGoal(goal.id);
                          }}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 text-gray-500">
                  <p className="mb-2">You don't have any financial goals yet.</p>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      setIsManageDialogOpen(false);
                      setIsAddDialogOpen(true);
                    }}
                  >
                    Add Your First Goal
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
}
