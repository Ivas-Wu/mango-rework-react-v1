import React, { useEffect, useState } from 'react'
import { BoardService } from '../../services/BoardService'
import { BoardTileProperties } from './BoardTileModels';
import BoardTile from './BoardTile';
import { BoardBroadcastConstants } from '../../constants/EventConstants';

interface BoardProps {
    boardService: BoardService;
    width: number;
    selectedBoardTile: number | null;
    tileToPair: number | null;
    tileToClear: number | null;
    setSelectedBoardTile: (idx: number | null) => void;
    refreshBoardState: () => void;
}

const Board: React.FC<BoardProps> = ({ boardService, width, selectedBoardTile, tileToPair, tileToClear, setSelectedBoardTile, refreshBoardState }) => {
    const [board, setBoard] = useState<BoardTileProperties[]>(boardService.getBoardData());

    useEffect(() => {
        boardService.on(BoardBroadcastConstants.BOARD_UPDATED, () => {
            getBoardData();
        });
    }, []);

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

    const getDynamicStyles = (): React.CSSProperties => {
        return {
            gridTemplateColumns: `repeat(${boardService.getBoardSize()}, minmax(0, 1fr))`,
            maxWidth: `${width}lvh`
        };
    };

    return (
        <div
            className={`grid gap-1 p-4`}
            style={getDynamicStyles()} >
            {board.map((b) => {
                return <BoardTile {...b} selected={selectedBoardTile === b.idx} onBoardTileClick={onBoardTileClick}></BoardTile>
            })}
        </div>
    )
}

export default Board
