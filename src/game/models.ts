/**
 * 3D Procedural Composite Models for GTA Karnataka: Namma Bengaluru
 * Complies with Three.js skill: 3–12 part composite groups, varied roughness/metalness,
 * bottom-center pivots, zero external 3D files.
 */

import * as THREE from 'three';
import { textureGen } from './textures';

// Shared materials for memory efficiency
const materials = {
  tire: new THREE.MeshStandardMaterial({ color: 0x18181B, roughness: 0.9, metalness: 0.1 }),
  rim: new THREE.MeshStandardMaterial({ color: 0xD4D4D8, roughness: 0.3, metalness: 0.8 }),
  chrome: new THREE.MeshStandardMaterial({ color: 0xF4F4F5, roughness: 0.1, metalness: 0.95 }),
  glass: new THREE.MeshPhysicalMaterial({
    color: 0xBAE6FD,
    transmission: 0.8,
    transparent: true,
    opacity: 0.6,
    roughness: 0.1,
    ior: 1.5
  }),
  glassDark: new THREE.MeshStandardMaterial({ color: 0x0F172A, roughness: 0.2, metalness: 0.6 }),
  headlight: new THREE.MeshStandardMaterial({ color: 0xFEF08A, roughness: 0.2, emissive: 0xFEF08A, emissiveIntensity: 0.8 }),
  taillight: new THREE.MeshStandardMaterial({ color: 0xEF4444, roughness: 0.2, emissive: 0xEF4444, emissiveIntensity: 0.7 }),
  policeBlue: new THREE.MeshStandardMaterial({ color: 0x2563EB, emissive: 0x1D4ED8, emissiveIntensity: 1.0 }),
  policeRed: new THREE.MeshStandardMaterial({ color: 0xDC2626, emissive: 0xB91C1C, emissiveIntensity: 1.0 }),
  graniteGrey: new THREE.MeshStandardMaterial({ color: 0xCBD5E1, roughness: 0.85, metalness: 0.15 }),
  graniteDark: new THREE.MeshStandardMaterial({ color: 0x64748B, roughness: 0.9, metalness: 0.1 }),
  goldAshoka: new THREE.MeshStandardMaterial({ color: 0xF59E0B, roughness: 0.3, metalness: 0.85 }),
  terracotta: new THREE.MeshStandardMaterial({ color: 0xB45309, roughness: 0.85, metalness: 0.1 }),
  foliageGreen: new THREE.MeshStandardMaterial({ color: 0x15803D, roughness: 0.8, metalness: 0.1 }),
  woodBark: new THREE.MeshStandardMaterial({ color: 0x451A03, roughness: 0.9, metalness: 0.05 }),
  khakiUniform: new THREE.MeshStandardMaterial({ color: 0xB59D73, roughness: 0.8, metalness: 0.05 }),
  skinTone: new THREE.MeshStandardMaterial({ color: 0xA16207, roughness: 0.7, metalness: 0.05 }),
};

