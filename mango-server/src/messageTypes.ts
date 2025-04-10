import { MessageClassConstants, MessageTypeConstants, ReponseTypeConstants } from "./Constants/MessageConstants.ts";

export interface ClientRequest {
    class: MessageClassConstants;
    type: MessageTypeConstants;
    session: string;
    requestId: string;
    clientId: string;
    data?: string;
}

export interface ClientResponse {
    type: ReponseTypeConstants;
    session: string;
    clientId: string;
    requestId?: string;
    data: string;
}
