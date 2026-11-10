/**
 * Procedural Web Audio Sound Engine for GTA Karnataka
 * Zero external audio files: synthesizes engines, 2-stroke auto-rickshaws,
 * Royal Enfield Bullet thumps, horns, police sirens, festival Dollu Kunitha drums,
 * radio station tracks, and combat effects.
 */

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private masterGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private radioGain: GainNode | null = null;

  // Active continuous sources
  private engineOsc: OscillatorNode | null = null;
  private engineNoise: AudioBufferSourceNode | null = null;
  private engineGain: GainNode | null = null;
  private currentVehicleType: string = 'none';

  private sirenOsc: OscillatorNode | null = null;
  private sirenGain: GainNode | null = null;
  private sirenInterval: number | null = null;

  // Procedural Radio System
  private radioInterval: number | null = null;
  private currentStationIndex: number = 0;
  private isRadioPlaying: boolean = false;

  public stations = [
    { name: 'Radio City Namma 91.1 (Kannada Hits)', genre: 'sandalwood' },
    { name: 'Majestic Beats & Rap FM', genre: 'hiphop' },
    { name: 'Carnatic Rock & Bengaluru Indie', genre: 'rock' },
    { name: 'Dollu Kunitha Folk & Festival FM', genre: 'folk' },
    { name: 'Off', genre: 'off' }
  ];

  constructor() {
    // Initialized on first user interaction
  }

  public init() {
    if (this.ctx) return;
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    this.ctx = new AudioCtx();

    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(0.7, this.ctx.currentTime);
    this.masterGain.connect(this.ctx.destination);

    this.sfxGain = this.ctx.createGain();
    this.sfxGain.gain.setValueAtTime(0.8, this.ctx.currentTime);
    this.sfxGain.connect(this.masterGain);

    this.radioGain = this.ctx.createGain();
    this.radioGain.gain.setValueAtTime(0.5, this.ctx.currentTime);
    this.radioGain.connect(this.masterGain);

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 0.7, this.ctx.currentTime);
    }
    return this.isMuted;
  }

  public getIsMuted() {
    return this.isMuted;
  }

  // --- HORN SOUNDS ("Pom-Pom!", "Beep-Beep!") ---
  public playHorn(type: 'auto' | 'bus' | 'car' | 'bike' = 'auto') {
    if (!this.ctx || this.isMuted || !this.sfxGain) return;
    const now = this.ctx.currentTime;

    if (type === 'auto') {
      // High-pitched double beep "peep-peep"
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc1.type = 'sawtooth';
      osc2.type = 'square';
      osc1.frequency.setValueAtTime(540, now);
      osc2.frequency.setValueAtTime(820, now);

      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(this.sfxGain);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.25);
      osc2.stop(now + 0.25);
    } else if (type === 'bus') {
      // Deep pneumatic BMTC air-horn
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc1.type = 'sawtooth';
      osc2.type = 'sawtooth';
      osc1.frequency.setValueAtTime(220, now);
      osc2.frequency.setValueAtTime(277, now);

      gain.gain.setValueAtTime(0.4, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.6);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(this.sfxGain);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.6);
      osc2.stop(now + 0.6);
    } else {
      // Car / Enfield beep
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(type === 'bike' ? 440 : 380, now);
      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start(now);
      osc.stop(now + 0.3);
    }
  }

  // --- VEHICLE ENGINE SOUND LOOP ---
  public startVehicleEngine(type: 'auto' | 'bus' | 'car' | 'bike') {
    if (!this.ctx || !this.sfxGain) return;
    this.stopVehicleEngine();
    this.currentVehicleType = type;

    const now = this.ctx.currentTime;
    this.engineGain = this.ctx.createGain();
    this.engineGain.gain.setValueAtTime(0.15, now);
    this.engineGain.connect(this.sfxGain);

    this.engineOsc = this.ctx.createOscillator();

    if (type === 'auto') {
      // 2-stroke tuk-tuk sputter: sawtooth with rapid vibrato
      this.engineOsc.type = 'sawtooth';
      this.engineOsc.frequency.setValueAtTime(55, now);
    } else if (type === 'bike') {
      // Bullet thump: pulse-like square wave
      this.engineOsc.type = 'triangle';
      this.engineOsc.frequency.setValueAtTime(45, now);
    } else if (type === 'bus') {
      // Deep diesel rumble
      this.engineOsc.type = 'sawtooth';
      this.engineOsc.frequency.setValueAtTime(35, now);
    } else {
      // High-performance car
      this.engineOsc.type = 'sawtooth';
      this.engineOsc.frequency.setValueAtTime(70, now);
    }

    this.engineOsc.connect(this.engineGain);
    this.engineOsc.start(now);
  }

  public updateVehicleEngine(speedRatio: number, isAccelerating: boolean) {
    if (!this.ctx || !this.engineOsc || !this.engineGain) return;
    const now = this.ctx.currentTime;
    const baseFreq = this.currentVehicleType === 'auto' ? 55 :
      this.currentVehicleType === 'bike' ? 45 :
      this.currentVehicleType === 'bus' ? 35 : 70;

    const targetFreq = baseFreq + speedRatio * (this.currentVehicleType === 'auto' ? 140 : 180) + (isAccelerating ? 25 : 0);
    this.engineOsc.frequency.setTargetAtTime(targetFreq, now, 0.1);

    const targetVolume = 0.12 + speedRatio * 0.18 + (isAccelerating ? 0.08 : 0);
    this.engineGain.gain.setTargetAtTime(targetVolume, now, 0.1);
  }

  public stopVehicleEngine() {
    if (this.engineOsc) {
      try { this.engineOsc.stop(); } catch { /* ignore */ }
      this.engineOsc.disconnect();
      this.engineOsc = null;
    }
    if (this.engineNoise) {
      try { this.engineNoise.stop(); } catch { /* ignore */ }
      this.engineNoise.disconnect();
      this.engineNoise = null;
    }
    if (this.engineGain) {
      this.engineGain.disconnect();
      this.engineGain = null;
    }
    this.currentVehicleType = 'none';
  }

  // --- POLICE SIRENS (Karnataka Hoysala Police) ---
  public setSiren(active: boolean) {
    if (!this.ctx || !this.sfxGain) return;

    if (!active) {
      if (this.sirenOsc) {
        try { this.sirenOsc.stop(); } catch { /* ignore */ }
        this.sirenOsc.disconnect();
        this.sirenOsc = null;
      }
      if (this.sirenGain) {
        this.sirenGain.disconnect();
        this.sirenGain = null;
      }
      if (this.sirenInterval) {
        clearInterval(this.sirenInterval);
        this.sirenInterval = null;
      }
      return;
    }

    if (this.sirenOsc) return; // already active

    const now = this.ctx.currentTime;
    this.sirenOsc = this.ctx.createOscillator();
    this.sirenGain = this.ctx.createGain();
    this.sirenOsc.type = 'sawtooth';
    this.sirenOsc.frequency.setValueAtTime(650, now);

    this.sirenGain.gain.setValueAtTime(0.2, now);
    this.sirenOsc.connect(this.sirenGain);
    this.sirenGain.connect(this.sfxGain);
    this.sirenOsc.start(now);

    let high = false;
    this.sirenInterval = window.setInterval(() => {
      if (!this.ctx || !this.sirenOsc) return;
      const t = this.ctx.currentTime;
      high = !high;
      this.sirenOsc.frequency.linearRampToValueAtTime(high ? 920 : 620, t + 0.35);
    }, 400);
  }

  // --- COMBAT & INTERACTION SFX ---
  public playPunch() {
    if (!this.ctx || this.isMuted || !this.sfxGain) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(140, now);
    osc.frequency.exponentialRampToValueAtTime(30, now + 0.15);

    gain.gain.setValueAtTime(0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);

    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(now);
    osc.stop(now + 0.15);
  }

  public playCricketBatHit() {
    if (!this.ctx || this.isMuted || !this.sfxGain) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(350, now);
    osc.frequency.exponentialRampToValueAtTime(80, now + 0.2);

    gain.gain.setValueAtTime(0.5, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);

    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(now);
    osc.stop(now + 0.2);
  }

  public playCoconutSlingshot() {
    if (!this.ctx || this.isMuted || !this.sfxGain) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(200, now);
    osc.frequency.exponentialRampToValueAtTime(600, now + 0.08);

    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);

    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(now);
    osc.stop(now + 0.12);
  }

  public playExplosion() {
    if (!this.ctx || this.isMuted || !this.sfxGain) return;
    const now = this.ctx.currentTime;

    // Sub rumble
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(90, now);
    osc.frequency.exponentialRampToValueAtTime(15, now + 0.8);

    gain.gain.setValueAtTime(0.6, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.8);

    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(now);
    osc.stop(now + 0.8);
  }

  public playCashEarned() {
    if (!this.ctx || this.isMuted || !this.sfxGain) return;
    const now = this.ctx.currentTime;

    const notes = [587, 880, 1174]; // D5, A5, D6
    notes.forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.08);

      gain.gain.setValueAtTime(0.25, now + idx * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.01, now + idx * 0.08 + 0.2);

      osc.connect(gain);
      gain.connect(this.sfxGain!);
      osc.start(now + idx * 0.08);
      osc.stop(now + idx * 0.08 + 0.2);
    });
  }

  public playMissionSuccess() {
    if (!this.ctx || this.isMuted || !this.sfxGain) return;
    const now = this.ctx.currentTime;
    const chords = [523, 659, 783, 1046]; // C-E-G-C celebratory fanfare
    chords.forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.12);

      gain.gain.setValueAtTime(0.3, now + idx * 0.12);
      gain.gain.exponentialRampToValueAtTime(0.01, now + idx * 0.12 + 0.6);

      osc.connect(gain);
      gain.connect(this.sfxGain!);
      osc.start(now + idx * 0.12);
      osc.stop(now + idx * 0.12 + 0.6);
    });
  }

  // --- FESTIVAL DRUMS (DOLLU KUNITHA / CHENDA MELAM) ---
  public playDolluDrum(isBigDhol: boolean = false) {
    if (!this.ctx || this.isMuted || !this.sfxGain) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    const startFreq = isBigDhol ? 110 : 210;
    osc.frequency.setValueAtTime(startFreq, now);
    osc.frequency.exponentialRampToValueAtTime(35, now + (isBigDhol ? 0.35 : 0.2));

    gain.gain.setValueAtTime(isBigDhol ? 0.45 : 0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + (isBigDhol ? 0.35 : 0.2));

    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(now);
    osc.stop(now + (isBigDhol ? 0.35 : 0.2));
  }

  // --- PROCEDURAL RADIO SYSTEM ---
  public cycleRadioStation(): string {
    this.currentStationIndex = (this.currentStationIndex + 1) % this.stations.length;
    this.playCurrentStation();
    return this.stations[this.currentStationIndex].name;
  }

  public setStation(index: number) {
    this.currentStationIndex = Math.max(0, Math.min(index, this.stations.length - 1));
    this.playCurrentStation();
  }

  public getCurrentStation() {
    return this.stations[this.currentStationIndex];
  }

  private playCurrentStation() {
    if (this.radioInterval) {
      clearInterval(this.radioInterval);
      this.radioInterval = null;
    }
    const station = this.stations[this.currentStationIndex];
    if (station.genre === 'off' || !this.ctx || this.isMuted || !this.radioGain) {
      this.isRadioPlaying = false;
      return;
    }

    this.isRadioPlaying = true;
    let step = 0;

    // Procedural beat/melody loop according to genre
    this.radioInterval = window.setInterval(() => {
      if (!this.ctx || this.isMuted || !this.radioGain) return;
      const now = this.ctx.currentTime;
      step = (step + 1) % 16;

      if (station.genre === 'sandalwood') {
        // Upbeat raga pentatonic sequence + rhythm
        const scale = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25];
        if (step % 2 === 0) {
          const note = scale[(step * 3) % scale.length];
          const osc = this.ctx.createOscillator();
          const g = this.ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(note, now);
          g.gain.setValueAtTime(0.12, now);
          g.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
          osc.connect(g);
          g.connect(this.radioGain);
          osc.start(now);
          osc.stop(now + 0.18);
        }
        // Bass kick on 0, 4, 8, 12
        if (step % 4 === 0) {
          const b = this.ctx.createOscillator();
          const bg = this.ctx.createGain();
          b.frequency.setValueAtTime(100, now);
          b.frequency.exponentialRampToValueAtTime(35, now + 0.15);
          bg.gain.setValueAtTime(0.2, now);
          bg.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
          b.connect(bg);
          bg.connect(this.radioGain);
          b.start(now);
          b.stop(now + 0.15);
        }
      } else if (station.genre === 'folk') {
        // Dollu drum folk dance pattern (3/4 or 6/8 folk rhythm)
        if (step % 3 === 0) {
          this.playDolluDrum(step === 0 || step === 6);
        }
      } else if (station.genre === 'hiphop') {
        // Majestic Hip Hop: Heavy sub bass + hi-hats
        if (step % 4 === 0) {
          const b = this.ctx.createOscillator();
          const bg = this.ctx.createGain();
          b.type = 'sawtooth';
          b.frequency.setValueAtTime(60, now);
          b.frequency.exponentialRampToValueAtTime(25, now + 0.25);
          bg.gain.setValueAtTime(0.25, now);
          bg.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
          b.connect(bg);
          bg.connect(this.radioGain);
          b.start(now);
          b.stop(now + 0.25);
        }
      } else if (station.genre === 'rock') {
        // Carnatic Rock riff
        const riff = [196, 220, 246, 293, 329];
        const osc = this.ctx.createOscillator();
        const g = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(riff[step % riff.length], now);
        g.gain.setValueAtTime(0.1, now);
        g.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
        osc.connect(g);
        g.connect(this.radioGain);
        osc.start(now);
        osc.stop(now + 0.12);
      }
    }, 180);
  }
}

export const soundEngine = new SoundEngine();
