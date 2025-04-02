import { ReactNode } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { ScrollArea } from '@/components/ui/scroll-area';

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <ScrollArea className="flex-1">
        <main className="container mx-auto py-8 px-4 max-w-7xl">
          {children}
        </main>
      </ScrollArea>
      <Footer />
    </div>
  );
}
