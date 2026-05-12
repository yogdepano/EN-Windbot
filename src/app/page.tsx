'use client';

import Navbar from '@/components/Navbar';
import { Award, CheckCircle, Zap, ShieldCheck, ChevronRight, ClipboardCheck } from 'lucide-react';

export default function Home() {
  return (
    <main className="h-screen flex flex-col overflow-hidden">
      <Navbar />
      
      <div className="flex-1 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-[100px]"></div>
        </div>

        <div className="container h-full relative z-10 py-4 flex items-center">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full items-stretch">
            
            {/* Left Column: Hero */}
            <div className="flex flex-col justify-center gap-6 animate-fade-in pr-4">
              <header>
                <div className="flex items-center gap-3 mb-4">
                  <img src="/logo.png" alt="EN Logo" className="w-12 h-12 md:w-16 md:h-16 object-contain" />
                  <h1 className="leading-none">
                    <span className="block text-text-main text-lg font-medium mb-1">Welcome to the</span>
                    <span className="gold-gradient text-4xl md:text-6xl font-black block leading-none">Every Nation</span>
                  </h1>
                </div>
                <h2 className="text-secondary text-2xl md:text-3xl font-bold mb-4 tracking-tight">Rewards Tracker</h2>
                
                <p className="max-w-md text-text-muted text-sm leading-relaxed mb-6">
                  Earn <span className="text-primary font-bold">Echo Beads</span> by participating in guild activities. 
                  Redeem them for Monthly Passes and premium shop items.
                </p>
              </header>

              <div className="flex gap-4 mb-2">
                <a href="/dashboard/check-in" className="btn-primary px-6 py-2.5 text-sm font-bold flex items-center justify-center gap-2">
                  Start Earning
                  <ChevronRight size={16} />
                </a>
                <a href="/dashboard/rewards" className="btn-secondary px-6 py-2.5 text-sm font-bold">
                  Rewards Catalog
                </a>
              </div>

              {/* Summary Cards */}
              <div className="space-y-3 max-w-sm">
                <div className="card bg-white/[0.02] border-white/5 p-4 flex items-center gap-4 transition-all">
                  <Zap className="text-primary flex-shrink-0" size={20} />
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wide">Weekly Earnings</h3>
                    <p className="text-[10px] text-text-muted leading-relaxed">Earn up to <span className="text-primary font-bold">40 GP</span> every week.</p>
                  </div>
                </div>
                
                <div className="card bg-white/[0.02] border-white/5 p-4 flex items-center gap-4 transition-all">
                  <Award className="text-secondary flex-shrink-0" size={20} />
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wide">Exclusive Rewards</h3>
                    <p className="text-[10px] text-text-muted leading-relaxed">1:1 Echo Bead redemption rate.</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 text-text-muted opacity-40 text-[9px] font-bold uppercase tracking-widest mt-2">
                <div className="flex items-center gap-1.5"><Award size={12} /> Participate</div>
                <div className="flex items-center gap-1.5"><CheckCircle size={12} /> Verify</div>
                <div className="flex items-center gap-1.5"><Zap size={12} /> Redeem</div>
              </div>
            </div>

            {/* Right Column: Guide */}
            <div className="hidden lg:flex items-center">
              <section className="card bg-surface/30 backdrop-blur-md border-primary/20 p-6 relative overflow-hidden shadow-xl w-full">
                <div className="absolute top-0 right-0 p-4 opacity-5">
                  <ShieldCheck size={80} />
                </div>
                
                <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
                  <ShieldCheck className="text-primary" size={20} />
                  How It Works
                </h2>

                <div className="space-y-5 relative">
                  {/* Vertical Line */}
                  <div className="absolute left-[17px] top-2 bottom-2 w-px bg-white/10 z-0"></div>

                  {[
                    { icon: ShieldCheck, title: 'Join the Guild', desc: 'Member of Every Nation in-game & Discord.', color: 'text-primary' },
                    { icon: Zap, title: 'Attend Events', desc: 'Participate in Breaking Army & Guild War.', color: 'text-secondary' },
                    { icon: ClipboardCheck, title: 'Submit Proof', desc: 'Upload screenshots. Verified in 24h.', color: 'text-success' },
                    { icon: GiftIcon, title: 'Redeem Points', desc: 'Spend earned GP on premium rewards.', color: 'text-warning' }
                  ].map((step, i) => (
                    <div key={i} className="flex gap-4 items-start relative z-10">
                      <div className={`flex-shrink-0 w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center ${step.color}`}>
                        <step.icon size={16} />
                      </div>
                      <div>
                        <h4 className="text-[11px] font-bold mb-0.5 uppercase tracking-wider">{step.title}</h4>
                        <p className="text-[10px] text-text-muted leading-tight">{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-4 border-t border-white/5 text-center">
                  <p className="text-[8px] text-text-muted uppercase tracking-widest font-bold">Official Guild Rewards Portal</p>
                </div>
              </section>
            </div>

          </div>
        </div>
      </div>
      
      <style>{`
        .gold-gradient {
          background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
      `}</style>
    </main>
  );
}

function GiftIcon({ size }: { size: number }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <polyline points="20 12 20 22 4 22 4 12"></polyline>
      <rect x="2" y="7" width="20" height="5"></rect>
      <line x1="12" y1="22" x2="12" y2="7"></line>
      <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"></path>
      <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"></path>
    </svg>
  );
}
