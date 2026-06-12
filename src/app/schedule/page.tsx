'use client';

import { useState, useEffect } from 'react';
import { Calendar, Clock, ChevronRight, Loader, Info } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default function ScheduleListPage() {
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {events.map(event => (
            <div key={event.id} className="card p-6 flex flex-col justify-between space-y-6 hover:border-primary/30 transition-all group">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-primary font-bold uppercase tracking-widest bg-primary/10 px-2.5 py-1 rounded">Active Poll</span>
                </div>
                <h3 className="text-2xl font-black tracking-tight text-white uppercase group-hover:text-primary transition-colors">
                  {event.title}
                </h3>
                <div className="flex items-center gap-4 text-xs text-text-muted">
                  <span className="flex items-center gap-1.5">
                    <Clock size={14} />
                    {event.duration_minutes} Minutes
                  </span>
                  <span>•</span>
                  <span>Created <span className="text-white">{new Date(event.created_at).toLocaleDateString()}</span></span>
                </div>
              </div>

              <div>
                <Link
                  href={`/schedule/${event.id}`}
                  className="btn-primary w-full py-2.5 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2"
                >
                  Enter Availability
                  <ChevronRight size={14} />
                </Link>
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
