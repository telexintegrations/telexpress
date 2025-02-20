import { LoggerOptions } from './interface';
export declare class Logger {
    private readonly webhook_url;
    private readonly options;
    private readonly http;
    constructor(webhook_url: string, options?: LoggerOptions);
    log(details: Record<any, any>, event_name: string): Promise<void>;
    initialize(): void;
}
