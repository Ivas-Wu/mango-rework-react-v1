export const enum MessageClassConstants{
    SERVER = 'server', // Internal
    CONNECTION = 'connection',
    GAME = 'game',
    TILE = 'tile',
    BOARD = 'board',
    CONFIG = 'config',
}

export const enum MessageTypeConstants{
    // SERVER
    DELETE_CLIENT = 'delete_client',

    // CONNECTION
    CREATE_SESSION = 'create_session',
    JOIN_SESSION = 'join_session',

    // GAME
    GAME_START ='game_start',
    
    // TILE
    GET_TILE = 'get_tile',
    CLEAR_TILE = 'clear_tile',
    OPERATION_TILE = 'operation_tile',
    SET_TILE = 'set_tile',

    // BOARD
    GET_BOARD = 'get_board',

    // CONFIG
}

export const enum ReponseTypeConstants{
    CONNECTION_STATUS = 'connection_status',
    GAME_STATUS  = 'game_status',
    UPDATED_TILES = 'updated_tiles',
    UPDATED_BOARD = 'updated_board',
    UPDATED_CONFIG = 'updated_config',
}

export interface ClientRequest {
    class: MessageClassConstants;
    type: MessageTypeConstants;
    session: string;
    data?: string;
}

export interface ClientResponse {
    type: ReponseTypeConstants;
    session: string;
    data: string;
}
