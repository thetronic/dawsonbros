import {
  DayConfig,
  DietPickup,
  FloatingText,
  FoodEnemy,
  GameMode,
  GameState,
  GameStats,
  Particle,
  PlayerState,
  Shockwave,
  TreatFoodType,
} from '../types';
import { DAYS_CONFIG, FOOD_DATABASE, BUTTERFIELD_QUOTES } from './constants';
import { sound } from '../audio/soundEngine';

export class GameEngine {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private state: GameState = 'title';
  private mode: GameMode = 'story';
  private width: number = 1000;
  private height: number = 700;

  // Brian Face image reference
  private brianImg: HTMLImageElement | null = null;
  private brianImgLoaded: boolean = false;

  // Game Loop
  private lastTime: number = 0;
  private animFrameId: number | null = null;
  private isRunning: boolean = false;

  // Game entities
  private player: PlayerState;
  private enemies: FoodEnemy[] = [];
  private dietPickups: DietPickup[] = [];
  private particles: Particle[] = [];
  private floatingTexts: FloatingText[] = [];
  private shockwaves: Shockwave[] = [];

  // Spawner & timers
  private spawnTimer: number = 0;
  private dietSpawnTimer: number = 0;
  private entityIdCounter: number = 0;
  private hitstopTimer: number = 0;
  private screenShake: number = 0;

  // Day tracking
  private currentDayConfig: DayConfig;
  private stats: GameStats;

  // Input states
  private keys: Record<string, boolean> = {};
  private mousePos: { x: number; y: number } = { x: 500, y: 350 };
  private isMouseDown: boolean = false;

  // Callbacks to React UI
  private onStateChange: (state: GameState) => void;
  private onStatsChange: (stats: GameStats) => void;

  constructor(
    canvas: HTMLCanvasElement,
    onStateChange: (state: GameState) => void,
    onStatsChange: (stats: GameStats) => void
  ) {
    this.canvas = canvas;
    const context = canvas.getContext('2d');
    if (!context) throw new Error('Could not get 2D canvas context');
    this.ctx = context;

    this.onStateChange = onStateChange;
    this.onStatsChange = onStatsChange;

    this.currentDayConfig = DAYS_CONFIG[0];
    this.stats = {
      score: 0,
      highScore: parseInt(localStorage.getItem('butterfield_high_score') || '0', 10),
      treatsDefeated: 0,
      treatsGobbled: 0,
      cornflakesEaten: 0,
      waterDrank: 0,
      iceCubesCrunched: 0,
      megaphonesUsed: 0,
      currentCombo: 0,
      maxCombo: 0,
      damageTaken: 0,
      dayIndex: 0,
      dayElapsed: 0,
    };

    this.player = this.createInitialPlayer();

    this.loadBrianImage();
    this.setupEventListeners();
    this.resizeCanvas();
  }

  private loadBrianImage() {
    this.brianImg = new Image();
    this.brianImg.src = '/assets/aistudio/image_b53d7ec1.png';
    this.brianImg.onload = () => {
      this.brianImgLoaded = true;
    };
  }

  private createInitialPlayer(): PlayerState {
    return {
      x: this.width / 2,
      y: this.height / 2,
      vx: 0,
      vy: 0,
      radius: 32,
      angle: 0,
      willpower: 100,
      maxWillpower: 100,
      speed: 240,
      isSwatting: false,
      swatProgress: 0,
      swatCooldown: 0,
      megaphoneCharge: 100,
      shieldTime: 0,
      iceAuraTime: 0,
      speedBoostTime: 0,
      invulnerableTime: 0,
      isTreatDayFrenzy: false,
      frenzyTime: 0,
      expression: 'neutral',
      expressionTimer: 0,
    };
  }

  public resizeCanvas() {
    const parent = this.canvas.parentElement;
    if (parent) {
      const rect = parent.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      this.width = rect.width;
      this.height = rect.height;
      this.canvas.width = rect.width * dpr;
      this.canvas.height = rect.height * dpr;
      this.ctx.setTransform(1, 0, 0, 1, 0, 0);
      this.ctx.scale(dpr, dpr);
    }
  }

  private setupEventListeners() {
    window.addEventListener('keydown', (e) => {
      this.keys[e.key.toLowerCase()] = true;
      if (e.key === ' ' && this.state === 'playing') {
        e.preventDefault();
        this.triggerSwat();
      }
      if ((e.key.toLowerCase() === 'e' || e.key.toLowerCase() === 'q') && this.state === 'playing') {
        e.preventDefault();
        this.triggerMegaphone();
      }
      if (e.key === 'Escape') {
        this.togglePause();
      }
    });

    window.addEventListener('keyup', (e) => {
      this.keys[e.key.toLowerCase()] = false;
    });

    this.canvas.addEventListener('mousemove', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      this.mousePos = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    });

    this.canvas.addEventListener('mousedown', (e) => {
      if (this.state !== 'playing') return;
      if (e.button === 0) {
        this.isMouseDown = true;
        this.triggerSwat();
      } else if (e.button === 2) {
        e.preventDefault();
        this.triggerMegaphone();
      }
    });

    this.canvas.addEventListener('mouseup', () => {
      this.isMouseDown = false;
    });

    this.canvas.addEventListener('contextmenu', (e) => {
      e.preventDefault();
    });

    window.addEventListener('blur', () => {
      this.keys = {};
      this.isMouseDown = false;
    });

