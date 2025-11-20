
import { GameHistoryEntry } from '../types';

const ELO_KEY = 'co36_elo';
const HISTORY_KEY = 'co36_history';

// --- ELO Management ---

export const getElo = (): number => {
    try {
        const storedElo = localStorage.getItem(ELO_KEY);
        if (storedElo) {
            const elo = parseInt(storedElo, 10);
            return isNaN(elo) ? 1000 : elo;
        }
    } catch (error) {
        console.error("Failed to read ELO from localStorage", error);
    }
    return 1000; // Default ELO
};

export const saveElo = (newElo: number): void => {
    try {
        localStorage.setItem(ELO_KEY, newElo.toString());
    } catch (error) {
        console.error("Failed to save ELO to localStorage", error);
    }
};

// --- Game History Management ---

export const getGameHistory = (): GameHistoryEntry[] => {
    try {
        const storedHistory = localStorage.getItem(HISTORY_KEY);
        if (storedHistory) {
            const history = JSON.parse(storedHistory);
            // Basic validation to ensure it's an array
            return Array.isArray(history) ? history : [];
        }
    } catch (error) {
        console.error("Failed to read history from localStorage", error);
    }
    return [];
};

export const addGameToHistory = (gameEntry: GameHistoryEntry): void => {
    try {
        const history = getGameHistory();
        // Add the new game to the beginning of the list and limit to 50 entries
        const updatedHistory = [gameEntry, ...history].slice(0, 50);
        localStorage.setItem(HISTORY_KEY, JSON.stringify(updatedHistory));
    } catch (error) {
        console.error("Failed to save game to history in localStorage", error);
    }
};
