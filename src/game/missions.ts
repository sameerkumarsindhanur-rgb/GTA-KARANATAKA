/**
 * Mission & Crime Syndicate Quest Manager for GTA Karnataka
 * Tracks story missions, objective waypoints, time limits, dialogue lines,
 * cash rewards, and reputation gains.
 */

import * as THREE from 'three';
import { MISSIONS, Mission } from './constants';
import { soundEngine } from '../audio/SoundEngine';

export class MissionManager {
  public scene: THREE.Scene;
  public activeMission: Mission | null = null;
  public missionTimer: number = 0;
  public isCompleted: boolean = false;
  public isFailed: boolean = false;
  public dialogueIndex: number = 0;
  public currentDialogue: string = '';
  public waypointMesh: THREE.Group | null = null;
  private onRewardCallback?: (cash: number, rep: number) => void;

  constructor(scene: THREE.Scene) {
    this.scene = scene;
    this.createWaypointMesh();
  }

  public setRewardCallback(cb: (cash: number, rep: number) => void) {
    this.onRewardCallback = cb;
  }

  private createWaypointMesh() {
    this.waypointMesh = new THREE.Group();
    // Glowing golden cylinder beam
    const beamGeo = new THREE.CylinderGeometry(2.5, 2.5, 20, 16, 1, true);
    const beamMat = new THREE.MeshBasicMaterial({
      color: 0xFACC15,
      transparent: true,
      opacity: 0.45,
      side: THREE.DoubleSide
    });
    const beam = new THREE.Mesh(beamGeo, beamMat);
    beam.position.y = 10;
    this.waypointMesh.add(beam);

    // Pulsing ground marker ring
    const ringGeo = new THREE.RingGeometry(2.2, 2.8, 24);
    ringGeo.rotateX(-Math.PI / 2);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0xEF4444, side: THREE.DoubleSide });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.position.y = 0.1;
    this.waypointMesh.add(ring);

    this.waypointMesh.visible = false;
    this.scene.add(this.waypointMesh);
  }

  public startMission(missionId: string): boolean {
    const found = MISSIONS.find(m => m.id === missionId);
    if (!found) return false;

    this.activeMission = found;
    this.missionTimer = found.timeLimitSec || 120;
    this.isCompleted = false;
    this.isFailed = false;
    this.dialogueIndex = 0;
    this.currentDialogue = found.dialogue[0] || '';

    // Position waypoint marker
    if (this.waypointMesh) {
      this.waypointMesh.position.set(found.targetPos.x, 0, found.targetPos.z);
      this.waypointMesh.visible = true;
    }

    soundEngine.playMissionSuccess();
    return true;
  }

  public update(dt: number, playerPos: THREE.Vector3) {
    if (!this.activeMission || this.isCompleted || this.isFailed) return;

    // Countdown timer
    if (this.activeMission.timeLimitSec) {
      this.missionTimer -= dt;
      if (this.missionTimer <= 0) {
        this.failMission('Time expired before reaching destination!');
        return;
      }
    }

    // Spin waypoint marker
    if (this.waypointMesh && this.waypointMesh.visible) {
      this.waypointMesh.rotation.y += dt * 1.5;
    }

    // Check if player reached waypoint target
    const target = this.activeMission.targetPos;
    const distToTarget = new THREE.Vector2(playerPos.x - target.x, playerPos.z - target.z).length();

    if (distToTarget < 5.0) {
      this.completeMission();
    }
  }

  public advanceDialogue() {
    if (!this.activeMission) return;
    this.dialogueIndex++;
    if (this.dialogueIndex < this.activeMission.dialogue.length) {
      this.currentDialogue = this.activeMission.dialogue[this.dialogueIndex];
    } else {
      this.currentDialogue = '';
    }
  }

  public completeMission() {
    if (!this.activeMission) return;
    this.isCompleted = true;
    if (this.waypointMesh) this.waypointMesh.visible = false;

    soundEngine.playMissionSuccess();
    if (this.onRewardCallback) {
      this.onRewardCallback(this.activeMission.rewardCash, this.activeMission.rewardRep);
    }
  }

  public failMission(reason: string) {
    this.isFailed = true;
    this.currentDialogue = `Mission Failed: ${reason}`;
    if (this.waypointMesh) this.waypointMesh.visible = false;
    soundEngine.playExplosion();
  }

  public cancelMission() {
    this.activeMission = null;
    this.isCompleted = false;
    this.isFailed = false;
    if (this.waypointMesh) this.waypointMesh.visible = false;
  }
}
