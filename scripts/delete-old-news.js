#!/usr/bin/env node

/**
 * Delete ALL news from database to ensure fresh start
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials in .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function deleteAllNews() {
  console.log('🗑️  Deleting ALL news from database...\n');

  try {
    // Delete all news articles
    const { error } = await supabase
      .from('news')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all except impossible ID

    if (error) {
      console.error('❌ Error deleting news:', error);
      process.exit(1);
    }

    console.log('✅ SUCCESS: All news deleted from database');
    console.log('📝 Database is now empty and ready for fresh news\n');

  } catch (error) {
    console.error('❌ Fatal error:', error.message);
    process.exit(1);
  }
}

// Run the deletion
deleteAllNews();
