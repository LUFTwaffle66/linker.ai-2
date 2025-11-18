import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkProjects() {
  // Check all projects
  const { data: allProjects, error } = await supabase
    .from('projects')
    .select('id, title, client_id, fixed_budget')
    .limit(10);

  if (error) {
    console.error('Error fetching projects:', error);
    return;
  }

  console.log(`\nTotal projects found: ${allProjects?.length || 0}\n`);

  if (allProjects && allProjects.length > 0) {
    allProjects.forEach((project, index) => {
      console.log(`${index + 1}. ${project.title}`);
      console.log(`   Project ID: ${project.id}`);
      console.log(`   Client ID: ${project.client_id}`);
      console.log(`   Budget: $${project.fixed_budget}\n`);
    });
  } else {
    console.log('No projects in database. You can:');
    console.log('1. Create a project through the browse page UI');
    console.log('2. Update migration 015_seed_mock_data_for_new_user.sql with your user ID and rerun it\n');
  }
}

checkProjects();
