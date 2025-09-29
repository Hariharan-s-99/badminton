export interface Team {
    id: string;
    name: string;
    player1: string;
    player2: string;
    wins: number;
    losses: number;
    points: number;
  }
  
  export interface Match {
    id: string;
    matchNumber: number;
    team1: Team;
    team2: Team;
    round: number;
    court?: number;
    timeSlot?: string;
    completed: boolean;
    winner?: Team;
    score?: string;
  }
  
  export interface Tournament {
    name: string;
    date: string;
    players: string[];
    teams: Team[];
    matches: Match[];
    currentRound: number;
    totalRounds: number;
    format: 'round-robin';
  }