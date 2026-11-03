export type GameState = 'title' | 'playing' | 'paused' | 'day_complete' | 'game_over' | 'victory';

export type GameMode = 'story' | 'endless' | 'treat_day_sandbox';

export type DayName = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';

export interface DayConfig {
  name: DayName;
  duration: number; // in seconds
  allowedDietItem: 'cornflake' | 'water' | 'ice_cube';
  dietLabel: string;
  subtitle: string;
  description: string;
  spawnInterval: number; // ms
  enemyPool: TreatFoodType[];
  boss?: TreatFoodType;
}

export type TreatFoodType =
  | 'pork_sandwich'
  | 'potato_grid'
  | 'bonbonbonbon'
  | 'fluffy_ruff'
  | 'chocolate_quiche'
  | 'fried_eggs'
  | 'large_mac'
  | 'mystery_meat'
  | 'hoisin_crispy_owl'
  | 'birthday_pie';

export type DietPickupType = 'cornflake' | 'water' | 'ice_cube';

export interface FoodEnemy {
  id: number;
  type: TreatFoodType;
  name: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  hp: number;
  maxHp: number;
  speed: number;
  points: number;
  damage: number;
  rotation: number;
  rotSpeed: number;
  color: string;
  accentColor: string;
  isFrozen: number; // remaining freeze duration in seconds
  isBoss?: boolean;
  behaviorTimer?: number;
  phase?: number;
}

export interface DietPickup {
  id: number;
  type: DietPickupType;
  name: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  life: number; // seconds remaining
  maxLife: number;
  pulse: number;
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  alpha: number;
  life: number;
  maxLife: number;
  shape?: 'circle' | 'square' | 'crumb' | 'sparkle' | 'droplet';
}

export interface FloatingText {
  id: number;
  text: string;
  x: number;
  y: number;
  color: string;
  fontSize: number;
  alpha: number;
  life: number;
  maxLife: number;
  scale: number;
}

export interface Shockwave {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  color: string;
  alpha: number;
  damage: number;
  life: number;
  maxLife: number;
}

export interface PlayerState {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  angle: number;
  willpower: number; // 0 - 100
  maxWillpower: number;
  speed: number;
  isSwatting: boolean;
  swatProgress: number; // 0 to 1
  swatCooldown: number;
  megaphoneCharge: number; // 0 to 100%
  shieldTime: number; // seconds
  iceAuraTime: number; // seconds
  speedBoostTime: number; // seconds
  invulnerableTime: number;
  isTreatDayFrenzy: boolean;
  frenzyTime: number;
  expression: 'neutral' | 'attack' | 'hit' | 'eating' | 'shouting' | 'treat_frenzy';
  expressionTimer: number;
}

export interface GameStats {
  score: number;
  highScore: number;
  treatsDefeated: number;
  treatsGobbled: number;
  cornflakesEaten: number;
  waterDrank: number;
  iceCubesCrunched: number;
  megaphonesUsed: number;
  currentCombo: number;
  maxCombo: number;
  damageTaken: number;
  dayIndex: number; // 0 to 6
  dayElapsed: number; // seconds into current day
}
