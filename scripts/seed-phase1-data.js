#!/usr/bin/env node

/**
 * Seed Phase 1 Data
 * Seeds communities and badges into the database
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

console.log('🌱 SEEDING PHASE 1 DATA');
console.log('=======================\n');

async function seed() {
  // Seed communities
  console.log('📱 Seeding communities...\n');

  const communities = [
    { name: "Nightlife Lagos", description: "Discover the best nightlife spots, clubs, and late-night experiences in Lagos", icon: "🌙", is_public: true, member_count: 0, is_active: true },
    { name: "Restaurant Reviews", description: "Share and discover amazing restaurants, cafes, and food experiences", icon: "🍽️", is_public: true, member_count: 0, is_active: true },
    { name: "Events & Concerts", description: "Stay updated on upcoming events, concerts, and entertainment in Lagos", icon: "🎵", is_public: true, member_count: 0, is_active: true },
    { name: "Island Vibes", description: "Everything happening on Lagos Island - VI, Ikoyi, Lekki, and beyond", icon: "🏝️", is_public: true, member_count: 0, is_active: true },
    { name: "Mainland Connect", description: "Connect with people and places on the mainland - Ikeja, Yaba, Surulere, and more", icon: "🏙️", is_public: true, member_count: 0, is_active: true },
    { name: "Foodies United", description: "For food lovers exploring Lagos culinary scene", icon: "🍕", is_public: true, member_count: 0, is_active: true },
    { name: "Party People", description: "Where the party animals hang out", icon: "🎉", is_public: true, member_count: 0, is_active: true },
    { name: "Culture & Arts", description: "Art galleries, museums, cultural events, and exhibitions", icon: "🎨", is_public: true, member_count: 0, is_active: true }
  ];

  let communityCount = 0;

  for (const community of communities) {
    const { error } = await supabase
      .from('communities')
      .upsert(community, { onConflict: 'name' });

    if (error) {
      console.error(`   ❌ Failed: ${community.name} - ${error.message}`);
    } else {
      console.log(`   ✅ ${community.icon} ${community.name}`);
      communityCount++;
    }
  }

  console.log(`\n✅ Seeded ${communityCount}/${communities.length} communities\n`);

  // Seed badges
  console.log('🏆 Seeding badges...\n');

  const badges = [
    { name: "First Check-in", description: "Check in to your first venue", icon_emoji: "📍", category: "explorer", requirement_type: "checkins", requirement_count: 1, points: 10, is_active: true },
    { name: "Explorer", description: "Check in to 10 different venues", icon_emoji: "🗺️", category: "explorer", requirement_type: "checkins", requirement_count: 10, points: 50, is_active: true },
    { name: "Super Explorer", description: "Check in to 50 different venues", icon_emoji: "⭐", category: "explorer", requirement_type: "checkins", requirement_count: 50, points: 200, is_active: true },
    { name: "First Review", description: "Write your first venue review", icon_emoji: "✍️", category: "contributor", requirement_type: "reviews", requirement_count: 1, points: 15, is_active: true },
    { name: "Critic", description: "Write 10 venue reviews", icon_emoji: "📝", category: "contributor", requirement_type: "reviews", requirement_count: 10, points: 75, is_active: true },
    { name: "Social Butterfly", description: "Create 25 posts in communities", icon_emoji: "🦋", category: "social", requirement_type: "posts", requirement_count: 25, points: 100, is_active: true },
    { name: "Event Enthusiast", description: "Attend 5 events", icon_emoji: "🎫", category: "social", requirement_type: "events", requirement_count: 5, points: 60, is_active: true },
    { name: "Photographer", description: "Upload 20 photos", icon_emoji: "📸", category: "contributor", requirement_type: "photos", requirement_count: 20, points: 80, is_active: true },
    { name: "Early Adopter", description: "One of the first 1000 users", icon_emoji: "🚀", category: "special", requirement_type: "manual", requirement_count: null, points: 500, is_active: true }
  ];

  let badgeCount = 0;

  for (const badge of badges) {
    const { error } = await supabase
      .from('badge_definitions')
      .upsert(badge, { onConflict: 'name' });

    if (error) {
      console.error(`   ❌ Failed: ${badge.name} - ${error.message}`);
    } else {
      console.log(`   ✅ ${badge.icon_emoji} ${badge.name} (${badge.points} points)`);
      badgeCount++;
    }
  }

  console.log(`\n✅ Seeded ${badgeCount}/${badges.length} badges\n`);

  // Verify
  const { data: communitiesData } = await supabase
    .from('communities')
    .select('*');

  const { data: badgesData } = await supabase
    .from('badge_definitions')
    .select('*');

  console.log('📊 FINAL STATUS:');
  console.log(`   Communities: ${communitiesData?.length || 0}/8`);
  console.log(`   Badges: ${badgesData?.length || 0}/9\n`);

  if (communitiesData?.length === 8 && badgesData?.length === 9) {
    console.log('🎉 SEEDING COMPLETE!\n');
  } else {
    console.log('⚠️  Some data may not have been seeded correctly.\n');
  }
}

seed().catch(error => {
  console.error('❌ Seeding failed:', error.message);
  process.exit(1);
});
