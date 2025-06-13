import { readFileSync } from 'fs';
import { join } from 'path';

// Determine the directory of this module in both CommonJS and ESM without
// leaving a static `import.meta` reference in the compiled output (which
// causes warnings/errors when tools like esbuild transpile to CJS).
let baseDir: string;

if (typeof __dirname !== 'undefined' || true) {
  // Running in CommonJS – `__dirname` is available.
  baseDir = __dirname;
}

export function loadDescription(filename: string): string {
  const filePath = join(baseDir, '..', 'descriptions', filename);
  return readFileSync(filePath, 'utf-8');
}
