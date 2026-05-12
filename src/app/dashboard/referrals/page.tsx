import { Users, Copy, Share2, Info, TrendingUp, CheckCircle } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default function ReferralsPage() {
  const referralCode = 'GHOST-882';
  const referralStats = {
    total: 12,
    active: 5,
    pending: 7,
    earned: 250,
  };

  const recruits = [
    { name: 'Jin_Fan_1', status: 'active', gp_earned: 120, bonus_awarded: true },
    { name: 'Bushido_Way', status: 'active', gp_earned: 105, bonus_awarded: true },
    { name: 'NightWatcher', status: 'pending', gp_earned: 45, bonus_awarded: false },
    { name: 'Sakai_Clan', status: 'suspended', gp_earned: 0, bonus_awarded: false },
  ];

  return (
    <div className="space-y-8">
      <header>
        <h2 className="text-3xl mb-1">Referral Program</h2>
        <p className="text-text-muted">Grow the Every Nation guild and earn massive GP bonuses.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Referral Card */}
        <div className="lg:col-span-2 space-y-6">
          <section className="card bg-gradient-to-br from-surface to-secondary/5 border-secondary/20 p-8">
            <h3 className="text-xl mb-4 text-secondary flex items-center gap-2">
              <Share2 size={24} />
              Your Invitation Link
            </h3>
            <p className="text-text-muted mb-6">Share this code with new recruits. When they join and earn 100 GP, you get <span className="text-text-main font-bold">50 GP</span>!</p>
            
            <div className="flex gap-2">
              <div className="flex-1 bg-black/40 border border-white/10 rounded-lg p-4 font-mono text-xl tracking-widest text-center text-primary">
                {referralCode}
              </div>
              <button className="btn-primary flex items-center justify-center px-6">
                <Copy size={20} />
              </button>
            </div>
          </section>

          <section className="card">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg">My Recruits</h3>
              <span className="text-xs text-text-muted italic">{referralStats.total} total invitations</span>
            </div>

            <div className="space-y-4">
              {recruits.map((recruit, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-transparent hover:border-white/5 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-surface-hover flex items-center justify-center font-bold text-xs uppercase">
                      {recruit.name[0]}
                    </div>
                    <div>
                      <p className="font-bold">{recruit.name}</p>
                      <p className="text-xs text-text-muted">Earned: {recruit.gp_earned} GP</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
                      recruit.status === 'active' ? 'bg-success/10 text-success' : 
                      recruit.status === 'suspended' ? 'bg-error/10 text-error' : 'bg-warning/10 text-warning'
                    }`}>
                      {recruit.status}
                    </span>
                    {recruit.bonus_awarded && (
                      <p className="text-[10px] text-primary font-bold mt-1 flex items-center justify-end gap-1">
                        <CheckCircle size={10} />
                        Bonus Paid
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Stats & Rules */}
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
                <span className="font-bold text-secondary">+{referralStats.pending * 50} GP</span>
              </div>
            </div>
            <div className="pt-4 flex items-center gap-2 text-success text-xs font-bold">
              <TrendingUp size={14} />
              <span>Rank: Guild Recruiter II</span>
            </div>
          </section>

          <section className="card bg-primary/5 border-primary/20 space-y-4">
            <div className="flex items-center gap-2 text-primary">
              <Info size={18} />
              <h4 className="font-bold text-sm uppercase">Bonus Rules</h4>
            </div>
            <ul className="text-xs text-text-muted space-y-3 list-disc ml-4">
              <li>Recruit must use your code during registration.</li>
              <li>Recruit must join the Every Nation Discord server.</li>
              <li>Recruit must remain in "active" status.</li>
              <li>Bonus is paid automatically once recruit earns <span className="text-text-main font-bold">100 GP</span> through activities.</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
