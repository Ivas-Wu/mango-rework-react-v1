import React from 'react'
import { TileProperties, TileState } from './TileModels';

interface TileProps extends TileProperties {
    selected: boolean;
    highlighted: boolean;
    onTileClick: (tileIndex: number) => void;
}

const Tile: React.FC<TileProps> = ({ idx, value, selected, highlighted, state, parents, child, onTileClick }) => {
    const getTileStyle = () => {
        let style = '';
        switch (state) {
            case TileState.UNUSED:
                style += 'bg-slate-200';
                break;
            case TileState.USED:
                style += 'bg-blue-400';
                break;
            case TileState.HELD:
                style += 'bg-yellow-300';
                break;
            default:
                style += 'bg-white';
        }
        style += ' ';
        if (selected) {
            style += 'border-yellow-200 text-white font-bold font-2xl';
        }
        else if (highlighted) {
            style += 'border-cyan-200 text-white font-bold font-2xl';
        }
        else {
            style += 'border-slate-800';
        }
        return style;
    };

    return (
        <div onClick={()=> onTileClick(idx) }className={`h-20 border-solid border-4 rounded-md p-2 aspect-square flex items-center justify-center text-center ${getTileStyle()} hover:bg-white`}>
            {value}
        </div>
    )
}

export default Tile
