import { createClient } from 'redis';
import { SessionMessage } from './types';
import path, { dirname } from 'path';
import { Worker } from 'worker_threads';

const workers = new Map<string, Worker>();

const redisSub = createClient();
const redisPub = createClient();

export const initializeSessionManager = async () => {
    await redisSub.connect();
    await redisPub.connect();

    redisSub.pSubscribe('session:*', (raw) => {
        try {
            const msg: SessionMessage = JSON.parse(raw);
            let worker: Worker | undefined = workers.get(msg.session);

            if (!worker) {
                try {
                    const worker = new Worker('./src/sessionWorker.js');
                    worker.on('error', (error) => {
                        console.error('Worker encountered an error:', error);
                    });
                    worker.on('exit', (code) => {
                        if (code !== 0) {
                            console.error(`Worker stopped with exit code ${code}`);
                        }
                    });
                    worker.on('online', () => {
                        worker.postMessage(raw);
                    });
                    worker.on('message', (response) => {
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
