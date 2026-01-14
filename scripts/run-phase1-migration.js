#!/usr/bin/env node

/**
 * Phase 1 Migration Runner
 * Automatically runs the Phase 1 database migration in Supabase
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
import dotenv from 'dotenv';
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('❌ ERROR: Missing Supabase credentials in .env file');
  console.error('   Required: VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

// Create Supabase client with service role key (bypasses RLS)
const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

console.log('🚀 PHASE 1 MIGRATION RUNNER');
console.log('============================\n');

async function runMigration() {
  try {
    // Read the migration file
    const migrationPath = path.join(__dirname, '..', 'supabase', 'migrations', 'phase1_core_social_features.sql');

    console.log('📂 Reading migration file...');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');

    console.log('✅ Migration file loaded successfully\n');
    console.log('📤 Executing migration in Supabase...');
    console.log('   This may take a minute...\n');

    // Execute the migration
    // Note: Supabase JS client doesn't support multi-statement SQL execution
    // We need to split the SQL into individual statements

    // Split by semicolons but preserve them in CREATE FUNCTION blocks
    const statements = splitSQLStatements(migrationSQL);

    let successCount = 0;
    let errorCount = 0;
    const errors = [];

    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i].trim();

      if (!statement || statement.startsWith('--') || statement.length < 10) {
        continue; // Skip empty lines and comments
      }

      try {
        const { error } = await supabase.rpc('exec_sql', { sql_query: statement });

        if (error) {
          // Some errors are expected (like "table already exists")
          if (error.message.includes('already exists') ||
              error.message.includes('duplicate key') ||
              error.message.includes('violates unique constraint')) {
            console.log(`   ⚠️  Skipped (already exists): Statement ${i + 1}`);
          } else {
            throw error;
          }
        } else {
          successCount++;
          if (successCount % 5 === 0) {
            console.log(`   ✅ Executed ${successCount} statements...`);
          }
        }
      } catch (err) {
        errorCount++;
        errors.push({
          statement: i + 1,
          error: err.message,
          sql: statement.substring(0, 100) + '...'
        });
      }
    }

    console.log('\n📊 MIGRATION RESULTS:');
    console.log(`   ✅ Success: ${successCount} statements`);
    console.log(`   ⚠️  Errors: ${errorCount} statements`);

    if (errors.length > 0 && errorCount > 5) {
      console.log('\n⚠️  ERRORS DETECTED:');
      errors.slice(0, 5).forEach(e => {
        console.log(`   Statement ${e.statement}: ${e.error}`);
      });
      if (errors.length > 5) {
        console.log(`   ... and ${errors.length - 5} more errors`);
      }
    }

    // If the RPC method doesn't exist, use alternative approach
    console.log('\n🔄 Trying alternative migration method...');
    await runMigrationAlternative(migrationSQL);

  } catch (error) {
    console.error('\n❌ MIGRATION FAILED:', error.message);
    console.log('\n💡 ALTERNATIVE: Run migration via Supabase Dashboard');
    console.log('   1. Go to: https://supabase.com/dashboard/project/xvtjcpwkrsoyrhhptdmc/sql');
    console.log('   2. Click "New Query"');
    console.log('   3. Copy contents from: supabase/migrations/phase1_core_social_features.sql');
    console.log('   4. Paste and click "Run"\n');
    process.exit(1);
  }
}

async function runMigrationAlternative(sql) {
  console.log('📝 Running migration using direct table creation...\n');

  try {
    // Test if communities table exists
    const { data: existingCommunities, error: checkError } = await supabase
      .from('communities')
      .select('count')
      .limit(1);

    if (!checkError) {
      console.log('✅ Communities table already exists!');

      // Check if seed data exists
      const { data: communities, error: countError } = await supabase
        .from('communities')
        .select('*');

      if (!countError && communities) {
        console.log(`   📊 Found ${communities.length} existing communities`);

        if (communities.length === 0) {
          console.log('\n📦 Seeding initial communities...');
          await seedCommunities();
        } else {
          console.log('   ✅ Communities already seeded!');
        }
      }
    } else {
      console.log('⚠️  Communities table does not exist yet.');
      console.log('   Please run migration manually via Supabase Dashboard.\n');
      showManualInstructions();
    }

    // Verify migration success
    await verifyMigration();

  } catch (error) {
    console.error('❌ Alternative migration failed:', error.message);
    showManualInstructions();
  }
}

async function seedCommunities() {
  const communities = [
    { name: "Nightlife Lagos", description: "Discover the best nightlife spots, clubs, and late-night experiences in Lagos", icon: "🌙", is_public: true, member_count: 0 },
    { name: "Restaurant Reviews", description: "Share and discover amazing restaurants, cafes, and food experiences", icon: "🍽️", is_public: true, member_count: 0 },
    { name: "Events & Concerts", description: "Stay updated on upcoming events, concerts, and entertainment in Lagos", icon: "🎵", is_public: true, member_count: 0 },
    { name: "Island Vibes", description: "Everything happening on Lagos Island - VI, Ikoyi, Lekki, and beyond", icon: "🏝️", is_public: true, member_count: 0 },
    { name: "Mainland Connect", description: "Connect with people and places on the mainland - Ikeja, Yaba, Surulere, and more", icon: "🏙️", is_public: true, member_count: 0 },
    { name: "Foodies United", description: "For food lovers exploring Lagos culinary scene", icon: "🍕", is_public: true, member_count: 0 },
    { name: "Party People", description: "Where the party animals hang out", icon: "🎉", is_public: true, member_count: 0 },
    { name: "Culture & Arts", description: "Art galleries, museums, cultural events, and exhibitions", icon: "🎨", is_public: true, member_count: 0 }
  ];

  for (const community of communities) {
    const { error } = await supabase
      .from('communities')
      .insert(community);

    if (error && !error.message.includes('duplicate')) {
      console.error(`   ❌ Failed to seed ${community.name}:`, error.message);
    } else if (!error) {
      console.log(`   ✅ Seeded: ${community.name}`);
    }
  }
}

async function verifyMigration() {
  console.log('\n🔍 VERIFYING MIGRATION...\n');

  const tables = [
    'communities',
    'community_members',
    'stories',
    'user_checkins',
    'user_reviews',
    'user_activity_log',
    'badge_definitions',
    'user_badges',
    'user_favorites'
  ];

  let verifiedCount = 0;

  for (const table of tables) {
    try {
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .limit(1);

      if (!error) {
        console.log(`   ✅ Table exists: ${table}`);
        verifiedCount++;
      } else {
        console.log(`   ❌ Table missing: ${table}`);
      }
    } catch (error) {
      console.log(`   ❌ Table missing: ${table}`);
    }
  }

  console.log(`\n📊 VERIFICATION COMPLETE: ${verifiedCount}/${tables.length} tables verified\n`);

  if (verifiedCount === tables.length) {
    console.log('🎉 MIGRATION SUCCESS! All tables created.\n');
    await displayMigrationSummary();
  } else {
    console.log('⚠️  MIGRATION INCOMPLETE: Some tables are missing.');
    console.log('   Please run the migration manually.\n');
    showManualInstructions();
  }
}

async function displayMigrationSummary() {
  console.log('📊 DATABASE STATUS:');
  console.log('==================\n');

  try {
    const { data: communities } = await supabase
      .from('communities')
      .select('*');

    console.log(`✅ Communities: ${communities?.length || 0} seeded`);
    if (communities && communities.length > 0) {
      communities.forEach(c => {
        console.log(`   - ${c.icon} ${c.name} (${c.member_count} members)`);
      });
    }

    const { data: badges } = await supabase
      .from('badge_definitions')
      .select('*');

    console.log(`\n✅ Badges: ${badges?.length || 0} defined`);
    if (badges && badges.length > 0) {
      badges.slice(0, 5).forEach(b => {
        console.log(`   - ${b.icon_emoji} ${b.name} (${b.points} points)`);
      });
      if (badges.length > 5) {
        console.log(`   ... and ${badges.length - 5} more`);
      }
    }

    console.log('\n🚀 NEXT STEPS:');
    console.log('==============');
    console.log('1. Start web app: npm run dev');
    console.log('2. Navigate to: http://localhost:5173/social');
    console.log('3. Click "Communities" tab');
    console.log('4. Try joining a community!\n');

  } catch (error) {
    console.error('Error fetching summary:', error.message);
  }
}

function showManualInstructions() {
  console.log('📖 MANUAL MIGRATION INSTRUCTIONS:');
  console.log('==================================');
  console.log('1. Go to: https://supabase.com/dashboard/project/xvtjcpwkrsoyrhhptdmc/sql');
  console.log('2. Click "New Query"');
  console.log('3. Open: supabase/migrations/phase1_core_social_features.sql');
  console.log('4. Copy ALL contents');
  console.log('5. Paste into SQL Editor');
  console.log('6. Click "Run" (or Cmd/Ctrl + Enter)');
  console.log('7. Verify success message\n');
}

function splitSQLStatements(sql) {
  // Simple SQL statement splitter
  // This is a basic implementation - may not handle all edge cases
  const statements = [];
  let current = '';
  let inFunction = false;

  const lines = sql.split('\n');

  for (const line of lines) {
    const trimmed = line.trim();

    // Detect function/trigger blocks
    if (trimmed.includes('CREATE OR REPLACE FUNCTION') ||
        trimmed.includes('CREATE FUNCTION') ||
        trimmed.includes('CREATE TRIGGER')) {
      inFunction = true;
    }

    if (trimmed.includes('$$ LANGUAGE') || trimmed.includes('EXECUTE FUNCTION')) {
      inFunction = false;
    }

    current += line + '\n';

    // Split on semicolon if not in function
    if (trimmed.endsWith(';') && !inFunction) {
      statements.push(current.trim());
      current = '';
    }
  }

  if (current.trim()) {
    statements.push(current.trim());
  }

  return statements;
}

// Run the migration
runMigration();
