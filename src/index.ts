/**
 * Represents a successful operation result.
 * @template T - The type of the success data
 */
type Success<T> = {
  /** The successful result data */
  data: T;
  /** Always null for successful results */
  error: null;
};

/**
 * Represents a failed operation result.
 * @template E - The type of the error (defaults to Error)
 */
type Failure<E> = {
  /** Always null for failed results */
  data: null;
  /** The error that occurred */
  error: E;
};

/**
 * A discriminated union representing either a successful or failed operation.
 * This type ensures type safety when handling both success and error cases.
 *
 * @template T - The type of the success data
 * @template E - The type of the error (defaults to Error)
 *
 * @example
 * ```typescript
 * const result: Result<User, ApiError> = await tryCatch(fetchUser(id));
 * if (result.error) {
 *   // TypeScript knows result.data is null and result.error is ApiError
 *   console.error(result.error);
 * } else {
 *   // TypeScript knows result.error is null and result.data is User
 *   console.log(result.data);
 * }
 * ```
 */
type Result<T, E = Error> = Success<T> | Failure<E>;

/**
 * Wraps a promise and returns a discriminated union result.
 * Instead of using try-catch blocks, you get a result object with either data or error.
 *
 * This function provides a cleaner, more functional approach to error handling by
 * converting exceptions into values. It's particularly useful for avoiding nested
 * try-catch blocks and making error handling more explicit in your code.
 *
 * @template T - The type of the resolved promise value (success case)
 * @template E - The type of the error (defaults to Error)
 *
 * @param promise - The promise to wrap and execute
 *
 * @returns A promise that resolves to:
 *   - `{ data: T, error: null }` on success
 *   - `{ data: null, error: E }` on failure
 *
 * @example
 * Basic usage with fetch:
 * ```typescript
 * const result = await tryCatch(fetch('/api/user'));
 * if (result.error) {
 *   console.error('Failed:', result.error);
 *   return;
 * }
 * console.log('Success:', result.data);
 * ```
 *
 * @example
 * With custom error types:
 * ```typescript
 * interface ApiError {
 *   code: string;
 *   message: string;
 * }
 *
 * const result = await tryCatch<User, ApiError>(fetchUser(id));
 * if (result.error) {
 *   console.error(`Error ${result.error.code}: ${result.error.message}`);
 *   return;
 * }
 * ```
 *
 * @example
 * Multiple operations:
 * ```typescript
 * const [userResult, postsResult] = await Promise.all([
 *   tryCatch(fetchUser(id)),
 *   tryCatch(fetchPosts(id)),
 * ]);
 *
 * if (userResult.error || postsResult.error) {
 *   // Handle errors
 *   return;
 * }
 *
 * // Both data fields are guaranteed to be available
 * const user = userResult.data;
 * const posts = postsResult.data;
 * ```
 */
export async function tryCatch<T, E = Error>(
  promise: Promise<T>,
): Promise<Result<T, E>> {
  try {
    const data = await promise;
    return { data, error: null };
  } catch (error) {
    return { data: null, error: error as E };
  }
}

export type { Result, Success, Failure };
