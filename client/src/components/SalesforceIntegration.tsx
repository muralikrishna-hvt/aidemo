import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { TableHead, TableRow, TableHeader, TableCell, TableBody, Table } from "@/components/ui/table";
import { CheckCircle2, XCircle, AlertCircle, CalendarClock, PlusCircle, Search, UserCircle, DollarSign, PieChart, ClipboardList } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, getQueryFn } from "@/lib/queryClient";

// Types
interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  accountName: string;
  status: string;
  sentiment: string;
  lastContactDate: string;
  nextContactDate: string;
  lastInteraction: string;
  tags: string[];
}

interface Opportunity {
  id: string;
  name: string;
  accountName: string;
  stage: string;
  amount: number;
  probability: number;
  closeDate: string;
  type: string;
  nextStep: string;
}

interface Task {
  id: string;
  subject: string;
  relatedTo: string;
  relatedToName: string;
  dueDate: string;
  status: string;
  priority: string;
  description: string;
}

interface SalesforceStats {
  activeContacts: number;
  totalContacts: number;
  openOpportunities: number;
  totalOpportunityValue: number;
  opportunitiesByStage: Record<string, number>;
  highPriorityTasks: number;
  pendingTasks: number;
  totalTasks: number;
}

// AI Insights data
interface AIInsight {
  id: string;
  title: string;
  description: string;
  category: 'opportunity' | 'contact' | 'task' | 'market';
  priority: 'high' | 'medium' | 'low';
  recommendedAction: string;
  timestamp: string;
}

// Mock AI insights
const aiInsights: AIInsight[] = [
  {
    id: "ai001",
    title: "High-value prospect engagement opportunity",
    description: "Smith Financial Group has not been contacted in 15 days. Their portfolio value suggests potential interest in new tax-advantaged products.",
    category: "contact",
    priority: "high",
    recommendedAction: "Schedule a follow-up call to discuss tax planning strategies",
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "ai002",
    title: "Deal at risk of stalling",
    description: "The Doe Investments LLC opportunity has been in the Needs Analysis stage for 25 days, which is 10 days longer than your average for this stage.",
    category: "opportunity",
    priority: "high",
    recommendedAction: "Propose a meeting with decision-makers to address concerns and accelerate the process",
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "ai003",
    title: "Client sentiment needs attention",
    description: "Johnson Family Trust has shown negative sentiment in recent interactions. Analysis suggests concerns about portfolio performance.",
    category: "contact",
    priority: "high",
    recommendedAction: "Schedule a portfolio review session with detailed performance analysis",
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "ai004",
    title: "Cross-sell opportunity identified",
    description: "Williams Consulting has increased business activity by 30% this quarter. Their current portfolio could benefit from business succession products.",
    category: "opportunity",
    priority: "medium",
    recommendedAction: "Prepare a business succession planning proposal for their next review",
    timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "ai005",
    title: "Institutional client review needed",
    description: "Brown Industries Pension fund has new regulatory requirements that may impact their investment strategy.",
    category: "task",
    priority: "medium",
    recommendedAction: "Conduct regulatory impact assessment and update investment policy statement",
    timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
  }
];

// Recommended actions data
interface RecommendedAction {
  id: string;
  title: string;
  description: string;
  dueDate: string; 
  priority: 'high' | 'medium' | 'low';
  category: 'follow-up' | 'proposal' | 'review' | 'meeting';
  completed: boolean;
}

// Mock recommended actions
const recommendedActions: RecommendedAction[] = [
  {
    id: "act001",
    title: "Follow up with John Smith",
    description: "Discuss portfolio rebalancing options and tax implications",
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    priority: "high",
    category: "follow-up",
    completed: false
  },
  {
    id: "act002",
    title: "Send proposal to Doe Investments",
    description: "Finalize tax-advantaged investment options proposal",
    dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
    priority: "high",
    category: "proposal",
    completed: false
  },
  {
    id: "act003",
    title: "Review Johnson Trust portfolio",
    description: "Prepare detailed performance analysis with market context",
    dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    priority: "high",
    category: "review",
    completed: false
  },
  {
    id: "act004",
    title: "Prepare business succession proposal",
    description: "Create customized succession planning strategy for Williams Consulting",
    dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    priority: "medium",
    category: "proposal",
    completed: false
  },
  {
    id: "act005",
    title: "Schedule Brown Industries review meeting",
    description: "Coordinate quarterly review with pension trustees",
    dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
    priority: "medium",
    category: "meeting",
    completed: false
  }
];

