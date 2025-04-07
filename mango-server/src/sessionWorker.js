import { parentPort } from 'worker_threads';
const number = Math.random() * 100;
parentPort?.on('message', (raw) => {
    const msg = JSON.parse(raw);
    const response = {
        clientId: msg.clientId,
        requestId: msg.requestId,
        session: msg.session,
        number: number,
    }
    parentPort.postMessage(JSON.stringify(response));
})

console.log(`Session worker is running`);
