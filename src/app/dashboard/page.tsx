import { Award, Zap, History, TrendingUp, AlertCircle } from 'lucide-react';
import { createClient } from '@/lib/supabaseServer';
import { redirect } from 'next/navigation';
import { gpService } from '@/services/gpService';

export const dynamic = 'force-dynamic';

export default async function DashboardOverview() {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect('/');
  }

  // Fetch real profile data
  const profile = await gpService.getProfile(user.id);
  
  // Fetch real check-ins
  const { data: recentCheckins } = await gpService.getRecentCheckIns(user.id, 5);

  return (
    <div className="space-y-8">
      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl mb-1">Guild Overview</h2>
          <p className="text-text-muted">Welcome back, <span className="text-text-main font-bold">{profile?.username || user.email}</span></p>
        </div>
        <div className="text-right">
          <p className="text-xs text-text-muted uppercase tracking-widest font-bold">In-Game Name</p>
          <p className="text-primary font-bold">{profile?.in_game_name || 'Not Set'}</p>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card bg-gradient-to-br from-surface to-primary/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Zap size={64} />
          </div>
          <p className="text-text-muted text-sm uppercase tracking-widest font-bold mb-2">Available GP</p>
          <h3 className="text-5xl font-bold gold-gradient">{profile?.gp_balance || 0}</h3>
          <p className="text-xs text-text-muted mt-4">Equivalent to {profile?.gp_balance || 0} Echo Beads</p>
        </div>

        <div className="card">
          <p className="text-text-muted text-sm uppercase tracking-widest font-bold mb-2">Lifetime Earned</p>
          <h3 className="text-3xl">{profile?.lifetime_earned || 0} <span className="text-sm text-text-muted">GP</span></h3>
          <div className="mt-4 flex items-center gap-2 text-success text-xs font-bold">
            <TrendingUp size={14} />
            <span>Active Guild Member</span>
          </div>
        </div>

        <div className="card">
          <p className="text-text-muted text-sm uppercase tracking-widest font-bold mb-2">Total Redeemed</p>
          <h3 className="text-3xl">{profile?.lifetime_redeemed || 0} <span className="text-sm text-text-muted">GP</span></h3>
          <p className="text-xs text-text-muted mt-4">{profile?.lifetime_redeemed ? 'Rewards Claimed' : 'No Redemptions Yet'}</p>
        </div>
      </div>

      {/* Announcements / Alerts */}
      <div className="bg-primary/5 border border-primary/20 p-4 rounded-lg flex items-center gap-4">
        <div className="p-2 bg-primary/10 rounded-full text-primary">
          <AlertCircle size={20} />
        </div>
        <p className="text-sm">
          <span className="font-bold text-primary">Announcement:</span> The Guild War check-in window is now open for Saturday! Submit your proof by Sunday 11:59 PM.
        </p>
      </div>

      {/* Recent Activity */}
      <section className="card">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <History className="text-primary" size={20} />
            <h3 className="text-lg">Recent Check-ins</h3>
          </div>
          <button className="text-sm text-primary hover:underline">View All</button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/5 text-xs text-text-muted uppercase tracking-widest">
                <th className="pb-4 font-bold">Activity</th>
                <th className="pb-4 font-bold">Date</th>
                <th className="pb-4 font-bold">Points</th>
                <th className="pb-4 font-bold text-right">Status</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {(recentCheckins || []).map((item: any) => (
                <tr key={item.id} className="border-b border-white/5 last:border-0">
                  <td className="py-4 font-medium">{item.activities?.name}</td>
                  <td className="py-4 text-text-muted">{new Date(item.created_at).toLocaleDateString()}</td>
                  <td className="py-4 font-bold text-primary">+{item.activities?.points}</td>
                  <td className="py-4 text-right">
                    <span className={`px-2 py-1 rounded text-[10px] uppercase font-bold ${
                      item.status === 'approved' ? 'bg-success/10 text-success' : 
                      item.status === 'rejected' ? 'bg-error/10 text-error' : 'bg-warning/10 text-warning'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
              {(!recentCheckins || recentCheckins.length === 0) && (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-text-muted italic">No recent activity found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