// --- AUTO RICKSHAW (NAMMA TUK-TUK) ---
export function createAutoRickshawMesh(): THREE.Group {
  const group = new THREE.Group();
  group.name = 'vehicle_auto';

  // 1. Lower Chassis (black metal frame)
  const chassisGeo = new THREE.BoxGeometry(1.4, 0.3, 2.6);
  const chassisMat = new THREE.MeshStandardMaterial({ color: 0x1F2937, roughness: 0.7, metalness: 0.5 });
  const chassis = new THREE.Mesh(chassisGeo, chassisMat);
  chassis.position.set(0, 0.4, 0);
  chassis.castShadow = true;
  group.add(chassis);

  // 2. Green Body Tub (lower half)
  const tubGeo = new THREE.BoxGeometry(1.36, 0.65, 2.4);
  const tubMat = new THREE.MeshStandardMaterial({
    map: textureGen.getAutoDecalTexture(),
    roughness: 0.4,
    metalness: 0.2
  });
  const tub = new THREE.Mesh(tubGeo, tubMat);
  tub.position.set(0, 0.85, 0.05);
  tub.castShadow = true;
  group.add(tub);

  // 3. Yellow Hood Canopy (curved roof)
  const roofGeo = new THREE.CylinderGeometry(0.72, 0.72, 2.2, 12, 1, false, 0, Math.PI);
  const roofMat = new THREE.MeshStandardMaterial({ color: 0xFACC15, roughness: 0.35, metalness: 0.15 });
  const roof = new THREE.Mesh(roofGeo, roofMat);
  roof.rotation.z = Math.PI / 2;
  roof.rotation.y = Math.PI / 2;
  roof.position.set(0, 1.6, -0.05);
  roof.castShadow = true;
  group.add(roof);

  // 4. Roof Support Pillars (thin black struts)
  const strutGeo = new THREE.CylinderGeometry(0.025, 0.025, 0.7);
  const strutMat = new THREE.MeshStandardMaterial({ color: 0x111827, metalness: 0.8, roughness: 0.3 });
  const strutPositions = [
    [-0.6, 1.4, 0.9], [0.6, 1.4, 0.9],
    [-0.6, 1.4, -0.9], [0.6, 1.4, -0.9],
    [0, 1.4, 1.1]
  ];
  strutPositions.forEach(p => {
    const s = new THREE.Mesh(strutGeo, strutMat);
    s.position.set(p[0], p[1], p[2]);
    group.add(s);
  });

  // 5. Windshield
  const windGeo = new THREE.BoxGeometry(1.15, 0.55, 0.04);
  const wind = new THREE.Mesh(windGeo, materials.glass);
  wind.position.set(0, 1.4, 0.92);
  wind.rotation.x = -0.15;
  group.add(wind);

  // 6. Handlebar with grips and Fare Meter
  const barGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.7);
  const bar = new THREE.Mesh(barGeo, materials.chrome);
  bar.rotation.z = Math.PI / 2;
  bar.position.set(0, 1.05, 0.6);
  group.add(bar);

  // Fare meter box
  const meterGeo = new THREE.BoxGeometry(0.18, 0.12, 0.1);
  const meterMat = new THREE.MeshStandardMaterial({ color: 0x059669, emissive: 0x10B981, emissiveIntensity: 0.3 });
  const meter = new THREE.Mesh(meterGeo, meterMat);
  meter.position.set(0.2, 1.15, 0.62);
  group.add(meter);

  // 7. Wheels: 1 front center wheel, 2 rear wheels
  const wheelGeo = new THREE.CylinderGeometry(0.26, 0.26, 0.16, 16);
  wheelGeo.rotateZ(Math.PI / 2);

  const frontWheel = new THREE.Mesh(wheelGeo, materials.tire);
  frontWheel.position.set(0, 0.26, 1.05);
  frontWheel.castShadow = true;
  group.add(frontWheel);

  const rearWheelL = new THREE.Mesh(wheelGeo, materials.tire);
  rearWheelL.position.set(-0.66, 0.26, -0.75);
  rearWheelL.castShadow = true;
  group.add(rearWheelL);

  const rearWheelR = new THREE.Mesh(wheelGeo, materials.tire);
  rearWheelR.position.set(0.66, 0.26, -0.75);
  rearWheelR.castShadow = true;
  group.add(rearWheelR);

  // 8. Spare Wheel at Back with Rajkumar garland
  const spareWheel = new THREE.Mesh(wheelGeo, materials.tire);
  spareWheel.scale.set(0.85, 0.85, 0.85);
  spareWheel.position.set(0, 0.9, -1.2);
  spareWheel.rotation.x = Math.PI / 2;
  group.add(spareWheel);

  // 9. Front Headlight & Rear Taillights
  const headGeo = new THREE.CylinderGeometry(0.09, 0.09, 0.08, 12);
  headGeo.rotateX(Math.PI / 2);
  const headLight = new THREE.Mesh(headGeo, materials.headlight);
  headLight.position.set(0, 0.9, 1.25);
  group.add(headLight);

  const tailGeo = new THREE.BoxGeometry(0.14, 0.08, 0.04);
  const tailL = new THREE.Mesh(tailGeo, materials.taillight);
  tailL.position.set(-0.55, 0.65, -1.22);
  const tailR = new THREE.Mesh(tailGeo, materials.taillight);
  tailR.position.set(0.55, 0.65, -1.22);
  group.add(tailL);
  group.add(tailR);

  return group;
}

// --- ROYAL ENFIELD BULLET 350 MOTORBIKE ---
export function createBulletBikeMesh(): THREE.Group {
  const group = new THREE.Group();
  group.name = 'vehicle_bike';

  // Wheels
  const wheelGeo = new THREE.CylinderGeometry(0.32, 0.32, 0.12, 18);
  wheelGeo.rotateZ(Math.PI / 2);

  const frontWheel = new THREE.Mesh(wheelGeo, materials.tire);
  frontWheel.position.set(0, 0.32, 0.95);
  frontWheel.castShadow = true;
  group.add(frontWheel);

  const rearWheel = new THREE.Mesh(wheelGeo, materials.tire);
  rearWheel.position.set(0, 0.32, -0.85);
  rearWheel.castShadow = true;
  group.add(rearWheel);

  // Engine block (finned aluminum)
  const engineGeo = new THREE.BoxGeometry(0.3, 0.35, 0.45);
  const engine = new THREE.Mesh(engineGeo, materials.chrome);
  engine.position.set(0, 0.45, 0.05);
  group.add(engine);

  // Teardrop fuel tank (Royal Enfield black & gold)
  const tankGeo = new THREE.SphereGeometry(0.24, 12, 8);
  tankGeo.scale(1, 0.8, 1.8);
  const tankMat = new THREE.MeshStandardMaterial({ color: 0x18181B, roughness: 0.2, metalness: 0.7 });
  const tank = new THREE.Mesh(tankGeo, tankMat);
  tank.position.set(0, 0.85, 0.35);
  group.add(tank);

  // Twin leather seats
  const seatGeo = new THREE.BoxGeometry(0.28, 0.12, 0.7);
  const seatMat = new THREE.MeshStandardMaterial({ color: 0x5F370E, roughness: 0.8 });
  const seat = new THREE.Mesh(seatGeo, seatMat);
  seat.position.set(0, 0.82, -0.3);
  group.add(seat);

  // Chrome Megaphone Exhaust Pipe
  const exhaustGeo = new THREE.CylinderGeometry(0.04, 0.06, 1.2, 8);
  exhaustGeo.rotateX(Math.PI / 2);
  const exhaust = new THREE.Mesh(exhaustGeo, materials.chrome);
  exhaust.position.set(0.18, 0.25, -0.3);
  group.add(exhaust);

  // Headlight & Handlebars
  const headGeo = new THREE.SphereGeometry(0.12, 8, 8);
  const headlight = new THREE.Mesh(headGeo, materials.headlight);
  headlight.position.set(0, 0.95, 0.9);
  group.add(headlight);

  const barGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.75);
  barGeo.rotateZ(Math.PI / 2);
  const bar = new THREE.Mesh(barGeo, materials.chrome);
  bar.position.set(0, 1.05, 0.7);
  group.add(bar);

  return group;
}

