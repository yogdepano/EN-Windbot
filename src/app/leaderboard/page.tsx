'use client';

import { useState, useEffect } from 'react';
import { Trophy, Medal, Crown, Star, Loader } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export default function LeaderboardPage() {
  const [loading, setLoading] = useState(true);
  const [topUsers, setTopUsers] = useState<any[]>([]);

  useEffect(() => {
    async function fetchLeaderboard() {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .order('total_exp', { ascending: false })
        .limit(20);
      
      if (data) setTopUsers(data);
      setLoading(false);
    }
    fetchLeaderboard();
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
          <Trophy className="text-secondary" size={48} />
          GUILD LEADERBOARD
        </h1>
        <p className="text-text-muted">Honoring the most dedicated members of Every Nation.</p>
      </header>

      {/* Podium */}
      <div className="grid grid-cols-3 gap-4 items-end pt-12">
        {/* 2nd Place */}
        {topUsers[1] && (
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <div className="w-20 h-20 rounded-full border-4 border-slate-400 overflow-hidden">
                <img src={topUsers[1].avatar_url} alt="" className="w-full h-full object-cover" />
              </div>
              <div className="absolute -bottom-2 -right-2 bg-slate-400 rounded-full p-1 border-2 border-surface">
                <Medal size={16} className="text-white" />
              </div>
            </div>
            <div className="text-center">
              <p className="font-bold truncate w-24">{topUsers[1].username}</p>
              <p className="text-xs text-text-muted">{topUsers[1].total_exp} EXP</p>
            </div>
            <div className="w-full h-32 bg-slate-400/20 rounded-t-lg border-x border-t border-slate-400/30 flex items-center justify-center font-black text-4xl text-slate-400/50">2</div>
          </div>
        )}

        {/* 1st Place */}
        {topUsers[0] && (
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <div className="w-28 h-28 rounded-full border-4 border-secondary overflow-hidden shadow-[0_0_30px_-10px_#8b5cf6]">
                <img src={topUsers[0].avatar_url} alt="" className="w-full h-full object-cover" />
              </div>
              <div className="absolute -top-6 left-1/2 -translate-x-1/2">
                <Crown size={32} className="text-secondary animate-bounce" />
              </div>
              <div className="absolute -bottom-2 -right-2 bg-secondary rounded-full p-2 border-2 border-surface">
                <Medal size={20} className="text-white" />
              </div>
            </div>
            <div className="text-center">
              <p className="text-xl font-black italic">{topUsers[0].username}</p>
              <p className="text-sm font-bold text-secondary">{topUsers[0].total_exp} EXP</p>
            </div>
            <div className="w-full h-48 bg-secondary/20 rounded-t-lg border-x border-t border-secondary/30 flex items-center justify-center font-black text-6xl text-secondary/50">1</div>
          </div>
        )}

        {/* 3rd Place */}
        {topUsers[2] && (
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <div className="w-20 h-20 rounded-full border-4 border-amber-700 overflow-hidden">
                <img src={topUsers[2].avatar_url} alt="" className="w-full h-full object-cover" />
              </div>
              <div className="absolute -bottom-2 -right-2 bg-amber-700 rounded-full p-1 border-2 border-surface">
                <Medal size={16} className="text-white" />
              </div>
            </div>
            <div className="text-center">
              <p className="font-bold truncate w-24">{topUsers[2].username}</p>
              <p className="text-xs text-text-muted">{topUsers[2].total_exp} EXP</p>
            </div>
            <div className="w-full h-24 bg-amber-700/20 rounded-t-lg border-x border-t border-amber-700/30 flex items-center justify-center font-black text-4xl text-amber-700/50">3</div>
          </div>
        )}
      </div>

      {/* List */}
      <div className="card divide-y divide-white/5 p-0 overflow-hidden">
        {topUsers.slice(3).map((user, i) => (
          <div key={user.id} className="flex items-center justify-between p-4 hover:bg-white/5 transition-colors group">
            <div className="flex items-center gap-6">
              <span className="text-text-muted font-bold w-4 text-center">{i + 4}</span>
              <div className="w-10 h-10 rounded-full overflow-hidden border border-white/10 group-hover:border-primary transition-colors">
                <img src={user.avatar_url} alt="" className="w-full h-full object-cover" />
              </div>
              <div>
                <p className="font-bold group-hover:text-primary transition-colors">{user.username}</p>
                <p className="text-[10px] text-text-muted uppercase tracking-widest">{user.title || 'Member'}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Star size={14} className="text-primary" />
              <span className="font-black italic">{user.total_exp} EXP</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
