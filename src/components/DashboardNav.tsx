'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  ClipboardCheck, 
  Gift, 
  Settings,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { clsx } from 'clsx';

export default function DashboardNav({ isAdmin = false }) {
  const pathname = usePathname();

  const links = [
    { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Submit Proof', href: '/dashboard/check-in', icon: ClipboardCheck },
    { name: 'Rewards', href: '/dashboard/rewards', icon: Gift },
    { name: 'Referrals', href: '/dashboard/referrals', icon: Users },
  ];

  const adminLinks = [
    { name: 'Admin Hub', href: '/admin', icon: ShieldCheck },
    { name: 'Approval Queue', href: '/admin/queue', icon: ClipboardCheck },
  ];

  return (
    <aside className="w-full md:w-64 flex-shrink-0 md:border-r border-b md:border-b-0 border-white/5 md:h-[calc(100vh-80px)] md:sticky md:top-20 py-4 md:py-8 overflow-x-auto overflow-y-hidden scrollbar-hide">
      <nav className="flex md:flex-col gap-2 min-w-max md:min-w-0 pb-2 md:pb-0 px-2 md:px-0">
        <p className="px-6 text-xs font-bold text-text-muted uppercase tracking-widest mb-4 hidden md:block">Member</p>
        {links.map((link) => (
          <Link
            key={link.name}
            href={link.href}
            className={clsx(
              "flex items-center gap-3 px-4 md:px-6 py-2 md:py-3 transition-all rounded-full md:rounded-none group",
              pathname === link.href 
                ? "text-primary bg-primary/5 md:border-r-2 border-b-2 md:border-b-0 border-primary" 
                : "text-text-muted hover:text-text-main hover:bg-white/5"
            )}
          >
            <link.icon size={20} className="flex-shrink-0" />
            <span className="font-medium whitespace-nowrap">{link.name}</span>
            {pathname === link.href && <ChevronRight size={16} className="ml-auto hidden md:block" />}
          </Link>
        ))}

        {isAdmin && (
          <>
            <div className="w-px h-8 bg-white/10 mx-2 hidden md:block" />
            <div className="w-px h-8 bg-white/10 mx-2 md:hidden" />
            <p className="px-6 text-xs font-bold text-text-muted uppercase tracking-widest mt-0 md:mt-8 mb-4 hidden md:block">Admin</p>
            {adminLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={clsx(
                  "flex items-center gap-3 px-4 md:px-6 py-2 md:py-3 transition-all rounded-full md:rounded-none group",
                  pathname === link.href 
                    ? "text-secondary bg-secondary/5 md:border-r-2 border-b-2 md:border-b-0 border-secondary" 
                    : "text-text-muted hover:text-text-main hover:bg-white/5"
                )}
              >
                <link.icon size={20} className="flex-shrink-0" />
                <span className="font-medium whitespace-nowrap">{link.name}</span>
              </Link>
            ))}
          </>
        )}
      </nav>
    </aside>
  );
}
