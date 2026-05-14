'use client';

import { useState, useEffect } from 'react';
import { 
  Trophy, 
  Target, 
  Medal, 
  Star, 
  Loader, 
  Quote, 
  Zap, 
  ShieldCheck, 
  History,
  TrendingUp,
  ExternalLink,
  ArrowUpRight
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default function DashboardClient({ initialUser }: { initialUser: any }) {
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(initialUser);
  const [recentHistory, setRecentHistory] = useState<any[]>([]);
  const [guildProgress, setGuildProgress] = useState({ current: 0, target: 400 });
  const [updating, setUpdating] = useState(false);
  const [newCatchphrase, setNewCatchphrase] = useState(initialUser?.catchphrase || '');

  useEffect(() => {
    async function fetchDashboard() {
      if (!initialUser) return;

      const { data: profile } = await supabase.from('profiles').select('*').eq('id', initialUser.id).single();
      if (profile) {
        setUserData(profile);
        setNewCatchphrase(profile.catchphrase || '');
      }

      // Fetch Guild Progress
      const startOfWeek = new Date();
      startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay() + (startOfWeek.getDay() === 0 ? -6 : 1));
      
      const { data: weeklyCheckins } = await supabase
        .from('check_ins')
        .select('activities(points)')
        .eq('status', 'approved')
        .gte('created_at', startOfWeek.toISOString());
      
      const totalPoints = weeklyCheckins?.reduce((acc, c: any) => acc + (c.activities?.points || 0), 0) || 0;
      setGuildProgress({ current: totalPoints, target: 400 });

      // Fetch History
      const { data: history } = await supabase
        .from('check_ins')
        .select('*, activities(name, points)')
        .eq('user_id', initialUser.id)
        .order('created_at', { ascending: false })
        .limit(5);
      
      if (history) setRecentHistory(history);
      setLoading(false);
    }
    fetchDashboard();
  }, [initialUser]);

  const handleUpdateProfile = async () => {
    if (!initialUser) return;
    setUpdating(true);
    await supabase.from('profiles').update({ catchphrase: newCatchphrase }).eq('id', initialUser.id);
    setUpdating(false);
    alert('Catchphrase updated!');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader className="animate-spin text-primary" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-8 h-full overflow-y-auto pr-2 scrollbar-hide pb-12">
      {/* Guild Progress */}
      <section className="card bg-gradient-to-r from-surface to-primary/10 border-primary/20">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-1">
            <h3 className="text-xl font-black italic flex items-center gap-2">
              <Target className="text-primary" />
              WEEKLY GUILD GOAL
            </h3>
            <p className="text-sm text-text-muted">Collective points earned by all members this week.</p>
          </div>
          <div className="text-right">
            <span className="text-4xl font-black italic text-primary">{guildProgress.current}</span>
            <span className="text-lg text-text-muted"> / {guildProgress.target} GP</span>
          </div>
        </div>
        <div className="w-full h-4 bg-white/5 rounded-full mt-6 overflow-hidden">
          <div 
            className="h-full bg-primary shadow-[0_0_20px_#8b5cf6] transition-all duration-1000"
            style={{ width: `${Math.min((guildProgress.current / guildProgress.target) * 100, 100)}%` }}
          />
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Stats & Settings */}
        <div className="lg:col-span-2 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="card group hover:border-primary/50 transition-colors">
              <div className="p-3 rounded-lg bg-primary/10 w-fit mb-4 group-hover:scale-110 transition-transform">
                <Trophy size={20} className="text-primary" />
              </div>
              <p className="text-[10px] text-text-muted uppercase tracking-widest font-bold">Total EXP</p>
              <h3 className="text-2xl mt-1 font-black italic">{userData?.total_exp || 0}</h3>
            </div>
            <div className="card group hover:border-secondary/50 transition-colors">
              <div className="p-3 rounded-lg bg-secondary/10 w-fit mb-4 group-hover:scale-110 transition-transform">
                <Medal size={20} className="text-secondary" />
              </div>
              <p className="text-[10px] text-text-muted uppercase tracking-widest font-bold">Current Rank</p>
              <h3 className="text-2xl mt-1 font-black italic">{userData?.title || 'Member'}</h3>
            </div>
            <div className="card group hover:border-success/50 transition-colors">
              <div className="p-3 rounded-lg bg-success/10 w-fit mb-4 group-hover:scale-110 transition-transform">
                <Star size={20} className="text-success" />
              </div>
              <p className="text-[10px] text-text-muted uppercase tracking-widest font-bold">GP Balance</p>
              <h3 className="text-2xl mt-1 font-black italic">{userData?.gp_balance || 0}</h3>
            </div>
          </div>

          <section className="card space-y-6">
            <h3 className="text-lg flex items-center gap-2">
              <Quote className="text-primary" size={20} />
              Identity Settings
            </h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted">Your Catchphrase</label>
                <div className="flex gap-4">
                  <input 
                    type="text" 
                    placeholder="Set your personality on your Discord Player Card..."
                    className="flex-1 bg-white/5 border border-white/10 rounded-lg p-3 outline-none focus:border-primary transition-colors"
                    value={newCatchphrase}
                    onChange={(e) => setNewCatchphrase(e.target.value)}
                    maxLength={50}
                  />
                  <button 
                    onClick={handleUpdateProfile}
                    disabled={updating}
                    className="btn-primary"
                  >
                    {updating ? <Loader className="animate-spin" size={18} /> : 'Save'}
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* History */}
          <section className="card space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg flex items-center gap-2">
                <History className="text-primary" size={20} />
                Recent Activity
              </h3>
              <Link href="/dashboard/check-in" className="btn-secondary text-[10px] py-1">Submit Proof</Link>
            </div>
            <div className="space-y-4">
              {recentHistory.map((h) => (
                <div key={h.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-transparent hover:border-white/10 transition-colors">
                  <div>
                    <p className="font-bold">{h.activities?.name}</p>
                    <p className="text-[10px] text-text-muted uppercase tracking-widest">{new Date(h.created_at).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-primary">+{h.activities?.points} GP</p>
                    <span className={`text-[8px] uppercase font-bold px-2 py-0.5 rounded ${
                      h.status === 'approved' ? 'bg-success/10 text-success' : 
                      h.status === 'rejected' ? 'bg-error/10 text-error' : 'bg-warning/10 text-warning'
                    }`}>{h.status}</span>
                  </div>
                </div>
              ))}
              {recentHistory.length === 0 && <div className="text-center text-text-muted italic py-8 text-sm">No activity recorded yet.</div>}
            </div>
          </section>
        </div>

        {/* Right Column: Quick Links */}
        <div className="space-y-8">
          <section className="card space-y-6">
            <h3 className="text-lg flex items-center gap-2">
              <TrendingUp className="text-secondary" size={20} />
              Quick Actions
            </h3>
            <div className="grid grid-cols-1 gap-4">
              <Link href="/dashboard/rewards" className="flex items-center justify-between p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors group">
                <span className="text-sm font-bold">Browse Rewards</span>
                <ArrowUpRight size={18} className="text-text-muted group-hover:text-white" />
              </Link>
              <Link href="/rules" className="flex items-center justify-between p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors group">
                <span className="text-sm font-bold">Program Rules</span>
                <ExternalLink size={18} className="text-text-muted group-hover:text-white" />
              </Link>
            </div>
          </section>

          <div className="card bg-surface/50 border-dashed border-white/10 text-center py-12">
            <p className="text-xs text-text-muted italic">More features coming soon...</p>
          </div>
        </div>
      </div>
    </div>
  );
}
