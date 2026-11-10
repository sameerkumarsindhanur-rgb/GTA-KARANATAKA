/**
 * Vibrant Cultural Festivals Manager for GTA Karnataka
 * Manages live festival events: Kannada Rajyotsava, Bengaluru Karaga,
 * Bengaluru Ganesha Utsava & Dasara, and Coastal Kambala sprint.
 */

import * as THREE from 'three';
import { FESTIVALS, FestivalEvent } from './constants';
import { soundEngine } from '../audio/SoundEngine';

export class FestivalManager {
  public scene: THREE.Scene;
  public currentFestival: FestivalEvent = FESTIVALS[0]; // Default: Kannada Rajyotsava
  public particleSystem: THREE.Points | null = null;
  private particlePositions: Float32Array | null = null;
  private particleColors: Float32Array | null = null;
  private particleVelocities: THREE.Vector3[] = [];
  private numParticles: number = 400;

  constructor(scene: THREE.Scene) {
    this.scene = scene;
    this.initFestivalParticles();
  }

  private initFestivalParticles() {
    const geo = new THREE.BufferGeometry();
    this.particlePositions = new Float32Array(this.numParticles * 3);
    this.particleColors = new Float32Array(this.numParticles * 3);

    for (let i = 0; i < this.numParticles; i++) {
      this.particlePositions[i * 3] = (Math.random() - 0.5) * 120;
      this.particlePositions[i * 3 + 1] = 5 + Math.random() * 25;
      this.particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 120;

      // Rajyotsava yellow & red
      const isYellow = Math.random() > 0.5;
      this.particleColors[i * 3] = isYellow ? 0.98 : 0.86;
      this.particleColors[i * 3 + 1] = isYellow ? 0.8 : 0.15;
      this.particleColors[i * 3 + 2] = 0.1;

      this.particleVelocities.push(
        new THREE.Vector3(
          (Math.random() - 0.5) * 2,
          -1 - Math.random() * 2,
          (Math.random() - 0.5) * 2
        )
      );
    }

    geo.setAttribute('position', new THREE.BufferAttribute(this.particlePositions, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(this.particleColors, 3));

    const mat = new THREE.PointsMaterial({
      size: 0.6,
      vertexColors: true,
      transparent: true,
      opacity: 0.85
    });

    this.particleSystem = new THREE.Points(geo, mat);
    this.scene.add(this.particleSystem);
  }

  public setFestival(festivalId: string) {
    const found = FESTIVALS.find(f => f.id === festivalId);
    if (!found) return;
    this.currentFestival = found;

    // Trigger celebration sound
    soundEngine.playDolluDrum(true);
    soundEngine.playMissionSuccess();

    // Update particle colors
    if (this.particleColors && this.particleSystem) {
      for (let i = 0; i < this.numParticles; i++) {
        if (found.id === 'rajyotsava') {
          const isYellow = Math.random() > 0.5;
          this.particleColors[i * 3] = isYellow ? 0.98 : 0.86;
          this.particleColors[i * 3 + 1] = isYellow ? 0.8 : 0.15;
          this.particleColors[i * 3 + 2] = 0.1;
        } else if (found.id === 'karaga') {
          // Mystical purple & white jasmine
          this.particleColors[i * 3] = 0.8;
          this.particleColors[i * 3 + 1] = 0.4;
          this.particleColors[i * 3 + 2] = 1.0;
        } else if (found.id === 'ganesha') {
          // Marigold orange & saffron
          this.particleColors[i * 3] = 0.95;
          this.particleColors[i * 3 + 1] = 0.45;
          this.particleColors[i * 3 + 2] = 0.05;
        } else {
          // Kambala mud & golden splash
          this.particleColors[i * 3] = 0.7;
          this.particleColors[i * 3 + 1] = 0.5;
          this.particleColors[i * 3 + 2] = 0.2;
        }
      }
      this.particleSystem.geometry.attributes.color.needsUpdate = true;
    }
  }

  public update(dt: number, playerPos: THREE.Vector3) {
    if (!this.particleSystem || !this.particlePositions) return;

    // Follow player loosely in sky
    this.particleSystem.position.x = playerPos.x;
    this.particleSystem.position.z = playerPos.z;

    for (let i = 0; i < this.numParticles; i++) {
      this.particlePositions[i * 3 + 1] += this.particleVelocities[i].y * dt;
      this.particlePositions[i * 3] += this.particleVelocities[i].x * dt;
      this.particlePositions[i * 3 + 2] += this.particleVelocities[i].z * dt;

      // Wrap around top
      if (this.particlePositions[i * 3 + 1] < 0) {
        this.particlePositions[i * 3 + 1] = 25;
        this.particlePositions[i * 3] = (Math.random() - 0.5) * 80;
        this.particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 80;
      }
    }

    this.particleSystem.geometry.attributes.position.needsUpdate = true;
  }
}