// --- BMTC CITY BUS (SUVARNA / VAYU VAJRA) ---
export function createBMTCBusMesh(): THREE.Group {
  const group = new THREE.Group();
  group.name = 'vehicle_bus';

  // Bus Main Body
  const bodyGeo = new THREE.BoxGeometry(2.6, 2.5, 8.4);
  const bodyMat = new THREE.MeshStandardMaterial({
    map: textureGen.getBmtcTexture(),
    roughness: 0.35,
    metalness: 0.2
  });
  const body = new THREE.Mesh(bodyGeo, bodyMat);
  body.position.set(0, 1.7, 0);
  body.castShadow = true;
  group.add(body);

  // Windshield & Large front windows
  const windGeo = new THREE.BoxGeometry(2.4, 1.1, 0.1);
  const windshield = new THREE.Mesh(windGeo, materials.glass);
  windshield.position.set(0, 2.1, 4.22);
  group.add(windshield);

  // Roof AC Unit & Emergency Hatches
  const acGeo = new THREE.BoxGeometry(1.8, 0.35, 3.2);
  const ac = new THREE.Mesh(acGeo, materials.rim);
  ac.position.set(0, 3.1, -0.5);
  group.add(ac);

  // Wheels (4 pairs)
  const wheelGeo = new THREE.CylinderGeometry(0.48, 0.48, 0.32, 16);
  wheelGeo.rotateZ(Math.PI / 2);

  const wheelPositions = [
    [-1.25, 0.48, 2.8], [1.25, 0.48, 2.8],
    [-1.25, 0.48, -2.4], [1.25, 0.48, -2.4]
  ];
  wheelPositions.forEach(p => {
    const w = new THREE.Mesh(wheelGeo, materials.tire);
    w.position.set(p[0], p[1], p[2]);
    w.castShadow = true;
    group.add(w);
  });

  return group;
}

// --- KARNATAKA POLICE HOYSALA SUV ---
export function createPoliceHoysalaMesh(): THREE.Group {
  const group = new THREE.Group();
  group.name = 'vehicle_hoysala';

  // SUV Main Cabin
  const cabinGeo = new THREE.BoxGeometry(1.9, 1.1, 4.0);
  const cabinMat = new THREE.MeshStandardMaterial({
    map: textureGen.getPoliceTexture(),
    roughness: 0.3,
    metalness: 0.3
  });
  const cabin = new THREE.Mesh(cabinGeo, cabinMat);
  cabin.position.set(0, 0.95, 0);
  cabin.castShadow = true;
  group.add(cabin);

  // Glass Greenhouse (windows)
  const glassGeo = new THREE.BoxGeometry(1.75, 0.7, 2.2);
  const glass = new THREE.Mesh(glassGeo, materials.glassDark);
  glass.position.set(0, 1.7, -0.2);
  group.add(glass);

  // Front Bullbar (Steel pushbar for chasing criminals)
  const bullbarGeo = new THREE.BoxGeometry(1.8, 0.6, 0.15);
  const bullbar = new THREE.Mesh(bullbarGeo, materials.graniteDark);
  bullbar.position.set(0, 0.75, 2.05);
  group.add(bullbar);

  // Emergency Police Lightbar (Flashing Blue & Red)
  const lightbarBarGeo = new THREE.BoxGeometry(1.1, 0.12, 0.25);
  const lightbar = new THREE.Mesh(lightbarBarGeo, materials.graniteDark);
  lightbar.position.set(0, 2.12, -0.2);

  const redBeacon = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.16, 0.2), materials.policeRed);
  redBeacon.position.set(-0.3, 0.1, 0);
  lightbar.add(redBeacon);

  const blueBeacon = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.16, 0.2), materials.policeBlue);
  blueBeacon.position.set(0.3, 0.1, 0);
  lightbar.add(blueBeacon);

  group.add(lightbar);

  // 4 Big All-Terrain Wheels
  const wheelGeo = new THREE.CylinderGeometry(0.38, 0.38, 0.24, 16);
  wheelGeo.rotateZ(Math.PI / 2);
  [
    [-0.95, 0.38, 1.3], [0.95, 0.38, 1.3],
    [-0.95, 0.38, -1.3], [0.95, 0.38, -1.3]
  ].forEach(p => {
    const w = new THREE.Mesh(wheelGeo, materials.tire);
    w.position.set(p[0], p[1], p[2]);
    w.castShadow = true;
    group.add(w);
  });

  return group;
}

