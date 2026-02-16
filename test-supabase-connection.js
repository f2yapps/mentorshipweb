// Quick test to check if Supabase keys are valid
// Run with: node test-supabase-connection.js

const fs = require('fs')
const path = require('path')

// Read .env.local file
const envPath = path.join(__dirname, '.env.local')
const envContent = fs.readFileSync(envPath, 'utf8')

// Parse environment variables
const envVars = {}
envContent.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/)
  if (match) {
    envVars[match[1].trim()] = match[2].trim()
  }
})

const url = envVars.NEXT_PUBLIC_SUPABASE_URL
const key = envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY

console.log('\n🔍 Checking Supabase Configuration...\n')

// Check if keys exist
if (!url) {
  console.log('❌ NEXT_PUBLIC_SUPABASE_URL is missing!')
  process.exit(1)
}

if (!key) {
  console.log('❌ NEXT_PUBLIC_SUPABASE_ANON_KEY is missing!')
  process.exit(1)
}

console.log('✅ Environment variables found')
console.log(`   URL: ${url}`)
console.log(`   Key length: ${key.length} characters`)

// Check if keys look valid
if (key.length < 100) {
  console.log('\n❌ ERROR: Supabase anon key is too short!')
  console.log('   Real Supabase keys are 200+ characters long')
  console.log('   Your key is only', key.length, 'characters')
  console.log('\n📖 See FIX_SUPABASE_KEYS.md for instructions')
  process.exit(1)
}

if (!key.startsWith('eyJ')) {
  console.log('\n⚠️  WARNING: Supabase anon key doesn\'t look valid')
  console.log('   Real keys start with "eyJ"')
  console.log('   Your key starts with:', key.substring(0, 10))
  console.log('\n📖 See FIX_SUPABASE_KEYS.md for instructions')
  process.exit(1)
}

if (!url.includes('supabase.co')) {
  console.log('\n⚠️  WARNING: URL doesn\'t look like a Supabase URL')
  console.log('   Should be: https://xxxxx.supabase.co')
  console.log('\n📖 See FIX_SUPABASE_KEYS.md for instructions')
  process.exit(1)
}

console.log('\n✅ Supabase keys look valid!')
console.log('   Key length:', key.length, 'characters ✓')
console.log('   Key format: Starts with "eyJ" ✓')
console.log('   URL format: Contains "supabase.co" ✓')

console.log('\n🎉 Configuration looks good!')
console.log('   If you\'re still getting errors, try:')
console.log('   1. Restart dev server: npm run dev')
console.log('   2. Clear cache: rm -rf .next && npm run dev')
console.log('   3. Check database is set up (run SETUP_DATABASE.sql in Supabase)')
console.log('')
