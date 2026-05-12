import { Gift, Zap, CheckCircle2, ShoppingBag } from 'lucide-react';

export default function RewardsCatalog() {
  const rewards = [
    { id: 1, name: 'Monthly Pass', cost: 300, desc: 'A 30-day premium subscription for Where Winds Meet.', available: true },
    { id: 2, name: 'Battle Pass', cost: 500, desc: 'Unlock the premium track of the current season\'s Battle Pass.', available: true },
    { id: 3, name: 'Premium Battle Pass', cost: 1000, desc: 'Unlock the premium track plus 20 level skips and exclusive cosmetics.', available: true },
    { id: 4, name: 'Shop Item (Any)', cost: 'Cost in Echo Beads', desc: 'Redeem any item from the in-game shop. Enter item name in notes.', available: true },
  ];

  const userGP = 150; // Mock

  return (
    <div className="space-y-8">
      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl mb-1">Reward Catalog</h2>
          <p className="text-text-muted">Exchange your earned GP for in-game premium items.</p>
        </div>
        <div className="card py-2 px-6 flex items-center gap-3 bg-primary/10 border-primary/20">
          <Zap size={20} className="text-primary" />
          <div>
            <p className="text-[10px] text-text-muted uppercase font-bold tracking-tighter">Your Balance</p>
            <p className="text-xl font-bold gold-gradient">{userGP} GP</p>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rewards.map((reward) => (
          <div key={reward.id} className="card flex flex-col group">
            <div className="aspect-video bg-surface-alt rounded-lg mb-6 flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <ShoppingBag size={48} className="text-white/10 group-hover:scale-110 transition-transform group-hover:text-primary/20" />
              <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                <span className="text-xs font-bold px-2 py-1 bg-primary text-black rounded uppercase">Premium</span>
                <div className="text-right">
                  <p className="text-[10px] text-white/60 uppercase font-bold">Cost</p>
                  <p className="text-lg font-bold text-white">{typeof reward.cost === 'number' ? `${reward.cost} GP` : reward.cost}</p>
                </div>
              </div>
            </div>

            <div className="flex-1 space-y-2">
              <h3 className="text-lg">{reward.name}</h3>
              <p className="text-sm text-text-muted leading-relaxed">{reward.desc}</p>
            </div>

            <div className="mt-6 pt-6 border-t border-white/5">
              <button 
                className={`w-full py-3 rounded-lg font-bold text-sm uppercase tracking-widest transition-all ${
                  typeof reward.cost === 'number' && userGP >= reward.cost 
                    ? 'bg-primary text-black hover:scale-[1.02] active:scale-[0.98]' 
                    : 'bg-white/5 text-text-muted cursor-not-allowed'
                }`}
                disabled={typeof reward.cost === 'number' && userGP < reward.cost}
              >
                {typeof reward.cost === 'number' && userGP < reward.cost ? 'Insufficient GP' : 'Redeem Reward'}
              </button>
              {typeof reward.cost === 'number' && userGP < reward.cost && (
                <p className="text-[10px] text-center mt-2 text-text-muted italic">
                  Need {reward.cost - userGP} more GP to unlock.
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      <section className="card bg-secondary/5 border-secondary/20 flex gap-6 items-center">
        <div className="w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center text-secondary">
          <CheckCircle2 size={32} />
        </div>
        <div>
          <h4 className="font-bold text-lg">Redemption Policy</h4>
          <p className="text-sm text-text-muted max-w-2xl">
            Redemptions are processed within 14 days of approval. Ensure your Discord DMs are open so an admin can contact you for delivery. Minimum redemption amount is 300 GP.
          </p>
        </div>
      </section>
    </div>
  );
}