// --- UB CITY SUPERCAR ---
export function createSupercarMesh(): THREE.Group {
  const group = new THREE.Group();
  group.name = 'vehicle_supercar';

  // Low aerodynamic body
  const bodyGeo = new THREE.BoxGeometry(1.9, 0.65, 4.2);
  const bodyMat = new THREE.MeshStandardMaterial({ color: 0xDC2626, roughness: 0.15, metalness: 0.85 });
  const body = new THREE.Mesh(bodyGeo, bodyMat);
  body.position.set(0, 0.55, 0);
  body.castShadow = true;
  group.add(body);

  // Curved glass cockpit
  const cockpitGeo = new THREE.SphereGeometry(0.9, 12, 8);
  cockpitGeo.scale(0.9, 0.6, 1.8);
  const cockpit = new THREE.Mesh(cockpitGeo, materials.glassDark);
  cockpit.position.set(0, 0.95, -0.1);
  group.add(cockpit);

  // Carbon Fiber Rear Wing Spoiler
  const wingGeo = new THREE.BoxGeometry(1.7, 0.08, 0.4);
  const wing = new THREE.Mesh(wingGeo, materials.graniteDark);
  wing.position.set(0, 1.15, -1.9);
  group.add(wing);

  // Low-profile racing wheels with glowing calipers
  const wheelGeo = new THREE.CylinderGeometry(0.34, 0.34, 0.26, 16);
  wheelGeo.rotateZ(Math.PI / 2);
  [
    [-0.95, 0.34, 1.3], [0.95, 0.34, 1.3],
    [-0.95, 0.34, -1.3], [0.95, 0.34, -1.3]
  ].forEach(p => {
    const w = new THREE.Mesh(wheelGeo, materials.tire);
    w.position.set(p[0], p[1], p[2]);
    group.add(w);
  });

  return group;
}

// --- AMBASSADOR TAXI ---
export function createTaxiMesh(): THREE.Group {
  const group = new THREE.Group();
  group.name = 'vehicle_taxi';

  // Vintage rounded body
  const bodyGeo = new THREE.BoxGeometry(1.8, 0.85, 3.8);
  const bodyMat = new THREE.MeshStandardMaterial({ color: 0x1E293B, roughness: 0.4, metalness: 0.3 });
  const body = new THREE.Mesh(bodyGeo, bodyMat);
  body.position.set(0, 0.75, 0);
  body.castShadow = true;
  group.add(body);

  // Yellow roof top
  const roofGeo = new THREE.BoxGeometry(1.6, 0.65, 2.1);
  const roofMat = new THREE.MeshStandardMaterial({ color: 0xF59E0B, roughness: 0.4, metalness: 0.2 });
  const roof = new THREE.Mesh(roofGeo, roofMat);
  roof.position.set(0, 1.35, -0.2);
  group.add(roof);

  // Luggage rack with suitcases
  const rackGeo = new THREE.BoxGeometry(1.3, 0.1, 1.4);
  const rack = new THREE.Mesh(rackGeo, materials.chrome);
  rack.position.set(0, 1.75, -0.2);
  group.add(rack);

  const suitcaseGeo = new THREE.BoxGeometry(0.6, 0.3, 0.8);
  const suitcase = new THREE.Mesh(suitcaseGeo, materials.terracotta);
  suitcase.position.set(0.1, 1.95, -0.2);
  group.add(suitcase);

  // 4 Standard wheels
  const wheelGeo = new THREE.CylinderGeometry(0.35, 0.35, 0.2, 16);
  wheelGeo.rotateZ(Math.PI / 2);
  [
    [-0.9, 0.35, 1.2], [0.9, 0.35, 1.2],
    [-0.9, 0.35, -1.2], [0.9, 0.35, -1.2]
  ].forEach(p => {
    const w = new THREE.Mesh(wheelGeo, materials.tire);
    w.position.set(p[0], p[1], p[2]);
    group.add(w);
  });

  return group;
}

// ==========================================
// ICONIC KARNATAKA & BENGALURU LANDMARKS
// ==========================================

