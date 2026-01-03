/**
 * Fetches WordPress template structure (template parts, patterns, navigation)
 * and caches them locally for faster builds.
 *
 * This script is run before dev/build to pre-fetch template data.
 */

require('dotenv').config({ path: '.env.development.local' });
require('dotenv').config({ path: '.env.local' });
require('dotenv').config({ path: '.env' });

const fs = require('fs');
const path = require('path');

const WP_URL = process.env.NEXT_PUBLIC_WORDPRESS_API_URL;
const WP_USER = process.env.WP_USER;
const WP_APP_PASS = process.env.WP_APP_PASS;

if (!WP_URL) {
  console.error('ERROR: NEXT_PUBLIC_WORDPRESS_API_URL is not defined');
  process.exit(1);
}

const DATA_DIR = path.join(__dirname, '..', 'data');

async function fetchWithAuth(url) {
  const headers = {};

  if (WP_USER && WP_APP_PASS) {
    const auth = Buffer.from(`${WP_USER}:${WP_APP_PASS}`).toString('base64');
    headers['Authorization'] = `Basic ${auth}`;
  }

  const response = await fetch(url, { headers });

  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
  }

  return response.json();
}

async function main() {
  console.log('[fetch-wp-template-structure] Starting...');
  console.log(`[fetch-wp-template-structure] WordPress URL: ${WP_URL}`);

  // Create data directory if it doesn't exist
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  try {
    // Fetch template structure from custom REST endpoint
    // This endpoint should be implemented in your WordPress theme
    const templateUrl = `${WP_URL}/wp-json/template-structure/v1/full`;
    console.log(`[fetch-wp-template-structure] Fetching: ${templateUrl}`);

    const data = await fetchWithAuth(templateUrl);

    // Write to cache file
    const cacheFile = path.join(DATA_DIR, 'template-structure.json');
    fs.writeFileSync(cacheFile, JSON.stringify(data, null, 2));

    console.log(`[fetch-wp-template-structure] Cached to: ${cacheFile}`);
    console.log('[fetch-wp-template-structure] Done!');
  } catch (error) {
    console.warn(`[fetch-wp-template-structure] Warning: ${error.message}`);
    console.warn('[fetch-wp-template-structure] Continuing without cached templates...');

    // Create empty cache file so build doesn't fail
    const cacheFile = path.join(DATA_DIR, 'template-structure.json');
    if (!fs.existsSync(cacheFile)) {
      fs.writeFileSync(cacheFile, JSON.stringify({ templateParts: [], patterns: [] }, null, 2));
    }
  }
}

main();
