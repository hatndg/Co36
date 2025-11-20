
const K_FACTOR = 32;

/**
 * Calculates the expected score for player A against player B.
 * @param ratingA - Player A's ELO rating.
 * @param ratingB - Player B's ELO rating.
 * @returns The expected score (probability of winning).
 */
const getExpectedScore = (ratingA: number, ratingB: number): number => {
    return 1 / (1 + Math.pow(10, (ratingB - ratingA) / 400));
};

/**
 * Calculates the ELO change for a player after a match.
 * @param playerElo - The player's current ELO.
 * @param opponentElo - The opponent's ELO.
 * @param score - The result of the match (1 for a win, 0 for a loss).
 * @returns The amount of ELO points to add or subtract.
 */
export const calculateEloChange = (playerElo: number, opponentElo: number, score: 1 | 0): number => {
    const expectedScore = getExpectedScore(playerElo, opponentElo);
    const eloChange = K_FACTOR * (score - expectedScore);
    return Math.round(eloChange);
};
