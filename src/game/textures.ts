/**
 * Procedural Canvas Textures for GTA Karnataka: Namma Bengaluru
 * Zero external assets: builds road markings, Vidhana Soudha stone carvings,
 * Kannada Rajyotsava banners, vehicle liveries, and festival patterns.
 */

import * as THREE from 'three';

class TextureGenerator {
  private cache: Map<string, THREE.CanvasTexture> = new Map();

  // Helper to make canvas
  private createCanvas(w: number, h: number): [HTMLCanvasElement, CanvasRenderingContext2D] {
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d')!;
    return [canvas, ctx];
  }

  // --- ROAD TEXTURE WITH ASPHALT & YELLOW DASHES ---
  public getRoadTexture(): THREE.CanvasTexture {
    if (this.cache.has('road')) return this.cache.get('road')!;

    const [canvas, ctx] = this.createCanvas(512, 512);

    // Asphalt base with noise
    ctx.fillStyle = '#22252A';
    ctx.fillRect(0, 0, 512, 512);

    // Subtle grain
    for (let i = 0; i < 4000; i++) {
      const x = Math.random() * 512;
      const y = Math.random() * 512;
      const gray = Math.floor(25 + Math.random() * 30);
      ctx.fillStyle = `rgb(${gray},${gray},${gray})`;
      ctx.fillRect(x, y, 2, 2);
    }

    // White edge borders
    ctx.fillStyle = '#F3F4F6';
    ctx.fillRect(8, 0, 12, 512);
    ctx.fillRect(492, 0, 12, 512);

    // Yellow double center line (classic Bangalore arterial road)
    ctx.fillStyle = '#EAB308';
    ctx.fillRect(248, 0, 6, 512);
    ctx.fillRect(258, 0, 6, 512);

    // Pothole patch
    ctx.fillStyle = '#17191C';
    ctx.beginPath();
    ctx.ellipse(360, 200, 35, 20, 0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#374151';
    ctx.lineWidth = 3;
    ctx.stroke();

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.colorSpace = THREE.SRGBColorSpace;
    this.cache.set('road', texture);
    return texture;
  }

  // --- INTERSECTION ZEBRA CROSSING ---
  public getIntersectionTexture(): THREE.CanvasTexture {
    if (this.cache.has('intersection')) return this.cache.get('intersection')!;

    const [canvas, ctx] = this.createCanvas(512, 512);
    ctx.fillStyle = '#22252A';
    ctx.fillRect(0, 0, 512, 512);

    // Zebra crossing bars
    ctx.fillStyle = '#F9FAFB';
    for (let i = 40; i < 480; i += 45) {
      ctx.fillRect(i, 20, 25, 70);
      ctx.fillRect(i, 420, 25, 70);
      ctx.fillRect(20, i, 70, 25);
      ctx.fillRect(420, i, 70, 25);
    }

    // Manhole cover
    ctx.fillStyle = '#4B5563';
    ctx.beginPath();
    ctx.arc(256, 256, 30, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#1F2937';
    ctx.lineWidth = 4;
    ctx.stroke();

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    this.cache.set('intersection', texture);
    return texture;
  }

  // --- VIDHANA SOUDHA GRANITE & INSCRIPTION BANNER ---
  public getVidhanaStoneTexture(): THREE.CanvasTexture {
    if (this.cache.has('vidhana_stone')) return this.cache.get('vidhana_stone')!;

    const [canvas, ctx] = this.createCanvas(512, 512);
    // Bangalore grey granite with stone blocks
    ctx.fillStyle = '#C8C9CE';
    ctx.fillRect(0, 0, 512, 512);

    // Granite speckles
    for (let i = 0; i < 6000; i++) {
      const x = Math.random() * 512;
      const y = Math.random() * 512;
      const v = Math.random() > 0.5 ? 240 : 80;
      ctx.fillStyle = `rgba(${v},${v},${v}, 0.25)`;
      ctx.fillRect(x, y, 2, 2);
    }

    // Block mortar lines
    ctx.strokeStyle = '#8E919D';
    ctx.lineWidth = 2;
    for (let y = 0; y < 512; y += 64) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(512, y);
      ctx.stroke();
    }
    for (let y = 0; y < 512; y += 64) {
      const offset = (y / 64) % 2 === 0 ? 0 : 64;
      for (let x = offset; x < 512; x += 128) {
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x, y + 64);
        ctx.stroke();
      }
    }

    // Grand Arch Inscription at center
    ctx.fillStyle = '#78350F';
    ctx.font = 'bold 24px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('ಸರ್ಕಾರದ ಕೆಲಸ ದೇವರ ಕೆಲಸ', 256, 230);
    ctx.font = '16px sans-serif';
    ctx.fillText('GOVERNMENT WORK IS GOD\'S WORK', 256, 260);

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    this.cache.set('vidhana_stone', texture);
    return texture;
  }

