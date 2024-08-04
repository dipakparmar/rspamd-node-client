/**
 * Configuration options for the RspamdClient.
 */
export interface RspamdClientOptions {
  /** The host address of the Rspamd server. */
  host: string;
  /** The port number of the Rspamd server. */
  port: number;
  /** The timeout duration for requests to the Rspamd server, in milliseconds. */
  timeout: number;
  /** Whether to use HTTPS for connections. */
  https?: boolean;
  /** Whether to enable debug mode. */
  debug?: boolean;
  /** Configuration for spam detection. */
  spamDetectionConfig: SpamDetectionConfig;
}

/**
 * Configuration for spam detection.
 */
export interface SpamDetectionConfig {
  /** The actions to be considered as spam. */
  spamActions: RspamdAction[];
  /** The score threshold for spam detection. */
  scoreThreshold: number;
}

/**
 * Represents a symbol in the Rspamd response.
 */
export interface RspamdSymbol {
  /** The name of the symbol. */
  name: string;
  /** The score associated with the symbol. */
  score: number;
  /** The metric score of the symbol. */
  metric_score: number;
  /** Optional description of the symbol. */
  description?: string;
  /** Optional array of options for the symbol. */
  options?: string[];
}

/**
 * Represents the thresholds for different Rspamd actions.
 */
export interface RspamdThresholds {
  /** Threshold for reject action. */
  reject: number;
  /** Threshold for add header action. */
  "add header": number;
  /** Threshold for greylist action. */
  greylist: number;
  /** Allow for additional custom thresholds. */
  [key: string]: number;
}

/**
 * Represents the possible actions Rspamd can take.
 */
export type RspamdAction =
  | "no action"
  | "greylist"
  | "add header"
  | "rewrite subject"
  | "soft reject"
  | "reject";

/**
 * Represents a header to be added by Rspamd's milter.
 */
export interface RspamdMilterAddHeader {
  /** The value of the header to be added. */
  value: string;
  /** The order in which the header should be added. */
  order: number;
}

/**
 * Represents the milter headers in the Rspamd response.
 */
export interface RspamdMilterHeaders {
  /** Headers to be added. */
  add_headers?: Record<string, RspamdMilterAddHeader>;
  /** Headers to be removed. */
  remove_headers?: Record<string, number>;
  /** New 'from' address if changed. */
  change_from?: string;
  /** Rejection message. */
  reject?: string;
  /** Spam header to be added. */
  spam_header?: string;
  /** Whether no action should be taken. */
  no_action?: boolean;
  /** Recipients to be added. */
  add_rcpt?: string[];
  /** Recipients to be removed. */
  del_rcpt?: string[];
}

/**
 * Represents the response from Rspamd's check v2 endpoint.
 */
export interface RspamdCheckV2Response {
  /** Whether the check was skipped. */
  is_skipped: boolean;
  /** The spam score of the message. */
  score: number;
  /** The required score for the message to be considered spam. */
  required_score: number;
  /** The action taken by Rspamd. */
  action: RspamdAction;
  /** The thresholds for different actions. */
  thresholds: RspamdThresholds;
  /** The symbols triggered by the message. */
  symbols: Record<string, RspamdSymbol>;
  /** Any messages returned by Rspamd. */
  messages: Record<string, string>;
  /** Optional array of URLs found in the message. */
  urls?: string[];
  /** Optional array of email addresses found in the message. */
  emails?: string[];
  /** Optional message ID. */
  "message-id"?: string;
  /** Optional subject of the message. */
  subject?: string;
  /** Optional real time taken to process the message. */
  time_real?: number;
  /** Optional milter headers. */
  milter?: RspamdMilterHeaders;
}
