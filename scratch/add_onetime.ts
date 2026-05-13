import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: './.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function main() {
  const { data, error } = await supabase.from('activities').insert({
    name: 'One-time Upload (Weekly Summary)',
    points: 0,
    is_active: true,
    day_of_week: 'Weekly',
    reference_image_path: '/one-time-upload.png'
  }).select();

  if (error) {
    console.error('Error:', error);
  } else {
    console.log('Success:', data);
  }
}

main();
