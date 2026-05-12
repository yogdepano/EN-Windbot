'use client';

import { useState } from 'react';
import { Check, X, Eye, ExternalLink, ShieldAlert, History, ClipboardCheck } from 'lucide-react';

export default function ApprovalQueue() {
  const [selectedItem, setSelectedItem] = useState<any>(null);

  // Mock data
  const queue = [
    { 
      id: 'sub_123', 
      user: 'Jin_Sakai', 
      ign: 'Ghost', 
      activity: 'Breaking Army (Sat)', 
      points: 5, 
      date: 'May 12, 4:30 PM',
      proof: '/references/Breaking Army.png', // Using ref as mock proof
      ref: '/references/Breaking Army.png'
    },
    { 
      id: 'sub_456', 
      user: 'Yuna_Thief', 
      ign: 'Yuna', 
      activity: 'Guild War (Sat)', 
      points: 5, 
      date: 'May 12, 5:15 PM',
      proof: '/references/Guild War.png',
      ref: '/references/Guild War.png'
    },
  ];

  return (
    <div className="space-y-8">
      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl mb-1">Approval Queue</h2>
          <p className="text-text-muted">Review and verify activity proofs from guild members.</p>
        </div>
        <div className="flex bg-surface-alt border border-white/5 rounded-lg p-1">
          <button className="px-4 py-1 text-xs font-bold bg-primary text-black rounded">Pending (12)</button>
          <button className="px-4 py-1 text-xs font-bold text-text-muted hover:text-text-main transition-colors">History</button>
        </div>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* List */}
        <section className="xl:col-span-1 card h-fit space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-widest text-text-muted mb-6">Submissions</h3>
          {queue.map((item) => (
            <div 
              key={item.id}
              onClick={() => setSelectedItem(item)}
              className={`p-4 rounded-xl border transition-all cursor-pointer ${
                selectedItem?.id === item.id 
                  ? 'bg-primary/5 border-primary shadow-lg shadow-primary/10' 
                  : 'bg-white/5 border-transparent hover:border-white/10'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-bold">{item.user}</p>
                  <p className="text-xs text-primary font-medium">{item.ign}</p>
                </div>
                <span className="text-[10px] text-text-muted font-mono">{item.date}</span>
              </div>
              <p className="text-sm text-text-main font-medium">{item.activity}</p>
              <div className="mt-3 flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 bg-white/10 rounded">Pending Review</span>
                <span className="text-[10px] font-bold text-primary">+{item.points} GP</span>
              </div>
            </div>
          ))}
        </section>

        {/* Review Area */}
        <section className="xl:col-span-2 space-y-6">
          {selectedItem ? (
            <div className="card space-y-8 animate-fade-in">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                    {selectedItem.user[0]}
                  </div>
                  <div>
                    <h3 className="text-xl">{selectedItem.user}</h3>
                    <p className="text-sm text-text-muted">Submitting for <span className="text-text-main font-bold">{selectedItem.activity}</span></p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="p-2 bg-error/10 text-error rounded-lg hover:bg-error/20 transition-colors title='Reject'">
                    <X size={20} />
                  </button>
                  <button className="p-2 bg-success/10 text-success rounded-lg hover:bg-success/20 transition-colors title='Approve'">
                    <Check size={20} />
                  </button>
                </div>
              </div>

              {/* Comparison */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted flex items-center gap-2">
                    <Eye size={12} />
                    Member Proof
                  </label>
                  <div className="aspect-video bg-black/40 rounded-xl overflow-hidden border border-white/5 relative group">
                    <img src={selectedItem.proof} alt="Proof" className="w-full h-full object-contain" />
                    <button className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 transition-opacity">
                      <ExternalLink size={20} />
                      <span className="text-sm font-bold">Open Full Size</span>
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted flex items-center gap-2">
                    <History size={12} />
                    Reference Guide
                  </label>
                  <div className="aspect-video bg-black/40 rounded-xl overflow-hidden border border-white/5 opacity-60">
                    <img src={selectedItem.ref} alt="Reference" className="w-full h-full object-contain grayscale" />
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-6 border-t border-white/5 space-y-4">
                <textarea 
                  placeholder="Add optional notes for the member (e.g. why it was rejected)..."
                  className="w-full bg-surface-hover border border-white/10 rounded-lg p-4 text-sm text-text-main outline-none focus:border-primary min-h-[100px] transition-colors"
                ></textarea>
                
                <div className="flex gap-4">
                  <button className="btn-primary flex-1 py-4 flex items-center justify-center gap-2">
                    <Check size={20} />
                    Approve and Award {selectedItem.points} GP
                  </button>
                  <button className="btn-secondary border-error text-error hover:bg-error/10 px-8">
                    Reject
                  </button>
                </div>
              </div>

              <div className="p-4 bg-error/5 border border-error/20 rounded-lg flex gap-3 text-xs text-error">
                <ShieldAlert size={16} className="flex-shrink-0" />
                <p>Warning: Rejecting will notify the member. Ensure you provide a clear reason in the notes if the proof is insufficient or fraudulent.</p>
              </div>
            </div>
          ) : (
            <div className="card h-full flex flex-col items-center justify-center text-center p-20 opacity-40">
              <ClipboardCheck size={64} className="mb-4" />
              <h3 className="text-xl">Select a submission to review</h3>
              <p className="max-w-xs mx-auto mt-2">Proofs waiting in the queue will appear here for verification.</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
