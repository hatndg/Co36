
export type Player = 3 | 6;
export type Obstacle = { type: 'obstacle'; color: string };
export type CellState = Player | Obstacle | null;

export type GameMode = 'vs-player' | 'vs-ai-ranked' | null;

export interface GameHistoryEntry {
    id: string;
    date: string;
    gameMode: GameMode;
    winner: Player;
    
    // Fields for ranked games
    result?: 'win' | 'loss';
    opponent?: 'AI (Ranked)';
    eloChange?: number;
    finalElo?: number;
}