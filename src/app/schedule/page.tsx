'use client';

import { useState, useEffect } from 'react';
import { Calendar, Clock, ChevronRight, Loader, Info, Trash } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';

export default function ScheduleListPage() {
  const { user, isAdmin } = useAuth();
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    async function fetchEvents() {
      const { data } = await supabase
        .from('scheduling_events')
        .select('*')
        .order('created_at', { ascending: false });

      if (data) setEvents(data);
      setLoading(false);
    }
    fetchEvents();
  }, []);

  const handleDelete = async (eventId: string) => {
    const ok = confirm("Are you sure you want to delete this scheduling poll? This will permanently delete all submitted availabilities for this event.");
    if (!ok) return;

    const { error } = await supabase
      .from('scheduling_events')
      .delete()
      .eq('id', eventId);

    if (error) {
      alert(`Error deleting event: ${error.message}`);
    } else {
      setEvents(events.filter(e => e.id !== eventId));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader className="animate-spin text-primary" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-12 max-w-4xl mx-auto px-4">
      <header className="text-center space-y-4">
        <h1 className="text-5xl font-black italic tracking-tighter flex items-center justify-center gap-4">
          <Calendar className="text-secondary" size={48} />
          GUILD SCHEDULER
        </h1>
        <p className="text-text-muted">Coordinate and find the best times for guild raids, wars, and meetings.</p>
      </header>

      {events.length > 0 ? (
        <div className="card divide-y divide-white/5 p-0 overflow-hidden shadow-2xl">
          {events.map(event => (
            <div key={event.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-6 hover:bg-white/5 transition-all group gap-4">
              <div className="flex items-center gap-5">
                <div className="w-12 h-12 rounded-xl bg-primary-10 border border-primary-20 text-primary flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <Calendar size={22} />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg md:text-xl font-bold tracking-tight text-white uppercase group-hover:text-primary transition-colors">
                    {event.title}
                  </h3>
                  <div className="flex items-center gap-3 text-xs text-text-muted">
                    <span className="flex items-center gap-1.5">
                      <Clock size={13} />
                      {event.duration_minutes} Mins
                    </span>
                    <span>•</span>
                    <span>Created <span className="text-white">{new Date(event.created_at).toLocaleDateString()}</span></span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 self-end sm:self-auto w-full sm:w-auto justify-end">
                <Link
                  href={`/schedule/${event.id}`}
                  className="btn-primary py-2 px-5 text-xs font-bold uppercase tracking-widest flex items-center gap-2"
                >
                  Enter Availability
                  <ChevronRight size={14} />
                </Link>

                {(isAdmin || (user && user.id === event.creator_id)) && (
                  <button
                    onClick={() => handleDelete(event.id)}
                    className="p-2.5 rounded-lg border border-red-500/20 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all flex items-center justify-center"
                    title="Delete Poll"
                  >
                    <Trash size={16} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card p-12 text-center max-w-md mx-auto space-y-6">
          <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-full flex items-center justify-center mx-auto text-primary">
            <Info size={28} />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-white uppercase tracking-wider">No Active Polls</h3>
            <p className="text-xs text-text-muted leading-relaxed">
              There are currently no active scheduling events. You can create a new poll by running the <strong className="text-primary">`/schedule`</strong> command in Discord!
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
