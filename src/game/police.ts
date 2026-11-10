/**
 * Karnataka State Police "Hoysala" Wanted Level System
 * Controls 1-5 star escalation, Hoysala squad pursuit, roadblocks, and siren alerts.
 */

import * as THREE from 'three';
import { TrafficManager, TrafficVehicle } from './traffic';
import { soundEngine } from '../audio/SoundEngine';

export class PoliceManager {
  public scene: THREE.Scene;
  public trafficManager: TrafficManager;
  public wantedStars: number = 0; // 0 to 5
  public pursuitVehicles: TrafficVehicle[] = [];
  private evasionTimer: number = 0;
  private spawnCooldown: number = 0;

  constructor(scene: THREE.Scene, trafficManager: TrafficManager) {
    this.scene = scene;
    this.trafficManager = trafficManager;
  }

  public setWantedLevel(stars: number) {
    const oldStars = this.wantedStars;
    this.wantedStars = Math.max(0, Math.min(5, stars));

    if (this.wantedStars > 0 && oldStars === 0) {
      soundEngine.setSiren(true);
    } else if (this.wantedStars === 0 && oldStars > 0) {
      soundEngine.setSiren(false);
      this.clearPursuit();
    }
  }

  public addCrime(heat: number) {
    const newLevel = Math.min(5, this.wantedStars + heat);
    this.setWantedLevel(newLevel);
    this.evasionTimer = 0; // Reset escape clock
  }

  public update(dt: number, playerPos: THREE.Vector3) {
    if (this.wantedStars === 0) return;

    // Check if player is evading police
    let isSpotted = false;
    for (const v of this.pursuitVehicles) {
      const dist = v.pos.distanceTo(playerPos);
      if (dist < 70) {
        isSpotted = true;
        // Chase player
        const toPlayer = playerPos.clone().sub(v.pos);
        v.rotationY = Math.atan2(toPlayer.x, toPlayer.z);
        const topSpeed = 16 + this.wantedStars * 3;
        v.speed = THREE.MathUtils.damp(v.speed, topSpeed, 3, dt);

        // Flash emergency lights
        const lightbar = v.mesh.getObjectByName('lightbar');
        if (lightbar) {
          lightbar.rotation.y += dt * 10;
        }
      }
    }

    if (!isSpotted) {
      this.evasionTimer += dt;
      // Stars decay every 12 seconds when out of sight
      if (this.evasionTimer > 12) {
        this.evasionTimer = 0;
        this.setWantedLevel(this.wantedStars - 1);
      }
    } else {
      this.evasionTimer = 0;
    }

    // Spawn Hoysala police vehicles based on wanted level
    const targetPursuitCount = this.wantedStars === 1 ? 1 :
      this.wantedStars === 2 ? 2 :
      this.wantedStars === 3 ? 3 :
      this.wantedStars >= 4 ? 4 : 0;

    this.spawnCooldown -= dt;
    if (this.pursuitVehicles.length < targetPursuitCount && this.spawnCooldown <= 0) {
      this.spawnCooldown = 5.0;
      // Spawn Hoysala ahead or behind player
      const angle = Math.random() * Math.PI * 2;
      const spawnPos = new THREE.Vector3(
        playerPos.x + Math.cos(angle) * 60,
        0,
        playerPos.z + Math.sin(angle) * 60
      );
      const hoysala = this.trafficManager.spawnVehicle('hoysala', spawnPos);
      this.pursuitVehicles.push(hoysala);
    }
  }

  private clearPursuit() {
    this.pursuitVehicles.forEach(v => {
      // Return to regular traffic
      v.speed = 8;
    });
    this.pursuitVehicles = [];
  }
}
