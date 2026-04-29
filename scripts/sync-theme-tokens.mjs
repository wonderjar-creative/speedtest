#!/usr/bin/env node

/**
 * Sync Theme Tokens
 *
 * Reads wordpress/theme/theme.json and generates:
 *   1. apps/headless/src/app/generated-tokens.css — Tailwind @theme + WP CSS custom properties
 *
 * Run: node scripts/sync-theme-tokens.mjs
 *
 * theme.json is the single source of truth for design tokens.
 */

import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

const themeJsonPath = resolve(ROOT, 'wordpress/theme/theme.json');
const outputPath = resolve(ROOT, 'apps/headless/src/app/generated-tokens.css');

// Read theme.json
const themeJson = JSON.parse(readFileSync(themeJsonPath, 'utf-8'));

const { settings, styles } = themeJson;
const colors = settings?.color?.palette || [];
const gradients = settings?.color?.gradients || [];
const spacingSizes = settings?.spacing?.spacingSizes || [];
const fontSizes = settings?.typography?.fontSizes || [];
const layout = settings?.layout || {};

// Convert "var:preset|font-size|base" → "var(--wp--preset--font-size--base)".
// Mirrors WP's saved-style reference syntax. Pass-through for anything else.
function resolvePresetReference(value) {
  if (typeof value !== 'string') return value;
  if (!value.startsWith('var:preset|')) return value;
  const parts = value.replace('var:preset|', '').split('|');
  return `var(--wp--preset--${parts.join('--')})`;
}

// ============================================
// Generate WP CSS Custom Properties (:root)
// ============================================

let wpVars = '';

// Colors
for (const c of colors) {
  wpVars += `  --wp--preset--color--${c.slug}: ${c.color};\n`;
}

// Gradients
for (const g of gradients) {
  wpVars += `  --wp--preset--gradient--${g.slug}: ${g.gradient};\n`;
}

// Spacing
for (const s of spacingSizes) {
  wpVars += `  --wp--preset--spacing--${s.slug}: ${s.size};\n`;
}

// Font sizes — pass-through; clamp() values live in theme.json.
for (const f of fontSizes) {
  wpVars += `  --wp--preset--font-size--${f.slug}: ${f.size};\n`;
}

// Layout
if (layout.contentSize) {
  wpVars += `  --wp--style--global--content-size: ${layout.contentSize};\n`;
}
if (layout.wideSize) {
  wpVars += `  --wp--style--global--wide-size: ${layout.wideSize};\n`;
}

// Root padding (derived from spacing)
const rootPaddingSlug = '50'; // "Regular" spacing used for root padding
wpVars += `  --wp--style--root--padding-right: var(--wp--preset--spacing--${rootPaddingSlug});\n`;
wpVars += `  --wp--style--root--padding-left: var(--wp--preset--spacing--${rootPaddingSlug});\n`;

// ============================================
// Generate Tailwind @theme block
// ============================================

let tailwindTheme = '';

for (const c of colors) {
  tailwindTheme += `  --color-${c.slug}: ${c.color};\n`;
}

// ============================================
// Generate global styles (from theme.json styles)
// ============================================

const fontFamily = styles?.typography?.fontFamily || 'system-ui, -apple-system, sans-serif';
const fontSize = resolvePresetReference(styles?.typography?.fontSize || '1rem');
const lineHeight = styles?.typography?.lineHeight || '1.5';
const bgColor = resolvePresetReference(styles?.color?.background || 'var(--wp--preset--color--white)');
const textColor = resolvePresetReference(styles?.color?.text || 'var(--wp--preset--color--gray-900)');

// Element styles
const linkColor = resolvePresetReference(styles?.elements?.link?.color?.text || 'var(--wp--preset--color--primary)');
const linkHoverColor = resolvePresetReference(styles?.elements?.link?.[':hover']?.color?.text || 'var(--wp--preset--color--accent)');
const headingColor = resolvePresetReference(styles?.elements?.heading?.color?.text || 'var(--wp--preset--color--gray-900)');
const headingWeight = styles?.elements?.heading?.typography?.fontWeight || '700';

// ============================================
// Generate WP utility classes
// ============================================

let utilityClasses = '';

// Text color utilities
for (const c of colors) {
  utilityClasses += `.has-${c.slug}-color { color: var(--wp--preset--color--${c.slug}); }\n`;
}
utilityClasses += '\n';

// Background color utilities
for (const c of colors) {
  utilityClasses += `.has-${c.slug}-background-color { background-color: var(--wp--preset--color--${c.slug}); }\n`;
}
utilityClasses += '\n';

// Border color utilities
for (const c of colors) {
  utilityClasses += `.has-${c.slug}-border-color { border-color: var(--wp--preset--color--${c.slug}); }\n`;
}
utilityClasses += '\n';

// Gradient utilities
for (const g of gradients) {
  utilityClasses += `.has-${g.slug}-gradient-background { background: var(--wp--preset--gradient--${g.slug}); }\n`;
}
utilityClasses += '\n';

// Font size utilities
for (const f of fontSizes) {
  utilityClasses += `.has-${f.slug}-font-size { font-size: var(--wp--preset--font-size--${f.slug}); }\n`;
}

// ============================================
// Assemble output
// ============================================

const output = `/**
 * Generated Design Tokens — DO NOT EDIT MANUALLY
 *
 * Source: wordpress/theme/theme.json
 * Generated by: scripts/sync-theme-tokens.mjs
 * Run: node scripts/sync-theme-tokens.mjs
 */


/* ============================================
   CSS Custom Properties (from theme.json)
   ============================================ */

:root {
${wpVars}}


/* ============================================
   Tailwind Theme Tokens
   ============================================ */

@theme {
${tailwindTheme}}


/* ============================================
   Global Styles (from theme.json styles)
   ============================================ */

body {
  background-color: ${bgColor};
  color: ${textColor};
  font-family: ${fontFamily};
  font-size: ${fontSize};
  line-height: ${lineHeight};
}

a {
  color: ${linkColor};
}
a:hover {
  color: ${linkHoverColor};
}

h1, h2, h3, h4, h5, h6 {
  color: ${headingColor};
  font-weight: ${headingWeight};
}


/* ============================================
   Color Utility Classes (has-*-color, has-*-background-color)
   ============================================ */

/* Text Colors */
${utilityClasses}

/* ============================================
   Typography Utility Classes
   ============================================ */

.has-text-color { /* marker class, color set by specific class */ }
.has-background { /* marker class, background set by specific class */ }
.has-text-align-left { text-align: left; }
.has-text-align-center { text-align: center; }
.has-text-align-right { text-align: right; }
.has-drop-cap::first-letter {
  float: left;
  font-size: 3.25em;
  line-height: 0.68;
  font-weight: 100;
  margin: 0.05em 0.1em 0 0;
  text-transform: uppercase;
  font-style: normal;
}
`;

// Ensure output directory exists
mkdirSync(dirname(outputPath), { recursive: true });
writeFileSync(outputPath, output, 'utf-8');

console.log(`Generated: ${outputPath}`);
console.log(`  Colors: ${colors.length}`);
console.log(`  Gradients: ${gradients.length}`);
console.log(`  Spacing sizes: ${spacingSizes.length}`);
console.log(`  Font sizes: ${fontSizes.length}`);
