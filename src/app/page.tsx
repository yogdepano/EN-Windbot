'use client';

import Navbar from '@/components/Navbar';
import { Award, CheckCircle, Zap, ShieldCheck, ChevronRight, ClipboardCheck } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default function Home() {
  return (
    <main className="h-screen flex flex-col bg-background overflow-hidden">
      <Navbar />
      
      <div className="flex-1 flex overflow-hidden relative">
        {/* Ambient Background */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[100px]"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-[100px]"></div>
        </div>

        {/* Strict Side-by-Side Grid */}
        <div className="container mx-auto h-full grid grid-cols-1 md:grid-cols-2 gap-0 relative z-10">
          
          {/* Left Column: Hero & Info */}
          <div className="flex flex-col justify-center px-6 lg:px-12 py-8 border-r border-white/5">
            <div className="max-w-md animate-fade-in">
              <header className="mb-8">
                <div className="flex items-center gap-4 mb-4">
                  <img src="/en-guild-logo.png" alt="Logo" className="w-12 h-12 md:w-14 md:h-14 object-contain" />
                  <div className="leading-tight">
                    <p className="text-[10px] text-text-muted uppercase tracking-[0.3em] font-bold mb-1">Guild Portal</p>
                    <h1 className="text-3xl md:text-5xl font-black gold-gradient leading-none">Every Nation</h1>
                  </div>
                </div>
                <h2 className="text-secondary text-xl md:text-2xl font-bold mb-4 tracking-tight uppercase">Rewards Tracker</h2>
                <p className="text-text-muted text-xs md:text-sm leading-relaxed">
                  The official rewards system for Every Nation. Earn <span className="text-primary font-bold">Echo Beads</span> through guild activities and redeem them for premium in-game items.
                </p>
              </header>

              <div className="flex items-center gap-4 mb-10">
                <a href="/dashboard/check-in" className="btn-primary px-6 py-2.5 text-xs font-bold flex items-center gap-2">
                  Start Earning
                  <ChevronRight size={14} />
                </a>
                <a href="/dashboard/rewards" className="btn-secondary px-6 py-2.5 text-xs font-bold">
                  Catalog
                </a>
              </div>

              {/* Compact Benefit Cards */}
              <div className="space-y-3">
                <div className="flex items-start gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-primary/20 transition-all group">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:scale-110 transition-transform">
                    <Zap size={18} />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wide mb-0.5">Weekly GP Cap</h3>
                    <p className="text-[10px] text-text-muted">Earn up to 40 GP every week via events.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-secondary/20 transition-all group">
                  <div className="p-2 rounded-lg bg-secondary/10 text-secondary group-hover:scale-110 transition-transform">
                    <Award size={18} />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wide mb-0.5">Direct Rewards</h3>
                    <p className="text-[10px] text-text-muted">1:1 redemption for Monthly & Battle Passes.</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 flex gap-4 text-[9px] text-text-muted font-bold opacity-30 uppercase tracking-widest">
                <span className="flex items-center gap-1.5"><CheckCircle size={10} /> Participate</span>
                <span className="flex items-center gap-1.5"><CheckCircle size={10} /> Verify</span>
                <span className="flex items-center gap-1.5"><CheckCircle size={10} /> Redeem</span>
              </div>
            </div>
          </div>

          {/* Right Column: How It Works */}
          <div className="hidden md:flex flex-col justify-center px-6 lg:px-12 py-8 bg-surface/20 backdrop-blur-sm">
            <div className="max-w-md w-full">
              <div className="flex items-center gap-3 mb-8">
                <ShieldCheck className="text-primary" size={24} />
                <h2 className="text-xl font-bold uppercase tracking-tight">How It Works</h2>
              </div>

              <div className="space-y-6 relative">
                <div className="absolute left-4 top-2 bottom-2 w-px bg-white/10"></div>
                
                {[
                  { icon: ShieldCheck, title: 'Join the Guild', desc: 'Ensure you are a member in-game and in our Discord.', color: 'text-primary' },
                  { icon: Zap, title: 'Guild Activity', desc: 'Participate in Breaking Army, Guild War, and weekly tasks.', color: 'text-secondary' },
                  { icon: ClipboardCheck, title: 'Submit Proof', desc: 'Upload participation screenshots in the dashboard.', color: 'text-success' },
                  { icon: Award, title: 'Claim Rewards', desc: 'Redeem your earned GP for premium store items.', color: 'text-warning' }
                ].map((step, i) => (
                  <div key={i} className="flex gap-5 items-start relative z-10 group">
                    <div className={`w-8 h-8 rounded-full bg-surface border border-white/10 flex items-center justify-center ${step.color} group-hover:scale-110 transition-transform shadow-lg`}>
                      <step.icon size={14} />
                    </div>
                    <div>
                      <h4 className="text-[11px] font-bold uppercase tracking-wider mb-0.5">{step.title}</h4>
                      <p className="text-[10px] text-text-muted leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-12 pt-6 border-t border-white/5 opacity-40 flex justify-between items-center">
                <p className="text-[8px] uppercase tracking-[0.4em] font-bold">Every Nation Guild System</p>
                <p className="text-[8px] font-mono">v1.0.5</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
