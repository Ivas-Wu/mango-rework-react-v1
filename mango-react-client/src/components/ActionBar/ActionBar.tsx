import React, { useEffect, useState } from 'react'
import { Operator } from '../Tiles/TileModels';
import Operators from './Operators';
import ActionBarButton from './ActionBarButton';
import { TimerService } from '../../services/TimerService';
import { TimeBroadcastConstants } from '../../constants/EventConstants';

interface ActionbarProps {
    height: number;
    validCommit: boolean;
    selectedOperator: Operator | null;
    timerMode: boolean;
    timerService: TimerService;
    addTiles: () => void;
    clearTile: () => void;
    commitTile: () => void;
    setSelectedOperator: (operator: Operator | null) => void;
}


const ActionBar: React.FC<ActionbarProps> = ({
    height,
    validCommit,
    selectedOperator,
    timerMode,
    timerService,
    addTiles,
    clearTile,
    commitTile,
    setSelectedOperator
}) => {
    const [started, setStarted] = useState<boolean>(false);
    const [paused, setPaused] = useState<boolean>(false);

    useEffect(() => {
            const onStart = (interval: number) => {
                setStarted(true);
            };
        
            const onPause = (ms: number) => {
                setPaused(true);
            };

            const onResume = () => {
                setPaused(false);
            }
        
            timerService.on(TimeBroadcastConstants.TIMER_STARTED, onStart);
            timerService.on(TimeBroadcastConstants.TIMER_PAUSED, onPause);
            timerService.on(TimeBroadcastConstants.TIMER_RESUMED, onResume);
        
            return () => {
                timerService.off(TimeBroadcastConstants.TIMER_STARTED, onStart);
                timerService.off(TimeBroadcastConstants.TIMER_PAUSED, onPause);
                timerService.on(TimeBroadcastConstants.TIMER_RESUMED, onResume);
            };
        }, [timerService]);
        
    const getDynamicStyles = (): React.CSSProperties => {
        return {
            height: `${height}lvh`
        };
    };

    return (
        <div className={`flex flex-row w-screen bg-slate-400`} style={getDynamicStyles()}>
            {!timerMode &&
                <ActionBarButton
                    value='Add'
                    onClick={() => addTiles()}
                />
            }
            {timerMode && !started &&
                <ActionBarButton
                    value='Start Timer'
                    onClick={() => timerService.startTimer()}
                />
            }
            {timerMode && started && !paused &&
                <ActionBarButton
                    value='Pause Timer'
                    onClick={() => timerService.pauseTimer()}
                />
            }
            {timerMode && started && paused &&
                <ActionBarButton
                    value='Resume Timer'
                    onClick={() => timerService.resumeTimer()}
                />
            }
            <ActionBarButton
                value='Clear'
                onClick={() => clearTile()}
            />
            <ActionBarButton
                value='Commit'
                onClick={() => commitTile()}
                disabled={!validCommit}
            />
            <div className='flex flex-row flex-grow'>
                {Object.keys(Operator).map((op) => {
                    const operator = Operator[op as keyof typeof Operator];
                    return (
                        <Operators key={op} operator={operator} selected={selectedOperator === operator} onClick={() => setSelectedOperator((selectedOperator !== operator) ? operator : null)} />
                    );
                })}
            </div>
        </div>
    )
}

export default ActionBar
