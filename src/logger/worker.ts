import { parentPort } from 'worker_threads';
import axios from 'axios';
import { AxiosError } from 'axios';
import { WorkerMessage } from './interface';

if (parentPort) {
  parentPort.on(
    'message',
    async ({ details, event_name, webhook_url }: WorkerMessage) => {
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
        const res = await axios.post(webhook_url, JSON.stringify(data), {
          headers: {
            accept: 'application/json',
            'Content-Type': 'application/json',
          },
        });

        if (res.data.status.toString().startsWith('4')) {
          return parentPort.postMessage({
            success: false,
            message: `Logging failed: ${res.data.message}`,
          });
        }

        parentPort.postMessage({
          success: true,
          message: 'Error logged to telex',
        });
      } catch (err) {
        let message = '';
        if (err instanceof AxiosError) {
          message = `Logging failed: ${err.message}`;
        } else {
          message = err.message ? err.message : 'Error logging to telex';
        }

        parentPort.postMessage({
          success: false,
          message,
        });
      }
    },
  );
}
