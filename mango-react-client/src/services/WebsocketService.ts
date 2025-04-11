import { ClientRequest, ClientResponse, MessageClassConstants, MessageTypeConstants, ReponseTypeConstants } from "../constants/MessageTypes";

export class WebsocketService {
    private socket!: WebSocket;

    private inSession: boolean = false;
    private wsURL: string = 'ws://localhost:3001';
    private clientId?: string;
    private session?: string;

    constructor() {
        this.configureWebsocket();
    }

    private configureWebsocket() {
        this.socket = new WebSocket(this.wsURL);

        // Event: Connection opened
        this.socket.onopen = (event: Event) => {
            console.log("WebSocket connection opened:", event);
            this.sendRequest(MessageClassConstants.CONNECTION, MessageTypeConstants.CREATE_SESSION);
        };

        this.addEventListener(ReponseTypeConstants.CONNECTION_STATUS, (message: ClientResponse) => {
            const data: any = message.data ? JSON.parse(message.data) : null;
            if (message.clientId && !this.clientId) this.clientId = message.clientId;
            if (message.session && !this.session) {
                this.session = message.session;
                this.sendRequest(MessageClassConstants.CONNECTION, MessageTypeConstants.JOIN_SESSION);
            }
            if (data.message === 'Connected to session') {
                this.inSession = true;
            }
        });

        // Event: Error occurred
        this.socket.onerror = (event: Event) => {
            console.error("WebSocket error:", event);
            this.clearWSInfo();
        };

        // Event: Connection closed
        this.socket.onclose = (event: CloseEvent) => {
            console.log("WebSocket connection closed:", event);
            this.clearWSInfo();
        };
    }

    private clearWSInfo(): void {
        this.session = undefined;
        this.clientId = undefined;
    }

    public getWebsocket(): WebSocket {
        return this.socket;
    }

    public addEventListener(type: ReponseTypeConstants, handler: (event: ClientResponse) => void): void {
        this.socket.addEventListener('message', (event) => {
            try {
                const message: ClientResponse = JSON.parse(event.data);
                if (message.type === type) handler(message);
            }
            catch (e) {
                console.log("Failed to parse message as JSON:", event.data);
            }
        });
    }

    public sendRequest(messageClass: MessageClassConstants, messageType: MessageTypeConstants, data?: string): void {
        const request: ClientRequest = {
            class: messageClass,
            type: messageType,
            session: this.session,
            data,
        }
        this.socket.send(JSON.stringify(request));
    }
}