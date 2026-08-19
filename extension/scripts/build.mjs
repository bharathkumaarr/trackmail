import * as esbuild from 'esbuild';
import { mkdirSync } from 'fs';

const watch = process.argv.includes('--watch');

const entries = {
  'content.js': 'src/content/index.ts',
  'background.js': 'src/background/index.ts',
  'popup.js': 'src/popup/index.ts',
};

mkdirSync('dist', { recursive: true });

const buildOptions = {
  entryPoints: Object.entries(entries).map(([out, entry]) => ({ in: entry, out: out.replace('.js', '') })),
  bundle: true,
  outdir: 'dist',
  format: 'esm',
  target: 'chrome120',
  sourcemap: true,
};

if (watch) {
  const ctx = await esbuild.context(buildOptions);
  await ctx.watch();
  console.log('watching...');
} else {
  await esbuild.build(buildOptions);
  // Copy static assets
  const { cpSync } = await import('fs');
  cpSync('manifest.json', 'dist/manifest.json');
  cpSync('public', 'dist', { recursive: true });
  console.log('build complete → dist/');
}
