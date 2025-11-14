import React from 'react';
import { Player } from '../types';

interface GameOverOverlayProps {
    winner: Player | null;
    onRestart: () => void;
}

const GameOverOverlay: React.FC<GameOverOverlayProps> = ({ winner, onRestart }) => {
    if (!winner) {
        return null;
    }

    const winnerColor = winner === 3 ? 'text-blue-500' : 'text-red-500';

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 animate-overlay-fade-in">
            <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-10 text-center flex flex-col items-center animate-modal-scale-up transform">
                <h2 className="text-2xl sm:text-4xl font-bold text-gray-800 mb-2">
                    Trận đấu kết thúc!
                </h2>
                <p className={`text-3xl sm:text-5xl font-extrabold mb-6 ${winnerColor}`}>
                    Người chơi {winner} thắng!
                </p>
                <button
                    onClick={onRestart}
                    className="px-8 py-3 text-lg sm:text-xl border-none rounded-full text-white font-semibold cursor-pointer transition-all duration-300 bg-blue-500 hover:bg-blue-600 active:scale-95 transform shadow-lg hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-blue-300"
                >
                    Chơi lại
                </button>
            </div>
        </div>
    );
};

export default GameOverOverlay;