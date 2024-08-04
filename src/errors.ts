/**
 * Custom error class for Rspamd-related errors.
 * Extends the built-in Error class.
 */
export class RspamdError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "RspamdError";
  }
}

/**
 * Custom error class for Rspamd timeout errors.
 * Extends the RspamdError class.
 */
export class RspamdTimeoutError extends RspamdError {
  constructor(message: string) {
    super(message);
    this.name = "RspamdTimeoutError";
  }
}
