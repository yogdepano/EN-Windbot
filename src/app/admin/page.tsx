'use client';

import { useState, useEffect } from 'react';
import { 
  Users, 
  ClipboardCheck, 
  Gift, 
  BarChart3, 
  AlertTriangle,
  ArrowUpRight,
  ShieldCheck,
  Loader,
  PlusCircle,
  MinusCircle
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export default function AdminHub() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState([
    { name: 'Pending Check-ins', value: 0, icon: ClipboardCheck, color: 'text-warning' },
    { name: 'Pending Redemptions', value: 0, icon: Gift, color: 'text-secondary' },
    { name: 'Total GP Liabilities', value: '0', icon: ShieldCheck, color: 'text-primary' },
    { name: 'Active Members', value: 0, icon: Users, color: 'text-success' },
  ]);
  const [recentProofs, setRecentProofs] = useState<any[]>([]);
  const [recentRedemptions, setRecentRedemptions] = useState<any[]>([]);
  
  // Manual Adjustment State
  const [targetUser, setTargetUser] = useState('');
  const [adjustAmount, setAdjustAmount] = useState(0);
  const [adjustReason, setAdjustReason] = useState('');
  const [adjusting, setAdjusting] = useState(false);
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    async function fetchAdminData() {
      // 1. Fetch Stats
      const [
        { count: pendingCheckins },
        { count: pendingRedemptions },
        { data: profiles },
      ] = await Promise.all([
        supabase.from('check_ins').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
        supabase.from('redemption_requests').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
        supabase.from('profiles').select('gp_balance, username, id, in_game_name'),
      ]);

      const totalGP = profiles?.reduce((acc, p) => acc + (p.gp_balance || 0), 0) || 0;
      
      setStats([
        { name: 'Pending Check-ins', value: pendingCheckins || 0, icon: ClipboardCheck, color: 'text-warning' },
        { name: 'Pending Redemptions', value: pendingRedemptions || 0, icon: Gift, color: 'text-secondary' },
        { name: 'Total GP Liabilities', value: totalGP.toLocaleString(), icon: ShieldCheck, color: 'text-primary' },
        { name: 'Active Members', value: profiles?.length || 0, icon: Users, color: 'text-success' },
      ]);

      if (profiles) setUsers(profiles);

      // 2. Recent Proofs
      const { data: proofs } = await supabase
        .from('check_ins')
        .select('*, profiles:profiles!check_ins_user_id_fkey(username, in_game_name), activities(name)')
        .eq('status', 'pending')
        .order('created_at', { ascending: false })
        .limit(3);
      
      if (proofs) setRecentProofs(proofs);

      // 3. Recent Redemptions
      const { data: redemptions } = await supabase
        .from('redemption_requests')
        .select('*, profiles:profiles!redemption_requests_user_id_fkey(username), rewards(name, cost)')
        .eq('status', 'pending')
        .order('created_at', { ascending: false })
        .limit(3);
      
      if (redemptions) setRecentRedemptions(redemptions);

      setLoading(false);
    }

    fetchAdminData();
  }, []);

  const handleProcessRedemption = async (id: string, action: 'approved' | 'rejected') => {
    const { error } = await supabase
      .from('redemption_requests')
      .update({ 
        status: action,
        processed_at: new Date().toISOString()
      })
      .eq('id', id);

    if (!error) {
      alert('Redemption ' + action);
      window.location.reload();
    }
  };

  const handleManualAdjust = async () => {
    if (!targetUser || adjustAmount === 0) return;
    setAdjusting(true);
    
    try {
      const { error } = await supabase.rpc('adjust_gp', {
        p_user_id: targetUser,
        p_amount: adjustAmount
      });

      if (error) throw error;
      
      alert('GP Adjusted Successfully');
      setAdjustAmount(0);
      setAdjustReason('');
      
      // Refresh stats
      window.location.reload();
    } catch (err: any) {
      alert('Error: ' + err.message);
    } finally {
      setAdjusting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader className="animate-spin text-primary" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl mb-1">Admin Command Center</h2>
          <p className="text-text-muted">Global guild activity and reward management.</p>
        </div>
        <div className="flex gap-4">
          <button className="btn-primary text-sm flex items-center gap-2">
            <ShieldCheck size={16} />
            System Status: Active
          </button>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="card group hover:border-white/20">
            <div className={`p-3 rounded-lg bg-white/5 w-fit mb-4 group-hover:scale-110 transition-transform ${stat.color}`}>
              <stat.icon size={24} />
            </div>
            <p className="text-xs text-text-muted uppercase tracking-widest font-bold">{stat.name}</p>
            <h3 className="text-2xl mt-1">{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Priority Queues */}
        <div className="space-y-8">
          <section className="card space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg flex items-center gap-2">
                <ClipboardCheck className="text-warning" size={20} />
                Recent Pending Proofs
              </h3>
              <a href="/admin/queue" className="text-xs text-primary font-bold hover:underline flex items-center gap-1">
                Go to Approval Queue <ArrowUpRight size={14} />
              </a>
            </div>
            
            <div className="space-y-4">
              {recentProofs.length > 0 ? recentProofs.map((proof) => (
                <div key={proof.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-transparent hover:border-white/10 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-surface-hover border border-white/5 flex items-center justify-center font-bold text-xs uppercase">
                      {proof.profiles?.username?.[0] || 'U'}
                    </div>
                    <div>
                      <p className="font-bold">{proof.profiles?.username || 'Unknown'}</p>
                      <p className="text-xs text-text-muted italic">{proof.activities?.name} • {new Date(proof.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <a href="/admin/queue" className="px-3 py-1 bg-white/5 text-text-muted text-[10px] font-bold uppercase rounded hover:bg-white/10">Review</a>
                  </div>
                </div>
              )) : (
                <div className="py-8 text-center text-text-muted italic text-sm">No pending proofs in queue.</div>
              )}
            </div>
          </section>

          <section className="card space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg flex items-center gap-2">
                <Gift className="text-secondary" size={20} />
                Recent Redemptions
              </h3>
            </div>
            
            <div className="space-y-4">
              {recentRedemptions.length > 0 ? recentRedemptions.map((red) => (
                <div key={red.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-transparent hover:border-white/10 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-surface-hover border border-white/5 flex items-center justify-center font-bold text-xs uppercase">
                      {red.profiles?.username?.[0] || 'U'}
                    </div>
                    <div>
                      <p className="font-bold">{red.profiles?.username}</p>
                      <p className="text-xs text-text-muted italic">{red.rewards?.name} ({red.rewards?.cost} GP)</p>
                      {red.member_notes && <p className="text-[10px] text-primary">{red.member_notes}</p>}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleProcessRedemption(red.id, 'approved')} className="px-2 py-1 bg-success/10 text-success text-[10px] font-bold uppercase rounded hover:bg-success/20">Approve</button>
                    <button onClick={() => handleProcessRedemption(red.id, 'rejected')} className="px-2 py-1 bg-error/10 text-error text-[10px] font-bold uppercase rounded hover:bg-error/20">Reject</button>
                  </div>
                </div>
              )) : (
                <div className="py-8 text-center text-text-muted italic text-sm">No pending redemptions.</div>
              )}
            </div>
          </section>
        </div>

        {/* Manual GP Adjustment */}
        <section className="card space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg flex items-center gap-2 text-error">
              <AlertTriangle size={20} />
              Manual GP Correction
            </h3>
          </div>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted">Select Member</label>
              <select 
                className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm outline-none focus:border-error/50 transition-colors"
                value={targetUser}
                onChange={(e) => setTargetUser(e.target.value)}
              >
                <option value="">Select a user...</option>
                {users.map(u => (
                  <option key={u.id} value={u.id}>{u.username} ({u.in_game_name || 'No IGN'})</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted">Amount (+ or -)</label>
                <input 
                  type="number"
                  placeholder="e.g. 50 or -50"
                  className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm outline-none focus:border-error/50 transition-colors"
                  value={adjustAmount}
                  onChange={(e) => setAdjustAmount(parseInt(e.target.value) || 0)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted">Reason</label>
                <input 
                  type="text"
                  placeholder="e.g. Referral Bonus"
                  className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm outline-none focus:border-error/50 transition-colors"
                  value={adjustReason}
                  onChange={(e) => setAdjustReason(e.target.value)}
                />
              </div>
            </div>

            <button 
              disabled={!targetUser || adjustAmount === 0 || adjusting}
              onClick={handleManualAdjust}
              className="w-full py-4 bg-error/10 border border-error/20 text-error rounded-lg font-bold text-sm hover:bg-error/20 transition-all flex items-center justify-center gap-2 disabled:opacity-20"
            >
              {adjusting ? <Loader className="animate-spin w-4 h-4" /> : (adjustAmount >= 0 ? <PlusCircle size={18} /> : <MinusCircle size={18} />)}
              Apply Manual Correction
            </button>
          </div>
        </section>
      </div>

      <section className="card bg-gradient-to-r from-surface to-primary/5 border-l-4 border-l-primary p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg flex items-center gap-2">
              <BarChart3 size={20} className="text-primary" />
              System Audit
            </h3>
            <p className="text-sm text-text-muted">All manual adjustments and redemptions are recorded for transparency.</p>
          </div>
          <button className="text-xs font-bold text-primary uppercase tracking-widest hover:underline">View Full Logs</button>
        </div>
      </section>
    </div>
  );
}
