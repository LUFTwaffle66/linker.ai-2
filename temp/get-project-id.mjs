import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function getProjectId() {
  const CLIENT_ID = '7e3d70a5-60b5-40e1-9e9e-67ec3f8395ec';

  const { data: projects, error } = await supabase
    .from('projects')
    .select('id, title, client_id, fixed_budget')
    .eq('client_id', CLIENT_ID)
    .limit(5);

  if (error) {
    console.error('Error fetching projects:', error);
    return;
  }

  if (!projects || projects.length === 0) {
    console.log('❌ No projects found for client ID:', CLIENT_ID);
    console.log('\nYou need to create a project first through your app UI or run the seed migration.');
    return;
  }

  console.log('\n✓ Found projects:');
  projects.forEach((project, index) => {
    console.log(`\n${index + 1}. ${project.title}`);
    console.log(`   ID: ${project.id}`);
    console.log(`   Budget: $${project.fixed_budget}`);
  });

  console.log('\n📋 Copy one of the IDs above and paste it in temp/stripe-test.mjs');
}

getProjectId();
