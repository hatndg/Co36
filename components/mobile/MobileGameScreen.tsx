
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
import { playSound } from '../../utils/sounds';

interface MobileGameScreenProps {
    onExit: () => void;
}

type WinCell = { row: number; col: number };
type PostGameInfo = { initialElo: number; eloChange: number; finalElo: number };
type GameOverViewMode = 'popup' | 'review';

const AI_PLAYER: Player = 6;
const HUMAN_PLAYER: Player = 3;

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
    const [gameOverViewMode, setGameOverViewMode] = useState<GameOverViewMode>('popup');

    const gameOver = winner !== null;

    const initGame = useCallback((mode: GameMode) => {
        playSound('click');
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
        setGameOverViewMode('popup'); // Reset view mode
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
            let count = 1;
            const line: WinCell[] = [{ row, col }];

            // Check in positive direction
            for (let i = 1; i < winCondition; i++) {
                const r = row + i * dr;
                const c = col + i * dc;
                if (r >= 0 && r < BOARD_SIZE && c >= 0 && c < BOARD_SIZE && board[r][c] === player) {
                    count++;
                    line.push({ row: r, col: c });
                } else {
                    break;
                }
            }

            // Check in negative direction
            for (let i = 1; i < winCondition; i++) {
                const r = row - i * dr;
                const c = col - i * dc;
                if (r >= 0 && r < BOARD_SIZE && c >= 0 && c < BOARD_SIZE && board[r][c] === player) {
                    count++;
                    line.unshift({ row: r, col: c });
                } else {
                    break;
                }
            }
            
            if (count >= winCondition) {
                return line;
            }
        }

        return null;
    }, []);

    const handleEndGame = useCallback((gameWinner: Player) => {
        setGameOverViewMode('popup'); // Ensure popup shows first
        if (gameMode === 'vs-ai-ranked') {
            const playerElo = getElo();
            const aiElo = 1200; // Fixed ELO for AI
            const result = gameWinner === HUMAN_PLAYER ? 'win' : 'loss';
            const eloChange = calculateEloChange(playerElo, aiElo, result === 'win' ? 1 : 0);
            const finalElo = playerElo + eloChange;

            setPostGameInfo({ initialElo: playerElo, eloChange, finalElo });
            playSound(result === 'win' ? 'win' : 'lose');
        } else {
             playSound('win');
        }
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
    
    const handleReviewMoves = () => {
        playSound('click');
        setGameOverViewMode('review');
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
        if (player === HUMAN_PLAYER) playSound('place');
        else setTimeout(() => playSound('place'), 300); // Delay AI sound slightly

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
    
    const getLineInfo = useCallback((board: CellState[][], r: number, c: number, dr: number, dc: number, player: Player) => {
        let count = 0;
        let openEnds = 0;
        
        // Positive direction
        for (let i = 1; i < 7; i++) {
            const R = r + i * dr;
            const C = c + i * dc;
            if (R < 0 || R >= BOARD_SIZE || C < 0 || C >= BOARD_SIZE || board[R][C] !== player) {
                if (R >= 0 && R < BOARD_SIZE && C >= 0 && C < BOARD_SIZE && board[R][C] === null) openEnds++;
                break;
            }
            count++;
        }
        
        // Negative direction
        for (let i = 1; i < 7; i++) {
            const R = r - i * dr;
            const C = c - i * dc;
            if (R < 0 || R >= BOARD_SIZE || C < 0 || C >= BOARD_SIZE || board[R][C] !== player) {
                 if (R >= 0 && R < BOARD_SIZE && C >= 0 && C < BOARD_SIZE && board[R][C] === null) openEnds++;
                break;
            }
            count++;
        }
        
        return { count: count + 1, openEnds };
    }, []);

    const getMoveScore = useCallback((board: CellState[][], r: number, c: number, player: Player) => {
        const winCondition = player === 3 ? WIN_CONDITION_3 : WIN_CONDITION_6;
        const directions = player === 3 ? [[0, 1], [1, 0]] : [[0, 1], [1, 0], [1, 1], [1, -1]];
        let totalScore = 0;

        for (const [dr, dc] of directions) {
            const { count, openEnds } = getLineInfo(board, r, c, dr, dc, player);
            
            if (count >= winCondition) return 100000;
            if (count === winCondition - 1 && openEnds >= 1) totalScore += 5000;
            if (count === winCondition - 2 && openEnds === 2) totalScore += 1000;
            if (count === winCondition - 2 && openEnds === 1) totalScore += 500;
            if (count === winCondition - 3 && openEnds === 2) totalScore += 200;
            totalScore += count * 10;
        }
        return totalScore;
    }, [getLineInfo]);

    const findBestMove = useCallback((): { row: number; col: number } => {
        let bestMove: { row: number, col: number } | null = null;
        let maxScore = -Infinity;
        const emptyCells: { row: number, col: number }[] = [];
        
        boardState.forEach((row, rIdx) => {
            row.forEach((cell, cIdx) => {
                if (!cell) emptyCells.push({ row: rIdx, col: cIdx });
            });
        });

        if (emptyCells.length === 0) return { row: -1, col: -1 };

        // Prioritize center if board is empty
        if (emptyCells.length > (BOARD_SIZE * BOARD_SIZE - 5)) {
             return { row: Math.floor(BOARD_SIZE/2), col: Math.floor(BOARD_SIZE/2) };
        }

        for (const { row, col } of emptyCells) {
            let tempBoard = boardState.map(r => [...r]);
            
            // 1. Offensive Score
            tempBoard[row][col] = AI_PLAYER;
            const offensiveScore = getMoveScore(tempBoard, row, col, AI_PLAYER);
            
            // 2. Defensive Score
            tempBoard[row][col] = HUMAN_PLAYER;
            const defensiveScore = getMoveScore(tempBoard, row, col, HUMAN_PLAYER);

            // Reset cell for next iteration
            tempBoard[row][col] = null;
            
            const totalScore = offensiveScore + defensiveScore * 1.5;

            if (totalScore > maxScore) {
                maxScore = totalScore;
                bestMove = { row, col };
            }
        }
        
        return bestMove ?? emptyCells[Math.floor(Math.random() * emptyCells.length)];
    }, [boardState, getMoveScore]);
    
    const makeAIMove = useCallback(() => {
        setIsAiThinking(true);
        setTimeout(() => {
            const move = findBestMove();
            if (move && move.row !== -1) {
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
        playSound('skill');
        setSkillActive(true);
        setMovesLeft(prev => prev + 1);
        setSkillCooldowns(prev => ({ ...prev, [player]: player === 3 ? SKILL_COOLDOWN_3 : SKILL_COOLDOWN_6 }));
    };

    const handleExitClick = () => {
        playSound('click');
        onExit();
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
                        <button onClick={handleExitClick} className="w-full mt-4 px-6 py-3 text-lg border-2 border-slate-500 rounded-full text-slate-300 font-bold cursor-pointer transition-all duration-300 hover:bg-slate-700 active:scale-95">
                            Quay lại
                        </button>
                     </div>
                </div>
            ) : (
                <>
                    <div className="p-4 shrink-0">
                        <GameInfo
                            theme="dark"
                            statusText={statusText}
                            skillCooldowns={skillCooldowns}
                            currentPlayer={currentPlayer}
                            gameOver={gameOver}
                            onUseSkill={handleUseSkill}
                        />
                    </div>
                    <main className="flex-grow flex justify-center items-center px-2 pb-2 min-h-0">
                         <Board boardState={boardState} onCellClick={handleCellClick} winningCells={winningCells} lastMove={lastMove} />
                    </main>
                    <GameOverOverlay 
                        winner={winner} 
                        onConfirm={handleConfirmGameOver} 
                        confirmText="Xác nhận"
                        eloInfo={postGameInfo ?? undefined}
                        viewMode={gameOverViewMode}
                        onReview={handleReviewMoves}
                    />
                </>
            )}
        </div>
    );
};

export default MobileGameScreen;
