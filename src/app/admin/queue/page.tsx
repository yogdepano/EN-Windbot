'use client';

import { useState, useEffect } from 'react';
import { Check, X, Eye, ExternalLink, ShieldAlert, History, ClipboardCheck, Loader } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export default function ApprovalQueue() {
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [queue, setQueue] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [adminNotes, setAdminNotes] = useState('');

  const fetchQueue = async () => {
    const { data, error } = await supabase
      .from('check_ins')
      .select('*, profiles:profiles!check_ins_user_id_fkey(username, in_game_name), activities(name, points, reference_image_path)')
      .eq('status', 'pending')
      .order('created_at', { ascending: true });

    if (!error && data) {
      setQueue(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchQueue();
  }, []);

  const handleAction = async (id: string, action: 'approved' | 'rejected') => {
    setProcessingId(id);
    
    // For approval, we need to call the RPC to adjust points. We can do it in two steps.
    // However, the best way securely is via a database trigger or RPC. We have 'adjust_gp' RPC.
    
    const item = queue.find(q => q.id === id);
    if (!item) return;

    if (action === 'approved') {
      const { error: rpcError } = await supabase.rpc('adjust_gp', { 
        p_user_id: item.user_id, 
        p_amount: item.activities.points 
      });
      if (rpcError) console.error(rpcError);
    }

    const { error } = await supabase
      .from('check_ins')
      .update({ 
        status: action,
        admin_notes: adminNotes || null,
        reviewed_at: new Date().toISOString()
      })
      .eq('id', id);

    if (!error) {
      setQueue(q => q.filter(item => item.id !== id));
      if (selectedItem?.id === id) {
        setSelectedItem(null);
        setAdminNotes('');
      }
    }
    
    setProcessingId(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader className="animate-spin text-primary w-8 h-8" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl mb-1">Approval Queue</h2>
          <p className="text-text-muted">Review and verify activity proofs from guild members.</p>
        </div>
        <div className="flex bg-surface-alt border border-white/5 rounded-lg p-1">
          <button className="px-4 py-1 text-xs font-bold bg-primary text-black rounded">Pending ({queue.length})</button>
        </div>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* List */}
        <section className="xl:col-span-1 card h-fit space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-widest text-text-muted mb-6">Submissions</h3>
          {queue.length === 0 ? (
            <p className="text-text-muted text-center py-8">No pending check-ins.</p>
          ) : (
            queue.map((item) => (
              <div 
                key={item.id}
                onClick={() => { setSelectedItem(item); setAdminNotes(''); }}
                className={`p-4 rounded-xl border transition-all cursor-pointer ${
                  selectedItem?.id === item.id 
                    ? 'bg-primary/5 border-primary shadow-lg shadow-primary/10' 
                    : 'bg-white/5 border-transparent hover:border-white/10'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-bold">{item.profiles?.username || 'Unknown User'}</p>
                    <p className="text-xs text-primary font-medium">{item.profiles?.in_game_name}</p>
                  </div>
                  <span className="text-[10px] text-text-muted font-mono">{new Date(item.created_at).toLocaleDateString()}</span>
                </div>
                <p className="text-sm text-text-main font-medium">{item.activities?.name}</p>
                <div className="mt-3 flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 bg-white/10 rounded">Pending</span>
                  <span className="text-[10px] font-bold text-primary">+{item.activities?.points} GP</span>
                </div>
              </div>
            ))
          )}
        </section>

        {/* Review Area */}
        <section className="xl:col-span-2 space-y-6">
          {selectedItem ? (
            <div className="card space-y-8 animate-fade-in">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xl uppercase">
                    {(selectedItem.profiles?.username || 'U')[0]}
                  </div>
                  <div>
                    <h3 className="text-xl">{selectedItem.profiles?.username}</h3>
                    <p className="text-sm text-text-muted">Submitting for <span className="text-text-main font-bold">{selectedItem.activities?.name}</span></p>
                  </div>
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
                    <img src={selectedItem.screenshot_url} alt="Proof" className="w-full h-full object-contain" />
                    <a href={selectedItem.screenshot_url} target="_blank" rel="noreferrer" className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 transition-opacity text-white">
                      <ExternalLink size={20} />
                      <span className="text-sm font-bold">Open Full Size</span>
                    </a>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted flex items-center gap-2">
                    <History size={12} />
                    Reference Guide
                  </label>
                  <div className="aspect-video bg-black/40 rounded-xl overflow-hidden border border-white/5 opacity-60">
                    {selectedItem.activities?.reference_image_path ? (
                      <img src={selectedItem.activities.reference_image_path} alt="Reference" className="w-full h-full object-contain grayscale" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-text-muted text-sm">No reference image</div>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-6 border-t border-white/5 space-y-4">
                <textarea 
                  placeholder="Add optional notes for the member (e.g. why it was rejected)..."
                  className="w-full bg-surface-hover border border-white/10 rounded-lg p-4 text-sm text-text-main outline-none focus:border-primary min-h-[100px] transition-colors"
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                ></textarea>
                
                <div className="flex gap-4">
                  <button 
                    onClick={() => handleAction(selectedItem.id, 'approved')}
                    disabled={processingId !== null}
                    className="btn-primary flex-1 py-4 flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {processingId === selectedItem.id ? <Loader className="animate-spin w-5 h-5" /> : <Check size={20} />}
                    Approve and Award {selectedItem.activities?.points} GP
                  </button>
                  <button 
                    onClick={() => handleAction(selectedItem.id, 'rejected')}
                    disabled={processingId !== null}
                    className="btn-secondary border-error text-error hover:bg-error/10 px-8 disabled:opacity-50"
                  >
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
