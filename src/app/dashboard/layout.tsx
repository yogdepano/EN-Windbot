import Navbar from '@/components/Navbar';
import DashboardNav from '@/components/DashboardNav';
import { createClient } from '@/lib/supabaseServer';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  let isAdmin = false;
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();
    isAdmin = profile?.role === 'admin';
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="container flex-1 flex flex-col md:flex-row gap-4 md:gap-8 px-0 md:px-8">
        <DashboardNav isAdmin={isAdmin} />
        <main className="flex-1 py-4 md:py-8 px-4 md:px-0 animate-fade-in overflow-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
