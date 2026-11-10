/**
 * Player Controller & Physics for GTA Karnataka: Namma Bengaluru
 * Supports on-foot locomotion (walking, sprinting, jumping, melee attack),
 * vehicle driving (3-wheel Auto drift, Bullet bike, BMTC bus, Supercar),
 * Auto fare meter simulation, nitro boost, weapon firing, and health/armor.
 */

import * as THREE from 'three';
import { WEAPONS, WeaponSpec, VEHICLE_SPECS, VehicleSpec } from './constants';
import { createCharacterMesh } from './models';
import { TrafficVehicle } from './traffic';
import { soundEngine } from '../audio/SoundEngine';
import { WorldManager } from './world';

export interface PlayerInput {
  forward: boolean;
  backward: boolean;
  left: boolean;
  right: boolean;
  sprint: boolean;
  jump: boolean;
  attack: boolean;
  interact: boolean; // F / Enter (Enter/Exit vehicle)
  horn: boolean;
  handbrake: boolean;
}

export class PlayerController {
  public scene: THREE.Scene;
  public worldManager: WorldManager;
  public mesh: THREE.Group;
  public pos: THREE.Vector3 = new THREE.Vector3(0, 0, 15); // Starts in Vidhana Soudha boulevard
  public velocity: THREE.Vector3 = new THREE.Vector3();
  public rotationY: number = 0;
  public speed: number = 0;

  // Stats
  public health: number = 100;
  public maxHealth: number = 100;
  public armor: number = 50;
  public maxArmor: number = 100;
  public cash: number = 2500;
  public wantedLevel: number = 0; // 0 to 5 stars
  public reputation: number = 15;

  // State
  public isInVehicle: boolean = false;
  public currentVehicle: TrafficVehicle | null = null;
  public nitroFuel: number = 100; // 0-100%
  public isBoosting: boolean = false;
  public fareMeterAmount: number = 30.0; // Auto Rickshaw digital meter
  public fareDistanceKm: number = 0;
  public isGrounded: boolean = true;
  public isAttacking: boolean = false;
  public attackTimer: number = 0;

  // Weapons
  public currentWeaponIndex: number = 0;
  public weapons: WeaponSpec[] = [...WEAPONS];

  // Animation cycle
  private walkCycle: number = 0;

  constructor(scene: THREE.Scene, worldManager: WorldManager) {
    this.scene = scene;
    this.worldManager = worldManager;
    this.mesh = createCharacterMesh('player');
    this.mesh.position.copy(this.pos);
    this.scene.add(this.mesh);
  }

  public getCurrentWeapon(): WeaponSpec {
    return this.weapons[this.currentWeaponIndex];
  }

  public cycleWeapon() {
    this.currentWeaponIndex = (this.currentWeaponIndex + 1) % this.weapons.length;
    soundEngine.playCashEarned(); // audio feedback
  }

  public setWeapon(index: number) {
    if (index >= 0 && index < this.weapons.length) {
      this.currentWeaponIndex = index;
    }
  }

  // Handle Input & Physics Tick
  public update(dt: number, input: PlayerInput) {
    // Attack Cooldown
    if (this.attackTimer > 0) {
      this.attackTimer -= dt;
      if (this.attackTimer <= 0) {
        this.isAttacking = false;
      }
    }

    if (this.isInVehicle && this.currentVehicle) {
      this.updateDriving(dt, input);
    } else {
      this.updateOnFoot(dt, input);
    }

    // Nitro regeneration when not boosting
    if (!this.isBoosting && this.nitroFuel < 100) {
      this.nitroFuel = Math.min(100, this.nitroFuel + dt * 15);
    }
  }

