import fs from 'fs';
import path from 'path';

interface Template {
  name: string;
  blocksJSON: string;
}

const getTemplate = (templateName: string): Template | null => {
  try {
    const dataDir = path.join(process.cwd(), 'data');
    const filename = path.join(dataDir, `templates.${templateName}.json`);
    if (!fs.existsSync(filename)) {
      console.warn('Template file not found:', filename);
      return null;
    }
    const fileContent = fs.readFileSync(filename, 'utf-8');
    const template = JSON.parse(fileContent);
    return {
      name: templateName,
      blocksJSON: template.blocksJSON,
    };
  } catch (error) {
    console.error('Error reading template:', error);
    return null;
  }
}

export default getTemplate;
