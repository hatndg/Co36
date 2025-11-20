
import React, { useState, useEffect, useCallback } from 'react';
import { Player, CellState, GameMode } from '../../types';
import {
    BOARD_SIZE,
    OBSTACLE_COUNT,
    WIN_CONDITION_3,
    WIN_CONDITION_6,
    SKILL_COOLDOWN_3,
    SKILL_COOLDOWN_6,
} from '../../constants';
import Board from '../Board';
import GameInfo from '../GameInfo';
import GameOverOverlay from '../GameOverOverlay';
import { addGameToHistory, getElo, saveElo } from '../../utils/storage';
import { calculateEloChange } from '../../utils/elo';

interface MobileGameScreenProps {
    onExit: () => void;
}

type WinCell = { row: number; col: number };
type PostGameInfo = { initialElo: number; eloChange: number; finalElo: number };

const AI_PLAYER: Player = 6;

const MobileGameScreen: React.FC<MobileGameScreenProps> = ({ onExit }) => {
    const [gameMode, setGameMode] = useState<GameMode>(null);
    const [boardState, setBoardState] = useState<CellState[][]>([]);
    const [currentPlayer, setCurrentPlayer] = useState<Player>(3);
    const [movesLeft, setMovesLeft] = useState<number>(2);
    const [skillCooldowns, setSkillCooldowns] = useState<{ [key in Player]: number }>({ 3: 0, 6: 0 });
    const [skillActive, setSkillActive] = useState<boolean>(false);
    const [winner, setWinner] = useState<Player | null>(null);
    const [statusText, setStatusText] = useState<string>('');
    const [winningCells, setWinningCells] = useState<WinCell[]>([]);
    const [isAiThinking, setIsAiThinking] = useState(false);
    const [lastMove, setLastMove] = useState<{ row: number; col: number } | null>(null);
    const [postGameInfo, setPostGameInfo] = useState<PostGameInfo | null>(null);

    const gameOver = winner !== null;

    const initGame = useCallback((mode: GameMode) => {
        setGameMode(mode);
        const initialBoard: CellState[][] = Array.from({ length: BOARD_SIZE }, () =>
            Array(BOARD_SIZE).fill(null)
        );
        const obstacleColors = ['green', 'red', 'orange', 'blue'];
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
        setLastMove(null);
        setPostGameInfo(null);
    }, []);
    
    useEffect(() => {
        if (gameOver || !gameMode) return;

        if (gameMode === 'vs-ai-ranked') {
            if (currentPlayer === AI_PLAYER) {
                setStatusText('Máy đang suy nghĩ...');
            } else {
                setStatusText(`Lượt của bạn. Còn ${movesLeft} nước đi.`);
            }
        } else if (gameMode === 'vs-player') {
            setStatusText(`Lượt của người chơi ${currentPlayer}. Còn ${movesLeft} nước đi.`);
        }
    }, [currentPlayer, movesLeft, gameOver, gameMode]);

    const checkWin = useCallback((row: number, col: number, player: Player, board: CellState[][]): WinCell[] | null => {
        const winCondition = (player === 3) ? WIN_CONDITION_3 : WIN_CONDITION_6;
        const directions = (player === 3)
            ? [[0, 1], [1, 0]]
            : [[0, 1], [1, 0], [1, 1], [1, -1]];
        for (const [dr, dc] of directions) {
            const line: WinCell[] = [{ row, col }];
            for (let i = 1; i < winCondition; i++) {
                const r = row + i * dr;
                const c = col + i * dc;
                if (r >= 0 && r < BOARD_SIZE && c >= 0 && c < BOARD_SIZE && board[r][c] === player) {
                    line.push({ row: r, col: c });
                } else break;
            }
            for (let i = 1; i < winCondition; i++) {
                const r = row - i * dr;
                const c = col - i * dc;
                if (r >= 0 && r < BOARD_SIZE && c >= 0 && c < BOARD_SIZE && board[r][c] === player) {
                    line.push({ row: r, col: c });
                } else break;
            }
            if (line.length >= winCondition) return line;
        }
        return null;
    }, []);

    const handleEndGame = useCallback((gameWinner: Player) => {
        if (gameMode !== 'vs-ai-ranked') return;

        const playerElo = getElo();
        const aiElo = 1200; // Fixed ELO for AI
        const result = gameWinner === 3 ? 'win' : 'loss';
        const eloChange = calculateEloChange(playerElo, aiElo, result === 'win' ? 1 : 0);
        const finalElo = playerElo + eloChange;

        setPostGameInfo({ initialElo: playerElo, eloChange, finalElo });
    }, [gameMode]);

    const handleConfirmGameOver = () => {
        if (!winner || !gameMode) return;

        const commonHistory = {
            id: new Date().toISOString(),
            date: new Date().toLocaleDateString('vi-VN'),
            gameMode,
            winner,
        };

        if (gameMode === 'vs-ai-ranked' && postGameInfo) {
            saveElo(postGameInfo.finalElo);
            addGameToHistory({
                ...commonHistory,
                result: winner === 3 ? 'win' : 'loss',
                opponent: 'AI (Ranked)',
                eloChange: postGameInfo.eloChange,
                finalElo: postGameInfo.finalElo,
            });
        } else {
             addGameToHistory(commonHistory);
        }

        onExit();
    };

    const switchPlayer = useCallback(() => {
        setSkillCooldowns(prev => ({
            3: Math.max(0, prev[3] - 1),
            6: Math.max(0, prev[6] - 1),
        }));
        
        if (skillActive) {
            setSkillActive(false);
        }

        const nextPlayer = currentPlayer === 3 ? 6 : 3;
        setCurrentPlayer(nextPlayer);
        setMovesLeft(nextPlayer === 3 ? 2 : 1);
    }, [currentPlayer, skillActive]);
    
    const makeMove = useCallback((row: number, col: number, player: Player) => {
        const newBoardState = boardState.map(r => [...r]);
        newBoardState[row][col] = player;
        setBoardState(newBoardState);
        setLastMove({ row, col });

        const winningLine = checkWin(row, col, player, newBoardState);
        if (winningLine) {
            setStatusText(`Người chơi ${player} thắng!`);
            setWinner(player);
            setWinningCells(winningLine);
            handleEndGame(player);
            return true;
        }
        return false;
    }, [boardState, checkWin, handleEndGame]);

    const getLineLength = useCallback((board: CellState[][], row: number, col: number, player: Player): number => {
        const directions = player === 3 ? [[0, 1], [1, 0]] : [[0, 1], [1, 0], [1, 1], [1, -1]];
        let maxLength = 0;

        for (const [dr, dc] of directions) {
            let currentLength = 1;
            for (let i = 1; i < 6; i++) {
                const r = row + i * dr;
                const c = col + i * dc;
                if (r >= 0 && r < BOARD_SIZE && c >= 0 && c < BOARD_SIZE && board[r][c] === player) {
                    currentLength++;
                } else break;
            }
            for (let i = 1; i < 6; i++) {
                const r = row - i * dr;
                const c = col - i * dc;
                if (r >= 0 && r < BOARD_SIZE && c >= 0 && c < BOARD_SIZE && board[r][c] === player) {
                    currentLength++;
                } else break;
            }
            if (currentLength > maxLength) {
                maxLength = currentLength;
            }
        }
        return maxLength;
    }, []);

    const findBestMove = useCallback((): { row: number; col: number } => {
        let bestMove: { row: number, col: number } | null = null;
        let maxScore = -1;
        const emptyCells: { row: number, col: number }[] = [];
        
        boardState.forEach((row, rIdx) => {
            row.forEach((cell, cIdx) => {
                if (!cell) emptyCells.push({ row: rIdx, col: cIdx });
            });
        });

        if (emptyCells.length === 0) return { row: 0, col: 0 };

        for (const { row, col } of emptyCells) {
            let aiTempBoard = boardState.map(r => [...r]);
            aiTempBoard[row][col] = AI_PLAYER;
            if (checkWin(row, col, AI_PLAYER, aiTempBoard)) {
                return { row, col };
            }

            let playerTempBoard = boardState.map(r => [...r]);
            playerTempBoard[row][col] = 3;
            if (getLineLength(playerTempBoard, row, col, 3) >= WIN_CONDITION_3 - 1) {
                return { row, col };
            }
        }

        for (const { row, col } of emptyCells) {
            let playerTempBoard = boardState.map(r => [...r]);
            playerTempBoard[row][col] = 3;
            const defensiveScore = Math.pow(getLineLength(playerTempBoard, row, col, 3), 2);

            let aiTempBoard = boardState.map(r => [...r]);
            aiTempBoard[row][col] = AI_PLAYER;
            const offensiveScore = Math.pow(getLineLength(aiTempBoard, row, col, AI_PLAYER), 2);
            
            const totalScore = defensiveScore * 1.5 + offensiveScore;

            if (totalScore > maxScore) {
                maxScore = totalScore;
                bestMove = { row, col };
            }
        }
        
        return bestMove ?? emptyCells[Math.floor(Math.random() * emptyCells.length)];
    }, [boardState, checkWin, getLineLength]);
    
    const makeAIMove = useCallback(() => {
        setIsAiThinking(true);
        setTimeout(() => {
            const move = findBestMove();
            if (move) {
                const isGameOver = makeMove(move.row, move.col, AI_PLAYER);
                if (!isGameOver) {
                    switchPlayer();
                }
            }
            setIsAiThinking(false);
        }, 800);
    }, [findBestMove, makeMove, switchPlayer]);

    useEffect(() => {
        if (gameMode === 'vs-ai-ranked' && currentPlayer === AI_PLAYER && !gameOver && !isAiThinking) {
            makeAIMove();
        }
    }, [currentPlayer, gameMode, gameOver, isAiThinking, makeAIMove]);

    const handleCellClick = useCallback((row: number, col: number) => {
        if (gameOver || boardState[row]?.[col] || (gameMode === 'vs-ai-ranked' && currentPlayer === AI_PLAYER)) {
            return;
        }

        const isGameOver = makeMove(row, col, currentPlayer);
        if (isGameOver) return;

        const newMovesLeft = movesLeft - 1;
        if (skillActive && (currentPlayer === 3 ? newMovesLeft <= 1 : newMovesLeft <= 0)) {
             setSkillActive(false); // consume skill after first of bonus moves
        }
        
        if (newMovesLeft === 0) {
            switchPlayer();
        } else {
            setMovesLeft(newMovesLeft);
        }
    }, [gameOver, boardState, currentPlayer, movesLeft, gameMode, makeMove, switchPlayer, skillActive]);

    const handleUseSkill = (player: Player) => {
        if (gameOver || currentPlayer !== player || skillCooldowns[player] > 0) return;
        setSkillActive(true);
        setMovesLeft(prev => prev + 1);
        setSkillCooldowns(prev => ({ ...prev, [player]: player === 3 ? SKILL_COOLDOWN_3 : SKILL_COOLDOWN_6 }));
    };

    return (
        <div className="flex flex-col h-full font-sans bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 text-white overflow-hidden">
            {!gameMode ? (
                <div className="flex flex-col items-center justify-center w-full h-full p-4">
                     <h2 className="text-3xl font-bold mb-8">Chọn chế độ chơi</h2>
                     <div className="flex flex-col gap-4 w-full max-w-xs">
                        <button onClick={() => initGame('vs-ai-ranked')} className="w-full px-6 py-3 text-lg border-none rounded-full text-white font-bold cursor-pointer transition-all duration-300 bg-green-600 hover:bg-green-700 active:scale-95">
                            Chơi hạng với Máy
                        </button>
                        <button onClick={() => initGame('vs-player')} className="w-full px-6 py-3 text-lg border-none rounded-full text-white font-bold cursor-pointer transition-all duration-300 bg-blue-600 hover:bg-blue-700 active:scale-95">
                            Chơi với bạn bè
                        </button>
                        <button onClick={onExit} className="w-full mt-4 px-6 py-3 text-lg border-2 border-slate-500 rounded-full text-slate-300 font-bold cursor-pointer transition-all duration-300 hover:bg-slate-700 active:scale-95">
                            Quay lại
                        </button>
                     </div>
                </div>
            ) : (
                <>
                    <div className="p-2 sm:p-4 shrink-0">
                        <GameInfo
                            theme="dark"
                            statusText={statusText}
                            skillCooldowns={skillCooldowns}
                            currentPlayer={currentPlayer}
                            gameOver={gameOver}
                            onUseSkill={handleUseSkill}
                        />
                    </div>
                    <main className="flex-grow flex justify-center items-center p-2 min-h-0">
                         <Board boardState={boardState} onCellClick={handleCellClick} winningCells={winningCells} lastMove={lastMove} />
                    </main>
                    <GameOverOverlay 
                        winner={winner} 
                        onConfirm={handleConfirmGameOver} 
                        confirmText="Xác nhận"
                        eloInfo={postGameInfo ?? undefined}
                    />
                </>
            )}
        </div>
    );
};

export default MobileGameScreen;