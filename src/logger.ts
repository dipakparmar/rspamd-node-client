import { Console } from "node:console";
import { createWriteStream } from "node:fs";
import { format } from "node:util";

/**
 * Represents the available log levels.
 */
type LogLevel = "error" | "warn" | "info" | "http" | "verbose" | "debug";

/**
 * A custom logger class that writes logs to files and console.
 */
class Logger {
  private console: Console;
  private errorStream: NodeJS.WritableStream;
  private combinedStream: NodeJS.WritableStream;
  private logLevel: LogLevel;

  /**
   * Mapping of log levels to their numeric values.
   */
  private readonly levels: Record<LogLevel, number> = {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    verbose: 4,
    debug: 5,
  };

  /**
   * Creates a new Logger instance.
   * @param logLevel - The initial log level. Defaults to 'info'.
   */
  constructor(logLevel: LogLevel = "info") {
    this.errorStream = createWriteStream("error.log", { flags: "a" });
    this.combinedStream = createWriteStream("combined.log", { flags: "a" });
    this.console = new Console({
      stdout: this.combinedStream,
      stderr: this.errorStream,
    });
    this.logLevel = logLevel;
  }

  /**
   * Formats the log message with timestamp, level, and metadata.
   * @param level - The log level.
   * @param message - The main log message.
   * @param meta - Additional metadata to include in the log.
   * @returns The formatted log message.
   */
  private formatMessage(
    level: LogLevel,
    message: string,
    ...meta: unknown[]
  ): string {
    const timestamp = new Date().toISOString();
    const formattedMeta = meta.length ? JSON.stringify(meta) : "";
    return format(
      "%s [%s] %s %s",
      timestamp,
      level.toUpperCase(),
      message,
      formattedMeta
    );
  }

  /**
   * Determines if a message at the given level should be logged.
   * @param level - The log level to check.
   * @returns True if the message should be logged, false otherwise.
   */
  private shouldLog(level: LogLevel): boolean {
    return this.levels[level] <= this.levels[this.logLevel];
  }

  /**
   * Logs a message if it meets the current log level threshold.
   * @param level - The log level of the message.
   * @param message - The main log message.
   * @param meta - Additional metadata to include in the log.
   */
  private log(level: LogLevel, message: string, ...meta: unknown[]): void {
    if (this.shouldLog(level)) {
      const formattedMessage = this.formatMessage(level, message, ...meta);
      this.console.log(formattedMessage);
      console.log(formattedMessage); // Also log to default console
    }
  }

  /**
   * Logs an error message.
   * @param message - The error message.
   * @param meta - Additional metadata to include in the log.
   */
  error(message: string, ...meta: unknown[]): void {
    this.log("error", message, ...meta);
  }

  /**
   * Logs a warning message.
   * @param message - The warning message.
   * @param meta - Additional metadata to include in the log.
   */
  warn(message: string, ...meta: unknown[]): void {
    this.log("warn", message, ...meta);
  }

  /**
   * Logs an info message.
   * @param message - The info message.
   * @param meta - Additional metadata to include in the log.
   */
  info(message: string, ...meta: unknown[]): void {
    this.log("info", message, ...meta);
  }

  /**
   * Logs an HTTP-related message.
   * @param message - The HTTP-related message.
   * @param meta - Additional metadata to include in the log.
   */
  http(message: string, ...meta: unknown[]): void {
    this.log("http", message, ...meta);
  }

  /**
   * Logs a verbose message.
   * @param message - The verbose message.
   * @param meta - Additional metadata to include in the log.
   */
  verbose(message: string, ...meta: unknown[]): void {
    this.log("verbose", message, ...meta);
  }

  /**
   * Logs a debug message.
   * @param message - The debug message.
   * @param meta - Additional metadata to include in the log.
   */
  debug(message: string, ...meta: unknown[]): void {
    this.log("debug", message, ...meta);
  }

  /**
   * Sets the current log level.
   * @param level - The new log level to set.
   */
  setLogLevel(level: LogLevel): void {
    this.logLevel = level;
  }
}

export const logger = new Logger();