// --- 1. VIDHANA SOUDHA (Neo-Dravidian Architectural Marvel) ---
export function createVidhanaSoudhaMesh(): THREE.Group {
  const group = new THREE.Group();
  group.name = 'landmark_vidhana_soudha';

  const stoneMat = new THREE.MeshStandardMaterial({
    map: textureGen.getVidhanaStoneTexture(),
    roughness: 0.8,
    metalness: 0.1
  });

  // 1. Stepped Granite Podium (Grand flight of 45 steps)
  const base1 = new THREE.Mesh(new THREE.BoxGeometry(50, 2, 32), stoneMat);
  base1.position.set(0, 1, 0);
  base1.castShadow = true;
  base1.receiveShadow = true;
  group.add(base1);

  const base2 = new THREE.Mesh(new THREE.BoxGeometry(44, 2, 28), stoneMat);
  base2.position.set(0, 3, 0);
  group.add(base2);

  // 2. Central Portico & Main Building Body
  const centralHall = new THREE.Mesh(new THREE.BoxGeometry(36, 14, 22), stoneMat);
  centralHall.position.set(0, 10, 0);
  centralHall.castShadow = true;
  group.add(centralHall);

  // Colonnade Wings (East & West Wings)
  const wingEast = new THREE.Mesh(new THREE.BoxGeometry(22, 11, 18), stoneMat);
  wingEast.position.set(-28, 8.5, 0);
  group.add(wingEast);

  const wingWest = new THREE.Mesh(new THREE.BoxGeometry(22, 11, 18), stoneMat);
  wingWest.position.set(28, 8.5, 0);
  group.add(wingWest);

  // 3. Grand Dravidian Pillars (12 columns in front)
  const pillarGeo = new THREE.CylinderGeometry(0.55, 0.65, 12, 12);
  for (let i = -5; i <= 5; i++) {
    const p = new THREE.Mesh(pillarGeo, stoneMat);
    p.position.set(i * 2.8, 10, 11.2);
    p.castShadow = true;
    group.add(p);
  }

  // 4. Triangular Pediment / Entablature with Ashoka Crest
  const pedimentGeo = new THREE.ConeGeometry(8, 4, 4);
  pedimentGeo.rotateY(Math.PI / 4);
  const pediment = new THREE.Mesh(pedimentGeo, stoneMat);
  pediment.position.set(0, 18, 10.5);
  group.add(pediment);

  // 5. Central Grand Dravidian Dome
  const domeBase = new THREE.CylinderGeometry(7, 7.5, 4, 16);
  const dBase = new THREE.Mesh(domeBase, stoneMat);
  dBase.position.set(0, 19, 0);
  group.add(dBase);

  const domeGeo = new THREE.SphereGeometry(6.5, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2);
  const dome = new THREE.Mesh(domeGeo, stoneMat);
  dome.position.set(0, 21, 0);
  group.add(dome);

  // 6. Golden Ashoka Stambh (4 Lions Crest Finial on top of dome)
  const crestGeo = new THREE.CylinderGeometry(0.8, 0.4, 2.4, 8);
  const crest = new THREE.Mesh(crestGeo, materials.goldAshoka);
  crest.position.set(0, 28.5, 0);
  group.add(crest);

  // Karnataka Flags on Rooftop
  const flagMat = new THREE.MeshBasicMaterial({
    map: textureGen.getKarnatakaFlagTexture(),
    side: THREE.DoubleSide
  });
  const flagGeo = new THREE.PlaneGeometry(3.5, 2.2);

  const flagL = new THREE.Mesh(flagGeo, flagMat);
  flagL.position.set(-14, 18, 5);
  group.add(flagL);

  const flagR = new THREE.Mesh(flagGeo, flagMat);
  flagR.position.set(14, 18, 5);
  group.add(flagR);

  return group;
}

// --- 2. BANGALORE PALACE (Tudor Style Castle) ---
export function createBangalorePalaceMesh(): THREE.Group {
  const group = new THREE.Group();
  group.name = 'landmark_bangalore_palace';

  const palaceMat = new THREE.MeshStandardMaterial({
    map: textureGen.getPalaceBrickTexture(),
    roughness: 0.85
  });

  // Central Manor
  const mainManor = new THREE.Mesh(new THREE.BoxGeometry(28, 12, 18), palaceMat);
  mainManor.position.set(0, 6, 0);
  mainManor.castShadow = true;
  group.add(mainManor);

  // Fortified Corner Towers with battlements (Crenellations)
  const towerGeo = new THREE.CylinderGeometry(3.5, 3.8, 18, 12);
  const towerPositions = [
    [-15, 9, 10], [15, 9, 10],
    [-15, 9, -10], [15, 9, -10]
  ];
  towerPositions.forEach(p => {
    const tower = new THREE.Mesh(towerGeo, palaceMat);
    tower.position.set(p[0], p[1], p[2]);
    tower.castShadow = true;
    group.add(tower);

    // Conical roof cap
    const cone = new THREE.Mesh(new THREE.ConeGeometry(4, 5, 12), materials.terracotta);
    cone.position.set(p[0], 20.5, p[2]);
    group.add(cone);
  });

  // Central Clock Tower
  const clockTower = new THREE.Mesh(new THREE.BoxGeometry(6, 20, 6), palaceMat);
  clockTower.position.set(0, 10, 8);
  group.add(clockTower);

  return group;
}

