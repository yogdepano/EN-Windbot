import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function promote() {
  const { data: users, error: findError } = await supabase
    .from('profiles')
    .select('*')
    .ilike('username', '%yog%');

  if (findError) {
    console.error('Error finding user:', findError);
    return;
  }

  if (!users || users.length === 0) {
    console.log('No user found with "yog" in username.');
    return;
  }

  const user = users[0];
  console.log(`Found user: ${user.username} (ID: ${user.id})`);

  const { error: updateError } = await supabase
    .from('profiles')
    .update({ role: 'admin' })
    .eq('id', user.id);

  if (updateError) {
    console.error('Error promoting user:', updateError);
  } else {
    console.log(`Successfully promoted ${user.username} to admin!`);
  }
}

promote();
