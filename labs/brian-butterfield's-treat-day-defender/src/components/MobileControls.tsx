import React, { useRef, useState } from 'react';
import { Megaphone, Hand } from 'lucide-react';

interface MobileControlsProps {
  onJoystickMove: (dx: number, dy: number) => void;
  onSwat: () => void;
  onMegaphone: () => void;
  megaphoneReady: boolean;
}

export const MobileControls: React.FC<MobileControlsProps> = ({
  onJoystickMove,
  onSwat,
  onMegaphone,
  megaphoneReady,
}) => {
  const joystickRef = useRef<HTMLDivElement>(null);
  const [knobPos, setKnobPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const touchIdRef = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.changedTouches[0];
    touchIdRef.current = touch.identifier;
    updateJoystick(touch.clientX, touch.clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    for (let i = 0; i < e.changedTouches.length; i++) {
      const touch = e.changedTouches[i];
      if (touch.identifier === touchIdRef.current) {
        updateJoystick(touch.clientX, touch.clientY);
        break;
      }
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    for (let i = 0; i < e.changedTouches.length; i++) {
      const touch = e.changedTouches[i];
      if (touch.identifier === touchIdRef.current) {
        touchIdRef.current = null;
        setKnobPos({ x: 0, y: 0 });
        onJoystickMove(0, 0);
        break;
      }
    }
  };

  const updateJoystick = (clientX: number, clientY: number) => {
    if (!joystickRef.current) return;
    const rect = joystickRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const dx = clientX - centerX;
    const dy = clientY - centerY;
    const maxRadius = rect.width / 2;
    const dist = Math.hypot(dx, dy);

    if (dist <= maxRadius) {
      setKnobPos({ x: dx, y: dy });
      onJoystickMove(dx / maxRadius, dy / maxRadius);
    } else {
      const clampedX = (dx / dist) * maxRadius;
      const clampedY = (dy / dist) * maxRadius;
      setKnobPos({ x: clampedX, y: clampedY });
      onJoystickMove(clampedX / maxRadius, clampedY / maxRadius);
    }
  };

  return (
    <div className="sm:hidden absolute inset-x-0 bottom-4 pointer-events-none px-6 flex items-end justify-between z-20">
      {/* Virtual Joystick */}
      <div
        ref={joystickRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className="w-28 h-28 rounded-full bg-slate-900/70 border-2 border-slate-700/80 pointer-events-auto relative flex items-center justify-center backdrop-blur-sm touch-none"
      >
        <div
          className="w-12 h-12 rounded-full bg-amber-500/90 shadow-md transform pointer-events-none"
          style={{ transform: `translate(${knobPos.x}px, ${knobPos.y}px)` }}
        />
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-3 pointer-events-auto">
        {/* Megaphone Button */}
        <button
          onTouchStart={(e) => {
            e.preventDefault();
            onMegaphone();
          }}
          className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-transform active:scale-90 ${
            megaphoneReady
              ? 'bg-amber-500 text-slate-950 animate-pulse'
              : 'bg-slate-800 text-slate-500 border border-slate-700'
          }`}
        >
          <Megaphone className="w-6 h-6" />
        </button>

        {/* Primary Swat Button */}
        <button
          onTouchStart={(e) => {
            e.preventDefault();
            onSwat();
          }}
          className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-400 text-slate-950 flex items-center justify-center shadow-xl transition-transform active:scale-90"
        >
          <Hand className="w-7 h-7" />
        </button>
      </div>
    </div>
  );
};
