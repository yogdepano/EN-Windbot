'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { AlertCircle, ArrowLeft } from 'lucide-react';

function ErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error') || 'An unknown error occurred during authentication.';

  return (
    <div className="card max-w-md mx-auto mt-20 p-8 text-center bg-surface-alt border-error/20 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-error"></div>
      
      <div className="flex justify-center mb-6">
        <div className="p-4 rounded-full bg-error/10 text-error">
          <AlertCircle size={48} />
        </div>
      </div>
      
      <h1 className="text-2xl font-bold text-text-main mb-4">Login Failed</h1>
      
      <p className="text-text-muted mb-6">
        We encountered an issue while trying to log you in. This often happens if you are using an in-app browser (like inside Discord or Instagram) which blocks cookies.
      </p>
      
      <div className="bg-surface border border-white/5 p-4 rounded-lg text-left mb-8">
        <p className="text-xs text-text-muted uppercase font-bold mb-1 tracking-widest">Error Details</p>
        <code className="text-error text-sm break-words">{error}</code>
      </div>
      
      <div className="flex flex-col gap-3">
        <Link href="/" className="btn-primary w-full py-3 flex justify-center items-center gap-2">
          <ArrowLeft size={16} />
          Return to Homepage
        </Link>
        <p className="text-xs text-text-muted mt-4">
          <strong>Tip:</strong> If you are on a mobile device, please open the website directly in your default browser (Chrome or Safari) instead of tapping the link inside the Discord app.
        </p>
      </div>
    </div>
  );
}

export default function AuthErrorPage() {
  return (
    <div className="min-h-[calc(100vh-80px)] bg-background px-4">
      <Suspense fallback={<div className="mt-20 text-center text-text-muted">Loading error details...</div>}>
        <ErrorContent />
      </Suspense>
    </div>
  );
}
