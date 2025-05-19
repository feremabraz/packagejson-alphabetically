#!/usr/bin/env node

import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * Recursively sorts the keys of an object alphabetically. If a value is a plain object, it is sorted as well.
 * @param {object} obj - The object to sort
 * @returns {object} - The sorted object
 */
export function sortPackageJsonObject(obj) {
  if (Array.isArray(obj) || obj === null || typeof obj !== 'object') return obj;
  return Object.fromEntries(
    Object.keys(obj)
      .sort()
      .map((key) => [key, sortPackageJsonObject(obj[key])]),
  );
}

/**
 * Reads, sorts, and writes a package.json file.
 * @param {string} path - Path to package.json
 * @returns {object} - The sorted object
 * @throws {Error} - If file read/write or JSON parsing fails
 */
export function sortPackageJsonFile(path) {
  const raw = readFileSync(path, 'utf8');
  const packageJson = JSON.parse(raw);
  const sorted = sortPackageJsonObject(packageJson);
  writeFileSync(path, `${JSON.stringify(sorted, null, 2)}\n`, 'utf8');
  return sorted;
}

/**
 * Checks if an object is deeply equal to another (used for --check CLI mode)
 * @param {any} a
 * @param {any} b
 * @returns {boolean}
 */
function deepEqual(a, b) {
  if (a === b) return true;
  if (typeof a !== typeof b) return false;
  if (typeof a !== 'object' || a === null || b === null) return false;
  if (Array.isArray(a) !== Array.isArray(b)) return false;
  if (Array.isArray(a))
    return a.length === b.length && a.every((v, i) => deepEqual(v, b[i]));
  const aKeys = Object.keys(a);
  const bKeys = Object.keys(b);
  if (aKeys.length !== bKeys.length) return false;
  return aKeys.every((k) => deepEqual(a[k], b[k]));
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  // CLI usage
  const args = process.argv.slice(2);
  let filePath = join(process.cwd(), 'package.json');
  let check = false;
  let dryRun = false;

  for (const arg of args) {
    if (arg === '--check') check = true;
    else if (arg === '--dry-run') dryRun = true;
    else if (!arg.startsWith('-')) filePath = arg;
  }

  try {
    const raw = readFileSync(filePath, 'utf8');
    const parsed = JSON.parse(raw);
    const sorted = sortPackageJsonObject(parsed);
    const sortedString = `${JSON.stringify(sorted, null, 2)}\n`;

    if (check) {
      if (deepEqual(parsed, sorted)) {
        console.log('package.json is sorted.');
        process.exit(0);
      }
      console.error('package.json is NOT sorted.');
      process.exit(1);
    }

    if (dryRun) {
      process.stdout.write(sortedString);
      process.exit(0);
    }

    writeFileSync(filePath, sortedString, 'utf8');
    console.log('Sorted package.json');
    process.exit(0);
  } catch (err) {
    if (err.code === 'ENOENT') {
      console.error(`File not found: ${filePath}`);
      process.exit(1);
    }
    if (err instanceof SyntaxError) {
      console.error(`Invalid JSON in: ${filePath}`);
      process.exit(1);
    }
    console.error('Error:', err.message);
    process.exit(1);
  }
}
