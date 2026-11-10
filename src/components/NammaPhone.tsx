/**
 * Interactive In-Game Smartphone ("Namma Phone") for GTA Karnataka
 * Allows triggering syndicate missions, switching radio stations,
 * calling vehicle deliveries, and launching cultural festivals.
 */

import React, { useState } from 'react';
import {
  X,
  Radio,
  Car,
  Briefcase,
  Sparkles,
  ShieldAlert,
  Flame,
  CheckCircle,
  Play,
  Volume2
} from 'lucide-react';
import { MISSIONS, CRIME_SYNDICATES, FESTIVALS, VEHICLE_SPECS } from '../game/constants';
import { soundEngine } from '../audio/SoundEngine';

interface NammaPhoneProps {
  isOpen: boolean;
  onClose: () => void;
  onStartMission: (missionId: string) => void;
  onSpawnVehicle: (type: 'auto' | 'bike' | 'bus' | 'hoysala' | 'taxi' | 'supercar') => void;
  onSelectFestival: (festivalId: string) => void;
  activeMissionId?: string;
}

type TabType = 'missions' | 'radio' | 'vehicles' | 'festivals' | 'intel';

export const NammaPhone: React.FC<NammaPhoneProps> = ({
  isOpen,
  onClose,
  onStartMission,
  onSpawnVehicle,
  onSelectFestival,
  activeMissionId
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('missions');
  const [selectedStation, setSelectedStation] = useState<number>(0);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-none pointer-events-auto">
      {/* Smartphone Outer Bezel */}
      <div className="relative w-full max-w-sm h-[580px] bg-slate-900 border-4 border-slate-700 rounded-[38px] shadow-[0_25px_60px_rgba(0,0,0,0.9)] flex flex-col overflow-hidden text-white">
        {/* Phone Notch & Status Bar */}
        <div className="flex items-center justify-between px-6 pt-3 pb-2 text-[11px] font-mono text-white/70 bg-black/40 border-b border-white/5">
          <span>9:45 AM</span>
          <div className="w-16 h-3.5 bg-black rounded-full mx-auto" />
          <span className="text-amber-400 font-bold">5G · AIRTEL</span>
        </div>

        {/* Header with App Title & Close */}
        <div className="flex items-center justify-between px-5 py-2.5 bg-black/50 border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
            <span className="text-sm font-extrabold tracking-wide uppercase text-amber-300">
              NAMMA PHONE
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full bg-white/10 hover:bg-white/20 transition-all cursor-pointer"
          >
            <X className="w-4 h-4 text-white/80" />
          </button>
        </div>

        {/* Phone App Content Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {/* TAB 1: MISSIONS */}
          {activeTab === 'missions' && (
            <div className="space-y-3">
              <div className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-1">
                AVAILABLE SYNDICATE CONTRACTS
              </div>
              {MISSIONS.map((m) => {
                const isSelected = activeMissionId === m.id;
                return (
                  <div
                    key={m.id}
                    className={`p-3.5 rounded-xl border transition-all ${
                      isSelected
                        ? 'bg-amber-950/80 border-amber-500 shadow-md'
                        : 'bg-slate-800/80 border-white/10 hover:border-white/25'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <span className="font-bold text-sm text-white">{m.title}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-900/60 border border-emerald-500/40 text-emerald-300 font-mono font-bold">
                        ₹ {m.rewardCash}
                      </span>
                    </div>
                    <div className="text-[10px] text-amber-200/80 font-sans mb-1.5">
                      {m.kannadaTitle}
                    </div>
                    <p className="text-xs text-white/70 mb-3 leading-relaxed">
                      {m.description}
                    </p>
                    <button
                      onClick={() => {
                        onStartMission(m.id);
                        onClose();
                      }}
                      className="w-full py-2 rounded-lg bg-gradient-to-r from-amber-500 to-red-600 text-black font-extrabold text-xs uppercase tracking-wider hover:opacity-95 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <Play className="w-3.5 h-3.5 fill-black" />
                      <span>{isSelected ? 'RESTART MISSION' : 'ACCEPT CONTRACT'}</span>
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {/* TAB 2: RADIO PLAYER */}
          {activeTab === 'radio' && (
            <div className="space-y-3">
              <div className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-1">
                BENGALURU FM TUNER
              </div>
              {soundEngine.stations.map((st, idx) => (
                <button
                  key={st.name}
                  onClick={() => {
                    setSelectedStation(idx);
                    soundEngine.setStation(idx);
                  }}
                  className={`w-full p-3.5 rounded-xl border flex items-center justify-between text-left transition-all cursor-pointer ${
                    selectedStation === idx
                      ? 'bg-amber-600/30 border-amber-500 text-amber-300'
                      : 'bg-slate-800/80 border-white/10 text-white/80 hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Radio className="w-5 h-5 text-amber-400 shrink-0" />
                    <div>
                      <div className="text-xs font-bold">{st.name}</div>
                      <div className="text-[10px] text-white/50 uppercase">{st.genre}</div>
                    </div>
                  </div>
                  {selectedStation === idx && (
                    <Volume2 className="w-4 h-4 text-amber-400 animate-pulse" />
                  )}
                </button>
              ))}
            </div>
          )}

          {/* TAB 3: VEHICLE DELIVERY */}
          {activeTab === 'vehicles' && (
            <div className="space-y-3">
              <div className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-1">
                INSTANT VEHICLE DISPATCH
              </div>
              {Object.values(VEHICLE_SPECS).map((v) => (
                <div
                  key={v.id}
                  className="p-3 rounded-xl bg-slate-800/80 border border-white/10 flex items-center justify-between gap-2"
                >
                  <div className="flex-1">
                    <div className="text-xs font-bold text-white">{v.name}</div>
                    <div className="text-[10px] text-amber-300/80">{v.specialTrait}</div>
                  </div>
                  <button
                    onClick={() => {
                      onSpawnVehicle(v.id as 'auto' | 'bike' | 'bus' | 'hoysala' | 'taxi' | 'supercar');
                      onClose();
                    }}
                    className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs uppercase transition-all cursor-pointer"
                  >
                    DISPATCH
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* TAB 4: CULTURAL FESTIVALS */}
          {activeTab === 'festivals' && (
            <div className="space-y-3">
              <div className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-1">
                KARNATAKA CULTURAL CELEBRATIONS
              </div>
              {FESTIVALS.map((fest) => (
                <div
                  key={fest.id}
                  className="p-3.5 rounded-xl bg-slate-800/80 border border-white/10 space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-white">{fest.name}</span>
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: fest.bannerColor }}
                    />
                  </div>
                  <div className="text-[10px] text-amber-300 font-sans">{fest.kannadaName}</div>
                  <p className="text-[11px] text-white/70 leading-relaxed">{fest.description}</p>
                  <div className="text-[10px] text-emerald-400 font-mono">Perk: {fest.perks}</div>
                  <button
                    onClick={() => {
                      onSelectFestival(fest.id);
                      onClose();
                    }}
                    className="w-full mt-2 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold text-xs uppercase transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>LAUNCH FESTIVAL PARADE</span>
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* TAB 5: SYNDICATE INTEL */}
          {activeTab === 'intel' && (
            <div className="space-y-3">
              <div className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-1">
                BENGALURU UNDERWORLD SYNDICATES
              </div>
              {CRIME_SYNDICATES.map((syn) => (
                <div
                  key={syn.id}
                  className="p-3.5 rounded-xl bg-slate-800/80 border border-white/10 space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-amber-300">{syn.name}</span>
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: syn.color }}
                    />
                  </div>
                  <div className="text-[11px] text-white font-medium">Boss: {syn.boss}</div>
                  <div className="text-[10px] text-white/60">Territory: {syn.territory}</div>
                  <p className="text-[11px] text-white/70 leading-relaxed pt-1">
                    {syn.description}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Bottom App Dock Navigation */}
        <div className="grid grid-cols-5 bg-black/70 border-t border-white/10 p-2 text-center">
          <button
            onClick={() => setActiveTab('missions')}
            className={`flex flex-col items-center gap-1 py-1 cursor-pointer transition-all ${
              activeTab === 'missions' ? 'text-amber-400 font-bold' : 'text-white/60'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            <span className="text-[9px]">Gigs</span>
          </button>

          <button
            onClick={() => setActiveTab('vehicles')}
            className={`flex flex-col items-center gap-1 py-1 cursor-pointer transition-all ${
              activeTab === 'vehicles' ? 'text-amber-400 font-bold' : 'text-white/60'
            }`}
          >
            <Car className="w-4 h-4" />
            <span className="text-[9px]">Autos</span>
          </button>

          <button
            onClick={() => setActiveTab('radio')}
            className={`flex flex-col items-center gap-1 py-1 cursor-pointer transition-all ${
              activeTab === 'radio' ? 'text-amber-400 font-bold' : 'text-white/60'
            }`}
          >
            <Radio className="w-4 h-4" />
            <span className="text-[9px]">Radio</span>
          </button>

          <button
            onClick={() => setActiveTab('festivals')}
            className={`flex flex-col items-center gap-1 py-1 cursor-pointer transition-all ${
              activeTab === 'festivals' ? 'text-amber-400 font-bold' : 'text-white/60'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span className="text-[9px]">Festivals</span>
          </button>

          <button
            onClick={() => setActiveTab('intel')}
            className={`flex flex-col items-center gap-1 py-1 cursor-pointer transition-all ${
              activeTab === 'intel' ? 'text-amber-400 font-bold' : 'text-white/60'
            }`}
          >
            <ShieldAlert className="w-4 h-4" />
            <span className="text-[9px]">Intel</span>
          </button>
        </div>

        {/* Home Indicator Bar */}
        <div className="w-28 h-1 bg-white/30 rounded-full mx-auto my-1.5" />
      </div>
    </div>
  );
};
