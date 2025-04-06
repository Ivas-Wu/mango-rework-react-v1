export const enum TileBroadcastConstants {
    TILES_UPDATED = 'tiles_updated',
};

export const enum BoardBroadcastConstants {
    GAME_WON = 'game_won',
    BOARD_UPDATED = 'board_updated'
};

export const enum ConfigBroadcastConstants {
    CONFIGS_UPDATED = 'configs_updated',
};

export const enum TimeBroadcastConstants {
    TIMER_STARTED = 'timer_started',
    TIME_REMAINING = 'time_remaining',
    TIMER_PAUSED = 'timer_paused',
    TIMER_RESUMED = 'timer_resumed',
};