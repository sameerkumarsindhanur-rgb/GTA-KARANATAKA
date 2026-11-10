/**
 * World Generation & District Builder for GTA Karnataka: Namma Bengaluru
 * Builds open-world terrain, road networks, elevated Silk Board flyovers,
 * overhead Namma Metro viaduct, trees, streetlights, and landmark locations.
 */

import * as THREE from 'three';
import { DISTRICTS, LANDMARKS, WORLD_SIZE, ROAD_WIDTH } from './constants';
import { textureGen } from './textures';
import {
  createVidhanaSoudhaMesh,
  createBangalorePalaceMesh,
  createNammaMetroMesh,
  createGlassHouseMesh,
  createHampiChariotMesh,
  createUBCityMesh,
  createMajesticTerminusMesh,
  createFestivalElephantMesh,
  createStreetStallMesh,
  createTreeMesh
} from './models';

export interface Pothole {
  pos: THREE.Vector3;
  radius: number;
}

export class WorldManager {
  public scene: THREE.Scene;
  public colliders: THREE.Box3[] = [];
  public potholes: Pothole[] = [];
  public metroTrainMesh: THREE.Object3D | null = null;
  public roadSegments: { start: THREE.Vector2; end: THREE.Vector2; width: number }[] = [];

  constructor(scene: THREE.Scene) {
    this.scene = scene;
  }

  public buildWorld() {
    this.buildTerrain();
    this.buildRoadNetwork();
    this.buildSilkBoardFlyover();
    this.buildLandmarks();
    this.buildFoliageAndProps();
    this.buildPotholes();
    this.buildNammaMetro();
  }

