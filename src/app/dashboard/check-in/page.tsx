'use client';

import { useState, useEffect } from 'react';
import { Upload, HelpCircle, X, CheckCircle, Info, AlertCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export default function CheckInPage() {
  const [selectedActivity, setSelectedActivity] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activities, setActivities] = useState<any[]>([]);

  useEffect(() => {
    supabase.from('activities').select('*').eq('is_active', true).then(({ data }) => {
      if (data) setActivities(data);
    });
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedActivity || !file) return;

    setIsSubmitting(true);
    setError(null);

    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not logged in');

      // Get user profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('discord_id', user.user_metadata?.provider_id || user.id)
        .single();

      const profileId = profile?.id || user.id;

      // Upload screenshot to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${profileId}/${Date.now()}.${fileExt}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('proofs')
        .upload(fileName, file);

      if (uploadError) throw new Error(`Upload failed: ${uploadError.message}`);

      const { data: { publicUrl } } = supabase.storage
        .from('proofs')
        .getPublicUrl(fileName);

      // Calculate week start (Monday)
      const weekStart = new Date();
      weekStart.setDate(weekStart.getDate() - ((weekStart.getDay() + 6) % 7));
      const weekStr = weekStart.toISOString().split('T')[0];

      // Submit check-in
      const { error: checkinError } = await supabase.from('check_ins').insert({
        user_id: profileId,
        activity_id: selectedActivity,
        screenshot_url: publicUrl,
        week_start_date: weekStr,
        status: 'pending'
      });

      if (checkinError) throw new Error(checkinError.message);

      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
        <div style={{ width: 80, height: 80, background: 'var(--success-10)', color: 'var(--success)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <CheckCircle size={48} />
        </div>
        <h2 style={{ fontSize: '2rem' }}>Submission Received!</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>
          Your proof has been submitted and is pending admin approval. 
          You'll be notified once your GP has been awarded.
        </p>
        <button
          onClick={() => { setSubmitted(false); setFile(null); setPreview(null); setSelectedActivity(''); }}
          className="btn-secondary"
        >
          Submit Another
        </button>
      </div>
    );
  }

  const currentActivity = activities.find(a => a.id === selectedActivity);

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <header>
        <h2 style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>Submit Activity Proof</h2>
        <p style={{ color: 'var(--text-muted)' }}>Select an activity and upload a screenshot to claim your GP.</p>
      </header>

      {error && (
        <div style={{ display: 'flex', gap: '0.75rem', padding: '1rem', background: 'var(--error-10)', border: '1px solid var(--error)', borderRadius: 8, color: 'var(--error)' }}>
          <AlertCircle size={20} style={{ flexShrink: 0 }} />
          <p>{error}</p>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        {/* Form */}
        <section className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)' }}>Activity</label>
              <select
                value={selectedActivity}
                onChange={(e) => setSelectedActivity(e.target.value)}
                style={{ width: '100%', background: 'var(--surface-hover)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '0.75rem', color: 'var(--text-main)', outline: 'none' }}
                required
              >
                <option value="">Select an activity...</option>
                {activities.map((a) => (
                  <option key={a.id} value={a.id}>{a.name} (+{a.points} GP)</option>
                ))}
              </select>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)' }}>Screenshot Proof</label>
              <div
                style={{
                  border: `2px dashed ${preview ? 'var(--success)' : 'rgba(255,255,255,0.1)'}`,
                  borderRadius: 12,
                  padding: '2rem',
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '1rem',
                  background: preview ? 'var(--success-10)' : 'transparent',
                  transition: 'all 0.3s ease'
                }}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  const droppedFile = e.dataTransfer.files[0];
                  if (droppedFile) {
                    setFile(droppedFile);
                    const reader = new FileReader();
                    reader.onloadend = () => setPreview(reader.result as string);
                    reader.readAsDataURL(droppedFile);
                  }
                }}
              >
                {preview ? (
                  <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', borderRadius: 8, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
                    <img src={preview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <button
                      type="button"
                      onClick={() => { setFile(null); setPreview(null); }}
                      style={{ position: 'absolute', top: 8, right: 8, padding: 4, background: 'rgba(0,0,0,0.6)', borderRadius: '50%', color: 'white' }}
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <>
                    <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '50%', color: 'var(--text-muted)' }}>
                      <Upload size={32} />
                    </div>
                    <div>
                      <p style={{ fontWeight: 600 }}>Click to upload or drag and drop</p>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 4 }}>PNG, JPG or WebP (max 10MB)</p>
                    </div>
                    <input type="file" style={{ display: 'none' }} id="file-upload" accept="image/*" onChange={handleFileChange} />
                    <label htmlFor="file-upload" className="btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.8rem', cursor: 'pointer' }}>Browse Files</label>
                  </>
                )}
              </div>
            </div>

            <button
              type="submit"
              className="btn-primary"
              style={{ width: '100%', padding: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', opacity: (!selectedActivity || !file || isSubmitting) ? 0.5 : 1, cursor: (!selectedActivity || !file || isSubmitting) ? 'not-allowed' : 'pointer' }}
              disabled={!selectedActivity || !file || isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div style={{ width: 20, height: 20, border: '2px solid rgba(0,0,0,0.2)', borderTop: '2px solid #000', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                  Submitting...
                </>
              ) : 'Submit for Review'}
            </button>
          </form>

          <div style={{ display: 'flex', gap: '0.75rem', padding: '1rem', background: 'var(--secondary-10)', border: '1px solid rgba(139,92,246,0.2)', borderRadius: 8, fontSize: '0.85rem', color: 'var(--secondary)' }}>
            <Info size={20} style={{ flexShrink: 0 }} />
            <p>Admin approval is required before GP is awarded.</p>
          </div>
        </section>

        {/* Reference */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <label style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)' }}>Reference Guide</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--primary)', fontSize: '0.75rem', fontWeight: 700 }}>
              <HelpCircle size={14} />
              <span>Matching Example</span>
            </div>
          </div>

          <div className="card" style={{ height: 400, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'var(--surface-alt)', overflow: 'hidden' }}>
            {currentActivity?.reference_image_path ? (
              <div style={{ width: '100%', height: '100%', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>Your screenshot should look similar to this:</p>
                <div style={{ flex: 1, borderRadius: 8, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <img src={currentActivity.reference_image_path} alt="Reference" style={{ width: '100%', height: '100%', objectFit: 'contain', background: 'rgba(0,0,0,0.2)' }} />
                </div>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '2rem', opacity: 0.4 }}>
                <HelpCircle size={48} style={{ margin: '0 auto 1rem' }} />
                <p>Select an activity to see the required screenshot format.</p>
              </div>
            )}
          </div>

          <div style={{ padding: '1rem', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 8, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            <p style={{ fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.5rem' }}>Submission Tips:</p>
            <ul style={{ listStyle: 'disc', marginLeft: '1rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              <li>Ensure your in-game name is visible.</li>
              <li>Show the relevant UI element or event completion message.</li>
              <li>Don't crop the image too tightly.</li>
            </ul>
          </div>
        </section>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