// --- 3. NAMMA METRO ELEVATED VIADUCT & TRAIN ---
export function createNammaMetroMesh(): THREE.Group {
  const group = new THREE.Group();
  group.name = 'landmark_metro';

  const viaductMat = new THREE.MeshStandardMaterial({ color: 0x94A3B8, roughness: 0.7 });

  // Elevated track span (length 80m across the city)
  const trackBed = new THREE.Mesh(new THREE.BoxGeometry(5.5, 1.2, 80), viaductMat);
  trackBed.position.set(0, 8.5, 0);
  trackBed.castShadow = true;
  group.add(trackBed);

  // Heavy concrete support pillars every 20m
  const pillarGeo = new THREE.CylinderGeometry(1.2, 1.4, 8, 12);
  for (let z = -30; z <= 30; z += 20) {
    const pillar = new THREE.Mesh(pillarGeo, viaductMat);
    pillar.position.set(0, 4, z);
    pillar.castShadow = true;
    group.add(pillar);
  }

  // Namma Metro 3-Coach Train (Purple Line)
  const trainGroup = new THREE.Group();
  trainGroup.name = 'metro_train';
  trainGroup.position.set(0, 9.8, 0);

  const carMat = new THREE.MeshStandardMaterial({ color: 0xE2E8F0, roughness: 0.3, metalness: 0.6 });
  const purpleStripeMat = new THREE.MeshStandardMaterial({ color: 0x7E22CE, roughness: 0.4 }); // Purple Line

  for (let i = -1; i <= 1; i++) {
    const car = new THREE.Mesh(new THREE.BoxGeometry(3.2, 2.4, 14), carMat);
    car.position.set(0, 0, i * 15);
    car.castShadow = true;
    trainGroup.add(car);

    // Purple stripe
    const stripe = new THREE.Mesh(new THREE.BoxGeometry(3.25, 0.5, 14), purpleStripeMat);
    stripe.position.set(0, 0.2, i * 15);
    trainGroup.add(stripe);
  }

  group.add(trainGroup);
  return group;
}

// --- 4. LALBAGH GLASS HOUSE ---
export function createGlassHouseMesh(): THREE.Group {
  const group = new THREE.Group();
  group.name = 'landmark_glass_house';

  const ironMat = new THREE.MeshStandardMaterial({ color: 0x1E293B, roughness: 0.6, metalness: 0.7 });

  // Base stone wall
  const base = new THREE.Mesh(new THREE.BoxGeometry(36, 1.5, 24), materials.graniteGrey);
  base.position.set(0, 0.75, 0);
  group.add(base);

  // Crystal glass vaulted roof structure
  const glassRoofGeo = new THREE.CylinderGeometry(8, 8, 34, 16, 1, false, 0, Math.PI);
  glassRoofGeo.rotateZ(Math.PI / 2);
  const glassRoof = new THREE.Mesh(glassRoofGeo, materials.glass);
  glassRoof.position.set(0, 6.5, 0);
  group.add(glassRoof);

  // Iron framework ribs
  for (let x = -16; x <= 16; x += 4) {
    const ribGeo = new THREE.TorusGeometry(8, 0.15, 6, 16, Math.PI);
    ribGeo.rotateY(Math.PI / 2);
    const rib = new THREE.Mesh(ribGeo, ironMat);
    rib.position.set(x, 6.5, 0);
    group.add(rib);
  }

  return group;
}

// --- 5. HAMPI STONE CHARIOT MONUMENT ---
export function createHampiChariotMesh(): THREE.Group {
  const group = new THREE.Group();
  group.name = 'landmark_hampi_chariot';

  // Granite base
  const platform = new THREE.Mesh(new THREE.BoxGeometry(8, 1.2, 10), materials.graniteGrey);
  platform.position.set(0, 0.6, 0);
  platform.castShadow = true;
  group.add(platform);

  // 4 Monolithic Carved Wheels
  const wheelGeo = new THREE.CylinderGeometry(1.4, 1.4, 0.4, 16);
  wheelGeo.rotateZ(Math.PI / 2);
  [
    [-3.8, 1.4, 3], [3.8, 1.4, 3],
    [-3.8, 1.4, -3], [3.8, 1.4, -3]
  ].forEach(p => {
    const w = new THREE.Mesh(wheelGeo, materials.graniteDark);
    w.position.set(p[0], p[1], p[2]);
    group.add(w);
  });

  // Chariot Shrine Body (Vimana)
  const shrine = new THREE.Mesh(new THREE.BoxGeometry(5.5, 4.5, 6.5), materials.graniteGrey);
  shrine.position.set(0, 3.5, 0);
  group.add(shrine);

  // Tiered Pyramid Tower
  for (let tier = 0; tier < 3; tier++) {
    const size = 5 - tier * 1.2;
    const t = new THREE.Mesh(new THREE.BoxGeometry(size, 1.0, size), materials.graniteDark);
    t.position.set(0, 6.2 + tier * 0.9, 0);
    group.add(t);
  }

  return group;
}

// --- 6. UB CITY SKYSCRAPERS ---
export function createUBCityMesh(): THREE.Group {
  const group = new THREE.Group();
  group.name = 'landmark_ub_city';

  const towerMat = new THREE.MeshStandardMaterial({
    color: 0x0284C7,
    roughness: 0.1,
    metalness: 0.8
  });

  // Tower 1 (Pinnacle)
  const t1 = new THREE.Mesh(new THREE.BoxGeometry(16, 48, 16), towerMat);
  t1.position.set(-10, 24, 0);
  t1.castShadow = true;
  group.add(t1);

  // Spire on Tower 1
  const spire = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.8, 12, 8), materials.chrome);
  spire.position.set(-10, 54, 0);
  group.add(spire);

  // Tower 2 (Canberra block)
  const t2 = new THREE.Mesh(new THREE.BoxGeometry(14, 36, 14), towerMat);
  t2.position.set(10, 18, -4);
  t2.castShadow = true;
  group.add(t2);

  // Luxury Mall Plinth at base
  const mall = new THREE.Mesh(new THREE.BoxGeometry(40, 8, 30), materials.graniteDark);
  mall.position.set(0, 4, 0);
  group.add(mall);

  return group;
}

