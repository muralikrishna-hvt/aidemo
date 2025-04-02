// This file contains initial demo data for the application

// User profile data
export const userProfile = {
  id: 1,
  username: "jameswilson",
  fullName: "James Wilson",
  email: "james.wilson@example.com",
  riskProfile: "Moderate",
  investmentStyle: "Growth",
  totalAssets: 243506.78,
  todayChange: 1243.21,
  todayChangePercent: 0.51,
  ytdReturn: 32506.33,
  ytdReturnPercent: 15.4,
  cashAvailable: 15432.90
};

// Portfolio asset allocation data
export const assetAllocation = [
  { 
    assetClass: "Stocks", 
    percentage: 58.4, 
    color: "bg-primary-500",
    name: "US Large Cap Equity Fund",
    ticker: "VFIAX",
    category: "Equity",
    value: 142000.50,
    returnValue: 12.3
  },
  { 
    assetClass: "Bonds", 
    percentage: 22.1, 
    color: "bg-secondary-500",
    name: "Total Bond Market Index",
    ticker: "VBTLX",
    category: "Fixed Income",
    value: 53750.25,
    returnValue: 3.7
  },
  { 
    assetClass: "Real Estate", 
    percentage: 10.3, 
    color: "bg-accent-500",
    name: "Real Estate Index Fund",
    ticker: "VGSLX",
    category: "Real Estate",
    value: 25050.75,
    returnValue: 9.2
  },
  { 
    assetClass: "Cash", 
    percentage: 6.4, 
    color: "bg-gray-400",
    name: "Money Market Fund",
    ticker: "VMMXX",
    category: "Money Market",
    value: 15565.30,
    returnValue: 1.5
  },
  { 
    assetClass: "Crypto", 
    percentage: 2.8, 
    color: "bg-purple-500",
    name: "Bitcoin ETF",
    ticker: "BTCETF",
    category: "Cryptocurrency",
    value: 6810.20,
    returnValue: -8.5
  }
];

// Financial goals data
export const financialGoals = [
  {
    id: 1,
    name: "Vacation Home",
    icon: "home",
    iconColor: "text-secondary-500",
    targetAmount: 400000,
    currentAmount: 140000,
    percentComplete: 35
  },
  {
    id: 2,
    name: "Children's Education",
    icon: "school",
    iconColor: "text-primary-500",
    targetAmount: 150000,
    currentAmount: 100500,
    percentComplete: 67
  },
  {
    id: 3,
    name: "Around the World Trip",
    icon: "flight_takeoff",
    iconColor: "text-accent-500",
    targetAmount: 60000,
    currentAmount: 15000,
    percentComplete: 25
  }
];

// Initial chat messages
export const initialChatMessages = [
  {
    id: 1,
    isUserMessage: false,
    content: "Good morning, James! I hope you're having a great day. Your portfolio is up 0.51% today. I've analyzed the recent market trends and have some insights for you. What would you like to know today?",
    timestamp: new Date()
  }
];

// Quick reply options
export const quickReplyOptions = [
  "Portfolio Performance",
  "Market Updates",
  "Investment Ideas",
  "Tax Planning"
];

// Market data
export const marketData = [
  {
    id: 1,
    symbol: "SPY",
    name: "S&P 500",
    currentPrice: 478.45,
    previousClose: 475.24,
    percentChange: 0.68,
    volume: 78234567,
    marketCap: 42754389000000,
    peRatio: 26.8,
    dividendYield: 1.34,
    sector: "Index",
    lastUpdated: new Date()
  },
  {
    id: 2,
    symbol: "NDX",
    name: "NASDAQ",
    currentPrice: 15943.12,
    previousClose: 15781.90,
    percentChange: 1.02,
    volume: 56123789,
    marketCap: 21435676000000,
    peRatio: 32.5,
    dividendYield: 0.74,
    sector: "Index",
    lastUpdated: new Date()
  },
  {
    id: 3,
    symbol: "TNX",
    name: "10-YR TREASURY",
    currentPrice: 3.47,
    previousClose: 3.52,
    percentChange: -1.42,
    volume: 4321567,
    marketCap: 0,
    peRatio: 0,
    dividendYield: 3.47,
    sector: "Bond",
    lastUpdated: new Date()
  }
];

