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
        <Dialog open={newTaskOpen} onOpenChange={setNewTaskOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <PlusCircle size={16} />
              <span>New Task</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle>Create New Task</DialogTitle>
              <DialogDescription>
                Add a new task to track client follow-ups and activities
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  value={newTask.subject}
                  onChange={(e) => setNewTask({...newTask, subject: e.target.value})}
                  placeholder="Task subject"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="relatedTo">Related To</Label>
                <Select onValueChange={handleContactSelect}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a contact" />
                  </SelectTrigger>
                  <SelectContent>
                    {contactOptions.map((contact: Contact) => (
                      <SelectItem key={contact.id} value={contact.id}>
                        {contact.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="dueDate">Due Date</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={newTask.dueDate}
                  onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="priority">Priority</Label>
                <Select 
                  value={newTask.priority}
                  onValueChange={(value) => setNewTask({...newTask, priority: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Normal">Normal</SelectItem>
                    <SelectItem value="Low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={newTask.description}
                  onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                  placeholder="Task description"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setNewTaskOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={() => createTaskMutation.mutate(newTask)}
                disabled={!newTask.subject || !newTask.relatedTo || createTaskMutation.isPending}
              >
                {createTaskMutation.isPending ? "Creating..." : "Create Task"}
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
                              {task.status !== 'Completed' && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => updateTaskStatusMutation.mutate({ 
                                    id: task.id, 
                                    status: task.status === 'Not Started' ? 'In Progress' : 'Completed' 
                                  })}
                                  disabled={updateTaskStatusMutation.isPending}
                                >
                                  {task.status === 'Not Started' ? 'Start' : 'Complete'}
                                </Button>
                              )}
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