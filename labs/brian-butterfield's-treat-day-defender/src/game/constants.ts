import { DayConfig, TreatFoodType } from '../types';

export const DAYS_CONFIG: DayConfig[] = [
  {
    name: 'Monday',
    duration: 25,
    allowedDietItem: 'cornflake',
    dietLabel: 'One Cornflake',
    subtitle: 'The Butterfield Diet begins. Just one solitary cornflake.',
    description: 'Defend your willpower! Swat away early temptations with your Diet Binder.',
    spawnInterval: 1400,
    enemyPool: ['pork_sandwich', 'potato_grid'],
  },
  {
    name: 'Tuesday',
    duration: 28,
    allowedDietItem: 'water',
    dietLabel: 'Pint of Room Temperature Water',
    subtitle: 'Hydration day: strictly 20°C tap water.',
    description: 'Bonbonbonbons bounce in clusters! Drink water to summon a refreshing splash aura.',
    spawnInterval: 1200,
    enemyPool: ['pork_sandwich', 'potato_grid', 'bonbonbonbon'],
  },
  {
    name: 'Wednesday',
    duration: 30,
    allowedDietItem: 'ice_cube',
    dietLabel: 'An Ice Cube',
    subtitle: 'Midweek refreshment. One crunchy frozen cube.',
    description: 'Fluffy ruffs and chocolate quiches roll in. Eat an ice cube to freeze all foods in their tracks!',
    spawnInterval: 1050,
    enemyPool: ['pork_sandwich', 'potato_grid', 'bonbonbonbon', 'fluffy_ruff', 'chocolate_quiche'],
  },
  {
    name: 'Thursday',
    duration: 32,
    allowedDietItem: 'cornflake',
    dietLabel: 'One Cornflake',
    subtitle: 'Your resolve is tested. 20 fried eggs sizzle towards you.',
    description: 'Heavy breakfast invasion! Collect cornflakes for sudden bursts of movement speed.',
    spawnInterval: 950,
    enemyPool: ['pork_sandwich', 'potato_grid', 'bonbonbonbon', 'fluffy_ruff', 'chocolate_quiche', 'fried_eggs', 'mystery_meat'],
  },
  {
    name: 'Friday',
    duration: 35,
    allowedDietItem: 'water',
    dietLabel: 'Pint of Room Temperature Water',
    subtitle: 'Weekend eve frenzy. The Large Mac and Crispy Owl descend.',
    description: 'Use your megaphone shockwave [E or Right Click] to knock back dense junk food waves!',
    spawnInterval: 850,
    enemyPool: ['pork_sandwich', 'potato_grid', 'bonbonbonbon', 'fluffy_ruff', 'chocolate_quiche', 'fried_eggs', 'large_mac', 'mystery_meat', 'hoisin_crispy_owl'],
  },
  {
    name: 'Saturday',
    duration: 40,
    allowedDietItem: 'ice_cube',
    dietLabel: 'An Ice Cube',
    subtitle: 'THE FINAL TEST BEFORE TREAT DAY. Birthday Pie Boss arrives!',
    description: 'Survive until midnight! If you last until 11:59 PM, Sunday Treat Day will begin!',
    spawnInterval: 750,
    enemyPool: ['pork_sandwich', 'potato_grid', 'bonbonbonbon', 'fluffy_ruff', 'chocolate_quiche', 'fried_eggs', 'large_mac', 'mystery_meat', 'hoisin_crispy_owl'],
    boss: 'birthday_pie',
  },
  {
    name: 'Sunday',
    duration: 30,
    allowedDietItem: 'cornflake',
    dietLabel: 'TREAT DAY FRENZY!',
    subtitle: 'IT IS TREAT DAY! EAT EVERYTHING YOU LIKE!',
    description: 'All food is now delicious bonus points! Brian is invulnerable and starving! GOBBLE THEM ALL!',
    spawnInterval: 400,
    enemyPool: ['pork_sandwich', 'potato_grid', 'bonbonbonbon', 'fluffy_ruff', 'chocolate_quiche', 'fried_eggs', 'large_mac', 'mystery_meat', 'hoisin_crispy_owl', 'birthday_pie'],
  },
];

