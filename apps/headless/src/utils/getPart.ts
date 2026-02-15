import fs from 'fs';
import path from 'path';

interface Part {
  name: string;
  blocksJSON: string;
}

const getPart = (partName: string): Part | null => {
  try {
    const dataDir = path.join(process.cwd(), 'data');
    const filename = path.join(dataDir, `parts.${partName}.json`);
    if (!fs.existsSync(filename)) {
      console.warn('Part file not found:', filename);
      return null;
    }
    const fileContent = fs.readFileSync(filename, 'utf-8');
    const part = JSON.parse(fileContent);
    return {
      name: partName,
      blocksJSON: part.blocksJSON,
    };
  } catch (error) {
    console.error('Error reading part:', error);
    return null;
  }
}

export default getPart;
