import { supabaseAdmin } from '../src/lib/supabaseAdmin';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function fixDiscordIds() {
  console.log('Fetching users from auth.users...');
  
  // Need to use listUsers since auth.users isn't queryable from data API normally
  const { data: { users }, error } = await supabaseAdmin.auth.admin.listUsers();
  
  if (error) {
    console.error('Error fetching users:', error);
    return;
  }
  
  console.log(`Found ${users.length} users. Updating profiles...`);
  
  for (const user of users) {
    const discordId = user.identities?.find(i => i.provider === 'discord')?.id || user.user_metadata?.provider_id || user.user_metadata?.sub;
    
    if (discordId) {
      console.log(`Updating user ${user.email} with discord_id ${discordId}...`);
      const { error: updateError } = await supabaseAdmin
        .from('profiles')
        .update({ discord_id: discordId })
        .eq('id', user.id);
        
      if (updateError) {
        console.error(`Error updating user ${user.id}:`, updateError);
      }
    } else {
      console.log(`No discord ID found for user ${user.email}`);
    }
  }
  
  console.log('Done.');
}

fixDiscordIds();
