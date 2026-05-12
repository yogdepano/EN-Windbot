'use client';

import Link from 'next/link';
import { Shield, LayoutDashboard, User, LogOut } from 'lucide-react';

import { useAuth } from '@/hooks/useAuth';

export default function Navbar() {
  const { user, isAdmin, signInWithDiscord, signOut } = useAuth();

  return (
    <nav className="glass sticky top-0 z-50 w-full border-b border-white/5 py-4">
      <div className="container flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Shield className="text-primary h-8 w-8" />
          <span className="heading-serif text-xl font-bold tracking-wider">Every Nation</span>
        </Link>

        <div className="flex items-center gap-6">
          <Link href="/#rewards" className="text-text-muted hover:text-primary transition-colors hidden md:block">Rewards</Link>
          <Link href="/#rules" className="text-text-muted hover:text-primary transition-colors hidden md:block">Rules</Link>
          
          {user ? (
            <div className="flex items-center gap-4 lg:gap-6">
              <Link href="/dashboard" className="text-sm font-medium text-text-muted hover:text-primary transition-colors hidden md:block">Overview</Link>
              <Link href="/dashboard/check-in" className="text-sm font-medium text-text-muted hover:text-primary transition-colors hidden md:block">Submit Proof</Link>
              <Link href="/dashboard/rewards" className="text-sm font-medium text-text-muted hover:text-primary transition-colors hidden md:block">Rewards</Link>
              <Link href="/dashboard/referrals" className="text-sm font-medium text-text-muted hover:text-primary transition-colors hidden md:block">Referrals</Link>
              
              {isAdmin && (
                <>
                  <div className="hidden md:block" style={{ width: '1px', height: '16px', backgroundColor: 'rgba(255,255,255,0.2)' }} />
                  <Link href="/admin" className="text-sm font-bold text-secondary hover:text-white transition-colors hidden md:block">Admin</Link>
                  <Link href="/admin/queue" className="text-sm font-bold text-secondary hover:text-white transition-colors hidden md:block">Queue</Link>
                </>
              )}

              <button 
                onClick={() => signOut()}
                className="btn-secondary flex items-center gap-2 py-1.5 px-3 text-xs md:text-sm md:ml-4"
                title="Logout"
              >
                <LogOut size={16} />
                <span className="hidden md:inline">Logout</span>
              </button>
            </div>
          ) : (
            <button 
              onClick={() => signInWithDiscord()}
              className="btn-primary py-2 px-6 text-sm"
            >
              Login with Discord
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
