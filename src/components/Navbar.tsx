'use client';

import Link from 'next/link';
import { Shield, LayoutDashboard, User, LogOut } from 'lucide-react';

import { useAuth } from '@/hooks/useAuth';

export default function Navbar() {
  const { user, signInWithDiscord, signOut } = useAuth();

  return (
    <nav className="glass sticky top-0 z-50 w-full border-b border-white/5 py-4">
      <div className="container flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Shield className="text-primary h-8 w-8" />
          <span className="heading-serif text-xl font-bold tracking-wider">Every Nation</span>
        </Link>

        <div className="flex items-center gap-6">
          <Link href="/#rewards" className="text-text-muted hover:text-primary transition-colors">Rewards</Link>
          <Link href="/#rules" className="text-text-muted hover:text-primary transition-colors">Rules</Link>
          
          {user ? (
            <div className="flex items-center gap-4">
              <Link href="/dashboard" className="btn-secondary flex items-center gap-2 py-2 px-4 text-sm">
                <LayoutDashboard size={16} />
                Dashboard
              </Link>
              <button 
                onClick={() => signOut()}
                className="text-text-muted hover:text-error transition-colors"
                title="Logout"
              >
                <LogOut size={20} />
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
