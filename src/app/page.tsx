'use client';

import { Award, CheckCircle, Zap, ShieldCheck, ChevronRight, ClipboardCheck, Shield } from 'lucide-react';

export default function EveryNationLanding() {
  return (
    <div className="min-h-screen bg-background">
      <main className="flex flex-col bg-background">
        
        <div className="split-screen relative">
        {/* Ambient Background */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-glow rounded-full blur-[100px]"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary-glow rounded-full blur-[100px]"></div>
        </div>

        {/* Left Column: Hero & Info */}
        <div className="split-left flex flex-col justify-center px-6 lg:px-16 py-8 relative z-10 hide-scrollbar">
          <div className="max-w-md animate-fade-in mx-auto md:mx-0">
            <header className="mb-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 flex-shrink-0 flex items-center justify-center bg-primary-10 rounded-2xl border border-primary-20">
                  <Shield size={40} className="text-primary drop-shadow-[0_0_10px_rgba(212,175,55,0.5)]" />
                </div>
                <div className="leading-tight">
                  <p className="text-xs text-text-muted uppercase tracking-widest font-bold mb-1">Official Portal</p>
                  <h1 className="text-4xl md:text-5xl font-black gold-gradient leading-none tracking-tight" id="main-title">Every Nation</h1>
                </div>
              </div>
              <h2 className="text-secondary text-2xl md:text-3xl font-bold mb-4 tracking-tight uppercase" id="sub-title">Rewards Tracker</h2>
              <p className="text-text-muted text-sm md:text-base leading-relaxed">
                The exclusive rewards ecosystem for Every Nation members. Earn <span className="text-primary font-bold">Echo Beads</span> through guild activities and redeem them for premium shop items.
              </p>
            </header>

            <div className="flex items-center gap-4 mb-10">
              <a href="/dashboard/check-in" className="btn-primary px-8 py-3 text-sm font-bold flex items-center gap-2">
                Start Earning
                <ChevronRight size={16} />
              </a>
              <a href="/dashboard/rewards" className="btn-secondary px-8 py-3 text-sm font-bold">
                Catalog
              </a>
            </div>

            {/* Compact Benefit Cards */}
            <div className="grid grid-cols-1 gap-3" style={{ display: 'grid', gridTemplateColumns: '1fr' }}>
              <div className="flex items-start gap-4 p-4 rounded-2xl bg-white-5 border border-white-5 hover:border-primary-20 transition-all group">
                <div className="p-2.5 rounded-xl bg-primary-10 text-primary group-hover:scale-110 transition-transform flex-center" style={{ minWidth: '40px', minHeight: '40px' }}>
                  <Zap size={20} />
                </div>
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: 'var(--primary)', margin: 0, fontSize: '0.75rem' }}>Weekly GP Cap</h3>
                  <p className="text-xs text-text-muted" style={{ margin: 0, color: 'var(--text-muted)' }}>Earn up to 40 GP every week via events.</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-2xl bg-white-5 border border-white-5 hover:border-secondary-10 transition-all group">
                <div className="p-2.5 rounded-xl bg-secondary-10 text-secondary group-hover:scale-110 transition-transform flex-center" style={{ minWidth: '40px', minHeight: '40px' }}>
                  <Award size={20} />
                </div>
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: 'var(--secondary)', margin: 0, fontSize: '0.75rem' }}>Direct Rewards</h3>
                  <p className="text-xs text-text-muted" style={{ margin: 0, color: 'var(--text-muted)' }}>1:1 redemption for Monthly & Battle Passes.</p>
                </div>
              </div>
            </div>
            
            <div className="mt-8 flex gap-5 text-xs text-text-muted font-bold opacity-30 uppercase tracking-widest">
              <span className="flex items-center gap-2"><CheckCircle size={12} /> Participate</span>
              <span className="flex items-center gap-2"><CheckCircle size={12} /> Verify</span>
              <span className="flex items-center gap-2"><CheckCircle size={12} /> Redeem</span>
            </div>
          </div>
        </div>

        {/* Right Column: How It Works */}
        <div className="split-right flex flex-col justify-center px-6 lg:px-16 py-8 bg-surface relative z-10 hide-scrollbar" style={{ backgroundColor: 'rgba(12, 12, 15, 0.5)', backdropFilter: 'blur(20px)' }}>
          <div className="max-w-md mx-auto md:mx-0 w-full">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 rounded-lg bg-primary-10 text-primary flex-center">
                <ShieldCheck size={24} />
              </div>
              <h2 className="text-2xl font-bold uppercase tracking-tight" style={{ margin: 0 }}>How It Works</h2>
            </div>

            <div className="space-y-6 relative">
              {/* Vertical Line */}
              <div className="absolute left-[19px] top-2 bottom-2 w-px bg-white-10"></div>
              
              {[
                { icon: ShieldCheck, title: 'Join the Guild', desc: 'Ensure you are a member in-game and in our Discord server.', color: 'text-primary' },
                { icon: Zap, title: 'Guild Activity', desc: 'Participate in Breaking Army, Guild War, and weekly tasks.', color: 'text-secondary' },
                { icon: ClipboardCheck, title: 'Submit Proof', desc: 'Upload participation screenshots in the dashboard for review.', color: 'text-success' },
                { icon: Award, title: 'Claim Rewards', desc: 'Redeem your earned GP for Monthly Passes and premium store items.', color: 'text-warning' }
              ].map((step, i) => (
                <div key={i} className="flex gap-6 items-start relative z-10 group" style={{ display: 'flex', gap: '1.5rem' }}>
                  <div className={`w-10 h-10 rounded-full flex-center bg-background border border-white-10 ${step.color} group-hover:scale-110 transition-all shadow-xl`} style={{ flexShrink: 0, width: '40px', height: '40px', display: 'flex' }}>
                    <step.icon size={18} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-widest mb-1 group-hover:text-white transition-colors" style={{ margin: 0, fontSize: '0.75rem' }}>{step.title}</h4>
                    <p className="text-xs text-text-muted leading-relaxed" style={{ margin: 0 }}>{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Rules Section */}
      <section id="rules" className="container py-16 md:py-24 max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold uppercase tracking-widest gold-gradient mb-4">Every Nation</h2>
          <h3 className="text-xl md:text-2xl text-text-main font-bold">Rewards Program Rules</h3>
        </div>

        <div className="space-y-8">
          <div className="card bg-surface-alt border-white/5 p-6 md:p-8 rounded-2xl">
            <h4 className="text-lg font-bold text-primary mb-4 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-primary-10 flex-center text-xs">1</span> Eligibility
            </h4>
            <p className="text-text-muted mb-4">To participate, a member must:</p>
            <ul className="list-disc pl-6 text-text-muted space-y-2">
              <li>Be an active member of Every Nation.</li>
              <li>Be a member of the Every Nation Discord server.</li>
              <li>Remain in good standing in both the guild and Discord.</li>
              <li>Follow all guild and community rules.</li>
            </ul>
          </div>

          <div className="card bg-surface-alt border-white/5 p-6 md:p-8 rounded-2xl">
            <h4 className="text-lg font-bold text-primary mb-4 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-primary-10 flex-center text-xs">2</span> Exchange Rate
            </h4>
            <div className="bg-primary-10 border border-primary-20 rounded-lg p-4 mb-4 text-center">
              <p className="text-primary font-bold text-lg">1 Guild Point (GP) = 1 Echo Bead</p>
            </div>
            <p className="text-text-muted mb-4">Any in-game item can be redeemed based on its Echo Bead cost. Examples:</p>
            <ul className="list-disc pl-6 text-text-muted space-y-2">
              <li>Monthly Pass = 300 GP</li>
              <li>Battle Pass = 500 GP</li>
              <li>Premium Battle Pass = 1,000 GP</li>
            </ul>
          </div>

          <div className="card bg-surface-alt border-white/5 p-6 md:p-8 rounded-2xl">
            <h4 className="text-lg font-bold text-primary mb-4 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-primary-10 flex-center text-xs">3</span> How to Earn Points
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-text-muted">
                <thead className="text-xs uppercase bg-white-5 text-text-main">
                  <tr>
                    <th className="px-4 py-3 rounded-tl-lg">Activity</th>
                    <th className="px-4 py-3 rounded-tr-lg">Points</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-white-5"><td className="px-4 py-3">Breaking Army (Saturday)</td><td className="px-4 py-3 font-bold text-primary">5 GP</td></tr>
                  <tr className="border-b border-white-5"><td className="px-4 py-3">Breaking Army (Sunday)</td><td className="px-4 py-3 font-bold text-primary">5 GP</td></tr>
                  <tr className="border-b border-white-5"><td className="px-4 py-3">Guild Heroes Realm (once per week)</td><td className="px-4 py-3 font-bold text-primary">5 GP</td></tr>
                  <tr className="border-b border-white-5"><td className="px-4 py-3">Guild Party (once per week)</td><td className="px-4 py-3 font-bold text-primary">5 GP</td></tr>
                  <tr className="border-b border-white-5"><td className="px-4 py-3">Guild War (Saturday)</td><td className="px-4 py-3 font-bold text-primary">5 GP</td></tr>
                  <tr className="border-b border-white-5"><td className="px-4 py-3">Guild War (Sunday)</td><td className="px-4 py-3 font-bold text-primary">5 GP</td></tr>
                  <tr className="border-b border-white-5"><td className="px-4 py-3">Reach 2,000 Weekly Activity</td><td className="px-4 py-3 font-bold text-primary">10 GP</td></tr>
                </tbody>
              </table>
            </div>
            <p className="mt-4 text-warning font-bold text-sm">Maximum Weekly Earnings: 40 GP</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="card bg-surface-alt border-white/5 p-6 md:p-8 rounded-2xl">
              <h4 className="text-lg font-bold text-primary mb-4 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-primary-10 flex-center text-xs">4</span> Check-In Rules
              </h4>
              <ul className="list-disc pl-6 text-text-muted space-y-2 text-sm">
                <li>Check-ins are available only after the relevant guild event has concluded.</li>
                <li>Check-ins are only accepted during designated time windows.</li>
                <li>Screenshot proof is required.</li>
                <li>Only one submission is allowed per eligible activity.</li>
                <li className="text-error">False or fraudulent submissions may result in disqualification.</li>
              </ul>
            </div>

            <div className="card bg-surface-alt border-white/5 p-6 md:p-8 rounded-2xl">
              <h4 className="text-lg font-bold text-primary mb-4 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-primary-10 flex-center text-xs">5</span> Redemption Rules
              </h4>
              <ul className="list-disc pl-6 text-text-muted space-y-2 text-sm">
                <li>Guild Points may be redeemed for any item purchasable with Echo Beads.</li>
                <li>Minimum redemption amount: 300 GP.</li>
                <li>Members must already have the full point balance required.</li>
                <li>Points cannot be reserved in advance.</li>
                <li>Approved requests are fulfilled within 14 days.</li>
                <li>Points are deducted upon approval.</li>
              </ul>
            </div>
          </div>

          <div className="card bg-error-10 border border-error p-6 md:p-8 rounded-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-error"></div>
            <h4 className="text-lg font-bold text-error mb-4 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-error flex-center text-xs text-white">6</span> Discord Forfeiture Rule
            </h4>
            <p className="text-text-main mb-2 font-medium">If a member:</p>
            <ul className="list-disc pl-6 text-text-muted mb-4 space-y-1">
              <li>Leaves the Every Nation Discord server, or</li>
              <li>Is removed from the server for violating guild or community rules,</li>
            </ul>
            <p className="text-text-main mb-2 font-medium">then the following are immediately forfeited:</p>
            <ul className="list-disc pl-6 text-error mb-4 space-y-1 font-medium">
              <li>All accumulated Guild Points</li>
              <li>All pending redemption requests</li>
              <li>Eligibility to participate in the rewards program</li>
            </ul>
            <p className="text-text-muted text-sm italic">If the member rejoins later, they start again from zero.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="card bg-surface-alt border-white/5 p-6 md:p-8 rounded-2xl">
              <h4 className="text-lg font-bold text-secondary mb-4 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-secondary-10 flex-center text-xs">7</span> Referral Bonus
              </h4>
              <p className="text-text-muted mb-4 text-sm">Members may earn bonus GP for recruiting active members. A referral qualifies only if the recruit:</p>
              <ul className="list-disc pl-6 text-text-muted space-y-1 mb-4 text-sm">
                <li>Joins Every Nation & the Discord server.</li>
                <li>Remains in good standing & becomes genuinely active.</li>
                <li>Earns at least 100 GP.</li>
              </ul>
              <div className="bg-secondary-10 border border-secondary p-3 rounded-lg text-center">
                <p className="text-secondary font-bold text-sm">Referral Reward: 50 GP per qualified recruit</p>
              </div>
            </div>

            <div className="card bg-surface-alt border-white/5 p-6 md:p-8 rounded-2xl">
              <h4 className="text-lg font-bold text-primary mb-4 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-primary-10 flex-center text-xs">8</span> Anti-Abuse Policy
              </h4>
              <p className="text-text-muted mb-4 text-sm">The guild reserves the right to deny, revoke, or adjust points for:</p>
              <ul className="list-disc pl-6 text-text-muted space-y-1 mb-4 text-sm">
                <li>False check-ins</li>
                <li>Alt accounts</li>
                <li>Referral abuse</li>
                <li>Exploiting the system</li>
                <li>Any dishonest conduct</li>
              </ul>
              <p className="text-warning font-bold text-sm">All leadership decisions are final.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="card bg-surface-alt border-white/5 p-6 md:p-8 rounded-2xl">
              <h4 className="text-lg font-bold text-primary mb-4 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-primary-10 flex-center text-xs">9</span> Program Changes
              </h4>
              <p className="text-text-muted mb-4 text-sm">Because rewards are funded by guild leadership and sponsors:</p>
              <ul className="list-disc pl-6 text-text-muted space-y-2 text-sm">
                <li>Point values may be changed.</li>
                <li>Reward prices may be adjusted.</li>
                <li>The program may be modified, paused, or discontinued at any time.</li>
              </ul>
            </div>

            <div className="card bg-surface-alt border-white/5 p-6 md:p-8 rounded-2xl">
              <h4 className="text-lg font-bold text-primary mb-4 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-primary-10 flex-center text-xs">10</span> Final Authority
              </h4>
              <p className="text-text-muted leading-relaxed text-sm">
                Guild leadership retains final authority over all decisions, interpretations, and disputes related to the rewards program.
              </p>
            </div>
          </div>
        </div>
      </section>

      <style jsx global>{`
        :root {
          --white-5: rgba(255, 255, 255, 0.05);
          --white-10: rgba(255, 255, 255, 0.1);
        }
        .status-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background-color: var(--success);
          box-shadow: 0 0 10px var(--success);
          animation: pulse 2s infinite;
        }
        @keyframes pulse {
          0% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.2); }
          100% { opacity: 1; transform: scale(1); }
        }
        .flex { display: flex; }
        .flex-col { flex-direction: column; }
        .flex-1 { flex: 1; }
        .relative { position: relative; }
        .absolute { position: absolute; }
        .inset-0 { top: 0; right: 0; bottom: 0; left: 0; }
        .z-10 { z-index: 10; }
        .items-center { align-items: center; }
        .justify-between { justify-content: space-between; }
        .justify-center { justify-content: center; }
        .bg-primary-10 { background-color: var(--primary-10); }
        .bg-secondary-10 { background-color: var(--secondary-10); }
        .bg-white-5 { background-color: var(--white-5); }
        .bg-white-10 { background-color: var(--white-10); }
        .border-white-5 { border-color: var(--white-5); }
        .border-white-10 { border-color: var(--white-10); }
        .border-primary-20 { border-color: var(--primary-20); }
        .border-secondary-10 { border-color: var(--secondary-10); }
        .text-warning { color: var(--warning); }
        .pointer-events-none { pointer-events: none; }
        .blur-\[100px\] { filter: blur(100px); }
        .overflow-hidden { overflow: hidden; }
        .overflow-y-auto { overflow-y: auto; }
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .max-w-md { max-width: 28rem; }
        .mx-auto { margin-left: auto; margin-right: auto; }
        .px-6 { padding-left: 1.5rem; padding-right: 1.5rem; }
        .lg\\:px-16 { padding-left: 4rem; padding-right: 4rem; }
        .py-8 { padding-top: 2rem; padding-bottom: 2rem; }
        .border-r { border-right-width: 1px; }
        .border-t { border-top-width: 1px; }
        .w-96 { width: 24rem; }
        .h-96 { height: 24rem; }
        .bg-primary-glow { background-color: var(--primary-glow); }
        .bg-secondary-glow { background-color: var(--secondary-glow); }
      `}</style>
    </main>
    </div>
  );
}
