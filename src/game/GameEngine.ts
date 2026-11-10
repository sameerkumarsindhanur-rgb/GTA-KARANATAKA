/**
 * Core 3D Game Engine for GTA Karnataka: Namma Bengaluru
 * Integrates Three.js PBR rendering, RoomEnvironment reflections,
 * Third-person camera with smooth damping, input loop, and game systems.
 */

import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { WorldManager } from './world';
import { TrafficManager } from './traffic';
import { PlayerController, PlayerInput } from './player';
import { PoliceManager } from './police';
import { MissionManager } from './missions';
import { FestivalManager } from './festivals';
import { DISTRICTS, DistrictInfo } from './constants';
import { soundEngine } from '../audio/SoundEngine';

export interface GameStateSnapshot {
  currentDistrict: DistrictInfo;
  health: number;
  armor: number;
  cash: number;
  wantedLevel: number;
  reputation: number;
  isInVehicle: boolean;
  vehicleType: string;
  vehicleSpeedKmh: number;
  autoMeterAmount: number;
  autoDistanceKm: number;
  nitroFuel: number;
  currentWeapon: string;
  radioStation: string;
  activeMissionTitle: string;
  missionTimeRemaining: number;
  dialogueText: string;
  isMissionCompleted: boolean;
  isMissionFailed: boolean;
  currentFestival: string;
  playerCoords: { x: number; z: number };
}

export class GameEngine {
  private container: HTMLElement;
  public renderer: THREE.WebGLRenderer;
  public scene: THREE.Scene;
  public camera: THREE.PerspectiveCamera;

  // Systems
  public worldManager: WorldManager;
  public trafficManager: TrafficManager;
  public player: PlayerController;
  public policeManager: PoliceManager;
  public missionManager: MissionManager;
  public festivalManager: FestivalManager;

  // Camera damping targets
  private cameraTarget = new THREE.Vector3();
  private cameraPos = new THREE.Vector3();

  // Mode & Loop
  public isTitleScreen: boolean = true;
  public isPaused: boolean = false;
  private isRunning: boolean = false;
  private animationFrameId: number = 0;
  private lastTime: number = 0;
  private isSoftwareGl: boolean = false;

  // Inputs
  private input: PlayerInput = {
    forward: false,
    backward: false,
    left: false,
    right: false,
    sprint: false,
    jump: false,
    attack: false,
    interact: false,
    horn: false,
    handbrake: false
  };

  // State callback
  private stateCallback?: (state: GameStateSnapshot) => void;
  private stateThrottleTimer: number = 0;

