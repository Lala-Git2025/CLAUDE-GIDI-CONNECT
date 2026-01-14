#!/usr/bin/env node

/**
 * Check full news items including URLs
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function checkNews() {
  console.log('📰 Checking full news items in database...\n');

  const { data, error } = await supabase
    .from('news')
    .select('title, category, featured_image_url, external_url')
    .order('publish_date', { ascending: false })
    .limit(10);

  if (error) {
    console.error('❌ Error:', error.message);
    return;
  }

  console.log(`Found ${data.length} news items:\n`);

  data.forEach((item, index) => {
    console.log(`${index + 1}. ${item.title}`);
    console.log(`   Category: ${item.category}`);
    console.log(`   Image: ${item.featured_image_url || '❌ NO IMAGE'}`);
    console.log(`   URL: ${item.external_url || '❌ NO URL'}`);
    console.log('');
  });
}

checkNews();
