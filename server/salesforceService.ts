import { User } from "@shared/schema";

// Mock data for Salesforce integration
const mockSalesforceContacts = [
  {
    id: "SF001",
    name: "John Smith",
    email: "john.smith@example.com",
    phone: "(555) 123-4567",
    accountId: "ACC001",
    accountName: "Smith Financial Group",
    status: "Active",
    lastContactDate: new Date("2023-12-15"),
    sentiment: "Positive",
    nextContactDate: new Date("2024-01-15"),
    lastInteraction: "Portfolio review meeting",
    tags: ["High Value", "Retirement Planning"]
  },
  {
    id: "SF002",
    name: "Jane Doe",
    email: "jane.doe@example.com",
    phone: "(555) 987-6543",
    accountId: "ACC002",
    accountName: "Doe Investments LLC",
    status: "Active",
    lastContactDate: new Date("2023-12-10"),
    sentiment: "Neutral",
    nextContactDate: new Date("2024-01-10"),
    lastInteraction: "Investment strategy discussion",
    tags: ["New Client", "Growth Portfolio"]
  },
  {
    id: "SF003",
    name: "Robert Johnson",
    email: "robert.j@example.com",
    phone: "(555) 234-5678",
    accountId: "ACC003",
    accountName: "Johnson Family Trust",
    status: "Inactive",
    lastContactDate: new Date("2023-11-05"),
    sentiment: "Negative",
    nextContactDate: new Date("2024-01-20"),
    lastInteraction: "Dispute resolution call",
    tags: ["At Risk", "Needs Follow-up"]
  },
  {
    id: "SF004",
    name: "Sarah Williams",
    email: "s.williams@example.com",
    phone: "(555) 345-6789",
    accountId: "ACC004",
    accountName: "Williams Consulting",
    status: "Active",
    lastContactDate: new Date("2023-12-20"),
    sentiment: "Positive",
    nextContactDate: new Date("2024-01-25"),
    lastInteraction: "Tax planning session",
    tags: ["Tax Strategy", "Business Owner"]
  },
  {
    id: "SF005",
    name: "Michael Brown",
    email: "m.brown@example.com",
    phone: "(555) 456-7890",
    accountId: "ACC005",
    accountName: "Brown Industries Pension",
    status: "Active",
    lastContactDate: new Date("2023-12-18"),
    sentiment: "Neutral",
    nextContactDate: new Date("2024-01-18"),
    lastInteraction: "Pension fund review",
    tags: ["Institutional Client", "Conservative"]
  }
];

const mockSalesforceOpportunities = [
  {
    id: "OPP001",
    name: "Retirement Portfolio Expansion",
    accountId: "ACC001",
    accountName: "Smith Financial Group",
    stage: "Qualification",
    amount: 250000,
    probability: 30,
    closeDate: new Date("2024-03-15"),
    type: "Portfolio Expansion",
    nextStep: "Follow-up meeting to discuss risk tolerance"
  },
  {
    id: "OPP002",
    name: "Tax-Advantaged Investment Strategy",
    accountId: "ACC002",
    accountName: "Doe Investments LLC",
    stage: "Needs Analysis",
    amount: 175000,
    probability: 50,
    closeDate: new Date("2024-02-28"),
    type: "New Investment",
    nextStep: "Present investment options"
  },
  {
    id: "OPP003",
    name: "Estate Planning Services",
    accountId: "ACC003",
    accountName: "Johnson Family Trust",
    stage: "Proposal",
    amount: 120000,
    probability: 70,
    closeDate: new Date("2024-02-15"),
    type: "Estate Planning",
    nextStep: "Review and sign proposal documents"
  },
  {
    id: "OPP004",
    name: "Business Succession Planning",
    accountId: "ACC004",
    accountName: "Williams Consulting",
    stage: "Negotiation",
    amount: 320000,
    probability: 85,
    closeDate: new Date("2024-01-30"),
    type: "Business Planning",
    nextStep: "Finalize terms and timeline"
  },
  {
    id: "OPP005",
    name: "Pension Fund Restructuring",
    accountId: "ACC005",
    accountName: "Brown Industries Pension",
    stage: "Closed Won",
    amount: 500000,
    probability: 100,
    closeDate: new Date("2023-12-20"),
    type: "Fund Restructuring",
    nextStep: "Implement new allocation strategy"
  }
];

