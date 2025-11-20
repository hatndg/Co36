
import React, { useState, useEffect } from 'react';
import { Player } from '../types';

interface GameOverOverlayProps {
    winner: Player | null;
    onConfirm: () => void;
    confirmText: string;
    eloInfo?: {
        initialElo: number;
        eloChange: number;
    };
}

const GameOverOverlay: React.FC<GameOverOverlayProps> = ({ winner, onConfirm, confirmText, eloInfo }) => {
    const [displayElo, setDisplayElo] = useState<number | undefined>(eloInfo?.initialElo);

    useEffect(() => {
        if (!eloInfo) return;

        let animationFrameId: number;
        const { initialElo, eloChange } = eloInfo;
        const targetElo = initialElo + eloChange;
        const duration = 1500; // Animation duration in ms
        const startTime = performance.now();

        const animate = (currentTime: number) => {
            const elapsedTime = currentTime - startTime;
            if (elapsedTime >= duration) {
                setDisplayElo(targetElo);
                return;
            }
            
            const progress = elapsedTime / duration;
            const easedProgress = 1 - Math.pow(1 - progress, 3); // easeOutCubic
            const currentElo = initialElo + easedProgress * eloChange;
            
            setDisplayElo(Math.round(currentElo));
            animationFrameId = requestAnimationFrame(animate);
        };

        animationFrameId = requestAnimationFrame(animate);

        return () => cancelAnimationFrame(animationFrameId);
    }, [eloInfo]);

    if (!winner) {
        return null;
    }

    const winnerColor = winner === 3 ? 'text-blue-500' : 'text-red-500';
    const eloChangeColor = eloInfo && eloInfo.eloChange >= 0 ? 'text-green-500' : 'text-red-500';

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 animate-overlay-fade-in">
            <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-10 text-center flex flex-col items-center animate-modal-scale-up transform min-w-[300px]">
                <h2 className="text-2xl sm:text-4xl font-bold text-gray-800 mb-2">
                    Trận đấu kết thúc!
                </h2>
                <p className={`text-3xl sm:text-5xl font-extrabold mb-4 ${winnerColor}`}>
                    Người chơi {winner} thắng!
                </p>

                {eloInfo && (
                    <div className="my-4 p-4 bg-gray-100 rounded-lg">
                        <h3 className="text-lg font-semibold text-gray-600">Thay đổi ELO</h3>
                        <div className="flex items-center justify-center gap-4">
                            <span className="text-2xl font-bold text-gray-700">{eloInfo.initialElo}</span>
                            <span className={`text-2xl font-bold ${eloChangeColor}`}>
                                {eloInfo.eloChange >= 0 ? `+${eloInfo.eloChange}` : eloInfo.eloChange}
                            </span>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                            <span className="text-3xl font-bold text-blue-600">{displayElo}</span>
                        </div>
                    </div>
                )}

                <button
                    onClick={onConfirm}
                    className="mt-4 px-8 py-3 text-lg sm:text-xl border-none rounded-full text-white font-semibold cursor-pointer transition-all duration-300 bg-blue-500 hover:bg-blue-600 active:scale-95 transform shadow-lg hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-blue-300"
                >
                    {confirmText}
                </button>
            </div>
        </div>
    );
};

export default GameOverOverlay;