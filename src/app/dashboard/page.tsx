import { createClient } from '@/lib/supabaseServer';
import { redirect } from 'next/navigation';
import { gpService } from '@/services/gpService';
import DashboardClient from '@/components/dashboard/DashboardClient';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth/login');
  }

  const profile = await gpService.getProfile(user.id);

  return <DashboardClient initialUser={profile} />;
}
