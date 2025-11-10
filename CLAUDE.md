# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

This is a minimal, zero-dependency TypeScript utility package that wraps promises and returns a discriminated union `{ data | error }` for type-safe error handling. The pattern is inspired by Theo Browne (t3dotgg).

## Development Commands

```bash
# Install dependencies
npm install

# Build the package (generates CJS, ESM, and type definitions)
npm run build

# Lint code
npm run lint

# Auto-fix linting issues
npm run lint:fix

# Format code with Prettier
npm run format

# Check formatting without modifying files
npm run format:check

# Publish to npm (requires NPM_TOKEN)
npm publish --access public
```

## Package Architecture

### Build System
The package uses a **dual-module strategy** to support both CommonJS and ESM:

- **CommonJS build**: TypeScript compiles to `dist/index.js` with `--module commonjs`
- **ESM build**: TypeScript compiles to intermediate dir, then moved to `dist/index.mjs` with `--module esnext`
- **Type definitions**: Generated separately to `dist/index.d.ts` with `--declaration --emitDeclarationOnly`

The `package.json` exports field provides proper module resolution:
```json
{
  "main": "dist/index.js",      // CJS entry point
  "module": "dist/index.mjs",   // ESM entry point
  "types": "dist/index.d.ts",   // TypeScript types
  "exports": {
    ".": {
      "import": "./dist/index.mjs",
      "require": "./dist/index.js",
      "types": "./dist/index.d.ts"
    }
  }
}
```

### Source Structure
All source code lives in `src/index.ts` - a single file containing:
1. Type definitions (`Success<T>`, `Failure<E>`, `Result<T, E>`)
2. Main export function `tryCatch<T, E>(promise: Promise<T>)`
3. Type exports for external use

The `tryCatch` function is intentionally simple (10 lines) - it wraps a promise in try-catch and returns a discriminated union.

## CI/CD Workflow

### Automated Publishing
The package uses GitHub Actions for **automatic versioning and publishing** on every push to `main`:

1. **Version bump**: Auto-increments patch version (0.0.1 → 0.0.2 → 0.0.3)
2. **Quality checks**: Runs lint and format checks
3. **Build**: Compiles TypeScript to all target formats
4. **Commit**: Commits the version bump with `[skip ci]` to avoid loops
5. **Publish**: Publishes to npm with provenance

**Required Secret**: Add `NPM_TOKEN` to GitHub repository secrets for automated publishing.

### Pre-commit Hooks
Husky runs on every commit:
- Auto-fixes linting issues (`npm run lint:fix`)
- Auto-formats code (`npm run format`)
- Stages all changes (`git add -A .`)

## Code Quality

- **ESLint**: Configured with TypeScript, Prettier integration
- **Prettier**: Enforces consistent code style
- **TypeScript**: Strict mode enabled
- **JSDoc**: Comprehensive documentation with examples in source code

## Package Distribution

Only these files are published to npm (via `package.json` `files` field):
- `dist/` - Compiled JavaScript, ESM, and type definitions
- `README.md` - Usage documentation
- `LICENSE` - MIT license

The `.npmignore` excludes source files, config files, and development artifacts.

## Publishing Flow

**Manual publish**:
```bash
npm publish --access public
```

**Automated publish** (preferred):
Push to `main` branch and GitHub Actions handles everything automatically.
