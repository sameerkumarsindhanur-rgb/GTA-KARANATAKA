/**
 * Authentic Bangalore Traffic & Pedestrian Simulation for GTA Karnataka
 * Manages Auto-Rickshaws, BMTC buses, Bullets, Taxis, pedestrian crowds,
 * Silk Board gridlocks, traffic police checks, and vehicle hijacking.
 */

import * as THREE from 'three';
import { VEHICLE_SPECS, VehicleSpec, ROAD_WIDTH, WORLD_SIZE } from './constants';
import {
  createAutoRickshawMesh,
  createBMTCBusMesh,
  createBulletBikeMesh,
  createPoliceHoysalaMesh,
  createTaxiMesh,
  createCharacterMesh
} from './models';
import { soundEngine } from '../audio/SoundEngine';

export interface TrafficVehicle {
  id: string;
  type: 'auto' | 'bike' | 'bus' | 'hoysala' | 'taxi' | 'supercar';
  spec: VehicleSpec;
  mesh: THREE.Group;
  pos: THREE.Vector3;
  velocity: THREE.Vector3;
  speed: number;
  rotationY: number;
  health: number;
  maxHealth: number;
  isPlayerDriven: boolean;
  isGridlocked: boolean;
  laneOffset: number;
  roadAxis: 'x' | 'z';
  roadDir: 1 | -1;
  bounceY: number;
}

export interface Pedestrian {
  id: string;
  type: 'player' | 'cop' | 'auto_driver' | 'techie';
  mesh: THREE.Group;
  pos: THREE.Vector3;
  targetPos: THREE.Vector3;
  speed: number;
  isFleeing: boolean;
  health: number;
  walkCycle: number;
}

export class TrafficManager {
  public scene: THREE.Scene;
  public vehicles: TrafficVehicle[] = [];
  public pedestrians: Pedestrian[] = [];
  private nextId: number = 1;

  constructor(scene: THREE.Scene) {
    this.scene = scene;
  }

  // Populate city with initial Bangalore traffic
  public spawnInitialTraffic() {
    // 1. Spawn Auto-Rickshaws (The backbone of Bangalore transit)
    for (let i = 0; i < 14; i++) {
      this.spawnVehicle('auto');
    }

    // 2. BMTC Buses
    for (let i = 0; i < 4; i++) {
      this.spawnVehicle('bus');
    }

    // 3. Royal Enfield Bikes
    for (let i = 0; i < 8; i++) {
      this.spawnVehicle('bike');
    }

    // 4. Ambassador Taxis
    for (let i = 0; i < 5; i++) {
      this.spawnVehicle('taxi');
    }

    // 5. Police Hoysala SUV
    this.spawnVehicle('hoysala');

    // 6. Pedestrians (Techies, Khaki Auto Walas, Karnataka Police)
    for (let i = 0; i < 30; i++) {
      this.spawnPedestrian();
    }
  }

  // Spawn an individual vehicle
  public spawnVehicle(
    type: 'auto' | 'bike' | 'bus' | 'hoysala' | 'taxi' | 'supercar',
    spawnPos?: THREE.Vector3
  ): TrafficVehicle {
    let mesh: THREE.Group;
    if (type === 'auto') mesh = createAutoRickshawMesh();
    else if (type === 'bike') mesh = createBulletBikeMesh();
    else if (type === 'bus') mesh = createBMTCBusMesh();
    else if (type === 'hoysala') mesh = createPoliceHoysalaMesh();
    else if (type === 'taxi') mesh = createTaxiMesh();
    else mesh = createAutoRickshawMesh();

    const spec = VEHICLE_SPECS[type] || VEHICLE_SPECS.auto;

    // Pick a road segment if no custom position
    const roadAxis: 'x' | 'z' = Math.random() > 0.5 ? 'x' : 'z';
    const roadDir: 1 | -1 = Math.random() > 0.5 ? 1 : -1;
    const laneOffset = (roadDir > 0 ? 1 : -1) * (2.5 + Math.random() * 2.5);

    const pos = spawnPos ? spawnPos.clone() : new THREE.Vector3();
    if (!spawnPos) {
      if (roadAxis === 'z') {
        pos.set(laneOffset, 0, (Math.random() - 0.5) * (WORLD_SIZE * 0.7));
      } else {
        pos.set((Math.random() - 0.5) * (WORLD_SIZE * 0.7), 0, laneOffset);
      }
    }

    // Facing direction
    let rotY = 0;
    if (roadAxis === 'z') {
      rotY = roadDir > 0 ? 0 : Math.PI;
    } else {
      rotY = roadDir > 0 ? Math.PI / 2 : -Math.PI / 2;
    }

    mesh.position.copy(pos);
    mesh.rotation.y = rotY;
    this.scene.add(mesh);

    const vehicle: TrafficVehicle = {
      id: `veh_${this.nextId++}`,
      type,
      spec,
      mesh,
      pos,
      velocity: new THREE.Vector3(),
      speed: 4 + Math.random() * 6,
      rotationY: rotY,
      health: spec.health,
      maxHealth: spec.health,
      isPlayerDriven: false,
      isGridlocked: false,
      laneOffset,
      roadAxis,
      roadDir,
      bounceY: 0
    };

    this.vehicles.push(vehicle);
    return vehicle;
  }

