import { readdirSync, readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';

const srcDir = join(__dirname, '..', 'src', 'descriptions');
const outDir = join(__dirname, '..', 'src', 'generated');
const outFile = join(outDir, 'description-map.ts');

mkdirSync(outDir, { recursive: true });

const entries = readdirSync(srcDir)
  .filter((f) => f.endsWith('.md'))
  .map((f) => {
    const raw = readFileSync(join(srcDir, f), 'utf8')
      // escape back-ticks and `${…}` so they survive inside a template literal
      .replace(/`/g, '\\`')
      .replace(/\$\{/g, '\\${');
    return `  "${f}": \`${raw}\``;
  })
  .join(',\n');

writeFileSync(
  outFile,
  `/* AUTO-GENERATED — DO NOT EDIT MANUALLY */
export const descriptionMap: Record<string, string> = {
${entries}
};\n`
);
console.log(`✔︎ Wrote ${outFile}`);
