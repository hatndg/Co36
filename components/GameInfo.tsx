import React from 'react';
import { Player } from '../types';

interface GameInfoProps {
    statusText: string;
    skillCooldowns: { [key in Player]: number };
    currentPlayer: Player;
    gameOver: boolean;
    onUseSkill: (player: Player) => void;
    theme?: 'light' | 'dark';
}

const PlayerPanel: React.FC<{
    player: Player;
    cooldown: number;
    isActive: boolean;
    gameOver: boolean;
    onClick: () => void;
    theme: 'light' | 'dark';
}> = ({ player, cooldown, isActive, gameOver, onClick, theme }) => {
    const isReady = cooldown === 0;
    const isDisabled = gameOver || !isReady || !isActive;

    const baseClasses = 'p-3 sm:p-4 rounded-xl border-2 transition-all duration-300 w-full text-center';
    const themeClasses = theme === 'dark'
        ? 'bg-slate-800/50 border-slate-700'
        : 'bg-gray-200/70 border-gray-300';
    const activeClass = isActive && !gameOver ? 'animate-turn-glow' : '';
    const playerColor = player === 3 ? 'text-blue-400' : 'text-red-400';
    const buttonBg = player === 3 ? 'bg-blue-500 hover:bg-blue-600' : 'bg-red-500 hover:bg-red-600';

    return (
        <div className={`${baseClasses} ${themeClasses} ${activeClass}`}>
            <h3 className={`text-lg sm:text-xl font-bold mb-2 ${playerColor}`}>
                Người chơi {player}
            </h3>
            <button
                onClick={onClick}
                disabled={isDisabled}
                className={`w-full px-3 py-2 text-sm sm:text-base border-none rounded-md text-white font-semibold cursor-pointer transition-all duration-300 ${buttonBg} disabled:bg-gray-400 disabled:opacity-60 disabled:cursor-not-allowed active:scale-95 transform`}
            >
                {isReady ? `Kỹ năng` : `Hồi: ${cooldown}`}
            </button>
        </div>
    );
};

const GameInfo: React.FC<GameInfoProps> = ({
    statusText,
    skillCooldowns,
    currentPlayer,
    gameOver,
    onUseSkill,
    theme = 'light'
}) => {
    const titleColor = theme === 'dark' ? 'text-white' : 'text-gray-800';
    const statusColor = theme === 'dark' ? 'text-slate-200' : 'text-gray-700';
    const vsColor = theme === 'dark' ? 'text-slate-400' : 'text-gray-500';

    return (
        <div className="mb-4 text-center flex flex-col items-center w-full max-w-xl mx-auto">
            <h1 className={`text-3xl sm:text-4xl font-bold ${titleColor} mb-2`}>Cờ 36</h1>
            <p className={`text-base sm:text-lg ${statusColor} mb-4 h-7 transition-all duration-300`}>{statusText}</p>
            <div className="grid grid-cols-[1fr_auto_1fr] items-center justify-center gap-2 sm:gap-4 w-full">
                <PlayerPanel
                    player={3}
                    cooldown={skillCooldowns[3]}
                    isActive={currentPlayer === 3}
                    gameOver={gameOver}
                    onClick={() => onUseSkill(3)}
                    theme={theme}
                />
                <span className={`text-2xl font-bold ${vsColor}`}>VS</span>
                <PlayerPanel
                    player={6}
                    cooldown={skillCooldowns[6]}
                    isActive={currentPlayer === 6}
                    gameOver={gameOver}
                    onClick={() => onUseSkill(6)}
                    theme={theme}
                />
            </div>
        </div>
    );
};

export default GameInfo;
