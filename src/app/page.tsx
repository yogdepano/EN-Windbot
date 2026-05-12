'use client';

import Navbar from '@/components/Navbar';
import { Award, CheckCircle, Zap, ShieldCheck, ChevronRight, ClipboardCheck } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default function LandingPage() {
  return (
    <main className="min-h-screen flex flex-col bg-[#060608] overflow-x-hidden">
      <Navbar />
      
      <div className="flex-1 flex flex-col md:flex-row relative">
        {/* Ambient Background */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[100px]"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-[100px]"></div>
        </div>

        {/* Left Column: Hero & Info */}
        <div className="w-full md:w-1/2 flex flex-col justify-center px-6 lg:px-16 py-12 border-r border-white/5 relative z-10">
          <div className="max-w-md animate-fade-in mx-auto md:mx-0">
            <header className="mb-10">
              <div className="flex items-center gap-4 mb-6">
                <img src="/en-guild-logo.png?v=7" alt="Logo" className="w-14 h-14 md:w-16 md:h-16 object-contain" />
                <div className="leading-tight">
                  <p className="text-[10px] text-text-muted uppercase tracking-[0.4em] font-bold mb-1">Official Portal</p>
                  <h1 className="text-4xl md:text-6xl font-black gold-gradient leading-none">Every Nation</h1>
                </div>
              </div>
              <h2 className="text-secondary text-2xl md:text-3xl font-bold mb-6 tracking-tight uppercase">Rewards Tracker</h2>
              <p className="text-text-muted text-sm md:text-base leading-relaxed">
                The exclusive rewards ecosystem for Every Nation members. Earn <span className="text-primary font-bold">Echo Beads</span> through guild activities and redeem them for premium shop items.
              </p>
            </header>

            <div className="flex items-center gap-4 mb-12">
              <a href="/dashboard/check-in" className="btn-primary px-8 py-3 text-sm font-bold flex items-center gap-2">
                Start Earning
                <ChevronRight size={16} />
              </a>
              <a href="/dashboard/rewards" className="btn-secondary px-8 py-3 text-sm font-bold">
                Catalog
              </a>
            </div>

            {/* Compact Benefit Cards */}
            <div className="grid grid-cols-1 gap-4">
              <div className="flex items-start gap-4 p-5 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-primary/20 transition-all group">
                <div className="p-2.5 rounded-xl bg-primary/10 text-primary group-hover:scale-110 transition-transform">
                  <Zap size={20} />
                </div>
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider mb-1">Weekly GP Cap</h3>
                  <p className="text-[11px] text-text-muted">Earn up to 40 GP every week via events.</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-5 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-secondary/20 transition-all group">
                <div className="p-2.5 rounded-xl bg-secondary/10 text-secondary group-hover:scale-110 transition-transform">
                  <Award size={20} />
                </div>
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider mb-1">Direct Rewards</h3>
                  <p className="text-[11px] text-text-muted">1:1 redemption for Monthly & Battle Passes.</p>
                </div>
              </div>
            </div>
            
            <div className="mt-10 flex gap-6 text-[10px] text-text-muted font-bold opacity-30 uppercase tracking-[0.2em]">
              <span className="flex items-center gap-2"><CheckCircle size={12} /> Participate</span>
              <span className="flex items-center gap-2"><CheckCircle size={12} /> Verify</span>
              <span className="flex items-center gap-2"><CheckCircle size={12} /> Redeem</span>
            </div>
          </div>
        </div>

        {/* Right Column: How It Works */}
        <div className="w-full md:w-1/2 flex flex-col justify-center px-6 lg:px-16 py-12 bg-surface/30 backdrop-blur-xl relative z-10">
          <div className="max-w-md mx-auto md:mx-0 w-full">
            <div className="flex items-center gap-3 mb-10">
              <ShieldCheck className="text-primary" size={28} />
              <h2 className="text-2xl font-bold uppercase tracking-tight">How It Works</h2>
            </div>

            <div className="space-y-8 relative">
              {/* Vertical Line */}
              <div className="absolute left-[19px] top-2 bottom-2 w-px bg-white/10"></div>
              
              {[
                { icon: ShieldCheck, title: 'Join the Guild', desc: 'Ensure you are a member in-game and in our Discord server.', color: 'text-primary' },
                { icon: Zap, title: 'Guild Activity', desc: 'Participate in Breaking Army, Guild War, and weekly tasks.', color: 'text-secondary' },
                { icon: ClipboardCheck, title: 'Submit Proof', desc: 'Upload participation screenshots in the dashboard for review.', color: 'text-success' },
                { icon: Award, title: 'Claim Rewards', desc: 'Redeem your earned GP for Monthly Passes and premium store items.', color: 'text-warning' }
              ].map((step, i) => (
                <div key={i} className="flex gap-6 items-start relative z-10 group">
                  <div className={`w-10 h-10 rounded-full bg-background border border-white/10 flex items-center justify-center ${step.color} group-hover:scale-110 transition-all shadow-xl`}>
                    <step.icon size={18} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-widest mb-1">{step.title}</h4>
                    <p className="text-xs text-text-muted leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-16 pt-8 border-t border-white/5 opacity-40 flex justify-between items-center">
              <p className="text-[10px] uppercase tracking-[0.4em] font-bold">Every Nation Guild System</p>
              <p className="text-[10px] font-mono">v1.0.7-final</p>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .gold-gradient {
          background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
      `}</style>
    </main>
  );
}
