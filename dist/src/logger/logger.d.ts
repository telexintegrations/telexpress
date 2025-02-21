import { LoggerOptions } from './interface';
export declare class Logger {
    private readonly webhook_url;
    private readonly options;
    constructor(webhook_url: string, options?: LoggerOptions);
    private log;
    initialize(): void;
}
