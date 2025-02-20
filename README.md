# Telexpress

A lightweight Node.js error monitoring & logging package that sends uncaught exceptions and unhandled rejections to a Telex channel.

## Installation

```bash
npm install telexpress

```

## Usage

```bash
import { Logger } from 'telexpress'; // Also supports require()

// Create logger with your webhook URL
const logger = new Logger('YOUR_TELEX_CHANNEL_WEBHOOK_URL', {
  handleExceptions: true, // default: true
  handleRejections: true  // default: true
});

// Initialize logger
logger.initialize();

```

## License

ISC License

## Author

Zeal Meruwoma
