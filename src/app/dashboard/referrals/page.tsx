'use client';

import { useState, useEffect } from 'react';
import { Users, Copy, Share2, Info, TrendingUp, CheckCircle, Loader, Check } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';

export const dynamic = 'force-dynamic';

export default function ReferralsPage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [recruits, setRecruits] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function fetchReferralData() {
      if (!user) return;

      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (profileData) {
        setProfile(profileData);

        const { data: recruitsData } = await supabase
          .from('profiles')
          .select('username, in_game_name, gp_balance, status')
          .eq('referred_by', user.id);
        
        if (recruitsData) setRecruits(recruitsData);
      }
      setLoading(false);
    }

    fetchReferralData();
  }, [user]);

  const copyToClipboard = () => {
    if (!profile?.referral_code) return;
    navigator.clipboard.writeText(profile.referral_code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const referralStats = {
    total: recruits.length,
    active: recruits.filter(r => r.status === 'active').length,
    earned: recruits.filter(r => r.gp_balance >= 100).length * 50,
    potential: recruits.filter(r => r.gp_balance < 100).length * 50,
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
      <header>
        <h2 className="text-3xl mb-1">Referral Program</h2>
        <p className="text-text-muted">Grow the Every Nation guild and earn massive GP bonuses.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <section className="card bg-gradient-to-br from-surface to-secondary/5 border-secondary/20 p-8">
            <h3 className="text-xl mb-4 text-secondary flex items-center gap-2">
              <Share2 size={24} />
              Your Invitation Link
            </h3>
            <p className="text-text-muted mb-6">Share this code with new recruits. When they join and earn 100 GP, you get <span className="text-text-main font-bold">50 GP</span>!</p>
            
            <div className="flex gap-2">
              <div className="flex-1 bg-black/40 border border-white/10 rounded-lg p-4 font-mono text-xl tracking-widest text-center text-primary">
                {profile?.referral_code || 'LOADING...'}
              </div>
              <button 
                onClick={copyToClipboard}
                className="btn-primary flex items-center justify-center px-6"
              >
                {copied ? <Check size={20} /> : <Copy size={20} />}
              </button>
            </div>
          </section>

          <section className="card">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg">My Recruits</h3>
              <span className="text-xs text-text-muted italic">{referralStats.total} total invitations</span>
            </div>

            <div className="space-y-4">
              {recruits.length > 0 ? recruits.map((recruit, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-transparent hover:border-white/5 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-surface-hover flex items-center justify-center font-bold text-xs uppercase">
                      {recruit.username?.[0] || 'U'}
                    </div>
                    <div>
                      <p className="font-bold">{recruit.username}</p>
                      <p className="text-xs text-text-muted">Current Balance: {recruit.gp_balance} GP</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
                      recruit.status === 'active' ? 'bg-success/10 text-success' : 
                      recruit.status === 'suspended' ? 'bg-error/10 text-error' : 'bg-warning/10 text-warning'
                    }`}>
                      {recruit.status}
                    </span>
                    {recruit.gp_balance >= 100 && (
                      <p className="text-[10px] text-primary font-bold mt-1 flex items-center justify-end gap-1">
                        <CheckCircle size={10} />
                        Bonus Awarded
                      </p>
                    )}
                  </div>
                </div>
              )) : (
                <div className="py-12 text-center text-text-muted italic text-sm">You haven't referred any members yet.</div>
              )}
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <section className="card space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-widest text-text-muted">Referral Stats</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-white/5">
                <span className="text-text-muted">Total Earned</span>
                <span className="font-bold text-primary">{referralStats.earned} GP</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-white/5">
                <span className="text-text-muted">Active Referrals</span>
                <span className="font-bold">{referralStats.active}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-text-muted">Bonus Potential</span>
                <span className="font-bold text-secondary">+{referralStats.potential} GP</span>
              </div>
            </div>
          </section>

          <section className="card bg-primary/5 border-primary/20 space-y-4">
            <div className="flex items-center gap-2 text-primary">
              <Info size={18} />
              <h4 className="font-bold text-sm uppercase">Bonus Rules</h4>
            </div>
            <ul className="text-xs text-text-muted space-y-3 list-disc ml-4">
              <li>Recruits must use your code.</li>
              <li>Bonus of 50 GP is paid once recruit earns 100 GP.</li>
              <li>Recruits must remain active.</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
