import React from 'react'
import Tile from './Tile'
import { TileProperties } from './TileModels';

interface TileBoardProps {
    tiles: TileProperties[];
    selectedTile: number | null;
    highlightedTiles: number[];
    onTileClick: (tileIndex: number) => void;
}

const TileBoard: React.FC<TileBoardProps> = ({tiles, selectedTile, highlightedTiles, onTileClick}) => {
    return (
        <div className='flex gap-1 content-start flex-wrap border-solid border-2 border-slate-800 p-4 rounded-md overflow-y-scroll flex-1'>
            { tiles.map((tile) => {
                return <Tile {...tile} highlighted={highlightedTiles.includes(tile.idx)} selected={selectedTile === tile.idx} onTileClick={onTileClick}></Tile>
            })}
        </div>
    )
}

export default TileBoard
