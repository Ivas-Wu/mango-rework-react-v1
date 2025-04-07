import { MessageTypeConstants } from "./Constants/requestConstants";

export interface SessionMessage {
    type: MessageTypeConstants;
    session: string;
    clientId: string;
    requestId: string;
    number?: number;
}