const mockSalesforceTasks = [
  {
    id: "TASK001",
    subject: "Follow-up call with John Smith",
    relatedTo: "SF001",
    relatedToName: "John Smith",
    dueDate: new Date("2024-01-10"),
    status: "Not Started",
    priority: "High",
    description: "Discuss portfolio performance and review new retirement options"
  },
  {
    id: "TASK002",
    subject: "Prepare investment proposal for Jane Doe",
    relatedTo: "SF002",
    relatedToName: "Jane Doe",
    dueDate: new Date("2024-01-08"),
    status: "In Progress",
    priority: "Normal",
    description: "Create custom proposal for tax-advantaged growth portfolio"
  },
  {
    id: "TASK003",
    subject: "Escalation call with Robert Johnson",
    relatedTo: "SF003",
    relatedToName: "Robert Johnson",
    dueDate: new Date("2024-01-05"),
    status: "Not Started",
    priority: "High",
    description: "Address concerns about recent market volatility and portfolio performance"
  },
  {
    id: "TASK004",
    subject: "Tax planning document preparation",
    relatedTo: "SF004",
    relatedToName: "Sarah Williams",
    dueDate: new Date("2024-01-15"),
    status: "Not Started",
    priority: "Normal",
    description: "Prepare end-of-year tax planning documents"
  },
  {
    id: "TASK005",
    subject: "Quarterly review meeting",
    relatedTo: "SF005",
    relatedToName: "Michael Brown",
    dueDate: new Date("2024-01-20"),
    status: "Not Started",
    priority: "Normal",
    description: "Conduct quarterly performance review for pension fund"
  },
  {
    id: "TASK006",
    subject: "Send market update newsletter",
    relatedTo: "ALL",
    relatedToName: "All Clients",
    dueDate: new Date("2024-01-12"),
    status: "Not Started",
    priority: "Low",
    description: "Send the monthly market update newsletter to all active clients"
  }
];

// Interface for filtering contacts
export interface ContactFilter {
  search?: string;
  status?: 'Active' | 'Inactive' | 'All';
  sentiment?: 'Positive' | 'Neutral' | 'Negative' | 'All';
  tags?: string[];
}

// Interface for filtering opportunities
export interface OpportunityFilter {
  search?: string;
  stage?: string;
  minAmount?: number;
  maxAmount?: number;
  probability?: number;
}

// Interface for filtering tasks
export interface TaskFilter {
  search?: string;
  status?: 'Not Started' | 'In Progress' | 'Completed' | 'All';
  priority?: 'High' | 'Normal' | 'Low' | 'All';
  dueDate?: 'Today' | 'This Week' | 'This Month' | 'All';
}

/**
 * Class representing a mock Salesforce service
 */
export class SalesforceService {
  private userIdToContactsMap: Map<number, string[]> = new Map();

  constructor() {
    // Initialize some mock mappings between users and contacts
    this.userIdToContactsMap.set(1, ["SF001", "SF002", "SF003"]);
    this.userIdToContactsMap.set(2, ["SF004", "SF005"]);
  }

  /**
   * Get Salesforce contacts for a user
   */
  async getContactsForUser(userId: number, filter?: ContactFilter): Promise<any[]> {
    const contactIds = this.userIdToContactsMap.get(userId) || [];
    let contacts = mockSalesforceContacts.filter(contact => 
      contactIds.includes(contact.id) || userId === 1 // Admin user (ID 1) can see all contacts
    );
    
    // Apply filters if provided
    if (filter) {
      if (filter.search) {
        const searchLower = filter.search.toLowerCase();
        contacts = contacts.filter(contact => 
          contact.name.toLowerCase().includes(searchLower) || 
          contact.email.toLowerCase().includes(searchLower) ||
          contact.accountName.toLowerCase().includes(searchLower)
        );
      }
      
      if (filter.status && filter.status !== 'All') {
        contacts = contacts.filter(contact => contact.status === filter.status);
      }
      
      if (filter.sentiment && filter.sentiment !== 'All') {
        contacts = contacts.filter(contact => contact.sentiment === filter.sentiment);
      }
      
      if (filter.tags && filter.tags.length > 0) {
        contacts = contacts.filter(contact => 
          filter.tags!.some(tag => contact.tags.includes(tag))
        );
      }
    }
    
    return contacts;
  }

