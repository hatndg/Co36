
import React, { useState, useEffect, useCallback } from 'react';
import { Player, CellState } from './types';
import {
    BOARD_SIZE,
    OBSTACLE_COUNT,
    WIN_CONDITION_3,
    WIN_CONDITION_6,
    SKILL_COOLDOWN_3,
    SKILL_COOLDOWN_6,
} from './constants';
import Board from './components/Board';
import GameInfo from './components/GameInfo';
import GameOverOverlay from './components/GameOverOverlay';
import LandingPage from './components/LandingPage';
import MobileApp from './components/MobileApp';
import { playSound } from './utils/sounds';

type WinCell = { row: number; col: number };

type View = 'landing' | 'game' | 'mobile';

const App: React.FC = () => {
    const getInitialView = (): View => {
        return window.location.hash === '#mobile' ? 'mobile' : 'landing';
    };

    const [view, setView] = useState<View>(getInitialView());
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
        
        const obstacleColors = ['green', 'red', 'orange', 'blue'];

        // Place obstacles
        let placed = 0;
        while (placed < OBSTACLE_COUNT) {
            const row = Math.floor(Math.random() * BOARD_SIZE);
            const col = Math.floor(Math.random() * BOARD_SIZE);
            if (!initialBoard[row][col]) {
                const randomColor = obstacleColors[Math.floor(Math.random() * obstacleColors.length)];
                initialBoard[row][col] = { type: 'obstacle', color: randomColor };
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
    
    // Effect for handling hash changes for mobile view
    useEffect(() => {
        const handleHashChange = () => {
            setView(getInitialView());
        };

        window.addEventListener('hashchange', handleHashChange);
        
        // Cleanup listener on unmount
        return () => {
            window.removeEventListener('hashchange', handleHashChange);
        };
    }, []);


    useEffect(() => {
        if (view === 'game') {
            initGame();
        }
    }, [view, initGame]);

    useEffect(() => {
        if (gameOver || view !== 'game') return;
        setStatusText(`Lượt của người chơi ${currentPlayer}. Còn ${movesLeft} nước đi.`);
    }, [currentPlayer, movesLeft, gameOver, view]);


    const checkWin = useCallback((row: number, col: number, player: Player, board: CellState[][]): WinCell[] | null => {
        // Player 3 (Blue) needs 6 in a row, including diagonals.
        // Player 6 (Red) needs 3 in a row, but NOT diagonals.
        const winCondition = (player === 3) ? WIN_CONDITION_3 : WIN_CONDITION_6;
        const directions = (player === 3)
            ? [[0, 1], [1, 0], [1, 1], [1, -1]] // Player 3: horizontal, vertical, and diagonals
            : [[0, 1], [1, 0]]; // Player 6: only horizontal and vertical

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

        playSound('place');
        const newBoardState = boardState.map(r => [...r]);
        newBoardState[row][col] = currentPlayer;
        setBoardState(newBoardState);

        const winningLine = checkWin(row, col, currentPlayer, newBoardState);
        if (winningLine) {
            setStatusText(`Người chơi ${currentPlayer} chiến thắng!`);
            setWinner(currentPlayer);
            setWinningCells(winningLine);
            playSound('win');
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

        playSound('skill');
        setSkillActive(true);
        setMovesLeft(prev => prev + 1);
        setSkillCooldowns(prev => ({
            ...prev,
            [player]: player === 3 ? SKILL_COOLDOWN_3 : SKILL_COOLDOWN_6,
        }));
    };
    
    const handlePlay = () => {
        playSound('click');
        setView('game');
    };

    if (view === 'mobile') {
        return <MobileApp />;
    }

    if (view === 'landing') {
        return <LandingPage onPlay={handlePlay} />;
    }

    return (
        <div className="flex flex-col justify-center items-center min-h-screen font-sans p-2 sm:p-4 bg-gray-100">
            <GameInfo
                statusText={statusText}
                skillCooldowns={skillCooldowns}
                currentPlayer={currentPlayer}
                gameOver={gameOver}
                onUseSkill={handleUseSkill}
            />
            <Board boardState={boardState} onCellClick={handleCellClick} winningCells={winningCells} />
            <GameOverOverlay winner={winner} onConfirm={initGame} confirmText="Chơi lại" />
        </div>
    );
};

export default App;
