import React, { useEffect, useState } from 'react'
import { BoardService } from '../../services/BoardService'
import { BoardTileProperties } from './BoardTileModels';
import BoardTile from './BoardTile';

interface BoardProps {
    selectedBoardTile: number | null;
    tileToPair: number | null;
    setSelectedBoardTile: (idx: number | null) => void;
    refreshBoardState:() => void;
}

const Board: React.FC<BoardProps> = ({ selectedBoardTile, tileToPair, setSelectedBoardTile, refreshBoardState }) => {
    const boardService = BoardService.getInstance();
    const [board, setBoard] = useState<BoardTileProperties[]>(boardService.getBoardData());

    useEffect(() => {
        if (!selectedBoardTile || !tileToPair) return
        setBoard(boardService.setBoardTileComplete(selectedBoardTile, tileToPair));
        refreshBoardState();
    }, [tileToPair]);

    const onBoardTileClick = (idx: number, tileIdx: number | null) => {
        setSelectedBoardTile(idx);
    }

    const getBoardSize = () => boardService.getBoardSize();

    return (
        <div className={`grid gap-1 p-4 grid-cols-${getBoardSize()} max-w-[100lvh]`}>
            {board.map((b) => {
                return <BoardTile {...b} selected={selectedBoardTile === b.idx} onBoardTileClick={onBoardTileClick}></BoardTile>
            })}
        </div>
    )
}

export default Board
