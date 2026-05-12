import Navbar from '@/components/Navbar';
import DashboardNav from '@/components/DashboardNav';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="container flex-1 flex flex-col md:flex-row gap-4 md:gap-8 px-0 md:px-8">
        <DashboardNav isAdmin={true} /> {/* Defaulting to true for demo purposes */}
        <main className="flex-1 py-4 md:py-8 px-4 md:px-0 animate-fade-in overflow-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
