import fs from 'fs';
import path from 'path';

const WP_THEME = process.env.WP_THEME || 'speedtest-backend';

interface Pattern {
  name: string;
  blocksJSON: string;
}

const getPattern = (patternName: string): Pattern | null => {
  try {
    const dataDir = path.join(process.cwd(), 'data');

    // Strip the theme prefix if it exists
    if (patternName.startsWith(WP_THEME + '/')) {
      patternName = patternName.replace(WP_THEME + '/', '');
    }
    const filename = path.join(dataDir, `patterns.${patternName}.json`);
    if (!fs.existsSync(filename)) {
      console.warn('Pattern file not found:', filename);
      return null;
    }
    const fileContent = fs.readFileSync(filename, 'utf-8');
    const pattern = JSON.parse(fileContent);
    return {
      name: patternName,
      blocksJSON: pattern.blocksJSON,
    };
  } catch (error) {
    console.error('Error reading pattern structure:', error);
    return null;
  }
}

export default getPattern;
