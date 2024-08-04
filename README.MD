# @dipakparmar/rspamd-client

[![npm version](https://img.shields.io/npm/v/@dipakparmar/rspamd-client.svg)](https://www.npmjs.com/package/@dipakparmar/rspamd-client)
[![Downloads/week](https://img.shields.io/npm/dw/@dipakparmar/rspamd-client)](https://www.npmjs.com/package/@dipakparmar/rspamd-client)
[![License](https://img.shields.io/npm/l/@dipakparmar/rspamd-client.svg)](https://github.com/dipakparmar/rspamd-client/blob/main/LICENSE)

A TypeScript Node.js client for Rspamd.

> **Note:** This package is currently in alpha and under active development. Use with caution in production environments.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [API](#api)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [License](#license)

## Installation

```bash
pnpm add @dipakparmar/rspamd-client
```

## Usage

```typescript
import { RspamdClient } from '@dipakparmar/rspamd-client';

const client = new RspamdClient({
  host: 'localhost',
  port: 11333,
});

const rawEmail = fs.readFileSync('email.eml', 'utf8');

async function checkSpam() {
  try {
    const result = await client.check(rawEmail);
    console.log('Check result:', result);
  } catch (error) {
    console.error('Error:', error);
  }
}

checkSpam();
```

## API

### `RspamdClient`

#### Constructor

```typescript
new RspamdClient(options?: Partial<RspamdClientOptions>)
```

##### Options

- `host` (string): The Rspamd server host. Default: 'localhost'
- `port` (number): The Rspamd server port. Default: 11333
- `timeout` (number): Request timeout in milliseconds. Default: 5000
- `https` (boolean): Use HTTPS for connections. Default: false
- `debug` (boolean): Enable debug logging. Default: false

#### Methods

##### `check(message: string): Promise<RspamdCheckV2Response>`

Checks a message for spam using Rspamd's `/checkv2` endpoint.

## Roadmap

| Feature                            | Status      |
|------------------------------------|-------------|
| Basic `/checkv2` functionality     | ✅ Completed |
| Error handling and timeouts        | ✅ Completed |
| Comprehensive testing              | 🚧 In Progress |
| Support for all worker endpoints   | 🚧 In Progress |
| Support for controller endpoints   | 📅 Planned  |
| Improved documentation             | 📅 Planned  |
| Performance optimizations          | 📅 Planned  |

Contributions are welcome! If you'd like to contribute to any of these features or have suggestions for new ones, please open an issue or submit a pull request.

## Other Features and Endpoints

### Normal Worker HTTP Endpoints

- `/checkv2` (POST) - Checks message and returns action (Implemented)
- `/ping` (GET) - Returns a pong HTTP reply (could be used for monitoring)

### Controller HTTP Endpoints

- `/fuzzyadd` (POST) - Adds message to fuzzy storage
- `/fuzzydel` (POST) - Removes message from fuzzy storage
- `/checkv2` (POST) - Checks message and returns action (same as normal worker)

Various GET endpoints are also available on the controller, including `/stat`, `/graph`, `/history`, `/actions`, `/maps`, and more. For a full list and details, please refer to the [Rspamd documentation](https://rspamd.com/doc/developers/protocol.html#controller-http-endpoints).

## Contributing

Contributions, issues, and feature requests are welcome! Feel free to check [issues page](https://github.com/dipakparmar/rspamd-node-client/issues).

## License

This project is [AGPL-3.0](https://github.com/dipakparmar/rspamd-node-client/blob/main/LICENSE) licensed.
