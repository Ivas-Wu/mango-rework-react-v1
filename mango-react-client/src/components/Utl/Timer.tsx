import React, { useEffect, useState } from 'react'
import { TimerService } from '../../services/TimerService';
import { TimeBroadcastConstants } from '../../constants/EventConstants';

const Timer: React.FC = () => {
    const [time, setTime] = useState<number>(0);
    const timer = TimerService.getInstance();

    useEffect(() => {
        timer.on(TimeBroadcastConstants.TIMER_STARTED, (interval: number) => {
            setTime(Math.ceil(interval / 1000));
        });
        
        timer.on(TimeBroadcastConstants.TIME_REMAINING, (ms: number) => {
            console.log(`Time remaining: ${Math.ceil(ms / 1000)}s`);
            setTime(Math.ceil(ms / 1000));
        });
    }, []);

    return (
        <div className='border-solid border-2 border-slate-800 p-4 rounded-md overflow-y-scroll'>
            {time}
        </div>
    )
}

export default Timer
