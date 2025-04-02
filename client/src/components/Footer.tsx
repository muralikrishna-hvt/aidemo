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
              <a className="text-gray-500 hover:text-primary text-sm">Privacy Policy</a>
            </Link>
            <Link href="/terms">
              <a className="text-gray-500 hover:text-primary text-sm">Terms of Service</a>
            </Link>
            <Link href="/support">
              <a className="text-gray-500 hover:text-primary text-sm">Contact Support</a>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
