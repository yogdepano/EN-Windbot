import { supabaseAdmin } from '../src/lib/supabaseAdmin';

async function fixRewards() {
  console.log('Cleaning up rewards table...');
  
  // 1. Delete all existing rewards
  const { error: deleteError } = await supabaseAdmin
    .from('rewards')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete everything
    
  if (deleteError) {
    console.error('Error deleting rewards:', deleteError);
    return;
  }
  
  console.log('Inserting correct reward set...');
  
  const newRewards = [
    { name: 'Monthly Pass', description: 'In-game Monthly Pass', cost: 300, availability: true },
    { name: 'Battle Pass', description: 'In-game Battle Pass', cost: 500, availability: true },
    { name: 'Premium Battle Pass', description: 'In-game Premium Battle Pass', cost: 1000, availability: true },
    { name: 'Echo Bead', description: 'Standard In-game Currency', cost: 1, availability: true }
  ];
  
  const { error: insertError } = await supabaseAdmin
    .from('rewards')
    .insert(newRewards);
    
  if (insertError) {
    console.error('Error inserting rewards:', insertError);
    return;
  }
  
  console.log('Rewards fixed successfully.');
}

fixRewards();