  // --- KANNADA RAJYOTSAVA FLAG (Yellow & Red) ---
  public getKarnatakaFlagTexture(): THREE.CanvasTexture {
    if (this.cache.has('flag_karnataka')) return this.cache.get('flag_karnataka')!;

    const [canvas, ctx] = this.createCanvas(256, 160);
    // Top half vibrant yellow
    ctx.fillStyle = '#FACC15';
    ctx.fillRect(0, 0, 256, 80);
    // Bottom half deep red
    ctx.fillStyle = '#DC2626';
    ctx.fillRect(0, 80, 256, 80);

    // Subtle emblem outline
    ctx.strokeStyle = 'rgba(0,0,0,0.2)';
    ctx.lineWidth = 3;
    ctx.strokeRect(0, 0, 256, 160);

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    this.cache.set('flag_karnataka', texture);
    return texture;
  }

  // --- AUTO RICKSHAW DECALS (Front / Back / Meter) ---
  public getAutoDecalTexture(): THREE.CanvasTexture {
    if (this.cache.has('auto_decal')) return this.cache.get('auto_decal')!;

    const [canvas, ctx] = this.createCanvas(256, 256);
    ctx.fillStyle = '#15803D'; // Green body
    ctx.fillRect(0, 0, 256, 256);

    // Yellow stripe
    ctx.fillStyle = '#FACC15';
    ctx.fillRect(0, 30, 256, 50);

    // Kannada tagline & Auto Raja branding
    ctx.fillStyle = '#78350F';
    ctx.font = 'bold 22px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('ನಮ್ಮ ಬೆಂಗಳೂರು', 128, 65);

    // Digital Fare Meter box
    ctx.fillStyle = '#0F172A';
    ctx.fillRect(20, 110, 110, 60);
    ctx.strokeStyle = '#64748B';
    ctx.lineWidth = 3;
    ctx.strokeRect(20, 110, 110, 60);

    // LED numbers on meter
    ctx.fillStyle = '#22C55E';
    ctx.font = 'bold 20px monospace';
    ctx.fillText('₹ 30.00', 75, 148);

    // License Plate "KA 01 F 1956" (Bangalore Central)
    ctx.fillStyle = '#FEF08A';
    ctx.fillRect(145, 120, 95, 45);
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.strokeRect(145, 120, 95, 45);
    ctx.fillStyle = '#000';
    ctx.font = 'bold 12px sans-serif';
    ctx.fillText('KA 01', 192, 138);
    ctx.fillText('F 1956', 192, 155);

    // Dr. Rajkumar fan club silhouette quote
    ctx.fillStyle = '#F8FAFC';
    ctx.font = 'italic 13px sans-serif';
    ctx.fillText('ಅಣ್ಣಾವ್ರ ಅಭಿಮಾನಿ (Annavru)', 128, 220);

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    this.cache.set('auto_decal', texture);
    return texture;
  }

  // --- BMTC BUS LIVERY ---
  public getBmtcTexture(): THREE.CanvasTexture {
    if (this.cache.has('bmtc_livery')) return this.cache.get('bmtc_livery')!;

    const [canvas, ctx] = this.createCanvas(512, 128);
    // White top half, BMTC royal blue bottom
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, 512, 64);
    ctx.fillStyle = '#0284C7';
    ctx.fillRect(0, 64, 512, 64);

