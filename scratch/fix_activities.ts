import { supabaseAdmin } from '../src/lib/supabaseAdmin';

async function fixActivities() {
  console.log('Cleaning up activities table...');
  
  // 1. Delete all existing activities
  const { error: deleteError } = await supabaseAdmin
    .from('activities')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000');
    
  if (deleteError) {
    console.error('Error deleting activities:', deleteError);
    return;
  }
  
  console.log('Inserting unique activity set...');
  
  const activities = [
    { name: 'Breaking Army (Saturday)', points: 5, day_of_week: 'Saturday', reference_image_path: '/references/Breaking Army.png', is_active: true },
    { name: 'Breaking Army (Sunday)', points: 5, day_of_week: 'Sunday', reference_image_path: '/references/Breaking Army.png', is_active: true },
    { name: 'Guild Heroes Realm', points: 5, day_of_week: null, reference_image_path: "/references/Guild Heroe's Realm.png", is_active: true },
    { name: 'Guild Party', points: 5, day_of_week: null, reference_image_path: '/references/Guild Party.png', is_active: true },
    { name: 'Guild War (Saturday)', points: 5, day_of_week: 'Saturday', reference_image_path: '/references/Guild War.png', is_active: true },
    { name: 'Guild War (Sunday)', points: 5, day_of_week: 'Sunday', reference_image_path: '/references/Guild War.png', is_active: true },
    { name: 'Reach 2,000 Weekly Activity', points: 10, day_of_week: null, reference_image_path: '/references/Weekly Activity Points.png', is_active: true }
  ];
  
  const { error: insertError } = await supabaseAdmin
    .from('activities')
    .insert(activities);
    
  if (insertError) {
    console.error('Error inserting activities:', insertError);
    return;
  }
  
  console.log('Activities fixed successfully.');
}

fixActivities();
