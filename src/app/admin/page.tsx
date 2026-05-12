import { 
  Users, 
  ClipboardCheck, 
  Gift, 
  BarChart3, 
  AlertTriangle,
  ArrowUpRight,
  ShieldCheck
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export default function AdminHub() {
  // Mock data
  const stats = [
    { name: 'Pending Check-ins', value: 12, icon: ClipboardCheck, color: 'text-warning' },
    { name: 'Pending Redemptions', value: 3, icon: Gift, color: 'text-secondary' },
    { name: 'Total GP Liabilities', value: '14,500', icon: ShieldCheck, color: 'text-primary' },
    { name: 'Active Members', value: 84, icon: Users, color: 'text-success' },
  ];

  return (
    <div className="space-y-8">
      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl mb-1">Admin Command Center</h2>
          <p className="text-text-muted">Global guild activity and reward management.</p>
        </div>
        <div className="flex gap-4">
          <button className="btn-secondary text-sm">Download Report</button>
          <button className="btn-primary text-sm flex items-center gap-2">
            <ShieldCheck size={16} />
            System Status: Active
          </button>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="card group hover:border-white/20">
            <div className={`p-3 rounded-lg bg-white/5 w-fit mb-4 group-hover:scale-110 transition-transform ${stat.color}`}>
              <stat.icon size={24} />
            </div>
            <p className="text-xs text-text-muted uppercase tracking-widest font-bold">{stat.name}</p>
            <h3 className="text-2xl mt-1">{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Priority Queues */}
        <section className="card space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg flex items-center gap-2">
              <ClipboardCheck className="text-warning" size={20} />
              Recent Pending Proofs
            </h3>
            <a href="/admin/queue" className="text-xs text-primary font-bold hover:underline flex items-center gap-1">
              Go to Approval Queue <ArrowUpRight size={14} />
            </a>
          </div>
          
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-transparent hover:border-white/10 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-surface-hover border border-white/5 flex items-center justify-center font-bold text-xs">
                    U{i}
                  </div>
                  <div>
                    <p className="font-bold">Member_Name_{i}</p>
                    <p className="text-xs text-text-muted italic">Breaking Army (Sat) • 1h ago</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="px-3 py-1 bg-success/10 text-success text-[10px] font-bold uppercase rounded hover:bg-success/20">Quick Approve</button>
                  <button className="px-3 py-1 bg-white/5 text-text-muted text-[10px] font-bold uppercase rounded hover:bg-white/10">View</button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* System Health / Logs */}
        <section className="card space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg flex items-center gap-2">
              <BarChart3 className="text-secondary" size={20} />
              System Audit Log
            </h3>
          </div>

          <div className="space-y-4 font-mono text-xs text-text-muted">
            {[
              { time: '14:22:05', action: 'GP ADJUST', user: 'Admin_Z', detail: 'Member_X +50 (Referral Bonus)' },
              { time: '13:45:12', action: 'REDEEM', user: 'Member_Y', detail: 'Approved: Monthly Pass' },
              { time: '12:10:30', action: 'SETTINGS', user: 'Admin_Z', detail: 'Updated: Breaking Army points (5 -> 7)' },
              { time: '10:05:44', action: 'BAN', user: 'Admin_A', detail: 'Suspended: User_B (Fraudulent Proof)' },
            ].map((log, i) => (
              <div key={i} className="flex gap-4 p-2 border-b border-white/5 last:border-0">
                <span className="opacity-40">{log.time}</span>
                <span className="text-primary font-bold">[{log.action}]</span>
                <span className="text-text-main">{log.detail}</span>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Manual GP Adjustment */}
      <section className="card bg-gradient-to-r from-surface to-error/5 border-l-4 border-l-error">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg flex items-center gap-2 text-error">
              <AlertTriangle size={20} />
              Manual GP Correction
            </h3>
            <p className="text-sm text-text-muted">Use this only for manual corrections. All actions are logged.</p>
          </div>
          <button className="btn-secondary border-error text-error hover:bg-error/10">Open Adjustment Tool</button>
        </div>
      </section>
    </div>
  );
}
