'use client';

import Link from 'next/link';
import { LayoutDashboard, User, LogOut } from 'lucide-react';

import { useAuth } from '@/hooks/useAuth';

export default function Navbar() {
  const { user, isAdmin, signInWithDiscord, signOut } = useAuth();

  return (
    <nav className="glass sticky top-0 z-50 w-full border-b border-white/5 py-4">
      <div className="container flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <img src="/en-logo.png" alt="EN Logo" style={{ height: '32px', width: 'auto', objectFit: 'contain', filter: 'drop-shadow(0 0 10px rgba(212,175,55,0.8))' }} />
          <span className="heading-serif text-xl font-bold tracking-wider">Every Nation</span>
        </Link>

        <div className="flex items-center gap-4 lg:gap-8">
          <Link href="/" className="text-sm font-bold uppercase tracking-widest text-text-muted hover:text-white transition-colors hidden md:block">Home</Link>
          
          {user ? (
            <div className="flex items-center gap-4 lg:gap-8">
              <Link href="/dashboard" className="text-sm font-bold uppercase tracking-widest text-text-muted hover:text-white transition-colors hidden md:block">Overview</Link>
              <Link href="/rules" className="text-sm font-bold uppercase tracking-widest text-text-muted hover:text-white transition-colors hidden md:block">Rules</Link>
              <Link href="/dashboard/check-in" className="text-sm font-bold uppercase tracking-widest text-text-muted hover:text-white transition-colors hidden md:block">Submit</Link>
              <Link href="/dashboard/rewards" className="text-sm font-bold uppercase tracking-widest text-text-muted hover:text-white transition-colors hidden md:block">Rewards</Link>
              <Link href="/leaderboard" className="text-sm font-bold uppercase tracking-widest text-text-muted hover:text-white transition-colors hidden md:block">Leaderboard</Link>
              
              {isAdmin && (
                <>
                  <div className="hidden md:block" style={{ width: '1px', height: '16px', backgroundColor: 'rgba(255,255,255,0.2)' }} />
                  <Link href="/admin" className="text-sm font-bold text-secondary hover:text-white transition-colors hidden md:block uppercase tracking-widest">Admin</Link>
                </>
              )}

              <button 
                onClick={() => signOut()}
                className="btn-secondary flex items-center gap-2 py-1.5 px-4 text-xs md:text-sm"
                title="Logout"
              >
                <LogOut size={16} className="text-secondary" />
                <span className="font-bold uppercase tracking-widest hidden md:inline">Logout</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-6">
              <Link href="/rules" className="text-sm font-bold uppercase tracking-widest text-text-muted hover:text-white transition-colors hidden md:block">Rules</Link>
              <Link href="/#rewards" className="text-sm font-bold uppercase tracking-widest text-text-muted hover:text-white transition-colors hidden md:block">Rewards</Link>
              <Link href="/leaderboard" className="text-sm font-bold uppercase tracking-widest text-text-muted hover:text-white transition-colors hidden md:block">Leaderboard</Link>
              <button 
                onClick={() => signInWithDiscord()}
                className="btn-primary py-2 px-6 text-sm"
              >
                Login
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