// Market news data
export const marketNews = [
  {
    id: 1,
    title: "Fed signals potential rate cut in upcoming meeting",
    content: "Federal Reserve minutes reveal discussions about easing monetary policy in response to cooling inflation data.",
    summary: "Potential positive impact on your bond holdings",
    category: "MONETARY POLICY",
    date: "1 hour ago",
    icon: "trending_up",
    iconColor: "text-accent-500",
    dotColor: "bg-primary-500"
  },
  {
    id: 2,
    title: "Tech sector showing strong earnings growth",
    content: "Major technology companies report better-than-expected quarterly results, driven by AI and cloud services.",
    summary: "Aligns with your tech-focused strategy",
    category: "EARNINGS",
    date: "3 hours ago",
    icon: "check_circle",
    iconColor: "text-success",
    dotColor: "bg-secondary-500"
  },
  {
    id: 3,
    title: "Real estate market showing signs of cooling",
    content: "Housing starts declined 3.2% last month, indicating potential slowdown in the construction sector.",
    summary: "Monitor your REIT positions (10.3% of portfolio)",
    category: "REAL ESTATE",
    date: "Yesterday",
    icon: "priority_high",
    iconColor: "text-warning",
    dotColor: "bg-danger"
  }
];

// Investment opportunities
export const investmentOpportunities = [
  {
    id: 1,
    title: "Green Energy ETF",
    description: "Diversified exposure to renewable energy companies",
    performance: "+18.4% YTD",
    insight: "Matches your interest in sustainable investments"
  },
  {
    id: 2,
    title: "AI & Robotics Fund",
    description: "Focused on artificial intelligence and automation",
    performance: "+24.6% YTD",
    insight: "Aligns with your technology sector preference"
  }
];

// Salesforce integration data - client interactions
export const clientInteractions = [
  {
    id: 1,
    type: "meeting",
    title: "Portfolio Review Meeting",
    timeAgo: "3 days ago",
    description: "Discussed rebalancing strategy and retirement planning. Client expressed interest in ESG investments.",
    actionText: "View Meeting Notes",
    icon: "event"
  },
  {
    id: 2,
    type: "email",
    title: "Email Correspondence",
    timeAgo: "1 week ago",
    description: "Sent quarterly performance report and tax loss harvesting opportunities.",
    actionText: "View Email Thread",
    icon: "email"
  },
  {
    id: 3,
    type: "call",
    title: "Phone Call",
    timeAgo: "2 weeks ago",
    description: "Discussed vacation home goal and potential increase in monthly contributions.",
    actionText: "View Call Notes",
    icon: "phone"
  }
];

// Tasks and reminders
export const tasksAndReminders = [
  {
    id: 1,
    title: "Send tax planning strategy document",
    dueText: "Due in 2 days",
    priority: "Medium Priority",
    priorityColor: "text-primary-500"
  },
  {
    id: 2,
    title: "Schedule Q3 portfolio review meeting",
    dueText: "Due in 5 days",
    priority: "High Priority",
    priorityColor: "text-accent-500"
  },
  {
    id: 3,
    title: "Update risk tolerance assessment",
    dueText: "Due in 2 weeks",
    priority: "Low Priority",
    priorityColor: "text-gray-500"
  }
];

// Educational resources
export const educationalResources = [
  {
    id: 1,
    category: "INVESTMENT STRATEGY",
    title: "How to Build a Recession-Resistant Portfolio",
    description: "Learn key strategies to protect your investments during economic downturns while maintaining growth potential.",
    readTime: "8 min read",
    actionText: "Read Article",
    actionIcon: "arrow_forward",
    imageUrl: "https://images.unsplash.com/photo-1579532537598-459ecdaf39cc?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 2,
    category: "TAX PLANNING",
    title: "Year-End Tax Strategies for Investors",
    description: "Discover actionable tax-saving techniques to implement before the end of the fiscal year.",
    readTime: "12 min video",
    actionText: "Watch Video",
    actionIcon: "play_circle",
    imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80"
  }
];
