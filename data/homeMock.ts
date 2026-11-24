import { TeamKey } from './teams';

export const PERFORMANCE = {
  rank: 2,
  outOf: 52,
  winRate: 82,
  topPercent: 10,
  matches: 145,
  streak: 7,
};

export type Side = { team: TeamKey; players: [string, string] };

export type Match = {
  id: string;
  title: string;
  court: string;
  rules: string;
  left: Side;
  right: Side;
  score?: [number, number];
  result?: string;
};

export const LIVE_MATCHES: Match[] = [
  {
    id: '05',
    title: 'MATCH 05',
    court: 'Court 1',
    rules: '21 Points - 1 Set',
    left: { team: 'WARRIORS', players: ['Hari', 'Naveen'] },
    right: { team: 'TITANS', players: ['Babu', 'Shivoo'] },
    score: [0, 0],
  },
  {
    id: '06',
    title: 'MATCH 06',
    court: 'Court 1',
    rules: '21 Points - 1 Set',
    left: { team: 'SPARTAN', players: ['Subbu', 'Hemanth'] },
    right: { team: 'FALCONS', players: ['Gokul', 'Ashwin'] },
    score: [0, 0],
  },
];

export const COMPLETED_MATCHES: Match[] = [
  {
    id: '01',
    title: 'MATCH 01',
    court: 'Court 1',
    rules: '21 Points - 1 Set',
    left: LIVE_MATCHES[0].left,
    right: LIVE_MATCHES[0].right,
    score: [21, 15],
    result: 'WARRIORS WIN',
  },
  {
    id: '02',
    title: 'MATCH 02',
    court: 'Court 2',
    rules: '21 Points - 1 Set',
    left: LIVE_MATCHES[1].left,
    right: LIVE_MATCHES[1].right,
    score: [9, 21],
    result: 'FALCONS WIN',
  },
];

export const UPCOMING_MATCHES: Match[] = [
  {
    id: '06',
    title: 'Match 06',
    court: 'Court 01',
    rules: '',
    left: { team: 'WARRIORS', players: ['Hari', 'Naveen'] },
    right: { team: 'TITANS', players: ['Nidhin', 'Hemanth'] },
  },
  {
    id: '07',
    title: 'Match 07',
    court: 'Court 02',
    rules: '',
    left: { team: 'SPARTAN', players: ['Subbu', 'Rajesh'] },
    right: { team: 'FALCONS', players: ['Babu', 'Hemanth'] },
  },
  {
    id: '08',
    title: 'Match 08',
    court: 'Court 03',
    rules: '',
    left: { team: 'WARRIORS', players: ['Arun', 'Ashwin'] },
    right: { team: 'TITANS', players: ['Loka', 'Hemanth'] },
  },
];

export const POINT_TABLE = [
  { pos: '01', team: 'WARRIORS' as TeamKey, players: ['Hari', 'Naveen'], played: 6, won: 5, lost: 1, points: 10, diff: 48 },
  { pos: '02', team: 'SPARTAN' as TeamKey, players: ['Babu', 'Shivoo'], played: 6, won: 4, lost: 2, points: 8, diff: 22 },
  { pos: '03', team: 'FALCONS' as TeamKey, players: ['Nidhin', 'Hemanth'], played: 6, won: 4, lost: 2, points: 8, diff: 18 },
];

export const TOP_PLAYERS = [
  { rank: 1, name: 'Hari', winRate: 82, matches: 145 },
  { rank: 2, name: 'Babu', winRate: 79, matches: 138 },
  { rank: 3, name: 'Naveen', winRate: 74, matches: 126 },
  { rank: 4, name: 'Shivoo', winRate: 69, matches: 112 },
  { rank: 5, name: 'Subbu', winRate: 65, matches: 98 },
];
