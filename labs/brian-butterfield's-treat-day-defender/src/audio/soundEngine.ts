/**
 * Procedural Web Audio synthesizer and speech voice system for Brian Butterfield game.
 * Zero external audio files ensures 100% reliability with zero broken network requests.
 */

class SoundEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private bgmGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private isMuted: boolean = false;
  private isVoiceEnabled: boolean = true;
  private isBgmPlaying: boolean = false;
  private bgmIntervalId: number | null = null;
  private stepIndex: number = 0;

  constructor() {
    // AudioContext will be initialized on first user interaction
  }

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = this.isMuted ? 0 : 1;
      this.masterGain.connect(this.ctx.destination);

      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.value = 0.8;
      this.sfxGain.connect(this.masterGain);

      this.bgmGain = this.ctx.createGain();
      this.bgmGain.gain.value = 0.35;
      this.bgmGain.connect(this.masterGain);
    }

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 1, this.ctx.currentTime);
    }
    if (this.isMuted && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    return this.isMuted;
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  public toggleVoice(): boolean {
    this.isVoiceEnabled = !this.isVoiceEnabled;
    if (!this.isVoiceEnabled && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    return this.isVoiceEnabled;
  }

  public getIsVoiceEnabled(): boolean {
    return this.isVoiceEnabled;
  }

  // --- Voice lines using Speech Synthesis API with British pitch ---
  public speak(phrase: string, priority: boolean = false) {
    if (!this.isVoiceEnabled || this.isMuted || !window.speechSynthesis) return;

    if (priority) {
      window.speechSynthesis.cancel();
    } else if (window.speechSynthesis.speaking) {
      return; // don't overlap too many quotes
    }

    try {
      const utterance = new SpeechSynthesisUtterance(phrase);
      utterance.pitch = 0.82; // deeper pompous tone
      utterance.rate = 1.05; // brisk sales pitch delivery
      utterance.volume = 0.9;

      // Find an English/British voice if available
      const voices = window.speechSynthesis.getVoices();
      const britishVoice = voices.find(
        (v) => v.lang === 'en-GB' || v.lang.startsWith('en-GB') || v.name.includes('UK') || v.name.includes('British')
      ) || voices.find((v) => v.lang.startsWith('en'));

      if (britishVoice) {
        utterance.voice = britishVoice;
      }

      window.speechSynthesis.speak(utterance);
    } catch {
      // Ignore speech synth error gracefully
    }
  }

  // --- Sound Effects ---

  // Swat with Diet Binder / Briefcase
  public playSwat() {
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;
    const t = this.ctx.currentTime;

    // Whoosh oscillator
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(450, t);
    osc.frequency.exponentialRampToValueAtTime(120, t + 0.12);

    gain.gain.setValueAtTime(0.4, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(t);
    osc.stop(t + 0.13);
  }

  // Impact on food item
  public playHit() {
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;
    const t = this.ctx.currentTime;

    // Crisp pop/smack
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(280, t);
    osc.frequency.exponentialRampToValueAtTime(60, t + 0.09);

    gain.gain.setValueAtTime(0.5, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.09);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(t);
    osc.stop(t + 0.1);
  }

  // Crunch sound when eating a Cornflake
  public playCornflakeCrunch() {
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;
    const t = this.ctx.currentTime;

    // Rapid dual frequency crunchy bursts
    for (let i = 0; i < 3; i++) {
      const dt = i * 0.04;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(800 + i * 350, t + dt);
      osc.frequency.exponentialRampToValueAtTime(200, t + dt + 0.04);

      gain.gain.setValueAtTime(0.3, t + dt);
      gain.gain.exponentialRampToValueAtTime(0.001, t + dt + 0.04);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(t + dt);
      osc.stop(t + dt + 0.05);
    }
  }

  // Splash sound when drinking Room Temp Water
  public playWaterSplash() {
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;
    const t = this.ctx.currentTime;

    // Resonant water bubble drops
    const freqs = [350, 480, 620, 800];
    freqs.forEach((freq, idx) => {
      if (!this.ctx || !this.sfxGain) return;
      const dt = idx * 0.05;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq * 0.8, t + dt);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.5, t + dt + 0.08);

      gain.gain.setValueAtTime(0.4, t + dt);
      gain.gain.exponentialRampToValueAtTime(0.001, t + dt + 0.1);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(t + dt);
      osc.stop(t + dt + 0.11);
    });
  }

  // Ice cube crunch and chill freeze chime
  public playIceFreeze() {
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;
    const t = this.ctx.currentTime;

    const notes = [659.25, 830.61, 987.77, 1318.51, 1661.22]; // E5, G#5, B5, E6, G#6 shimmering
    notes.forEach((f, idx) => {
      if (!this.ctx || !this.sfxGain) return;
      const dt = idx * 0.04;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, t + dt);

      gain.gain.setValueAtTime(0.35, t + dt);
      gain.gain.exponentialRampToValueAtTime(0.001, t + dt + 0.35);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(t + dt);
      osc.stop(t + dt + 0.36);
    });
  }

  // Megaphone "CALL NOW!" shockwave blast
  public playMegaphone() {
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;
    const t = this.ctx.currentTime;

    // Distorted megaphone siren horn
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(620, t);
    osc.frequency.linearRampToValueAtTime(880, t + 0.15);
    osc.frequency.exponentialRampToValueAtTime(220, t + 0.45);

    gain.gain.setValueAtTime(0.65, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.45);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(t);
    osc.stop(t + 0.46);

    // Low sub thud
    const sub = this.ctx.createOscillator();
    const subGain = this.ctx.createGain();
    sub.type = 'sine';
    sub.frequency.setValueAtTime(140, t);
    sub.frequency.exponentialRampToValueAtTime(40, t + 0.35);
    subGain.gain.setValueAtTime(0.7, t);
    subGain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);
    sub.connect(subGain);
    subGain.connect(this.sfxGain);
    sub.start(t);
    sub.stop(t + 0.36);
  }

  // Player gets hit by food
  public playDamage() {
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;
    const t = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(160, t);
    osc.frequency.exponentialRampToValueAtTime(50, t + 0.2);

    gain.gain.setValueAtTime(0.6, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.2);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(t);
    osc.stop(t + 0.21);
  }

  // Treat Day Gobble sound
  public playGobble() {
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;
    const t = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(320, t);
    osc.frequency.exponentialRampToValueAtTime(640, t + 0.06);

    gain.gain.setValueAtTime(0.4, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.08);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(t);
    osc.stop(t + 0.09);
  }

  // Day completed fanfare
  public playDayWin() {
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;
    const t = this.ctx.currentTime;

    const melody = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    melody.forEach((note, i) => {
      if (!this.ctx || !this.sfxGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(note, t + i * 0.1);

      gain.gain.setValueAtTime(0.35, t + i * 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, t + i * 0.1 + 0.25);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(t + i * 0.1);
      osc.stop(t + i * 0.1 + 0.26);
    });
  }

  // Glorious Sunday Treat Day Brass Fanfare
  public playTreatDayFanfare() {
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;
    const t = this.ctx.currentTime;

    // Brassy triumphant horns chords
    const chord1 = [261.63, 329.63, 392.0]; // C4 chord
    const chord2 = [349.23, 440.0, 523.25]; // F4 chord
    const chord3 = [392.0, 493.88, 587.33]; // G4 chord
    const chord4 = [523.25, 659.25, 783.99, 1046.5]; // High C chord

    const chords = [
      { notes: chord1, start: 0, dur: 0.18 },
      { notes: chord1, start: 0.2, dur: 0.18 },
      { notes: chord2, start: 0.4, dur: 0.25 },
      { notes: chord3, start: 0.7, dur: 0.25 },
      { notes: chord4, start: 1.0, dur: 0.7 },
    ];

    chords.forEach(({ notes, start, dur }) => {
      notes.forEach((f) => {
        if (!this.ctx || !this.sfxGain) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(f, t + start);

        gain.gain.setValueAtTime(0.2, t + start);
        gain.gain.exponentialRampToValueAtTime(0.001, t + start + dur);

        osc.connect(gain);
        gain.connect(this.sfxGain);

        osc.start(t + start);
        osc.stop(t + start + dur + 0.05);
      });
    });
  }

  // Game over wah wah
  public playGameOver() {
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;
    const t = this.ctx.currentTime;

    const notes = [392.0, 369.99, 349.23, 311.13];
    notes.forEach((n, idx) => {
      if (!this.ctx || !this.sfxGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(n, t + idx * 0.25);
      osc.frequency.exponentialRampToValueAtTime(n * 0.9, t + idx * 0.25 + 0.24);

      gain.gain.setValueAtTime(0.4, t + idx * 0.25);
      gain.gain.exponentialRampToValueAtTime(0.01, t + idx * 0.25 + 0.24);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(t + idx * 0.25);
      osc.stop(t + idx * 0.25 + 0.25);
    });
  }

  // --- Catchy British Commercial Jingle BGM Synthesizer ---
  public startBGM() {
    if (this.isBgmPlaying) return;
    this.initContext();
    this.isBgmPlaying = true;
    this.stepIndex = 0;

    // 130 BPM funky commercial jingle pattern
    const stepDurationMs = 125; // 16th notes at ~120 BPM

    // Bassline notes
    const bassline = [
      130.81, 0, 130.81, 164.81, 174.61, 0, 174.61, 196.0,
      130.81, 0, 130.81, 146.83, 164.81, 174.61, 196.0, 0
    ];

    // Cheerful organ melody
    const organLine = [
      523.25, 0, 659.25, 0, 783.99, 0, 659.25, 0,
      587.33, 0, 493.88, 0, 523.25, 0, 0, 0
    ];

    this.bgmIntervalId = window.setInterval(() => {
      if (!this.ctx || !this.bgmGain || this.isMuted) return;

      const t = this.ctx.currentTime;
      const step = this.stepIndex % 16;
      this.stepIndex++;

      // Play bass note
      const bassNote = bassline[step];
      if (bassNote > 0) {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(bassNote, t);

        gain.gain.setValueAtTime(0.25, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.15);

        osc.connect(gain);
        gain.connect(this.bgmGain);

        osc.start(t);
        osc.stop(t + 0.16);
      }

      // Play organ lead note
      const organNote = organLine[step];
      if (organNote > 0) {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(organNote, t);

        gain.gain.setValueAtTime(0.12, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.2);

        osc.connect(gain);
        gain.connect(this.bgmGain);

        osc.start(t);
        osc.stop(t + 0.21);
      }

      // Snappy hi-hat/percussion pulse on beats 2 and 4
      if (step % 4 === 2) {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(3500, t);
        gain.gain.setValueAtTime(0.04, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.04);
        osc.connect(gain);
        gain.connect(this.bgmGain);
        osc.start(t);
        osc.stop(t + 0.05);
      }
    }, stepDurationMs);
  }

  public stopBGM() {
    this.isBgmPlaying = false;
    if (this.bgmIntervalId !== null) {
      clearInterval(this.bgmIntervalId);
      this.bgmIntervalId = null;
    }
  }
}

export const sound = new SoundEngine();
