/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';
import { GameEngine } from './game/GameEngine';
import { GameMode, GameState, GameStats } from './types';
import { HUD } from './components/HUD';
import { TitleScreen } from './components/TitleScreen';
import { GameOverModal } from './components/GameOverModal';
import { DayCompleteModal } from './components/DayCompleteModal';
import { VictoryModal } from './components/VictoryModal';
import { PauseModal } from './components/PauseModal';
import { MobileControls } from './components/MobileControls';
import { sound } from './audio/soundEngine';

export default function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<GameEngine | null>(null);

  const [gameState, setGameState] = useState<GameState>('title');
  const [stats, setStats] = useState<GameStats>({
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
  });

  const [willpower, setWillpower] = useState<number>(100);
  const [megaphoneCharge, setMegaphoneCharge] = useState<number>(100);
  const [shieldTime, setShieldTime] = useState<number>(0);
  const [iceAuraTime, setIceAuraTime] = useState<number>(0);
  const [speedBoostTime, setSpeedBoostTime] = useState<number>(0);
  const [isTreatDay, setIsTreatDay] = useState<boolean>(false);

  const [isMuted, setIsMuted] = useState<boolean>(sound.getIsMuted());
  const [isVoiceEnabled, setIsVoiceEnabled] = useState<boolean>(sound.getIsVoiceEnabled());

  useEffect(() => {
    if (!canvasRef.current) return;

    const engine = new GameEngine(
      canvasRef.current,
      (state) => {
        setGameState(state);
      },
      (newStats) => {
        setStats(newStats);
        // Extract player buffs for HUD
        const p = (engineRef.current as any)?.player;
        if (p) {
          setWillpower(p.willpower);
          setMegaphoneCharge(p.megaphoneCharge);
          setShieldTime(p.shieldTime);
          setIceAuraTime(p.iceAuraTime);
          setSpeedBoostTime(p.speedBoostTime);
          setIsTreatDay(p.isTreatDayFrenzy);
        }
      }
    );

    engineRef.current = engine;

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === 'Enter' || e.key === ' ') && gameState === 'title') {
        engine.startGame('story');
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      engine.destroy();
    };
  }, []);

  const handleStart = (mode: GameMode) => {
    engineRef.current?.startGame(mode);
  };

  const handleNextDay = () => {
    engineRef.current?.nextDay();
  };

  const handleRestart = () => {
    engineRef.current?.startGame('story');
  };

  const handleTitle = () => {
    setGameState('title');
    sound.stopBGM();
  };

  const handleTogglePause = () => {
    engineRef.current?.togglePause();
  };

  const handleToggleMute = () => {
    const muted = sound.toggleMute();
    setIsMuted(muted);
  };

  const handleToggleVoice = () => {
    const voiced = sound.toggleVoice();
    setIsVoiceEnabled(voiced);
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-slate-950 font-body select-none">
      {/* Isolated Canvas Container */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full block cursor-crosshair"
      />

      {/* Active Game HUD */}
      {gameState === 'playing' && (
        <HUD
          stats={stats}
          willpower={willpower}
          megaphoneCharge={megaphoneCharge}
          shieldTime={shieldTime}
          iceAuraTime={iceAuraTime}
          speedBoostTime={speedBoostTime}
          isTreatDay={isTreatDay}
          onPause={handleTogglePause}
          isMuted={isMuted}
          onToggleMute={handleToggleMute}
          isVoiceEnabled={isVoiceEnabled}
          onToggleVoice={handleToggleVoice}
        />
      )}

      {/* Touch Screen Mobile Virtual Controls */}
      {gameState === 'playing' && (
        <MobileControls
          onJoystickMove={(dx, dy) => engineRef.current?.setVirtualJoystick(dx, dy)}
          onSwat={() => engineRef.current?.triggerSwat()}
          onMegaphone={() => engineRef.current?.triggerMegaphone()}
          megaphoneReady={megaphoneCharge >= 100}
        />
      )}

      {/* Title Screen Overlay */}
      {gameState === 'title' && (
        <TitleScreen
          onStart={handleStart}
          highScore={stats.highScore}
          isMuted={isMuted}
          onToggleMute={handleToggleMute}
          isVoiceEnabled={isVoiceEnabled}
          onToggleVoice={handleToggleVoice}
        />
      )}

      {/* Day Complete Transition Modal */}
      {gameState === 'day_complete' && (
        <DayCompleteModal
          stats={stats}
          onNextDay={handleNextDay}
        />
      )}

      {/* Game Over Modal */}
      {gameState === 'game_over' && (
        <GameOverModal
          stats={stats}
          onRestart={handleRestart}
          onTitle={handleTitle}
        />
      )}

      {/* Sunday Treat Day Victory Modal */}
      {gameState === 'victory' && (
        <VictoryModal
          stats={stats}
          onRestart={handleRestart}
          onTitle={handleTitle}
        />
      )}

      {/* Pause Menu Modal */}
      {gameState === 'paused' && (
        <PauseModal
          onResume={handleTogglePause}
          onRestart={handleRestart}
          onTitle={handleTitle}
          isMuted={isMuted}
          onToggleMute={handleToggleMute}
          isVoiceEnabled={isVoiceEnabled}
          onToggleVoice={handleToggleVoice}
        />
      )}
    </div>
  );
}
