import { Link } from "wouter";

export function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 py-4">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="text-gray-500 text-sm mb-4 md:mb-0">
            © {new Date().getFullYear()} WealthAdvisor AI. All rights reserved.
          </div>
          <div className="flex items-center space-x-6">
            <Link href="/privacy">
              <span className="text-gray-500 hover:text-primary text-sm cursor-pointer">Privacy Policy</span>
            </Link>
            <Link href="/terms">
              <span className="text-gray-500 hover:text-primary text-sm cursor-pointer">Terms of Service</span>
            </Link>
            <Link href="/support">
              <span className="text-gray-500 hover:text-primary text-sm cursor-pointer">Contact Support</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
