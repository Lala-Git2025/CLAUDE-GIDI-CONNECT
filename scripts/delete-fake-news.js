#!/usr/bin/env node

/**
 * Delete fake news articles (articles without valid external URLs)
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

async function deleteFakeNews() {
  console.log('🔍 Checking for fake news articles (without valid URLs)...\n');

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

    // Find articles without valid URLs
    const fakeNews = allNews.filter(article => {
      // Check if external_url is missing, null, or is a generic/fake URL
      if (!article.external_url) {
        return true;
      }

      const url = article.external_url.toLowerCase();

      // Check for fake/generic URLs
      const fakeUrlPatterns = [
        'example.com',
        'localhost',
        'test.com',
        'placeholder',
        '#',
        'javascript:',
        'about:blank'
      ];

      return fakeUrlPatterns.some(pattern => url.includes(pattern));
    });

    console.log(`🚫 Found ${fakeNews.length} fake articles without valid URLs\n`);

    if (fakeNews.length === 0) {
      console.log('✅ No fake articles found! Database is clean.\n');
      return;
    }

    // Show which articles are fake
    console.log('📋 Fake articles to be deleted:');
    fakeNews.forEach((article, index) => {
      const date = new Date(article.publish_date).toISOString().split('T')[0];
      const url = article.external_url || '(no URL)';
      console.log(`   ${index + 1}. ${article.title.substring(0, 60)}...`);
      console.log(`      URL: ${url}`);
      console.log(`      Date: ${date}\n`);
    });

    // Delete fake articles
    const fakeIds = fakeNews.map(article => article.id);

    console.log(`🗑️  Deleting ${fakeNews.length} fake articles...\n`);

    const { error: deleteError } = await supabase
      .from('news')
      .delete()
      .in('id', fakeIds);

    if (deleteError) {
      console.error('❌ Error deleting fake articles:', deleteError);
      process.exit(1);
    }

    console.log('✅ SUCCESS: Fake articles deleted');
    console.log(`📊 Database now has ${allNews.length - fakeNews.length} real articles with valid URLs\n`);

    // Show remaining articles
    const { data: remainingNews } = await supabase
      .from('news')
      .select('title, external_url, publish_date')
      .order('publish_date', { ascending: false });

    console.log('📰 Remaining articles (all with valid URLs):');
    remainingNews.forEach((article, i) => {
      const date = new Date(article.publish_date).toISOString().split('T')[0];
      console.log(`   ${i + 1}. ${article.title.substring(0, 50)}... (${date})`);
      console.log(`      ${article.external_url.substring(0, 70)}...\n`);
    });

  } catch (error) {
    console.error('❌ Fatal error:', error.message);
    process.exit(1);
  }
}

// Run the cleanup
deleteFakeNews();
