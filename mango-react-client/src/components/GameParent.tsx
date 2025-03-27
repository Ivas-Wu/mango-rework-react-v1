import React, { useEffect, useState } from 'react'
import Board from "./Board/Board";
import TileParent from "./Tiles/TileParent";
import { BoardService } from '../services/BoardService';
import { TileService } from '../services/TilesService';
import { TileProperties, TileState } from './Tiles/TileModels';
import { BoardTileProperties, BoardTileState } from './Board/BoardTileModels';

const GameParent: React.FC = () => {
    const [selectedTile, setSelectedTile] = useState<number | null>(null); // Based on tile idx
    const [selectedBoardTile, setSelectedBoardTile] = useState<number | null>(null); // Based on board idx

    const [selectedTileFull, setSelectedTileFull] = useState<TileProperties | null>(null); // Based on tile idx
    const [selectedBoardTileFull, setSelectedBoardTileFull] = useState<BoardTileProperties | null>(null); // Based on board idx

    const [validPair, setValidPair] = useState<boolean>(false);
    const [tileToPair, setTileToPair] = useState<number | null>(null);

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

    return (
        <div className="grid grid-cols-2 max-h-lvh">
            <TileParent selectedTile={selectedTile} validCommit={validPair} setSelectedTile={setSelectedTile} linkTile={linkSelectedTiles}></TileParent>
            <Board selectedBoardTile={selectedBoardTile} tileToPair={tileToPair} setSelectedBoardTile={setSelectedBoardTile} refreshBoardState={() => updateFullBoardTile()}></Board>
        </div>
    );
}

export default GameParent
