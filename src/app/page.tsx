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

        <div className="container h-full relative z-10 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 h-full items-center">
            
            {/* Left Column: Hero (7/12) */}
            <div className="lg:col-span-7 flex flex-col gap-8 animate-fade-in pr-8">
              <header>
                <div className="flex items-center gap-4 mb-6">
                  <img src="/logo.png" alt="EN Logo" className="w-16 h-16 md:w-20 md:h-20 object-contain" />
                  <h1 className="leading-none">
                    <span className="block text-text-main text-xl font-medium mb-2">Welcome to the</span>
                    <span className="gold-gradient text-5xl md:text-7xl font-black block">Every Nation</span>
                  </h1>
                </div>
                <h2 className="text-secondary text-3xl md:text-4xl font-bold mb-6 tracking-tight">Rewards Tracker</h2>
                
                <p className="max-w-xl text-text-muted text-base leading-relaxed">
                  Earn <span className="text-primary font-bold">Echo Beads</span> by participating in guild activities. 
                  Redeem them for Monthly Passes, Battle Passes, and premium shop items.
                </p>
              </header>

              <div className="flex flex-col sm:flex-row gap-4">
                <a href="/dashboard/check-in" className="btn-primary px-8 py-3 text-base font-bold flex items-center justify-center gap-2">
                  Start Earning Now
                  <ChevronRight size={18} />
                </a>
                <a href="/dashboard/rewards" className="btn-secondary px-8 py-3 text-base font-bold">
                  View Reward Catalog
                </a>
              </div>

              {/* Summary Cards */}
              <div className="flex flex-col gap-4 max-w-lg">
                <div className="card bg-white/[0.03] border-white/5 p-5 group hover:border-primary/20 transition-all flex items-center gap-6">
                  <Zap className="text-primary group-hover:scale-110 transition-transform flex-shrink-0" size={24} />
                  <div>
                    <h3 className="text-sm font-bold mb-1 uppercase tracking-wide">Weekly Earnings</h3>
                    <p className="text-[11px] text-text-muted leading-relaxed">Earn up to <span className="text-primary font-bold">40 GP</span> every week through guild events and goals.</p>
                  </div>
                </div>
                
                <div className="card bg-white/[0.03] border-white/5 p-5 group hover:border-secondary/20 transition-all flex items-center gap-6">
                  <Award className="text-secondary group-hover:scale-110 transition-transform flex-shrink-0" size={24} />
                  <div>
                    <h3 className="text-sm font-bold mb-1 uppercase tracking-wide">Exclusive Rewards</h3>
                    <p className="text-[11px] text-text-muted leading-relaxed">Redeem for Monthly Passes and Battle Passes at a <span className="text-text-main font-bold">1:1 Echo Bead rate</span>.</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-6 text-text-muted opacity-40 text-[10px] font-bold uppercase tracking-widest">
                <div className="flex items-center gap-1.5"><Award size={12} /> Participate</div>
                <div className="flex items-center gap-1.5"><CheckCircle size={12} /> Verify</div>
                <div className="flex items-center gap-1.5"><Zap size={12} /> Redeem</div>
              </div>
            </div>

            {/* Right Column: Guide (5/12) */}
            <div className="lg:col-span-5 hidden lg:block">
              <section className="card bg-surface/40 backdrop-blur-xl border-primary/20 p-8 relative overflow-hidden shadow-2xl shadow-primary/5 h-full max-h-[600px] flex flex-col justify-center">
                <div className="absolute top-0 right-0 p-6 opacity-5">
                  <ShieldCheck size={100} />
                </div>
                
                <h2 className="text-xl font-bold mb-8 flex items-center gap-3">
                  <ShieldCheck className="text-primary" size={24} />
                  How It Works
                </h2>

                <div className="space-y-6 relative">
                  {/* Vertical Line */}
                  <div className="absolute left-[19px] top-2 bottom-2 w-px bg-white/10 z-0"></div>

                  {[
                    { 
                      icon: ShieldCheck, 
                      title: 'Join the Guild', 
                      desc: 'Be an active member of Every Nation in Where Winds Meet and our Discord server.',
                      color: 'bg-primary/20 text-primary'
                    },
                    { 
                      icon: Zap, 
                      title: 'Attend Events', 
                      desc: 'Participate in Breaking Army, Guild War, and other weekly guild activities.',
                      color: 'bg-secondary/20 text-secondary'
                    },
                    { 
                      icon: ClipboardCheck, 
                      title: 'Submit Proof', 
                      desc: 'Upload screenshots of your participation. Admins verify submissions within 24h.',
                      color: 'bg-success/20 text-success'
                    },
                    { 
                      icon: GiftIcon, 
                      title: 'Redeem Points', 
                      desc: 'Spend your earned GP directly on premium rewards in the reward catalog.',
                      color: 'bg-warning/20 text-warning'
                    }
                  ].map((step, i) => (
                    <div key={i} className="flex gap-5 items-start relative z-10 group">
                      <div className={`flex-shrink-0 w-10 h-10 rounded-full ${step.color} flex items-center justify-center font-bold border border-white/10 group-hover:scale-110 transition-transform`}>
                        <step.icon size={16} />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold mb-0.5 uppercase tracking-wider">{step.title}</h4>
                        <p className="text-[11px] text-text-muted leading-relaxed">{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 pt-6 border-t border-white/5 text-center">
                  <p className="text-[9px] text-text-muted uppercase tracking-[0.2em] font-bold">Official Guild Rewards Portal</p>
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