export interface FoodMeta {
  name: string;
  radius: number;
  hp: number;
  speed: number;
  points: number;
  damage: number;
  color: string;
  accentColor: string;
  quote: string;
}

export const FOOD_DATABASE: Record<TreatFoodType, FoodMeta> = {
  pork_sandwich: {
    name: 'Pork Sandwich',
    radius: 24,
    hp: 2,
    speed: 75,
    points: 150,
    damage: 15,
    color: '#f87171',
    accentColor: '#fef08a',
    quote: 'Pork sandwich!',
  },
  potato_grid: {
    name: 'Potato Grid',
    radius: 20,
    hp: 1,
    speed: 130,
    points: 200,
    damage: 10,
    color: '#eab308',
    accentColor: '#78350f',
    quote: 'Potato grids!',
  },
  bonbonbonbon: {
    name: 'Bonbonbonbon',
    radius: 16,
    hp: 1,
    speed: 150,
    points: 120,
    damage: 8,
    color: '#ec4899',
    accentColor: '#831843',
    quote: 'Bonbonbonbons!',
  },
  fluffy_ruff: {
    name: 'Fluffy Ruff',
    radius: 22,
    hp: 2,
    speed: 90,
    points: 250,
    damage: 12,
    color: '#f472b6',
    accentColor: '#ffffff',
    quote: 'Fluffy ruffs!',
  },
  chocolate_quiche: {
    name: 'Chocolate Quiche',
    radius: 26,
    hp: 3,
    speed: 65,
    points: 300,
    damage: 18,
    color: '#78350f',
    accentColor: '#451a03',
    quote: 'Chocolate quiche!',
  },
  fried_eggs: {
    name: '20 Fried Eggs',
    radius: 28,
    hp: 4,
    speed: 80,
    points: 400,
    damage: 20,
    color: '#fef08a',
    accentColor: '#f97316',
    quote: 'Twenty fried eggs!',
  },
  large_mac: {
    name: 'Large Mac',
    radius: 34,
    hp: 6,
    speed: 55,
    points: 500,
    damage: 25,
    color: '#b45309',
    accentColor: '#22c55e',
    quote: 'Large Mac!',
  },
  mystery_meat: {
    name: 'Mystery Meat',
    radius: 22,
    hp: 3,
    speed: 140,
    points: 350,
    damage: 16,
    color: '#a855f7',
    accentColor: '#3b0764',
    quote: 'Mystery meat!',
  },
  hoisin_crispy_owl: {
    name: 'Hoisin Crispy Owl',
    radius: 26,
    hp: 3,
    speed: 125,
    points: 450,
    damage: 20,
    color: '#991b1b',
    accentColor: '#fde047',
    quote: 'Hoisin crispy owl!',
  },
  birthday_pie: {
    name: 'Birthday Pie (BOSS)',
    radius: 46,
    hp: 22,
    speed: 45,
    points: 2500,
    damage: 30,
    color: '#db2777',
    accentColor: '#38bdf8',
    quote: 'Birthday pie!',
  },
};

export const BUTTERFIELD_QUOTES = [
  'CALL NOW!',
  'No! Not until Sunday!',
  'One cornflake!',
  'Pint of room temperature water!',
  'An ice cube!',
  'TREAT DAY!',
  'Be gone, delicious horror!',
  'The Butterfield Diet Plan!',
  'Stay back, pork sandwich!',
  'Bonbonbonbons!',
  'I can resist!',
  'Potato grids, unhand me!',
];

/**
 * Resolves an asset path to be strictly relative to the current deployed subdirectory.
 * Works whether deployed at root `/` or in any subfolder like `/labs/brain_butterfields_treat_day_defender/`.
 */
export function getAssetUrl(relativePath: string): string {
  const clean = relativePath.startsWith('/') ? relativePath.slice(1) : relativePath;
  const base = import.meta.env.BASE_URL || './';
  const prefix = base.endsWith('/') ? base : `${base}/`;
  return `${prefix}${clean}`;
}

export const BRIAN_IMAGE_URL = getAssetUrl('assets/aistudio/image_b53d7ec1.png');

