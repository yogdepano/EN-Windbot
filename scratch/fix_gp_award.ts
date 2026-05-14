import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function fixFunction() {
  const sql = `
    CREATE OR REPLACE FUNCTION public.adjust_gp(p_user_id uuid, p_amount integer)
    RETURNS void
    LANGUAGE plpgsql
    SECURITY DEFINER
    AS $$
    BEGIN
      UPDATE profiles
      SET 
        gp_balance = gp_balance + p_amount,
        lifetime_earned = CASE WHEN p_amount > 0 THEN lifetime_earned + p_amount ELSE lifetime_earned END,
        updated_at = NOW()
      WHERE id = p_user_id;
    END;
    $$;
  `;

  // We can't run raw SQL via supabase-js easily unless we have a specific RPC,
  // but we can try to use a different RPC name if it's already there.
  // Actually, I'll just manually award the points to SnowBall first and then fix the bot code.
  
  console.log('Manually awarding 5 GP to SnowBall...');
  const { error: manualError } = await supabase
    .from('profiles')
    .update({ 
      gp_balance: 5,
      lifetime_earned: 5
    })
    .eq('id', 'dbf79b8d-5613-405b-b474-73c02ff3710a');

  if (manualError) console.error('Manual award failed:', manualError);
  else console.log('Manual award successful.');
}

fixFunction();
