import React, { useEffect, useState } from 'react'
import Board from "./Board/Board";
import TileParent from "./Tiles/TileParent";
import { BoardService } from '../services/BoardService';
import { TileService } from '../services/TilesService';
import { TileProperties, TileState } from './Tiles/TileModels';
import { BoardTileProperties, BoardTileState } from './Board/BoardTileModels';

interface GameParentProps {
    height: number;
}

const GameParent: React.FC<GameParentProps> = ({height}) => {
    const [selectedTile, setSelectedTile] = useState<number | null>(null); // Based on tile idx
    const [selectedBoardTile, setSelectedBoardTile] = useState<number | null>(null); // Based on board idx

    const [selectedTileFull, setSelectedTileFull] = useState<TileProperties | null>(null); // Based on tile idx
    const [selectedBoardTileFull, setSelectedBoardTileFull] = useState<BoardTileProperties | null>(null); // Based on board idx

    const [validPair, setValidPair] = useState<boolean>(false);
    const [tileToPair, setTileToPair] = useState<number | null>(null);
    const [tileToClear, setTileToClear] = useState<number | null>(null);

    const boardService = BoardService.getInstance();
    const tileService = TileService.getInstance();

    useEffect(() => {
        if (selectedTile != null) {
            const baseTile: TileProperties = tileService.findBaseChild(selectedTile);
            const boardTile = boardService.getBoardTileByTileIdx(baseTile.idx);
            updateFullTile();
            if (boardTile) {
                setSelectedBoardTile(boardTile.idx);
            }
            else if (selectedBoardTileFull?.state === BoardTileState.COMPLETE) {
                setSelectedBoardTile(null);
            }
        }
    }, [selectedTile]);

    useEffect(() => {
        if (selectedBoardTile != null) {
            const tile = boardService.getBoardTileByIdx(selectedBoardTile);
            if (tile?.state === BoardTileState.COMPLETE) {
                setSelectedTile(tile.tileIdx);
            }
            else if (selectedTileFull?.state === TileState.USED) {
                setSelectedTile(null);
            }
            setSelectedBoardTileFull(tile);
        }
    }, [selectedBoardTile]);

    useEffect(() => {
        setValidPair(selectedBoardTileFull?.value === selectedTileFull?.value && selectedBoardTileFull?.state === BoardTileState.NOT_COMPLETE && selectedTileFull?.state === TileState.UNUSED)
    }, [selectedTileFull, selectedBoardTileFull]);

    const updateFullBoardTile = (tile?: BoardTileProperties) => {
        if (selectedBoardTile == null) return
        setSelectedBoardTileFull(tile != undefined ? tile : boardService.getBoardTileByIdx(selectedBoardTile))
    };

    const updateFullTile = (tile?: TileProperties) => {
        if (selectedTile == null) return
        setSelectedTileFull(tile !== undefined ? tile : tileService.getTileFromIdx(selectedTile))
    };

    const linkSelectedTiles = () => {
        setTileToPair(selectedTile);
        updateFullTile();
    };

    const clearParentTile = (idx: number) => {
        setTileToClear(boardService.getBoardTileByTileIdx(idx)?.idx ?? null);
    };

    return (
        <div className={`grid grid-cols-2 h-[93vh] flex-1 overflow-auto`}>
            <div className='flex flex-col h-full p-4'>
                <TileParent selectedTile={selectedTile} validCommit={validPair} setSelectedTile={setSelectedTile} linkTile={linkSelectedTiles} clearParentTile={clearParentTile}></TileParent>
            </div>
            <Board selectedBoardTile={selectedBoardTile} tileToPair={tileToPair} tileToClear={tileToClear} setSelectedBoardTile={setSelectedBoardTile} refreshBoardState={() => updateFullBoardTile()}></Board>
        </div>
    );
}

export default GameParent
