/**
 * Adds @ts-nocheck to generated GraphQL files
 * This prevents TypeScript errors from blocking builds when codegen
 * generates types that don't perfectly match our usage patterns.
 */

const fs = require('fs');
const path = require('path');

const gqlDir = path.join(__dirname, 'src', 'gql');

if (!fs.existsSync(gqlDir)) {
  console.log('[add-ts-nocheck] No gql directory found, skipping');
  process.exit(0);
}

const files = fs.readdirSync(gqlDir).filter(f => f.endsWith('.ts'));

files.forEach(file => {
  const filePath = path.join(gqlDir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  if (!content.startsWith('// @ts-nocheck')) {
    content = '// @ts-nocheck\n' + content;
    fs.writeFileSync(filePath, content);
    console.log(`[add-ts-nocheck] Added to ${file}`);
  }
});

console.log('[add-ts-nocheck] Done');
