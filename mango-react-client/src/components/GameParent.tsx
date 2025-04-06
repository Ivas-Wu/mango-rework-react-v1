import React, { useEffect, useState } from 'react'
import Board from "./Board/Board";
import TileParent, { TileTriggerMode } from "./Tiles/TileParent";
import { BoardService } from '../services/BoardService';
import { TileService } from '../services/TilesService';
import { Operator, TileProperties, TileState } from './Tiles/TileModels';
import { BoardTileProperties, BoardTileState } from './Board/BoardTileModels';
import GameOverModal from './Utl/GameOverModal';
import Timer from './Utl/Timer';
import { BoardBroadcastConstants } from '../constants/EventConstants';
import ActionBar from './ActionBar/ActionBar';
import { ConfigService } from '../services/ConfigService';
import { TimerService } from '../services/TimerService';

interface GameParentProps {
    height: number;
}

const GameParent: React.FC<GameParentProps> = ({ height }) => {
    const [selectedTile, setSelectedTile] = useState<number | null>(null); // Based on tile idx
    const [selectedBoardTile, setSelectedBoardTile] = useState<number | null>(null); // Based on board idx

    const [selectedTileFull, setSelectedTileFull] = useState<TileProperties | null>(null); // Based on tile idx
    const [selectedBoardTileFull, setSelectedBoardTileFull] = useState<BoardTileProperties | null>(null); // Based on board idx

    const [selectedOperator, setSelectedOperator] = useState<Operator | null>(null);

    const [validPair, setValidPair] = useState<boolean>(false);
    const [tileToPair, setTileToPair] = useState<number | null>(null);
    const [tileToClear, setTileToClear] = useState<number | null>(null);

    const [tileReset, setTileReset] = useState<TileTriggerMode>(0);
    const [gameDone, setGameDone] = useState<boolean>(false);

    const boardService = BoardService.getInstance();
    const tileService = TileService.getInstance();
    const configService = ConfigService.getInstance();
    const timerService = new TimerService(configService.getTimerInterval(), () => tileService.addTiles(true));
    const actionBarHeight = Math.floor(height / 8);

    useEffect(() => {
        boardService.on(BoardBroadcastConstants.GAME_WON, (message) => {
            console.log(message); // debugging
            setGameDone(true);
        });
    }, []);

    useEffect(() => {
        const handleKeyPress = (event: KeyboardEvent) => {
            switch (event.key) {
                case configService.getOperation(0):
                    setSelectedOperator(Operator.ADD);
                    return
                case configService.getOperation(1):
                    setSelectedOperator(Operator.SUBTRACT);
                    return
                case configService.getOperation(2):
                    setSelectedOperator(Operator.MULTIPLY);
                    return
                case configService.getOperation(3):
                    setSelectedOperator(Operator.DIVIDE);
                    return
                default:
                    return
            }
        };

        document.addEventListener("keydown", handleKeyPress);
        
        return () => {
            document.removeEventListener("keydown", handleKeyPress);
        };
    }, []);

    useEffect(() => {
        if (selectedBoardTileFull?.state === BoardTileState.COMPLETE) {
            setSelectedBoardTile(null);
        }
        if (selectedTile != null) {
            const baseTile: TileProperties = tileService.findBaseChild(selectedTile);
            const boardTile = boardService.getBoardTileByTileIdx(baseTile.idx);
            updateFullTile();
            if (boardTile) {
                setSelectedBoardTile(boardTile.idx);
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


    const getDynamicStyles = (): React.CSSProperties => {
        return {
            height: `${getAdjustedHeight()}vh`
        };
    };

    const getAdjustedHeight = (): number => {
        return height - actionBarHeight;
    };

    const updateFullBoardTile = (tile?: BoardTileProperties) => {
        if (selectedBoardTile == null) return
        setSelectedBoardTileFull(tile !== undefined ? tile : boardService.getBoardTileByIdx(selectedBoardTile))
    };

    const updateFullTile = (tile?: TileProperties) => {
        if (selectedTile == null) return
        setSelectedTileFull(tile !== undefined ? tile : tileService.getTileFromIdx(selectedTile))
    };

    const clearTile = () => {
        if (!selectedTile) return
        tileService.clearTile(selectedTile!);
        setTileToClear(selectedTile ? boardService.getBoardTileByTileIdx(selectedTile)?.idx ?? null : null);
        setTileReset(TileTriggerMode.CLEAR_SELECTED);
    };

    const commitTile = () => {
        if (!selectedTile) return;
        tileService.setTileUsed(selectedTile);
        setTileToPair(selectedTile);
        updateFullTile();
    };

    const resetGame = () => {
        setGameDone(false);
        setTileReset(TileTriggerMode.RESET_ALL);
        boardService.resetBoard();
        setSelectedBoardTile(null);
        setSelectedTile(null);
        setSelectedBoardTileFull(null);
        setSelectedTileFull(null);
        setValidPair(false);
        setTileToClear(null);
        setTileToPair(null);
    }

    const resetCallback = () => {
        setTileReset(TileTriggerMode.NONE);
    }

    return (
        <div className={`flex flex-col flex-1 overflow-auto`} style={getDynamicStyles()}>
            <div className={`grid grid-cols-2 p-4`}>
                <TileParent
                    selectedTile={selectedTile}
                    triggerReset={tileReset}
                    selectedOperator={selectedOperator}
                    setSelectedTile={setSelectedTile}
                    resetComplete={resetCallback}
                    setSelectedOperator={setSelectedOperator}
                />

                <Board
                    width={getAdjustedHeight()}
                    selectedBoardTile={selectedBoardTile}
                    tileToPair={tileToPair}
                    tileToClear={tileToClear}
                    triggerReset={!gameDone}
                    setSelectedBoardTile={setSelectedBoardTile}
                    refreshBoardState={() => updateFullBoardTile()}
                />
            </div>
            <Timer timerService={timerService}/>
            <ActionBar
                height={actionBarHeight}
                validCommit={validPair}
                selectedOperator={selectedOperator}
                timerMode={configService.getTimerMode()}
                timerService={timerService}
                addTiles={() => tileService.addTiles()}
                clearTile={clearTile}
                commitTile={commitTile}
                setSelectedOperator={setSelectedOperator}
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
