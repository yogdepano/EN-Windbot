'use client';

import { useState } from 'react';
import { Upload, HelpCircle, X, CheckCircle, Info } from 'lucide-react';

export default function CheckInPage() {
  const [selectedActivity, setSelectedActivity] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const activities = [
    { id: '1', name: 'Breaking Army (Saturday)', points: 5, ref: '/references/Breaking Army.png' },
    { id: '2', name: 'Breaking Army (Sunday)', points: 5, ref: '/references/Breaking Army.png' },
    { id: '3', name: 'Guild Heroes Realm', points: 5, ref: '/references/Guild Heroe\'s Realm.png' },
    { id: '4', name: 'Guild Party', points: 5, ref: '/references/Guild Party.png' },
    { id: '5', name: 'Guild War (Saturday)', points: 5, ref: '/references/Guild War.png' },
    { id: '6', name: 'Guild War (Sunday)', points: 5, ref: '/references/Guild War.png' },
    { id: '7', name: 'Reach 2,000 Weekly Activity', points: 10, ref: '/references/Weekly Activity Points.png' },
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedActivity || !file) return;
    
    setIsSubmitting(true);
    // Mock upload
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 2000);
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12 space-y-6">
        <div className="w-20 h-20 bg-success/10 text-success rounded-full flex items-center justify-center mx-auto">
          <CheckCircle size={48} />
        </div>
        <h2 className="text-3xl">Submission Received!</h2>
        <p className="text-text-muted text-lg">
          Your proof has been submitted and is now pending admin approval. 
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

  const currentRef = activities.find(a => a.id === selectedActivity)?.ref;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <header>
        <h2 className="text-3xl mb-1">Submit Activity Proof</h2>
        <p className="text-text-muted">Select an activity and upload a screenshot to claim your GP.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form */}
        <section className="card space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-text-muted">Activity</label>
              <select 
                value={selectedActivity}
                onChange={(e) => setSelectedActivity(e.target.value)}
                className="w-full bg-surface-hover border border-white/10 rounded-lg p-3 text-text-main outline-none focus:border-primary transition-colors"
                required
              >
                <option value="">Select an activity...</option>
                {activities.map((a) => (
                  <option key={a.id} value={a.id}>{a.name} (+{a.points} GP)</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-text-muted">Screenshot Proof</label>
              <div 
                className={`border-2 border-dashed rounded-xl p-8 transition-all text-center flex flex-col items-center justify-center gap-4 ${
                  preview ? 'border-success/50 bg-success/5' : 'border-white/10 hover:border-primary/50 hover:bg-primary/5'
                }`}
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
                  <div className="relative w-full aspect-video rounded-lg overflow-hidden border border-white/10">
                    <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                    <button 
                      type="button"
                      onClick={() => { setFile(null); setPreview(null); }}
                      className="absolute top-2 right-2 p-1 bg-black/50 rounded-full text-white hover:bg-red-500 transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="p-4 bg-white/5 rounded-full text-text-muted">
                      <Upload size={32} />
                    </div>
                    <div>
                      <p className="font-bold">Click to upload or drag and drop</p>
                      <p className="text-xs text-text-muted mt-1">PNG, JPG or WebP (max. 10MB)</p>
                    </div>
                    <input 
                      type="file" 
                      className="hidden" 
                      id="file-upload" 
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                    <label htmlFor="file-upload" className="btn-secondary py-2 text-xs">Browse Files</label>
                  </>
                )}
              </div>
            </div>

            <button 
              type="submit" 
              className="btn-primary w-full py-4 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              disabled={!selectedActivity || !file || isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin"></div>
                  Submitting...
                </>
              ) : 'Submit for Review'}
            </button>
          </form>

          <div className="flex gap-3 p-4 bg-secondary/5 border border-secondary/20 rounded-lg text-sm text-secondary">
            <Info size={20} className="flex-shrink-0" />
            <p>Admin approval is required before GP is awarded. Duplicate submissions for the same activity/week will be rejected.</p>
          </div>
        </section>

        {/* Reference */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-widest text-text-muted">Reference Guide</label>
            <div className="flex items-center gap-1 text-primary text-xs font-bold">
              <HelpCircle size={14} />
              <span>Matching Example</span>
            </div>
          </div>

          <div className="card h-[400px] flex flex-col items-center justify-center relative overflow-hidden bg-surface-alt">
            {currentRef ? (
              <div className="w-full h-full p-4 flex flex-col gap-4">
                <p className="text-xs text-text-muted italic">Your screenshot should look similar to this:</p>
                <div className="flex-1 rounded-lg overflow-hidden border border-white/5">
                  <img src={currentRef} alt="Reference" className="w-full h-full object-contain bg-black/20" />
                </div>
              </div>
            ) : (
              <div className="text-center p-8 opacity-40">
                <HelpCircle size={48} className="mx-auto mb-4" />
                <p>Select an activity to see the required screenshot format.</p>
              </div>
            )}
          </div>

          <div className="p-4 border border-white/5 rounded-lg text-xs text-text-muted space-y-2">
            <p className="font-bold text-text-main">Submission Tips:</p>
            <ul className="list-disc ml-4 space-y-1">
              <li>Ensure your in-game name is visible.</li>
              <li>Show the relevant UI element or event completion message.</li>
              <li>Don't crop the image too tightly.</li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
}
