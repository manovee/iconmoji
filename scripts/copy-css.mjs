import { copyFile, mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

async function copy() {
  const rootDir = dirname(fileURLToPath(import.meta.url));
  const projectDir = resolve(rootDir, '..');
  const source = resolve(projectDir, 'src/styles.css');
  const target = resolve(projectDir, 'dist/styles.css');

  await mkdir(dirname(target), { recursive: true });
  await copyFile(source, target);
}

copy().catch(console.error);
