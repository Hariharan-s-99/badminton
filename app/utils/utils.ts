import { Match, Team } from './types';

export const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export const generateTeams = (players: string[]): Team[] => {
  const shuffledPlayers = shuffleArray(players);
  const teams: Team[] = [];
  for (let i = 0; i < shuffledPlayers.length; i += 2) {
    if (i + 1 < shuffledPlayers.length) {
      teams.push({
        id: `team-${i / 2 + 1}`,
        name: `Team ${i / 2 + 1}`,
        player1: shuffledPlayers[i],
        player2: shuffledPlayers[i + 1],
        wins: 0,
        losses: 0,
        points: 0,
      });
    }
  }
  return teams;
};

export const generateRoundRobinMatches = (teams: Team[]): Match[] => {
  const matches: Match[] = [];
  let matchNumber = 1;
  for (let i = 0; i < teams.length; i++) {
    for (let j = i + 1; j < teams.length; j++) {
      matches.push({
        id: `match-${matchNumber}`,
        matchNumber,
        team1: teams[i],
        team2: teams[j],
        round: Math.ceil(matchNumber / Math.floor(teams.length / 2)),
        completed: false,
      });
      matchNumber++;
    }
  }
  return matches;
};

export const generateTimeSlots = (numMatches: number, matchesPerRound: number): string[] => {
  const slots: string[] = [];
  const startHour = 9;
  const matchDuration = 30;
  const breakBetweenRounds = 15;
  let currentTime = startHour * 60;

  for (let i = 0; i < numMatches; i++) {
    if (i > 0 && i % matchesPerRound === 0) {
      currentTime += breakBetweenRounds;
    }
    const hours = Math.floor(currentTime / 60);
    const minutes = currentTime % 60;
    const timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    slots.push(timeString);
    currentTime += matchDuration;
  }
  return slots;
};