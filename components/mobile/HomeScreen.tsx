
import React, { useState, useEffect } from 'react';
import { getGameHistory } from '../../utils/storage';
import { GameHistoryEntry } from '../../types';
import { playSound } from '../../utils/sounds';

const HomeScreen: React.FC<{ onPlay: () => void }> = ({ onPlay }) => {
    const [history, setHistory] = useState<GameHistoryEntry[]>([]);

    useEffect(() => {
        setHistory(getGameHistory());
    }, []);

    const handlePlayClick = () => {
        playSound('click');
        onPlay();
    };

    const getOpponentText = (game: GameHistoryEntry) => {
        if (game.gameMode === 'vs-ai-ranked') {
            return 'vs Máy (Hạng)';
        }
        return 'vs Bạn bè';
    };

    const getResultText = (game: GameHistoryEntry) => {
        if (game.gameMode === 'vs-ai-ranked') {
            return game.result === 'win' ? 'Thắng' : 'Thua';
        }
        return `Phe ${game.winner} thắng`;
    };

    const getResultColor = (game: GameHistoryEntry) => {
        if (game.gameMode === 'vs-ai-ranked') {
            return game.result === 'win' ? 'text-green-400' : 'text-red-400';
        }
        return game.winner === 3 ? 'text-blue-400' : 'text-red-400';
    };

    return (
        <main className="flex-grow flex flex-col items-center justify-between text-center p-4">
            <div className="w-full animate-fade-in-up">
                <h1 className="text-4xl font-bold mb-2">Chào mừng trở lại!</h1>
                <p className="text-lg text-slate-400 mb-10">Sẵn sàng cho một trận đấu trí tuệ?</p>
                <button
                    onClick={handlePlayClick}
                    className="w-full max-w-sm px-8 py-4 text-xl border-none rounded-full text-white font-bold cursor-pointer transition-all duration-300 bg-blue-600 hover:bg-blue-700 active:scale-95 transform shadow-lg hover:shadow-blue-500/50 focus:outline-none focus:ring-4 focus:ring-blue-400"
                >
                    Tìm trận đấu
                </button>
            </div>

            <div className="w-full max-w-sm mt-10">
                <h2 className="text-xl font-bold mb-4 text-left">Lịch sử gần đây</h2>
                <div className="bg-slate-800/50 p-3 rounded-2xl max-h-60 overflow-y-auto border border-slate-700/50">
                    {history.length > 0 ? (
                        <ul className="space-y-2">
                            {history.map(game => (
                                <li key={game.id} className="flex justify-between items-center bg-slate-700/50 p-3 rounded-lg">
                                    <div>
                                        <p className={`font-bold ${getResultColor(game)}`}>
                                            {getResultText(game)}
                                        </p>
                                        <p className="text-xs text-slate-400">{getOpponentText(game)} - {game.date}</p>
                                    </div>
                                    {game.eloChange !== undefined && (
                                         <div className="text-right">
                                            <p className={`font-semibold ${game.eloChange > 0 ? 'text-green-500' : 'text-red-500'}`}>
                                                {game.eloChange > 0 ? `+${game.eloChange}` : game.eloChange}
                                            </p>
                                            <p className="text-sm text-slate-300">{game.finalElo} ELO</p>
                                        </div>
                                    )}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-center text-slate-400 py-4">Chưa có trận đấu nào.</p>
                    )}
                </div>
            </div>
        </main>
    );
};

export default HomeScreen;