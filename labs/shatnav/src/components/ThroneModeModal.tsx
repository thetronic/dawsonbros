import React, { useState, useEffect } from 'react';
import { ActiveBooking } from '../types';
import {
  Volume2,
  VolumeX,
  Droplets,
  RotateCcw,
  Sparkles,
  MessageSquare,
  Send,
  CheckCircle2,
  AlertTriangle,
  Radio,
  Clock,
} from 'lucide-react';
import { soundManager } from '../utils/audio';

interface ThroneModeModalProps {
  booking: ActiveBooking;
  onFinishSession: () => void;
}

export const ThroneModeModal: React.FC<ThroneModeModalProps> = ({
  booking,
  onFinishSession,
}) => {
  const [secondsLeft, setSecondsLeft] = useState(booking.allocatedMinutes * 60);
  const [flushCount, setFlushCount] = useState(booking.courtesyFlushes || 0);
  const [isSoundBarrierOn, setIsSoundBarrierOn] = useState(false);
  const [soundType, setSoundType] = useState<'water' | 'rain' | 'whitenoise'>('water');
  const [intercomInput, setIntercomInput] = useState('');
  const [messages, setMessages] = useState(booking.intercomMessages);
  const [isFlushing, setIsFlushing] = useState(false);

  // Timer countdown
  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Format MM:SS
  const mins = Math.floor(secondsLeft / 60);
  const secs = secondsLeft % 60;
  const timeFormatted = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

  // Flush action
  const handleFlush = () => {
    setIsFlushing(true);
    soundManager.playFlushSound();
    setFlushCount((prev) => prev + 1);
    setTimeout(() => {
      setIsFlushing(false);
    }, 2200);
  };

  // Sound barrier toggle
  const toggleSoundBarrier = (type?: 'water' | 'rain' | 'whitenoise') => {
    const nextType = type || soundType;
    if (isSoundBarrierOn && (!type || type === soundType)) {
      soundManager.stopSoundBarrier();
      setIsSoundBarrierOn(false);
    } else {
      setSoundType(nextType);
      soundManager.startSoundBarrier(nextType, 0.35);
      setIsSoundBarrierOn(true);
    }
  };

  // Clean up sound barrier when leaving
  useEffect(() => {
    return () => {
      soundManager.stopSoundBarrier();
    };
  }, []);

  // Send intercom message to host
  const handleSendMessage = (textToSend?: string) => {
    const text = textToSend || intercomInput.trim();
    if (!text) return;

    const newMsg = {
      sender: 'guest' as const,
      text,
      time: 'Just now',
    };
    setMessages((prev) => [...prev, newMsg]);
    setIntercomInput('');

    // Automated simulated helpful host reply
    setTimeout(() => {
      let replyText = "No worries at all! Let me know if you need anything else.";
      if (text.toLowerCase().includes('paper') || text.toLowerCase().includes('roll')) {
        replyText = "Extra 4-ply rolls are right in the wicker basket under the vanity sink!";
      } else if (text.toLowerCase().includes('fan') || text.toLowerCase().includes('switch')) {
        replyText = "The extractor fan switch is on the left wall right next to the towel rail!";
      } else if (text.toLowerCase().includes('lock') || text.toLowerCase().includes('door')) {
        replyText = "Turn the silver deadbolt counter-clockwise to lock securely from inside.";
      } else if (text.toLowerCase().includes('smell') || text.toLowerCase().includes('clean')) {
        replyText = "Thank you so much! Always keep it spotless for guests.";
      }

      setMessages((prev) => [
        ...prev,
        {
          sender: 'host',
          text: replyText,
          time: 'Just now',
        },
      ]);
      soundManager.playChimeSound();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-lg bg-slate-900 border border-amber-500/50 rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[94vh] flex flex-col text-slate-100 ring-2 ring-amber-500/20">
        {/* Throne HUD Header */}
        <div className="p-4 bg-gradient-to-r from-slate-900 via-amber-950/40 to-slate-900 border-b border-amber-500/30 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-xl">
              🚽
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-sm text-white">Throne Mode Active</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {booking.serviceType === 'wee' ? 'Wee Session' : 'Full Throne Session'}
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Host: {booking.hostName}</p>
            </div>
          </div>

          {/* Session Timer */}
          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Time Left</span>
            <span
              className={`font-mono text-xl font-black ${
                secondsLeft < 120 ? 'text-rose-400 animate-pulse' : 'text-amber-400'
              }`}
            >
              {timeFormatted}
            </span>
          </div>
        </div>

        {/* Scrollable controls */}
        <div className="p-5 overflow-y-auto space-y-5">
          {/* 1. Big Interactive Courtesy Flush Handle */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-800/90 to-slate-900 border border-slate-700/80 text-center space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
              Porcelain Etiquette
            </span>

            <button
              disabled={isFlushing}
              onClick={handleFlush}
              className={`relative mx-auto px-8 py-3.5 rounded-2xl font-black text-sm tracking-wide transition-all shadow-xl flex items-center justify-center gap-2 active:scale-95 ${
                isFlushing
                  ? 'bg-sky-600 text-white animate-pulse'
                  : 'bg-gradient-to-r from-sky-500 via-cyan-400 to-sky-500 hover:from-sky-400 hover:to-cyan-300 text-slate-950 shadow-sky-500/25'
              }`}
            >
              <Droplets className={`w-5 h-5 ${isFlushing ? 'animate-spin' : ''}`} />
              <span>{isFlushing ? 'Flushing Porcelain...' : 'Trigger Courtesy Flush'}</span>
            </button>

            <div className="flex items-center justify-center gap-2 text-xs text-slate-400 pt-1">
              <span>Flushes logged:</span>
              <span className="font-mono font-bold text-amber-400">{flushCount}</span>
              <span className="text-slate-500">•</span>
              <span className="text-emerald-400 font-semibold">Dual-flush eco calibrated</span>
            </div>
          </div>

          {/* 2. Courtesy Sound Barrier (Audio privacy so nobody outside hears anything!) */}
          <div className="p-4 rounded-2xl bg-slate-800/70 border border-slate-700/80 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center gap-1.5">
                  <Radio className="w-4 h-4 text-amber-400" />
                  <span>Courtesy Sound Barrier</span>
                </h4>
                <p className="text-[11px] text-slate-400">
                  Drowns out bathroom noises so the host hears nothing
                </p>
              </div>

              <button
                onClick={() => toggleSoundBarrier()}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
                  isSoundBarrierOn
                    ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/30'
                    : 'bg-slate-700 text-slate-300 hover:text-white'
                }`}
              >
                {isSoundBarrierOn ? (
                  <>
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>Active</span>
                  </>
                ) : (
                  <>
                    <VolumeX className="w-3.5 h-3.5" />
                    <span>Muted</span>
                  </>
                )}
              </button>
            </div>

            {/* Sound Profile Buttons */}
            <div className="grid grid-cols-3 gap-2 text-xs">
              <button
                type="button"
                onClick={() => toggleSoundBarrier('water')}
                className={`p-2 rounded-xl border text-center transition ${
                  isSoundBarrierOn && soundType === 'water'
                    ? 'bg-sky-500/20 border-sky-400 text-sky-200'
                    : 'bg-slate-900/60 border-slate-700 text-slate-400'
                }`}
              >
                <span className="text-base block mb-0.5">🌊</span>
                <span className="font-bold text-[11px] block">Running Sink</span>
              </button>

              <button
                type="button"
                onClick={() => toggleSoundBarrier('rain')}
                className={`p-2 rounded-xl border text-center transition ${
                  isSoundBarrierOn && soundType === 'rain'
                    ? 'bg-indigo-500/20 border-indigo-400 text-indigo-200'
                    : 'bg-slate-900/60 border-slate-700 text-slate-400'
                }`}
              >
                <span className="text-base block mb-0.5">🌧️</span>
                <span className="font-bold text-[11px] block">Heavy Rain</span>
              </button>

              <button
                type="button"
                onClick={() => toggleSoundBarrier('whitenoise')}
                className={`p-2 rounded-xl border text-center transition ${
                  isSoundBarrierOn && soundType === 'whitenoise'
                    ? 'bg-amber-500/20 border-amber-400 text-amber-200'
                    : 'bg-slate-900/60 border-slate-700 text-slate-400'
                }`}
              >
                <span className="text-base block mb-0.5">📻</span>
                <span className="font-bold text-[11px] block">Pink Noise</span>
              </button>
            </div>
          </div>

          {/* 3. Host Discreet Intercom */}
          <div className="p-4 rounded-2xl bg-slate-800/70 border border-slate-700/80 space-y-2.5">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-amber-400" />
                <span>Discreet Host Intercom</span>
              </h4>
              <span className="text-[10px] text-emerald-400 font-semibold">● Host Online</span>
            </div>

            {/* Message thread */}
            <div className="h-24 overflow-y-auto space-y-1.5 p-2 rounded-xl bg-slate-900/80 border border-slate-800 text-xs">
              {messages.map((m, idx) => (
                <div
                  key={idx}
                  className={`flex flex-col ${
                    m.sender === 'guest' ? 'items-end' : 'items-start'
                  }`}
                >
                  <div
                    className={`max-w-[85%] px-2.5 py-1.5 rounded-xl text-[11px] ${
                      m.sender === 'guest'
                        ? 'bg-amber-500/20 text-amber-200 border border-amber-500/30'
                        : 'bg-slate-800 text-slate-200 border border-slate-700'
                    }`}
                  >
                    <span className="font-bold text-[10px] text-slate-400 block">
                      {m.sender === 'guest' ? 'You' : booking.hostName}:
                    </span>
                    {m.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Quick pre-made chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto text-[10px]">
              <button
                type="button"
                onClick={() => handleSendMessage('Where is extra toilet paper?')}
                className="px-2 py-1 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 hover:text-white whitespace-nowrap"
              >
                🧻 Need extra roll
              </button>
              <button
                type="button"
                onClick={() => handleSendMessage('Where is the fan switch?')}
                className="px-2 py-1 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 hover:text-white whitespace-nowrap"
              >
                💨 Extractor fan switch?
              </button>
              <button
                type="button"
                onClick={() => handleSendMessage('Smells lovely in here!')}
                className="px-2 py-1 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 hover:text-white whitespace-nowrap"
              >
                🌸 Smells great
              </button>
            </div>

            {/* Custom input */}
            <div className="flex items-center gap-1.5">
              <input
                type="text"
                placeholder="Ask host quietly..."
                value={intercomInput}
                onChange={(e) => setIntercomInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
              />
              <button
                onClick={() => handleSendMessage()}
                className="p-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Footer: Done & Wash Hands button */}
        <div className="p-4 bg-slate-900 border-t border-slate-800 sticky bottom-0 z-10">
          <button
            onClick={() => {
              soundManager.stopSoundBarrier();
              onFinishSession();
            }}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-sm tracking-wide shadow-xl shadow-emerald-500/25 transition-all flex items-center justify-center gap-2 active:scale-95"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Finished, Hands Washed & Check Out</span>
          </button>
        </div>
      </div>
    </div>
  );
};
