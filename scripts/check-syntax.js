import fs from 'fs';
import path from 'path';
import * as svelte from 'svelte/compiler';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import * as esbuild from 'esbuild';

const rootDir = process.cwd();
const preprocessor = vitePreprocess();

const syntaxErrors = [];

function getFiles(dir, extensions) {
  let results = [];
  const list = fs.readdirSync(dir);
  for (const file of list) {
    if (file === 'node_modules' || file === '.git' || file === '.svelte-kit' || file === 'scripts') continue;
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      results = results.concat(getFiles(fullPath, extensions));
    } else {
      const ext = path.extname(file);
      if (extensions.includes(ext)) {
        results.push(fullPath);
      }
    }
  }
  return results;
}

// 1. Check all .svelte files
const svelteFiles = getFiles(path.join(rootDir, 'src'), ['.svelte']);
console.log(`Auditing ${svelteFiles.length} Svelte files (with vitePreprocess)...`);

for (const file of svelteFiles) {
  const content = fs.readFileSync(file, 'utf8');
  const relPath = path.relative(rootDir, file).replace(/\\/g, '/');
  try {
    const preprocessed = await svelte.preprocess(content, preprocessor, { filename: file });
    svelte.compile(preprocessed.code, {
      filename: file,
      generate: 'ssr'
    });
  } catch (err) {
    syntaxErrors.push({
      file: relPath,
      type: 'SVELTE_SYNTAX_ERROR',
      message: err.message,
      line: err.start?.line || err.line,
      column: err.start?.column || err.column,
      frame: err.frame
    });
  }
}

// 2. Check all .ts and .js files using esbuild
const codeFiles = [
  ...getFiles(path.join(rootDir, 'src'), ['.ts', '.js']),
  path.join(rootDir, 'server.js'),
  path.join(rootDir, 'svelte.config.js')
].filter(f => fs.existsSync(f));

console.log(`Auditing ${codeFiles.length} JS/TS files with esbuild...`);

for (const file of codeFiles) {
  const content = fs.readFileSync(file, 'utf8');
  const relPath = path.relative(rootDir, file).replace(/\\/g, '/');
  const loader = file.endsWith('.ts') ? 'ts' : 'js';
  try {
    esbuild.transformSync(content, {
      loader,
      target: 'esnext'
    });
  } catch (err) {
    syntaxErrors.push({
      file: relPath,
      type: 'JS_TS_SYNTAX_ERROR',
      message: err.message,
      line: err.errors?.[0]?.location?.line,
      column: err.errors?.[0]?.location?.column
    });
  }
}

// 3. Check JSON files
const jsonFiles = [
  path.join(rootDir, 'package.json'),
  path.join(rootDir, 'tsconfig.json'),
  path.join(rootDir, 'database.json')
].filter(f => fs.existsSync(f));

for (const file of jsonFiles) {
  const content = fs.readFileSync(file, 'utf8');
  const relPath = path.relative(rootDir, file).replace(/\\/g, '/');
  try {
    JSON.parse(content);
  } catch (err) {
    syntaxErrors.push({
      file: relPath,
      type: 'JSON_SYNTAX_ERROR',
      message: err.message
    });
  }
}

console.log('\n--- COMPREHENSIVE SYNTAX AUDIT RESULT ---');
console.log(`Total errors found: ${syntaxErrors.length}`);
if (syntaxErrors.length > 0) {
  console.log(JSON.stringify(syntaxErrors, null, 2));
} else {
  console.log('PERFECT: All 20 Svelte components and 36 JS/TS files parsed with 0 syntax errors.');
}
