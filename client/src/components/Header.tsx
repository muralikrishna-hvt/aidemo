import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";

// Sample notifications - in production, these would come from an API
const notifications = [
  {
    id: 1,
    title: "New AI Investment Insight",
    message: "New opportunity detected in Technology sector",
    time: "10 minutes ago",
    read: false,
    type: "insight",
  },
  {
    id: 2,
    title: "Portfolio Alert",
    message: "Your Tesla (TSLA) position is up 5.2% today",
    time: "2 hours ago",
    read: false,
    type: "alert",
  },
  {
    id: 3,
    title: "Goal Progress Update",
    message: "You're 5% closer to your Retirement goal",
    time: "1 day ago",
    read: true,
    type: "goal", 
  },
  {
    id: 4,
    title: "Market Update",
    message: "S&P 500 closed up 1.2% on strong earnings",
    time: "2 days ago",
    read: true,
    type: "market",
  },
];

export function Header() {
  const [location] = useLocation();
  const { user, logoutMutation } = useAuth();
  const [unreadCount, setUnreadCount] = useState(2);
  const [userNotifications, setUserNotifications] = useState(notifications);
  const { toast } = useToast();

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const markAllAsRead = () => {
    setUserNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    );
    setUnreadCount(0);
    toast({
      title: "Notifications marked as read",
      description: "All notifications have been marked as read",
    });
  };

  const markAsRead = (id: number) => {
    setUserNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  // Get icon based on notification type
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "insight":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500">
            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
          </svg>
        );
      case "alert":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-500">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
            <line x1="12" y1="9" x2="12" y2="13"></line>
            <line x1="12" y1="17" x2="12.01" y2="17"></line>
          </svg>
        );
      case "goal":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500">
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
          </svg>
        );
      case "market":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-500">
            <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
          </svg>
        );
      default:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="16" x2="12" y2="12"></line>
            <line x1="12" y1="8" x2="12.01" y2="8"></line>
          </svg>
        );
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center px-4 py-3">
        <div className="flex items-center space-x-2">
          <Link href="/dashboard">
            <div className="text-primary text-2xl font-bold flex items-center cursor-pointer">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="3" y1="9" x2="21" y2="9"></line>
                <line x1="9" y1="21" x2="9" y2="9"></line>
              </svg>
              <span>WealthAdvisor AI</span>
            </div>
          </Link>
        </div>
        
        <nav className="hidden md:flex items-center space-x-8">
          <Link href="/dashboard">
            <span className={`${location === '/dashboard' ? 'text-primary font-semibold' : 'text-gray-700'} hover:text-primary font-medium cursor-pointer`}>
              Dashboard
            </span>
          </Link>
          <Link href="/markets">
            <span className={`${location === '/markets' ? 'text-primary font-semibold' : 'text-gray-700'} hover:text-primary font-medium cursor-pointer`}>
              Markets
            </span>
          </Link>
          <Link href="/portfolio">
            <span className={`${location === '/portfolio' ? 'text-primary font-semibold' : 'text-gray-700'} hover:text-primary font-medium cursor-pointer`}>
              Portfolio
            </span>
          </Link>
          <Link href="/learn">
            <span className={`${location === '/learn' ? 'text-primary font-semibold' : 'text-gray-700'} hover:text-primary font-medium cursor-pointer`}>
              Learn
            </span>
          </Link>
          <Link href="/advisor">
            <span className={`${location === '/advisor' ? 'text-primary font-semibold' : 'text-gray-700'} hover:text-primary font-medium cursor-pointer`}>
              AI Advisor
            </span>
          </Link>
        </nav>
        
        <div className="flex items-center space-x-4">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="relative hidden md:flex">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                  <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                </svg>
                {unreadCount > 0 && (
                  <Badge variant="destructive" className="absolute -top-1 -right-1 px-1.5 min-w-[18px] min-h-[18px] flex items-center justify-center text-[10px] font-medium">
                    {unreadCount}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-80 p-0">
              <div className="p-3 border-b border-gray-100 flex justify-between items-center">
                <h3 className="font-semibold text-gray-900">Notifications</h3>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={markAllAsRead}
                  className="text-xs h-7 text-gray-500 hover:text-gray-700"
                >
                  Mark all as read
                </Button>
              </div>
              
              <div className="max-h-[320px] overflow-y-auto">
                {userNotifications.length === 0 ? (
                  <div className="py-8 text-center text-gray-500">
                    <p>No notifications</p>
                  </div>
                ) : (
                  userNotifications.map((notification) => (
                    <div 
                      key={notification.id}
                      className={`p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${!notification.read ? 'bg-blue-50' : ''}`}
                      onClick={() => markAsRead(notification.id)}
                    >
                      <div className="flex items-start">
                        <div className="flex-shrink-0 mr-3 mt-0.5">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 mb-0.5">
                            {notification.title}
                            {!notification.read && (
                              <span className="ml-2 inline-block w-2 h-2 bg-blue-500 rounded-full"></span>
                            )}
                          </p>
                          <p className="text-xs text-gray-500 mb-1">{notification.message}</p>
                          <p className="text-xs text-gray-400">{notification.time}</p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
              
              <div className="p-2 border-t border-gray-100 bg-gray-50">
                <Link href="/notifications">
                  <Button variant="ghost" size="sm" className="w-full text-sm justify-center">
                    View all notifications
                  </Button>
                </Link>
              </div>
            </PopoverContent>
          </Popover>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="hidden md:flex items-center space-x-2 cursor-pointer">
                <div className="h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                </div>
                <span className="font-medium">{user?.fullName || user?.username || "User"}</span>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Link href="/profile">Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href="/settings">Settings</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button variant="ghost" size="icon" className="md:hidden">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </Button>
        </div>
      </div>
    </header>
  );
}
