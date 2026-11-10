/**
 * In-Game HUD for GTA Karnataka: Namma Bengaluru
 * Complies with Game Craft guidelines: keeps 85%+ viewport unobstructed,
 * perimeter status clusters, tabular-nums readouts, radar minimap,
 * authentic digital fare meter, and wanted stars.
 */

import React from 'react';
import { Star, Shield, Heart, Zap, Radio, Phone, MapPin, Gauge } from 'lucide-react';
import { GameStateSnapshot } from '../game/GameEngine';

interface GameHUDProps {
  state: GameStateSnapshot;
  onOpenPhone: () => void;
  onOpenMap: () => void;
  onToggleVehicle: () => void;
  onHorn: () => void;
}

export const GameHUD: React.FC<GameHUDProps> = ({
  state,
  onOpenPhone,
  onOpenMap,
  onToggleVehicle,
  onHorn
}) => {
  return (
    <div className="absolute inset-0 pointer-events-none select-none z-10 flex flex-col justify-between p-4 md:p-6 overflow-hidden">
      {/* =========================================
          TOP PERIMETER: Wanted Stars, Cash, Dialogue
          ========================================= */}
      <div className="flex items-start justify-between gap-4">
        {/* District & Festival Banner */}
        <div className="flex flex-col gap-1.5 pointer-events-auto">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/75 border border-amber-500/40 text-white shadow-lg">
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: state.currentDistrict.accentColor }}
            />
            <div className="flex flex-col">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
                {state.currentDistrict.name}
              </span>
              <span className="text-[10px] text-white/70 font-sans">
                {state.currentDistrict.kannadaName}
              </span>
            </div>
          </div>

          {/* Active Cultural Festival Pill */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-red-950/80 border border-red-500/30 text-red-200 text-[10px] font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-yellow-400" />
            <span>FESTIVAL: {state.currentFestival}</span>
          </div>
        </div>

        {/* Top Center: Mission Dialogue Ticker */}
        {state.dialogueText && (
          <div className="max-w-md mx-auto px-4 py-2.5 rounded-xl bg-black/85 border-2 border-yellow-500/70 text-yellow-100 shadow-2xl pointer-events-auto transition-all">
            <p className="text-xs md:text-sm font-semibold leading-relaxed">
              {state.dialogueText}
            </p>
          </div>
        )}

        {/* Top Right: GTA Wanted Stars & Cash Cluster */}
        <div className="flex flex-col items-end gap-2 pointer-events-auto">
          {/* Wanted Stars (0 to 5) */}
          <div className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-black/80 border border-white/10 shadow-lg">
            {[1, 2, 3, 4, 5].map((starNum) => {
              const isActive = starNum <= state.wantedLevel;
              return (
                <Star
                  key={starNum}
                  className={`w-5 h-5 transition-all ${
                    isActive
                      ? 'fill-yellow-400 text-yellow-400 animate-bounce drop-shadow-[0_0_8px_rgba(250,204,21,0.8)]'
                      : 'text-gray-700 fill-gray-900/40'
                  }`}
                />
              );
            })}
          </div>

          {/* Cash Readout (Classic GTA Green) */}
          <div className="px-4 py-1.5 rounded-lg bg-black/85 border border-emerald-500/50 shadow-lg text-right">
            <span className="text-lg md:text-2xl font-black text-emerald-400 tabular-nums tracking-wide font-mono drop-shadow-[0_0_10px_rgba(52,211,153,0.5)]">
              ₹ {state.cash.toLocaleString('en-IN')}
            </span>
          </div>

          {/* Current Weapon Badge */}
          <div className="px-3 py-1 rounded-md bg-black/75 border border-white/15 text-white/90 text-xs font-mono">
            {state.currentWeapon}
          </div>
        </div>
      </div>

      {/* =========================================
          CENTER NOTIFICATIONS (Mission Banner)
          ========================================= */}
      {state.activeMissionTitle && (
        <div className="self-center pointer-events-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-950/90 via-black/90 to-red-950/90 border border-red-500/50 text-white shadow-2xl flex items-center gap-4">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
          <div>
            <div className="text-[10px] text-amber-400 font-bold uppercase tracking-widest">
              SYNDICATE MISSION OBJECTIVE
            </div>
            <div className="text-sm font-black text-white">
              {state.activeMissionTitle}
            </div>
          </div>
          {state.missionTimeRemaining > 0 && (
            <div className="px-2.5 py-1 rounded bg-red-600/30 border border-red-500/40 text-amber-300 font-mono text-sm font-bold tabular-nums">
              {Math.floor(state.missionTimeRemaining / 60)}:
              {String(state.missionTimeRemaining % 60).padStart(2, '0')}
            </div>
          )}
        </div>
      )}

      {/* =========================================
          BOTTOM PERIMETER: Minimap Radar, Speedometer, Fare Meter
          ========================================= */}
      <div className="flex items-end justify-between gap-4">
        {/* Bottom Left: Circular Minimap Radar & Health/Armor */}
        <div className="flex flex-col gap-2 pointer-events-auto">
          {/* Circular Radar Canvas */}
          <div className="relative w-32 h-32 md:w-36 md:h-36 rounded-full border-2 border-amber-500/60 bg-black/85 shadow-2xl overflow-hidden flex items-center justify-center">
            {/* Grid concentric rings */}
            <div className="absolute inset-2 rounded-full border border-white/15" />
            <div className="absolute inset-8 rounded-full border border-white/10" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-full h-[1px] bg-white/10" />
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-full w-[1px] bg-white/10" />
            </div>

            {/* Radar Center (Player) */}
            <div className="relative z-10 w-3 h-3 rounded-full bg-amber-400 border border-black shadow-[0_0_8px_rgba(250,204,21,1)]" />

            {/* Compass Heading North */}
            <div className="absolute top-1 text-[9px] font-black text-red-500 font-mono">
              N
            </div>
            {/* Coords */}
            <div className="absolute bottom-1 text-[8px] font-mono text-white/50">
              {state.playerCoords.x},{state.playerCoords.z}
            </div>
          </div>

          {/* Health & Armor Bars */}
          <div className="w-32 md:w-36 flex flex-col gap-1 bg-black/80 p-2 rounded-lg border border-white/10">
            {/* Health Bar (Green) */}
            <div className="flex items-center gap-1.5">
              <Heart className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400 shrink-0" />
              <div className="flex-1 h-2 rounded bg-black/60 overflow-hidden border border-emerald-950">
                <div
                  className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 transition-all duration-150"
                  style={{ width: `${state.health}%` }}
                />
              </div>
              <span className="text-[10px] text-emerald-400 font-mono tabular-nums w-6 text-right">
                {state.health}
              </span>
            </div>

            {/* Armor Bar (Blue) */}
            <div className="flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-sky-400 fill-sky-400 shrink-0" />
              <div className="flex-1 h-2 rounded bg-black/60 overflow-hidden border border-sky-950">
                <div
                  className="h-full bg-gradient-to-r from-sky-600 to-sky-400 transition-all duration-150"
                  style={{ width: `${state.armor}%` }}
                />
              </div>
              <span className="text-[10px] text-sky-400 font-mono tabular-nums w-6 text-right">
                {state.armor}
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Center: Quick Interactive HUD Action Buttons */}
        <div className="flex items-center gap-2 pointer-events-auto bg-black/75 p-1.5 rounded-xl border border-white/15">
          <button
            onClick={onOpenPhone}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/40 border border-amber-500/40 text-amber-300 text-xs font-bold transition-all cursor-pointer"
            title="Open Namma Phone (P)"
          >
            <Phone className="w-4 h-4" />
            <span className="hidden sm:inline">PHONE (P)</span>
          </button>

          <button
            onClick={onOpenMap}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold transition-all cursor-pointer"
            title="Open Map & Intel (M)"
          >
            <MapPin className="w-4 h-4 text-emerald-400" />
            <span className="hidden sm:inline">MAP (M)</span>
          </button>

          <button
            onClick={onToggleVehicle}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold transition-all cursor-pointer"
            title="Enter / Exit Vehicle (F / Enter)"
          >
            <span className="px-1.5 py-0.5 rounded bg-amber-500/30 text-amber-300 text-[10px] font-mono">F</span>
            <span>{state.isInVehicle ? 'EXIT' : 'ENTER'}</span>
          </button>

          {state.isInVehicle && (
            <button
              onClick={onHorn}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-yellow-500/20 hover:bg-yellow-500/40 border border-yellow-500/40 text-yellow-300 text-xs font-bold transition-all cursor-pointer"
              title="Honk Horn (H)"
            >
              <span>HORN (H)</span>
            </button>
          )}
        </div>

        {/* Bottom Right: Speedometer & Auto Fare Meter Cluster */}
        <div className="flex flex-col items-end gap-2 pointer-events-auto">
          {/* Radio Station Toast */}
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-black/75 border border-white/10 text-white/80 text-[11px] font-mono">
            <Radio className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span>{state.radioStation}</span>
            <span className="text-[9px] text-white/40 ml-1">(R)</span>
          </div>

          {/* Authentic Bangalore Auto-Rickshaw Digital LED Fare Meter */}
          {state.isInVehicle && state.vehicleType.includes('Auto') && (
            <div className="p-2.5 rounded-lg bg-black/90 border-2 border-green-600/60 shadow-xl flex flex-col gap-1 w-44">
              <div className="flex items-center justify-between text-[10px] text-green-400 font-bold uppercase tracking-wider">
                <span>NAMMA FARE METER</span>
                <span className="text-[8px] bg-green-950 px-1 rounded text-green-300">₹30 BASE</span>
              </div>
              <div className="text-xl font-mono font-black text-green-400 tabular-nums drop-shadow-[0_0_8px_rgba(74,222,128,0.7)] flex justify-between items-baseline">
                <span>₹ {state.autoMeterAmount.toFixed(2)}</span>
                <span className="text-xs text-green-300/80">{state.autoDistanceKm} KM</span>
              </div>
            </div>
          )}

          {/* Speedometer & Nitro */}
          {state.isInVehicle && (
            <div className="flex items-center gap-3 p-3 rounded-xl bg-black/85 border border-white/15 shadow-2xl">
              {/* Nitro Bar */}
              <div className="flex flex-col items-center gap-1">
                <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                <div className="w-2.5 h-12 bg-black/60 rounded-full overflow-hidden border border-amber-950 flex flex-col justify-end">
                  <div
                    className="w-full bg-gradient-to-t from-red-500 to-amber-400 transition-all duration-100"
                    style={{ height: `${state.nitroFuel}%` }}
                  />
                </div>
              </div>

              {/* Speed Digits */}
              <div className="flex flex-col items-end">
                <span className="text-3xl font-black font-mono text-white tabular-nums drop-shadow-md">
                  {state.vehicleSpeedKmh}
                </span>
                <span className="text-[10px] font-bold text-white/60 tracking-wider">
                  KM/H · {state.vehicleType.toUpperCase()}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
