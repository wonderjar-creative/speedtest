#!/usr/bin/env node

/**
 * Sync Templates
 *
 * Fetches WP template/pattern structure and saves to apps/headless/data/
 *
 * Run: node scripts/sync-templates.mjs
 */

import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { dirname, join, resolve } from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const __dirname = dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);
const ROOT = resolve(__dirname, '..');
const HEADLESS = join(ROOT, 'apps', 'headless');

// Load env files in reverse priority (lowest first, highest last overrides)
// Matches Next.js behavior: .env < .env.local
const envFiles = ['.env', '.env.local'];

for (const envFile of envFiles) {
  const envPath = join(HEADLESS, envFile);
  if (existsSync(envPath)) {
    require(join(HEADLESS, 'node_modules', 'dotenv')).config({ path: envPath, override: true });
    console.log(`Loaded env from: ${envFile}`);
  }
}

const WP_API = process.env.NEXT_PUBLIC_WORDPRESS_API_URL || 'http://localhost:8000';
const WP_USER = process.env.WP_USER;
const WP_APP_PASS = process.env.WP_APP_PASS;

const outDir = join(HEADLESS, 'data');
if (!existsSync(outDir)) mkdirSync(outDir);

try {
  const url = `${WP_API}/wp-json/template-structure/v1/full`;
  console.log(`Fetching: ${url}`);

  const headers = {};
  if (WP_USER && WP_APP_PASS) {
    const auth = Buffer.from(`${WP_USER}:${WP_APP_PASS}`).toString('base64');
    headers['Authorization'] = `Basic ${auth}`;
  }

  const res = await fetch(url, { headers });
  if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.statusText}`);

  const data = await res.json();

  // Save each type to separate files (parts.header.json, patterns.hero.json, etc.)
  for (const [type, items] of Object.entries(data)) {
    for (const [slug, itemData] of Object.entries(items)) {
      const filename = `${type}.${slug}.json`;
      writeFileSync(join(outDir, filename), JSON.stringify(itemData, null, 2));
      console.log(`Saved: ${filename}`);
    }
  }

  console.log('Done!');
} catch (error) {
  console.error('Error:', error.message);
  console.warn('Continuing without cached templates...');
}
