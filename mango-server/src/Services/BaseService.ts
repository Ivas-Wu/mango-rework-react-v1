import { ReponseTypeConstants } from "../Constants/MessageConstants";
import { ClientRequest, ClientResponse } from "../messageTypes";
import { LoggingService } from "./LoggingService.ts";

export class BaseClass {
    protected loggingService: LoggingService = LoggingService.getInstance();
    
    protected createClientResponse(type: ReponseTypeConstants, request: ClientRequest, data: string): ClientResponse {
        const response: ClientResponse = {
            type: type,
            clientId: request.clientId,
            requestId: request.requestId,
            session: request.session,
            data,
        }
        return response;
    }
}