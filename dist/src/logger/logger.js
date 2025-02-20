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
exports.Logger = void 0;
const axios_1 = __importDefault(require("axios"));
class Logger {
    constructor(webhook_url, options = {
        handleExceptions: true,
        handleRejections: true,
    }) {
        this.webhook_url = webhook_url;
        this.options = options;
        this.http = axios_1.default.create({
            headers: {
                accept: 'application/json',
                'Content-Type': 'application/json',
            },
        });
    }
    log(details, event_name) {
        return __awaiter(this, void 0, void 0, function* () {
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
            const res = yield this.http.post(this.webhook_url, JSON.stringify(data));
            if (res.status !== 202)
                console.log(res.data.message);
        });
    }
    initialize() {
        if (this.options.handleExceptions) {
            process.on('uncaughtException', (error) => __awaiter(this, void 0, void 0, function* () {
                console.error(error);
                const details = {
                    name: error.name,
                    message: error.message,
                    stack: error.stack,
                };
                try {
                    yield this.log(details, 'uncaughtException');
                }
                catch (err) {
                    console.error('Error logging uncaughtException:', err);
                }
            }));
        }
        if (this.options.handleRejections) {
            process.on('unhandledRejection', (reason) => __awaiter(this, void 0, void 0, function* () {
                console.error(reason);
                let details = {};
                if (reason instanceof Error) {
                    details = {
                        name: reason.name,
                        message: reason.message,
                        stack: reason.stack,
                    };
                }
                else if (typeof reason === 'object') {
                    details = Object.assign({}, reason);
                }
                else if (typeof reason === 'string') {
                    details = { message: reason };
                }
                else {
                    details = { message: reason };
                }
                try {
                    yield this.log(details, 'unhandledRejection');
                }
                catch (err) {
                    console.error('Error logging unhandledRejection:', err);
                }
            }));
        }
    }
}
exports.Logger = Logger;
