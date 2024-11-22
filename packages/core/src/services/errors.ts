/**
 * User not found by username
 */
export class UserNotFoundError extends Error {
  constructor(username: string) {
    super(`User not found: ${username}`);
  }
}
