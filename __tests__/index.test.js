import { describe, expect, it } from 'vitest';
import { sortPackageJsonObject } from '../index.js';

// --- Pure function tests ---
describe('sortPackageJsonObject', () => {
  it('should sort package.json keys alphabetically', () => {
    const input = {
      version: '1.0.0',
      name: 'test-package',
      scripts: {
        start: 'node index.js',
        test: 'echo "Error: no test specified"',
      },
      devDependencies: {
        vitest: '^0.1.0',
      },
      description: 'A test package',
      dependencies: {
        axios: '^0.21.1',
        express: '^4.17.1',
      },
    };
    const expected = {
      dependencies: {
        axios: '^0.21.1',
        express: '^4.17.1',
      },
      description: 'A test package',
      devDependencies: {
        vitest: '^0.1.0',
      },
      name: 'test-package',
      scripts: {
        start: 'node index.js',
        test: 'echo "Error: no test specified"',
      },
      version: '1.0.0',
    };
    expect(sortPackageJsonObject(input)).toEqual(expected);
  });

  it('should deeply sort nested objects (dependencies, scripts)', () => {
    const input = {
      dependencies: { zzz: '1', aaa: '2', mmm: '3' },
      scripts: { build: 'a', lint: 'b', test: 'c' },
    };
    const expected = {
      dependencies: { aaa: '2', mmm: '3', zzz: '1' },
      scripts: { build: 'a', lint: 'b', test: 'c' },
    };
    expect(sortPackageJsonObject(input)).toEqual(expected);
  });

  it('should handle empty package.json', () => {
    expect(sortPackageJsonObject({})).toEqual({});
  });

  it('should handle package.json with only some fields', () => {
    const input = {
      name: 'minimal-package',
      version: '1.0.0',
    };
    const expected = {
      name: 'minimal-package',
      version: '1.0.0',
    };
    expect(sortPackageJsonObject(input)).toEqual(expected);
  });

  it('should handle package.json with nested objects', () => {
    const input = {
      name: 'nested-package',
      version: '1.0.0',
      scripts: {
        test: 'vitest',
        build: 'tsc',
        start: 'node dist/index.js',
      },
      config: {
        port: 3000,
        environment: 'development',
      },
    };
    const expected = {
      config: {
        environment: 'development',
        port: 3000,
      },
      name: 'nested-package',
      scripts: {
        build: 'tsc',
        start: 'node dist/index.js',
        test: 'vitest',
      },
      version: '1.0.0',
    };
    expect(sortPackageJsonObject(input)).toEqual(expected);
  });
});

// --- CLI/FS/Errors: These would require integration tests or mocks (not implemented here for brevity) ---
// You can add integration tests using Vitest's spawn/exec utilities or with a tool like execa for CLI behavior.
// Example: test --check, --dry-run, custom path, and error handling.
