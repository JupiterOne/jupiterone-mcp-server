import { readFileSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

export function loadDescription(filename: string): string {
  const filePath = join(__dirname, '..', 'descriptions', filename);
  return readFileSync(filePath, 'utf-8');
}
