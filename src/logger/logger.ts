import axios, { AxiosInstance } from 'axios';
import { LoggerOptions } from './interface';

export class Logger {
  private readonly http: AxiosInstance;

  constructor(
    private readonly webhook_url: string,
    private readonly options: LoggerOptions = {
      handleExceptions: true,
      handleRejections: true,
    },
  ) {
    this.http = axios.create({
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });
  }

  private async log(details: Record<any, any>, event_name: string) {
    let message = '';

    for (let key in details) {
      message += `${key}: ${details[key]} \n`;
    }
    const data = {
      event_name,
      status: 'error',
      username: 'Telexpress Logger',
      message,
    };
    const res = await this.http.post(this.webhook_url, JSON.stringify(data));

    if (res.status !== 202) console.log(res.data.message);
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