  // Spawn Pedestrians
  public spawnPedestrian(spawnPos?: THREE.Vector3): Pedestrian {
    const types: ('player' | 'cop' | 'auto_driver' | 'techie')[] = ['auto_driver', 'techie', 'cop'];
    const type = types[Math.floor(Math.random() * types.length)];
    const mesh = createCharacterMesh(type);

    const pos = spawnPos ? spawnPos.clone() : new THREE.Vector3();
    if (!spawnPos) {
      // Spawn on sidewalks
      const isX = Math.random() > 0.5;
      const side = Math.random() > 0.5 ? 1 : -1;
      const curbDist = (ROAD_WIDTH / 2 + 2.5) * side;
      if (isX) {
        pos.set((Math.random() - 0.5) * (WORLD_SIZE * 0.6), 0, curbDist);
      } else {
        pos.set(curbDist, 0, (Math.random() - 0.5) * (WORLD_SIZE * 0.6));
      }
    }

    mesh.position.copy(pos);
    this.scene.add(mesh);

    const ped: Pedestrian = {
      id: `ped_${this.nextId++}`,
      type,
      mesh,
      pos,
      targetPos: new THREE.Vector3(
        pos.x + (Math.random() - 0.5) * 30,
        0,
        pos.z + (Math.random() - 0.5) * 30
      ),
      speed: 1.2 + Math.random() * 0.6,
      isFleeing: false,
      health: 100,
      walkCycle: Math.random() * 10
    };

    this.pedestrians.push(ped);
    return ped;
  }

