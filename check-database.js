/**
 * Database Schema Check Script
 * Run this to verify all required tables exist in your Supabase database
 * Usage: node check-database.js
 */

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Read .env.local file
const envPath = path.join(__dirname, '.env.local');
let supabaseUrl, supabaseServiceKey;

try {
  const envContent = fs.readFileSync(envPath, 'utf8');
  const lines = envContent.split('\n');
  
  lines.forEach(line => {
    const [key, ...valueParts] = line.split('=');
    const value = valueParts.join('=').trim();
    
    if (key.trim() === 'NEXT_PUBLIC_SUPABASE_URL') {
      supabaseUrl = value;
    } else if (key.trim() === 'SUPABASE_SERVICE_ROLE_KEY' || key.trim() === 'NEXT_PUBLIC_SUPABASE_ANON_KEY') {
      if (!supabaseServiceKey) supabaseServiceKey = value;
    }
  });
} catch (err) {
  console.error('❌ Could not read .env.local file:', err.message);
}

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const REQUIRED_TABLES = [
  'users',
  'mentors',
  'mentees',
  'categories',
  'mentorship_requests',
  'reviews',
  'education',
  'experience',
  'certifications',
  'external_links',
  'media_posts',
  'publications',
  'success_stories',
  'resources',
  'availability_slots',
  'mentorship_sessions',
  'mentorship_milestones',
  'mentorship_outcomes',
  'activity_feed',
  'notifications'
];

async function checkDatabase() {
  console.log('🔍 Checking database schema...\n');
  
  const missingTables = [];
  const existingTables = [];
  
  for (const table of REQUIRED_TABLES) {
    try {
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .limit(1);
      
      if (error) {
        if (error.code === '42P01' || error.message.includes('does not exist')) {
          missingTables.push(table);
          console.log(`❌ ${table} - MISSING`);
        } else {
          console.log(`⚠️  ${table} - ERROR: ${error.message}`);
        }
      } else {
        existingTables.push(table);
        console.log(`✅ ${table} - EXISTS`);
      }
    } catch (err) {
      console.log(`⚠️  ${table} - ERROR: ${err.message}`);
    }
  }
  
  console.log(`\n📊 Summary:`);
  console.log(`✅ Existing tables: ${existingTables.length}/${REQUIRED_TABLES.length}`);
  console.log(`❌ Missing tables: ${missingTables.length}/${REQUIRED_TABLES.length}`);
  
  if (missingTables.length > 0) {
    console.log('\n⚠️  MISSING TABLES DETECTED!\n');
    console.log('The following tables are missing from your database:');
    missingTables.forEach(table => console.log(`  - ${table}`));
    console.log('\n📋 TO FIX THIS:');
    console.log('1. Open your Supabase Dashboard: https://supabase.com/dashboard');
    console.log('2. Go to SQL Editor');
    console.log('3. Run the migration file: supabase/migrations/004_comprehensive_schema.sql');
    console.log('4. This will create all the missing tables\n');
    console.log('💡 Alternatively, copy the contents of the SQL file and paste it in the SQL Editor');
    
    return false;
  } else {
    console.log('\n✨ All required tables exist! Your database is ready.');
    return true;
  }
}

async function checkStorageBuckets() {
  console.log('\n🪣 Checking storage buckets...\n');
  
  const REQUIRED_BUCKETS = ['profile-images', 'publications', 'media', 'resources'];
  
  try {
    const { data: buckets, error } = await supabase.storage.listBuckets();
    
    if (error) {
      console.log(`❌ Error listing buckets: ${error.message}`);
      return false;
    }
    
    const bucketNames = buckets.map(b => b.name);
    const missingBuckets = REQUIRED_BUCKETS.filter(b => !bucketNames.includes(b));
    
    REQUIRED_BUCKETS.forEach(bucket => {
      if (bucketNames.includes(bucket)) {
        console.log(`✅ ${bucket} - EXISTS`);
      } else {
        console.log(`❌ ${bucket} - MISSING`);
      }
    });
    
    if (missingBuckets.length > 0) {
      console.log('\n⚠️  MISSING STORAGE BUCKETS!\n');
      console.log('The following buckets are missing:');
      missingBuckets.forEach(bucket => console.log(`  - ${bucket}`));
      console.log('\n📋 TO FIX THIS:');
      console.log('1. Open your Supabase Dashboard: https://supabase.com/dashboard');
      console.log('2. Go to Storage');
      console.log('3. Run the SQL in supabase/storage-setup.sql in SQL Editor');
      console.log('   OR manually create each bucket with public access\n');
      
      return false;
    } else {
      console.log('\n✨ All storage buckets exist!');
      return true;
    }
  } catch (err) {
    console.log(`❌ Error checking buckets: ${err.message}`);
    return false;
  }
}

async function main() {
  console.log('════════════════════════════════════════════════════════');
  console.log('   MENTORSHIP PLATFORM - DATABASE CHECK');
  console.log('════════════════════════════════════════════════════════\n');
  
  const tablesOk = await checkDatabase();
  const bucketsOk = await checkStorageBuckets();
  
  console.log('\n════════════════════════════════════════════════════════');
  
  if (tablesOk && bucketsOk) {
    console.log('✅ DATABASE CHECK PASSED - Everything is ready!');
  } else {
    console.log('❌ DATABASE CHECK FAILED - Please fix the issues above');
    process.exit(1);
  }
  
  console.log('════════════════════════════════════════════════════════\n');
}

main().catch(console.error);
