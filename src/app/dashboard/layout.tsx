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
      <div className="container flex-1 flex gap-8">
        <DashboardNav isAdmin={true} /> {/* Defaulting to true for demo purposes */}
        <main className="flex-1 py-8 animate-fade-in">
          {children}
        </main>
      </div>
    </div>
  );
}
