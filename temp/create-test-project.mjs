import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function createTestProject() {
  const CLIENT_ID = '7e3d70a5-60b5-40e1-9e9e-67ec3f8395ec';
  const FREELANCER_ID = 'c208f7b9-8978-4063-9529-10f64167171d';

  // Create a test project
  const { data: project, error: projectError } = await supabase
    .from('projects')
    .insert({
      client_id: CLIENT_ID,
      title: 'Test Stripe Integration Project',
      category: 'Web Development',
      description: 'This is a test project to verify Stripe payment integration',
      fixed_budget: 1000, // $1000 for testing
      timeline: '2 weeks',
      status: 'open',
      skills: ['Stripe', 'Payments', 'Testing'],
      is_published: true,
    })
    .select()
    .single();

  if (projectError) {
    console.error('❌ Error creating project:', projectError);
    return;
  }

  console.log('✓ Created test project:');
  console.log('  Project ID:', project.id);
  console.log('  Title:', project.title);
  console.log('  Budget: $' + project.fixed_budget);
  console.log('  Client ID:', project.client_id);
  console.log('\n📋 Update temp/stripe-test.mjs with this Project ID:', project.id);
}

createTestProject();
