#!/usr/bin/env node

/**
 * Check news items in Supabase database
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function checkNews() {
  console.log('📰 Checking news in Supabase database...\n');

  const { data, error } = await supabase
    .from('news')
    .select('*')
    .order('publish_date', { ascending: false })
    .limit(10);

  if (error) {
    console.error('❌ Error:', error.message);
    return;
  }

  if (!data || data.length === 0) {
    console.log('⚠️  No news items found in database');
    return;
  }

  console.log(`✅ Found ${data.length} news items:\n`);

  data.forEach((item, index) => {
    console.log(`${index + 1}. ${item.title}`);
    console.log(`   Category: ${item.category}`);
    console.log(`   Summary: ${item.summary}`);
    console.log(`   Source: ${item.source || 'AI Agent'}`);
    console.log(`   Published: ${new Date(item.publish_date).toLocaleString()}`);
    if (item.external_url) {
      console.log(`   URL: ${item.external_url}`);
    }
    console.log('');
  });
}

checkNews();
