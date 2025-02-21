"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const worker_threads_1 = require("worker_threads");
const axios_1 = __importDefault(require("axios"));
const axios_2 = require("axios");
if (worker_threads_1.parentPort) {
    worker_threads_1.parentPort.on('message', (_a) => __awaiter(void 0, [_a], void 0, function* ({ details, event_name, webhook_url }) {
        try {
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
            const res = yield axios_1.default.post(webhook_url, JSON.stringify(data), {
                headers: {
                    accept: 'application/json',
                    'Content-Type': 'application/json',
                },
            });
            if (res.data.status.toString().startsWith('4')) {
                return worker_threads_1.parentPort.postMessage({
                    success: false,
                    message: `Logging failed: ${res.data.message}`,
                });
            }
            worker_threads_1.parentPort.postMessage({
                success: true,
                message: 'Error logged to telex',
            });
        }
        catch (err) {
            let message = '';
            if (err instanceof axios_2.AxiosError) {
                message = `Logging failed: ${err.message}`;
            }
            else {
                message = err.message ? err.message : 'Error logging to telex';
            }
            worker_threads_1.parentPort.postMessage({
                success: false,
                message,
            });
        }
    }));
}
