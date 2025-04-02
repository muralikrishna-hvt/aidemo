import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { userProfile } from "@/lib/dummyData";

export function Header() {
  const [location] = useLocation();

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center px-4 py-3">
        <div className="flex items-center space-x-2">
          <div className="text-primary text-2xl font-bold flex items-center">
            <span className="material-icons mr-2">account_balance</span>
            <span>WealthAdvisor AI</span>
          </div>
        </div>
        
        <nav className="hidden md:flex items-center space-x-8">
          <Link href="/dashboard">
            <a className={`${location === '/dashboard' ? 'text-primary font-semibold' : 'text-gray-700'} hover:text-primary font-medium`}>
              Dashboard
            </a>
          </Link>
          <Link href="/markets">
            <a className={`${location === '/markets' ? 'text-primary font-semibold' : 'text-gray-700'} hover:text-primary font-medium`}>
              Markets
            </a>
          </Link>
          <Link href="/portfolio">
            <a className={`${location === '/portfolio' ? 'text-primary font-semibold' : 'text-gray-700'} hover:text-primary font-medium`}>
              Portfolio
            </a>
          </Link>
          <Link href="/learn">
            <a className={`${location === '/learn' ? 'text-primary font-semibold' : 'text-gray-700'} hover:text-primary font-medium`}>
              Learn
            </a>
          </Link>
          <Link href="/advisor">
            <a className={`${location === '/advisor' ? 'text-primary font-semibold' : 'text-gray-700'} hover:text-primary font-medium`}>
              AI Advisor
            </a>
          </Link>
        </nav>
        
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" className="hidden md:flex">
            <span className="material-icons">notifications</span>
          </Button>
          <div className="hidden md:flex items-center space-x-2">
            <div className="h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center">
              <span className="material-icons text-sm">person</span>
            </div>
            <span className="font-medium">{userProfile.fullName}</span>
          </div>
          <Button variant="ghost" size="icon" className="md:hidden">
            <span className="material-icons">menu</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