  constructor(container: HTMLElement) {
    this.container = container;
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    // 1. Software WebGL Guard (Skill requirement)
    this.isSoftwareGl = (() => {
      const gl = document.createElement('canvas').getContext('webgl2');
      if (!gl) return true;
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    })();

    // 2. Setup Three.js Renderer
    this.renderer = new THREE.WebGLRenderer({
      antialias: !this.isSoftwareGl,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(width, height);
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.15;
    this.renderer.setPixelRatio(this.isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = !this.isSoftwareGl;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.appendChild(this.renderer.domElement);

    // 3. Scene & Camera Setup
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x7DD3FC); // Bengaluru crisp sunny sky
    this.scene.fog = new THREE.FogExp2(0xBAE6FD, 0.0035);

    this.camera = new THREE.PerspectiveCamera(60, width / height, 0.2, 500);
    this.camera.position.set(0, 35, 65);

    // 4. Studio Environment Lighting (RoomEnvironment)
    const pmremGenerator = new THREE.PMREMGenerator(this.renderer);
    this.scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    // 5. Directional Sun Key Light + Hemisphere Fill
    const sunLight = new THREE.DirectionalLight(0xFFFBEB, 2.2);
    sunLight.position.set(60, 100, 40);
    sunLight.castShadow = !this.isSoftwareGl;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.near = 10;
    sunLight.shadow.camera.far = 280;
    sunLight.shadow.camera.left = -90;
    sunLight.shadow.camera.right = 90;
    sunLight.shadow.camera.top = 90;
    sunLight.shadow.camera.bottom = -90;
    sunLight.shadow.bias = -0.0005;
    this.scene.add(sunLight);

    const hemiLight = new THREE.HemisphereLight(0xE0F2FE, 0x166534, 1.2);
    this.scene.add(hemiLight);

    // 6. Initialize Systems
    this.worldManager = new WorldManager(this.scene);
    this.worldManager.buildWorld();

    this.trafficManager = new TrafficManager(this.scene);
    this.trafficManager.spawnInitialTraffic();

    this.player = new PlayerController(this.scene, this.worldManager);
    this.policeManager = new PoliceManager(this.scene, this.trafficManager);
    this.missionManager = new MissionManager(this.scene);
    this.festivalManager = new FestivalManager(this.scene);

    // Connect mission rewards to player
    this.missionManager.setRewardCallback((cash, rep) => {
      this.player.addCash(cash);
      this.player.reputation += rep;
    });

    // 7. Event Listeners
    this.setupEventListeners();

    // Start loop
    this.isRunning = true;
    this.lastTime = performance.now();
    this.tick();
  }

  public setStateCallback(cb: (state: GameStateSnapshot) => void) {
    this.stateCallback = cb;
  }

  // Handle Resize
  public handleResize() {
    if (!this.container) return;
    const width = this.container.clientWidth || window.innerWidth;
    const height = this.container.clientHeight || window.innerHeight;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  private setupEventListeners() {
    window.addEventListener('keydown', this.onKeyDown);
    window.addEventListener('keyup', this.onKeyUp);
    window.addEventListener('resize', () => this.handleResize());
    window.addEventListener('blur', this.onBlur);
  }

  private onBlur = () => {
    // Clear held inputs on blur
    this.input = {
      forward: false,
      backward: false,
      left: false,
      right: false,
      sprint: false,
      jump: false,
      attack: false,
      interact: false,
      horn: false,
      handbrake: false
    };
  };

  private onKeyDown = (e: KeyboardEvent) => {
    soundEngine.init(); // AudioContext unlock

    switch (e.code) {
      case 'KeyW':
      case 'ArrowUp':
        this.input.forward = true;
        break;
      case 'KeyS':
      case 'ArrowDown':
        this.input.backward = true;
        break;
      case 'KeyA':
      case 'ArrowLeft':
        this.input.left = true;
        break;
      case 'KeyD':
      case 'ArrowRight':
        this.input.right = true;
        break;
      case 'ShiftLeft':
      case 'ShiftRight':
        this.input.sprint = true;
        break;
      case 'Space':
        if (this.player.isInVehicle) {
          this.input.handbrake = true;
        } else {
          this.input.jump = true;
        }
        break;
      case 'KeyF':
      case 'Enter':
        this.toggleVehicleEntry();
        break;
      case 'KeyH':
      case 'ControlLeft':
      case 'ControlRight':
        if (this.player.isInVehicle) {
          this.input.horn = true;
          this.trafficManager.reactToPlayerHorn(this.player.pos);
        } else {
          this.input.attack = true;
        }
        break;
      case 'KeyR':
        // Cycle radio
        soundEngine.cycleRadioStation();
        break;
      case 'Digit1':
      case 'Digit2':
      case 'Digit3':
      case 'Digit4':
        const idx = parseInt(e.key) - 1;
        this.player.setWeapon(idx);
        break;
    }
  };

  private onKeyUp = (e: KeyboardEvent) => {
    switch (e.code) {
      case 'KeyW':
      case 'ArrowUp':
        this.input.forward = false;
        break;
      case 'KeyS':
      case 'ArrowDown':
        this.input.backward = false;
        break;
      case 'KeyA':
      case 'ArrowLeft':
        this.input.left = false;
        break;
      case 'KeyD':
      case 'ArrowRight':
        this.input.right = false;
        break;
      case 'ShiftLeft':
      case 'ShiftRight':
        this.input.sprint = false;
        break;
      case 'Space':
        this.input.jump = false;
        this.input.handbrake = false;
        break;
      case 'KeyH':
      case 'ControlLeft':
      case 'ControlRight':
        this.input.horn = false;
        this.input.attack = false;
        break;
    }
  };

  // Toggle vehicle entry/exit
  public toggleVehicleEntry() {
    if (this.player.isInVehicle) {
      this.player.exitVehicle();
    } else {
      const nearest = this.trafficManager.findNearestVehicle(this.player.pos, 5.0);
      if (nearest) {
        this.player.enterVehicle(nearest);
      }
    }
  }

  // Start Playing from Title Screen
  public startGame() {
    soundEngine.init();
    this.isTitleScreen = false;
    this.isPaused = false;
    soundEngine.playMissionSuccess();
  }

  // Continuous Game Loop
  private tick = () => {
    if (!this.isRunning) return;

    const now = performance.now();
    const rawDt = (now - this.lastTime) / 1000;
    this.lastTime = now;
    const dt = Math.min(rawDt, 0.05); // Clamp frame delta

    if (!this.isPaused) {
      if (this.isTitleScreen) {
        this.updateTitleScreen(dt);
      } else {
        this.updateGameplay(dt);
      }
    }

    this.renderer.render(this.scene, this.camera);

    this.animationFrameId = requestAnimationFrame(this.tick);
  };

  // Title Screen Cinematic Panoramic Camera Orbit
  private updateTitleScreen(dt: number) {
    const time = performance.now() * 0.0003;
    const radius = 70;
    this.camera.position.set(
      Math.cos(time) * radius,
      25 + Math.sin(time * 0.5) * 6,
      Math.sin(time) * radius - 20
    );
    this.camera.lookAt(0, 10, -20); // Focus on Vidhana Soudha

    this.worldManager.update(dt);
    this.trafficManager.update(dt, new THREE.Vector3(0, 0, 0), false);
  }

  // Active Gameplay Update
  private updateGameplay(dt: number) {
    // 1. Systems Update
    this.player.update(dt, this.input);
    this.worldManager.update(dt);
    this.trafficManager.update(dt, this.player.pos, this.player.isInVehicle);
    this.policeManager.update(dt, this.player.pos);
    this.missionManager.update(dt, this.player.pos);
    this.festivalManager.update(dt, this.player.pos);

    // 2. Third-person Chase Camera follow
    this.updateCamera(dt);

    // 3. Emit State Snapshot for UI HUD (throttled to ~15fps)
    this.stateThrottleTimer += dt;
    if (this.stateThrottleTimer > 0.066) {
      this.stateThrottleTimer = 0;
      this.emitGameState();
    }
  }

  private updateCamera(dt: number) {
    const playerPos = this.player.pos;
    const rotY = this.player.rotationY;

    if (this.player.isInVehicle && this.player.currentVehicle) {
      const v = this.player.currentVehicle;
      const speedRatio = Math.abs(v.speed) / v.spec.topSpeed;
      const camDist = 6.8 + speedRatio * 3.5;
      const camHeight = 3.2 + speedRatio * 1.2;

      // Position behind vehicle
      const offset = new THREE.Vector3(0, camHeight, -camDist).applyAxisAngle(new THREE.Vector3(0, 1, 0), rotY);
      const targetPos = playerPos.clone().add(offset);

      this.cameraPos.lerp(targetPos, 1 - Math.exp(-9 * dt));
      this.camera.position.copy(this.cameraPos);

      // Look slightly ahead of car
      const lookAhead = playerPos.clone().add(new THREE.Vector3(0, 1.2, 3).applyAxisAngle(new THREE.Vector3(0, 1, 0), rotY));
      this.cameraTarget.lerp(lookAhead, 1 - Math.exp(-12 * dt));
      this.camera.lookAt(this.cameraTarget);
    } else {
      // On Foot Over-the-shoulder chase camera
      const camDist = 4.8;
      const camHeight = 2.4;
      const offset = new THREE.Vector3(0, camHeight, -camDist).applyAxisAngle(new THREE.Vector3(0, 1, 0), rotY);
      const targetPos = playerPos.clone().add(offset);

      this.cameraPos.lerp(targetPos, 1 - Math.exp(-10 * dt));
      this.camera.position.copy(this.cameraPos);

      const lookTarget = playerPos.clone().add(new THREE.Vector3(0, 1.4, 0));
      this.cameraTarget.lerp(lookTarget, 1 - Math.exp(-14 * dt));
      this.camera.lookAt(this.cameraTarget);
    }
  }

  // Find Current District based on player location
  private getCurrentDistrict(): DistrictInfo {
    const px = this.player.pos.x;
    const pz = this.player.pos.z;

    let nearest = DISTRICTS[0];
    let minDist = 99999;

    for (const d of DISTRICTS) {
      const dist = Math.hypot(px - d.center.x, pz - d.center.z);
      if (dist < minDist) {
        minDist = dist;
        nearest = d;
      }
    }
    return nearest;
  }

  private emitGameState() {
    if (!this.stateCallback) return;

    const district = this.getCurrentDistrict();
    const veh = this.player.currentVehicle;
    const speedKmh = veh ? Math.round(Math.abs(veh.speed) * 3.6) : Math.round(this.player.speed * 3.6);

    const snapshot: GameStateSnapshot = {
      currentDistrict: district,
      health: Math.round(this.player.health),
      armor: Math.round(this.player.armor),
      cash: this.player.cash,
      wantedLevel: this.policeManager.wantedStars,
      reputation: this.player.reputation,
      isInVehicle: this.player.isInVehicle,
      vehicleType: veh ? veh.spec.name : 'On Foot',
      vehicleSpeedKmh: speedKmh,
      autoMeterAmount: parseFloat(this.player.fareMeterAmount.toFixed(2)),
      autoDistanceKm: parseFloat(this.player.fareDistanceKm.toFixed(2)),
      nitroFuel: Math.round(this.player.nitroFuel),
      currentWeapon: this.player.getCurrentWeapon().name,
      radioStation: soundEngine.getCurrentStation().name,
      activeMissionTitle: this.missionManager.activeMission ? this.missionManager.activeMission.title : '',
      missionTimeRemaining: Math.max(0, Math.round(this.missionManager.missionTimer)),
      dialogueText: this.missionManager.currentDialogue,
      isMissionCompleted: this.missionManager.isCompleted,
      isMissionFailed: this.missionManager.isFailed,
      currentFestival: this.festivalManager.currentFestival.name,
      playerCoords: { x: Math.round(this.player.pos.x), z: Math.round(this.player.pos.z) }
    };

    this.stateCallback(snapshot);
  }

  // Cleanup on unmount
  public dispose() {
    this.isRunning = false;
    cancelAnimationFrame(this.animationFrameId);
    window.removeEventListener('keydown', this.onKeyDown);
    window.removeEventListener('keyup', this.onKeyUp);
    window.removeEventListener('blur', this.onBlur);
    soundEngine.stopVehicleEngine();
    soundEngine.setSiren(false);
    this.renderer.dispose();
  }
}