interface CreateTaskForm {
  subject: string;
  relatedTo: string;
  relatedToName: string;
  dueDate: string;
  priority: string;
  description: string;
}

export function SalesforceIntegration() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [contactFilter, setContactFilter] = useState({
    search: "",
    status: "All",
    sentiment: "All"
  });
  const [opportunityFilter, setOpportunityFilter] = useState({
    search: "",
    stage: "All",
    minAmount: "",
    maxAmount: ""
  });
  const [taskFilter, setTaskFilter] = useState({
    search: "",
    status: "All",
    priority: "All",
    dueDate: "All"
  });
  const [newTaskOpen, setNewTaskOpen] = useState(false);
  const [newTask, setNewTask] = useState<CreateTaskForm>({
    subject: "",
    relatedTo: "",
    relatedToName: "",
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
    priority: "Normal",
    description: ""
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Queries
  const { data: contacts = [], isLoading: isContactsLoading } = useQuery<Contact[]>({
    queryKey: ['/api/salesforce/contacts', contactFilter],
    queryFn: getQueryFn({ on401: 'throw' }),
  });

  const { data: opportunities = [], isLoading: isOpportunitiesLoading } = useQuery<Opportunity[]>({
    queryKey: ['/api/salesforce/opportunities', opportunityFilter],
    queryFn: getQueryFn({ on401: 'throw' }),
  });

  const { data: tasks = [], isLoading: isTasksLoading } = useQuery<Task[]>({
    queryKey: ['/api/salesforce/tasks', taskFilter],
    queryFn: getQueryFn({ on401: 'throw' }),
  });

  const { data: stats = {
    activeContacts: 0,
    totalContacts: 0,
    openOpportunities: 0,
    totalOpportunityValue: 0,
    opportunitiesByStage: {},
    highPriorityTasks: 0,
    pendingTasks: 0,
    totalTasks: 0
  }, isLoading: isStatsLoading } = useQuery<SalesforceStats>({
    queryKey: ['/api/salesforce/stats'],
    queryFn: getQueryFn({ on401: 'throw' }),
  });

  // Get contacts for the new task form
  const { data: contactOptions = [] } = useQuery<Contact[]>({
    queryKey: ['/api/salesforce/contacts', { status: 'Active' }],
    queryFn: getQueryFn({ on401: 'throw' }),
  });

  // Mutations
  const createTaskMutation = useMutation({
    mutationFn: async (newTask: CreateTaskForm) => {
      const res = await apiRequest('POST', '/api/salesforce/tasks', newTask);
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Task created",
        description: "The task has been created successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/salesforce/tasks'] });
      queryClient.invalidateQueries({ queryKey: ['/api/salesforce/stats'] });
      setNewTaskOpen(false);
      resetNewTaskForm();
    },
    onError: (error: Error) => {
      toast({
        title: "Error creating task",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const updateTaskStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const res = await apiRequest('PATCH', `/api/salesforce/tasks/${id}`, { status });
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Task updated",
        description: "The task status has been updated",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/salesforce/tasks'] });
      queryClient.invalidateQueries({ queryKey: ['/api/salesforce/stats'] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error updating task",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Reset form
  const resetNewTaskForm = () => {
    setNewTask({
      subject: "",
      relatedTo: "",
      relatedToName: "",
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
      priority: "Normal",
      description: ""
    });
  };

  // Handle contact selection in new task form
  const handleContactSelect = (contactId: string) => {
    const selectedContact = contactOptions.find((contact: Contact) => contact.id === contactId);
    if (selectedContact) {
      setNewTask({
        ...newTask,
        relatedTo: contactId,
        relatedToName: selectedContact.name
      });
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Get sentiment badge styling
  const getSentimentBadge = (sentiment: string) => {
    switch(sentiment) {
      case 'Positive':
        return <Badge className="bg-green-500">{sentiment}</Badge>;
      case 'Neutral':
        return <Badge className="bg-blue-500">{sentiment}</Badge>;
      case 'Negative':
        return <Badge className="bg-red-500">{sentiment}</Badge>;
      default:
        return <Badge>{sentiment}</Badge>;
    }
  };

  // Get priority badge styling
  const getPriorityBadge = (priority: string) => {
    switch(priority) {
      case 'High':
        return <Badge className="bg-red-500">{priority}</Badge>;
      case 'Normal':
        return <Badge className="bg-blue-500">{priority}</Badge>;
      case 'Low':
        return <Badge className="bg-green-500">{priority}</Badge>;
      default:
        return <Badge>{priority}</Badge>;
    }
  };

  // Get status badge styling
  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'Completed':
        return <Badge className="bg-green-500">{status}</Badge>;
      case 'In Progress':
        return <Badge className="bg-amber-500">{status}</Badge>;
      case 'Not Started':
        return <Badge className="bg-slate-500">{status}</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  // Apply filters
  const applyContactFilter = () => {
    const queryParams = new URLSearchParams();
    if (contactFilter.search) queryParams.append('search', contactFilter.search);
    if (contactFilter.status !== 'All') queryParams.append('status', contactFilter.status);
    if (contactFilter.sentiment !== 'All') queryParams.append('sentiment', contactFilter.sentiment);
  };

  const applyOpportunityFilter = () => {
    const queryParams = new URLSearchParams();
    if (opportunityFilter.search) queryParams.append('search', opportunityFilter.search);
    if (opportunityFilter.stage !== 'All') queryParams.append('stage', opportunityFilter.stage);
    if (opportunityFilter.minAmount) queryParams.append('minAmount', opportunityFilter.minAmount);
    if (opportunityFilter.maxAmount) queryParams.append('maxAmount', opportunityFilter.maxAmount);
  };

  const applyTaskFilter = () => {
    const queryParams = new URLSearchParams();
    if (taskFilter.search) queryParams.append('search', taskFilter.search);
    if (taskFilter.status !== 'All') queryParams.append('status', taskFilter.status);
    if (taskFilter.priority !== 'All') queryParams.append('priority', taskFilter.priority);
    if (taskFilter.dueDate !== 'All') queryParams.append('dueDate', taskFilter.dueDate);
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Salesforce CRM</h2>
          <p className="text-muted-foreground">
            Manage your Salesforce contacts, opportunities, and tasks
          </p>
        </div>
        <Dialog open={newTaskOpen} onOpenChange={setNewTaskOpen} >
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <PlusCircle size={16} />
              <span>New Task</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto bg-white">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-xl">
                <ClipboardList size={20} className="text-primary" />
                Create New Task
              </DialogTitle>
              <DialogDescription>
                Add a new task to track client follow-ups and activities
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-6 py-4">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="subject" className="text-base font-medium">
                    Task Subject <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="subject"
                    value={newTask.subject}
                    onChange={(e) => setNewTask({...newTask, subject: e.target.value})}
                    placeholder="Enter task subject (e.g., 'Call client about portfolio review')"
                    className="h-10"
                  />
                  {!newTask.subject && (
                    <p className="text-xs text-muted-foreground">
                      A clear subject helps you identify the task at a glance
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="relatedTo" className="text-base font-medium">
                    Related To <span className="text-red-500">*</span>
                  </Label>
                  <Select onValueChange={handleContactSelect}>
                    <SelectTrigger className="h-10">
                      <SelectValue placeholder="Select a contact or account" />
                    </SelectTrigger>
                    <SelectContent>
                      <div className="p-2 border-b">
                        <Input 
                          placeholder="Search contacts..." 
                          className="h-8 text-sm"
                        />
                      </div>
                      {contactOptions.map((contact: Contact) => (
                        <SelectItem key={contact.id} value={contact.id} className="py-2">
                          <div>
                            <div className="font-medium">{contact.name}</div>
                            <div className="text-xs text-muted-foreground">{contact.accountName}</div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {newTask.relatedToName && (
                    <p className="text-xs text-muted-foreground">
                      Selected: {newTask.relatedToName}
                    </p>
                  )}
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="dueDate" className="text-base font-medium">Due Date</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <Select 
                      defaultValue="custom"
                      onValueChange={(value) => {
                        const today = new Date();
                        let dueDate = new Date();
                        
                        switch(value) {
                          case 'today':
                            // Due date is today
                            break;
                          case 'tomorrow':
                            dueDate.setDate(today.getDate() + 1);
                            break;
                          case 'next-week':
                            dueDate.setDate(today.getDate() + 7);
                            break;
                          case 'two-weeks':
                            dueDate.setDate(today.getDate() + 14);
                            break;
                          case 'custom':
                            return; // Don't change anything
                        }
                        
                        setNewTask({
                          ...newTask, 
                          dueDate: dueDate.toISOString().slice(0, 10)
                        });
                      }}
                    >
                      <SelectTrigger className="h-10">
                        <SelectValue placeholder="Select timeframe" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="today">Today</SelectItem>
                        <SelectItem value="tomorrow">Tomorrow</SelectItem>
                        <SelectItem value="next-week">Next Week</SelectItem>
                        <SelectItem value="two-weeks">Two Weeks</SelectItem>
                        <SelectItem value="custom">Custom Date</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Input
                      id="dueDate"
                      type="date"
                      value={newTask.dueDate}
                      onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})}
                      className="h-10"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="priority" className="text-base font-medium">Priority</Label>
                  <div className="flex gap-2">
                    <Button 
                      type="button" 
                      variant={newTask.priority === "High" ? "default" : "outline"}
                      className={`flex-1 ${newTask.priority === "High" ? "bg-red-500 hover:bg-red-600" : ""}`}
                      onClick={() => setNewTask({...newTask, priority: "High"})}
                    >
                      <span className="mr-1">🔴</span> High
                    </Button>
                    <Button 
                      type="button" 
                      variant={newTask.priority === "Normal" ? "default" : "outline"}
                      className={`flex-1 ${newTask.priority === "Normal" ? "bg-blue-500 hover:bg-blue-600" : ""}`}
                      onClick={() => setNewTask({...newTask, priority: "Normal"})}
                    >
                      <span className="mr-1">🔵</span> Normal
                    </Button>
                    <Button 
                      type="button" 
                      variant={newTask.priority === "Low" ? "default" : "outline"}
                      className={`flex-1 ${newTask.priority === "Low" ? "bg-green-500 hover:bg-green-600" : ""}`}
                      onClick={() => setNewTask({...newTask, priority: "Low"})}
                    >
                      <span className="mr-1">🟢</span> Low
                    </Button>
                  </div>
                </div>
                
                <div className="grid gap-2">
                  <Label className="text-base font-medium">Task Type</Label>
                  <Select defaultValue="follow-up">
                    <SelectTrigger className="h-10">
                      <SelectValue placeholder="Select task type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="follow-up">Follow-up Call</SelectItem>
                      <SelectItem value="meeting">Meeting</SelectItem>
                      <SelectItem value="proposal">Send Proposal</SelectItem>
                      <SelectItem value="review">Portfolio Review</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="description" className="text-base font-medium">Description</Label>
                <textarea
                  id="description"
                  value={newTask.description}
                  onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                  placeholder="Enter detailed description of the task"
                  className="min-h-[100px] rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground resize-y"
                />
              </div>

              <div className="bg-muted/40 rounded-lg p-3 text-xs text-muted-foreground">
                <p className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M12 16v-4"/>
                    <path d="M12 8h.01"/>
                  </svg>
                  Tasks will be synchronized with Salesforce when credentials are provided
                </p>
              </div>
            </div>
            
            <DialogFooter className="gap-2 sm:gap-0">
              <Button variant="outline" onClick={() => setNewTaskOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={() => createTaskMutation.mutate(newTask)}
                disabled={!newTask.subject || !newTask.relatedTo || createTaskMutation.isPending}
                className="gap-2"
              >
                {createTaskMutation.isPending ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating...
                  </>
                ) : (
                  <>
                    <PlusCircle size={16} />
                    Create Task
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <Tabs defaultValue="dashboard" className="w-full" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="contacts">Contacts</TabsTrigger>
          <TabsTrigger value="opportunities">Opportunities</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
        </TabsList>
        
        {/* Dashboard Tab */}
        <TabsContent value="dashboard">
          {isStatsLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-pulse">Loading statistics...</div>
            </div>
          ) : stats ? (
            <div className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Active Contacts</CardTitle>
                    <UserCircle className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.activeContacts}</div>
                    <p className="text-xs text-muted-foreground">
                      out of {stats.totalContacts} total contacts
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Open Opportunities</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.openOpportunities}</div>
                    <p className="text-xs text-muted-foreground">
                      Value: {formatCurrency(stats.totalOpportunityValue)}
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Pending Tasks</CardTitle>
                    <ClipboardList className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.pendingTasks}</div>
                    <p className="text-xs text-muted-foreground">
                      {stats.highPriorityTasks} high priority tasks
                    </p>
                  </CardContent>
                </Card>

                <Card className="md:col-span-2 lg:col-span-3">
                  <CardHeader>
                    <CardTitle>Opportunities by Stage</CardTitle>
                    <CardDescription>Current pipeline distribution</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {stats.opportunitiesByStage && Object.entries(stats.opportunitiesByStage).map(([stage, count]: [string, number]) => (
                        <div key={stage} className="flex items-center">
                          <div className="w-1/3 font-medium">{stage}</div>
                          <div className="w-2/3 flex items-center gap-2">
                            <div className="h-3 w-full max-w-xs bg-secondary rounded-full overflow-hidden">
                              <div
                                className="h-full bg-primary rounded-full" 
                                style={{ 
                                  width: `${Math.min(100, (count / stats.openOpportunities) * 100)}%` 
                                }}
                              />
                            </div>
                            <span className="text-muted-foreground text-sm">{count}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* AI Insights Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold">AI-Powered Insights</h3>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-8"
                    onClick={() => {
                      toast({
                        title: "Analysis Started",
                        description: "AI is analyzing client data and generating new insights...",
                      });
                      // Simulate analysis completion after 2 seconds
                      setTimeout(() => {
                        const newInsight = {
                          id: `ai${aiInsights.length + 1}`,
                          title: "New Investment Opportunity Detected",
                          description: "Based on recent market trends and client portfolio analysis, identified potential for diversification into emerging markets.",
                          category: 'opportunity',
                          priority: 'high',
                          recommendedAction: "Schedule client meeting to discuss emerging market opportunities",
                          timestamp: new Date().toISOString()
                        };
                        aiInsights.push(newInsight);
                        toast({
                          title: "Analysis Complete",
                          description: "New insights have been generated from client data.",
                        });
                        // Force a re-render
                        setActiveTab("dashboard");
                      }, 2000);
                    }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                      <circle cx="12" cy="12" r="10" />
                      <path d="m16 16-3.56-3.56" />
                      <path d="M14.5 9.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Z" />
                    </svg>
                    <span>Analyze Client Data</span>
                  </Button>
                </div>
                
                <div className="grid gap-4 md:grid-cols-2">
                  {aiInsights.map(insight => (
                    <Card key={insight.id} className={
                      `overflow-hidden border-l-4 ${
                        insight.priority === 'high' ? 'border-l-red-500' : 
                        insight.priority === 'medium' ? 'border-l-amber-500' : 
                        'border-l-blue-500'
                      }`
                    }>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-base font-semibold">{insight.title}</CardTitle>
                          <Badge className={
                            insight.priority === 'high' ? 'bg-red-500' : 
                            insight.priority === 'medium' ? 'bg-amber-500' : 
                            'bg-blue-500'
                          }>
                            {insight.priority.charAt(0).toUpperCase() + insight.priority.slice(1)}
                          </Badge>
                        </div>
                        <CardDescription className="text-xs text-muted-foreground">
                          {formatDate(insight.timestamp)} • 
                          {insight.category === 'opportunity' && ' Opportunity'}
                          {insight.category === 'contact' && ' Contact'}
                          {insight.category === 'task' && ' Task'}
                          {insight.category === 'market' && ' Market'}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pb-2 text-sm">
                        <p>{insight.description}</p>
                      </CardContent>
                      <CardFooter className="pt-0 flex justify-between items-center">
                        <p className="text-xs text-muted-foreground">
                          <span className="font-medium">Recommended Action: </span>
                          {insight.recommendedAction}
                        </p>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="h-7 text-xs"
                          onClick={() => {
                            setNewTaskOpen(true);
                            setNewTask({
                              ...newTask,
                              subject: `RE: ${insight.title}`,
                              description: insight.recommendedAction,
                              priority: insight.priority === 'high' ? 'High' : 
                                       insight.priority === 'medium' ? 'Normal' : 'Low'
                            });
                          }}
                        >
                          Create Task
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Recommended Actions Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold">Action Items</h3>
                  <div className="flex gap-2">
                    <Select defaultValue="all">
                      <SelectTrigger className="w-[130px] h-8 text-xs">
                        <SelectValue placeholder="Filter by priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Priorities</SelectItem>
                        <SelectItem value="high">High Priority</SelectItem>
                        <SelectItem value="medium">Medium Priority</SelectItem>
                        <SelectItem value="low">Low Priority</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[30px] text-center">Status</TableHead>
                        <TableHead>Action</TableHead>
                        <TableHead>Due Date</TableHead>
                        <TableHead>Priority</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {recommendedActions.map(action => (
                        <TableRow key={action.id}>
                          <TableCell className="p-2 text-center">
                            <div 
                              className="cursor-pointer transition-colors hover:bg-gray-100 rounded-full p-1 inline-block"
                              onClick={() => {
                                const updatedActions = [...recommendedActions];
                                const index = updatedActions.findIndex(a => a.id === action.id);
                                updatedActions[index] = { ...action, completed: !action.completed };
                                // Update the actions state here
                                toast({
                                  title: action.completed ? "Action Uncompleted" : "Action Completed",
                                  description: action.completed ? "The action has been marked as pending" : "The action has been marked as complete",
                                });
                              }}
                            >
                              {action.completed ? (
                                <CheckCircle2 size={18} className="text-green-500" />
                              ) : (
                                <div className="h-4 w-4 rounded border border-gray-300 hover:border-green-500 transition-colors" />
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="font-medium">{action.title}</div>
                            <div className="text-xs text-muted-foreground truncate max-w-xs">{action.description}</div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">{formatDate(action.dueDate)}</div>
                          </TableCell>
                          <TableCell>
                            <Badge className={
                              action.priority === 'high' ? 'bg-red-500' : 
                              action.priority === 'medium' ? 'bg-amber-500' : 
                              'bg-blue-500'
                            }>
                              {action.priority.charAt(0).toUpperCase() + action.priority.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {action.category.charAt(0).toUpperCase() + action.category.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              className="h-7 text-xs"
                              onClick={() => {
                                setNewTaskOpen(true);
                                setNewTask({
                                  ...newTask,
                                  subject: action.title,
                                  description: action.description,
                                  priority: action.priority === 'high' ? 'High' : 
                                           action.priority === 'medium' ? 'Normal' : 'Low',
                                  dueDate: new Date(action.dueDate).toISOString().slice(0, 10)
                                });
                              }}
                            >
                              Create Task
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex justify-center py-8">
              <div>No data available</div>
            </div>
          )}
        </TabsContent>
        
        {/* Contacts Tab */}
        <TabsContent value="contacts">
          <Card>
            <CardHeader>
              <CardTitle>Contacts</CardTitle>
              <CardDescription>
                View and manage your client relationships
              </CardDescription>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input 
                      placeholder="Search contacts..." 
                      className="pl-8" 
                      value={contactFilter.search}
                      onChange={(e) => setContactFilter({...contactFilter, search: e.target.value})}
                    />
                  </div>
                </div>
                <div className="flex flex-wrap gap-4">
                  <Select 
                    value={contactFilter.status}
                    onValueChange={(value) => setContactFilter({...contactFilter, status: value})}
                  >
                    <SelectTrigger className="w-[130px]">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">All Statuses</SelectItem>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select 
                    value={contactFilter.sentiment}
                    onValueChange={(value) => setContactFilter({...contactFilter, sentiment: value})}
                  >
                    <SelectTrigger className="w-[130px]">
                      <SelectValue placeholder="Sentiment" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">All Sentiment</SelectItem>
                      <SelectItem value="Positive">Positive</SelectItem>
                      <SelectItem value="Neutral">Neutral</SelectItem>
                      <SelectItem value="Negative">Negative</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {isContactsLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-pulse">Loading contacts...</div>
                </div>
              ) : contacts.length > 0 ? (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Account</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Sentiment</TableHead>
                        <TableHead>Last Contact</TableHead>
                        <TableHead>Tags</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {contacts.map((contact: Contact) => (
                        <TableRow key={contact.id}>
                          <TableCell className="font-medium">
                            <div>{contact.name}</div>
                            <div className="text-sm text-muted-foreground">{contact.email}</div>
                          </TableCell>
                          <TableCell>{contact.accountName}</TableCell>
                          <TableCell>
                            {contact.status === 'Active' ? (
                              <Badge className="bg-green-500">Active</Badge>
                            ) : (
                              <Badge className="bg-slate-500">Inactive</Badge>
                            )}
                          </TableCell>
                          <TableCell>{getSentimentBadge(contact.sentiment)}</TableCell>
                          <TableCell>
                            {formatDate(contact.lastContactDate)}
                            <div className="text-xs text-muted-foreground">{contact.lastInteraction}</div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {contact.tags.map((tag, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="flex justify-center py-8">
                  <div>No contacts found</div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Opportunities Tab */}
        <TabsContent value="opportunities">
          <Card>
            <CardHeader>
              <CardTitle>Opportunities</CardTitle>
              <CardDescription>
                Track your sales pipeline and potential deals
              </CardDescription>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input 
                      placeholder="Search opportunities..." 
                      className="pl-8" 
                      value={opportunityFilter.search}
                      onChange={(e) => setOpportunityFilter({...opportunityFilter, search: e.target.value})}
                    />
                  </div>
                </div>
                <div className="flex flex-wrap gap-4">
                  <Select 
                    value={opportunityFilter.stage}
                    onValueChange={(value) => setOpportunityFilter({...opportunityFilter, stage: value})}
                  >
                    <SelectTrigger className="w-[130px]">
                      <SelectValue placeholder="Stage" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">All Stages</SelectItem>
                      <SelectItem value="Qualification">Qualification</SelectItem>
                      <SelectItem value="Needs Analysis">Needs Analysis</SelectItem>
                      <SelectItem value="Proposal">Proposal</SelectItem>
                      <SelectItem value="Negotiation">Negotiation</SelectItem>
                      <SelectItem value="Closed Won">Closed Won</SelectItem>
                      <SelectItem value="Closed Lost">Closed Lost</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <div className="flex items-center w-full sm:w-auto">
                    <Input 
                      placeholder="Min $" 
                      className="w-20 sm:w-24" 
                      value={opportunityFilter.minAmount}
                      onChange={(e) => setOpportunityFilter({...opportunityFilter, minAmount: e.target.value})}
                    />
                    <span className="mx-2">to</span>
                    <Input 
                      placeholder="Max $" 
                      className="w-20 sm:w-24" 
                      value={opportunityFilter.maxAmount}
                      onChange={(e) => setOpportunityFilter({...opportunityFilter, maxAmount: e.target.value})}
                    />
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {isOpportunitiesLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-pulse">Loading opportunities...</div>
                </div>
              ) : opportunities.length > 0 ? (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Opportunity</TableHead>
                        <TableHead>Account</TableHead>
                        <TableHead>Stage</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Close Date</TableHead>
                        <TableHead>Probability</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {opportunities.map((opportunity: Opportunity) => (
                        <TableRow key={opportunity.id}>
                          <TableCell className="font-medium">
                            <div>{opportunity.name}</div>
                            <div className="text-sm text-muted-foreground">{opportunity.type}</div>
                          </TableCell>
                          <TableCell>{opportunity.accountName}</TableCell>
                          <TableCell>
                            <Badge 
                              className={
                                opportunity.stage === 'Closed Won' ? 'bg-green-500' : 
                                opportunity.stage === 'Closed Lost' ? 'bg-red-500' : 
                                'bg-blue-500'
                              }
                            >
                              {opportunity.stage}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-medium">
                            {formatCurrency(opportunity.amount)}
                          </TableCell>
                          <TableCell>{formatDate(opportunity.closeDate)}</TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <span className="mr-2">{opportunity.probability}%</span>
                              <div className="h-2 w-16 bg-secondary rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-primary rounded-full" 
                                  style={{ width: `${opportunity.probability}%` }}
                                />
                              </div>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="flex justify-center py-8">
                  <div>No opportunities found</div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Tasks Tab */}
        <TabsContent value="tasks">
          <Card>
            <CardHeader>
              <CardTitle>Tasks</CardTitle>
              <CardDescription>
                Manage client interactions and follow-ups
              </CardDescription>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input 
                      placeholder="Search tasks..." 
                      className="pl-8" 
                      value={taskFilter.search}
                      onChange={(e) => setTaskFilter({...taskFilter, search: e.target.value})}
                    />
                  </div>
                </div>
                <div className="flex flex-wrap gap-4">
                  <Select 
                    value={taskFilter.status}
                    onValueChange={(value) => setTaskFilter({...taskFilter, status: value})}
                  >
                    <SelectTrigger className="w-[130px]">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">All Statuses</SelectItem>
                      <SelectItem value="Not Started">Not Started</SelectItem>
                      <SelectItem value="In Progress">In Progress</SelectItem>
                      <SelectItem value="Completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select 
                    value={taskFilter.priority}
                    onValueChange={(value) => setTaskFilter({...taskFilter, priority: value})}
                  >
                    <SelectTrigger className="w-[130px]">
                      <SelectValue placeholder="Priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">All Priorities</SelectItem>
                      <SelectItem value="High">High</SelectItem>
                      <SelectItem value="Normal">Normal</SelectItem>
                      <SelectItem value="Low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select 
                    value={taskFilter.dueDate}
                    onValueChange={(value) => setTaskFilter({...taskFilter, dueDate: value})}
                  >
                    <SelectTrigger className="w-[130px]">
                      <SelectValue placeholder="Due Date" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">All Dates</SelectItem>
                      <SelectItem value="Today">Today</SelectItem>
                      <SelectItem value="This Week">This Week</SelectItem>
                      <SelectItem value="This Month">This Month</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {isTasksLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-pulse">Loading tasks...</div>
                </div>
              ) : tasks.length > 0 ? (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Subject</TableHead>
                        <TableHead>Related To</TableHead>
                        <TableHead>Due Date</TableHead>
                        <TableHead>Priority</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {tasks.map((task: Task) => (
                        <TableRow key={task.id}>
                          <TableCell className="font-medium">
                            <div>{task.subject}</div>
                            <div className="text-sm text-muted-foreground truncate max-w-xs">
                              {task.description}
                            </div>
                          </TableCell>
                          <TableCell>{task.relatedToName}</TableCell>
                          <TableCell>{formatDate(task.dueDate)}</TableCell>
                          <TableCell>{getPriorityBadge(task.priority)}</TableCell>
                          <TableCell>{getStatusBadge(task.status)}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <div className="flex gap-2">
                                {task.status !== 'Completed' && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => updateTaskStatusMutation.mutate({ 
                                      id: task.id, 
                                      status: task.status === 'Not Started' ? 'In Progress' : 'Completed' 
                                    })}
                                    disabled={updateTaskStatusMutation.isPending}
                                    className="flex items-center gap-1"
                                  >
                                    {updateTaskStatusMutation.isPending ? (
                                      <>
                                        <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        <span>Updating...</span>
                                      </>
                                    ) : (
                                      <>
                                        {task.status === 'Not Started' ? (
                                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                                            <polygon points="5 3 19 12 5 21 5 3"/>
                                          </svg>
                                        ) : (
                                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                                            <path d="M20 6L9 17l-5-5"/>
                                          </svg>
                                        )}
                                        <span>{task.status === 'Not Started' ? 'Start' : 'Complete'}</span>
                                      </>
                                    )}
                                  </Button>
                                )}
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    setNewTask({
                                      ...newTask,
                                      subject: `Follow-up: ${task.subject}`,
                                      relatedTo: task.relatedTo,
                                      relatedToName: task.relatedToName,
                                      description: `Follow-up to previous task: ${task.description}`
                                    });
                                    setNewTaskOpen(true);
                                  }}
                                  className="flex items-center gap-1"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                                    <polyline points="17 8 12 3 7 8"/>
                                    <line x1="12" y1="3" x2="12" y2="15"/>
                                  </svg>
                                  <span>Follow-up</span>
                                </Button>
                              </div>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="flex justify-center py-8">
                  <div>No tasks found</div>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <div></div>
              <Button 
                onClick={() => setNewTaskOpen(true)}
                className="flex items-center gap-2"
              >
                <PlusCircle size={16} />
                <span>New Task</span>
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}