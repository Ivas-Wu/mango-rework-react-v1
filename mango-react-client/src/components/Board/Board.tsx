import React, { useEffect, useState } from 'react'
import { BoardService } from '../../services/BoardService'
import { BoardTileProperties } from './BoardTileModels';
import BoardTile from './BoardTile';

interface BoardProps {
    selectedBoardTile: number | null;
    tileToPair: number | null;
    tileToClear: number | null;
    setSelectedBoardTile: (idx: number | null) => void;
    refreshBoardState:() => void;
}

const Board: React.FC<BoardProps> = ({ selectedBoardTile, tileToPair, tileToClear, setSelectedBoardTile, refreshBoardState }) => {
    const boardService = BoardService.getInstance();
    const [board, setBoard] = useState<BoardTileProperties[]>(boardService.getBoardData());

    useEffect(() => {
        if (selectedBoardTile == null || tileToPair == null) return
        setBoard(boardService.setBoardTileComplete(selectedBoardTile, tileToPair));
        refreshBoardState();
    }, [tileToPair]);

    useEffect(() => {
        if (tileToClear == null) return
        setBoard(boardService.clearBoardTile(tileToClear));
        setSelectedBoardTile(null);
        refreshBoardState();
    }, [tileToClear]);

    const onBoardTileClick = (idx: number, tileIdx: number | null) => {
        setSelectedBoardTile(idx);
    }

    const getBoardSizeStyle = () => `grid-cols-${boardService.getBoardSize()}`;

    return (
        <div className={`grid gap-1 p-4 max-w-[93lvh] ${getBoardSizeStyle()}`}>
            {board.map((b) => {
                return <BoardTile {...b} selected={selectedBoardTile === b.idx} onBoardTileClick={onBoardTileClick}></BoardTile>
            })}
        </div>
    )
}

export default Board
