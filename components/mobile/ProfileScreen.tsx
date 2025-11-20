
import React, { useState, useEffect } from 'react';
import { getElo, getGameHistory } from '../../utils/storage';
import { GameHistoryEntry } from '../../types';

const ProfileScreen: React.FC = () => {
    const [elo, setElo] = useState<number>(1000);
    const [history, setHistory] = useState<GameHistoryEntry[]>([]);

    useEffect(() => {
        setElo(getElo());
        setHistory(getGameHistory());
    }, []);

    const eloColor = elo >= 1200 ? 'text-green-400' : elo >= 1000 ? 'text-blue-400' : 'text-red-400';

    return (
        <div className="p-4 text-white">
            <h1 className="text-3xl font-bold mb-6 text-center">Hồ sơ của bạn</h1>

            {/* ELO Section */}
            <div className="bg-slate-800/50 p-6 rounded-2xl mb-8 text-center border border-blue-500/30">
                <h2 className="text-lg font-semibold text-slate-300 mb-2">Điểm ELO (vs Máy)</h2>
                <p className={`text-5xl font-bold ${eloColor}`}>{elo}</p>
            </div>

            {/* Game History Section */}
            <div className="mb-8">
                <h2 className="text-xl font-bold mb-4">Lịch sử đấu hạng</h2>
                <div className="bg-slate-800/50 p-4 rounded-2xl max-h-60 overflow-y-auto border border-slate-700/50">
                    {history.length > 0 ? (
                        <ul className="space-y-3">
                            {history.map(game => (
                                <li key={game.id} className="flex justify-between items-center bg-slate-700/50 p-3 rounded-lg">
                                    <div>
                                        <p className={`font-bold ${game.result === 'win' ? 'text-green-400' : 'text-red-400'}`}>
                                            {game.result === 'win' ? 'Thắng' : 'Thua'} vs {game.opponent}
                                        </p>
                                        <p className="text-xs text-slate-400">{game.date}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className={`font-semibold ${game.eloChange > 0 ? 'text-green-500' : 'text-red-500'}`}>
                                            {game.eloChange > 0 ? `+${game.eloChange}` : game.eloChange}
                                        </p>
                                        <p className="text-sm text-slate-300">{game.finalElo} ELO</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-center text-slate-400 py-4">Chưa có trận đấu nào.</p>
                    )}
                </div>
            </div>
            
            {/* Coming Soon Section */}
            <div>
                <h2 className="text-xl font-bold mb-4">Tính năng xã hội</h2>
                 <div className="bg-slate-800/50 p-6 rounded-2xl text-center border border-slate-700/50 opacity-60">
                    <p className="text-lg font-semibold text-slate-300">Bạn bè & Bảng xếp hạng</p>
                    <p className="text-slate-400">Sắp ra mắt!</p>
                </div>
            </div>
        </div>
    );
};

export default ProfileScreen;