  // --- BASE TERRAIN (Lush red-soil & grass Karnataka landscape) ---
  private buildTerrain() {
    // Large ground plane extending beyond playable zone
    const groundGeo = new THREE.PlaneGeometry(WORLD_SIZE * 2.2, WORLD_SIZE * 2.2, 32, 32);
    groundGeo.rotateX(-Math.PI / 2);

    const groundMat = new THREE.MeshStandardMaterial({
      color: 0x365314, // Lush green landscape
      roughness: 0.95,
      metalness: 0.05
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.position.y = -0.05;
    ground.receiveShadow = true;
    this.scene.add(ground);

    // Cubbon Park central lawn patch
    const cubbonGeo = new THREE.PlaneGeometry(80, 80);
    cubbonGeo.rotateX(-Math.PI / 2);
    const cubbonMat = new THREE.MeshStandardMaterial({ color: 0x15803D, roughness: 0.9 });
    const cubbon = new THREE.Mesh(cubbonGeo, cubbonMat);
    cubbon.position.set(0, 0.01, 40);
    cubbon.receiveShadow = true;
    this.scene.add(cubbon);

    // Distant Nandi Hills / Chamundi Hills horizon silhouette
    const hillMat = new THREE.MeshStandardMaterial({ color: 0x1E293B, roughness: 0.95 });
    for (let i = 0; i < 8; i++) {
      const angle = (i * Math.PI * 2) / 8;
      const dist = WORLD_SIZE * 0.95;
      const hill = new THREE.Mesh(new THREE.ConeGeometry(80, 45, 7), hillMat);
      hill.position.set(Math.cos(angle) * dist, 15, Math.sin(angle) * dist);
      this.scene.add(hill);
    }
  }

  // --- ROAD NETWORK (Major Bengaluru Arteries) ---
  private buildRoadNetwork() {
    const roadMat = new THREE.MeshStandardMaterial({
      map: textureGen.getRoadTexture(),
      roughness: 0.7,
      metalness: 0.1
    });

    const isectMat = new THREE.MeshStandardMaterial({
      map: textureGen.getIntersectionTexture(),
      roughness: 0.7
    });

    // 1. Central Boulevard (MG Road / Vidhana Soudha arterial) from Z = -180 to 180
    const mainRoadGeo = new THREE.PlaneGeometry(ROAD_WIDTH, WORLD_SIZE * 0.9);
    mainRoadGeo.rotateX(-Math.PI / 2);
    const mainRoad = new THREE.Mesh(mainRoadGeo, roadMat);
    mainRoad.position.set(0, 0.02, 0);
    mainRoad.receiveShadow = true;
    this.scene.add(mainRoad);
    this.roadSegments.push({
      start: new THREE.Vector2(0, -WORLD_SIZE * 0.45),
      end: new THREE.Vector2(0, WORLD_SIZE * 0.45),
      width: ROAD_WIDTH
    });

    // 2. East-West Ring Road (Majestic to Silk Board) from X = -180 to 180
    const ringRoadGeo = new THREE.PlaneGeometry(WORLD_SIZE * 0.9, ROAD_WIDTH);
    ringRoadGeo.rotateX(-Math.PI / 2);
    const ringRoad = new THREE.Mesh(ringRoadGeo, roadMat);
    ringRoad.position.set(0, 0.02, 0);
    ringRoad.receiveShadow = true;
    this.scene.add(ringRoad);
    this.roadSegments.push({
      start: new THREE.Vector2(-WORLD_SIZE * 0.45, 0),
      end: new THREE.Vector2(WORLD_SIZE * 0.45, 0),
      width: ROAD_WIDTH
    });

    // 3. Silk Board Diagonal Corridor
    const diagRoadGeo = new THREE.PlaneGeometry(ROAD_WIDTH, 180);
    diagRoadGeo.rotateX(-Math.PI / 2);
    const diagRoad = new THREE.Mesh(diagRoadGeo, roadMat);
    diagRoad.position.set(70, 0.02, 50);
    diagRoad.rotation.y = Math.PI / 4;
    diagRoad.receiveShadow = true;
    this.scene.add(diagRoad);

    // 4. Lalbagh South Avenue
    const southRoadGeo = new THREE.PlaneGeometry(160, ROAD_WIDTH);
    southRoadGeo.rotateX(-Math.PI / 2);
    const southRoad = new THREE.Mesh(southRoadGeo, roadMat);
    southRoad.position.set(-40, 0.02, 100);
    southRoad.receiveShadow = true;
    this.scene.add(southRoad);

    // Central Intersection
    const isect = new THREE.Mesh(new THREE.PlaneGeometry(ROAD_WIDTH, ROAD_WIDTH).rotateX(-Math.PI / 2), isectMat);
    isect.position.set(0, 0.03, 0);
    isect.receiveShadow = true;
    this.scene.add(isect);

    // Sidewalk curbs along roads
    const curbMat = new THREE.MeshStandardMaterial({ color: 0x94A3B8, roughness: 0.8 });
    const curbPositions = [
      [-ROAD_WIDTH / 2 - 1, 0.1, 0, 2, 0.2, WORLD_SIZE * 0.9],
      [ROAD_WIDTH / 2 + 1, 0.1, 0, 2, 0.2, WORLD_SIZE * 0.9],
      [0, 0.1, -ROAD_WIDTH / 2 - 1, WORLD_SIZE * 0.9, 0.2, 2],
      [0, 0.1, ROAD_WIDTH / 2 + 1, WORLD_SIZE * 0.9, 0.2, 2]
    ];
    curbPositions.forEach(c => {
      const curb = new THREE.Mesh(new THREE.BoxGeometry(c[3], c[4], c[5]), curbMat);
      curb.position.set(c[0], c[1], c[2]);
      this.scene.add(curb);
    });
  }

  // --- SILK BOARD ELEVATED FLYOVER (Authentic Bangalore Traffic Boss Arena) ---
  private buildSilkBoardFlyover() {
    const flyoverMat = new THREE.MeshStandardMaterial({ color: 0x64748B, roughness: 0.65 });

    // Elevated concrete deck 6m above ground
    const deckGeo = new THREE.BoxGeometry(ROAD_WIDTH, 1.2, 110);
    const deck = new THREE.Mesh(deckGeo, flyoverMat);
    deck.position.set(130, 6, 75);
    deck.castShadow = true;
    deck.receiveShadow = true;
    this.scene.add(deck);

    // Guard rails
    const railMat = new THREE.MeshStandardMaterial({ color: 0xF59E0B, roughness: 0.4 });
    const railL = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.8, 110), railMat);
    railL.position.set(130 - ROAD_WIDTH / 2 + 0.2, 7, 75);
    this.scene.add(railL);

    const railR = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.8, 110), railMat);
    railR.position.set(130 + ROAD_WIDTH / 2 - 0.2, 7, 75);
    this.scene.add(railR);

    // Concrete Ramp Up
    const rampUp = new THREE.Mesh(new THREE.BoxGeometry(ROAD_WIDTH, 1.2, 40), flyoverMat);
    rampUp.position.set(130, 3, 145);
    rampUp.rotation.x = 0.15;
    this.scene.add(rampUp);

    // Pillars supporting flyover
    for (let z = 30; z <= 120; z += 25) {
      const p = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.4, 6, 12), flyoverMat);
      p.position.set(130, 3, z);
      this.scene.add(p);
    }
  }

  // --- NAMMA METRO ELEVATED TRACK ---
  private buildNammaMetro() {
    const metro = createNammaMetroMesh();
    metro.position.set(-30, 0, 0);
    metro.rotation.y = 0;
    this.scene.add(metro);

    this.metroTrainMesh = metro.getObjectByName('metro_train') || null;
  }

  // --- ICONIC LANDMARKS PLACEMENT ---
  private buildLandmarks() {
    // 1. Vidhana Soudha at (0, -10)
    const vidhana = createVidhanaSoudhaMesh();
    vidhana.position.set(0, 0, -45);
    vidhana.rotation.y = Math.PI;
    this.scene.add(vidhana);
    this.addBoxCollider(0, 10, -45, 52, 22, 34);

    // 2. Bangalore Palace at (-65, -70)
    const palace = createBangalorePalaceMesh();
    palace.position.set(-75, 0, -75);
    this.scene.add(palace);
    this.addBoxCollider(-75, 10, -75, 36, 20, 26);

    // 3. Majestic Bus Terminus at (-140, -40)
    const majestic = createMajesticTerminusMesh();
    majestic.position.set(-135, 0, -35);
    this.scene.add(majestic);

    // 4. UB City Sky Towers at (90, 25)
    const ubCity = createUBCityMesh();
    ubCity.position.set(85, 0, -25);
    this.scene.add(ubCity);
    this.addBoxCollider(85, 24, -25, 42, 50, 32);

    // 5. Lalbagh Glass House at (-60, 140)
    const glassHouse = createGlassHouseMesh();
    glassHouse.position.set(-60, 0, 120);
    this.scene.add(glassHouse);
    this.addBoxCollider(-60, 6, 120, 38, 12, 26);

    // 6. Hampi Stone Chariot Monument at (80, -150)
    const hampi = createHampiChariotMesh();
    hampi.position.set(75, 0, -135);
    this.scene.add(hampi);
    this.addBoxCollider(75, 4, -135, 10, 8, 12);

    // 7. Royal Dasara Festival Elephants at Lalbagh & Vidhana
    const elephant1 = createFestivalElephantMesh();
    elephant1.position.set(18, 0, 30);
    elephant1.rotation.y = -Math.PI / 4;
    this.scene.add(elephant1);

    const elephant2 = createFestivalElephantMesh();
    elephant2.position.set(-35, 0, 110);
    elephant2.rotation.y = Math.PI / 3;
    this.scene.add(elephant2);

    // 8. Commercial Street / Food Stalls
    const stallPositions = [
      [-10, 0, 12], [10, 0, 12],
      [-120, 0, -25], [60, 0, 20]
    ];
    stallPositions.forEach(p => {
      const stall = createStreetStallMesh();
      stall.position.set(p[0], p[1], p[2]);
      this.scene.add(stall);
      this.addBoxCollider(p[0], 1, p[2], 2.4, 2, 1.5);
    });
  }

  // --- FOLIAGE & BENGALURU AVENUE TREES (The Garden City) ---
  private buildFoliageAndProps() {
    // Rain trees and Gulmohar trees along boulevards
    for (let z = -150; z <= 150; z += 25) {
      if (Math.abs(z) < 20) continue; // Keep intersections clear
      // East sidewalk
      const tree1 = createTreeMesh(z % 50 === 0 ? 'gulmohar' : 'rain');
      tree1.position.set(ROAD_WIDTH / 2 + 4, 0, z);
      this.scene.add(tree1);

      // West sidewalk
      const tree2 = createTreeMesh(z % 50 === 0 ? 'palm' : 'rain');
      tree2.position.set(-ROAD_WIDTH / 2 - 4, 0, z);
      this.scene.add(tree2);

      // Streetlights
      this.buildStreetLight(ROAD_WIDTH / 2 + 2, z);
      this.buildStreetLight(-ROAD_WIDTH / 2 - 2, z);
    }

    // Cubbon Park lush groves
    for (let i = 0; i < 20; i++) {
      const x = -35 + (Math.random() - 0.5) * 50;
      const z = 40 + (Math.random() - 0.5) * 50;
      const type = i % 3 === 0 ? 'palm' : i % 2 === 0 ? 'gulmohar' : 'rain';
      const tree = createTreeMesh(type);
      tree.position.set(x, 0, z);
      this.scene.add(tree);
    }
  }

  private buildStreetLight(x: number, z: number) {
    const pole = new THREE.Mesh(
      new THREE.CylinderGeometry(0.1, 0.14, 5.5, 8),
      new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.6 })
    );
    pole.position.set(x, 2.75, z);
    this.scene.add(pole);

    const lamp = new THREE.Mesh(
      new THREE.SphereGeometry(0.3, 8, 8),
      new THREE.MeshStandardMaterial({ color: 0xFEF08A, emissive: 0xFEF08A, emissiveIntensity: 0.9 })
    );
    lamp.position.set(x, 5.5, z);
    this.scene.add(lamp);
  }

  // --- AUTHENTIC BANGALORE POTHOLES ---
  private buildPotholes() {
    // Potholes placed on main roads that jostle cars
    const holeLocations = [
      new THREE.Vector3(2.5, 0.05, 35),
      new THREE.Vector3(-3.0, 0.05, -25),
      new THREE.Vector3(125, 0.05, 65), // Silk Board approach
      new THREE.Vector3(-75, 0.05, 5),
      new THREE.Vector3(1.5, 0.05, 95),
      new THREE.Vector3(-45, 0.05, 100)
    ];

    const potholeMat = new THREE.MeshBasicMaterial({ color: 0x111827 });
    holeLocations.forEach(loc => {
      const pMesh = new THREE.Mesh(new THREE.CircleGeometry(1.6, 12).rotateX(-Math.PI / 2), potholeMat);
      pMesh.position.copy(loc);
      this.scene.add(pMesh);

      this.potholes.push({
        pos: loc,
        radius: 1.8
      });
    });
  }

  private addBoxCollider(cx: number, cy: number, cz: number, sx: number, sy: number, sz: number) {
    const box = new THREE.Box3(
      new THREE.Vector3(cx - sx / 2, cy - sy / 2, cz - sz / 2),
      new THREE.Vector3(cx + sx / 2, cy + sy / 2, cz + sz / 2)
    );
    this.colliders.push(box);
  }

  // Tick animation for moving elements (Namma Metro train, etc.)
  public update(dt: number) {
    if (this.metroTrainMesh) {
      // Loop metro back and forth along elevated viaduct
      this.metroTrainMesh.position.z += dt * 14;
      if (this.metroTrainMesh.position.z > 35) {
        this.metroTrainMesh.position.z = -35;
      }
    }
  }

  // Check collision with buildings/colliders
  public checkCollision(pos: THREE.Vector3, radius: number = 0.8): boolean {
    const sphere = new THREE.Sphere(pos, radius);
    for (const box of this.colliders) {
      if (box.intersectsSphere(sphere)) {
        return true;
      }
    }
    return false;
  }

  // Check if position is in a pothole
  public checkPothole(pos: THREE.Vector3): boolean {
    for (const hole of this.potholes) {
      const dist = pos.distanceTo(hole.pos);
      if (dist < hole.radius) {
        return true;
      }
    }
    return false;
  }
}
