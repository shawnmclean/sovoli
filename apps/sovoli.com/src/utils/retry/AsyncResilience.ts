/**
 * This file was copied from the suggestion in this gist: https://gist.github.com/vitaly-t/6e3d285854d882b1618c7e435df164c4
 * See retry guidance: https://docs.aws.amazon.com/wellarchitected/latest/reliability-pillar/rel_mitigate_interaction_failure_limit_retries.html
 */
import type { RetryOptions, RetryStatus } from "./retry-async";

export class AsyncResilience {
  static defaultRetryErrorHandler = (s: RetryStatus) => {
    const info = {
      index: s.index,
      duration: s.duration,
      error: s.error?.message,
    };
    // TODO: update this class to utilize some sort of global standard logger
    console.error("Retry Error:", info);
  };

  // aggressive async retry strategy:
  // retries 10 times with 1s delays
  static aggressive(
    retry = 10,
    delay = 1000,
    error = AsyncResilience.defaultRetryErrorHandler,
  ): RetryOptions {
    return {
      retry,
      delay,
      error,
    };
  }

  // endless retry strategy, with delays as follows:
  // 500, 1000, 1500, 2000, 2500, (3000)
  static endless(): RetryOptions {
    return {
      delay(s: RetryStatus) {
        return s.index > 5 ? 3000 : (s.index + 1) * 500;
      },
    };
  }

  /**
   * Best for hitting external services that has rate limits
   * for use with external systems such as file uploads to supabase or other services that may fail and we need to
   * retry in a pattern to reduce multiple clients trying to hit the same service at the same time
   */
  static exponentialBackoffWithJitter(
    retry = 5,
    baseDelay = 1000,
    error = AsyncResilience.defaultRetryErrorHandler,
  ): RetryOptions {
    return {
      retry: retry,
      delay(s: RetryStatus) {
        const exponentialDelay = baseDelay * 2 ** s.index; // 1s, 2s, 4s, 8s, 16s
        const jitter = Math.random() * 500; // Add a jitter of up to 500ms
        return exponentialDelay + jitter;
      },
      error,
    };
  }
}
