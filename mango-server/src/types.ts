import { MessageTypeConstants } from "./Constants/requestConstants.ts";

export interface ClientRequest {
    type: MessageTypeConstants;
    session: string;
    clientId: string;
    requestId: string;
    data?: string;
}

export interface ClientResponse {
    session: string;
    clientId: string;
    requestId: string;
    data: string;
}
