/**
 * This file was copied from https://github.com/vitaly-t/retry-async/blob/main/src/retry-async.ts
 * and modified to work with our eslint rules.
 */

/**
 * Retry-status object type, for use with RetryCB.
 */
export interface RetryStatus {
  /**
   * Retry index, starting from 0.
   */
  index: number;
  /**
   * Retry overall duration, in milliseconds.
   */
  duration: number;
  /**
   * Last error, if available;
   * it is undefined only when "retryAsync" calls "func" with index = 0.
   */
  error?: Error;
}

/**
 * Retry-status callback type.
 */
export type RetryCB<T> = (s: RetryStatus) => T;

/**
 * Type for options passed into retryAsync function.
 */
export interface RetryOptions {
  /**
   * Maximum number of retries (infinite by default),
   * or a callback to indicate the need for another retry.
   */
  retry?: number | RetryCB<boolean>;
  /**
   * Retry delays, in milliseconds (no delay by default),
   * or a callback that returns the delays.
   */
  delay?: number | RetryCB<number>;
  /**
   * Error notifications.
   */
  error?: RetryCB<void>;
}

/**
 * Retries async operation returned from "func" callback, according to "options".
 */
export function retryAsync<T>(
  func: RetryCB<Promise<T>>,
  options?: RetryOptions,
): Promise<T> {
  const start = Date.now();
  let index = 0;
  let e: Error;

  // eslint-disable-next-line prefer-const
  let { retry = Number.POSITIVE_INFINITY, delay = -1, error } = options ?? {};
  const s = () => ({ index, duration: Date.now() - start, error: e });
  const c = (): Promise<T> =>
    func(s()).catch((err: Error) => {
      e = err;
      if (typeof error === "function") error(s());
      if ((typeof retry === "function" ? (retry(s()) ? 1 : 0) : retry--) <= 0) {
        // eslint-disable-next-line @typescript-eslint/prefer-promise-reject-errors
        return Promise.reject(e);
      }
      const d = typeof delay === "function" ? delay(s()) : delay;
      index++;
      return d >= 0 ? new Promise((a) => setTimeout(a, d)).then(c) : c();
    });
  return c();
}
