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
  ];

  const adminLinks = [
    { name: 'Admin Hub', href: '/admin', icon: ShieldCheck },
    { name: 'Approval Queue', href: '/admin/queue', icon: ClipboardCheck },
    { name: 'Catalog', href: '/admin/catalog', icon: Settings },
  ];

  return (
    <aside className="w-64 flex-shrink-0 border-r border-white/5 h-[calc(100vh-80px)] sticky top-20 py-8">
      <nav className="flex flex-col gap-2">
        <p className="px-6 text-xs font-bold text-text-muted uppercase tracking-widest mb-4">Member</p>
        {links.map((link) => (
          <Link
            key={link.name}
            href={link.href}
            className={clsx(
              "flex items-center gap-3 px-6 py-3 transition-all group",
              pathname === link.href 
                ? "text-primary bg-primary/5 border-r-2 border-primary" 
                : "text-text-muted hover:text-text-main hover:bg-white/5"
            )}
          >
            <link.icon size={20} />
            <span className="font-medium">{link.name}</span>
            {pathname === link.href && <ChevronRight size={16} className="ml-auto" />}
          </Link>
        ))}

        {isAdmin && (
          <>
            <p className="px-6 text-xs font-bold text-text-muted uppercase tracking-widest mt-8 mb-4">Admin</p>
            {adminLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={clsx(
                  "flex items-center gap-3 px-6 py-3 transition-all group",
                  pathname === link.href 
                    ? "text-secondary bg-secondary/5 border-r-2 border-secondary" 
                    : "text-text-muted hover:text-text-main hover:bg-white/5"
                )}
              >
                <link.icon size={20} />
                <span className="font-medium">{link.name}</span>
              </Link>
            ))}
          </>
        )}
      </nav>
    </aside>
  );
}
