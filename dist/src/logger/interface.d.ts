export interface LoggerOptions {
    handleRejections?: Boolean;
    handleExceptions?: Boolean;
}
export interface WorkerMessage {
    details: Record<string, any>;
    event_name: string;
    webhook_url: string;
}
export interface WorkerResponse {
    success: boolean;
    message?: string;
}
