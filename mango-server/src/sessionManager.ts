import { createClient } from 'redis';
import { ClientRequest, ClientResponse } from './messageTypes';
import { Worker } from 'worker_threads';
import path from 'path';
import { fileURLToPath } from 'url';

const workers = new Map<string, Worker>();

const redisSub = createClient();
const redisPub = createClient();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const initializeSessionManager = async () => {
    await redisSub.connect();
    await redisPub.connect();

    redisSub.pSubscribe('session:*', (raw) => {
        try {
            const msg: ClientRequest = JSON.parse(raw);
            let worker: Worker | undefined = workers.get(msg.session);

            if (!worker) {
                try {
                    const workerScript = path.resolve(__dirname, './sessionWorker.ts');
                    // Initialize worker with ts-node loader
                    worker = new Worker(workerScript, {
                        execArgv: ['--inspect', '--loader', 'ts-node/esm'],
                    });
                    worker.on('error', (error) => {
                        console.error('Worker encountered an error:', error);
                    });
                    worker.on('exit', (code) => {
                        if (code !== 0) {
                            console.error(`Worker stopped with exit code ${code}`);
                        }
                    });
                    worker.on('online', () => {
                        worker?.postMessage(raw);
                    });
                    worker.on('message', (response: string) => {
                        redisPub.publish(`sessionResponse:${msg.session}`, response);
                    });
                    workers.set(msg.session, worker);
                } catch (error) {
                    console.error('Failed to initialize worker:', error);
                }
            }
            else {
                worker.postMessage(raw);
            }
        } catch (err) {
            console.error('Error processing Redis message:', err);
        }
    });

    console.log('Session Manager is running and listening to Redis channels...');
};
