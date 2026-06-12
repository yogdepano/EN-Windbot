'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Calendar, Clock, Globe, Check, AlertCircle } from 'lucide-react';
import { DiscordSDK } from '@discord/embedded-app-sdk';

interface EventData {
  id: string;
  title: string;
  duration_minutes: number;
}

export default function SchedulePage() {
  const params = useParams();
  const eventId = params.eventId as string;
  const router = useRouter();

  const [event, setEvent] = useState<EventData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [discordUser, setDiscordUser] = useState<{ username: string; id: string } | null>(null);
  
  // Custom manual name fallback if not running in Discord iframe
  const [manualName, setManualName] = useState('');
  
  // Selected Date and Time Slots
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  // Stores date string (YYYY-MM-DD) -> Array of hour numbers (e.g. 9 for 9:00 AM, 14.5 for 2:30 PM)
  const [availabilities, setAvailabilities] = useState<{ [dateKey: string]: number[] }>({});
  const [timezone, setTimezone] = useState('');

  // Local state for calendar navigation
  const [currentMonth, setCurrentMonth] = useState(new Date());

  useEffect(() => {
    // Detect timezone
    setTimezone(Intl.DateTimeFormat().resolvedOptions().timeZone);

    // Load Event details
    async function loadEvent() {
      const { data, error } = await supabase
        .from('scheduling_events')
        .select('id, title, duration_minutes')
        .eq('id', eventId)
        .single();

      if (error || !data) {
        setError('Scheduling event not found.');
      } else {
        setEvent(data);
      }
      setLoading(false);
    }
    loadEvent();

    // Setup Discord SDK if inside Discord Client
    async function setupDiscord() {
      const clientId = process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID;
      if (!clientId) return;

      try {
        const discordSdk = new DiscordSDK(clientId);
        await discordSdk.ready();
        
        const auth = await discordSdk.commands.authorize({
          client_id: clientId,
          response_type: 'code',
          state: '',
          prompt: 'none',
          scope: ['identify'],
        });

        // Exchange code for token on your backend if needed, or get user info directly
        // For standard embeds, discordSdk can fetch user profile
        if (discordSdk.instanceId) {
          // If in iframe, get user profile
          const user = discordSdk.ready; // SDK exposes user state or we fall back
        }
      } catch (err) {
        console.log('Not running inside Discord or SDK failed to load, using web preview mode.');
      }
    }
    setupDiscord();
  }, [eventId]);

  const handleTimeToggle = (hour: number) => {
    const dateKey = selectedDate.toISOString().split('T')[0];
    const currentSlots = availabilities[dateKey] || [];
    
    let newSlots;
    if (currentSlots.includes(hour)) {
      newSlots = currentSlots.filter(h => h !== hour);
    } else {
      newSlots = [...currentSlots, hour].sort((a, b) => a - b);
    }

    setAvailabilities({
      ...availabilities,
      [dateKey]: newSlots
    });
  };

  const handleSubmit = async () => {
    const username = discordUser?.username || manualName.trim();
    const userId = discordUser?.id || `guest_${Math.random().toString(36).substr(2, 9)}`;

    if (!username) {
      alert('Please enter your name.');
      return;
    }

    // Convert selections to timezone-aware UTC timestamps
    const rowsToInsert: any[] = [];
    Object.entries(availabilities).forEach(([dateStr, hours]) => {
      hours.forEach(hour => {
        // Construct local date time
        const localDate = new Date(dateStr);
        const integerHours = Math.floor(hour);
        const minutes = (hour % 1) * 60;
        localDate.setHours(integerHours, minutes, 0, 0);

        // Convert to UTC
        const startTime = localDate.toISOString();
        const endTime = new Date(localDate.getTime() + 30 * 60 * 1000).toISOString(); // 30-min increments

        rowsToInsert.push({
          event_id: eventId,
          discord_id: userId,
          username: username,
          start_time: startTime,
          end_time: endTime
        });
      });
    });

    if (rowsToInsert.length === 0) {
      alert('Please select at least one available time slot.');
      return;
    }

    setLoading(true);
    const { error } = await supabase.from('member_availabilities').insert(rowsToInsert);
    setLoading(false);

    if (error) {
      alert(`Error saving availabilities: ${error.message}`);
    } else {
      alert('Your availabilities have been successfully submitted! You can close this screen.');
    }
  };

  // Generate days for the visual month calendar
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();
    
    const days = [];
    // Pad previous month days
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }
    // Current month days
    for (let i = 1; i <= totalDays; i++) {
      days.push(new Date(year, month, i));
    }
    return days;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white font-sans">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white font-sans p-6">
        <AlertCircle size={48} className="text-red-500 mb-4" />
        <p className="text-xl font-semibold mb-2">{error || 'Event not found'}</p>
      </div>
    );
  }

  const days = getDaysInMonth(currentMonth);
  const timeSlots = [];
  // 30 minute intervals from 8:00 AM to 10:00 PM
  for (let hour = 8; hour <= 22; hour += 0.5) {
    timeSlots.push(hour);
  }

  const formatHour = (hour: number) => {
    const h = Math.floor(hour);
    const m = hour % 1 === 0 ? '00' : '30';
    const ampm = h >= 12 ? 'PM' : 'AM';
    const displayH = h % 12 === 0 ? 12 : h % 12;
    return `${displayH}:${m} ${ampm}`;
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans flex items-center justify-center p-4 lg:p-8 bg-gradient-to-br from-slate-950 via-purple-950/20 to-slate-950">
      
      {/* Background Glow */}
      <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-purple-600/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-[150px] pointer-events-none"></div>

      <div className="w-full max-w-4xl bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6 lg:p-8 shadow-2xl relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Left Column: Calendar Date Selector */}
        <div>
          <div className="mb-6">
            <span className="text-xs uppercase tracking-wider text-purple-400 font-semibold">Scheduler</span>
            <h1 className="text-2xl font-bold mt-1 text-white">{event.title}</h1>
            <p className="text-sm text-slate-400 mt-1 flex items-center gap-2">
              <Clock size={14} /> {event.duration_minutes} Minutes Duration
            </p>
          </div>

          {/* User Profile / Custom Name Input */}
          {!discordUser && (
            <div className="mb-6 p-4 rounded-xl bg-white/5 border border-white/5">
              <label className="block text-xs text-slate-400 uppercase tracking-wider mb-2 font-semibold">Your Name</label>
              <input
                type="text"
                placeholder="Enter your name"
                value={manualName}
                onChange={(e) => setManualName(e.target.value)}
                className="w-full bg-slate-950 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500"
              />
            </div>
          )}

          {/* Month Selector header */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-slate-300">
              {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
            </h2>
            <div className="flex gap-1">
              <button 
                onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() - 1)))}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
              >
                &larr;
              </button>
              <button 
                onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() + 1)))}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
              >
                &rarr;
              </button>
            </div>
          </div>

          {/* Weekday labels */}
          <div className="grid grid-cols-7 gap-1 text-center text-[10px] uppercase font-semibold text-slate-400 mb-2">
            <div>Su</div><div>Mo</div><div>Tu</div><div>We</div><div>Th</div><div>Fr</div><div>Sa</div>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1.5">
            {days.map((day, idx) => {
              if (!day) return <div key={`pad-${idx}`} className="h-10"></div>;
              
              const isSelected = selectedDate.toDateString() === day.toDateString();
              const dateKey = day.toISOString().split('T')[0];
              const hasSlots = (availabilities[dateKey] || []).length > 0;

              return (
                <button
                  key={day.toISOString()}
                  onClick={() => setSelectedDate(day)}
                  className={`h-10 rounded-xl text-xs flex flex-col items-center justify-center relative transition-all ${
                    isSelected 
                      ? 'bg-purple-600 text-white font-semibold' 
                      : 'bg-white/5 hover:bg-white/10 text-slate-300'
                  }`}
                >
                  {day.getDate()}
                  {hasSlots && !isSelected && (
                    <span className="absolute bottom-1 w-1 h-1 bg-purple-400 rounded-full"></span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="mt-6 flex items-center gap-2 text-xs text-slate-400 bg-white/5 p-3 rounded-xl border border-white/5">
            <Globe size={14} className="text-purple-400" />
            <span>Showing slots in your local timezone: <strong>{timezone}</strong></span>
          </div>
        </div>

        {/* Right Column: Time Slot Selector */}
        <div className="flex flex-col h-full border-t md:border-t-0 md:border-l border-white/10 pt-6 md:pt-0 md:pl-8">
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-slate-300 flex items-center gap-2">
              <Calendar size={16} className="text-purple-400" />
              {selectedDate.toLocaleDateString('default', { weekday: 'long', month: 'short', day: 'numeric' })}
            </h3>
            <p className="text-xs text-slate-400 mt-1">Select all times you are available to join.</p>
          </div>

          {/* Time Slots Scrolling Grid */}
          <div className="grid grid-cols-2 gap-2 max-h-[320px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
            {timeSlots.map(hour => {
              const dateKey = selectedDate.toISOString().split('T')[0];
              const isSelected = (availabilities[dateKey] || []).includes(hour);

              return (
                <button
                  key={hour}
                  onClick={() => handleTimeToggle(hour)}
                  className={`p-2.5 rounded-xl text-xs flex items-center justify-between border transition-all ${
                    isSelected 
                      ? 'bg-purple-600/20 border-purple-500 text-white font-semibold' 
                      : 'bg-slate-950/40 border-white/5 text-slate-400 hover:border-white/10 hover:text-white'
                  }`}
                >
                  {formatHour(hour)}
                  {isSelected && <Check size={14} className="text-purple-400" />}
                </button>
              );
            })}
          </div>

          {/* Submit Button */}
          <div className="mt-auto pt-6">
            <button
              onClick={handleSubmit}
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-sm font-semibold py-3 px-4 rounded-xl shadow-lg shadow-purple-950/20 transition-all active:scale-[0.98]"
            >
              Confirm Availability
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
