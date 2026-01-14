#!/usr/bin/env node

/**
 * Phase 1 Migration Verification Script
 * Checks if migration was successful and displays status
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

console.log('🔍 PHASE 1 MIGRATION VERIFICATION');
console.log('===================================\n');

async function verify() {
  const tables = [
    { name: 'communities', expectedCount: 8, description: 'Community groups' },
    { name: 'community_members', expectedCount: null, description: 'Membership records' },
    { name: 'stories', expectedCount: null, description: 'User stories' },
    { name: 'user_checkins', expectedCount: null, description: 'Venue check-ins' },
    { name: 'user_reviews', expectedCount: null, description: 'Venue reviews' },
    { name: 'user_activity_log', expectedCount: null, description: 'Activity tracking' },
    { name: 'badge_definitions', expectedCount: 9, description: 'Badge definitions' },
    { name: 'user_badges', expectedCount: null, description: 'User earned badges' },
    { name: 'user_favorites', expectedCount: null, description: 'Favorite venues' }
  ];

  let totalVerified = 0;
  let totalMissing = 0;
  const missingTables = [];

  console.log('📋 Checking tables...\n');

  for (const table of tables) {
    try {
      const { count, error } = await supabase
        .from(table.name)
        .select('*', { count: 'exact', head: true });

      if (!error) {
        totalVerified++;
        const countStr = count !== null ? ` (${count} rows)` : '';
        console.log(`   ✅ ${table.name.padEnd(25)} - ${table.description}${countStr}`);

        if (table.expectedCount !== null && count !== table.expectedCount) {
          console.log(`      ⚠️  Expected ${table.expectedCount} rows but found ${count}`);
        }
      } else {
        totalMissing++;
        missingTables.push(table.name);
        console.log(`   ❌ ${table.name.padEnd(25)} - MISSING`);
      }
    } catch (error) {
      totalMissing++;
      missingTables.push(table.name);
      console.log(`   ❌ ${table.name.padEnd(25)} - ERROR: ${error.message}`);
    }
  }

  console.log(`\n📊 SUMMARY: ${totalVerified}/${tables.length} tables verified\n`);

  if (totalMissing > 0) {
    console.log('❌ MIGRATION NOT COMPLETE');
    console.log(`   Missing tables: ${missingTables.join(', ')}\n`);
    console.log('📖 TO RUN MIGRATION:');
    console.log('   1. Go to: https://supabase.com/dashboard/project/xvtjcpwkrsoyrhhptdmc/sql');
    console.log('   2. Click "New Query"');
    console.log('   3. Copy all contents from: supabase/migrations/phase1_core_social_features.sql');
    console.log('   4. Paste and click "Run"\n');
    process.exit(1);
  } else {
    console.log('✅ MIGRATION SUCCESSFUL!\n');
    await showDetails();
    process.exit(0);
  }
}

async function showDetails() {
  console.log('🎯 DETAILS:\n');

  // Show communities
  const { data: communities } = await supabase
    .from('communities')
    .select('name, icon, member_count')
    .order('member_count', { ascending: false });

  if (communities && communities.length > 0) {
    console.log('📱 Communities:');
    communities.forEach(c => {
      console.log(`   ${c.icon} ${c.name.padEnd(25)} - ${c.member_count} members`);
    });
  }

  // Show badges
  const { data: badges } = await supabase
    .from('badge_definitions')
    .select('name, icon_emoji, points, requirement_count')
    .order('points', { ascending: true });

  if (badges && badges.length > 0) {
    console.log('\n🏆 Badges:');
    badges.forEach(b => {
      const req = b.requirement_count ? ` (${b.requirement_count} required)` : '';
      console.log(`   ${b.icon_emoji} ${b.name.padEnd(20)} - ${b.points} points${req}`);
    });
  }

  console.log('\n🚀 NEXT STEPS:');
  console.log('   1. Test web app: npm run dev → http://localhost:5173/social');
  console.log('   2. Test mobile app: cd apps/consumer-app && npm start');
  console.log('   3. Try joining a community!');
  console.log('   4. Check member count updates\n');
}

verify().catch(error => {
  console.error('❌ Verification failed:', error.message);
  process.exit(1);
});
