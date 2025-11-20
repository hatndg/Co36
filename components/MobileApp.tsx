
import React, { useState } from 'react';
import Logo from './Logo';
import MobileGameScreen from './mobile/MobileGameScreen';
import ProfileScreen from './mobile/ProfileScreen';
import InstructionsScreen from './mobile/InstructionsScreen';
import HomeScreen from './mobile/HomeScreen';
import { playSound } from '../utils/sounds';

type Screen = 'home' | 'game' | 'profile' | 'instructions';

const MobileApp: React.FC = () => {
    const [activeScreen, setActiveScreen] = useState<Screen>('home');

    const changeScreen = (screen: Screen) => {
        playSound('click');
        setActiveScreen(screen);
    };

    const renderScreen = () => {
        switch (activeScreen) {
            case 'game':
                return <MobileGameScreen onExit={() => setActiveScreen('home')} />;
            case 'profile':
                return <ProfileScreen />;
            case 'instructions':
                return <InstructionsScreen />;
            case 'home':
            default:
                return <HomeScreen onPlay={() => setActiveScreen('game')} />;
        }
    };
    
    const NavItem: React.FC<{ screen: Screen, label: string, icon: React.ReactElement }> = ({ screen, label, icon }) => {
        const isActive = activeScreen === screen;
        return (
             <button 
                onClick={() => changeScreen(screen)} 
                className={`flex flex-col items-center transition-colors ${isActive ? 'text-blue-400' : 'text-slate-400 hover:text-white'}`}
             >
                {icon}
                <span className="text-xs font-medium">{label}</span>
            </button>
        );
    };

    return (
        <div className="flex flex-col h-screen bg-slate-900 text-white font-sans">
            {/* Header - Hide during game for more space */}
            {activeScreen !== 'game' && (
                <header className="p-4 flex justify-between items-center shrink-0">
                    <Logo />
                    <button className="p-2 rounded-full hover:bg-slate-700 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                    </button>
                </header>
            )}

            {/* Main Content */}
            <main className="flex-grow overflow-y-auto">
                {renderScreen()}
            </main>

            {/* Footer Navigation - Hide during game for more space */}
            {activeScreen !== 'game' && (
                <footer className="p-4 bg-slate-800/50 shrink-0">
                    <div className="flex justify-around items-center max-w-md mx-auto">
                        <NavItem 
                            screen="home" 
                            label="Trang chủ" 
                            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 mb-1" viewBox="0 0 20 20" fill="currentColor"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" /></svg>}
                        />
                        <NavItem 
                            screen="profile" 
                            label="Hồ sơ" 
                            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 mb-1" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg>}
                        />
                        <NavItem 
                            screen="instructions" 
                            label="Hướng dẫn" 
                            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 mb-1" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zM9 12a1 1 0 112 0 1 1 0 01-2 0zm1-8a1 1 0 00-1 1v4a1 1 0 102 0V5a1 1 0 00-1-1z" clipRule="evenodd" /></svg>}
                        />
                    </div>
                </footer>
            )}
        </div>
    );
};

export default MobileApp;