'use client';

import { useEffect, useState } from 'react';
import { Gift, Zap, ShoppingBag, Loader } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';

export const dynamic = 'force-dynamic';

export default function RewardCatalog() {
  const { user } = useAuth();
  const [rewards, setRewards] = useState<any[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [redeeming, setRedeeming] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    async function fetchData() {
      const { data: rewardData } = await supabase.from('rewards').select('*').eq('availability', true).order('cost');
      if (rewardData) setRewards(rewardData);

      if (user) {
        const { data: profileData } = await supabase.from('profiles').select('*').eq('id', user.id).single();
        if (profileData) setProfile(profileData);
      }
      setLoading(false);
    }
    fetchData();
  }, [user]);

  const handleRedeem = async (reward: any) => {
    if (!user || !profile) return;
    if (profile.gp_balance < reward.cost) {
      setMessage({ type: 'error', text: `Insufficient GP. You need ${reward.cost} GP but only have ${profile.gp_balance} GP.` });
      return;
    }

    setRedeeming(reward.id);
    const { error } = await supabase.from('redemption_requests').insert({
      user_id: profile.id,
      reward_id: reward.id,
      status: 'pending'
    });

    if (error) {
      setMessage({ type: 'error', text: 'Failed to submit redemption. Please try again.' });
    } else {
      setMessage({ type: 'success', text: `Redemption request for "${reward.name}" submitted! An admin will process it shortly.` });
    }
    setRedeeming(null);
    setTimeout(() => setMessage(null), 5000);
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 300 }}>
        <Loader size={32} style={{ color: 'var(--primary)', animation: 'spin 1s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h2 style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>Reward Catalog</h2>
          <p style={{ color: 'var(--text-muted)' }}>Exchange your GP for in-game rewards at a 1:1 Echo Bead rate.</p>
        </div>
        {profile && (
          <div style={{ textAlign: 'right', padding: '0.75rem 1.25rem', background: 'var(--surface)', border: '1px solid var(--border-active)', borderRadius: 10 }}>
            <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700 }}>Your Balance</p>
            <p style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--primary)' }}>{profile.gp_balance} GP</p>
          </div>
        )}
      </header>

      {message && (
        <div style={{
          padding: '1rem',
          borderRadius: 8,
          background: message.type === 'success' ? 'var(--success-10)' : 'var(--error-10)',
          border: `1px solid ${message.type === 'success' ? 'var(--success)' : 'var(--error)'}`,
          color: message.type === 'success' ? 'var(--success)' : 'var(--error)',
        }}>
          {message.text}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
        {rewards.map((reward) => {
          const canAfford = profile && profile.gp_balance >= reward.cost;
          return (
            <div key={reward.id} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 0, right: 0, padding: '1rem', opacity: 0.05 }}>
                <Gift size={64} />
              </div>
              <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'var(--primary-10)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                <ShoppingBag size={24} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.1rem', color: 'var(--text-main)', textTransform: 'none', letterSpacing: 'normal' }}>{reward.name}</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: 4 }}>{reward.description}</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 'auto' }}>
                <Zap size={16} style={{ color: 'var(--primary)' }} />
                <span style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--primary)' }}>{reward.cost}</span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>GP</span>
              </div>
              <button
                onClick={() => handleRedeem(reward)}
                disabled={!canAfford || redeeming === reward.id}
                className={canAfford ? 'btn-primary' : 'btn-secondary'}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  opacity: (!canAfford || redeeming === reward.id) ? 0.5 : 1,
                  cursor: (!canAfford || redeeming === reward.id) ? 'not-allowed' : 'pointer',
                }}
              >
                {redeeming === reward.id ? 'Submitting...' : canAfford ? 'Redeem Now' : `Need ${reward.cost - (profile?.gp_balance || 0)} more GP`}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