  // --- ON FOOT LOCOMOTION ---
  private updateOnFoot(dt: number, input: PlayerInput) {
    this.mesh.visible = true;

    // Movement vector
    const moveDir = new THREE.Vector3();
    if (input.forward) moveDir.z -= 1;
    if (input.backward) moveDir.z += 1;
    if (input.left) moveDir.x -= 1;
    if (input.right) moveDir.x += 1;

    const isMoving = moveDir.lengthSq() > 0.01;

    if (isMoving) {
      moveDir.normalize();
      const targetAngle = Math.atan2(moveDir.x, moveDir.z);
      this.rotationY = THREE.MathUtils.damp(this.rotationY, targetAngle, 12, dt);

      const maxSpeed = input.sprint ? 7.5 : 4.0;
      this.speed = THREE.MathUtils.damp(this.speed, maxSpeed, 10, dt);

      // Advance walk cycle
      this.walkCycle += dt * this.speed * 4;
      const leftLeg = this.mesh.getObjectByName('leg_left');
      const rightLeg = this.mesh.getObjectByName('leg_right');
      const leftArm = this.mesh.getObjectByName('arm_left');
      const rightArm = this.mesh.getObjectByName('arm_right');

      if (leftLeg && rightLeg) {
        leftLeg.rotation.x = Math.sin(this.walkCycle) * 0.7;
        rightLeg.rotation.x = -Math.sin(this.walkCycle) * 0.7;
      }
      if (leftArm && rightArm && !this.isAttacking) {
        leftArm.rotation.x = -Math.sin(this.walkCycle) * 0.6;
        rightArm.rotation.x = Math.sin(this.walkCycle) * 0.6;
      }
    } else {
      this.speed = THREE.MathUtils.damp(this.speed, 0, 12, dt);
      // Reset limbs
      const leftLeg = this.mesh.getObjectByName('leg_left');
      const rightLeg = this.mesh.getObjectByName('leg_right');
      if (leftLeg && rightLeg) {
        leftLeg.rotation.x = THREE.MathUtils.damp(leftLeg.rotation.x, 0, 10, dt);
        rightLeg.rotation.x = THREE.MathUtils.damp(rightLeg.rotation.x, 0, 10, dt);
      }
    }

    // Jump physics
    if (input.jump && this.isGrounded) {
      this.velocity.y = 5.5;
      this.isGrounded = false;
    }

    // Gravity
    if (!this.isGrounded) {
      this.velocity.y -= 16.0 * dt;
      this.pos.y += this.velocity.y * dt;
      if (this.pos.y <= 0) {
        this.pos.y = 0;
        this.velocity.y = 0;
        this.isGrounded = true;
      }
    }

    // Apply forward translation
    if (this.speed > 0.05) {
      const step = new THREE.Vector3(
        Math.sin(this.rotationY) * this.speed * dt,
        0,
        Math.cos(this.rotationY) * this.speed * dt
      );

      const nextPos = this.pos.clone().add(step);
      // Collision check with buildings
      if (!this.worldManager.checkCollision(nextPos, 0.6)) {
        this.pos.copy(nextPos);
      }
    }

    // Melee / Weapon Attack
    if (input.attack && this.attackTimer <= 0) {
      this.performAttack();
    }

    this.mesh.position.copy(this.pos);
    this.mesh.rotation.y = this.rotationY + Math.PI; // Face move direction
  }

  // --- VEHICLE DRIVING (TUK-TUK DRIFT, BMTC CRUISE, BULLET LEAN) ---
  private updateDriving(dt: number, input: PlayerInput) {
    if (!this.currentVehicle) return;
    const v = this.currentVehicle;
    const spec = v.spec;

    this.mesh.visible = false; // Player is inside vehicle

    // Steering
    const steerSpeed = spec.handling;
    if (input.left) {
      v.rotationY += steerSpeed * dt * (v.speed >= 0 ? 1 : -1);
    }
    if (input.right) {
      v.rotationY -= steerSpeed * dt * (v.speed >= 0 ? 1 : -1);
    }

    // Nitro Boost
    this.isBoosting = input.sprint && this.nitroFuel > 5 && v.speed > 3;
    let effectiveMaxSpeed = spec.topSpeed;
    let effectiveAccel = spec.acceleration;

    if (this.isBoosting) {
      effectiveMaxSpeed *= 1.4;
      effectiveAccel *= 1.8;
      this.nitroFuel = Math.max(0, this.nitroFuel - dt * 25);
    }

    // Acceleration & Braking
    if (input.forward) {
      v.speed = Math.min(effectiveMaxSpeed, v.speed + effectiveAccel * dt);
    } else if (input.backward) {
      v.speed = Math.max(-8, v.speed - effectiveAccel * 1.2 * dt);
    } else {
      // Coasting friction
      v.speed = THREE.MathUtils.damp(v.speed, 0, 1.5, dt);
    }

    // Handbrake drift (Spacebar)
    if (input.handbrake) {
      v.speed = THREE.MathUtils.damp(v.speed, 0, 4.0, dt);
      // Tuk-tuk tail slide
      if (v.type === 'auto') {
        v.mesh.rotation.z = Math.sin(Date.now() * 0.01) * 0.1;
      }
    } else {
      v.mesh.rotation.z = THREE.MathUtils.damp(v.mesh.rotation.z, 0, 8, dt);
    }

    // Bike lean into corners
    if (v.type === 'bike') {
      const targetLean = input.left ? 0.35 : input.right ? -0.35 : 0;
      v.mesh.rotation.z = THREE.MathUtils.damp(v.mesh.rotation.z, targetLean, 8, dt);
    }

    // Move vehicle forward
    const forward = new THREE.Vector3(0, 0, 1).applyAxisAngle(new THREE.Vector3(0, 1, 0), v.rotationY);
    const step = forward.clone().multiplyScalar(v.speed * dt);
    const nextPos = v.pos.clone().add(step);

    // Collision with world objects
    if (!this.worldManager.checkCollision(nextPos, 1.2)) {
      v.pos.copy(nextPos);
    } else {
      // Impact crash!
      v.speed = -v.speed * 0.4;
      soundEngine.playCricketBatHit();
      v.health = Math.max(0, v.health - 15);
      v.bounceY = 0.4;
    }

    // Check Pothole collision (Authentic Bangalore road experience!)
    if (this.worldManager.checkPothole(v.pos)) {
      v.bounceY = 0.35;
      v.speed *= 0.85; // Jolts and slows
      soundEngine.playDolluDrum(false);
    }

    // Update Auto Fare Meter
    if (v.type === 'auto') {
      const distKm = Math.abs(v.speed * dt) / 1000;
      this.fareDistanceKm += distKm;
      // Bangalore meter rate: ₹30 first 2km + ₹15/km
      this.fareMeterAmount = 30.0 + Math.max(0, this.fareDistanceKm - 2) * 15.0;
    }

    // Horn
    if (input.horn) {
      soundEngine.playHorn(v.type === 'bus' ? 'bus' : v.type === 'bike' ? 'bike' : 'auto');
    }

    // Update procedural engine sound
    const speedRatio = Math.abs(v.speed) / spec.topSpeed;
    soundEngine.updateVehicleEngine(speedRatio, input.forward);

    // Sync mesh position & rotation
    v.bounceY = THREE.MathUtils.damp(v.bounceY, 0, 8, dt);
    v.mesh.position.set(v.pos.x, v.pos.y + v.bounceY, v.pos.z);
    v.mesh.rotation.y = v.rotationY;

    // Sync player position with vehicle
    this.pos.copy(v.pos);
    this.rotationY = v.rotationY;
  }

