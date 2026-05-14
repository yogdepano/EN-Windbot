import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function grandReset() {
  console.log('🚀 Starting Grand Reset for Every Nation Rewards 2.0...');

  try {
    // 1. Clear submission history
    console.log('Clearing check-in history...');
    const { error: err1 } = await supabase.from('check_ins').delete().neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all
    if (err1) console.error('Error clearing check_ins:', err1);

    // 2. Clear redemption history
    console.log('Clearing redemption history...');
    const { error: err2 } = await supabase.from('redemptions').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    if (err2) console.error('Error clearing redemptions:', err2);

    // 3. Clear audit logs
    console.log('Clearing audit logs...');
    const { error: err3 } = await supabase.from('audit_logs').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    if (err3) console.error('Error clearing audit_logs:', err3);

    // 4. Reset all user balances and stats
    console.log('Resetting all user balances and stats...');
    const { error: err4 } = await supabase
      .from('profiles')
      .update({
        gp_balance: 0,
        lifetime_earned: 0,
        lifetime_redeemed: 0,
        total_exp: 0,
        badges: []
      })
      .neq('role', 'superadmin'); // Keep superadmin just in case, but usually role isn't 'superadmin'
    
    if (err4) console.error('Error resetting profiles:', err4);

    console.log('✅ GRAND RESET COMPLETE! Every Nation is now a clean slate.');
  } catch (error) {
    console.error('Fatal error during reset:', error);
  }
}

grandReset();
