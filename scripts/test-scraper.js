#!/usr/bin/env node

import axios from 'axios';
import * as cheerio from 'cheerio';

async function testScrape() {
  const url = 'https://punchng.com';

  console.log(`Testing ${url}...`);

  const response = await axios.get(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
    }
  });

  const $ = cheerio.load(response.data);

  console.log('\nTrying different selectors:\n');

  // Test various selectors
  const selectors = [
    'h2 a',
    'h3 a',
    '.entry-title a',
    'article h2 a',
    'article h3 a',
    '.post-title a'
  ];

  selectors.forEach(selector => {
    const count = $(selector).length;
    console.log(`${selector}: ${count} matches`);
    if (count > 0) {
      const firstTitle = $(selector).first().text().trim();
      const firstUrl = $(selector).first().attr('href');
      console.log(`  → First: "${firstTitle.substring(0, 50)}..."`);
      console.log(`  → URL: ${firstUrl}`);
    }
  });
}

testScrape().catch(console.error);
