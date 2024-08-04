import { RspamdError, RspamdTimeoutError } from "../src/errors.js";
import { after, before, describe, test } from "node:test";

import { RspamdClient } from "../src/client.js";
import assert from "node:assert/strict";

describe("RspamdClient", () => {
  let client: RspamdClient;
  let originalFetch: typeof fetch;

  before(() => {
    client = new RspamdClient({ debug: true });
    originalFetch = globalThis.fetch;
  });

  after(() => {
    globalThis.fetch = originalFetch;
  });

  test("constructor sets default options", () => {
    assert.equal(client["baseUrl"], "http://localhost:11333");
    assert.equal(client["timeout"], 5000);
    assert.equal(client["debug"], true);
  });

  test("check method sends POST request to /checkv2", async () => {
    const mockResponse = {
      ok: true,
      json: async () => ({ score: 1.5, action: "no action" }),
    } as Response;

    let fetchArgs: [string, RequestInit] | null = null;
    globalThis.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
      fetchArgs = [input as string, init as RequestInit];
      return mockResponse;
    };

    const result = await client.check("Test message");

    assert.deepEqual(result, { score: 1.5, action: "no action" });
    assert.equal(fetchArgs?.[0], "http://localhost:11333/checkv2");
    assert.equal(fetchArgs?.[1].method, "POST");
    assert.equal(fetchArgs?.[1].body, "Test message");
  });

  test("check method throws RspamdError on non-ok response", async () => {
    const mockResponse = {
      ok: false,
      status: 400,
    } as Response;

    globalThis.fetch = async () => mockResponse;

    await assert.rejects(
      () => client.check("Test message"),
      (error: Error) => {
        assert(error instanceof RspamdError);
        assert.equal(error.message, "HTTP error! status: 400");
        return true;
      }
    );
  });

  test("check method throws RspamdTimeoutError on timeout", async () => {
    globalThis.fetch = () =>
      new Promise((_, reject) => {
        setTimeout(() => {
          const error = new Error("AbortError");
          error.name = "AbortError";
          reject(error);
        }, 200); // This delay is longer than the client's timeout
      }) as Promise<Response>;

    client["timeout"] = 100; // Set a very short timeout for testing

    await assert.rejects(
      () => client.check("Test message"),
      (error: Error) => {
        assert(error instanceof RspamdTimeoutError);
        assert.equal(
          error.message,
          `Request timed out after ${client["timeout"]}ms`
        );
        return true;
      }
    );
  });

  test("symbols method sends POST request to /symbols", async () => {
    const mockResponse = {
      ok: true,
      json: async () => ({ symbols: ["symbol1", "symbol2"] }),
    } as Response;

    let fetchArgs: [string, RequestInit] | null = null;
    globalThis.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
      fetchArgs = [input as string, init as RequestInit];
      return mockResponse;
    };

    const result = await client.symbols("Test message");

    assert.deepEqual(result, { symbols: ["symbol1", "symbol2"] });
    assert.equal(fetchArgs?.[0], "http://localhost:11333/symbols");
    assert.equal(fetchArgs?.[1].method, "POST");
    assert.equal(fetchArgs?.[1].body, "Test message");
  });

  test("learnSpam method sends POST request to /learnspam", async () => {
    const mockResponse = {
      ok: true,
      json: async () => ({ success: true }),
    } as Response;

    let fetchArgs: [string, RequestInit] | null = null;
    globalThis.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
      fetchArgs = [input as string, init as RequestInit];
      return mockResponse;
    };

    const result = await client.learnSpam("Test message");

    assert.deepEqual(result, { success: true });
    assert.equal(fetchArgs?.[0], "http://localhost:11333/learnspam");
    assert.equal(fetchArgs?.[1].method, "POST");
    assert.equal(fetchArgs?.[1].body, "Test message");
  });

  test("learnHam method sends POST request to /learnham", async () => {
    const mockResponse = {
      ok: true,
      json: async () => ({ success: true }),
    } as Response;

    let fetchArgs: [string, RequestInit] | null = null;
    globalThis.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
      fetchArgs = [input as string, init as RequestInit];
      return mockResponse;
    };

    const result = await client.learnHam("Test message");

    assert.deepEqual(result, { success: true });
    assert.equal(fetchArgs?.[0], "http://localhost:11333/learnham");
    assert.equal(fetchArgs?.[1].method, "POST");
    assert.equal(fetchArgs?.[1].body, "Test message");
  });
});
