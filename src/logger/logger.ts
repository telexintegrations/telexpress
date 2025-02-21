import { Worker } from 'worker_threads';
import { LoggerOptions, WorkerResponse } from './interface';
import path from 'path';

export class Logger {
  constructor(
    private readonly webhook_url: string,
    private readonly options: LoggerOptions = {
      handleExceptions: true,
      handleRejections: true,
    },
  ) {}

  private async log(details: Record<string, any>, event_name: string) {
    const worker = new Worker(path.resolve(__dirname, 'worker.js'));

    worker.on('message', (response: WorkerResponse) => {
      if (!response.success) {
        console.error(response.message);
      }
      console.log(response.message);
    });

    worker.on('error', (err) => {
      console.error(err.message);
    });

    worker.postMessage({
      details,
      event_name,
      webhook_url: this.webhook_url,
    });
  }

  initialize() {
    if (this.options.handleExceptions) {
      process.on('uncaughtException', async (error: Error) => {
        console.error(error);
        const details = {
          name: error.name,
          message: error.message,
          stack: error.stack,
        };
        try {
          await this.log(details, 'uncaughtException');
        } catch (err) {
          console.error('Error logging uncaughtException:', err);
        }
      });
    }

    if (this.options.handleRejections) {
      process.on('unhandledRejection', async (reason: any) => {
        console.error(reason);
        let details = {};
        if (reason instanceof Error) {
          details = {
            name: reason.name,
            message: reason.message,
            stack: reason.stack,
          };
        } else if (typeof reason === 'object') {
          details = { ...reason };
        } else if (typeof reason === 'string') {
          details = { message: reason };
        } else {
          details = { message: reason };
        }

        try {
          await this.log(details, 'unhandledRejection');
        } catch (err) {
          console.error('Error logging unhandledRejection:', err);
        }
      });
    }
  }
}
