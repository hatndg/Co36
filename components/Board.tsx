import React from 'react';
import { CellState, Obstacle } from '../types';
import { BOARD_SIZE } from '../constants';

interface BoardProps {
    boardState: CellState[][];
    onCellClick: (row: number, col: number) => void;
    winningCells: { row: number; col: number }[];
    lastMove?: { row: number; col: number } | null;
}

const getCellClass = (cell: CellState): string => {
    // Player pieces
    if (typeof cell === 'number') {
        return cell === 3 ? 'bg-white text-blue-500' : 'bg-white text-red-500';
    }
    
    // Obstacles
    if (cell && typeof cell === 'object' && cell.type === 'obstacle') {
        const color = cell.color;
        const colorClasses: { [key: string]: string } = {
            green: 'bg-green-800 border-green-900',
            red: 'bg-red-800 border-red-900',
            orange: 'bg-orange-800 border-orange-900',
            blue: 'bg-blue-800 border-blue-900',
        };
        const baseClasses = 'bg-[linear-gradient(45deg,rgba(255,255,255,0.05)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.05)_50%,rgba(255,255,255,0.05)_75%,transparent_75%,transparent)] [background-size:20px_20px] cursor-not-allowed';
        return `${colorClasses[color] || 'bg-gray-800 border-gray-900'} ${baseClasses}`;
    }

    // Empty cells (null)
    return 'bg-white hover:bg-gray-200';
};

const Board: React.FC<BoardProps> = ({ boardState, onCellClick, winningCells, lastMove }) => {
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
                    const isObstacle = cellState && typeof cellState === 'object' && (cellState as Obstacle).type === 'obstacle';
                    // FIX: Ensure cellContent is a valid ReactNode. Obstacle objects are not renderable.
                    // Only render content if the cell state is a player number.
                    const cellContent = typeof cellState === 'number' ? cellState : null;
                    const animationClass = cellContent ? 'animate-piece-appear' : '';
                    const winClass = isWinningCell ? 'animate-win-highlight' : '';
                    const isLastMove = lastMove && lastMove.row === rowIndex && lastMove.col === colIndex;
                    const highlightClass = isLastMove ? 'animate-highlight-move' : '';

                    return (
                        <div
                            key={`${rowIndex}-${colIndex}`}
                            className={`aspect-square flex justify-center items-center text-xl sm:text-2xl font-bold cursor-pointer transition-colors duration-200 ${getCellClass(
                                cellState
                            )} ${animationClass} ${winClass} ${highlightClass}`}
                            onClick={() => !isObstacle && onCellClick(rowIndex, colIndex)}
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