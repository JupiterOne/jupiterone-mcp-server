import { readFileSync } from 'fs';
import { join } from 'path';

export function loadDescription(name: string): string {
  try {
    const filePath = join(process.cwd(), 'src', 'descriptions', `${name}.md`);
    const content = readFileSync(filePath, 'utf-8');
    return content;
  } catch (error) {
    console.error(`Error loading description for ${name}:`, error);
    return '';
  }
}
