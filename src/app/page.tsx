'use client';

import { Award, CheckCircle, Zap, ShieldCheck, ChevronRight, ClipboardCheck } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default function EveryNationLanding() {
  return (
    <main className="flex flex-col bg-[#060608] overflow-hidden" id="en-portal-v1-1-0" style={{ position: 'relative', zIndex: 100, minHeight: 'calc(100vh - 80px)' }}>
      
      <div className="split-screen relative" style={{ zIndex: 110 }}>
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
                <div className="w-16 h-16 flex-shrink-0">
                  <img 
                    src="/en-guild-logo.png?v=3" 
                    alt="Every Nation Logo" 
                    className="w-full h-full object-contain drop-shadow-[0_0_15px_rgba(212,175,55,0.3)]" 
                  />
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

            <div className="mt-12 pt-6 border-t border-white-5 opacity-40 flex justify-between items-center" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <p className="text-xs uppercase tracking-widest font-bold" style={{ fontSize: '10px' }}>Every Nation Guild System</p>
              <div className="flex items-center gap-2" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div className="status-dot"></div>
                <p className="text-xs font-mono" style={{ fontSize: '10px' }}>v1.1.0</p>
              </div>
            </div>
          </div>
        </div>
      </div>

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
        .blur-[100px] { filter: blur(100px); }
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
  );
}