  // --- ENTER / EXIT VEHICLE ---
  public enterVehicle(vehicle: TrafficVehicle) {
    this.isInVehicle = true;
    this.currentVehicle = vehicle;
    vehicle.isPlayerDriven = true;
    this.pos.copy(vehicle.pos);

    // Start appropriate engine audio
    const type = vehicle.type === 'auto' ? 'auto' :
      vehicle.type === 'bike' ? 'bike' :
      vehicle.type === 'bus' ? 'bus' : 'car';
    soundEngine.startVehicleEngine(type);

    if (vehicle.type === 'hoysala') {
      soundEngine.setSiren(true);
    }
  }

  public exitVehicle() {
    if (!this.currentVehicle) return;
    const v = this.currentVehicle;
    v.isPlayerDriven = false;
    v.speed = 0;

    // Step out to the side of the vehicle
    const sideOffset = new THREE.Vector3(1.8, 0, 0).applyAxisAngle(new THREE.Vector3(0, 1, 0), v.rotationY);
    this.pos.copy(v.pos).add(sideOffset);
    this.pos.y = 0;

    soundEngine.stopVehicleEngine();
    if (v.type === 'hoysala') {
      soundEngine.setSiren(false);
    }

    this.currentVehicle = null;
    this.isInVehicle = false;
    this.mesh.visible = true;
    this.mesh.position.copy(this.pos);
  }

  // Perform Attack Action
  private performAttack() {
    this.isAttacking = true;
    const weapon = this.getCurrentWeapon();
    this.attackTimer = weapon.cooldown;

    // Swing arm animation
    const rightArm = this.mesh.getObjectByName('arm_right');
    if (rightArm) {
      rightArm.rotation.x = -Math.PI / 2;
    }

    // Audio based on weapon
    if (weapon.id === 'fist') {
      soundEngine.playPunch();
    } else if (weapon.id === 'cricket_bat') {
      soundEngine.playCricketBatHit();
    } else if (weapon.id === 'slingshot') {
      soundEngine.playCoconutSlingshot();
    } else if (weapon.id === 'sandalwood_pistol') {
      soundEngine.playCricketBatHit();
    }
  }

  // Take damage
  public takeDamage(amount: number) {
    if (this.armor > 0) {
      const absorbed = Math.min(this.armor, amount);
      this.armor -= absorbed;
      amount -= absorbed;
    }
    this.health = Math.max(0, this.health - amount);
    soundEngine.playPunch();
  }

  // Heal / Prasad pickup
  public heal(amount: number) {
    this.health = Math.min(this.maxHealth, this.health + amount);
    soundEngine.playCashEarned();
  }

  // Add Cash & Wanted Level
  public addCash(amount: number) {
    this.cash += amount;
    soundEngine.playCashEarned();
  }

  public setWanted(stars: number) {
    this.wantedLevel = Math.max(0, Math.min(5, stars));
  }
}
