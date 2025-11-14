import React, { useState, useEffect, useCallback } from 'react';
import { Player, CellState } from '../types';
import {
    BOARD_SIZE,
    OBSTACLE_COUNT,
    WIN_CONDITION_3,
    WIN_CONDITION_6,
    SKILL_COOLDOWN_3,
    SKILL_COOLDOWN_6,
} from '../constants';
import Board from './Board';
import GameInfo from './GameInfo';
import GameOverOverlay from './GameOverOverlay';

type WinCell = { row: number; col: number };

interface GameProps {
    onGoHome: () => void;
}

const Game: React.FC<GameProps> = ({ onGoHome }) => {
    const [boardState, setBoardState] = useState<CellState[][]>([]);
    const [currentPlayer, setCurrentPlayer] = useState<Player>(3);
    const [movesLeft, setMovesLeft] = useState<number>(2);
    const [skillCooldowns, setSkillCooldowns] = useState<{ [key in Player]: number }>({ 3: 0, 6: 0 });
    const [skillActive, setSkillActive] = useState<boolean>(false);
    const [winner, setWinner] = useState<Player | null>(null);
    const [statusText, setStatusText] = useState<string>('');
    const [winningCells, setWinningCells] = useState<WinCell[]>([]);

    const gameOver = winner !== null;

    const initGame = useCallback(() => {
        const initialBoard: CellState[][] = Array.from({ length: BOARD_SIZE }, () =>
            Array(BOARD_SIZE).fill(null)
        );

        // Place obstacles
        let placed = 0;
        while (placed < OBSTACLE_COUNT) {
            const row = Math.floor(Math.random() * BOARD_SIZE);
            const col = Math.floor(Math.random() * BOARD_SIZE);
            if (!initialBoard[row][col]) {
                initialBoard[row][col] = 'obstacle';
                placed++;
            }
        }

        setBoardState(initialBoard);
        setCurrentPlayer(3);
        setMovesLeft(2);
        setSkillCooldowns({ 3: 0, 6: 0 });
        setSkillActive(false);
        setWinner(null);
        setWinningCells([]);
    }, []);

    useEffect(() => {
        initGame();
    }, [initGame]);

    useEffect(() => {
        if (gameOver) return;
        setStatusText(`Lượt của người chơi ${currentPlayer}. Còn ${movesLeft} nước đi.`);
    }, [currentPlayer, movesLeft, gameOver]);


    const checkWin = useCallback((row: number, col: number, player: Player, board: CellState[][]): WinCell[] | null => {
        const winCondition = (player === 3) ? WIN_CONDITION_3 : WIN_CONDITION_6;
        const directions = (player === 3)
            ? [[0, 1], [1, 0]] // Player 3: only horizontal and vertical
            : [[0, 1], [1, 0], [1, 1], [1, -1]]; // Player 6: horizontal, vertical, and diagonals

        for (const [dr, dc] of directions) {
            const line: WinCell[] = [{ row, col }];
            // Count in the positive direction
            for (let i = 1; i < winCondition; i++) {
                const r = row + i * dr;
                const c = col + i * dc;
                if (r >= 0 && r < BOARD_SIZE && c >= 0 && c < BOARD_SIZE && board[r][c] === player) {
                    line.push({ row: r, col: c });
                } else {
                    break;
                }
            }
            // Count in the negative direction
            for (let i = 1; i < winCondition; i++) {
                const r = row - i * dr;
                const c = col - i * dc;
                if (r >= 0 && r < BOARD_SIZE && c >= 0 && c < BOARD_SIZE && board[r][c] === player) {
                    line.push({ row: r, col: c });
                } else {
                    break;
                }
            }
            if (line.length >= winCondition) {
                return line;
            }
        }
        return null;
    }, []);

    const switchPlayer = useCallback(() => {
        setSkillCooldowns(prev => ({
            3: Math.max(0, prev[3] - 1),
            6: Math.max(0, prev[6] - 1),
        }));
        
        const nextPlayer = currentPlayer === 3 ? 6 : 3;
        setCurrentPlayer(nextPlayer);
        setMovesLeft(nextPlayer === 3 ? 2 : 1);
    }, [currentPlayer]);

    const handleCellClick = useCallback((row: number, col: number) => {
        if (gameOver || boardState[row]?.[col]) {
            return;
        }

        const newBoardState = boardState.map(r => [...r]);
        newBoardState[row][col] = currentPlayer;
        setBoardState(newBoardState);

        const winningLine = checkWin(row, col, currentPlayer, newBoardState);
        if (winningLine) {
            setStatusText(`Người chơi ${currentPlayer} chiến thắng!`);
            setWinner(currentPlayer);
            setWinningCells(winningLine);
            return;
        }

        const newMovesLeft = movesLeft - 1;

        if (skillActive) {
            setSkillActive(false);
            switchPlayer();
        } else if (newMovesLeft === 0) {
            switchPlayer();
        } else {
            setMovesLeft(newMovesLeft);
        }
    }, [gameOver, boardState, currentPlayer, movesLeft, skillActive, checkWin, switchPlayer]);

    const handleUseSkill = (player: Player) => {
        if (gameOver || currentPlayer !== player || skillCooldowns[player] > 0) return;

        setSkillActive(true);
        setMovesLeft(prev => prev + 1);
        setSkillCooldowns(prev => ({
            ...prev,
            [player]: player === 3 ? SKILL_COOLDOWN_3 : SKILL_COOLDOWN_6,
        }));
    };

    return (
        <div className="flex flex-col justify-center items-center w-full animate-fade-in-up">
            <GameInfo
                statusText={statusText}
                skillCooldowns={skillCooldowns}
                currentPlayer={currentPlayer}
                gameOver={gameOver}
                onUseSkill={handleUseSkill}
            />
            <Board boardState={boardState} onCellClick={handleCellClick} winningCells={winningCells} />
            <button 
                onClick={onGoHome}
                className="mt-6 px-6 py-2 text-base border-none rounded-full text-white font-semibold cursor-pointer transition-all duration-300 bg-gray-500 hover:bg-gray-600 active:scale-95 transform shadow-md hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-gray-300"
            >
                Về Trang Chủ
            </button>
            <GameOverOverlay winner={winner} onRestart={initGame} />
        </div>
    );
};

export default Game;