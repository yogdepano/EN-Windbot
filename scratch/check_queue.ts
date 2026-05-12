import { supabaseAdmin } from '../src/lib/supabaseAdmin';

async function checkQueue() {
  const { data, error } = await supabaseAdmin
    .from('check_ins')
    .select('*, profiles:profiles!check_ins_user_id_fkey(username, role), activities(name)');
    
  if (error) {
    console.error(error);
  } else {
    console.log(JSON.stringify(data, null, 2));
  }
}

checkQueue();
