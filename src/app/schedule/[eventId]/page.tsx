'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Calendar, Clock, Globe, Check, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';

const getLocalDateString = (d: Date) => {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

interface EventData {
  id: string;
  title: string;
  duration_minutes: number;
}

interface DayAvailability {
  enabled: boolean;
  startTime: number;
  endTime: number;
}

export default function SchedulePage() {
  const params = useParams();
  const eventId = params.eventId as string;

  const [event, setEvent] = useState<EventData | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [manualName, setManualName] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [availabilities, setAvailabilities] = useState<{ [dateKey: string]: DayAvailability }>({});
  const [timezone, setTimezone] = useState('');
  const [currentMonth, setCurrentMonth] = useState(new Date());

  useEffect(() => {
    setTimezone(Intl.DateTimeFormat().resolvedOptions().timeZone);

    const savedName = localStorage.getItem('scheduler_username');
    if (savedName) {
      setManualName(savedName);
    }

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
  }, [eventId]);

  // Automatically fetch existing availability when username is set/typed
  useEffect(() => {
    const username = manualName.trim();
    if (!username || !eventId) {
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      const discordId = `guest_${username.toLowerCase().replace(/\s+/g, '_')}`;
      const { data, error } = await supabase
        .from('member_availabilities')
        .select('start_time, end_time')
        .eq('event_id', eventId)
        .eq('discord_id', discordId);

      if (error) {
        console.error('Error fetching existing availability:', error);
        return;
      }

      if (data && data.length > 0) {
        const loadedAvailabilities: { [dateKey: string]: DayAvailability } = {};
        data.forEach(row => {
          const dStart = new Date(row.start_time);
          const dEnd = new Date(row.end_time);
          const dateKey = getLocalDateString(dStart);
          
          const startHour = dStart.getHours() + (dStart.getMinutes() === 30 ? 0.5 : 0);
          const endHour = dEnd.getHours() + (dEnd.getMinutes() === 30 ? 0.5 : 0);

          if (loadedAvailabilities[dateKey]) {
            loadedAvailabilities[dateKey].startTime = Math.min(loadedAvailabilities[dateKey].startTime, startHour);
            loadedAvailabilities[dateKey].endTime = Math.max(loadedAvailabilities[dateKey].endTime, endHour);
          } else {
            loadedAvailabilities[dateKey] = {
              enabled: true,
              startTime: startHour,
              endTime: endHour
            };
          }
        });

        setAvailabilities(loadedAvailabilities);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [manualName, eventId]);

  const handleStartChange = (newStart: number) => {
    const dk = getLocalDateString(selectedDate);
    const current = availabilities[dk] || { enabled: true, startTime: 19, endTime: 22 };
    let newEnd = current.endTime;
    if (newEnd <= newStart) {
      newEnd = Math.min(newStart + 1, 24);
    }
    setAvailabilities({
      ...availabilities,
      [dk]: {
        ...current,
        startTime: newStart,
        endTime: newEnd
      }
    });
  };

  const handleEndChange = (newEnd: number) => {
    const dk = getLocalDateString(selectedDate);
    const current = availabilities[dk] || { enabled: true, startTime: 19, endTime: 22 };
    setAvailabilities({
      ...availabilities,
      [dk]: {
        ...current,
        endTime: newEnd
      }
    });
  };

  const handleEnabledToggle = () => {
    const dk = getLocalDateString(selectedDate);
    const current = availabilities[dk];
    if (current?.enabled) {
      setAvailabilities({
        ...availabilities,
        [dk]: {
          ...current,
          enabled: false
        }
      });
    } else {
      setAvailabilities({
        ...availabilities,
        [dk]: {
          enabled: true,
          startTime: current?.startTime || 19,
          endTime: current?.endTime || 22
        }
      });
    }
  };

  const handleSubmit = async () => {
    const username = manualName.trim();
    if (!username) { alert('Please enter your name.'); return; }

    const rows: any[] = [];
    Object.entries(availabilities).forEach(([dateStr, av]) => {
      if (!av.enabled) return;

      const [year, month, day] = dateStr.split('-').map(Number);
      
      const dStart = new Date(year, month - 1, day);
      dStart.setHours(Math.floor(av.startTime), av.startTime % 1 === 0 ? 0 : 30, 0, 0);

      const dEnd = new Date(year, month - 1, day);
      dEnd.setHours(Math.floor(av.endTime), av.endTime % 1 === 0 ? 0 : 30, 0, 0);

      rows.push({
        event_id: eventId,
        discord_id: `guest_${username.toLowerCase().replace(/\s+/g, '_')}`,
        username,
        start_time: dStart.toISOString(),
        end_time: dEnd.toISOString()
      });
    });

    const discordId = `guest_${username.toLowerCase().replace(/\s+/g, '_')}`;

    if (rows.length === 0) {
      const confirmClear = confirm("You have no time slots selected. Do you want to clear your previously submitted availability?");
      if (!confirmClear) return;

      setSubmitting(true);
      const { error: deleteError } = await supabase
        .from('member_availabilities')
        .delete()
        .eq('event_id', eventId)
        .eq('discord_id', discordId);

      setSubmitting(false);

      if (deleteError) {
        alert(`Error clearing availability: ${deleteError.message}`);
      } else {
        localStorage.setItem('scheduler_username', username);
        setSubmitted(true);
      }
      return;
    }

    setSubmitting(true);

    // 1. Delete previous slots
    const { error: deleteError } = await supabase
      .from('member_availabilities')
      .delete()
      .eq('event_id', eventId)
      .eq('discord_id', discordId);

    if (deleteError) {
      setSubmitting(false);
      alert(`Error updating availability: ${deleteError.message}`);
      return;
    }

    // 2. Insert new slots
    const { error: insertError } = await supabase.from('member_availabilities').insert(rows);
    setSubmitting(false);

    if (insertError) {
      alert(`Error saving availability: ${insertError.message}`);
    } else {
      localStorage.setItem('scheduler_username', username);
      setSubmitted(true);
    }
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();
    const days: (Date | null)[] = [];
    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let i = 1; i <= totalDays; i++) days.push(new Date(year, month, i));
    return days;
  };

  const formatHour = (hour: number) => {
    if (hour === 24) return '12:00 AM (Next Day)';
    const h = Math.floor(hour);
    const m = hour % 1 === 0 ? '00' : '30';
    const ampm = h >= 12 ? 'PM' : 'AM';
    const displayH = h % 12 === 0 ? 12 : h % 12;
    return `${displayH}:${m} ${ampm}`;
  };

  const prevMonth = () => {
    const d = new Date(currentMonth);
    d.setMonth(d.getMonth() - 1);
    setCurrentMonth(d);
  };

  const nextMonth = () => {
    const d = new Date(currentMonth);
    d.setMonth(d.getMonth() + 1);
    setCurrentMonth(d);
  };

  const totalSelectedSlots = Object.values(availabilities)
    .filter(a => a.enabled)
    .reduce((acc, a) => acc + (a.endTime - a.startTime) * 2, 0);

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner} />
        <p style={{ color: 'var(--text-muted)', marginTop: '1rem', fontFamily: 'var(--font-body)' }}>Loading event...</p>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div style={styles.loadingContainer}>
        <AlertCircle size={48} color="var(--error)" />
        <p style={{ color: 'var(--text-muted)', marginTop: '1rem' }}>{error || 'Event not found'}</p>
      </div>
    );
  }

  if (submitted) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.successIcon}>
          <Check size={40} color="var(--primary)" />
        </div>
        <h2 style={{ ...styles.successTitle }}>
          {totalSelectedSlots === 0 ? 'Availability Cleared!' : 'Availability Submitted!'}
        </h2>
        <p style={{ color: 'var(--text-muted)', textAlign: 'center', maxWidth: 320 }}>
          {totalSelectedSlots === 0 ? (
            <>Your availability for <strong style={{ color: 'var(--primary)' }}>{event.title}</strong> has been cleared. You can close this window.</>
          ) : (
            <>Your availability for <strong style={{ color: 'var(--primary)' }}>{event.title}</strong> has been recorded. You can close this window.</>
          )}
        </p>
      </div>
    );
  }

  const days = getDaysInMonth(currentMonth);
  const selectedDateKey = getLocalDateString(selectedDate);
  const currentAvail = availabilities[selectedDateKey];

  const startHourOptions: number[] = [];
  for (let h = 6; h <= 23.5; h += 0.5) startHourOptions.push(h);

  const endHourOptions: number[] = [];
  const currentStart = currentAvail?.startTime ?? 19;
  for (let h = currentStart + 0.5; h <= 24; h += 0.5) endHourOptions.push(h);

  return (
    <div style={styles.page}>
      {/* Background glows */}
      <div style={{ ...styles.glow, top: '10%', left: '15%', background: 'rgba(212,175,55,0.06)' }} />
      <div style={{ ...styles.glow, bottom: '10%', right: '10%', background: 'rgba(139,92,246,0.08)' }} />

      <div style={styles.card}>

        {/* ── Header ── */}
        <div style={styles.header}>
          <span style={styles.badge}>SCHEDULER</span>
          <h1 style={styles.title}>{event.title}</h1>
          <div style={styles.metaRow}>
            <Clock size={14} color="var(--text-muted)" />
            <span style={styles.metaText}>{event.duration_minutes} minute session</span>
            <span style={styles.dot} />
            <Globe size={14} color="var(--text-muted)" />
            <span style={styles.metaText}>{timezone}</span>
          </div>
        </div>

        <div style={styles.divider} />

        {/* ── Name Input ── */}
        <div style={styles.section}>
          <label style={styles.label}>YOUR NAME</label>
          <input
            type="text"
            placeholder="Enter your in-game name or Discord name"
            value={manualName}
            onChange={e => setManualName(e.target.value)}
            style={styles.input}
            onFocus={e => { (e.target as HTMLInputElement).style.borderColor = 'var(--primary)'; (e.target as HTMLInputElement).style.boxShadow = '0 0 0 3px var(--primary-10)'; }}
            onBlur={e => { (e.target as HTMLInputElement).style.borderColor = 'var(--border)'; (e.target as HTMLInputElement).style.boxShadow = 'none'; }}
          />
        </div>

        <div style={styles.divider} />

        {/* ── Two columns: Calendar | Start/End selection ── */}
        <div style={styles.columns}>

          {/* LEFT: Month calendar */}
          <div style={styles.calendarCol}>
            {/* Month nav */}
            <div style={styles.monthNav}>
              <button onClick={prevMonth} style={styles.navBtn}>
                <ChevronLeft size={16} />
              </button>
              <span style={styles.monthLabel}>
                {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
              </span>
              <button onClick={nextMonth} style={styles.navBtn}>
                <ChevronRight size={16} />
              </button>
            </div>

            {/* Weekday headers */}
            <div style={styles.weekRow}>
              {['Su','Mo','Tu','We','Th','Fr','Sa'].map(d => (
                <div key={d} style={styles.weekLabel}>{d}</div>
              ))}
            </div>

            {/* Days grid */}
            <div style={styles.daysGrid}>
              {days.map((day, idx) => {
                if (!day) return <div key={`pad-${idx}`} />;
                const isToday = day.toDateString() === new Date().toDateString();
                const isSelected = day.toDateString() === selectedDate.toDateString();
                const dk = getLocalDateString(day);
                const hasDot = availabilities[dk]?.enabled;

                return (
                  <button
                    key={day.toISOString()}
                    onClick={() => setSelectedDate(day)}
                    style={{
                      ...styles.dayBtn,
                      ...(isSelected ? styles.daySelected : isToday ? styles.dayToday : {})
                    }}
                    onMouseEnter={e => {
                      if (!isSelected) (e.currentTarget as HTMLButtonElement).style.background = 'var(--surface-hover)';
                    }}
                    onMouseLeave={e => {
                      if (!isSelected) (e.currentTarget as HTMLButtonElement).style.background = 'var(--surface-alt)';
                    }}
                  >
                    {day.getDate()}
                    {hasDot && !isSelected && <span style={styles.dotIndicator} />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Vertical divider */}
          <div style={styles.colDivider} />

          {/* RIGHT: Start/End selection */}
          <div style={styles.timeCol}>
            <div style={styles.timeDateHeader}>
              <Calendar size={15} color="var(--primary)" />
              <span style={styles.timeDateLabel}>
                {selectedDate.toLocaleDateString('default', { weekday: 'long', month: 'long', day: 'numeric' })}
              </span>
            </div>
            <p style={styles.timeSubLabel}>Set the start and end times of your availability block.</p>

            {/* Toggle Button */}
            <button
              onClick={handleEnabledToggle}
              style={{
                ...styles.availToggleBtn,
                ...(currentAvail?.enabled ? styles.availToggleBtnActive : {})
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{
                  ...styles.checkbox,
                  ...(currentAvail?.enabled ? styles.checkboxChecked : {})
                }}>
                  {currentAvail?.enabled && <Check size={14} color="#000" />}
                </div>
                <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>
                  {currentAvail?.enabled ? 'I am available on this day' : 'I am NOT available on this day'}
                </span>
              </div>
            </button>

            {/* Selectors */}
            {currentAvail?.enabled ? (
              <div style={styles.selectorsContainer}>
                <div style={styles.selectorGroup}>
                  <label style={styles.selectorLabel}>START TIME</label>
                  <select
                    value={currentAvail.startTime}
                    onChange={e => handleStartChange(parseFloat(e.target.value))}
                    style={styles.selectInput}
                  >
                    {startHourOptions.map(h => (
                      <option key={h} value={h} style={styles.selectOption}>
                        {formatHour(h)}
                      </option>
                    ))}
                  </select>
                </div>

                <div style={styles.selectorGroup}>
                  <label style={styles.selectorLabel}>END TIME</label>
                  <select
                    value={currentAvail.endTime}
                    onChange={e => handleEndChange(parseFloat(e.target.value))}
                    style={styles.selectInput}
                  >
                    {endHourOptions.map(h => (
                      <option key={h} value={h} style={styles.selectOption}>
                        {formatHour(h)}
                      </option>
                    ))}
                  </select>
                </div>

                <div style={styles.durationPreview}>
                  <Clock size={14} color="var(--primary)" />
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Selected: <strong>{currentAvail.endTime - currentAvail.startTime} hours</strong> ({formatHour(currentAvail.startTime)} to {formatHour(currentAvail.endTime)})
                  </span>
                </div>
              </div>
            ) : (
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.5, border: '1px dashed var(--border)', borderRadius: 12, padding: '2rem' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textAlign: 'center' }}>Toggle "I am available on this day" to configure times.</span>
              </div>
            )}
          </div>
        </div>

        <div style={styles.divider} />

        {/* ── Footer ── */}
        <div style={styles.footer}>
          <span style={styles.slotCount}>
            {Object.keys(availabilities).filter(k => availabilities[k].enabled).length} day(s) selected
          </span>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            style={{ ...styles.submitBtn, ...(submitting ? { opacity: 0.6 } : {}) }}
            onMouseEnter={e => {
              if (!submitting) (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 30px var(--primary-glow)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 15px var(--primary-glow)';
            }}
          >
            {submitting ? 'Submitting...' : 'Confirm Availability'}
          </button>
        </div>

      </div>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem 1rem',
    background: 'var(--background)',
    position: 'relative',
    overflow: 'hidden',
  },
  glow: {
    position: 'absolute',
    width: 500,
    height: 500,
    borderRadius: '50%',
    filter: 'blur(120px)',
    pointerEvents: 'none',
    zIndex: 0,
  },
  card: {
    position: 'relative',
    zIndex: 1,
    width: '100%',
    maxWidth: 860,
    background: 'var(--glass-bg)',
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    border: '1px solid var(--glass-border)',
    borderRadius: 20,
    overflow: 'hidden',
    boxShadow: '0 24px 64px rgba(0,0,0,0.7)',
  },
  header: {
    padding: '2rem 2rem 1.5rem',
  },
  badge: {
    fontSize: '0.65rem',
    fontFamily: 'var(--font-subheading)',
    fontWeight: 700,
    letterSpacing: '0.15em',
    color: 'var(--primary)',
    textTransform: 'uppercase' as const,
    opacity: 0.8,
  },
  title: {
    fontFamily: 'var(--font-heading)',
    fontSize: '1.75rem',
    color: 'var(--primary)',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.06em',
    margin: '0.4rem 0 0.6rem',
  },
  metaRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
    flexWrap: 'wrap' as const,
  },
  metaText: {
    fontSize: '0.8rem',
    color: 'var(--text-muted)',
    fontFamily: 'var(--font-body)',
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: '50%',
    background: 'var(--text-muted)',
    opacity: 0.5,
  },
  divider: {
    height: 1,
    background: 'var(--border)',
    margin: '0',
  },
  section: {
    padding: '1.25rem 2rem',
  },
  label: {
    display: 'block',
    fontSize: '0.65rem',
    fontFamily: 'var(--font-subheading)',
    fontWeight: 700,
    letterSpacing: '0.12em',
    color: 'var(--text-muted)',
    textTransform: 'uppercase' as const,
    marginBottom: '0.5rem',
  },
  input: {
    width: '100%',
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 8,
    padding: '0.65rem 1rem',
    color: 'var(--text-main)',
    fontFamily: 'var(--font-body)',
    fontSize: '0.9rem',
    outline: 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s',
  },
  columns: {
    display: 'flex',
    flexDirection: 'row' as const,
    gap: 0,
  },
  calendarCol: {
    flex: '0 0 auto',
    width: 320,
    padding: '1.5rem 2rem',
  },
  colDivider: {
    width: 1,
    background: 'var(--border)',
    alignSelf: 'stretch',
  },
  timeCol: {
    flex: 1,
    padding: '1.5rem 2rem',
    display: 'flex',
    flexDirection: 'column' as const,
    minWidth: 0,
  },
  monthNav: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '1rem',
  },
  monthLabel: {
    fontFamily: 'var(--font-subheading)',
    fontWeight: 600,
    fontSize: '0.9rem',
    color: 'var(--text-main)',
  },
  navBtn: {
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 6,
    color: 'var(--text-muted)',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0.3rem',
    transition: 'all 0.2s',
  },
  weekRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 1fr)',
    textAlign: 'center' as const,
    marginBottom: '0.5rem',
  },
  weekLabel: {
    fontSize: '0.65rem',
    fontFamily: 'var(--font-subheading)',
    fontWeight: 700,
    letterSpacing: '0.08em',
    color: 'var(--text-muted)',
    textTransform: 'uppercase' as const,
    padding: '0.2rem 0',
  },
  daysGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 1fr)',
    gap: 4,
  },
  dayBtn: {
    aspectRatio: '1',
    background: 'var(--surface-alt)',
    border: '1px solid transparent',
    borderRadius: 8,
    color: 'var(--text-muted)',
    cursor: 'pointer',
    fontSize: '0.8rem',
    fontFamily: 'var(--font-body)',
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative' as const,
    transition: 'all 0.15s',
  },
  daySelected: {
    background: 'var(--primary-10)',
    border: '1px solid var(--primary)',
    color: 'var(--primary)',
    fontWeight: 700,
  },
  dayToday: {
    border: '1px solid rgba(212,175,55,0.3)',
    color: 'var(--text-main)',
  },
  dotIndicator: {
    position: 'absolute' as const,
    bottom: 4,
    width: 4,
    height: 4,
    borderRadius: '50%',
    background: 'var(--primary)',
    opacity: 0.8,
  },
  timeDateHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    marginBottom: '0.25rem',
  },
  timeDateLabel: {
    fontFamily: 'var(--font-subheading)',
    fontWeight: 600,
    fontSize: '0.9rem',
    color: 'var(--text-main)',
  },
  timeSubLabel: {
    fontSize: '0.75rem',
    color: 'var(--text-muted)',
    fontFamily: 'var(--font-body)',
    marginBottom: '1rem',
  },
  availToggleBtn: {
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 10,
    color: 'var(--text-muted)',
    padding: '1rem',
    cursor: 'pointer',
    textAlign: 'left' as const,
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    transition: 'all 0.15s',
    marginBottom: '1.5rem',
    outline: 'none',
  },
  availToggleBtnActive: {
    borderColor: 'var(--primary)',
    background: 'var(--primary-10)',
    color: 'var(--primary)',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    border: '1px solid var(--border)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'var(--surface-alt)',
    transition: 'all 0.15s',
  },
  checkboxChecked: {
    background: 'var(--primary)',
    borderColor: 'var(--primary)',
  },
  selectorsContainer: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '1.25rem',
    background: 'rgba(255, 255, 255, 0.02)',
    padding: '1.25rem',
    borderRadius: 12,
    border: '1px solid var(--border)',
  },
  selectorGroup: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0.4rem',
  },
  selectorLabel: {
    fontSize: '0.65rem',
    fontFamily: 'var(--font-subheading)',
    fontWeight: 700,
    letterSpacing: '0.1em',
    color: 'var(--text-muted)',
  },
  selectInput: {
    width: '100%',
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 8,
    padding: '0.65rem 0.75rem',
    color: 'var(--text-main)',
    fontFamily: 'var(--font-body)',
    fontSize: '0.9rem',
    outline: 'none',
    cursor: 'pointer',
    appearance: 'none' as const,
    backgroundImage: `url("data:image/svg+xml;utf8,<svg fill='gold' height='24' viewBox='0 0 24 24' width='24' xmlns='http://www.w3.org/2000/svg'><path d='M7 10l5 5 5-5z'/><path d='M0 0h24v24H0z' fill='none'/></svg>")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 8px center',
  },
  selectOption: {
    background: '#120c1f',
    color: 'var(--text-main)',
  },
  durationPreview: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    marginTop: '0.25rem',
  },
  footer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '1.25rem 2rem',
    flexWrap: 'wrap' as const,
    gap: '1rem',
  },
  slotCount: {
    fontSize: '0.8rem',
    color: 'var(--text-muted)',
    fontFamily: 'var(--font-body)',
  },
  submitBtn: {
    background: 'linear-gradient(135deg, #d4af37 0%, #b8962e 100%)',
    color: '#000',
    border: 'none',
    borderRadius: 8,
    padding: '0.7rem 1.75rem',
    fontFamily: 'var(--font-subheading)',
    fontWeight: 700,
    fontSize: '0.85rem',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.1em',
    cursor: 'pointer',
    boxShadow: '0 0 15px var(--primary-glow)',
    transition: 'box-shadow 0.2s, opacity 0.2s',
  },
  loadingContainer: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    background: 'var(--background)',
    gap: '0.75rem',
  },
  spinner: {
    width: 44,
    height: 44,
    borderRadius: '50%',
    border: '3px solid var(--surface-hover)',
    borderTopColor: 'var(--primary)',
    animation: 'spin 0.8s linear infinite',
  },
  successIcon: {
    width: 80,
    height: 80,
    borderRadius: '50%',
    background: 'var(--primary-10)',
    border: '1px solid var(--primary)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '1rem',
  },
  successTitle: {
    fontFamily: 'var(--font-heading)',
    color: 'var(--primary)',
    fontSize: '1.5rem',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.06em',
  },
};
