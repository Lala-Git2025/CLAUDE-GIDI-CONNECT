#!/usr/bin/env node

/**
 * Clear old news from Supabase database
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function clearOldNews() {
  console.log('🗑️  Clearing old news from database...\n');

  try {
    const { data, error } = await supabase
      .from('news')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all

    if (error) {
      console.error('❌ Error:', error.message);
      return;
    }

    console.log('✅ Old news cleared successfully!');
  } catch (err) {
    console.error('❌ Failed to clear news:', err);
  }
}

clearOldNews();
