/**
 * Three.js Canvas Container Component
 * Complies with Three.js skill: isolated container mount, zero React re-render interference,
 * stable WebGL lifecycle, and proper disposal.
 */

import React, { useEffect, useRef } from 'react';
import { GameEngine, GameStateSnapshot } from '../game/GameEngine';

interface GameCanvasProps {
  onEngineReady: (engine: GameEngine) => void;
  onStateUpdate: (state: GameStateSnapshot) => void;
}

export const GameCanvas: React.FC<GameCanvasProps> = ({
  onEngineReady,
  onStateUpdate
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<GameEngine | null>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // Initialize Game Engine once
    const engine = new GameEngine(mountRef.current);
    engineRef.current = engine;
    engine.setStateCallback(onStateUpdate);
    onEngineReady(engine);

    return () => {
      engine.dispose();
      engineRef.current = null;
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="absolute inset-0 w-full h-full overflow-hidden bg-sky-300"
    />
  );
};
