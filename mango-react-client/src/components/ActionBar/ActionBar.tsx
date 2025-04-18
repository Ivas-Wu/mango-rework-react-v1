import React, { useEffect, useState } from 'react'
import { Operator } from '../Tiles/TileModels';
import Operators from './Operators';
import ActionBarButton from './ActionBarButton';
import { TimerService } from '../../services/TimerService';
import { TimeBroadcastConstants } from '../../constants/EventConstants';

interface ActionbarProps {
    height: number;
    validClear: boolean;
    validCommit: boolean;
    selectedOperator: Operator | null;
    timerMode: boolean;
    canPause: boolean;
    timerService: TimerService;
    addTiles: () => void;
    clearTile: () => void;
    commitTile: () => void;
    setSelectedOperator: (operator: Operator | null) => void;
}


const ActionBar: React.FC<ActionbarProps> = ({
    height,
    validClear,
    validCommit,
    selectedOperator,
    timerMode,
    canPause,
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

        if (canPause) {
            timerService.on(TimeBroadcastConstants.TIMER_PAUSED, onPause);
            timerService.on(TimeBroadcastConstants.TIMER_RESUMED, onResume);
        }
        timerService.on(TimeBroadcastConstants.TIMER_STARTED, onStart);


        return () => {
            timerService.off(TimeBroadcastConstants.TIMER_STARTED, onStart);
            if (canPause) {
                timerService.off(TimeBroadcastConstants.TIMER_PAUSED, onPause);
                timerService.on(TimeBroadcastConstants.TIMER_RESUMED, onResume);
            }
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
            {timerMode && (
                <>
                    {(!started || !canPause) && (
                        <ActionBarButton
                            value="Start Timer"
                            onClick={() => timerService.startTimer()}
                            disabled={started}
                        />
                    )}

                    {started && canPause && (
                        <>
                            {!paused ? (
                                <ActionBarButton
                                    value="Pause Timer"
                                    onClick={() => timerService.pauseTimer()}
                                />
                            ) : (
                                <ActionBarButton
                                    value="Resume Timer"
                                    onClick={() => timerService.resumeTimer()}
                                />
                            )}
                        </>
                    )}
                </>
            )}


            <ActionBarButton
                value='Clear'
                onClick={() => clearTile()}
                disabled={!validClear}
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
