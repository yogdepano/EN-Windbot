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
    <div className="space-y-6 h-full overflow-y-auto pr-2 scrollbar-hide pb-12">
      {/* Weekly Guild Goal - Full Width Top */}
      <section className="card bg-gradient-to-r from-surface to-primary/10 border-primary/20 p-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/20 rounded-full">
              <Target className="text-primary" size={28} />
            </div>
            <div className="space-y-1">
              <h3 className="text-xl font-black italic tracking-tighter uppercase">Weekly Guild Goal</h3>
              <p className="text-xs text-text-muted">Collective guild progress for this week.</p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1">
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-black italic text-primary leading-none">{guildProgress.current}</span>
              <span className="text-sm font-bold text-text-muted">/ {guildProgress.target} GP</span>
            </div>
            <div className="w-48 h-2 bg-white/5 rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary shadow-[0_0_15px_#8b5cf6]"
                style={{ width: `${Math.min((guildProgress.current / guildProgress.target) * 100, 100)}%` }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Main Grid: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* LEFT COLUMN: Identity & Stats */}
        <div className="space-y-6">
          {/* Quick Stats Grid */}
          <div className="grid grid-cols-3 gap-4">
            <div className="card p-4 flex flex-col items-center text-center group">
              <Trophy size={20} className="text-primary mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-[9px] uppercase font-bold text-text-muted tracking-widest">EXP</span>
              <span className="text-xl font-black italic">{userData?.total_exp || 0}</span>
            </div>
            <div className="card p-4 flex flex-col items-center text-center group">
              <Medal size={20} className="text-secondary mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-[9px] uppercase font-bold text-text-muted tracking-widest">Rank</span>
              <span className="text-sm font-black italic text-secondary truncate w-full">{userData?.title || 'Member'}</span>
            </div>
            <div className="card p-4 flex flex-col items-center text-center group">
              <Star size={20} className="text-success mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-[9px] uppercase font-bold text-text-muted tracking-widest">Balance</span>
              <span className="text-xl font-black italic">{userData?.gp_balance || 0}</span>
            </div>
          </div>

          {/* Identity Settings */}
          <section className="card p-6 space-y-6">
            <h3 className="text-sm font-black italic tracking-widest uppercase flex items-center gap-2">
              <Quote className="text-primary" size={18} />
              Identity Settings
            </h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[9px] font-bold uppercase tracking-widest text-text-muted">Card Catchphrase</label>
                <div className="flex flex-col gap-3">
                  <input 
                    type="text" 
                    placeholder="Set your personality..."
                    className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm outline-none focus:border-primary transition-colors"
                    value={newCatchphrase}
                    onChange={(e) => setNewCatchphrase(e.target.value)}
                    maxLength={50}
                  />
                  <button 
                    onClick={handleUpdateProfile}
                    disabled={updating}
                    className="btn-primary w-full py-2.5 flex items-center justify-center gap-2"
                  >
                    {updating ? <Loader className="animate-spin" size={18} /> : 'Save Catchphrase'}
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Quick Actions */}
          <section className="card p-6 space-y-4">
            <h3 className="text-sm font-black italic tracking-widest uppercase flex items-center gap-2">
              <TrendingUp className="text-secondary" size={18} />
              Quick Navigation
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <Link href="/dashboard/rewards" className="flex flex-col items-center justify-center p-4 bg-white/5 rounded-xl border border-transparent hover:border-white/10 hover:bg-white/10 transition-all group">
                <Star size={24} className="text-primary mb-2 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-bold">Rewards</span>
              </Link>
              <Link href="/rules" className="flex flex-col items-center justify-center p-4 bg-white/5 rounded-xl border border-transparent hover:border-white/10 hover:bg-white/10 transition-all group">
                <ShieldCheck size={24} className="text-secondary mb-2 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-bold">Rules</span>
              </Link>
            </div>
          </section>
        </div>

        {/* RIGHT COLUMN: Recent Activity */}
        <div className="space-y-6">
          <section className="card p-0 flex flex-col h-full min-h-[450px]">
            <div className="p-6 border-b border-white/5 flex items-center justify-between">
              <h3 className="text-sm font-black italic tracking-widest uppercase flex items-center gap-2">
                <History className="text-primary" size={18} />
                Recent History
              </h3>
              <Link href="/dashboard/check-in" className="btn-secondary text-[10px] py-1.5 px-4 font-black italic uppercase">
                Submit New Proof
              </Link>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {recentHistory.map((h) => (
                <div key={h.id} className="flex items-center justify-between p-4 bg-white/[0.03] rounded-xl border border-transparent hover:border-white/10 transition-all">
                  <div className="space-y-1">
                    <p className="text-sm font-bold leading-tight">{h.activities?.name}</p>
                    <p className="text-[10px] text-text-muted font-bold">{new Date(h.created_at).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right space-y-1">
                    <p className="text-sm font-black italic text-primary">+{h.activities?.points} GP</p>
                    <span className={`text-[8px] uppercase font-black px-2 py-0.5 rounded-full ${
                      h.status === 'approved' ? 'bg-success/20 text-success' : 
                      h.status === 'rejected' ? 'bg-error/20 text-error' : 'bg-warning/20 text-warning'
                    }`}>{h.status}</span>
                  </div>
                </div>
              ))}
              {recentHistory.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full text-text-muted italic py-20 space-y-4">
                  <History size={48} className="opacity-10" />
                  <p className="text-sm">No activity recorded yet.</p>
                </div>
              )}
            </div>
          </section>
        </div>

      </div>
    </div>
  );
}
