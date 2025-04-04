import React, { useEffect, useState } from 'react'
import { BoardService } from '../../services/BoardService'
import { BoardTileProperties } from './BoardTileModels';
import BoardTile from './BoardTile';

interface BoardProps {
    width: number;
    selectedBoardTile: number | null;
    tileToPair: number | null;
    tileToClear: number | null;
    triggerReset: boolean;
    setSelectedBoardTile: (idx: number | null) => void;
    refreshBoardState: () => void;
}

const Board: React.FC<BoardProps> = ({ width, selectedBoardTile, tileToPair, tileToClear, triggerReset, setSelectedBoardTile, refreshBoardState }) => {
    const boardService = BoardService.getInstance();
    const [board, setBoard] = useState<BoardTileProperties[]>(boardService.getBoardData());

    useEffect(() => {
        boardService.getEventHandlerInstance().on('boardUpdated', () => {
            getBoardData();
        });
    }, []);

    useEffect(() => {
        if (triggerReset) {
            getBoardData();
        }
    }, [triggerReset]);

    useEffect(() => {
        if (selectedBoardTile == null || tileToPair == null) return
        boardService.setBoardTileComplete(selectedBoardTile, tileToPair);
        refreshBoardState();
    }, [tileToPair]);

    useEffect(() => {
        if (tileToClear == null) return
        boardService.clearBoardTile(tileToClear);
        setSelectedBoardTile(null);
        refreshBoardState();
    }, [tileToClear]);

    const getBoardData = () => {
        setBoard(boardService.getBoardData());
    };

    const onBoardTileClick = (idx: number, tileIdx: number | null) => {
        setSelectedBoardTile(idx);
    };

    const getBoardSizeStyle = () => `grid-cols-${boardService.getBoardSize()}`;

    return (
        <div className={`grid gap-1 p-4 max-w-[${width}lvh]`} style={{ gridTemplateColumns: `repeat(${boardService.getBoardSize()}, minmax(0, 1fr))` }}>
            {board.map((b) => {
                return <BoardTile {...b} selected={selectedBoardTile === b.idx} onBoardTileClick={onBoardTileClick}></BoardTile>
            })}
        </div>
    )
}

export default Board
