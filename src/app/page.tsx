'use client';

import Navbar from '@/components/Navbar';
import { Award, CheckCircle, Users, Zap, ExternalLink } from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-secondary/10 rounded-full blur-[120px]"></div>
        </div>

        <div className="container relative z-10 text-center animate-fade-in">
          <h1 className="mb-6 leading-tight">
            <span className="block text-text-main text-2xl heading-modern mb-2">Welcome to the</span>
            <span className="gold-gradient text-6xl md:text-7xl">Every Nation</span>
            <span className="block text-secondary text-3xl mt-2">Rewards Tracker</span>
          </h1>
          
          <p className="max-w-2xl mx-auto text-text-muted text-lg mb-10">
            Earn <span className="text-primary font-bold">Echo Beads</span> by participating in guild activities. 
            Redeem them for Monthly Passes, Battle Passes, and premium shop items.
          </p>

          <div className="flex flex-col md:flex-row items-center justify-center gap-4">
            <a href="/dashboard/check-in" className="btn-primary px-10 py-4 text-lg">
              Start Earning Now
            </a>
            <a href="/dashboard/rewards" className="btn-secondary px-10 py-4 text-lg">
              View Reward Catalog
            </a>
          </div>

          <div className="mt-16 flex items-center justify-center gap-12 text-text-muted opacity-60 grayscale hover:grayscale-0 transition-all">
            <div className="flex items-center gap-2">
              <Award size={20} />
              <span>Participate</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle size={20} />
              <span>Verify</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap size={20} />
              <span>Redeem</span>
            </div>
          </div>
        </div>
      </section>

      {/* Stats/Overview */}
      <section className="py-20 bg-surface/50 border-y border-white/5">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card text-center group">
              <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center rounded-full bg-primary/10 text-primary group-hover:scale-110 transition-transform">
                <Zap size={32} />
              </div>
              <h3 className="mb-4">Weekly Earnings</h3>
              <p className="text-text-muted">Earn up to <span className="text-primary font-bold">40 GP</span> every week through guild events and activity goals.</p>
            </div>
            
            <div className="card text-center group">
              <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center rounded-full bg-secondary/10 text-secondary group-hover:scale-110 transition-transform">
                < Award size={32} />
              </div>
              <h3 className="mb-4">Exclusive Rewards</h3>
              <p className="text-text-muted">Exchange your points for in-game Monthly Passes and Battle Passes at a 1:1 Echo Bead rate.</p>
            </div>

            <div className="card text-center group">
              <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center rounded-full bg-success/10 text-success group-hover:scale-110 transition-transform">
                <Users size={32} />
              </div>
              <h3 className="mb-4">Referral Bonus</h3>
              <p className="text-text-muted">Invite friends to Every Nation and receive <span className="text-success font-bold">50 GP</span> when they become active members.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Rules Section */}
      <section id="rules" className="py-20">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-center mb-12">How It Works</h2>
            <div className="space-y-8">
              {[
                { title: 'Join the Guild', desc: 'Ensure you are a member of Every Nation in-game and in our Discord server.' },
                { title: 'Attend Events', desc: 'Participate in Breaking Army, Guild War, and other weekly activities.' },
                { title: 'Submit Proof', desc: 'Upload a screenshot of your participation in the dashboard. Admins will verify your submission.' },
                { title: 'Redeem Points', desc: 'Once you hit 300 GP, you can request your reward from the catalog.' }
              ].map((step, i) => (
                <div key={i} className="flex gap-6 items-start">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full border border-primary flex items-center justify-center font-bold text-primary">
                    {i + 1}
                  </div>
                  <div>
                    <h4 className="text-lg font-bold mb-1">{step.title}</h4>
                    <p className="text-text-muted">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/5 opacity-50">
        <div className="container text-center">
          <p className="text-sm">
            Every Nation Rewards Tracker &copy; 2026. Built for Where Winds Meet.
          </p>
        </div>
      </footer>
    </main>
  );
}
