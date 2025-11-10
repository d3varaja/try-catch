# try-catch

Zero-dep TypeScript helper that wraps promises and returns `{ data | error }` as a discriminated union. Packaged from Theo Browne's (t3dotgg) pattern, with full credit.

## Installation

```bash
npm install @d3avarja/try-catch
```

## Usage

Instead of using traditional try-catch blocks:

```typescript
// Before
try {
  const user = await fetchUser(id);
  console.log(user);
} catch (error) {
  console.error('Failed to fetch user:', error);
}
```

Use the `tryCatch` helper for cleaner, type-safe error handling:

```typescript
import { tryCatch } from '@d3avarja/try-catch';

const result = await tryCatch(fetchUser(id));

if (result.error) {
  console.error('Failed to fetch user:', result.error);
  return;
}

// TypeScript knows result.data is available here
console.log(result.data);
```

## Features

- **Zero dependencies** - Lightweight and minimal
- **Type-safe** - Full TypeScript support with discriminated unions
- **Simple API** - Just wrap your promise
- **Custom error types** - Specify your own error types

## Advanced Usage

### Custom Error Types

```typescript
interface ApiError {
  code: string;
  message: string;
}

const result = await tryCatch<User, ApiError>(fetchUser(id));

if (result.error) {
  console.error(`Error ${result.error.code}: ${result.error.message}`);
  return;
}
```

### Multiple Operations

```typescript
const [userResult, postsResult] = await Promise.all([
  tryCatch(fetchUser(id)),
  tryCatch(fetchPosts(id)),
]);

if (userResult.error || postsResult.error) {
  // Handle errors
  return;
}

// Both data fields are guaranteed to be available
const user = userResult.data;
const posts = postsResult.data;
```

## API

### `tryCatch<T, E = Error>(promise: Promise<T>): Promise<Result<T, E>>`

Wraps a promise and returns a discriminated union result.

**Type Parameters:**
- `T` - The expected data type on success
- `E` - The error type (defaults to `Error`)

**Returns:** `Promise<Result<T, E>>` where `Result` is:
- `{ data: T, error: null }` on success
- `{ data: null, error: E }` on failure

## Credits

Pattern inspired by Theo Browne ([@t3dotgg](https://twitter.com/t3dotgg))

## License

MIT