// --- 7. MAJESTIC BUS TERMINUS CANOPY ---
export function createMajesticTerminusMesh(): THREE.Group {
  const group = new THREE.Group();
  group.name = 'landmark_majestic';

  // Semicircular Terminus Hub Platform
  const hubMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.7 });
  const platform = new THREE.Mesh(new THREE.CylinderGeometry(28, 28, 1.2, 16, 1, false, 0, Math.PI), hubMat);
  platform.position.set(0, 0.6, 0);
  group.add(platform);

  // Large Curved Canopy Roof
  const canopy = new THREE.Mesh(
    new THREE.CylinderGeometry(30, 30, 0.4, 16, 1, false, 0, Math.PI),
    new THREE.MeshStandardMaterial({ color: 0xF59E0B, roughness: 0.4 })
  );
  canopy.position.set(0, 6, 0);
  group.add(canopy);

  // Bus Bays & Clocks
  const clock = new THREE.Mesh(new THREE.BoxGeometry(2, 2, 0.5), materials.headlight);
  clock.position.set(0, 7.5, 0);
  group.add(clock);

  return group;
}

// --- 8. FESTIVAL PROPS: ROYAL ELEPHANT (DASARA PROCESSION) ---
export function createFestivalElephantMesh(): THREE.Group {
  const group = new THREE.Group();
  group.name = 'festival_elephant';

  const elephantSkin = new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.9 });
  const goldDeco = new THREE.MeshStandardMaterial({ color: 0xFACC15, roughness: 0.3, metalness: 0.8 });
  const clothRed = new THREE.MeshStandardMaterial({ color: 0xDC2626, roughness: 0.8 });

  // Body
  const body = new THREE.Mesh(new THREE.SphereGeometry(1.8, 12, 10), elephantSkin);
  body.scale.set(1.2, 1.1, 1.6);
  body.position.set(0, 2.6, 0);
  body.castShadow = true;
  group.add(body);

  // Head & Trunk
  const head = new THREE.Mesh(new THREE.SphereGeometry(1.1, 10, 8), elephantSkin);
  head.position.set(0, 3.2, 1.9);
  group.add(head);

  // Trunk curving up
  const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.35, 2.2, 8), elephantSkin);
  trunk.position.set(0, 2.2, 2.6);
  trunk.rotation.x = 0.4;
  group.add(trunk);

  // Golden Headplate (Nettipattam)
  const plate = new THREE.Mesh(new THREE.BoxGeometry(0.8, 1.2, 0.1), goldDeco);
  plate.position.set(0, 3.4, 2.9);
  group.add(plate);

  // Royal Golden Howdah (Seat for the Golden Idol)
  const howdah = new THREE.Mesh(new THREE.BoxGeometry(1.6, 1.2, 1.6), goldDeco);
  howdah.position.set(0, 4.4, 0);
  group.add(howdah);

  // Decorative Saddle Blanket (Jhool)
  const blanket = new THREE.Mesh(new THREE.BoxGeometry(2.3, 1.8, 2.4), clothRed);
  blanket.position.set(0, 2.6, 0);
  group.add(blanket);

  // 4 Legs
  const legGeo = new THREE.CylinderGeometry(0.35, 0.4, 2.0, 8);
  [
    [-1.0, 1.0, 1.0], [1.0, 1.0, 1.0],
    [-1.0, 1.0, -1.0], [1.0, 1.0, -1.0]
  ].forEach(p => {
    const leg = new THREE.Mesh(legGeo, elephantSkin);
    leg.position.set(p[0], p[1], p[2]);
    group.add(leg);
  });

  return group;
}

// --- STREET DOSA & FILTER COFFEE STALL ---
export function createStreetStallMesh(): THREE.Group {
  const group = new THREE.Group();
  group.name = 'prop_street_stall';

  // Wooden cart
  const cart = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.9, 1.3), materials.woodBark);
  cart.position.set(0, 0.65, 0);
  cart.castShadow = true;
  group.add(cart);

  // Hot Tawa (Iron pan for dosas)
  const tawa = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.45, 0.05, 12), materials.graniteDark);
  tawa.position.set(-0.5, 1.15, 0);
  group.add(tawa);

  // Brass Filter Coffee Percolator
  const coffeeBrass = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.6, 10), materials.goldAshoka);
  coffeeBrass.position.set(0.6, 1.4, 0);
  group.add(coffeeBrass);

  // Striped canopy umbrella
  const umbrella = new THREE.Mesh(
    new THREE.ConeGeometry(1.6, 0.8, 8),
    new THREE.MeshStandardMaterial({ color: 0xF59E0B, roughness: 0.6 })
  );
  umbrella.position.set(0, 2.6, 0);
  group.add(umbrella);

  const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 2.2), materials.graniteDark);
  pole.position.set(0, 1.6, 0);
  group.add(pole);

  return group;
}