  // Main tick update for autonomous traffic & pedestrians
  public update(dt: number, playerPos: THREE.Vector3, isPlayerInVehicle: boolean) {
    // 1. Update Traffic Vehicles
    for (let i = this.vehicles.length - 1; i >= 0; i--) {
      const v = this.vehicles[i];
      if (v.isPlayerDriven) continue; // Player updates their own vehicle

      // Check distance to player; respawn if too far away (> 240m)
      if (v.pos.distanceTo(playerPos) > 260) {
        // Recycle vehicle near player's forward direction
        v.pos.set(
          playerPos.x + (Math.random() - 0.5) * 120,
          0,
          playerPos.z + (Math.random() - 0.5) * 120
        );
      }

      // Check for Silk Board Gridlock zone (130, 80)
      const distToSilkBoard = new THREE.Vector2(v.pos.x - 130, v.pos.z - 75).length();
      if (distToSilkBoard < 45) {
        // Slow down to authentic Bangalore snail crawl!
        v.isGridlocked = true;
        v.speed = THREE.MathUtils.damp(v.speed, 1.5 + Math.random() * 2, 2, dt);
      } else {
        v.isGridlocked = false;
        v.speed = THREE.MathUtils.damp(v.speed, 8 + Math.random() * 4, 1.5, dt);
      }

      // Simple road cruising AI
      const forward = new THREE.Vector3(0, 0, 1).applyAxisAngle(new THREE.Vector3(0, 1, 0), v.rotationY);

      // Check vehicle ahead in lane
      let needsBrake = false;
      for (const other of this.vehicles) {
        if (other.id === v.id) continue;
        const toOther = other.pos.clone().sub(v.pos);
        if (toOther.length() < 7 && toOther.dot(forward) > 0.8) {
          needsBrake = true;
          break;
        }
      }

      if (needsBrake) {
        v.speed = Math.max(0, v.speed - dt * 14);
      }

      // Move forward
      v.pos.addScaledVector(forward, v.speed * dt);

      // Wrap around road boundaries
      const bound = WORLD_SIZE * 0.45;
      if (v.pos.x > bound) v.pos.x = -bound;
      if (v.pos.x < -bound) v.pos.x = bound;
      if (v.pos.z > bound) v.pos.z = -bound;
      if (v.pos.z < -bound) v.pos.z = bound;

      // Suspension bounce decay
      v.bounceY = THREE.MathUtils.damp(v.bounceY, 0, 8, dt);
      v.mesh.position.set(v.pos.x, v.pos.y + v.bounceY, v.pos.z);
      v.mesh.rotation.y = v.rotationY;
    }

    // 2. Update Pedestrians
    for (let i = this.pedestrians.length - 1; i >= 0; i--) {
      const p = this.pedestrians[i];

      // Check if player is speeding towards pedestrian -> flee!
      const distToPlayer = p.pos.distanceTo(playerPos);
      if (distToPlayer < 10 && isPlayerInVehicle) {
        p.isFleeing = true;
        // Run away from player
        const away = p.pos.clone().sub(playerPos).normalize();
        p.targetPos.copy(p.pos).addScaledVector(away, 15);
        p.speed = 4.2;
      } else if (distToPlayer > 20 && p.isFleeing) {
        p.isFleeing = false;
        p.speed = 1.4;
      }

      // Move towards target
      const dir = p.targetPos.clone().sub(p.pos);
      dir.y = 0;
      if (dir.length() < 1.0) {
        // Pick new sidewalk destination
        p.targetPos.set(
          p.pos.x + (Math.random() - 0.5) * 35,
          0,
          p.pos.z + (Math.random() - 0.5) * 35
        );
      } else {
        dir.normalize();
        p.pos.addScaledVector(dir, p.speed * dt);
        p.mesh.rotation.y = Math.atan2(dir.x, dir.z);

        // Leg swinging animation
        p.walkCycle += dt * p.speed * 6;
        const leftLeg = p.mesh.getObjectByName('leg_left');
        const rightLeg = p.mesh.getObjectByName('leg_right');
        const leftArm = p.mesh.getObjectByName('arm_left');
        const rightArm = p.mesh.getObjectByName('arm_right');

        if (leftLeg && rightLeg) {
          leftLeg.rotation.x = Math.sin(p.walkCycle) * 0.6;
          rightLeg.rotation.x = -Math.sin(p.walkCycle) * 0.6;
        }
        if (leftArm && rightArm) {
          leftArm.rotation.x = -Math.sin(p.walkCycle) * 0.5;
          rightArm.rotation.x = Math.sin(p.walkCycle) * 0.5;
        }
      }

      p.mesh.position.copy(p.pos);
    }
  }

  // Trigger Bangalore Traffic Horn Reaction
  public reactToPlayerHorn(playerPos: THREE.Vector3) {
    for (const v of this.vehicles) {
      if (v.isPlayerDriven) continue;
      const dist = v.pos.distanceTo(playerPos);
      if (dist < 22) {
        // Random chance to honk back in Bangalore fashion or shift lane
        if (Math.random() > 0.4) {
          soundEngine.playHorn(v.type === 'bus' ? 'bus' : v.type === 'bike' ? 'bike' : 'auto');
        }
      }
    }
  }

  // Find nearest vehicle to player for entry / hijacking
  public findNearestVehicle(playerPos: THREE.Vector3, maxDist: number = 4.5): TrafficVehicle | null {
    let nearest: TrafficVehicle | null = null;
    let minDist = maxDist;

    for (const v of this.vehicles) {
      if (v.isPlayerDriven) continue;
      const d = v.pos.distanceTo(playerPos);
      if (d < minDist) {
        minDist = d;
        nearest = v;
      }
    }
    return nearest;
  }

  // Remove vehicle from world
  public removeVehicle(vehicle: TrafficVehicle) {
    this.scene.remove(vehicle.mesh);
    const idx = this.vehicles.indexOf(vehicle);
    if (idx !== -1) {
      this.vehicles.splice(idx, 1);
    }
  }
}
