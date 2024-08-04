import { RspamdCheckV2Response, RspamdClientOptions } from "./types.js";
import { RspamdError, RspamdTimeoutError } from "./errors.js";

import { logger } from "./logger.js";

/**
 * Default options for the RspamdClient.
 */
const DEFAULT_OPTIONS: RspamdClientOptions = {
  host: "localhost",
  port: 11333,
  timeout: 5000,
  https: false,
  debug: false,
  spamDetectionConfig: {
    spamActions: ["reject", "add header", "rewrite subject"],
    scoreThreshold: 7,
  },
};

/**
 * A client for interacting with the Rspamd spam filtering server.
 */
export class RspamdClient {
  private baseUrl: string;
  private timeout: number;
  private debug?: boolean;

  /**
   * Constructs a new instance of the RspamdClient class.
   *
   * @param options - An object containing optional configuration parameters for the RspamdClient.
   * @param options.host - The host address of the Rspamd server. Defaults to the value specified in DEFAULT_OPTIONS.
   * @param options.port - The port number of the Rspamd server. Defaults to the value specified in DEFAULT_OPTIONS.
   * @param options.timeout - The timeout duration for requests to the Rspamd server, in milliseconds. Defaults to the value specified in DEFAULT_OPTIONS.
   * @param options.debug - A boolean indicating whether to enable debug mode. Defaults to the value specified in DEFAULT_OPTIONS.
   */
  constructor(options: Partial<RspamdClientOptions> = {}) {
    const {
      host = DEFAULT_OPTIONS.host,
      port = DEFAULT_OPTIONS.port,
      timeout = DEFAULT_OPTIONS.timeout,
      debug = DEFAULT_OPTIONS.debug,
    } = { ...DEFAULT_OPTIONS, ...options };
    this.baseUrl = `${options.https ? "https" : "http"}://${host}:${port}`;
    this.timeout = timeout;
    this.debug = debug || false;
  }

  /**
   * Makes a request to the Rspamd server.
   *
   * @param endpoint - The API endpoint to request.
   * @param method - The HTTP method to use for the request.
   * @param body - The body of the request, if any.
   * @returns A Promise that resolves with the JSON response from the server.
   * @throws {RspamdError} If the server returns a non-OK response.
   * @throws {RspamdTimeoutError} If the request times out.
   */
  private async makeRequest<T>(
    endpoint: string,
    method: string,
    body?: string
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      if (this.debug) {
        logger.debug(`Making request to ${url}`);
      }
      const response = await fetch(url, {
        method,
        body,
        headers: {
          "Content-Type": "text/plain",
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new RspamdError(`HTTP error! status: ${response.status}`);
      }

      return response.json();
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === "AbortError") {
          throw new RspamdTimeoutError(
            `Request timed out after ${this.timeout}ms`
          );
        }
      }
      throw error;
    }
  }

  /**
   * Checks a message for spam using Rspamd's check v2 endpoint.
   *
   * @param message - The message to check for spam.
   * @returns A Promise that resolves with the check results.
   */
  async check(message: string): Promise<RspamdCheckV2Response> {
    return this.makeRequest<RspamdCheckV2Response>("/checkv2", "POST", message);
  }

  /**
   * Retrieves the symbols for a given message from Rspamd.
   *
   * @param message - The message to retrieve symbols for.
   * @returns A Promise that resolves with the symbols associated with the message.
   */
  async symbols(message: string): Promise<any> {
    return this.makeRequest("/symbols", "POST", message);
  }

  /**
   * Submits a message to Rspamd for learning as spam.
   *
   * @param message - The spam message to be learned.
   * @returns A Promise that resolves with the result of the learning process.
   */
  async learnSpam(message: string): Promise<any> {
    return this.makeRequest("/learnspam", "POST", message);
  }

  /**
   * Submits a message to Rspamd for learning as ham (not spam).
   *
   * @param message - The ham message to be learned.
   * @returns A Promise that resolves with the result of the learning process.
   */
  async learnHam(message: string): Promise<any> {
    return this.makeRequest("/learnham", "POST", message);
  }
}
