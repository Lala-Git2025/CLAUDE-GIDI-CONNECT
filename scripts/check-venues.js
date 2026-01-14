#!/usr/bin/env node

/**
 * Check venues in database
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function checkVenues() {
  console.log('🔍 Checking venues in database...\n');

  const { data, error } = await supabase
    .from('venues')
    .select('name, location, category, rating, professional_media_urls')
    .order('rating', { ascending: false })
    .limit(10);

  if (error) {
    console.error('❌ Error:', error.message);
    return;
  }

  console.log(`Found ${data?.length || 0} venues:\n`);

  if (data && data.length > 0) {
    data.forEach((venue, index) => {
      console.log(`${index + 1}. ${venue.name}`);
      console.log(`   Location: ${venue.location}`);
      console.log(`   Category: ${venue.category}`);
      console.log(`   Rating: ${venue.rating}/5.0`);
      console.log(`   Images: ${venue.professional_media_urls?.length || 0}`);

      if (venue.professional_media_urls && venue.professional_media_urls.length > 0) {
        console.log(`   First Image: ${venue.professional_media_urls[0].substring(0, 60)}...`);
      }

      console.log('');
    });

    // Summary
    const withImages = data.filter(v => v.professional_media_urls && v.professional_media_urls.length > 0).length;
    const avgRating = (data.reduce((sum, v) => sum + parseFloat(v.rating || 0), 0) / data.length).toFixed(2);

    console.log(`📊 Summary:`);
    console.log(`   Total Venues: ${data.length}`);
    console.log(`   With Images: ${withImages}`);
    console.log(`   Average Rating: ${avgRating}/5.0`);
  } else {
    console.log('⚠️  No venues found in database');
  }
}

checkVenues();
