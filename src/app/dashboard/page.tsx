import { Award, Zap, History, TrendingUp, AlertCircle, ShieldCheck, ChevronRight, Gift, ClipboardCheck } from 'lucide-react';
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

  const profile = await gpService.getProfile(user.id);
  const recentCheckins = await gpService.getRecentCheckIns(user.id, 3); // Limited to 3 for compact view

  return (
    <div className="flex flex-col gap-6 h-full max-h-[calc(100vh-120px)] overflow-hidden">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl mb-0.5">Guild Overview</h2>
          <p className="text-sm text-text-muted">Welcome back, <span className="text-text-main font-bold">{profile?.username || user.email}</span></p>
        </div>
        <div className="text-right">
          <p className="text-[10px] text-text-muted uppercase tracking-widest font-bold">In-Game Name</p>
          <p className="text-sm text-primary font-bold">{profile?.in_game_name || 'Not Set'}</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-0 overflow-hidden">
        {/* Left Column: Stats & Activity (7/12) */}
        <div className="lg:col-span-7 flex flex-col gap-6 min-h-0">
          {/* Main Balance Card */}
          <div className="card bg-gradient-to-br from-surface to-primary/5 relative overflow-hidden py-6">
            <div className="absolute top-0 right-0 p-4 opacity-5">
              <Zap size={80} />
            </div>
            <div className="flex items-center justify-between relative z-10">
              <div>
                <p className="text-text-muted text-xs uppercase tracking-widest font-bold mb-1">Available Balance</p>
                <h3 className="text-4xl font-bold gold-gradient leading-none">{profile?.gp_balance || 0} <span className="text-lg text-primary/60">GP</span></h3>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-2 text-success text-xs font-bold bg-success/10 px-3 py-1.5 rounded-full">
                  <TrendingUp size={14} />
                  <span>Rank: Active Member</span>
                </div>
              </div>
            </div>
          </div>

          {/* Secondary Stats Row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="card py-4">
              <p className="text-text-muted text-[10px] uppercase tracking-widest font-bold mb-1">Lifetime Earned</p>
              <h3 className="text-xl font-bold">{profile?.lifetime_earned || 0} <span className="text-xs text-text-muted font-normal">GP</span></h3>
            </div>
            <div className="card py-4">
              <p className="text-text-muted text-[10px] uppercase tracking-widest font-bold mb-1">Total Redeemed</p>
              <h3 className="text-xl font-bold">{profile?.lifetime_redeemed || 0} <span className="text-xs text-text-muted font-normal">GP</span></h3>
            </div>
          </div>

          {/* Recent Activity Table (Compact) */}
          <section className="card flex-1 flex flex-col min-h-0 overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <History className="text-primary" size={18} />
                <h3 className="text-base font-bold">Recent Activity</h3>
              </div>
              <a href="/dashboard/check-in" className="text-xs text-primary font-bold hover:underline">Submit More</a>
            </div>

            <div className="flex-1 overflow-auto">
              <table className="w-full text-left text-xs">
                <thead className="sticky top-0 bg-surface z-10">
                  <tr className="border-b border-white/5 text-text-muted uppercase tracking-tighter">
                    <th className="pb-2 font-bold">Activity</th>
                    <th className="pb-2 font-bold">Points</th>
                    <th className="pb-2 font-bold text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {(recentCheckins || []).map((item: any) => (
                    <tr key={item.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-3 font-medium">
                        <p>{item.activities?.name}</p>
                        <p className="text-[10px] text-text-muted">{new Date(item.created_at).toLocaleDateString()}</p>
                      </td>
                      <td className="py-3 font-bold text-primary">+{item.activities?.points}</td>
                      <td className="py-3 text-right">
                        <span className={`px-2 py-0.5 rounded-[4px] text-[9px] uppercase font-bold ${
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
                      <td colSpan={3} className="py-8 text-center text-text-muted italic">No recent check-ins.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        {/* Right Column: Guide & Announcements (5/12) */}
        <div className="lg:col-span-5 flex flex-col gap-6 min-h-0">
          {/* Announcement Alert */}
          <div className="bg-primary/5 border border-primary/20 p-4 rounded-xl flex items-start gap-3">
            <AlertCircle size={18} className="text-primary mt-0.5" />
            <div className="text-xs leading-relaxed">
              <span className="font-bold text-primary">Active Now:</span> Guild War check-in window is open! Submit proof by Sunday 11:59 PM.
            </div>
          </div>

          {/* How It Works Card */}
          <section className="card border-primary/10 flex-1 flex flex-col">
            <h3 className="text-base font-bold flex items-center gap-2 mb-6">
              <ShieldCheck className="text-primary" size={20} />
              How It Works
            </h3>
            
            <div className="space-y-5 flex-1">
              {[
                { 
                  icon: Zap, 
                  title: '1. Complete In-Game Activities', 
                  desc: 'Participate in Guild War, Breaking Army, or hit weekly activity targets.',
                  color: 'text-primary'
                },
                { 
                  icon: ClipboardCheck, 
                  title: '2. Submit Screenshot Proof', 
                  desc: 'Upload a clear screenshot of your participation in the Submit Proof section.',
                  color: 'text-success'
                },
                { 
                  icon: Award, 
                  title: '3. Admin Approval', 
                  desc: 'Our staff will review your proof within 24 hours to award your GP.',
                  color: 'text-warning'
                },
                { 
                  icon: Gift, 
                  title: '4. Redeem Premium Rewards', 
                  desc: 'Spend your hard-earned GP on Monthly Passes, Battle Passes, and more.',
                  color: 'text-secondary'
                }
              ].map((step, i) => (
                <div key={i} className="flex gap-4 group">
                  <div className={`p-2.5 rounded-lg bg-white/5 h-fit ${step.color} group-hover:scale-110 transition-transform`}>
                    <step.icon size={18} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold mb-0.5">{step.title}</h4>
                    <p className="text-xs text-text-muted leading-snug">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t border-white/5">
              <button className="btn-primary w-full py-3 text-xs flex items-center justify-center gap-2">
                Start Submitting
                <ChevronRight size={14} />
              </button>
            </div>
          </section>
        </div>
      </div>
      
      <style>{`
        .gold-gradient {
          background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
      `}</style>
    </div>
  );
}
