export type TeamKey =
  | 'BLACK PIRATES'
  | 'CITY BULLS'
  | 'FALCONS'
  | 'LEGACY KINGS'
  | 'NET KINGS'
  | 'NET NINJAS'
  | 'PHOENIX'
  | 'RED DRAGON'
  | 'SPARTAN'
  | 'STORM BREAKERS'
  | 'SUPER KINGS'
  | 'TITANS'
  | 'WARRIORS';

export const TEAM_LOGOS: Record<TeamKey, { source: number; ratio: number }> = {
  'BLACK PIRATES': { source: require('../assets/team-logos/black-pirates.png'), ratio: 408 / 414 },
  'CITY BULLS': { source: require('../assets/team-logos/city-bulls.png'), ratio: 437 / 434 },
  FALCONS: { source: require('../assets/team-logos/falcons.png'), ratio: 440 / 427 },
  'LEGACY KINGS': { source: require('../assets/team-logos/legacy-kings.png'), ratio: 420 / 446 },
  'NET KINGS': { source: require('../assets/team-logos/net-kings.png'), ratio: 436 / 433 },
  'NET NINJAS': { source: require('../assets/team-logos/net-ninjas.png'), ratio: 637 / 624 },
  PHOENIX: { source: require('../assets/team-logos/phoenix.png'), ratio: 482 / 523 },
  'RED DRAGON': { source: require('../assets/team-logos/red-dragon.png'), ratio: 444 / 427 },
  SPARTAN: { source: require('../assets/team-logos/spartan.png'), ratio: 609 / 614 },
  'STORM BREAKERS': { source: require('../assets/team-logos/storm-breakers.png'), ratio: 465 / 516 },
  'SUPER KINGS': { source: require('../assets/team-logos/super-kings.png'), ratio: 441 / 431 },
  TITANS: { source: require('../assets/team-logos/titans.png'), ratio: 436 / 426 },
  WARRIORS: { source: require('../assets/team-logos/warriors.png'), ratio: 442 / 516 },
};