    window.addEventListener('resize', () => {
      this.resizeCanvas();
    });
  }

  // --- Public Controls ---

  public startGame(mode: GameMode = 'story') {
    this.mode = mode;
    this.state = 'playing';
    this.stats = {
      score: 0,
      highScore: parseInt(localStorage.getItem('butterfield_high_score') || '0', 10),
      treatsDefeated: 0,
      treatsGobbled: 0,
      cornflakesEaten: 0,
      waterDrank: 0,
      iceCubesCrunched: 0,
      megaphonesUsed: 0,
      currentCombo: 0,
      maxCombo: 0,
      damageTaken: 0,
      dayIndex: mode === 'treat_day_sandbox' ? 6 : 0,
      dayElapsed: 0,
    };

    this.currentDayConfig = DAYS_CONFIG[this.stats.dayIndex];
    this.player = this.createInitialPlayer();
    this.player.x = this.width / 2;
    this.player.y = this.height / 2;

    if (mode === 'treat_day_sandbox') {
      this.player.isTreatDayFrenzy = true;
      this.player.frenzyTime = 9999;
    }

    this.enemies = [];
    this.dietPickups = [];
    this.particles = [];
    this.floatingTexts = [];
    this.shockwaves = [];
    this.spawnTimer = 0;
    this.dietSpawnTimer = 0;

    this.onStateChange(this.state);
    this.onStatsChange(this.stats);

    sound.startBGM();
    if (mode === 'treat_day_sandbox') {
      sound.speak('TREAT DAY! GOBBLE EVERYTHING!', true);
    } else {
      sound.speak(`Monday! The Butterfield Diet Plan. One cornflake.`, true);
    }

    if (!this.isRunning) {
      this.isRunning = true;
      this.lastTime = performance.now();
      this.loop(this.lastTime);
    }
  }

  public nextDay() {
    if (this.stats.dayIndex < DAYS_CONFIG.length - 1) {
      this.stats.dayIndex++;
      this.currentDayConfig = DAYS_CONFIG[this.stats.dayIndex];
      this.stats.dayElapsed = 0;
      this.enemies = [];
      this.dietPickups = [];
      this.state = 'playing';
      this.onStateChange(this.state);
      this.onStatsChange(this.stats);

      // Restore some willpower each new day
      this.player.willpower = Math.min(100, this.player.willpower + 40);

      sound.playDayWin();
      if (this.currentDayConfig.name === 'Sunday') {
        this.player.isTreatDayFrenzy = true;
        this.player.frenzyTime = this.currentDayConfig.duration;
        sound.playTreatDayFanfare();
        sound.speak('IT IS SUNDAY! TREAT DAY! EAT EVERYTHING!', true);
      } else {
        sound.speak(`${this.currentDayConfig.name}. ${this.currentDayConfig.dietLabel}!`);
      }
    } else {
      this.victory();
    }
  }

  public togglePause() {
    if (this.state === 'playing') {
      this.state = 'paused';
      this.onStateChange(this.state);
    } else if (this.state === 'paused') {
      this.state = 'playing';
      this.lastTime = performance.now();
      this.onStateChange(this.state);
    }
  }

  public triggerSwat() {
    if (this.player.swatCooldown > 0) return;
    this.player.isSwatting = true;
    this.player.swatProgress = 0;
    this.player.swatCooldown = 0.28;
    this.player.expression = 'attack';
    this.player.expressionTimer = 0.35;

    sound.playSwat();

    // Swat arc collision check
    const swatRange = this.player.radius + 60;
    const swatAngleWidth = Math.PI * 0.7; // ~126 degree arc

    let hitAny = false;

    this.enemies.forEach((enemy) => {
      const dx = enemy.x - this.player.x;
      const dy = enemy.y - this.player.y;
      const dist = Math.hypot(dx, dy);

      if (dist <= swatRange + enemy.radius) {
        const enemyAngle = Math.atan2(dy, dx);
        let angleDiff = Math.abs(enemyAngle - this.player.angle);
        while (angleDiff > Math.PI) angleDiff = Math.abs(angleDiff - Math.PI * 2);

        if (angleDiff <= swatAngleWidth / 2 || dist < this.player.radius + 15) {
          hitAny = true;
          this.hitEnemy(enemy, 1, dx, dy);
        }
      }
    });

    if (!hitAny && Math.random() < 0.15) {
      const randomQuote = BUTTERFIELD_QUOTES[Math.floor(Math.random() * BUTTERFIELD_QUOTES.length)];
      this.spawnFloatingText(randomQuote, this.player.x, this.player.y - 45, '#38bdf8', 16);
    }
  }

  public triggerMegaphone() {
    if (this.player.megaphoneCharge < 100) return;
    this.player.megaphoneCharge = 0;
    this.player.expression = 'shouting';
    this.player.expressionTimer = 0.6;
    this.screenShake = 12;
    this.stats.megaphonesUsed++;

    sound.playMegaphone();
    sound.speak('CALL NOW!', true);

    this.spawnFloatingText('CALL NOW!', this.player.x, this.player.y - 50, '#facc15', 26);

    // Create 360 expanding shockwave
    this.shockwaves.push({
      x: this.player.x,
      y: this.player.y,
      radius: this.player.radius,
      maxRadius: 380,
      color: '#facc15',
      alpha: 1,
      damage: 4,
      life: 0.5,
      maxLife: 0.5,
    });

    // Knockback all enemies
    this.enemies.forEach((enemy) => {
      const dx = enemy.x - this.player.x;
      const dy = enemy.y - this.player.y;
      const dist = Math.max(Math.hypot(dx, dy), 1);
      const pushFactor = Math.max(300, 600 - dist);
      enemy.vx = (dx / dist) * pushFactor;
      enemy.vy = (dy / dist) * pushFactor;
      this.hitEnemy(enemy, 3, dx, dy, false);
    });
  }

  // Virtual Joystick input support for mobile
  public setVirtualJoystick(dx: number, dy: number) {
    this.player.vx = dx * this.player.speed;
    this.player.vy = dy * this.player.speed;
    if (dx !== 0 || dy !== 0) {
      this.player.angle = Math.atan2(dy, dx);
    }
  }

  // --- Core Game Loop ---

  private loop(timestamp: number) {
    if (!this.isRunning) return;

    const rawDt = (timestamp - this.lastTime) / 1000;
    this.lastTime = timestamp;
    const dt = Math.min(rawDt, 0.05);

    if (this.state === 'playing') {
      if (this.hitstopTimer > 0) {
        this.hitstopTimer -= dt;
      } else {
        this.update(dt);
      }
    }

    this.render();

    this.animFrameId = requestAnimationFrame((t) => this.loop(t));
  }

  private update(dt: number) {
    // 1. Update Player position & inputs
    let moveX = 0;
    let moveY = 0;

    if (this.keys['w'] || this.keys['arrowup']) moveY -= 1;
    if (this.keys['s'] || this.keys['arrowdown']) moveY += 1;
    if (this.keys['a'] || this.keys['arrowleft']) moveX -= 1;
    if (this.keys['d'] || this.keys['arrowright']) moveX += 1;

    let currentSpeed = this.player.speed;
    if (this.player.speedBoostTime > 0) currentSpeed *= 1.4;
    if (this.player.isTreatDayFrenzy) currentSpeed *= 1.35;

    if (moveX !== 0 || moveY !== 0) {
      const len = Math.hypot(moveX, moveY);
      this.player.vx = (moveX / len) * currentSpeed;
      this.player.vy = (moveY / len) * currentSpeed;
    } else {
      this.player.vx *= 0.8;
      this.player.vy *= 0.8;
    }

    this.player.x += this.player.vx * dt;
    this.player.y += this.player.vy * dt;

    // Boundaries
    const margin = this.player.radius;
    this.player.x = Math.max(margin, Math.min(this.width - margin, this.player.x));
    this.player.y = Math.max(margin + 50, Math.min(this.height - margin - 20, this.player.y));

    // Player aim angle
    const aimDx = this.mousePos.x - this.player.x;
    const aimDy = this.mousePos.y - this.player.y;
    this.player.angle = Math.atan2(aimDy, aimDx);

    // Timers & Cooldowns
    if (this.player.swatCooldown > 0) this.player.swatCooldown -= dt;
    if (this.player.isSwatting) {
      this.player.swatProgress += dt / 0.28;
      if (this.player.swatProgress >= 1) {
        this.player.isSwatting = false;
        this.player.swatProgress = 0;
      }
    }

    // Megaphone recharge over time (3.5% per second)
    if (this.player.megaphoneCharge < 100) {
      this.player.megaphoneCharge = Math.min(100, this.player.megaphoneCharge + dt * 4.5);
    }

    if (this.player.shieldTime > 0) this.player.shieldTime -= dt;
    if (this.player.iceAuraTime > 0) this.player.iceAuraTime -= dt;
    if (this.player.speedBoostTime > 0) this.player.speedBoostTime -= dt;
    if (this.player.invulnerableTime > 0) this.player.invulnerableTime -= dt;

    if (this.player.expressionTimer > 0) {
      this.player.expressionTimer -= dt;
      if (this.player.expressionTimer <= 0) {
        this.player.expression = this.player.isTreatDayFrenzy ? 'treat_frenzy' : 'neutral';
      }
    }

    if (this.screenShake > 0) {
      this.screenShake = Math.max(0, this.screenShake - dt * 25);
    }

    // 2. Day Progress
    this.stats.dayElapsed += dt;
    const dayFinished = this.stats.dayElapsed >= this.currentDayConfig.duration;

    if (dayFinished) {
      if (this.mode === 'story') {
        if (this.stats.dayIndex === DAYS_CONFIG.length - 1) {
          this.victory();
          return;
        } else {
          this.state = 'day_complete';
          sound.playDayWin();
          this.onStateChange(this.state);
        }
      } else {
        // Endless or Sandbox just continues
        this.stats.dayElapsed = 0;
      }
    }

    // 3. Spawning Foods
    this.spawnTimer += dt * 1000;
    if (this.spawnTimer >= this.currentDayConfig.spawnInterval) {
      this.spawnTimer = 0;
      this.spawnEnemy();
    }

    // Boss spawn on Saturday
    if (
      this.currentDayConfig.boss &&
      this.stats.dayElapsed > 8 &&
      !this.enemies.some((e) => e.type === this.currentDayConfig.boss)
    ) {
      this.spawnBoss(this.currentDayConfig.boss);
    }

    // 4. Spawning Allowed Diet Pickups (Cornflake, Water, Ice Cube)
    this.dietSpawnTimer += dt;
    if (this.dietSpawnTimer >= (this.player.isTreatDayFrenzy ? 8 : 4.5)) {
      this.dietSpawnTimer = 0;
      this.spawnDietPickup();
    }

    // 5. Update Diet Pickups
    for (let i = this.dietPickups.length - 1; i >= 0; i--) {
      const p = this.dietPickups[i];
      p.life -= dt;
      p.pulse += dt * 3;
      p.x += p.vx * dt;
      p.y += p.vy * dt;

      // Collection check
      const dist = Math.hypot(p.x - this.player.x, p.y - this.player.y);
      if (dist <= this.player.radius + p.radius) {
        this.collectDietPickup(p);
        this.dietPickups.splice(i, 1);
        continue;
      }

      if (p.life <= 0) {
        this.dietPickups.splice(i, 1);
      }
    }

    // 6. Update Enemies
    for (let i = this.enemies.length - 1; i >= 0; i--) {
      const enemy = this.enemies[i];

      // Ice freeze check
      if (enemy.isFrozen > 0) {
        enemy.isFrozen -= dt;
      } else {
        // Move towards Brian
        const dx = this.player.x - enemy.x;
        const dy = this.player.y - enemy.y;
        const dist = Math.max(Math.hypot(dx, dy), 1);

        let targetVx = (dx / dist) * enemy.speed;
        let targetVy = (dy / dist) * enemy.speed;

        // Custom behaviors
        if (enemy.type === 'potato_grid') {
          enemy.rotation += dt * 8;
        } else if (enemy.type === 'fluffy_ruff') {
          enemy.behaviorTimer = (enemy.behaviorTimer || 0) + dt * 4;
          targetVy += Math.sin(enemy.behaviorTimer) * 60;
        } else if (enemy.type === 'bonbonbonbon') {
          enemy.behaviorTimer = (enemy.behaviorTimer || 0) + dt * 8;
          targetVx += Math.cos(enemy.behaviorTimer) * 45;
        }

        // Smooth velocity towards target
        enemy.vx += (targetVx - enemy.vx) * dt * 3;
        enemy.vy += (targetVy - enemy.vy) * dt * 3;

        enemy.x += enemy.vx * dt;
        enemy.y += enemy.vy * dt;
      }

      // Check collision with Brian
      const playerDist = Math.hypot(enemy.x - this.player.x, enemy.y - this.player.y);

      if (playerDist <= this.player.radius + enemy.radius) {
        if (this.player.isTreatDayFrenzy) {
          // Sunday Treat Day: Gobble everything!
          this.gobbleEnemy(enemy, i);
          continue;
        } else {
          // Brian takes temptation damage!
          if (this.player.shieldTime > 0) {
            // Deflected by Room Temperature Water shield!
            this.hitEnemy(enemy, 2, enemy.x - this.player.x, enemy.y - this.player.y);
            this.spawnFloatingText('HYDRATION DEFLECT!', this.player.x, this.player.y - 30, '#38bdf8', 16);
          } else if (this.player.invulnerableTime <= 0) {
            this.damagePlayer(enemy.damage);
            this.enemies.splice(i, 1);
            continue;
          }
        }
      }

      // Boss special attacks
      if (enemy.isBoss && enemy.type === 'birthday_pie') {
        enemy.behaviorTimer = (enemy.behaviorTimer || 0) + dt;
        if (enemy.behaviorTimer >= 2.8) {
          enemy.behaviorTimer = 0;
          this.spawnCandleSparks(enemy.x, enemy.y);
        }
      }
    }

    // 7. Update Shockwaves
    for (let i = this.shockwaves.length - 1; i >= 0; i--) {
      const sw = this.shockwaves[i];
      sw.life -= dt;
      sw.radius += (sw.maxRadius - sw.radius) * (dt / sw.maxLife) * 2;
      sw.alpha = Math.max(0, sw.life / sw.maxLife);

      if (sw.life <= 0) {
        this.shockwaves.splice(i, 1);
      }
    }

    // 8. Update Particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.life -= dt;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.alpha = Math.max(0, p.life / p.maxLife);

      if (p.life <= 0) {
        this.particles.splice(i, 1);
      }
    }

    // 9. Update Floating Texts
    for (let i = this.floatingTexts.length - 1; i >= 0; i--) {
      const ft = this.floatingTexts[i];
      ft.life -= dt;
      ft.y -= dt * 35;
      ft.alpha = Math.max(0, ft.life / ft.maxLife);

      if (ft.life <= 0) {
        this.floatingTexts.splice(i, 1);
      }
    }

    this.onStatsChange({ ...this.stats });
  }

  // --- Entity Actions ---

  private spawnEnemy() {
    const pool = this.currentDayConfig.enemyPool;
    const type = pool[Math.floor(Math.random() * pool.length)];
    const meta = FOOD_DATABASE[type];

    // Spawn on random edge outside viewport
    const edge = Math.floor(Math.random() * 4);
    let x = 0;
    let y = 0;

    switch (edge) {
      case 0: // top
        x = Math.random() * this.width;
        y = -meta.radius;
        break;
      case 1: // right
        x = this.width + meta.radius;
        y = Math.random() * this.height;
        break;
      case 2: // bottom
        x = Math.random() * this.width;
        y = this.height + meta.radius;
        break;
      case 3: // left
        x = -meta.radius;
        y = Math.random() * this.height;
        break;
    }

    this.enemies.push({
      id: ++this.entityIdCounter,
      type,
      name: meta.name,
      x,
      y,
      vx: 0,
      vy: 0,
      radius: meta.radius,
      hp: meta.hp,
      maxHp: meta.hp,
      speed: meta.speed * (0.9 + Math.random() * 0.25),
      points: meta.points,
      damage: meta.damage,
      rotation: 0,
      rotSpeed: (Math.random() - 0.5) * 3,
      color: meta.color,
      accentColor: meta.accentColor,
      isFrozen: 0,
    });
  }

  private spawnBoss(bossType: TreatFoodType) {
    const meta = FOOD_DATABASE[bossType];
    this.enemies.push({
      id: ++this.entityIdCounter,
      type: bossType,
      name: meta.name,
      x: this.width / 2,
      y: -meta.radius * 2,
      vx: 0,
      vy: 40,
      radius: meta.radius,
      hp: meta.hp,
      maxHp: meta.hp,
      speed: meta.speed,
      points: meta.points,
      damage: meta.damage,
      rotation: 0,
      rotSpeed: 0.5,
      color: meta.color,
      accentColor: meta.accentColor,
      isFrozen: 0,
      isBoss: true,
      behaviorTimer: 0,
    });

    sound.speak('WARNING: BIRTHDAY PIE HAS ARRIVED!', true);
    this.spawnFloatingText('BIRTHDAY PIE ARRIVES!', this.width / 2, 120, '#db2777', 28);
  }

  private spawnCandleSparks(x: number, y: number) {
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * 120,
        vy: Math.sin(angle) * 120,
        radius: 4,
        color: '#facc15',
        alpha: 1,
        life: 0.8,
        maxLife: 0.8,
        shape: 'sparkle',
      });
    }
  }

  private spawnDietPickup() {
    const types: ('cornflake' | 'water' | 'ice_cube')[] = [
      this.currentDayConfig.allowedDietItem,
      'cornflake',
      'water',
      'ice_cube',
    ];
    const chosenType = types[Math.floor(Math.random() * types.length)];

    let name = 'One Cornflake';
    if (chosenType === 'water') name = 'Room Temp Water';
    if (chosenType === 'ice_cube') name = 'An Ice Cube';

    this.dietPickups.push({
      id: ++this.entityIdCounter,
      type: chosenType,
      name,
      x: 60 + Math.random() * (this.width - 120),
      y: 100 + Math.random() * (this.height - 180),
      vx: (Math.random() - 0.5) * 15,
      vy: (Math.random() - 0.5) * 15,
      radius: 18,
      life: 14,
      maxLife: 14,
      pulse: 0,
    });
  }

  private collectDietPickup(p: DietPickup) {
    this.player.expression = 'eating';
    this.player.expressionTimer = 0.45;

    if (p.type === 'cornflake') {
      this.stats.cornflakesEaten++;
      this.player.willpower = Math.min(100, this.player.willpower + 25);
      this.player.speedBoostTime = 4.5;
      sound.playCornflakeCrunch();
      sound.speak('One cornflake.');
      this.spawnFloatingText('+25 WILLPOWER! ONE CORNFLAKE', p.x, p.y - 20, '#facc15', 18);

      // Gold crumb particles
      for (let i = 0; i < 12; i++) {
        this.particles.push({
          x: p.x,
          y: p.y,
          vx: (Math.random() - 0.5) * 140,
          vy: (Math.random() - 0.5) * 140,
          radius: 3,
          color: '#facc15',
          alpha: 1,
          life: 0.5,
          maxLife: 0.5,
          shape: 'crumb',
        });
      }
    } else if (p.type === 'water') {
      this.stats.waterDrank++;
      this.player.shieldTime = 5.0;
      sound.playWaterSplash();
      sound.speak('Pint of room temperature water.');
      this.spawnFloatingText('HYDRATION SHIELD (5s)!', p.x, p.y - 20, '#38bdf8', 18);

      // Splash shockwave
      this.shockwaves.push({
        x: this.player.x,
        y: this.player.y,
        radius: 20,
        maxRadius: 220,
        color: '#38bdf8',
        alpha: 0.9,
        damage: 1,
        life: 0.4,
        maxLife: 0.4,
      });

      // Water droplets
      for (let i = 0; i < 16; i++) {
        this.particles.push({
          x: p.x,
          y: p.y,
          vx: (Math.random() - 0.5) * 180,
          vy: (Math.random() - 0.5) * 180,
          radius: 3.5,
          color: '#38bdf8',
          alpha: 1,
          life: 0.6,
          maxLife: 0.6,
          shape: 'droplet',
        });
      }
    } else if (p.type === 'ice_cube') {
      this.stats.iceCubesCrunched++;
      sound.playIceFreeze();
      sound.speak('An ice cube.');
      this.spawnFloatingText('ALL FOOD FROZEN! AN ICE CUBE', p.x, p.y - 20, '#a5f3fc', 18);

      // Freeze all existing enemies
      this.enemies.forEach((e) => {
        e.isFrozen = 4.0;
      });

      // Ice crystals
      for (let i = 0; i < 18; i++) {
        this.particles.push({
          x: p.x,
          y: p.y,
          vx: (Math.random() - 0.5) * 160,
          vy: (Math.random() - 0.5) * 160,
          radius: 3.5,
          color: '#cffafe',
          alpha: 1,
          life: 0.7,
          maxLife: 0.7,
          shape: 'sparkle',
        });
      }
    }

    // Add some score for dietary discipline
    this.addScore(100);
  }

  private hitEnemy(enemy: FoodEnemy, damage: number, dx: number, dy: number, playHitSfx: boolean = true) {
    enemy.hp -= damage;
    this.hitstopTimer = 0.04;
    this.screenShake = 4;

    if (playHitSfx) sound.playHit();

    // Knockback
    const dist = Math.max(Math.hypot(dx, dy), 1);
    enemy.vx += (dx / dist) * 220;
    enemy.vy += (dy / dist) * 220;

    // Crumb particles
    for (let i = 0; i < 6; i++) {
      this.particles.push({
        x: enemy.x,
        y: enemy.y,
        vx: (Math.random() - 0.5) * 120,
        vy: (Math.random() - 0.5) * 120,
        radius: 2.5,
        color: enemy.color,
        alpha: 1,
        life: 0.4,
        maxLife: 0.4,
        shape: 'crumb',
      });
    }

    if (enemy.hp <= 0) {
      this.defeatEnemy(enemy);
    }
  }

  private defeatEnemy(enemy: FoodEnemy) {
    const idx = this.enemies.indexOf(enemy);
    if (idx !== -1) {
      this.enemies.splice(idx, 1);
    }

    this.stats.treatsDefeated++;
    this.stats.currentCombo++;
    if (this.stats.currentCombo > this.stats.maxCombo) {
      this.stats.maxCombo = this.stats.currentCombo;
    }

    const comboBonus = Math.min(this.stats.currentCombo * 20, 200);
    this.addScore(enemy.points + comboBonus);

    // Charge megaphone on successful swat (+6%)
    this.player.megaphoneCharge = Math.min(100, this.player.megaphoneCharge + 7);

    // Food explosion particles
    for (let i = 0; i < 14; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 40 + Math.random() * 120;
      this.particles.push({
        x: enemy.x,
        y: enemy.y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        radius: 3 + Math.random() * 3,
        color: Math.random() > 0.5 ? enemy.color : enemy.accentColor,
        alpha: 1,
        life: 0.55,
        maxLife: 0.55,
        shape: 'crumb',
      });
    }

    // Occasional quote on high combo
    if (this.stats.currentCombo % 8 === 0) {
      sound.speak('NO! BE GONE!');
      this.spawnFloatingText(`COMBO x${this.stats.currentCombo}!`, enemy.x, enemy.y - 25, '#f43f5e', 22);
    }
  }

  private gobbleEnemy(enemy: FoodEnemy, index: number) {
    this.enemies.splice(index, 1);
    this.stats.treatsGobbled++;
    this.stats.currentCombo++;
    const bonus = enemy.points * 3;
    this.addScore(bonus);

    sound.playGobble();
    this.spawnFloatingText(`+${bonus} YUM!`, enemy.x, enemy.y - 20, '#facc15', 18);

    for (let i = 0; i < 10; i++) {
      this.particles.push({
        x: enemy.x,
        y: enemy.y,
        vx: (Math.random() - 0.5) * 150,
        vy: (Math.random() - 0.5) * 150,
        radius: 3,
        color: '#facc15',
        alpha: 1,
        life: 0.5,
        maxLife: 0.5,
        shape: 'sparkle',
      });
    }
  }

  private damagePlayer(amount: number) {
    this.player.willpower = Math.max(0, this.player.willpower - amount);
    this.player.invulnerableTime = 0.8;
    this.player.expression = 'hit';
    this.player.expressionTimer = 0.5;
    this.stats.currentCombo = 0;
    this.stats.damageTaken += amount;
    this.screenShake = 14;

    sound.playDamage();
    sound.speak('NO! STAY BACK!');

    this.spawnFloatingText(`-${amount} TEMPTATION!`, this.player.x, this.player.y - 40, '#ef4444', 20);

    // Red blood/distress particles
    for (let i = 0; i < 8; i++) {
      this.particles.push({
        x: this.player.x,
        y: this.player.y,
        vx: (Math.random() - 0.5) * 100,
        vy: (Math.random() - 0.5) * 100,
        radius: 4,
        color: '#ef4444',
        alpha: 1,
        life: 0.4,
        maxLife: 0.4,
        shape: 'crumb',
      });
    }

    if (this.player.willpower <= 0) {
      this.gameOver();
    }
  }

  private addScore(amount: number) {
    this.stats.score += amount;
    if (this.stats.score > this.stats.highScore) {
      this.stats.highScore = this.stats.score;
      localStorage.setItem('butterfield_high_score', this.stats.highScore.toString());
    }
  }

  private spawnFloatingText(text: string, x: number, y: number, color: string, fontSize: number = 18) {
    this.floatingTexts.push({
      id: ++this.entityIdCounter,
      text,
      x,
      y,
      color,
      fontSize,
      alpha: 1,
      life: 0.9,
      maxLife: 0.9,
      scale: 1,
    });
  }

  private gameOver() {
    this.state = 'game_over';
    sound.stopBGM();
    sound.playGameOver();
    sound.speak('CALL OF NOW... DIET RUINED! PORK SANDWICH HAS WON.', true);
    this.onStateChange(this.state);
  }

  private victory() {
    this.state = 'victory';
    sound.stopBGM();
    sound.playTreatDayFanfare();
    sound.speak('CONGRATULATIONS! YOU HAVE SURVIVED UNTIL TREAT DAY!', true);
    this.onStateChange(this.state);
  }

  // --- Rendering ---

  private render() {
    this.ctx.save();

    // Screen Shake
    if (this.screenShake > 0) {
      const sx = (Math.random() - 0.5) * this.screenShake;
      const sy = (Math.random() - 0.5) * this.screenShake;
      this.ctx.translate(sx, sy);
    }

    // 1. Draw Office / Kitchen Background
    this.renderBackground();

    // 2. Draw Shockwaves
    this.renderShockwaves();

    // 3. Draw Pickups
    this.renderDietPickups();

    // 4. Draw Foods (Enemies)
    this.renderEnemies();

    // 5. Draw Brian Butterfield (Player)
    this.renderBrian();

    // 6. Draw Particles
    this.renderParticles();

    // 7. Draw Floating Texts
    this.renderFloatingTexts();

    this.ctx.restore();
  }

  private renderBackground() {
    // Elegant sleek corporate office/boardroom floor
    const grad = this.ctx.createLinearGradient(0, 0, 0, this.height);
    if (this.player.isTreatDayFrenzy) {
      // Golden celebratory room for Sunday Treat Day!
      grad.addColorStop(0, '#422006');
      grad.addColorStop(1, '#78350f');
    } else {
      grad.addColorStop(0, '#0f172a');
      grad.addColorStop(1, '#1e293b');
    }
    this.ctx.fillStyle = grad;
    this.ctx.fillRect(0, 0, this.width, this.height);

    // Subtle executive grid carpet tiles
    this.ctx.strokeStyle = this.player.isTreatDayFrenzy ? 'rgba(250, 204, 21, 0.08)' : 'rgba(255, 255, 255, 0.04)';
    this.ctx.lineWidth = 1;
    const tileSize = 60;
    for (let x = 0; x < this.width; x += tileSize) {
      this.ctx.beginPath();
      this.ctx.moveTo(x, 0);
      this.ctx.lineTo(x, this.height);
      this.ctx.stroke();
    }
    for (let y = 0; y < this.height; y += tileSize) {
      this.ctx.beginPath();
      this.ctx.moveTo(0, y);
      this.ctx.lineTo(this.width, y);
      this.ctx.stroke();
    }

    // London High-Rise Window skyline silhouette in background
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
    this.ctx.fillRect(40, 20, 160, 40);
    this.ctx.fillRect(240, 15, 120, 45);
    this.ctx.fillRect(400, 10, 200, 50);
  }

  private renderShockwaves() {
    this.shockwaves.forEach((sw) => {
      this.ctx.save();
      this.ctx.beginPath();
      this.ctx.arc(sw.x, sw.y, sw.radius, 0, Math.PI * 2);
      this.ctx.strokeStyle = sw.color;
      this.ctx.globalAlpha = sw.alpha;
      this.ctx.lineWidth = 4;
      this.ctx.stroke();
      this.ctx.restore();
    });
  }

  private renderDietPickups() {
    this.dietPickups.forEach((p) => {
      this.ctx.save();
      this.ctx.translate(p.x, p.y);

      // Glowing aura
      const scale = 1 + Math.sin(p.pulse) * 0.12;
      this.ctx.scale(scale, scale);

      if (p.type === 'cornflake') {
        // Divine ray beam
        const aura = this.ctx.createRadialGradient(0, 0, 4, 0, 0, 28);
        aura.addColorStop(0, 'rgba(250, 204, 21, 0.6)');
        aura.addColorStop(1, 'rgba(250, 204, 21, 0)');
        this.ctx.fillStyle = aura;
        this.ctx.beginPath();
        this.ctx.arc(0, 0, 28, 0, Math.PI * 2);
        this.ctx.fill();

        // Golden Cornflake shape
        this.ctx.fillStyle = '#facc15';
        this.ctx.strokeStyle = '#b45309';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.moveTo(-10, -4);
        this.ctx.bezierCurveTo(-14, 6, 8, 14, 12, 4);
        this.ctx.bezierCurveTo(14, -6, -2, -12, -10, -4);
        this.ctx.fill();
        this.ctx.stroke();

        // Flake texture ridges
        this.ctx.strokeStyle = '#eab308';
        this.ctx.beginPath();
        this.ctx.moveTo(-4, -2);
        this.ctx.lineTo(6, 2);
        this.ctx.stroke();
      } else if (p.type === 'water') {
        // Glass pint of room temperature water
        const aura = this.ctx.createRadialGradient(0, 0, 4, 0, 0, 28);
        aura.addColorStop(0, 'rgba(56, 189, 248, 0.6)');
        aura.addColorStop(1, 'rgba(56, 189, 248, 0)');
        this.ctx.fillStyle = aura;
        this.ctx.beginPath();
        this.ctx.arc(0, 0, 28, 0, Math.PI * 2);
        this.ctx.fill();

        // Glass tumbler
        this.ctx.fillStyle = 'rgba(224, 242, 254, 0.3)';
        this.ctx.strokeStyle = '#38bdf8';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.moveTo(-8, -12);
        this.ctx.lineTo(-6, 12);
        this.ctx.quadraticCurveTo(0, 15, 6, 12);
        this.ctx.lineTo(8, -12);
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.stroke();

        // Water level
        this.ctx.fillStyle = 'rgba(56, 189, 248, 0.7)';
        this.ctx.beginPath();
        this.ctx.moveTo(-7.5, -4);
        this.ctx.lineTo(-6, 10);
        this.ctx.quadraticCurveTo(0, 13, 6, 10);
        this.ctx.lineTo(7.5, -4);
        this.ctx.closePath();
        this.ctx.fill();

        // "20°C" label
        this.ctx.fillStyle = '#bae6fd';
        this.ctx.font = 'bold 8px sans-serif';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('20°C', 0, 3);
      } else if (p.type === 'ice_cube') {
        // Cyan sparkling ice cube
        const aura = this.ctx.createRadialGradient(0, 0, 4, 0, 0, 28);
        aura.addColorStop(0, 'rgba(165, 243, 252, 0.6)');
        aura.addColorStop(1, 'rgba(165, 243, 252, 0)');
        this.ctx.fillStyle = aura;
        this.ctx.beginPath();
        this.ctx.arc(0, 0, 28, 0, Math.PI * 2);
        this.ctx.fill();

        this.ctx.fillStyle = 'rgba(165, 243, 252, 0.85)';
        this.ctx.strokeStyle = '#06b6d4';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.roundRect(-10, -10, 20, 20, 4);
        this.ctx.fill();
        this.ctx.stroke();

        // Inner ice glint
        this.ctx.fillStyle = '#ffffff';
        this.ctx.beginPath();
        this.ctx.moveTo(-6, -6);
        this.ctx.lineTo(-2, -6);
        this.ctx.lineTo(-6, -2);
        this.ctx.fill();
      }

      this.ctx.restore();
    });
  }

  private renderEnemies() {
    this.enemies.forEach((enemy) => {
      this.ctx.save();
      this.ctx.translate(enemy.x, enemy.y);
      this.ctx.rotate(enemy.rotation);

      // Shadow
      this.ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
      this.ctx.beginPath();
      this.ctx.ellipse(0, enemy.radius * 0.9, enemy.radius, enemy.radius * 0.35, 0, 0, Math.PI * 2);
      this.ctx.fill();

      // Frozen overlay if chilled
      if (enemy.isFrozen > 0) {
        this.ctx.strokeStyle = '#67e8f9';
        this.ctx.lineWidth = 4;
        this.ctx.strokeRect(-enemy.radius - 2, -enemy.radius - 2, enemy.radius * 2 + 4, enemy.radius * 2 + 4);
      }

      // Draw custom food graphics
      this.renderFoodGraphics(enemy);

      // Health bar for tougher foods / bosses
      if (enemy.maxHp > 1) {
        const hpPercent = Math.max(0, enemy.hp / enemy.maxHp);
        const barW = enemy.radius * 1.6;
        const barH = 5;
        this.ctx.fillStyle = 'rgba(0,0,0,0.6)';
        this.ctx.fillRect(-barW / 2, -enemy.radius - 12, barW, barH);
        this.ctx.fillStyle = hpPercent > 0.4 ? '#22c55e' : '#ef4444';
        this.ctx.fillRect(-barW / 2, -enemy.radius - 12, barW * hpPercent, barH);
      }

      this.ctx.restore();
    });
  }

  private renderFoodGraphics(enemy: FoodEnemy) {
    const r = enemy.radius;

    switch (enemy.type) {
      case 'pork_sandwich': {
        // Golden bun top
        this.ctx.fillStyle = '#f59e0b';
        this.ctx.strokeStyle = '#b45309';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.ellipse(0, -6, r, r * 0.55, 0, Math.PI, 0);
        this.ctx.fill();
        this.ctx.stroke();

        // Thick pink pork meat layer
        this.ctx.fillStyle = '#fb7185';
        this.ctx.fillRect(-r * 0.9, -6, r * 1.8, 8);

        // Bun bottom
        this.ctx.fillStyle = '#d97706';
        this.ctx.beginPath();
        this.ctx.ellipse(0, 4, r, r * 0.4, 0, 0, Math.PI);
        this.ctx.fill();
        this.ctx.stroke();

        // Eyes on bun
        this.drawCartoonEyes(0, -10, 4);
        break;
      }

      case 'potato_grid': {
        // Waffle fry grid
        this.ctx.fillStyle = '#eab308';
        this.ctx.strokeStyle = '#78350f';
        this.ctx.lineWidth = 3;
        this.ctx.beginPath();
        this.ctx.roundRect(-r, -r, r * 2, r * 2, 4);
        this.ctx.fill();
        this.ctx.stroke();

        // Waffle grid cutouts
        this.ctx.fillStyle = '#78350f';
        const s = r * 0.45;
        this.ctx.fillRect(-s - 2, -s - 2, s, s);
        this.ctx.fillRect(4, -s - 2, s, s);
        this.ctx.fillRect(-s - 2, 4, s, s);
        this.ctx.fillRect(4, 4, s, s);
        break;
      }

      case 'bonbonbonbon': {
        // Pink glossy bonbon
        this.ctx.fillStyle = '#ec4899';
        this.ctx.strokeStyle = '#be185d';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.arc(0, 0, r, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.stroke();

        // Chocolate squiggle icing
        this.ctx.strokeStyle = '#451a03';
        this.ctx.lineWidth = 2.5;
        this.ctx.beginPath();
        this.ctx.moveTo(-r * 0.6, -r * 0.2);
        this.ctx.bezierCurveTo(-r * 0.2, -r * 0.6, r * 0.2, r * 0.6, r * 0.6, 0);
        this.ctx.stroke();
        break;
      }

      case 'fluffy_ruff': {
        // Fluffy cloud pastry
        this.ctx.fillStyle = '#fbcfe8';
        this.ctx.strokeStyle = '#f472b6';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.arc(-8, 0, r * 0.6, 0, Math.PI * 2);
        this.ctx.arc(8, 0, r * 0.6, 0, Math.PI * 2);
        this.ctx.arc(0, -8, r * 0.6, 0, Math.PI * 2);
        this.ctx.arc(0, 6, r * 0.65, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.stroke();

        // Strawberry sugar dot
        this.ctx.fillStyle = '#e11d48';
        this.ctx.beginPath();
        this.ctx.arc(0, -2, 4, 0, Math.PI * 2);
        this.ctx.fill();
        break;
      }

      case 'chocolate_quiche': {
        // Wedge slice of chocolate quiche
        this.ctx.fillStyle = '#451a03';
        this.ctx.strokeStyle = '#78350f';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.moveTo(0, -r);
        this.ctx.lineTo(r, r);
        this.ctx.lineTo(-r, r);
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.stroke();

        // Pastry crust top
        this.ctx.strokeStyle = '#d97706';
        this.ctx.lineWidth = 4;
        this.ctx.beginPath();
        this.ctx.moveTo(-r, r);
        this.ctx.lineTo(r, r);
        this.ctx.stroke();
        break;
      }

      case 'fried_eggs': {
        // Pan or plate with eggs
        this.ctx.fillStyle = '#f8fafc';
        this.ctx.strokeStyle = '#cbd5e1';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.ellipse(0, 0, r, r * 0.8, 0, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.stroke();

        // 3 Golden yolks
        this.ctx.fillStyle = '#f59e0b';
        this.ctx.beginPath();
        this.ctx.arc(-7, -4, 6, 0, Math.PI * 2);
        this.ctx.arc(7, -3, 5.5, 0, Math.PI * 2);
        this.ctx.arc(0, 7, 6.5, 0, Math.PI * 2);
        this.ctx.fill();
        break;
      }

      case 'large_mac': {
        // Giant burger
        this.ctx.fillStyle = '#b45309';
        this.ctx.beginPath();
        this.ctx.ellipse(0, -12, r, r * 0.45, 0, Math.PI, 0);
        this.ctx.fill();

        // Cheese & patties
        this.ctx.fillStyle = '#22c55e'; // lettuce
        this.ctx.fillRect(-r * 0.9, -10, r * 1.8, 4);
        this.ctx.fillStyle = '#451a03'; // beef
        this.ctx.fillRect(-r * 0.9, -6, r * 1.8, 7);
        this.ctx.fillStyle = '#f59e0b'; // middle bun
        this.ctx.fillRect(-r * 0.8, 1, r * 1.6, 5);
        this.ctx.fillStyle = '#451a03'; // beef 2
        this.ctx.fillRect(-r * 0.9, 6, r * 1.8, 7);
        this.ctx.fillStyle = '#92400e'; // bottom bun
        this.ctx.beginPath();
        this.ctx.ellipse(0, 13, r * 0.9, r * 0.35, 0, 0, Math.PI);
        this.ctx.fill();

        // Sesame seeds
        this.ctx.fillStyle = '#fef08a';
        this.ctx.fillRect(-6, -18, 2, 3);
        this.ctx.fillRect(4, -16, 2, 3);
        this.ctx.fillRect(-12, -14, 2, 3);
        break;
      }

      case 'mystery_meat': {
        // Glowing purple pulsing block
        this.ctx.fillStyle = '#9333ea';
        this.ctx.strokeStyle = '#c084fc';
        this.ctx.lineWidth = 3;
        this.ctx.strokeRect(-r * 0.8, -r * 0.8, r * 1.6, r * 1.6);
        this.ctx.fillRect(-r * 0.8, -r * 0.8, r * 1.6, r * 1.6);

        // Question mark
        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = 'bold 18px sans-serif';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText('?', 0, 0);
        break;
      }

      case 'hoisin_crispy_owl': {
        // Crispy roast bird with glaze
        this.ctx.fillStyle = '#7f1d1d';
        this.ctx.strokeStyle = '#b91c1c';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.ellipse(0, 0, r, r * 0.7, 0, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.stroke();

        // Crispy wings
        this.ctx.fillStyle = '#991b1b';
        this.ctx.beginPath();
        this.ctx.ellipse(-r * 0.8, -4, 8, 16, Math.PI * 0.2, 0, Math.PI * 2);
        this.ctx.ellipse(r * 0.8, -4, 8, 16, -Math.PI * 0.2, 0, Math.PI * 2);
        this.ctx.fill();

        // Owl eyes
        this.ctx.fillStyle = '#fef08a';
        this.ctx.beginPath();
        this.ctx.arc(-5, -6, 5, 0, Math.PI * 2);
        this.ctx.arc(5, -6, 5, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.fillStyle = '#000';
        this.ctx.beginPath();
        this.ctx.arc(-5, -6, 2, 0, Math.PI * 2);
        this.ctx.arc(5, -6, 2, 0, Math.PI * 2);
        this.ctx.fill();
        break;
      }

      case 'birthday_pie': {
        // Giant boss layered pie
        this.ctx.fillStyle = '#db2777';
        this.ctx.strokeStyle = '#9d174d';
        this.ctx.lineWidth = 4;
        this.ctx.beginPath();
        this.ctx.arc(0, 0, r, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.stroke();

        // Icing swirls
        this.ctx.strokeStyle = '#fbcfe8';
        this.ctx.lineWidth = 6;
        this.ctx.beginPath();
        this.ctx.arc(0, 0, r * 0.65, 0, Math.PI * 2);
        this.ctx.stroke();

        // 3 Burning Candles
        for (let i = -1; i <= 1; i++) {
          const cx = i * 16;
          const cy = -12;
          this.ctx.fillStyle = '#38bdf8';
          this.ctx.fillRect(cx - 3, cy, 6, 18);
          // Flame
          this.ctx.fillStyle = '#facc15';
          this.ctx.beginPath();
          this.ctx.ellipse(cx, cy - 4, 3, 6, 0, 0, Math.PI * 2);
          this.ctx.fill();
        }
        break;
      }
    }
  }

  private drawCartoonEyes(x: number, y: number, r: number) {
    this.ctx.fillStyle = '#ffffff';
    this.ctx.beginPath();
    this.ctx.arc(x - 5, y, r, 0, Math.PI * 2);
    this.ctx.arc(x + 5, y, r, 0, Math.PI * 2);
    this.ctx.fill();

    this.ctx.fillStyle = '#0f172a';
    this.ctx.beginPath();
    this.ctx.arc(x - 4, y, r * 0.5, 0, Math.PI * 2);
    this.ctx.arc(x + 4, y, r * 0.5, 0, Math.PI * 2);
    this.ctx.fill();
  }

  private renderBrian() {
    this.ctx.save();
    this.ctx.translate(this.player.x, this.player.y);

    // Invulnerability blink
    if (this.player.invulnerableTime > 0 && Math.floor(Date.now() / 80) % 2 === 0) {
      this.ctx.globalAlpha = 0.5;
    }

    // Shadow
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
    this.ctx.beginPath();
    this.ctx.ellipse(0, this.player.radius * 0.8, this.player.radius * 0.9, this.player.radius * 0.35, 0, 0, Math.PI * 2);
    this.ctx.fill();

    // Protective Water Hydration Shield
    if (this.player.shieldTime > 0) {
      this.ctx.save();
      this.ctx.strokeStyle = 'rgba(56, 189, 248, 0.8)';
      this.ctx.lineWidth = 3;
      this.ctx.setLineDash([8, 4]);
      this.ctx.beginPath();
      this.ctx.arc(0, 0, this.player.radius + 16, 0, Math.PI * 2);
      this.ctx.stroke();
      this.ctx.fillStyle = 'rgba(56, 189, 248, 0.12)';
      this.ctx.fill();
      this.ctx.restore();
    }

    // Treat Day Golden Frenzy Aura
    if (this.player.isTreatDayFrenzy) {
      this.ctx.save();
      const aura = this.ctx.createRadialGradient(0, 0, this.player.radius * 0.5, 0, 0, this.player.radius + 30);
      aura.addColorStop(0, 'rgba(250, 204, 21, 0.8)');
      aura.addColorStop(1, 'rgba(250, 204, 21, 0)');
      this.ctx.fillStyle = aura;
      this.ctx.beginPath();
      this.ctx.arc(0, 0, this.player.radius + 30, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.restore();
    }

    // Rotate player towards mouse aim direction
    this.ctx.rotate(this.player.angle);

    // Draw Brian's Swatting Arm & Diet Pamphlet
    if (this.player.isSwatting) {
      this.ctx.save();
      const swingAngle = -Math.PI * 0.4 + this.player.swatProgress * Math.PI * 0.9;
      this.ctx.rotate(swingAngle);

      // Arm in suit fabric
      this.ctx.fillStyle = '#94a3b8';
      this.ctx.fillRect(15, -6, 32, 12);

      // Brian's Diet Binder / Briefcase: "BUTTERFIELD DIET PLAN"
      this.ctx.fillStyle = '#1e293b';
      this.ctx.strokeStyle = '#facc15';
      this.ctx.lineWidth = 2;
      this.ctx.beginPath();
      this.ctx.roundRect(40, -18, 30, 36, 3);
      this.ctx.fill();
      this.ctx.stroke();

      // Pamphlet text label
      this.ctx.fillStyle = '#f8fafc';
      this.ctx.font = 'bold 7px sans-serif';
      this.ctx.fillText('DIET', 45, -2);
      this.ctx.fillText('PLAN', 45, 8);

      // Motion swoosh line
      this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
      this.ctx.lineWidth = 3;
      this.ctx.beginPath();
      this.ctx.arc(0, 0, 75, -Math.PI * 0.3, Math.PI * 0.3);
      this.ctx.stroke();

      this.ctx.restore();
    } else {
      // Idle Diet Binder under arm
      this.ctx.fillStyle = '#1e293b';
      this.ctx.strokeStyle = '#facc15';
      this.ctx.lineWidth = 1.5;
      this.ctx.fillRect(16, 12, 18, 22);
      this.ctx.strokeRect(16, 12, 18, 22);
    }

    // Megaphone drawn if shouting
    if (this.player.expression === 'shouting') {
      this.ctx.save();
      this.ctx.translate(28, -12);
      this.ctx.fillStyle = '#eab308';
      this.ctx.beginPath();
      this.ctx.moveTo(0, -6);
      this.ctx.lineTo(26, -18);
      this.ctx.lineTo(26, 18);
      this.ctx.lineTo(0, 6);
      this.ctx.closePath();
      this.ctx.fill();
      this.ctx.fillStyle = '#dc2626';
      this.ctx.fillRect(26, -20, 6, 40);
      this.ctx.restore();
    }

    // Brian's Body Token (Grey Suit, White Collar, Red-Striped Tie)
    const r = this.player.radius;

    // Suit shoulders
    this.ctx.fillStyle = '#64748b'; // Classic Butterfield grey suit
    this.ctx.strokeStyle = '#334155';
    this.ctx.lineWidth = 3;
    this.ctx.beginPath();
    this.ctx.arc(0, 0, r, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.stroke();

    // If Brian's photo is loaded, clip and draw his face!
    if (this.brianImgLoaded && this.brianImg) {
      this.ctx.save();
      this.ctx.beginPath();
      this.ctx.arc(0, 0, r * 0.88, 0, Math.PI * 2);
      this.ctx.clip();

      // Draw the cropped portion of Brian's face from the user's reference image
      // In /assets/aistudio/image_b53d7ec1.png, Brian's face is roughly in the upper center
      const imgW = this.brianImg.naturalWidth;
      const imgH = this.brianImg.naturalHeight;
      const cropX = imgW * 0.22;
      const cropY = imgH * 0.04;
      const cropSize = imgW * 0.58;

      this.ctx.drawImage(
        this.brianImg,
        cropX,
        cropY,
        cropSize,
        cropSize,
        -r * 0.9,
        -r * 0.9,
        r * 1.8,
        r * 1.8
      );
      this.ctx.restore();
    } else {
      // Fallback clean vector portrait of Brian
      this.renderVectorBrianFace(r);
    }

    // Party hat on Sunday Treat Day!
    if (this.player.isTreatDayFrenzy) {
      this.ctx.fillStyle = '#ec4899';
      this.ctx.beginPath();
      this.ctx.moveTo(-12, -r * 0.8);
      this.ctx.lineTo(12, -r * 0.8);
      this.ctx.lineTo(0, -r * 1.6);
      this.ctx.closePath();
      this.ctx.fill();
      this.ctx.fillStyle = '#facc15';
      this.ctx.beginPath();
      this.ctx.arc(0, -r * 1.6, 4, 0, Math.PI * 2);
      this.ctx.fill();
    }

    this.ctx.restore();
  }

  private renderVectorBrianFace(r: number) {
    // Skin tone
    this.ctx.fillStyle = '#fed7aa';
    this.ctx.beginPath();
    this.ctx.arc(0, 0, r * 0.75, 0, Math.PI * 2);
    this.ctx.fill();

    // Combed back grey-blond hair
    this.ctx.fillStyle = '#cbd5e1';
    this.ctx.beginPath();
    this.ctx.arc(0, -r * 0.35, r * 0.65, Math.PI, 0);
    this.ctx.fill();

    // Moustache
    this.ctx.fillStyle = '#94a3b8';
    this.ctx.fillRect(-10, 4, 20, 6);

    // Eyes
    this.drawCartoonEyes(0, -4, 3.5);

    // Tie
    this.ctx.fillStyle = '#dc2626';
    this.ctx.fillRect(-3, 14, 6, 12);
  }

  private renderParticles() {
    this.particles.forEach((p) => {
      this.ctx.save();
      this.ctx.globalAlpha = p.alpha;
      this.ctx.fillStyle = p.color;

      if (p.shape === 'sparkle') {
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        this.ctx.fill();
      } else if (p.shape === 'droplet') {
        this.ctx.beginPath();
        this.ctx.ellipse(p.x, p.y, p.radius, p.radius * 1.5, 0, 0, Math.PI * 2);
        this.ctx.fill();
      } else {
        this.ctx.fillRect(p.x - p.radius, p.y - p.radius, p.radius * 2, p.radius * 2);
      }

      this.ctx.restore();
    });
  }

  private renderFloatingTexts() {
    this.floatingTexts.forEach((ft) => {
      this.ctx.save();
      this.ctx.globalAlpha = ft.alpha;
      this.ctx.font = `800 ${ft.fontSize}px 'Bricolage Grotesque', sans-serif`;
      this.ctx.textAlign = 'center';
      this.ctx.textBaseline = 'middle';

      // Crisp black drop outline for maximum readability
      this.ctx.strokeStyle = '#000000';
      this.ctx.lineWidth = 4;
      this.ctx.strokeText(ft.text, ft.x, ft.y);

      this.ctx.fillStyle = ft.color;
      this.ctx.fillText(ft.text, ft.x, ft.y);

      this.ctx.restore();
    });
  }

  public destroy() {
    this.isRunning = false;
    if (this.animFrameId !== null) {
      cancelAnimationFrame(this.animFrameId);
    }
    sound.stopBGM();
  }
}
