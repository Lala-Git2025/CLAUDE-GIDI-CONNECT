#!/usr/bin/env node

/**
 * Clear all venues from database
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function clearVenues() {
  console.log('🗑️  Clearing all venues from database...\n');

  const { error } = await supabase
    .from('venues')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all rows

  if (error) {
    console.error('❌ Error:', error.message);
    return;
  }

  console.log('✅ All venues cleared successfully!\n');
}

clearVenues();
