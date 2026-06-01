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

  const [echoBeadQuantity, setEchoBeadQuantity] = useState(1);

  const getRewardStyle = (name: string) => {
    if (name.includes('Monthly Pass')) return { color: '#3b82f6', glow: 'rgba(59, 130, 246, 0.1)' };
    if (name.includes('Premium Battle Pass')) return { color: '#eab308', glow: 'rgba(234, 179, 8, 0.1)' };
    if (name.includes('Battle Pass')) return { color: '#8b5cf6', glow: 'rgba(139, 92, 246, 0.1)' };
    if (name.includes('Echo Bead')) return { color: '#f8fafc', glow: 'rgba(248, 250, 252, 0.1)' };
    return { color: 'var(--primary)', glow: 'var(--primary-10)' };
  };

  const handleRedeem = async (reward: any) => {
    if (!user || !profile) return;
    
    const isEchoBead = reward.name.includes('Echo Bead');
    const quantity = isEchoBead ? echoBeadQuantity : 1;
    const totalCost = reward.cost * quantity;

    if (profile.gp_balance < totalCost) {
      setMessage({ type: 'error', text: `Insufficient GP. You need ${totalCost} GP but only have ${profile.gp_balance} GP.` });
      return;
    }

    setRedeeming(reward.id);
    const { error } = await supabase.from('redemption_requests').insert({
      user_id: profile.id,
      reward_id: reward.id,
      status: 'pending',
      member_notes: isEchoBead ? `Quantity: ${quantity}` : null
    });

    if (error) {
      setMessage({ type: 'error', text: 'Failed to submit redemption. Please try again.' });
    } else {
      setMessage({ type: 'success', text: `Redemption request for ${quantity > 1 ? quantity + ' ' : ''}"${reward.name}" submitted!` });
      if (isEchoBead) setEchoBeadQuantity(1);
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
          const isEchoBead = reward.name.includes('Echo Bead');
          const quantity = isEchoBead ? echoBeadQuantity : 1;
          const totalCost = reward.cost * quantity;
          const canAfford = profile && profile.gp_balance >= totalCost;
          const tierStyle = getRewardStyle(reward.name);

          return (
            <div key={reward.id} className="card" style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '1rem', 
              position: 'relative', 
              overflow: 'hidden',
              borderColor: tierStyle.color + '33',
              boxShadow: `0 10px 30px -10px ${tierStyle.glow}`
            }}>
              <div style={{ position: 'absolute', top: 0, right: 0, padding: '1rem', opacity: 0.05, color: tierStyle.color }}>
                <Gift size={64} />
              </div>
              <div style={{ 
                width: 48, 
                height: 48, 
                borderRadius: '50%', 
                background: tierStyle.color + '1a', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                color: tierStyle.color 
              }}>
                <ShoppingBag size={24} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.1rem', color: 'var(--text-main)', textTransform: 'none', letterSpacing: 'normal', fontWeight: 700 }}>{reward.name}</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: 4 }}>{reward.description}</p>
              </div>

              {isEchoBead && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'rgba(255,255,255,0.05)', padding: '0.5rem', borderRadius: '8px', width: 'fit-content' }}>
                  <button 
                    onClick={() => setEchoBeadQuantity(Math.max(1, echoBeadQuantity - 10))}
                    style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '1.2rem', padding: '0 0.5rem' }}
                  >-</button>
                  <span style={{ minWidth: '3ch', textAlign: 'center', fontWeight: 'bold' }}>{echoBeadQuantity}</span>
                  <button 
                    onClick={() => setEchoBeadQuantity(echoBeadQuantity + 10)}
                    style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '1.2rem', padding: '0 0.5rem' }}
                  >+</button>
                </div>
              )}

              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 'auto' }}>
                <Zap size={16} style={{ color: tierStyle.color }} />
                <span style={{ fontSize: '1.5rem', fontWeight: 700, color: tierStyle.color }}>{totalCost}</span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>GP</span>
              </div>
              <button
                onClick={() => handleRedeem(reward)}
                disabled={!canAfford || redeeming === reward.id}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '8px',
                  border: 'none',
                  background: canAfford ? tierStyle.color : 'rgba(255,255,255,0.05)',
                  color: canAfford ? (tierStyle.color === '#f8fafc' ? '#000' : '#fff') : 'var(--text-muted)',
                  fontWeight: 700,
                  transition: 'all 0.2s',
                  opacity: (!canAfford || redeeming === reward.id) ? 0.5 : 1,
                  cursor: (!canAfford || redeeming === reward.id) ? 'not-allowed' : 'pointer',
                }}
              >
                {redeeming === reward.id ? 'Submitting...' : canAfford ? 'Redeem Now' : `Need ${totalCost - (profile?.gp_balance || 0)} more GP`}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
