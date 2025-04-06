import React, { useEffect, useState } from 'react'
import { TimerService } from '../../services/TimerService';
import { TimeBroadcastConstants } from '../../constants/EventConstants';

interface TimerProps {
    timerService: TimerService;
}

const Timer: React.FC<TimerProps> = ({ timerService }) => {
    const [time, setTime] = useState<number>(0);

    useEffect(() => {
        const onStart = (interval: number) => {
            setTime(Math.ceil(interval / 1000));
        };
    
        const onRemaining = (ms: number) => {
            console.log(`Time remaining: ${Math.ceil(ms / 1000)}s`);
            setTime(Math.ceil(ms / 1000));
        };
    
        timerService.on(TimeBroadcastConstants.TIMER_STARTED, onStart);
        timerService.on(TimeBroadcastConstants.TIME_REMAINING, onRemaining);
    
        return () => {
            timerService.off(TimeBroadcastConstants.TIMER_STARTED, onStart);
            timerService.off(TimeBroadcastConstants.TIME_REMAINING, onRemaining);
        };
    }, [timerService]);

    return (
        <div className='border-solid border-2 border-slate-800 p-4 rounded-md overflow-y-scroll'>
            {time}
        </div>
    )
}

export default Timer