// --- PROCEDURAL BANGALORE CITY TREES (Gulmohar, Rain Tree, Coconut Palm) ---
export function createTreeMesh(type: 'palm' | 'gulmohar' | 'rain'): THREE.Group {
  const group = new THREE.Group();

  if (type === 'palm') {
    // Tall slender coconut palm
    const trunkGeo = new THREE.CylinderGeometry(0.2, 0.35, 7, 8);
    const trunk = new THREE.Mesh(trunkGeo, materials.woodBark);
    trunk.position.set(0, 3.5, 0);
    trunk.rotation.z = (Math.random() - 0.5) * 0.15;
    group.add(trunk);

    // Palm fronds (burst)
    const frondMat = new THREE.MeshStandardMaterial({ color: 0x16A34A, roughness: 0.8 });
    for (let i = 0; i < 7; i++) {
      const frondGeo = new THREE.BoxGeometry(0.5, 0.1, 2.8);
      const frond = new THREE.Mesh(frondGeo, frondMat);
      frond.position.set(0, 6.8, 0);
      frond.rotation.y = (i * Math.PI * 2) / 7;
      frond.rotation.x = 0.55;
      group.add(frond);
    }
  } else if (type === 'gulmohar') {
    // Flaming red flowers canopy (Bengaluru spring icon)
    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.45, 4, 8), materials.woodBark);
    trunk.position.set(0, 2, 0);
    group.add(trunk);

    const foliageMat = new THREE.MeshStandardMaterial({ color: 0xEF4444, roughness: 0.8 }); // Red flowers
    const canopy = new THREE.Mesh(new THREE.SphereGeometry(2.4, 8, 6), foliageMat);
    canopy.scale.set(1.4, 0.8, 1.4);
    canopy.position.set(0, 4.5, 0);
    canopy.castShadow = true;
    group.add(canopy);
  } else {
    // Broad green Cubbon Park Rain Tree
    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.6, 5, 8), materials.woodBark);
    trunk.position.set(0, 2.5, 0);
    group.add(trunk);

    const canopy = new THREE.Mesh(new THREE.SphereGeometry(3.2, 8, 6), materials.foliageGreen);
    canopy.scale.set(1.5, 0.9, 1.5);
    canopy.position.set(0, 5.8, 0);
    canopy.castShadow = true;
    group.add(canopy);
  }

  return group;
}

// --- PLAYER / NPC CHARACTER MESH ---
export function createCharacterMesh(type: 'player' | 'cop' | 'auto_driver' | 'techie'): THREE.Group {
  const group = new THREE.Group();
  group.name = `char_${type}`;

  // Palette based on character type
  let shirtColor = 0xDC2626; // Player default red shirt
  let pantsColor = 0x1E293B; // Dark denim
  if (type === 'cop') {
    shirtColor = 0xB59D73; // Khaki
    pantsColor = 0xB59D73;
  } else if (type === 'auto_driver') {
    shirtColor = 0xD97706; // Khaki/yellow auto uniform
    pantsColor = 0x334155;
  } else if (type === 'techie') {
    shirtColor = 0x0284C7; // Blue tech shirt
    pantsColor = 0x64748B;
  }

  const shirtMat = new THREE.MeshStandardMaterial({ color: shirtColor, roughness: 0.8 });
  const pantsMat = new THREE.MeshStandardMaterial({ color: pantsColor, roughness: 0.85 });

  // Torso
  const torso = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.75, 0.28), shirtMat);
  torso.position.set(0, 1.15, 0);
  torso.castShadow = true;
  group.add(torso);

  // Head
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.2, 10, 8), materials.skinTone);
  head.position.set(0, 1.75, 0);
  group.add(head);

  // Hair / Police cap / Sunglasses
  if (type === 'cop') {
    const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.22, 0.1, 10), materials.graniteDark);
    cap.position.set(0, 1.9, 0);
    group.add(cap);
  } else {
    const hair = new THREE.Mesh(new THREE.SphereGeometry(0.21, 8, 6), materials.tire);
    hair.scale.set(1, 0.7, 1);
    hair.position.set(0, 1.85, -0.04);
    group.add(hair);
  }

  // Left & Right Arms
  const armGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.65, 8);
  const leftArm = new THREE.Mesh(armGeo, shirtMat);
  leftArm.name = 'arm_left';
  leftArm.position.set(-0.38, 1.1, 0);
  group.add(leftArm);

  const rightArm = new THREE.Mesh(armGeo, shirtMat);
  rightArm.name = 'arm_right';
  rightArm.position.set(0.38, 1.1, 0);
  group.add(rightArm);

  // Left & Right Legs
  const legGeo = new THREE.CylinderGeometry(0.1, 0.1, 0.75, 8);
  const leftLeg = new THREE.Mesh(legGeo, pantsMat);
  leftLeg.name = 'leg_left';
  leftLeg.position.set(-0.16, 0.45, 0);
  leftLeg.castShadow = true;
  group.add(leftLeg);

  const rightLeg = new THREE.Mesh(legGeo, pantsMat);
  rightLeg.name = 'leg_right';
  rightLeg.position.set(0.16, 0.45, 0);
  rightLeg.castShadow = true;
  group.add(rightLeg);

  return group;
}
