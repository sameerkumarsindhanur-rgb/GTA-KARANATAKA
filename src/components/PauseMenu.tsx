/**
 * Pause Menu & Full Karnataka District Map Inspector for GTA Karnataka
 * Displays district boundaries, iconic landmarks, controls cheat sheet,
 * and audio settings.
 */

import React, { useState } from 'react';
import { X, Play, MapPin, Volume2, VolumeX, Keyboard } from 'lucide-react';
import { DISTRICTS, LANDMARKS } from '../game/constants';

interface PauseMenuProps {
  isOpen: boolean;
  onResume: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

export const PauseMenu: React.FC<PauseMenuProps> = ({
  isOpen,
  onResume,
  isMuted,
  onToggleMute
}) => {
  const [activeTab, setActiveTab] = useState<'map' | 'controls'>('map');
  const [selectedLandmark, setSelectedLandmark] = useState<string>('vidhana_soudha');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-black/80 backdrop-blur-none pointer-events-auto">
      <div className="w-full max-w-4xl h-[620px] bg-slate-900 border-2 border-amber-500/50 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-white">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-black/60 border-b border-white/10">
          <div className="flex items-center gap-3">
            <span className="w-3 h-3 rounded-full bg-red-600 animate-pulse" />
            <span className="text-lg font-black tracking-widest uppercase text-amber-400">
              GTA KARNATAKA · DISTRICT MAP & GUIDE
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onToggleMute}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all cursor-pointer text-white"
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? <VolumeX className="w-5 h-5 text-red-400" /> : <Volume2 className="w-5 h-5 text-yellow-400" />}
            </button>
            <button
              onClick={onResume}
              className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-sm uppercase transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Play className="w-4 h-4 fill-black" />
              <span>RESUME GAME</span>
            </button>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="flex border-b border-white/10 bg-black/30">
          <button
            onClick={() => setActiveTab('map')}
            className={`flex-1 py-3 text-xs md:text-sm font-bold tracking-wider uppercase transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'map'
                ? 'bg-amber-500/20 text-amber-400 border-b-2 border-amber-400'
                : 'text-white/60 hover:text-white'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>Open-World District Map</span>
          </button>
          <button
            onClick={() => setActiveTab('controls')}
            className={`flex-1 py-3 text-xs md:text-sm font-bold tracking-wider uppercase transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'controls'
                ? 'bg-amber-500/20 text-amber-400 border-b-2 border-amber-400'
                : 'text-white/60 hover:text-white'
            }`}
          >
            <Keyboard className="w-4 h-4" />
            <span>Controls & Mechanics</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'map' ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Visual Map Representation */}
              <div className="md:col-span-2 relative h-[360px] bg-slate-950 rounded-xl border border-white/15 overflow-hidden p-4 flex flex-col justify-between">
                {/* Background Roads Grid */}
                <div className="absolute inset-0 opacity-20 pointer-events-none">
                  <div className="w-full h-8 bg-white/20 absolute top-1/2 -translate-y-1/2" />
                  <div className="h-full w-8 bg-white/20 absolute left-1/2 -translate-x-1/2" />
                  <div className="w-full h-8 bg-white/20 absolute top-1/4 rotate-12" />
                </div>

                <div className="relative z-10 flex items-center justify-between text-xs text-white/50 font-mono">
                  <span>NORTH BENGALURU</span>
                  <span>ELEVATION: 920M</span>
                </div>

                {/* Landmarks Markers */}
                <div className="relative z-10 grid grid-cols-2 sm:grid-cols-3 gap-3 my-auto">
                  {LANDMARKS.map((lm) => {
                    const isSelected = selectedLandmark === lm.id;
                    return (
                      <button
                        key={lm.id}
                        onClick={() => setSelectedLandmark(lm.id)}
                        className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-amber-500/30 border-amber-400 text-amber-300 shadow-md'
                            : 'bg-black/60 border-white/10 text-white/80 hover:bg-black/90'
                        }`}
                      >
                        <div className="text-xs font-bold truncate">{lm.name}</div>
                        <div className="text-[10px] text-white/50 truncate">{lm.kannadaName}</div>
                      </button>
                    );
                  })}
                </div>

                <div className="relative z-10 flex items-center justify-between text-xs text-white/50 font-mono">
                  <span>SOUTH BENGALURU (LALBAGH)</span>
                  <span>SILK BOARD CORRIDOR</span>
                </div>
              </div>

              {/* Landmark Details Panel */}
              <div className="space-y-4">
                {(() => {
                  const lm = LANDMARKS.find((l) => l.id === selectedLandmark) || LANDMARKS[0];
                  return (
                    <div className="p-4 rounded-xl bg-slate-800/80 border border-white/10 space-y-2">
                      <div className="text-xs font-bold text-amber-400 uppercase tracking-widest">
                        LANDMARK INTEL
                      </div>
                      <div className="text-base font-black text-white">{lm.name}</div>
                      <div className="text-xs text-amber-300 font-sans">{lm.kannadaName}</div>
                      <p className="text-xs text-white/70 leading-relaxed pt-2">
                        {lm.description}
                      </p>
                      <div className="text-[11px] text-emerald-400 font-mono pt-2">
                        District: {lm.district.replace('_', ' ').toUpperCase()}
                      </div>
                    </div>
                  );
                })()}

                {/* District Overview */}
                <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-2">
                  <div className="text-xs font-bold text-white/70 uppercase">DISTRICTS OVERVIEW</div>
                  <div className="space-y-1.5 text-xs text-white/80">
                    {DISTRICTS.map((d) => (
                      <div key={d.id} className="flex items-center justify-between py-1 border-b border-white/5">
                        <span className="font-semibold">{d.name}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-white/10 font-mono uppercase">
                          {d.trafficDensity}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* CONTROLS GUIDE */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-800/80 border border-white/10 space-y-3">
                <div className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                  ON FOOT CONTROLS
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span className="text-white/70">Move Forward / Backward / Turn</span>
                    <span className="font-mono text-amber-300 font-bold">W, A, S, D / Arrow Keys</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span className="text-white/70">Sprint Run</span>
                    <span className="font-mono text-amber-300 font-bold">Shift</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span className="text-white/70">Jump</span>
                    <span className="font-mono text-amber-300 font-bold">Space</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span className="text-white/70">Melee Attack / Fire Weapon</span>
                    <span className="font-mono text-amber-300 font-bold">Ctrl / Left Click</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span className="text-white/70">Enter / Hijack Nearest Vehicle</span>
                    <span className="font-mono text-amber-300 font-bold">F / Enter</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span className="text-white/70">Cycle Weapons (Bat, Slingshot, Pistol)</span>
                    <span className="font-mono text-amber-300 font-bold">1, 2, 3, 4</span>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-800/80 border border-white/10 space-y-3">
                <div className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                  VEHICLE CONTROLS (AUTO / BIKE / BUS)
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span className="text-white/70">Accelerate / Reverse</span>
                    <span className="font-mono text-amber-300 font-bold">W / S</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span className="text-white/70">Steer Left / Right</span>
                    <span className="font-mono text-amber-300 font-bold">A / D</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span className="text-white/70">Handbrake Drift (Tuk-Tuk Slide!)</span>
                    <span className="font-mono text-amber-300 font-bold">Space</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span className="text-white/70">Nitro Turbo Boost</span>
                    <span className="font-mono text-amber-300 font-bold">Hold Shift</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span className="text-white/70">Honk Horn (Scares Traffic!)</span>
                    <span className="font-mono text-amber-300 font-bold">H / Ctrl</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span className="text-white/70">Cycle Bengaluru Radio Stations</span>
                    <span className="font-mono text-amber-300 font-bold">R</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span className="text-white/70">Open Smartphone / Syndicate Contracts</span>
                    <span className="font-mono text-amber-300 font-bold">P</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
