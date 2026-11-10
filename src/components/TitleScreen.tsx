/**
 * Atmospheric Title Screen for GTA Karnataka: Namma Bengaluru
 * Complies with Game Craft guidelines: full-viewport Game Shell,
 * live-world camera pan in background, bespoke inline SVG title lockup,
 * primary Start CTA (Enter/Space), and single flat control-hint line.
 */

import React from 'react';
import { Play, Volume2, VolumeX, Shield, Car, Compass } from 'lucide-react';
import { soundEngine } from '../audio/SoundEngine';

interface TitleScreenProps {
  onStartGame: () => void;
  onOpenControls: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

export const TitleScreen: React.FC<TitleScreenProps> = ({
  onStartGame,
  onOpenControls,
  isMuted,
  onToggleMute
}) => {
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Enter' || e.code === 'Space') {
        onStartGame();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onStartGame]);

  return (
    <div className="absolute inset-0 z-20 flex flex-col justify-between p-8 pointer-events-none select-none bg-gradient-to-t from-black/80 via-transparent to-black/40">
      {/* Top Bar / District Badge */}
      <div className="flex items-center justify-between pointer-events-auto">
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/60 border border-yellow-500/40 text-yellow-400 text-xs font-semibold tracking-wider uppercase backdrop-blur-none">
          <span className="w-2 h-2 rounded-full bg-red-600" />
          <span>NAMMA BENGALURU OPEN WORLD · 1956 - 2026</span>
        </div>

        <button
          onClick={onToggleMute}
          className="p-2.5 rounded-full bg-black/60 border border-white/20 text-white/80 hover:text-white hover:bg-black/80 transition-all cursor-pointer"
          title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
        >
          {isMuted ? <VolumeX className="w-5 h-5 text-red-400" /> : <Volume2 className="w-5 h-5 text-yellow-400" />}
        </button>
      </div>

      {/* Hero Centerpiece & Bespoke Title Lockup */}
      <div className="max-w-2xl mx-auto text-center pointer-events-auto">
        {/* Bespoke Inline SVG Title Lockup */}
        <div className="mb-4">
          <svg viewBox="0 0 680 140" className="w-full max-w-[620px] mx-auto filter drop-shadow-[0_10px_25px_rgba(0,0,0,0.9)]">
            <defs>
              <linearGradient id="karnatakaGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#FACC15" />
                <stop offset="50%" stopColor="#EA580C" />
                <stop offset="100%" stopColor="#DC2626" />
              </linearGradient>
              <linearGradient id="goldTrim" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#FEF08A" />
                <stop offset="50%" stopColor="#F59E0B" />
                <stop offset="100%" stopColor="#D97706" />
              </linearGradient>
            </defs>

            {/* Kannada Script Top Header */}
            <text
              x="340"
              y="32"
              textAnchor="middle"
              fill="#FEF08A"
              fontSize="20"
              fontWeight="900"
              letterSpacing="6"
              fontFamily="sans-serif"
            >
              ಕರ್ನಾಟಕ ಕ್ರೈಂ ಸಿಂಡಿಕೇಟ್
            </text>

            {/* Main GTA Bold Font Lockup */}
            <text
              x="340"
              y="95"
              textAnchor="middle"
              fill="url(#karnatakaGrad)"
              stroke="#000000"
              strokeWidth="7"
              fontSize="72"
              fontWeight="900"
              fontStyle="italic"
              letterSpacing="4"
              fontFamily="impact, sans-serif"
              paintOrder="stroke fill"
            >
              GTA KARNATAKA
            </text>

            {/* Sub-banner ribbon */}
            <text
              x="340"
              y="126"
              textAnchor="middle"
              fill="#FFFFFF"
              stroke="#000"
              strokeWidth="3"
              fontSize="18"
              fontWeight="800"
              letterSpacing="8"
              fontFamily="sans-serif"
            >
              NAMMA BENGALURU
            </text>
          </svg>
        </div>

        <p className="text-sm md:text-base text-amber-200/90 font-medium mb-6 drop-shadow-md">
          Explore iconic landmarks from Vidhana Soudha to Silk Board, master chaotic traffic with Auto-Rickshaws, and rule local crime syndicates.
        </p>

        {/* Start Button */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={onStartGame}
            className="flex items-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-yellow-500 via-amber-500 to-red-600 text-black font-extrabold text-lg tracking-wider uppercase shadow-[0_0_30px_rgba(245,158,11,0.5)] hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            <Play className="w-6 h-6 fill-black" />
            <span>ENTER NAMMA BENGALURU</span>
            <span className="text-xs px-2 py-0.5 rounded bg-black/20 text-black font-bold">ENTER / SPACE</span>
          </button>

          <button
            onClick={onOpenControls}
            className="flex items-center gap-2 px-5 py-3.5 rounded-xl bg-black/60 border border-white/20 text-white font-semibold text-sm hover:bg-black/80 transition-all cursor-pointer"
          >
            <Compass className="w-4 h-4 text-amber-400" />
            <span>MAP & GUIDE</span>
          </button>
        </div>
      </div>

      {/* Flat Control-Hint Line */}
      <div className="text-center text-xs text-white/70 font-mono tracking-wide py-2 bg-black/40 rounded-lg max-w-xl mx-auto border border-white/10">
        WASD Move · F Enter Vehicle · Space Handbrake/Jump · H Horn · M Map · P Phone · Esc Pause
      </div>
    </div>
  );
};
