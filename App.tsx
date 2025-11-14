import React, { useState, useCallback } from 'react';
import Home from './components/Home';
import Game from './components/Game';

type Page = 'home' | 'game';

const App: React.FC = () => {
    const [currentPage, setCurrentPage] = useState<Page>('home');

    const handleStartGame = useCallback(() => {
        setCurrentPage('game');
    }, []);
    
    const handleGoHome = useCallback(() => {
        setCurrentPage('home');
    }, []);

    return (
        <div className="flex flex-col justify-center items-center min-h-screen font-sans p-2 sm:p-4 w-full">
            {currentPage === 'home' && <Home onStartGame={handleStartGame} />}
            {currentPage === 'game' && <Game onGoHome={handleGoHome} />}
        </div>
    );
};

export default App;