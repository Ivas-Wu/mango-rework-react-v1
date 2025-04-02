import React, { useEffect, useState } from 'react'
import Board from "./Board/Board";
import TileParent from "./Tiles/TileParent";
import { BoardService } from '../services/BoardService';
import { TileService } from '../services/TilesService';
import { TileProperties, TileState } from './Tiles/TileModels';
import { BoardTileProperties, BoardTileState } from './Board/BoardTileModels';
import GameOverModal from './Utl/GameOverModal';

interface GameParentProps {
    height: number;
}

const GameParent: React.FC<GameParentProps> = ({ height }) => {
    const [selectedTile, setSelectedTile] = useState<number | null>(null); // Based on tile idx
    const [selectedBoardTile, setSelectedBoardTile] = useState<number | null>(null); // Based on board idx

    const [selectedTileFull, setSelectedTileFull] = useState<TileProperties | null>(null); // Based on tile idx
    const [selectedBoardTileFull, setSelectedBoardTileFull] = useState<BoardTileProperties | null>(null); // Based on board idx

    const [validPair, setValidPair] = useState<boolean>(false);
    const [tileToPair, setTileToPair] = useState<number | null>(null);
    const [tileToClear, setTileToClear] = useState<number | null>(null);

    const [gameDone, setGameDone] = useState<boolean>(false);

    const boardService = BoardService.getInstance();
    const tileService = TileService.getInstance();

    useEffect(() => {
        boardService.getEventHandlerInstance().on('GameWon', (message) => {
            console.log(message); // debugging
            setGameDone(true);
        });
    }, []);

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
        setSelectedBoardTileFull(tile !== undefined ? tile : boardService.getBoardTileByIdx(selectedBoardTile))
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

    const resetGame = () => {
        setGameDone(false);
        boardService.resetBoard();
        setSelectedBoardTile(null);
        setSelectedTile(null);
        setSelectedBoardTileFull(null);
        setSelectedTileFull(null);
        setValidPair(false);
        setTileToClear(null);
        setTileToPair(null);
    }

    return (
        <div className={`grid grid-cols-2 h-[${height}vh] flex-1 overflow-auto`}>
            <div className={`flex flex-col p-4 h-[${height}vh]`}>
                <TileParent
                    selectedTile={selectedTile}
                    validCommit={validPair}
                    triggerReset={!gameDone}
                    setSelectedTile={setSelectedTile}
                    linkTile={linkSelectedTiles}
                    clearParentTile={clearParentTile}
                />
            </div>
            <Board
                width={height}
                selectedBoardTile={selectedBoardTile}
                tileToPair={tileToPair}
                tileToClear={tileToClear}
                triggerReset={!gameDone}
                setSelectedBoardTile={setSelectedBoardTile}
                refreshBoardState={() => updateFullBoardTile()}
            />
            {gameDone && (
                <GameOverModal
                    win={true}
                    closeModal={resetGame}
                />
            )}
        </div>
    );
}

export default GameParent
