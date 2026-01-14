#!/usr/bin/env node

/**
 * Remove duplicate news articles from database
 * Keeps the most recent entry for each unique URL
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

async function removeDuplicates() {
  console.log('🔍 Checking for duplicate news articles...\n');

  try {
    // Fetch all news articles
    const { data: allNews, error: fetchError } = await supabase
      .from('news')
      .select('*')
      .order('publish_date', { ascending: false });

    if (fetchError) {
      console.error('❌ Error fetching news:', fetchError);
      process.exit(1);
    }

    console.log(`📊 Total articles in database: ${allNews.length}\n`);

    // Group by URL and find duplicates
    const urlMap = new Map();
    const duplicates = [];

    allNews.forEach(article => {
      const url = article.external_url;

      if (!urlMap.has(url)) {
        // First occurrence - keep this one
        urlMap.set(url, article);
      } else {
        // Duplicate found - mark for deletion
        const existing = urlMap.get(url);

        // Keep the one with the most recent publish_date
        const existingDate = new Date(existing.publish_date);
        const currentDate = new Date(article.publish_date);

        if (currentDate > existingDate) {
          // Current article is newer, delete the old one
          duplicates.push(existing.id);
          urlMap.set(url, article);
        } else {
          // Existing article is newer, delete current one
          duplicates.push(article.id);
        }
      }
    });

    console.log(`🔍 Found ${duplicates.length} duplicate articles\n`);

    if (duplicates.length === 0) {
      console.log('✅ No duplicates found! Database is clean.\n');
      return;
    }

    // Show which URLs have duplicates
    const duplicateUrls = new Set();
    allNews.forEach(article => {
      if (duplicates.includes(article.id)) {
        duplicateUrls.add(article.external_url);
      }
    });

    console.log('📋 URLs with duplicates:');
    duplicateUrls.forEach(url => {
      const articles = allNews.filter(a => a.external_url === url);
      console.log(`   - ${articles[0].title.substring(0, 60)}... (${articles.length} copies)`);
    });
    console.log('');

    // Delete duplicates
    console.log(`🗑️  Deleting ${duplicates.length} duplicate articles...\n`);

    const { error: deleteError } = await supabase
      .from('news')
      .delete()
      .in('id', duplicates);

    if (deleteError) {
      console.error('❌ Error deleting duplicates:', deleteError);
      process.exit(1);
    }

    console.log('✅ SUCCESS: Duplicates removed');
    console.log(`📊 Database now has ${allNews.length - duplicates.length} unique articles\n`);

    // Show remaining articles
    const { data: remainingNews } = await supabase
      .from('news')
      .select('title, publish_date')
      .order('publish_date', { ascending: false });

    console.log('📰 Current articles in database:');
    remainingNews.forEach((article, i) => {
      const date = new Date(article.publish_date).toISOString().split('T')[0];
      console.log(`   ${i + 1}. ${article.title.substring(0, 60)}... (${date})`);
    });

  } catch (error) {
    console.error('❌ Fatal error:', error.message);
    process.exit(1);
  }
}

// Run the cleanup
removeDuplicates();
