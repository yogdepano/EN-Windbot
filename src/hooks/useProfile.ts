'use client';

import { useEffect, useState } from 'react';
import { useAuth } from './useAuth';
import { gpService } from '@/services/gpService';

export function useProfile() {
  const { user, loading: authLoading } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    if (authLoading) return;

    if (user) {
      gpService.getProfile(user.id)
        .then(data => {
          setProfile(data);
          setLoading(false);
        })
        .catch(err => {
          setError(err);
          setLoading(false);
        });
    } else {
      setProfile(null);
      setLoading(false);
    }
  }, [user, authLoading]);

  return { profile, loading, error };
}
