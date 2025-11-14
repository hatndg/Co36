import React from 'react';
import { Player } from '../types';

interface GameInfoProps {
    statusText: string;
    skillCooldowns: { [key in Player]: number };
    currentPlayer: Player;
    gameOver: boolean;
    onUseSkill: (player: Player) => void;
}

const SkillButton: React.FC<{ player: Player; cooldown: number; gameOver: boolean; onClick: () => void }> = ({ player, cooldown, gameOver, onClick }) => {
    const isReady = cooldown === 0;
    const isDisabled = gameOver || !isReady;
    
    return (
        <button
            onClick={onClick}
            disabled={isDisabled}
            className="px-4 py-2 w-48 text-sm sm:text-base border-none rounded-md text-white font-semibold cursor-pointer transition-all duration-300 bg-green-500 hover:bg-green-600 disabled:bg-gray-400 disabled:opacity-70 disabled:cursor-not-allowed active:scale-95 transform"
        >
            {isReady ? `Kỹ năng: Rau Má (${player})` : `Hồi chiêu: ${cooldown} lượt`}
        </button>
    );
};


const GameInfo: React.FC<GameInfoProps> = ({
    statusText,
    skillCooldowns,
    currentPlayer,
    gameOver,
    onUseSkill,
}) => {
    return (
        <div className="mb-5 text-center flex flex-col items-center w-full">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-2 animate-title-glow">Cờ 36</h1>
            <p className="text-base sm:text-lg text-gray-700 mb-4 h-7 transition-all duration-300">{statusText}</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-4 w-full max-w-md">
                <SkillButton 
                    player={currentPlayer}
                    cooldown={skillCooldowns[currentPlayer]}
                    gameOver={gameOver}
                    onClick={() => onUseSkill(currentPlayer)}
                />
            </div>
        </div>
    );
};

export default GameInfo;