    // Green stripe divider
    ctx.fillStyle = '#16A34A';
    ctx.fillRect(0, 60, 512, 6);

    // Route sign LED display (Majestic - ITPL Silk Board)
    ctx.fillStyle = '#020617';
    ctx.fillRect(30, 15, 200, 36);
    ctx.fillStyle = '#F59E0B'; // Amber LED
    ctx.font = 'bold 14px monospace';
    ctx.textAlign = 'left';
    ctx.fillText('335-E: MAJESTIC ⇄ ITPL', 40, 38);

    // BMTC official logo text
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 20px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('BMTC - ಬೆಂಗಳೂರು ಮಹಾನಗರ ಸಾರಿಗೆ', 360, 105);

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    this.cache.set('bmtc_livery', texture);
    return texture;
  }

  // --- POLICE HOYSALA LIVERY ---
  public getPoliceTexture(): THREE.CanvasTexture {
    if (this.cache.has('police_livery')) return this.cache.get('police_livery')!;

    const [canvas, ctx] = this.createCanvas(256, 128);
    ctx.fillStyle = '#F8FAFC';
    ctx.fillRect(0, 0, 256, 128);

    // Blue & Red diagonal emergency chevrons
    ctx.fillStyle = '#1D4ED8';
    ctx.fillRect(0, 60, 256, 30);
    ctx.fillStyle = '#DC2626';
    ctx.fillRect(0, 72, 256, 8);

    ctx.fillStyle = '#0F172A';
    ctx.font = 'bold 16px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('POLICE - ಹೊಯ್ಸಳ', 128, 40);
    ctx.font = 'bold 13px sans-serif';
    ctx.fillStyle = '#DC2626';
    ctx.fillText('EMERGENCY 112', 128, 110);

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    this.cache.set('police_livery', texture);
    return texture;
  }

  // --- FESTIVAL MARIGOLD & JASMINE GARLAND ---
  public getGarlandTexture(): THREE.CanvasTexture {
    if (this.cache.has('garland')) return this.cache.get('garland')!;

    const [canvas, ctx] = this.createCanvas(128, 128);
    ctx.fillStyle = 'rgba(0,0,0,0)';
    ctx.fillRect(0, 0, 128, 128);

    // Alternating orange and yellow flowers
    for (let i = 0; i < 4; i++) {
      const y = 20 + i * 28;
      // Orange Marigold
      ctx.fillStyle = '#EA580C';
      ctx.beginPath();
      ctx.arc(36, y, 14, 0, Math.PI * 2);
      ctx.fill();

      // Yellow Marigold
      ctx.fillStyle = '#FACC15';
      ctx.beginPath();
      ctx.arc(68, y, 14, 0, Math.PI * 2);
      ctx.fill();

      // White Jasmine bunch
      ctx.fillStyle = '#F8FAFC';
      ctx.beginPath();
      ctx.arc(98, y, 10, 0, Math.PI * 2);
      ctx.fill();
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    this.cache.set('garland', texture);
    return texture;
  }

  // --- BANGALORE PALACE TUDOR BRICK & TIMBER ---
  public getPalaceBrickTexture(): THREE.CanvasTexture {
    if (this.cache.has('palace_brick')) return this.cache.get('palace_brick')!;

    const [canvas, ctx] = this.createCanvas(256, 256);
    // Weathered ochre / earthy stone
    ctx.fillStyle = '#A16207';
    ctx.fillRect(0, 0, 256, 256);

    ctx.strokeStyle = '#713F12';
    ctx.lineWidth = 3;
    for (let y = 0; y < 256; y += 32) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(256, y);
      ctx.stroke();

      const offset = (y / 32) % 2 === 0 ? 0 : 32;
      for (let x = offset; x < 256; x += 64) {
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x, y + 32);
        ctx.stroke();
      }
    }

    // Tudor dark timber beams
    ctx.fillStyle = '#451A03';
    ctx.fillRect(116, 0, 24, 256);

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    this.cache.set('palace_brick', texture);
    return texture;
  }
}

export const textureGen = new TextureGenerator();
