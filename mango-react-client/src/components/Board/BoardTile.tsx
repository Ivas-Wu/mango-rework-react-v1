import React from 'react'
import { BoardTileState, BoardTileProperties } from './BoardTileModels';

interface BoardTileProps extends BoardTileProperties {
    selected: boolean;
    onBoardTileClick: (idx: number, tileIdx: number | null) => void;
}

const BoardTile: React.FC<BoardTileProps> = ({ idx, value, state, tileIdx, selected, onBoardTileClick }) => {    
    const getTileStyle = () => {
        let style = '';
        switch (state) {
            case BoardTileState.COMPLETE:
                style += 'bg-red-200';
                break;
            case BoardTileState.NOT_COMPLETE:
                style += 'bg-slate-400';
                break;
            default:
                style += 'bg-white';
        }
        style += ' ';
        if (selected) {
            style += 'border-yellow-200 text-white font-bold font-2xl';
        }
        else {
            style += 'border-slate-200';
        }
        return style;
    };

    return (
        <div onClick={() => onBoardTileClick(idx, tileIdx)} className={`border-solid border-4 rounded-md p-2 aspect-square flex items-center justify-center text-center ${getTileStyle()} hover:bg-white`}>
            {value}
        </div>
    )
}

export default BoardTile
