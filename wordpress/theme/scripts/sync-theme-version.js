/**
 * Syncs version from package.json to style.css and functions.php
 */

const fs = require('fs');
const path = require('path');

const packageJson = require('../package.json');
const version = packageJson.version;

// Update style.css
const stylePath = path.join(__dirname, '..', 'style.css');
let styleContent = fs.readFileSync(stylePath, 'utf8');
styleContent = styleContent.replace(/Version: .+/g, `Version: ${version}`);
fs.writeFileSync(stylePath, styleContent);
console.log(`Updated style.css to version ${version}`);

// Update functions.php
const functionsPath = path.join(__dirname, '..', 'functions.php');
let functionsContent = fs.readFileSync(functionsPath, 'utf8');
functionsContent = functionsContent.replace(
  /define\(\s*'PROJECT_THEME_VERSION',\s*'.+'\s*\)/,
  `define( 'PROJECT_THEME_VERSION', '${version}' )`
);
fs.writeFileSync(functionsPath, functionsContent);
console.log(`Updated functions.php to version ${version}`);

console.log('Version sync complete!');