  /**
   * Get Salesforce opportunities for a user
   */
  async getOpportunitiesForUser(userId: number, filter?: OpportunityFilter): Promise<any[]> {
    const contactIds = this.userIdToContactsMap.get(userId) || [];
    const userAccountIds = mockSalesforceContacts
      .filter(contact => contactIds.includes(contact.id) || userId === 1)
      .map(contact => contact.accountId);
    
    let opportunities = mockSalesforceOpportunities.filter(opportunity => 
      userAccountIds.includes(opportunity.accountId) || userId === 1
    );
    
    // Apply filters if provided
    if (filter) {
      if (filter.search) {
        const searchLower = filter.search.toLowerCase();
        opportunities = opportunities.filter(opportunity => 
          opportunity.name.toLowerCase().includes(searchLower) || 
          opportunity.accountName.toLowerCase().includes(searchLower) ||
          opportunity.type.toLowerCase().includes(searchLower)
        );
      }
      
      if (filter.stage) {
        opportunities = opportunities.filter(opportunity => opportunity.stage === filter.stage);
      }
      
      if (filter.minAmount !== undefined) {
        opportunities = opportunities.filter(opportunity => opportunity.amount >= filter.minAmount!);
      }
      
      if (filter.maxAmount !== undefined) {
        opportunities = opportunities.filter(opportunity => opportunity.amount <= filter.maxAmount!);
      }
      
      if (filter.probability !== undefined) {
        opportunities = opportunities.filter(opportunity => opportunity.probability >= filter.probability!);
      }
    }
    
    return opportunities;
  }

  /**
   * Get Salesforce tasks for a user
   */
  async getTasksForUser(userId: number, filter?: TaskFilter): Promise<any[]> {
    const contactIds = this.userIdToContactsMap.get(userId) || [];
    let tasks = mockSalesforceTasks.filter(task => 
      contactIds.includes(task.relatedTo) || task.relatedTo === 'ALL' || userId === 1
    );
    
    // Apply filters if provided
    if (filter) {
      if (filter.search) {
        const searchLower = filter.search.toLowerCase();
        tasks = tasks.filter(task => 
          task.subject.toLowerCase().includes(searchLower) || 
          task.description.toLowerCase().includes(searchLower) ||
          task.relatedToName.toLowerCase().includes(searchLower)
        );
      }
      
      if (filter.status && filter.status !== 'All') {
        tasks = tasks.filter(task => task.status === filter.status);
      }
      
      if (filter.priority && filter.priority !== 'All') {
        tasks = tasks.filter(task => task.priority === filter.priority);
      }
      
      if (filter.dueDate) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const thisWeekEnd = new Date(today);
        thisWeekEnd.setDate(today.getDate() + (7 - today.getDay()));
        
        const thisMonthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        
        switch (filter.dueDate) {
          case 'Today':
            tasks = tasks.filter(task => {
              const taskDate = new Date(task.dueDate);
              taskDate.setHours(0, 0, 0, 0);
              return taskDate.getTime() === today.getTime();
            });
            break;
          case 'This Week':
            tasks = tasks.filter(task => {
              const taskDate = new Date(task.dueDate);
              return taskDate >= today && taskDate <= thisWeekEnd;
            });
            break;
          case 'This Month':
            tasks = tasks.filter(task => {
              const taskDate = new Date(task.dueDate);
              return taskDate >= today && taskDate <= thisMonthEnd;
            });
            break;
        }
      }
    }
    
    return tasks;
  }

  /**
   * Create a new task in Salesforce
   */
  async createTask(task: any): Promise<any> {
    // Generate a new task ID
    const newId = `TASK${String(mockSalesforceTasks.length + 1).padStart(3, '0')}`;
    const newTask = {
      ...task,
      id: newId,
      status: task.status || 'Not Started'
    };
    
    // In a real implementation, this would call the Salesforce API
    mockSalesforceTasks.push(newTask);
    
    return newTask;
  }

  /**
   * Update task status
   */
  async updateTaskStatus(taskId: string, status: string): Promise<boolean> {
    const taskIndex = mockSalesforceTasks.findIndex(task => task.id === taskId);
    if (taskIndex !== -1) {
      mockSalesforceTasks[taskIndex].status = status;
      return true;
    }
    return false;
  }

  /**
   * Get aggregated Salesforce statistics for a user
   */
  async getStatsForUser(userId: number): Promise<any> {
    const contacts = await this.getContactsForUser(userId);
    const opportunities = await this.getOpportunitiesForUser(userId);
    const tasks = await this.getTasksForUser(userId);
    
    // Calculate statistics
    const activeContacts = contacts.filter(contact => contact.status === 'Active').length;
    const totalOpportunityValue = opportunities.reduce((sum, opp) => sum + opp.amount, 0);
    const highPriorityTasks = tasks.filter(task => task.priority === 'High').length;
    const pendingTasks = tasks.filter(task => task.status !== 'Completed').length;
    
    const opportunitiesByStage = opportunities.reduce((acc: { [key: string]: number }, opp) => {
      acc[opp.stage] = (acc[opp.stage] || 0) + 1;
      return acc;
    }, {});
    
    return {
      activeContacts,
      totalContacts: contacts.length,
      openOpportunities: opportunities.length,
      totalOpportunityValue,
      opportunitiesByStage,
      highPriorityTasks,
      pendingTasks,
      totalTasks: tasks.length
    };
  }
}

// Export a singleton instance
export const salesforceService = new SalesforceService();