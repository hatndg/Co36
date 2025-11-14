import React from 'react';
import { CellState } from '../types';
import { BOARD_SIZE } from '../constants';

interface BoardProps {
    boardState: CellState[][];
    onCellClick: (row: number, col: number) => void;
    winningCells: { row: number; col: number }[];
}

const getCellClass = (cell: CellState): string => {
    switch (cell) {
        case 3:
            return 'text-blue-500';
        case 6:
            return 'text-red-500';
        case 'obstacle':
            return 'bg-green-800 bg-[linear-gradient(45deg,rgba(255,255,255,0.05)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.05)_50%,rgba(255,255,255,0.05)_75%,transparent_75%,transparent)] [background-size:20px_20px] border border-green-900 cursor-not-allowed';
        default:
            return 'hover:bg-gray-200';
    }
};

const Board: React.FC<BoardProps> = ({ boardState, onCellClick, winningCells }) => {
    return (
        <div
            className="grid gap-0.5 bg-gray-300 border border-gray-500 shadow-lg w-full max-w-md md:max-w-lg"
            style={{
                gridTemplateColumns: `repeat(${BOARD_SIZE}, minmax(0, 1fr))`,
            }}
        >
            {boardState.map((row, rowIndex) =>
                row.map((cellState, colIndex) => {
                    const isWinningCell = winningCells.some(
                        (wc) => wc.row === rowIndex && wc.col === colIndex
                    );
                    const cellContent = cellState !== 'obstacle' && cellState;
                    const animationClass = cellContent ? 'animate-piece-appear' : '';
                    const winClass = isWinningCell ? 'animate-win-highlight' : '';

                    return (
                        <div
                            key={`${rowIndex}-${colIndex}`}
                            className={`aspect-square bg-white flex justify-center items-center text-xl sm:text-2xl font-bold cursor-pointer transition-colors duration-200 ${getCellClass(
                                cellState
                            )} ${animationClass} ${winClass}`}
                            onClick={() => cellState !== 'obstacle' && onCellClick(rowIndex, colIndex)}
                        >
                            {cellContent}
                        </div>
                    );
                })
            )}
        </div>
    );
};

export default Board;
