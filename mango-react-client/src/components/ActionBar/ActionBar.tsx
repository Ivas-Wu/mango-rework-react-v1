import React from 'react'
import { TileService } from '../../services/TilesService';
import { Operator } from '../Tiles/TileModels';
import Operators from './Operators';
import ActionBarButton from './ActionBarButton';

interface ActionbarProps {
    height: number;
    validCommit: boolean;
    selectedOperator: Operator | null;
    timerMode: boolean;
    timerStarted?: boolean;
    addTiles: () => void;
    startTimer: () => void;
    clearTile: () => void;
    commitTile: () => void;
    setSelectedOperator: (operator: Operator | null) => void;
}


const ActionBar: React.FC<ActionbarProps> = ({ height, validCommit, selectedOperator, timerMode, timerStarted, addTiles, startTimer, clearTile, commitTile, setSelectedOperator }) => {
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
            {timerMode &&
                <ActionBarButton
                    value='Start Timer'
                    onClick={() => startTimer()}
                    disabled={timerStarted}
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
