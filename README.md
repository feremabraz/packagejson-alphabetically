# packagejson-alphabetically (reborn)

Sorts package.json alphabetically.

I lost my old npm account XD, so I had to publish this under a new name, sorry!

![packagejson-alphabetically](assets/packagejson-alphabetically.png)

## <u>How to use</u>

As a dev dependency:

```sh
pnpm add --save-dev packagejson-alphabetically-reborn
pnpm exec packagejson-alphabetically
```

Directly:

```sh
pnpm dlx packagejson-alphabetically-reborn
```

## CLI Options

- `pnpm exec packagejson-alphabetically [path]` — Sorts the specified package.json file (default: `./package.json`).
- `--check` — Checks if the file is already sorted. Exits with code 0 if sorted, 1 if not. Useful for CI/linting.
- `--dry-run` — Prints the sorted output to stdout without writing to disk.

### Examples

Sort the default package.json:
```sh
pnpm exec packagejson-alphabetically
```

Sort a custom path:
```sh
pnpm exec packagejson-alphabetically ./some/other/package.json
```

Check if sorted (CI/lint):
```sh
pnpm exec packagejson-alphabetically --check
```

Preview sorted output without writing:
```sh
pnpm exec packagejson-alphabetically --dry-run
```

## Features
- Deep sorting: All nested objects (e.g., dependencies, devDependencies, scripts) are sorted alphabetically.
- Robust error handling: Handles missing files, invalid JSON, and write errors with clear messages.

## Error Handling
- If the specified file does not exist, you will see a "File not found" error.
- If the file contains invalid JSON, you will see an "Invalid JSON" error.
- Any other errors will be shown with a descriptive message.
