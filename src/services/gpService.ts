import { supabase } from '@/lib/supabase';

export const gpService = {
  async getProfile(userId: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) throw error;
    return data;
  },

  async getActivities() {
    const { data, error } = await supabase
      .from('activities')
      .select('*')
      .eq('is_active', true);
    
    if (error) throw error;
    return data;
  },

  async submitCheckIn(userId: string, activityId: string, weekStart: string, screenshotUrl: string) {
    const { data, error } = await supabase
      .from('check_ins')
      .insert({
        user_id: userId,
        activity_id: activityId,
        week_start_date: weekStart,
        screenshot_url: screenshotUrl,
        status: 'pending'
      });
    
    if (error) throw error;
    return data;
  },

  async getRecentCheckIns(userId: string, limit = 5) {
    const { data, error } = await supabase
      .from('check_ins')
      .select(`
        *,
        activities (name, points)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (error) throw error;
    return data;
  },

  async getRewards() {
    const { data, error } = await supabase
      .from('rewards')
      .select('*')
      .eq('availability', true);
    
    if (error) throw error;
    return data;
  },

  async createRedemptionRequest(userId: string, rewardId: string, notes?: string) {
    const { data, error } = await supabase
      .from('redemption_requests')
      .insert({
        user_id: userId,
        reward_id: rewardId,
        member_notes: notes,
        status: 'pending'
      });
    
    if (error) throw error;
    return data;
  }
};
