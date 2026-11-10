/**
 * Main Application Shell for GTA Karnataka: Namma Bengaluru
 * Full-viewport Game Shell managing Title Screen, Playing HUD,
 * Namma Smartphone UI, and Pause / District Map.
 */

import React, { useState, useRef, useCallback, useEffect } from 'react';
import * as THREE from 'three';
import { GameCanvas } from './components/GameCanvas';
import { TitleScreen } from './components/TitleScreen';
import { GameHUD } from './components/GameHUD';
import { NammaPhone } from './components/NammaPhone';
import { PauseMenu } from './components/PauseMenu';
import { GameEngine, GameStateSnapshot } from './game/GameEngine';
import { DISTRICTS } from './game/constants';
import { soundEngine } from './audio/SoundEngine';

export default function App() {
  const engineRef = useRef<GameEngine | null>(null);

  const [isTitleScreen, setIsTitleScreen] = useState<boolean>(true);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isPhoneOpen, setIsPhoneOpen] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  // Default snapshot state
  const [gameState, setGameState] = useState<GameStateSnapshot>({
    currentDistrict: DISTRICTS[0],
    health: 100,
    armor: 50,
    cash: 2500,
    wantedLevel: 0,
    reputation: 15,
    isInVehicle: false,
    vehicleType: 'On Foot',
    vehicleSpeedKmh: 0,
    autoMeterAmount: 30.0,
    autoDistanceKm: 0.0,
    nitroFuel: 100,
    currentWeapon: 'Bare Knuckle Punch',
    radioStation: 'Radio City Namma 91.1',
    activeMissionTitle: '',
    missionTimeRemaining: 0,
    dialogueText: '',
    isMissionCompleted: false,
    isMissionFailed: false,
    currentFestival: 'Kannada Rajyotsava Carnival',
    playerCoords: { x: 0, z: 15 }
  });

  // Engine Ready callback
  const handleEngineReady = useCallback((engine: GameEngine) => {
    engineRef.current = engine;
  }, []);

  // Engine State update callback (throttled from 60fps loop)
  const handleStateUpdate = useCallback((newState: GameStateSnapshot) => {
    setGameState(newState);
  }, []);

  // Start Game
  const handleStartGame = useCallback(() => {
    if (engineRef.current) {
      engineRef.current.startGame();
      setIsTitleScreen(false);
    }
  }, []);

  // Mute Audio
  const handleToggleMute = useCallback(() => {
    const muted = soundEngine.toggleMute();
    setIsMuted(muted);
  }, []);

  // Keyboard shortcuts (Escape, P, M)
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (isTitleScreen) return;

      if (e.code === 'Escape') {
        if (isPhoneOpen) {
          setIsPhoneOpen(false);
        } else {
          setIsPaused((prev) => {
            const next = !prev;
            if (engineRef.current) engineRef.current.isPaused = next;
            return next;
          });
        }
      } else if (e.code === 'KeyP') {
        if (!isPaused) {
          setIsPhoneOpen((prev) => !prev);
        }
      } else if (e.code === 'KeyM') {
        setIsPaused(true);
        if (engineRef.current) engineRef.current.isPaused = true;
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [isTitleScreen, isPaused, isPhoneOpen]);

  // Actions from HUD / Phone
  const handleToggleVehicle = useCallback(() => {
    if (engineRef.current) {
      engineRef.current.toggleVehicleEntry();
    }
  }, []);

  const handleHorn = useCallback(() => {
    if (engineRef.current && engineRef.current.player.isInVehicle) {
      soundEngine.playHorn(
        engineRef.current.player.currentVehicle?.type === 'bus'
          ? 'bus'
          : engineRef.current.player.currentVehicle?.type === 'bike'
          ? 'bike'
          : 'auto'
      );
      engineRef.current.trafficManager.reactToPlayerHorn(engineRef.current.player.pos);
    }
  }, []);

  const handleStartMission = useCallback((missionId: string) => {
    if (engineRef.current) {
      engineRef.current.missionManager.startMission(missionId);
    }
  }, []);

  const handleSpawnVehicle = useCallback(
    (type: 'auto' | 'bike' | 'bus' | 'hoysala' | 'taxi' | 'supercar') => {
      if (engineRef.current) {
        const playerPos = engineRef.current.player.pos;
        const spawnPos = playerPos.clone().add(new THREE.Vector3(3, 0, 3));
        const v = engineRef.current.trafficManager.spawnVehicle(type, spawnPos);
        engineRef.current.player.enterVehicle(v);
      }
    },
    []
  );

  const handleSelectFestival = useCallback((festivalId: string) => {
    if (engineRef.current) {
      engineRef.current.festivalManager.setFestival(festivalId);
    }
  }, []);

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-black font-sans select-none">
      {/* 3D WebGL Canvas Layer */}
      <GameCanvas
        onEngineReady={handleEngineReady}
        onStateUpdate={handleStateUpdate}
      />

      {/* Title Screen Overlay */}
      {isTitleScreen && (
        <TitleScreen
          onStartGame={handleStartGame}
          onOpenControls={() => setIsPaused(true)}
          isMuted={isMuted}
          onToggleMute={handleToggleMute}
        />
      )}

      {/* Active In-Game HUD Overlay */}
      {!isTitleScreen && !isPaused && (
        <GameHUD
          state={gameState}
          onOpenPhone={() => setIsPhoneOpen(true)}
          onOpenMap={() => setIsPaused(true)}
          onToggleVehicle={handleToggleVehicle}
          onHorn={handleHorn}
        />
      )}

      {/* Interactive Smartphone ("Namma Phone") */}
      <NammaPhone
        isOpen={isPhoneOpen}
        onClose={() => setIsPhoneOpen(false)}
        onStartMission={handleStartMission}
        onSpawnVehicle={handleSpawnVehicle}
        onSelectFestival={handleSelectFestival}
        activeMissionId={gameState.activeMissionTitle ? 'active' : undefined}
      />

      {/* Pause Menu & District Map Modal */}
      <PauseMenu
        isOpen={isPaused}
        onResume={() => {
          setIsPaused(false);
          if (engineRef.current) engineRef.current.isPaused = false;
        }}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
      />
    </main>
  );
}
